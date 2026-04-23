export function createPlatformSettingResolver<T>(
  normalize: (value: Record<string, unknown>) => T,
  createDefault: () => T,
) {
  const normalizedCache = new WeakMap<Record<string, unknown>, T>();
  let defaultValue: T | undefined;

  return (value: Record<string, unknown> | null | undefined): T => {
    if (!value) {
      if (defaultValue === undefined) {
        defaultValue = createDefault();
      }

      return defaultValue;
    }

    const cached = normalizedCache.get(value);
    if (cached !== undefined) {
      return cached;
    }

    const normalized = normalize(value);
    normalizedCache.set(value, normalized);
    return normalized;
  };
}
