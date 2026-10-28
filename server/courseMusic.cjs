const crypto = require('node:crypto');
// Explicitly approved classroom songs only. This never signs arbitrary R2 keys.
const TRACKS = Object.freeze({
  'a1-day22-mein-kopf-tut-weh': Object.freeze({
    id: 'a1-day22-mein-kopf-tut-weh', level: 'A1', day: 22, assignmentId: 'A1-14.1',
    title: 'Mein Kopf tut weh', key: 'music/a1/day-22/mein-kopf-tut-weh.mp3',
  }),
  'a1-day-04-numbers': Object.freeze({
    id: 'a1-day-04-numbers', level: 'A1', day: 4, assignmentId: 'A1-2',
    title: 'Welche Nummer hast du?', key: 'music/a1/day-04/welche-nummer-hast-du.mp3',
  }),
});
const encode = s => encodeURIComponent(String(s)).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
const hmac = (key, value) => crypto.createHmac('sha256', key).update(value).digest();
function signTrack(id, env = process.env, now = new Date()) {
  const track = Object.hasOwn(TRACKS, id) ? TRACKS[id] : null;
  if (!track) throw Object.assign(new Error('Unknown classroom song.'), { status: 404 });
  for (const key of ['R2_ACCOUNT_ID','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY','R2_AUDIO_BUCKET']) {
    if (!String(env[key] || '').trim()) throw Object.assign(new Error('Classroom music storage is not configured.'), { status: 503 });
  }
  const bucket = String(env.R2_AUDIO_BUCKET).trim();
  const account = String(env.R2_ACCOUNT_ID).trim();
  if (!/^[a-z0-9][a-z0-9.-]*$/i.test(bucket) || !/^[a-f0-9]{32}$/i.test(account)) throw Object.assign(new Error('Invalid music storage configuration.'), { status: 503 });
  const stamp = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const date = stamp.slice(0,8), scope = `${date}/auto/s3/aws4_request`;
  const host = `${bucket}.${account}.r2.cloudflarestorage.com`;
  const uri = '/' + track.key.split('/').map(encode).join('/');
  const query = Object.entries({
    'X-Amz-Algorithm':'AWS4-HMAC-SHA256', 'X-Amz-Content-Sha256':'UNSIGNED-PAYLOAD',
    'X-Amz-Credential':`${String(env.R2_ACCESS_KEY_ID).trim()}/${scope}`, 'X-Amz-Date':stamp,
    'X-Amz-Expires':'3600', 'X-Amz-SignedHeaders':'host',
  }).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${encode(k)}=${encode(v)}`).join('&');
  const canonical = ['GET',uri,query,`host:${host}\n`,'host','UNSIGNED-PAYLOAD'].join('\n');
  const toSign = ['AWS4-HMAC-SHA256',stamp,scope,crypto.createHash('sha256').update(canonical).digest('hex')].join('\n');
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${String(env.R2_SECRET_ACCESS_KEY).trim()}`,date),'auto'),'s3'),'aws4_request');
  return { ...track, url:`https://${host}${uri}?${query}&X-Amz-Signature=${hmac(signingKey,toSign).toString('hex')}`,
    expiresAt:new Date(now.getTime()+3600000).toISOString() };
}
function isMusicStaff(account, env = process.env) {
  let claims = {};
  try { claims = JSON.parse(account.customAttributes || '{}'); } catch { /* malformed roles grant no access */ }
  const emails = String(env.COURSE_MEDIA_STAFF_EMAILS || 'moxflex@gmail.com,staff@falowen.app').split(',').map(s=>s.trim().toLowerCase());
  return claims.admin === true || ['admin','teacher','tutor','staff','instructor'].includes(String(claims.role || '').toLowerCase())
    || emails.includes(String(account.email || '').toLowerCase());
}
function prepareMusic(req, env) {
  const id = new URL(req.url, 'https://www.falowen.app').searchParams.get('track') || '';
  return signTrack(id, env);
}
function createMusicHandler({ env = process.env, fetchImpl = fetch, prepare = prepareMusic } = {}) {
  return async (req,res) => {
    const origin = req.headers.origin;
    if (['https://admin.falowen.app','https://www.falowen.app','https://music.falowen.app'].includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin',origin); res.setHeader('Vary','Origin');
    }
    res.setHeader('Cache-Control','private, no-store');
    res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') return res.status(405).json({error:'Method not allowed.'});
    try {
      const token = String(req.headers.authorization || '').match(/^Bearer (.+)$/i)?.[1];
      if (!token) return res.status(401).json({error:'Please sign in to Falowen Admin.'});
      const apiKey = env.FIREBASE_API_KEY || env.REACT_APP_FIREBASE_API_KEY;
      if (!apiKey) return res.status(503).json({error:'Music authentication is not configured.'});
      const response = await fetchImpl(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encode(apiKey)}`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({idToken:token}), signal:AbortSignal.timeout(10000),
      });
      const data = await response.json();
      const account = data.users?.[0];
      if (!response.ok || !account?.localId || account.disabled) return res.status(401).json({error:'Your Falowen session has expired. Please sign in again.'});
      if (!isMusicStaff(account,env)) return res.status(403).json({error:'Teacher or administrator access is required.'});
      const signed = await prepare(req, env);
      return res.status(200).json({url:signed.url, expiresAt:signed.expiresAt, track:signed.id});
    } catch (error) {
      return res.status(error.status || 502).json({error:error.status ? error.message : 'Could not prepare classroom music. Please retry.'});
    }
  };
}
// Teacher-only access to one private recording using the existing Vercel R2
// configuration. Never accepts arbitrary object keys or public playback.
function createClassroomBankAudioHandler(options = {}) {
  return createMusicHandler({ ...options, prepare: async (req, env) => {
    const { validateA2AudioKey, createA2AudioSignedUrl } = require('../functions/functionz/r2CourseAudio.js');
    const params = new URL(req.url, 'https://www.falowen.app').searchParams;
    const day = Number(params.get('day'));
    const key = params.get('key') || '';
    if (day !== 18 || key !== 'a2/day-18/bank-telefonat.mp3' || !validateA2AudioKey({ day, key })) {
      throw Object.assign(new Error('Invalid classroom bank audio request.'), { status: 400 });
    }
    return { ...await createA2AudioSignedUrl({ day, key, env }), id: 'a2-day18-bank-telephone' };
  } });
}
module.exports = { createClassroomBankAudioHandler, TRACKS, signTrack, isMusicStaff, createMusicHandler };
