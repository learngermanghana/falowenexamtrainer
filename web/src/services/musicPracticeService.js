import { auth } from '../firebase';

// Student practice is aggregated in the browser and sent to the existing
// authenticated Firebase API only when a learner actually practises.
// There is NO periodic polling, scheduled job or per-second playback logging.
const PRACTICE_API = 'https://us-central1-falowen-examiner-trainer.cloudfunctions.net/api/music-analytics/practice';
const RECENT = new Map();
const STATES = new Map();
const EVENTS = new Set(['play', 'complete', 'quiz']);
const SONG_ID = /^[A-Za-z0-9_-]{1,245}$/;
const SAVE_INTERVAL_MS = 10 * 60 * 1000;
const MAX_BATCH_EVENTS = 24;

export function normalizeMusicPracticeEvent(message) {
  if (!message || !EVENTS.has(message.event) || !SONG_ID.test(String(message.trackId || ''))) return null;
  return {
    event: message.event,
    trackId: message.trackId,
    title: String(message.title || message.trackId).slice(0, 120),
    level: String(message.level || '').toUpperCase().slice(0, 5),
    day: Number(message.day) || null,
  };
}

function stateFor(uid) {
  if (!STATES.has(uid)) STATES.set(uid, { pending: [], lastSentAt: 0, inFlight: null });
  return STATES.get(uid);
}

function batchId() {
  // Opaque, random deduplication ID; never a Firebase ID or an email address.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '');
  }
  return 'music' + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** A single Firestore write represents up to 24 meaningful events. */
export function flushMusicPractice() {
  const user = auth?.currentUser;
  if (!user) return Promise.resolve(false);
  const state = stateFor(user.uid);
  if (state.inFlight) return state.inFlight.then(() => state.pending.length ? flushMusicPractice() : false);
  if (!state.pending.length) return Promise.resolve(false);

  const events = state.pending.splice(0, MAX_BATCH_EVENTS);
  const packet = { batchId: batchId(), events };
  const previousSentAt = state.lastSentAt;
  state.lastSentAt = Date.now();
  state.inFlight = (async () => {
    const token = await user.getIdToken();
    const response = await fetch(PRACTICE_API, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(packet),
      cache: 'no-store',
      keepalive: true,
    });
    if (!response.ok) throw new Error('Music practice tracking unavailable');
    return true;
  })().catch(() => {
    // A transient API failure never interrupts a lesson.
    state.pending.unshift(...events);
    state.lastSentAt = previousSentAt;
    return false;
  }).finally(() => { state.inFlight = null; });
  return state.inFlight;
}

export function recordMusicPractice(message) {
  const event = normalizeMusicPracticeEvent(message);
  const user = auth?.currentUser;
  if (!event || !user) return Promise.resolve(false);
  const key = user.uid + ':' + event.event + ':' + event.trackId;
  const now = Date.now();
  // Ignore pause/resume and accidental repeated "Check answers" clicks.
  if (now - (RECENT.get(key) || 0) < 45000) return Promise.resolve(false);
  RECENT.set(key, now);
  const state = stateFor(user.uid);
  state.pending.push(event);
  // First action is visible promptly. After that, batch up to ten minutes
  // or 24 events and flush remaining activity on navigation/exit.
  if (!state.lastSentAt || now - state.lastSentAt >= SAVE_INTERVAL_MS ||
      state.pending.length >= MAX_BATCH_EVENTS) {
    return flushMusicPractice();
  }
  return Promise.resolve(true);
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => { void flushMusicPractice(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flushMusicPractice();
  });
}
