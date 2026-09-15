import * as base from "./canonicalLiveClassServiceV6";

const API_URL = process.env.REACT_APP_PUBLIC_LIVE_CLASS_API_URL || "https://admin.falowen.app/api/public-live-class";
const REFRESH_MS = 20000;
const EXPECTED_SESSION_COUNTS = Object.freeze({ A1: 25, A2: 28, B1: 28 });
const text = (value) => String(value || "").trim();
const asDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
const normalizeSession = (session = {}) => ({
  ...session,
  startsAt: asDate(session.startsAt),
  endsAt: asDate(session.endsAt),
  previousStartsAt: asDate(session.previousStartsAt),
  originalStartsAt: asDate(session.originalStartsAt),
  rescheduledAt: asDate(session.rescheduledAt),
});

const summaryLevel = (payload = {}) => {
  const source = [payload?.klass?.levelId, payload?.klass?.level, payload?.klass?.name, payload?.klass?.className]
    .map(text)
    .join(" ")
    .toUpperCase();
  return source.match(/\b(A1|A2|B1)\b/)?.[1] || "";
};

export const publicLiveClassApiUrl = (classId) => {
  const url = new URL(API_URL);
  url.searchParams.set("classId", text(classId));
  return url.toString();
};

export function assertCompleteAdminLiveClassSummary(payload = {}) {
  const sessions = Array.isArray(payload.sessions) ? payload.sessions : [];
  const level = summaryLevel(payload);
  const expected = EXPECTED_SESSION_COUNTS[level] || 0;
  if (expected && sessions.length < expected) {
    const error = new Error(`Admin live-class API returned an incomplete ${level} timetable (${sessions.length}/${expected} sessions)`);
    error.code = "incomplete-admin-live-class-summary";
    error.expectedSessions = expected;
    error.receivedSessions = sessions.length;
    throw error;
  }
  return payload;
}

export async function fetchAdminLiveClassSummary(classId, options = {}) {
  const receivedAtMs = Date.now();
  const response = await fetch(publicLiveClassApiUrl(classId), {
    method: "GET",
    headers: { accept: "application/json" },
    cache: "no-store",
    signal: options.signal,
  });
  const payload = await response.json();
  if (!response.ok || !payload?.ok) throw new Error(payload?.error || `Admin live-class API returned ${response.status}`);
  assertCompleteAdminLiveClassSummary(payload);
  const sessions = (payload.sessions || []).map(normalizeSession);
  const byId = new Map(sessions.map((session) => [session.id, session]));
  const linked = (session) => session ? (byId.get(session.id) || normalizeSession(session)) : null;
  return {
    ...payload,
    serverNow: asDate(payload.serverNow),
    serverReceivedAtMs: receivedAtMs,
    sessions,
    nextSession: linked(payload.nextSession),
    latestCompletedSession: linked(payload.latestCompletedSession),
    cancelledSessions: (payload.cancelledSessions || []).map(linked).filter(Boolean),
    isAdminApiSummary: true,
  };
}

export function alignedLiveClassNow(summary = {}, localNow = new Date()) {
  const serverNow = asDate(summary.serverNow);
  const receivedAtMs = Number(summary.serverReceivedAtMs || 0);
  const local = asDate(localNow) || new Date();
  if (!serverNow || !receivedAtMs) return local;
  return new Date(serverNow.getTime() + Math.max(0, local.getTime() - receivedAtMs));
}

export function subscribeCanonicalLiveClass(options = {}) {
  const classId = text(options.classId);
  if (!classId || typeof fetch !== "function") return base.subscribeCanonicalLiveClass(options);

  let stopped = false;
  let timer = null;
  let controller = null;
  let apiReady = false;
  let latestApiSummary = null;
  let authenticatedExtras = {};

  const emitApi = () => {
    if (!stopped && latestApiSummary) {
      options.onChange?.({ ...latestApiSummary, ...authenticatedExtras });
    }
  };

  const fallbackStop = base.subscribeCanonicalLiveClass({
    ...options,
    onChange: (summary) => {
      if (stopped) return;
      authenticatedExtras = summary?.zoom ? { zoom: summary.zoom } : {};
      if (apiReady) emitApi();
      else options.onChange?.(summary);
    },
    onUnavailable: () => {
      if (!stopped && !apiReady) options.onUnavailable?.();
    },
    onError: (error) => {
      if (!stopped && !apiReady) options.onError?.(error);
    },
  });

  const refresh = async () => {
    controller?.abort();
    controller = new AbortController();
    try {
      const summary = await fetchAdminLiveClassSummary(classId, { signal: controller.signal });
      if (stopped) return;
      apiReady = true;
      latestApiSummary = summary;
      emitApi();
    } catch (error) {
      if (stopped || error?.name === "AbortError") return;
      if (apiReady) options.onError?.(error);
      else console.warn("Admin live-class API unavailable or incomplete; keeping authenticated timetable fallback", error);
    } finally {
      if (!stopped) timer = window.setTimeout(refresh, REFRESH_MS);
    }
  };

  refresh();
  return () => {
    stopped = true;
    controller?.abort();
    if (timer) window.clearTimeout(timer);
    if (typeof fallbackStop === "function") fallbackStop();
  };
}

export const buildCanonicalLiveClassSummary = base.buildCanonicalLiveClassSummary;
export const findCanonicalClass = base.findCanonicalClass;
export const normalizeCurriculumIds = base.normalizeCurriculumIds;
export const repairA1LiveClassChronology = base.repairA1LiveClassChronology;
export const __private__ = { ...base.__private__, EXPECTED_SESSION_COUNTS, summaryLevel };
