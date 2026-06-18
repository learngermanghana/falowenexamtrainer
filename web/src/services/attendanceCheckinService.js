import { collection, db, doc, getDoc, getDocs, isFirebaseConfigured } from "../firebase";

const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_FUNCTIONS_BASE_URL ||
  "";

const truthy = (value) => value === true || ["true", "open", "active"].includes(String(value || "").toLowerCase());

const toMillis = (value) => {
  if (!value) return null;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.toDate === "function") return value.toDate().getTime();
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
};

const isPresentEntry = (entry) => {
  if (entry === true) return true;
  if (!entry || typeof entry !== "object") return false;
  const status = String(entry.status || entry.attendance || "").toLowerCase();
  return entry.present === true || entry.attended === true || status === "present";
};

export const isAttendanceSessionActive = (session = {}, now = Date.now()) => {
  const openFromMs = toMillis(session.openFrom);
  const openToMs = toMillis(session.openTo);
  if (Object.prototype.hasOwnProperty.call(session, "opened")) {
    return (
      session.opened === true &&
      (!Number.isFinite(openFromMs) || now >= openFromMs) &&
      (!Number.isFinite(openToMs) || now <= openToMs)
    );
  }

  const expiresAtMs = toMillis(session.expiresAt || session.endsAt || session.closesAt || session.activeUntil);
  const closed = truthy(session.closed) || truthy(session.isClosed) || String(session.status || "").toLowerCase() === "closed";
  const explicitlyActive = truthy(session.active) || truthy(session.isActive) || ["open", "active"].includes(String(session.status || "").toLowerCase());
  return !closed && explicitlyActive && (!Number.isFinite(expiresAtMs) || expiresAtMs > now);
};

export const getActiveAttendanceSession = async ({ className, studentCode, studentUid } = {}) => {
  if (!className || !studentCode || !isFirebaseConfigured || !db) return null;
  const snap = await getDocs(collection(db, "attendance", className, "sessions"));
  const now = Date.now();
  const active = [];

  snap.forEach((sessionDoc) => {
    const data = sessionDoc.data() || {};
    const expiresAtMs = toMillis(data.openTo || data.expiresAt || data.endsAt || data.closesAt || data.activeUntil);
    if (!isAttendanceSessionActive(data, now)) return;
    if (isPresentEntry(data.attendance?.[studentCode]) || isPresentEntry(data.students?.[studentCode]) || isPresentEntry(data.participants?.[studentCode])) return;
    active.push({ id: sessionDoc.id, ...data, expiresAtMs });
  });

  active.sort((a, b) => (b.expiresAtMs || 0) - (a.expiresAtMs || 0));
  const session = active[0] || null;
  if (!session) return null;

  const checkinIds = [studentUid, studentCode].filter(Boolean);
  for (const checkinId of checkinIds) {
    const checkinSnap = await getDoc(doc(db, "attendance", className, "sessions", session.id, "checkins", checkinId));
    if (checkinSnap.exists() && isPresentEntry(checkinSnap.data())) return null;
  }

  return session;
};

export const submitFalowenAttendanceCheckin = async ({ idToken, className, sessionId } = {}) => {
  if (!API_BASE) throw new Error("Missing REACT_APP_API_BASE_URL (or REACT_APP_FUNCTIONS_BASE_URL).");
  const response = await fetch(`${API_BASE.replace(/\/$/, "")}/attendance/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ className, sessionId, source: "falowen_student_app" }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not check in now.");
  return data;
};
