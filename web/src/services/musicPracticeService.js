import { auth } from '../firebase';

// Signed-in Campus learning activity is sent to the existing authenticated
// Firebase API. Never send Firebase IDs or tokens into the public music iframe.
const PRACTICE_API = 'https://us-central1-falowen-examiner-trainer.cloudfunctions.net/api/music-analytics/practice';
const RECENT = new Map();
const EVENTS = new Set(['play', 'complete', 'quiz']);
const SONG_ID = /^[A-Za-z0-9_-]{1,245}$/;

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

export async function recordMusicPractice(message) {
  const event = normalizeMusicPracticeEvent(message);
  if (!event || !auth?.currentUser) return false;
  const key = event.event + ':' + event.trackId;
  const now = Date.now();
  // Pause/resume and repeated "check answers" taps are not new sessions.
  if (now - (RECENT.get(key) || 0) < 45000) return false;
  RECENT.set(key, now);
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(PRACTICE_API, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      cache: 'no-store',
      keepalive: false,
    });
    if (!response.ok) throw new Error('Music tracking not available');
    return true;
  } catch {
    RECENT.delete(key); // A later legitimate action may retry.
    return false; // Optional reporting must never interrupt listening.
  }
}
