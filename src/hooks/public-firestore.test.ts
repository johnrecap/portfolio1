import assert from 'node:assert/strict';
import test from 'node:test';

import { PUBLIC_FIRESTORE_READ_OPTIONS } from './public-firestore';

test('PUBLIC_FIRESTORE_READ_OPTIONS suppresses permission-denied errors for public reads', () => {
  assert.equal(PUBLIC_FIRESTORE_READ_OPTIONS.suppressPermissionDenied, true);
});
