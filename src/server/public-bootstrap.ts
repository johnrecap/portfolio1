import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
} from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

import {
  createEmptyPublicBootstrapPacket,
  PUBLIC_BOOTSTRAP_COLLECTIONS,
  PUBLIC_BOOTSTRAP_DOCUMENTS,
  type PublicBootstrapCollectionItem,
  type PublicBootstrapDocument,
  type PublicBootstrapPacket,
} from '../lib/public-bootstrap.js';

const BOOTSTRAP_TIMEOUT_MS = 2500;

let reportedBootstrapWarning = false;

function warnOnce(message: string, error?: unknown) {
  if (reportedBootstrapWarning) {
    return;
  }

  reportedBootstrapWarning = true;
  console.warn(message, error instanceof Error ? error.message : error ?? '');
}

function readPrivateKey(rawValue: string | undefined) {
  return rawValue?.replace(/\\n/g, '\n');
}

function hasCertificateEnv() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

function initializeBootstrapApp() {
  const appName = 'public-bootstrap';
  const existingApp = getApps().find((candidate) => candidate.name === appName);

  if (existingApp) {
    return existingApp;
  }

  if (hasCertificateEnv()) {
    return initializeApp(
      {
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: readPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
        }),
      },
      appName,
    );
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({ credential: applicationDefault() }, appName);
  }

  warnOnce('Public bootstrap server data disabled: Firebase Admin credentials are missing.');
  return null;
}

function getBootstrapFirestore(app: App) {
  const databaseId = process.env.FIREBASE_DATABASE_ID || process.env.FIRESTORE_DATABASE_ID;
  return databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T) {
  return new Promise<T>((resolve) => {
    const timeout = globalThis.setTimeout(() => resolve(fallback), timeoutMs);

    promise
      .then((value) => resolve(value))
      .catch((error) => {
        warnOnce('Public bootstrap fetch failed.', error);
        resolve(fallback);
      })
      .finally(() => globalThis.clearTimeout(timeout));
  });
}

function serializeFirestoreValue(value: unknown): unknown {
  if (value instanceof Timestamp) {
    return {
      seconds: value.seconds,
      nanoseconds: value.nanoseconds,
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeFirestoreValue(item));
  }

  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeFirestoreValue(item)]),
    );
  }

  return value;
}

function serializeDocumentData(id: string, value: FirebaseFirestore.DocumentData) {
  return {
    id,
    ...(serializeFirestoreValue(value) as Record<string, unknown>),
  };
}

function getTimestampSeconds(value: unknown) {
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    const seconds = (value as { seconds?: unknown }).seconds;
    return typeof seconds === 'number' ? seconds : 0;
  }

  return 0;
}

function sortByCreatedAtDesc<T extends { id: string; createdAt?: unknown }>(items: T[]) {
  return [...items].sort((left, right) => getTimestampSeconds(right.createdAt) - getTimestampSeconds(left.createdAt));
}

async function buildPublicBootstrapPacketUnsafe(): Promise<PublicBootstrapPacket> {
  const app = initializeBootstrapApp();
  const packet = createEmptyPublicBootstrapPacket();

  if (!app) {
    return packet;
  }

  const database = getBootstrapFirestore(app);

  await Promise.all(
    PUBLIC_BOOTSTRAP_DOCUMENTS.map(async ([collectionPath, docId]) => {
      const snapshot = await database.collection(collectionPath).doc(docId).get();
      const key = `${collectionPath}/${docId}`;
      packet.documents[key] = snapshot.exists
        ? (serializeDocumentData(snapshot.id, snapshot.data() ?? {}) as PublicBootstrapDocument)
        : null;
    }),
  );

  await Promise.all(
    PUBLIC_BOOTSTRAP_COLLECTIONS.map(async (collectionPath) => {
      const snapshot = await database.collection(collectionPath).get();
      const records = snapshot.docs.map(
        (item) => serializeDocumentData(item.id, item.data()) as PublicBootstrapCollectionItem,
      );

      packet.collections[collectionPath] = sortByCreatedAtDesc(records);
    }),
  );

  return packet;
}

export function buildPublicBootstrapPacket() {
  return withTimeout(
    buildPublicBootstrapPacketUnsafe(),
    BOOTSTRAP_TIMEOUT_MS,
    createEmptyPublicBootstrapPacket(),
  );
}
