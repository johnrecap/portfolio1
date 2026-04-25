export const DEMO_SESSION_VERSION = 1;
export const DEMO_SESSION_META_KEY = "agency-flow-crm:session-meta";
export const DEMO_SESSION_IDLE_TIMEOUT_MS = 1000 * 60 * 30;
export const DEMO_SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 8;

type DemoSessionMeta = {
  sessionId: string;
  createdAt: number;
  lastSeenAt: number;
  version: typeof DEMO_SESSION_VERSION;
};

function getSessionStorage() {
  return typeof window === "undefined" ? null : window.sessionStorage;
}

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseSessionMeta(rawValue: string | null): DemoSessionMeta | null {
  if (!rawValue) {
    return null;
  }

  try {
    const value = JSON.parse(rawValue) as Partial<DemoSessionMeta>;
    if (
      value.version !== DEMO_SESSION_VERSION ||
      typeof value.sessionId !== "string" ||
      typeof value.createdAt !== "number" ||
      typeof value.lastSeenAt !== "number"
    ) {
      return null;
    }

    return value as DemoSessionMeta;
  } catch {
    return null;
  }
}

function isSessionExpired(meta: DemoSessionMeta, now: number) {
  return (
    now - meta.lastSeenAt > DEMO_SESSION_IDLE_TIMEOUT_MS ||
    now - meta.createdAt > DEMO_SESSION_MAX_AGE_MS
  );
}

function createSessionMeta(now = Date.now()): DemoSessionMeta {
  return {
    sessionId: createSessionId(),
    createdAt: now,
    lastSeenAt: now,
    version: DEMO_SESSION_VERSION,
  };
}

function writeSessionMeta(meta: DemoSessionMeta) {
  const storage = getSessionStorage();
  storage?.setItem(DEMO_SESSION_META_KEY, JSON.stringify(meta));
}

export function getDemoSessionMeta() {
  const storage = getSessionStorage();
  const now = Date.now();
  const current = parseSessionMeta(storage?.getItem(DEMO_SESSION_META_KEY) ?? null);

  if (!current || isSessionExpired(current, now)) {
    const next = createSessionMeta(now);
    writeSessionMeta(next);
    return next;
  }

  const next = { ...current, lastSeenAt: now };
  writeSessionMeta(next);
  return next;
}

export function getDemoSessionStorageKey() {
  return `agency-flow-crm:session:${getDemoSessionMeta().sessionId}:state`;
}

export function clearCurrentDemoSessionState() {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(getDemoSessionStorageKey());
}

