import assert from 'node:assert/strict';
import test from 'node:test';

test('createPlatformSettingResolver reuses the same normalized object for the same raw value', async () => {
  const module = (await import('./platform-settings')) as Record<string, unknown>;
  const createPlatformSettingResolver = module.createPlatformSettingResolver as
    | (<T>(
        normalize: (value: Record<string, unknown>) => T,
        createDefault: () => T,
      ) => (value: Record<string, unknown> | null | undefined) => T)
    | undefined;

  assert.equal(typeof createPlatformSettingResolver, 'function');

  const raw = { siteName: 'Studio' };
  const resolver = createPlatformSettingResolver?.(
    (value) => ({ siteName: String(value.siteName ?? '') }),
    () => ({ siteName: 'Default' }),
  );

  assert.ok(resolver);
  const first = resolver?.(raw);
  const second = resolver?.(raw);

  assert.equal(first, second);
});

test('createPlatformSettingResolver reuses the same default object while no document exists', async () => {
  const module = (await import('./platform-settings')) as Record<string, unknown>;
  const createPlatformSettingResolver = module.createPlatformSettingResolver as
    | (<T>(
        normalize: (value: Record<string, unknown>) => T,
        createDefault: () => T,
      ) => (value: Record<string, unknown> | null | undefined) => T)
    | undefined;

  assert.equal(typeof createPlatformSettingResolver, 'function');

  let createDefaultCalls = 0;
  const resolver = createPlatformSettingResolver?.(
    (value) => ({ siteName: String(value.siteName ?? '') }),
    () => {
      createDefaultCalls++;
      return { siteName: 'Default' };
    },
  );

  assert.ok(resolver);
  const first = resolver?.(undefined);
  const second = resolver?.(undefined);

  assert.equal(first, second);
  assert.equal(createDefaultCalls, 1);
});
