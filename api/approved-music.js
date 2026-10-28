// Public playback of explicitly approved Falowen MUSIC recordings in the
// otherwise private R2 course-audio bucket. Never expose a bucket listing,
// unsigned object, arbitrary key, or private course Hören audio.
const { signedStudioUrl } = require('../functions/functionz/courseHoerenPublishing');
const { signTrack } = require('../server/courseMusic.cjs');

const APPROVED_MUSIC_KEYS = Object.freeze({
  'a1-day-04-numbers': 'music/a1/day-04/welche-nummer-hast-du.mp3',
  'a1-day-22-health': 'music/a1/day-22/mein-kopf-tut-weh.mp3',
  'a2-day-18-bank': 'music/a2/day-18/die-karte-funktioniert-nicht.mp3',
});

module.exports = async function approvedMusicHandler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, HEAD, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const trackId = typeof req.query?.track === 'string' ? req.query.track : '';
  const objectKey = Object.prototype.hasOwnProperty.call(APPROVED_MUSIC_KEYS, trackId)
    ? APPROVED_MUSIC_KEYS[trackId] : '';
  if (!objectKey) return res.status(404).json({ error: 'Music track not published' });

  try {
    // Fresh short-lived URL on each press of Play. R2 music stays in the
    // existing bucket without enabling public access to private Hören assets.
    const location = ['a1-day-04-numbers', 'a2-day-18-bank'].includes(trackId)
      ? signTrack(trackId).url
      : signedStudioUrl({ method: 'GET', key: objectKey, expires: 900 });
    res.setHeader('Location', location);
    return res.status(302).end();
  } catch (error) {
    console.error('Approved Falowen music URL unavailable', error?.code || error?.message);
    return res.status(503).json({ error: 'Music playback is temporarily unavailable' });
  }
};
