import { useState, useEffect } from 'react';
import { buildFirestoreErrorInfo, db, handleFirestoreError, type FirestoreErrorInfo, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, setDoc } from 'firebase/firestore';

export type UseFirestoreOptions = {
  suppressPermissionDenied?: boolean;
  orderByCreatedAt?: boolean;
};

const reportedReadErrors = new Set<string>();
const reportedCleanupErrors = new Set<string>();

function reportFirestoreReadError(errorInfo: FirestoreErrorInfo) {
  const fingerprint = `${errorInfo.operationType}:${errorInfo.path ?? 'unknown'}:${errorInfo.code ?? errorInfo.error}`;

  if (reportedReadErrors.has(fingerprint)) {
    return;
  }

  reportedReadErrors.add(fingerprint);

  const payload = JSON.stringify(errorInfo);

  if (errorInfo.code === 'permission-denied') {
    return;
  }

  console.error('Firestore read error: ', payload);
}

export function shouldSuppressDocumentError(error: unknown, options?: UseFirestoreOptions) {
  return options?.suppressPermissionDenied === true && (error as { code?: string } | null)?.code === 'permission-denied';
}

export function shouldSuppressCollectionError(error: unknown, options?: UseFirestoreOptions) {
  return options?.suppressPermissionDenied === true && (error as { code?: string } | null)?.code === 'permission-denied';
}

export { buildFirestoreErrorInfo };

export function getTimestampSeconds(value: unknown) {
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    const seconds = (value as { seconds?: unknown }).seconds;
    return typeof seconds === 'number' ? seconds : 0;
  }

  return 0;
}

export function sortByCreatedAtDesc<T extends { createdAt?: unknown }>(items: T[]) {
  return [...items].sort((left, right) => getTimestampSeconds(right.createdAt) - getTimestampSeconds(left.createdAt));
}

export function shouldSuppressFirestoreCleanupError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: unknown }).message)
        : String(error);

  return message.includes('FIRESTORE') && message.includes('INTERNAL ASSERTION FAILED');
}

export function cleanupFirestoreSubscription(
  unsubscribe: () => void,
  operationType: OperationType,
  path: string,
) {
  try {
    unsubscribe();
  } catch (error) {
    if (!shouldSuppressFirestoreCleanupError(error)) {
      throw error;
    }

    const errorInfo = buildFirestoreErrorInfo(error, operationType, path);
    const fingerprint = `${operationType}:${path}:${errorInfo.error}`;

    if (reportedCleanupErrors.has(fingerprint)) {
      return;
    }

    reportedCleanupErrors.add(fingerprint);
    console.warn('Firestore cleanup error: ', JSON.stringify(errorInfo));
  }
}

export function useDocument<T>(path: string, docId: string, options?: UseFirestoreOptions) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreErrorInfo | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, path, docId), (snapshot) => {
      if (snapshot.exists()) {
        setData({ id: snapshot.id, ...snapshot.data() } as any);
      } else {
        setData(null);
      }
      setError(null);
      setLoading(false);
    }, (error) => {
      if (shouldSuppressDocumentError(error, options)) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }

      const errorInfo = buildFirestoreErrorInfo(error, OperationType.GET, `${path}/${docId}`);
      setData(null);
      setError(errorInfo);
      setLoading(false);
      reportFirestoreReadError(errorInfo);
    });

    return () => cleanupFirestoreSubscription(unsubscribe, OperationType.GET, `${path}/${docId}`);
  }, [path, docId, options?.suppressPermissionDenied]);

  const setDocument = async (docData: any, merge: boolean = true) => {
    try {
      await setDoc(doc(db, path, docId), docData, { merge });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${path}/${docId}`);
    }
  };

  return { data, loading, error, setDocument };
}

export function useCollection<T>(path: string, options?: UseFirestoreOptions) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreErrorInfo | null>(null);

  useEffect(() => {
    const shouldOrderByCreatedAt = options?.orderByCreatedAt === true;
    const collectionQuery = shouldOrderByCreatedAt
      ? query(collection(db, path), orderBy('createdAt', 'desc'))
      : query(collection(db, path));
    const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
      const result: any[] = [];
      snapshot.forEach(doc => {
        result.push({ id: doc.id, ...doc.data() });
      });
      setData(sortByCreatedAtDesc(result));
      setError(null);
      setLoading(false);
    }, (error) => {
      if (shouldSuppressCollectionError(error, options)) {
        setData([]);
        setError(null);
        setLoading(false);
        return;
      }

      const errorInfo = buildFirestoreErrorInfo(error, OperationType.LIST, path);
      setData([]);
      setError(errorInfo);
      setLoading(false);
      reportFirestoreReadError(errorInfo);
    });

    return () => cleanupFirestoreSubscription(unsubscribe, OperationType.LIST, path);
  }, [path, options?.suppressPermissionDenied, options?.orderByCreatedAt]);

  const addDocument = async (docData: any) => {
    try {
      await addDoc(collection(db, path), {
        ...docData,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updateDocument = async (id: string, docData: any) => {
    try {
      await updateDoc(doc(db, path, id), docData);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const removeDocument = async (id: string) => {
    try {
      await deleteDoc(doc(db, path, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  return { data, loading, error, addDocument, updateDocument, removeDocument };
}
