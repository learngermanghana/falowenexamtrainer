// The music iframe is same-origin with Campus. Never accept arbitrary postMessage data.
export const MUSIC_PRACTICE_MESSAGE_TYPE = 'falowen:music-practice:v1';
export const MUSIC_PRACTICE_ENDPOINT = 'https://us-central1-falowen-examiner-trainer.cloudfunctions.net/api/music-practice/record';

export function normalizeCampusMusicPractice(data) {
  if (!data || data.type !== MUSIC_PRACTICE_MESSAGE_TYPE) return null;
  const trackId = String(data.trackId || '').trim();
  if (!/^[a-zA-Z0-9_-]{1,245}$/.test(trackId)) return null;
  if (!['start', 'progress', 'complete'].includes(data.kind)) return null;
  const rawSeconds = Number(data.seconds || 0);
  if (!Number.isFinite(rawSeconds) || rawSeconds < 0 || rawSeconds > 600) return null;
  const level = String(data.level || 'ALL').toUpperCase();
  const day = Number(data.day);
  return {
    kind: data.kind, trackId, title: String(data.title || trackId).slice(0, 150),
    level: ['A1','A2','B1','B2','C1','C2','ALL'].includes(level) ? level : 'ALL',
    day: Number.isInteger(day) && day > 0 && day <= 99 ? day : null,
    seconds: Math.floor(rawSeconds),
  };
}

export async function saveCampusMusicPractice(user, event, fetchImpl = fetch) {
  if (!user || user.isAnonymous || !event) return false;
  const token = await user.getIdToken();
  const response = await fetchImpl(MUSIC_PRACTICE_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(event),
    keepalive: true,
  });
  return response.ok;
}
