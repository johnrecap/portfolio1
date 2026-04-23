import assert from 'node:assert/strict';
import test from 'node:test';

import { OperationType } from '@/lib/firebase';
import {
  buildFirestoreErrorInfo,
  cleanupFirestoreSubscription,
  shouldSuppressCollectionError,
  shouldSuppressDocumentError,
  shouldSuppressFirestoreCleanupError,
} from './useFirestore';

test('shouldSuppressDocumentError suppresses permission-denied reads when explicitly requested', () => {
  const result = shouldSuppressDocumentError(
    { code: 'permission-denied' },
    {
      suppressPermissionDenied: true,
    },
  );

  assert.equal(result, true);
});

test('shouldSuppressDocumentError does not suppress other Firestore errors', () => {
  const result = shouldSuppressDocumentError(
    { code: 'unavailable' },
    {
      suppressPermissionDenied: true,
    },
  );

  assert.equal(result, false);
});

test('shouldSuppressDocumentError does not suppress permission-denied without opt-in', () => {
  const result = shouldSuppressDocumentError({ code: 'permission-denied' });

  assert.equal(result, false);
});

test('shouldSuppressCollectionError suppresses permission-denied reads when explicitly requested', () => {
  const result = shouldSuppressCollectionError(
    { code: 'permission-denied' },
    {
      suppressPermissionDenied: true,
    },
  );

  assert.equal(result, true);
});

test('shouldSuppressCollectionError does not suppress other Firestore errors', () => {
  const result = shouldSuppressCollectionError(
    { code: 'unavailable' },
    {
      suppressPermissionDenied: true,
    },
  );

  assert.equal(result, false);
});

test('shouldSuppressCollectionError does not suppress permission-denied without opt-in', () => {
  const result = shouldSuppressCollectionError({ code: 'permission-denied' });

  assert.equal(result, false);
});

test('buildFirestoreErrorInfo preserves firestore code and path for downstream error handling', () => {
  const result = buildFirestoreErrorInfo(
    {
      code: 'permission-denied',
      message: 'Missing or insufficient permissions.',
    },
    OperationType.LIST,
    'mediaAssets',
  );

  assert.equal(result.code, 'permission-denied');
  assert.equal(result.error, 'Missing or insufficient permissions.');
  assert.equal(result.operationType, 'list');
  assert.equal(result.path, 'mediaAssets');
});

test('shouldSuppressFirestoreCleanupError detects Firestore internal assertion failures from listener teardown', () => {
  const result = shouldSuppressFirestoreCleanupError(
    new Error('FIRESTORE (12.12.0) INTERNAL ASSERTION FAILED: Unexpected state (ID: b815)'),
  );

  assert.equal(result, true);
});

test('cleanupFirestoreSubscription swallows Firestore internal assertion errors from unsubscribe', () => {
  let attempts = 0;

  assert.doesNotThrow(() => {
    cleanupFirestoreSubscription(
      () => {
        attempts += 1;
        throw new Error('FIRESTORE (12.12.0) INTERNAL ASSERTION FAILED: Unexpected state (ID: b815)');
      },
      OperationType.LIST,
      'projects',
    );
  });

  assert.equal(attempts, 1);
});

test('cleanupFirestoreSubscription rethrows non-Firestore cleanup errors', () => {
  assert.throws(
    () => {
      cleanupFirestoreSubscription(
        () => {
          throw new Error('boom');
        },
        OperationType.LIST,
        'projects',
      );
    },
    /boom/,
  );
});
