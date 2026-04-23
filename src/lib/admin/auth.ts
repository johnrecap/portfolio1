export const SUPER_ADMIN_EMAIL = 'mohamedsaied.m20@gmail.com';
export const SUPER_ADMIN_ROLE = 'super_admin';

export interface AdminAuthLikeUser {
  email?: string | null;
  emailVerified?: boolean | null;
}

export function isSuperAdminEmail(email?: string | null) {
  return typeof email === 'string' && email.trim().toLowerCase() === SUPER_ADMIN_EMAIL;
}

export function isSuperAdminUser(user?: AdminAuthLikeUser | null) {
  return Boolean(user && user.emailVerified === true && isSuperAdminEmail(user.email));
}

