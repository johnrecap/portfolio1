import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, setDoc } from 'firebase/firestore';

export function useDocument<T>(path: string, docId: string) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, path, docId), (snapshot) => {
      if (snapshot.exists()) {
        setData({ id: snapshot.id, ...snapshot.data() } as any);
      } else {
        setData(null);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `${path}/${docId}`);
    });

    return () => unsubscribe();
  }, [path, docId]);

  const setDocument = async (docData: any, merge: boolean = true) => {
    try {
      await setDoc(doc(db, path, docId), docData, { merge });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${path}/${docId}`);
    }
  };

  return { data, loading, setDocument };
}

export function useCollection<T>(path: string) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result: any[] = [];
      snapshot.forEach(doc => {
        result.push({ id: doc.id, ...doc.data() });
      });
      setData(result);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [path]);

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

  return { data, loading, addDocument, updateDocument, removeDocument };
}
