export function readComposerText(
  content: Record<string, unknown>,
  key: string,
  fallback: string,
  isArabic: boolean,
): string {
  const localizedKey = `${key}Ar`;
  const localizedValue = content[localizedKey];
  const baseValue = content[key];

  if (isArabic && typeof localizedValue === 'string' && localizedValue.trim().length > 0) {
    return localizedValue.trim();
  }

  if (typeof baseValue === 'string' && baseValue.trim().length > 0) {
    return baseValue.trim();
  }

  return fallback;
}
