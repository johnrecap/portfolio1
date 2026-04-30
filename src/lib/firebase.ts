import firebaseConfig from '../config/firebase-client-config.json';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

let appPromise: Promise<FirebaseApp> | null = null;
let authPromise: Promise<Auth> | null = null;
let firestorePromise: Promise<Firestore> | null = null;
let cachedAuth: Auth | null = null;

export function getFirebaseApp() {
  appPromise ??= import('firebase/app').then(({ initializeApp }) => initializeApp(firebaseConfig));
  return appPromise;
}

export async function getAuthInstance() {
  if (!authPromise) {
    authPromise = Promise.all([getFirebaseApp(), import('firebase/auth')]).then(([app, { getAuth }]) => {
      cachedAuth = getAuth(app);
      return cachedAuth;
    });
  }

  return authPromise;
}

export async function getFirestoreInstance() {
  firestorePromise ??= Promise.all([getFirebaseApp(), import('firebase/firestore')]).then(([app, { getFirestore }]) =>
    getFirestore(app, (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId),
  );
  return firestorePromise;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  code?: string;
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo?: any[];
  };
}

export function buildFirestoreErrorInfo(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: unknown }).message)
        : String(error);

  const errInfo: FirestoreErrorInfo = {
    code: typeof error === 'object' && error !== null && 'code' in error ? String((error as { code?: unknown }).code) : undefined,
    error: errorMessage,
    authInfo: {
      userId: cachedAuth?.currentUser?.uid,
      email: cachedAuth?.currentUser?.email,
      emailVerified: cachedAuth?.currentUser?.emailVerified,
      isAnonymous: cachedAuth?.currentUser?.isAnonymous,
      tenantId: cachedAuth?.currentUser?.tenantId,
      providerInfo: cachedAuth?.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  return errInfo;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = buildFirestoreErrorInfo(error, operationType, path);
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
