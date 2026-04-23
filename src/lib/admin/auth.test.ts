import assert from 'node:assert/strict';
import test from 'node:test';

import { SUPER_ADMIN_EMAIL, isSuperAdminEmail, isSuperAdminUser } from './auth';

test('isSuperAdminEmail matches the configured super admin email only', () => {
  assert.equal(isSuperAdminEmail(SUPER_ADMIN_EMAIL), true);
  assert.equal(isSuperAdminEmail('other@example.com'), false);
  assert.equal(isSuperAdminEmail(undefined), false);
});

test('isSuperAdminUser requires the super admin email and verified email state', () => {
  assert.equal(
    isSuperAdminUser({
      email: SUPER_ADMIN_EMAIL,
      emailVerified: true,
    }),
    true,
  );

  assert.equal(
    isSuperAdminUser({
      email: SUPER_ADMIN_EMAIL,
      emailVerified: false,
    }),
    false,
  );

  assert.equal(
    isSuperAdminUser({
      email: 'viewer@example.com',
      emailVerified: true,
    }),
    false,
  );

  assert.equal(isSuperAdminUser(null), false);
});
