// Public playback of explicitly approved Falowen MUSIC in the otherwise
// private course-audio R2 bucket. The published catalog is the single source
// for approved IDs; uploading an object alone never exposes it to listeners.
const { signedStudioUrl } = require('../functions/functionz/courseHoerenPublishing');
const { signTrack } = require('../server/courseMusic.cjs');
const catalog = require('../web/public/music/catalog.json');

// Deliberately restrict keys to the music/ namespace, not Hören resources.
// A public catalog entry must opt in to approval and use the owned playback
// endpoint, not a raw or signed R2 URL.
function approvedMusicKeys(data = catalog) {
  const keys = Object.create(null);
  for (const track of Array.isArray(data?.tracks) ? data.tracks : []) {
    if (!track || track.approved !== true || track.type !== 'Learning story'
      || track.coursebook !== true || !/^[a-z0-9-]{1,90}$/.test(String(track.id || ''))
      || !/^(A1|A2|B1|B2|C1|C2)$/.test(String(track.level || ''))
      || !Number.isInteger(track.day) || track.day < 1 || track.day > 31
      || !new RegExp('^music/' + track.level.toLowerCase() + '/day-'
        + String(track.day).padStart(2, '0') + '/[a-z0-9][a-z0-9-]*\\.mp3$').test(String(track.objectKey || ''))
      || track.audioUrl !== 'https://www.falowen.app/api/music?track=' + track.id
      || !new RegExp('^' + track.level + '-[0-9]+(?:[._][0-9]+)*$').test(String(track.assignmentKey || ''))) continue;
    if (!Object.prototype.hasOwnProperty.call(keys, track.id)) keys[track.id] = track.objectKey;
  }
  return Object.freeze(keys);
}
const APPROVED_MUSIC_KEYS = approvedMusicKeys();

async function approvedMusicHandler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const trackId = typeof req.query?.track === 'string' ? req.query.track : '';
  const objectKey = Object.prototype.hasOwnProperty.call(APPROVED_MUSIC_KEYS, trackId)
    ? APPROVED_MUSIC_KEYS[trackId] : '';
  if (!objectKey) return res.status(404).json({ error: 'Music track not published' });
  try {
    // Special legacy signers continue to work; new approved lesson tracks
    // use the same bounded 15-minute signed R2 URL as the other songs.
    const location = ['a1-day-04-numbers', 'a2-day-18-bank'].includes(trackId)
      ? signTrack(trackId).url
      : signedStudioUrl({ method: 'GET', key: objectKey, expires: 900 });
    res.setHeader('Location', location);
    return res.status(302).end();
  } catch (error) {
    console.error('Approved Falowen music URL unavailable', error?.code || error?.message);
    return res.status(503).json({ error: 'Music playback is temporarily unavailable' });
  }
}
module.exports = approvedMusicHandler;
module.exports.approvedMusicKeys = approvedMusicKeys;
