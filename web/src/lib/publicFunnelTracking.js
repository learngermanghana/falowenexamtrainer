const CONTEXT_KEY = "falowen:public-funnel-context";
const FIRST_TOUCH_KEY = "falowen:public-funnel-first-touch";
const EVENTS_KEY = "falowen:public-funnel-events";
const SESSION_KEY = "falowen:public-funnel-session";

export const PUBLIC_LEAD_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzrUe3IC5w24Rmf_Ed-8HmdKzV3mn0BQyg2qsaveOSQOYunQj89MM23mgDhjGbsMa2gSA/exec";

const ATTRIBUTION_KEYS = [
  "source",
  "src",
  "video",
  "lesson",
  "level",
  "class",
  "leadId",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const safeParse = (value, fallback = {}) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (_error) {
    return fallback;
  }
};

const readStorage = (key, fallback = {}) => {
  if (typeof window === "undefined") return fallback;
  try {
    return safeParse(window.localStorage.getItem(key), fallback);
  } catch (_error) {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (_error) {}
};

const ensureSessionId = () => {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const value = `funnel_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_KEY, value);
    return value;
  } catch (_error) {
    return `funnel_${Date.now()}`;
  }
};

const currentQueryContext = () => {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return ATTRIBUTION_KEYS.reduce((acc, key) => {
    const value = params.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});
};

export const rememberPublicFunnelContext = (overrides = {}) => {
  if (typeof window === "undefined") return { ...overrides };
  const query = currentQueryContext();
  const previous = readStorage(CONTEXT_KEY, {});
  const now = new Date().toISOString();
  const next = {
    ...previous,
    ...query,
    ...overrides,
    sessionId: previous.sessionId || ensureSessionId(),
    landingPath: previous.landingPath || window.location.pathname,
    lastPath: window.location.pathname,
    updatedAt: now,
  };

  const firstTouch = readStorage(FIRST_TOUCH_KEY, null);
  if (!firstTouch) {
    writeStorage(FIRST_TOUCH_KEY, {
      ...next,
      firstPath: window.location.pathname,
      firstSeenAt: now,
    });
  }

  writeStorage(CONTEXT_KEY, next);
  return next;
};

export const getPublicFunnelContext = () => ({
  ...readStorage(FIRST_TOUCH_KEY, {}),
  ...readStorage(CONTEXT_KEY, {}),
});

export const buildPublicFunnelUrl = (path, additions = {}) => {
  const context = { ...getPublicFunnelContext(), ...additions };
  const url = new URL(path, typeof window === "undefined" ? "https://www.falowen.app" : window.location.origin);
  ATTRIBUTION_KEYS.forEach((key) => {
    const value = context[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      url.searchParams.set(key, String(value));
    }
  });
  return `${url.pathname}${url.search}${url.hash}`;
};

export const trackPublicFunnelEvent = (stage, details = {}) => {
  if (typeof window === "undefined") return;
  const context = rememberPublicFunnelContext(details.attribution || {});
  const event = {
    event: "falowen_public_funnel",
    stage,
    at: new Date().toISOString(),
    path: window.location.pathname,
    ...context,
    ...details,
  };
  delete event.attribution;

  if (Array.isArray(window.dataLayer)) window.dataLayer.push(event);

  try {
    const previous = readStorage(EVENTS_KEY, []);
    writeStorage(EVENTS_KEY, [event, ...previous].slice(0, 100));
  } catch (_error) {}
};

export const submitPublicLead = async (lead, action = "saveLead") => {
  const payload = {
    ...lead,
    attribution: {
      ...getPublicFunnelContext(),
      ...(lead.attribution || {}),
    },
  };

  await fetch(PUBLIC_LEAD_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, lead: payload }),
  });

  return payload;
};

export const followUpIso = (hours = 24) =>
  new Date(Date.now() + Math.max(1, Number(hours) || 24) * 60 * 60 * 1000).toISOString();
