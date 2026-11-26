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
  'a2-day-18-bank': Object.freeze({
    id: 'a2-day-18-bank', level: 'A2', day: 18, assignmentId: 'A2-7.18',
    title: 'Die Karte funktioniert nicht', key: 'music/a2/day-18/die-karte-funktioniert-nicht.mp3',
  }),
});
const encode = s => encodeURIComponent(String(s)).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
const hmac = (key, value) => crypto.createHmac('sha256', key).update(value).digest();
function signTrack(id, env = process.env, now = new Date()) {
  const track = Object.hasOwn(TRACKS, id) ? TRACKS[id] : null;
  if (!track) throw Object.assign(new Error('Unknown classroom song.'), { status: 404 });
  return signObject(track, env, now);
}
function signObject(track, env = process.env, now = new Date(), method = 'GET', ttlSeconds = 3600) {
  const ttl = Math.max(1, Math.min(3600, Math.floor(ttlSeconds)));
  if (!['GET','PUT'].includes(method)) throw Object.assign(new Error('Unsupported music storage operation.'), { status: 400 });
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
    'X-Amz-Expires':String(ttl), 'X-Amz-SignedHeaders':'host',
  }).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${encode(k)}=${encode(v)}`).join('&');
  const canonical = [method,uri,query,`host:${host}\n`,'host','UNSIGNED-PAYLOAD'].join('\n');
  const toSign = ['AWS4-HMAC-SHA256',stamp,scope,crypto.createHash('sha256').update(canonical).digest('hex')].join('\n');
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${String(env.R2_SECRET_ACCESS_KEY).trim()}`,date),'auto'),'s3'),'aws4_request');
  return { ...track, url:`https://${host}${uri}?${query}&X-Amz-Signature=${hmac(signingKey,toSign).toString('hex')}`,
    expiresAt:new Date(now.getTime()+ttl*1000).toISOString() };
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
function createMusicHandler({
  env = process.env, fetchImpl = fetch, prepare = prepareMusic,
  isAuthorized = isMusicStaff,
  authorizationError = 'Teacher or administrator access is required.',
  signInError = 'Please sign in to Falowen Admin.',
} = {}) {
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
      if (!token) return res.status(401).json({error:signInError});
      const apiKey = env.FIREBASE_API_KEY || env.REACT_APP_FIREBASE_API_KEY;
      if (!apiKey) return res.status(503).json({error:'Music authentication is not configured.'});
      const response = await fetchImpl(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encode(apiKey)}`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({idToken:token}), signal:AbortSignal.timeout(10000),
      });
      const data = await response.json();
      const account = data.users?.[0];
      if (!response.ok || !account?.localId || account.disabled) return res.status(401).json({error:'Your Falowen session has expired. Please sign in again.'});
      if (!await isAuthorized(account,env)) return res.status(403).json({error:authorizationError});
      const signed = await prepare(req, env, account);
      return res.status(200).json({url:signed.url, expiresAt:signed.expiresAt, track:signed.id});
    } catch (error) {
      return res.status(error.status || 502).json({error:error.status ? error.message : 'Could not prepare classroom music. Please retry.'});
    }
  };
}
// Fixed learner-facing audio only. The key is not taken from the request and
// signing still requires a valid Firebase ID token. The course R2 bucket stays private.
const SWAHILI_DAY_SIX_LISTENING = Object.freeze({
  id: 'swahili-a1-day06-listening',
  key: 'swahili/A1/day-06/day-06.mp3',
});
const SWAHILI_DAY_FIVE_LISTENING = Object.freeze({
  id: 'swahili-a1-day05-listening',
  key: 'swahili/A1/day-05/day-05.mp3',
});

const SWAHILI_DAY_FOUR_LISTENING = Object.freeze({
  id: 'swahili-a1-day04-listening',
  key: 'swahili/A1/day-04/day-04.mp3',
});
const SWAHILI_DAY_THREE_LISTENING = Object.freeze({
  id: 'swahili-a1-day03-listening',
  key: 'swahili/A1/day-03/day-03.mp3',
});
const SWAHILI_DAY_TWO_LISTENING = Object.freeze({
  id: 'swahili-a1-day02-listening',
  key: 'swahili/A1/day-02/day-02.mp3',
});

const SWAHILI_DAY_ONE_LISTENING = Object.freeze({
  id: 'swahili-a1-day01-listening',
  key: 'swahili/A1/day-01/day-01.mp3',
});

const SWAHILI_DAY_SEVEN_LISTENING = Object.freeze({
  id: 'swahili-a1-day07-listening',
  key: 'swahili/A1/day-07/day-07.mp3',
});

const SWAHILI_DAY_EIGHT_LISTENING = Object.freeze({
  id: 'swahili-a1-day08-listening',
  key: 'swahili/A1/day-08/day-08.mp3',
});

const SWAHILI_DAY_TEN_LISTENING = Object.freeze({
  id: 'swahili-a1-day10-listening',
  key: 'swahili/A1/day-10/day-10.mp3',
});
const SWAHILI_DAY_TWELVE_LISTENING = Object.freeze({
  id: 'swahili-a1-day12-listening',
  key: 'swahili/A1/day-12/day-12.mp3',
});
const SWAHILI_DAY_THIRTEEN_LISTENING = Object.freeze({ id: 'swahili-a1-day13-listening', key: 'swahili/A1/day-13/day-13.mp3' });
const SWAHILI_DAY_ELEVEN_LISTENING = Object.freeze({
  id: 'swahili-a1-day11-listening',
  key: 'swahili/A1/day-11/day-11.mp3',
});

function createSwahiliListeningHandler(recording, options = {}) {
  const lookup = options.loadSwahiliAccess || require('../functions/functionz/swahiliAccess').loadSwahiliAccess;
  return createMusicHandler({
    ...options,
    isAuthorized: account => Boolean(account?.localId && !account.disabled),
    authorizationError: 'A signed-in Falowen account is required.',
    signInError: 'Please sign in to Falowen to play this recording.',
    prepare: async (req, env, account) => {
      const params = new URL(req.url, 'https://www.falowen.app').searchParams;
      if ([...params.keys()].length) {
        throw Object.assign(new Error('Unexpected listening audio parameters.'), { status: 400 });
      }
      const now = new Date();
      const level = recording.key.split('/')[1];
      let claims = {};
      try { claims = JSON.parse(account.customAttributes || '{}'); } catch { /* no trusted roles */ }
      const staff = claims.admin === true || claims.staff === true || ['admin','staff','teacher','tutor','instructor'].includes(claims.role) || (account.emailVerified === true && isMusicStaff(account,env));
      const access = staff ? { allowed:true } : await lookup(account.localId, level, now.getTime());
      if (!access.allowed) throw Object.assign(new Error('Active Kiswahili course access is required.'), {status:403});
      const ttl = Number.isFinite(access.expiresAtMs) ? Math.floor((access.expiresAtMs-now.getTime())/1000) : 3600;
      if (ttl < 1) throw Object.assign(new Error('Kiswahili course access has expired.'), {status:403});
      return signObject(recording, env, now, 'GET', ttl);
    },
  });
}
function createSwahiliB1Day27AudioHandler(options) {
  return createSwahiliListeningHandler({ id: 'swahili-b1-day27-listening', key: 'swahili/B1/day-27/day-27.mp3' }, options);
}
function createSwahiliB1Day26AudioHandler(options) {
  return createSwahiliListeningHandler({
    id: 'swahili-b1-day26-listening',
    key: 'swahili/B1/day-26/day-26.mp3',
  }, options);
}
function createSwahiliB1Day28AudioHandler(options) {
  return createSwahiliListeningHandler({
    id: 'swahili-b1-day28-listening',
    key: 'swahili/B1/day-28/day-28.mp3',
  }, options);
}

function createSwahiliDayOneAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_ONE_LISTENING, options);
}
function createSwahiliDayFourAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_FOUR_LISTENING, options);
}
function createSwahiliDayThreeAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_THREE_LISTENING, options);
}
function createSwahiliDayTwoAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_TWO_LISTENING, options);
}
function createSwahiliDayFiveAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_FIVE_LISTENING, options);
}
function createSwahiliDaySixAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_SIX_LISTENING, options);
}
function createSwahiliDaySevenAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_SEVEN_LISTENING, options);
}
function createSwahiliDayEightAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_EIGHT_LISTENING, options);
}
function createSwahiliDayTenAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_TEN_LISTENING, options);
}
function createSwahiliDayTwelveAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_TWELVE_LISTENING, options);
}
function createSwahiliDayThirteenAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_THIRTEEN_LISTENING, options);
}
function createSwahiliDayElevenAudioHandler(options) {
  return createSwahiliListeningHandler(SWAHILI_DAY_ELEVEN_LISTENING, options);
}
// These private classroom conversations are never added to the public music map.
// Private course conversations, never exposed by the public music track map.
// Fixed (level, day, objectKey) triples prevent arbitrary private R2 access.
const CLASSROOM_RECORDINGS = Object.freeze({
  // Exact paths already authored in the existing classroom listening slides.
  'A2-1': Object.freeze({ id: 'a2-1-classroom', key: 'a2/day-01/small-talk.mp3' }),
  'A2-17': Object.freeze({ id: 'a2-17-classroom', key: 'a2/day-17/apotheken-detektiv.mp3' }),
  'A2-26': Object.freeze({ id: 'a2-26-classroom', key: 'a2/day-26/gefuhle-beschreiben.mp3' }),
  'A2-28': Object.freeze({ id: 'a2-28-classroom', key: 'a2/day-28/uber-die-zukunft-sprechen.mp3' }),
  'SWAHILI-B1-28': Object.freeze({ id: 'swahili-b1-day28-kutunza-classroom', key: 'swahili/B1/day-28/swahili-listening kuntasa.mp3' }),
  'SWAHILI-B1-27': Object.freeze({ id: 'swahili-b1-day27-kutunza-classroom', key: 'swahili/B1/day-27/kuntunza.mp3' }),
  'SWAHILI-B1-26': Object.freeze({ id: 'swahili-b1-day26-safari-classroom', key: 'swahili/B1/day-26/swahili-listening matitizo.mp3' }),
  // Exact teacher-supplied B1 Day 28 MP3; private classroom playback only.
  'B1-28': Object.freeze({ id: 'b1-day28-klimafreundlich-leben', key: 'b1/day-28/klimafreundlich-leben.mp3' }),
  'B1-27': Object.freeze({ id: 'b1-day27-environment-everyday', key: 'b1/day-27/umweltfreundlich-im-alltag.mp3' }),
  // The teacher uploaded this B1 lesson recording under an A2 storage prefix.
  'B1-26': Object.freeze({ id: 'b1-day26-travel-problems', key: 'a2/day-26/reiseprobleme-und-losungen.mp3' }),
  // Exact-key, staff-only classroom signing. The teacher's dashboard URL
  // supplied only the a2/dat-02/ prefix; verify filename in R2 before launch.
  'A2-2': Object.freeze({ id: 'a2-day2-personen-beschreiben', key: 'a2/dat-02/personen-beschreiben.mp3' }),
  // Day 3 classroom Hören only. The owner provided the folder prefix and question key;
  // confirm this candidate MP3 basename in R2 before relying on playback.
  'A2-3': Object.freeze({ id: 'a2-day3-dinge-und-personen-vergleichen', key: 'a2/day-03/dinge-und-personen-vergleichen.mp3' }),
  'A2-4': Object.freeze({ id: 'a2-day4-meeting-classroom', key: 'a2/day-04/wo-mochten-wir-uns-treffen.mp3' }),
  'A2-5': Object.freeze({ id: 'a2-day5-freizeit-classroom', key: 'a2/day-05/was-machst-du-in-deiner-freizeit.mp3' }),
  'A2-7': Object.freeze({ id: 'a2-day7-wohnung-suchen-classroom', key: 'a2/day-07/eine-wohnung-suchen.mp3' }),
  // Exact owner-uploaded Day 8 restaurant dialogue; authenticated teacher playback only.
  'A2-8': Object.freeze({ id: 'a2-day8-restaurant-classroom', key: 'a2/day-08/im-restaurant-bestellen-und-reagieren.mp3' }),
  // Teacher-supplied Day 9 holiday recording; do not replace the learner workbook audio.
  'A2-9': Object.freeze({ id: 'a2-day9-urlaub-classroom', key: 'a2/day-09/urlaub.mp3' }),
  // Day 10 classroom city conversation is distinct from the graded learner workbook track.
  'A2-10': Object.freeze({ id: 'a2-day10-stadt-classroom', key: 'a2/day-10/eine-stadt-entdecken-und-etwas-erleben.mp3' }),
  'A2-18': Object.freeze({ id: 'a2-day18-bank-telephone', key: 'a2/day-18/bank-telefonat.mp3' }),
  'A2-20': Object.freeze({ id: 'a2-day20-complaint', key: 'a2/day-20/reklamation-falsches-hemd.mp3' }),
  'A2-19': Object.freeze({ id: 'a2-day19-shopping', key: 'a2/day-19/einkaufen-wo-und-wie.mp3' }),
  'A2-21': Object.freeze({ id: 'a2-day21-weekend-classroom', key: 'a2/day-21/ein-wochenende-planen.mp3' }),
  'A2-23': Object.freeze({ id: 'a2-day23-commute-classroom', key: 'a2/day-23/wie-kommst-du-zur-schule-oder-zur-arbeit.mp3' }),
  'A2-24': Object.freeze({ id: 'a2-day24-urlaub-classroom', key: 'a2/day-24/einen-urlaub-planen.mp3' }),
  'A2-27': Object.freeze({ id: 'a2-day27-digitale-kommunikation-classroom', key: 'a2/day-27/digitale-kommunikation.mp3' }),
  'A2-25': Object.freeze({ id: 'a2-day25-tagesablauf-classroom', key: 'a2/day-25/tagesablauf.mp3' }),
  'B1-25': Object.freeze({ id: 'b1-day25-consumer-service', key: 'b1/day-25/online-shopping-verbraucherservice.mp3' }),
});
// Path-based lookup removes the fragile level/day/key query-string contract.
function createClassroomRecordingPathHandler(options = {}) {
  return createMusicHandler({ ...options, prepare: async (req, env) => {
    const url = new URL(req.url, 'https://www.falowen.app');
    const match = url.pathname.match(/^\/course-media\/classroom\/(a2|b1|swahili-b1)\/([1-9][0-9]?)\/audio-url$/);
    const lookupKey = match ? match[1].toUpperCase() + '-' + Number(match[2]) : '';
    const recording = Object.hasOwn(CLASSROOM_RECORDINGS, lookupKey) ? CLASSROOM_RECORDINGS[lookupKey] : null;
    if (!recording) throw Object.assign(new Error('Classroom recording is not registered.'), {status:404});
    if (url.searchParams.has('key') || url.searchParams.has('level') || url.searchParams.has('day')) {
      throw Object.assign(new Error('Unexpected classroom recording parameters.'), {status:400});
    }
    return signObject(recording, env);
  } });
}
function createClassroomAudioHandler(options = {}) {
  return createMusicHandler({ ...options, prepare: async (req, env) => {
    const params = new URL(req.url, 'https://www.falowen.app').searchParams;
    const level = params.get('level') || '';
    const dayText = params.get('day') || '';
    const key = params.get('key') || '';
    const day = Number(dayText);
    const lookupKey = /^(A2|B1|SWAHILI-B1)$/.test(level) && /^[1-9][0-9]?$/.test(dayText)
      ? `${level}-${day}` : '';
    const recording = Object.hasOwn(CLASSROOM_RECORDINGS, lookupKey) ? CLASSROOM_RECORDINGS[lookupKey] : null;
    if (!recording || key !== recording.key) {
      throw Object.assign(new Error('Invalid classroom audio request.'), { status: 400 });
    }
    return signObject(recording, env);
  } });
}
// Legacy A2 classroom URLs remain unchanged and securely limited to A2.
function createClassroomBankAudioHandler(options = {}) {
  return createMusicHandler({ ...options, prepare: async (req, env) => {
    const params = new URL(req.url, 'https://www.falowen.app').searchParams;
    const dayText = params.get('day') || '';
    const key = params.get('key') || '';
    const lookupKey = /^[1-9][0-9]?$/.test(dayText) ? `A2-${Number(dayText)}` : '';
    const recording = Object.hasOwn(CLASSROOM_RECORDINGS, lookupKey) ? CLASSROOM_RECORDINGS[lookupKey] : null;
    if (!recording || key !== recording.key) {
      throw Object.assign(new Error('Invalid classroom audio request.'), { status: 400 });
    }
    return signObject(recording, env);
  } });
}
module.exports = { createSwahiliB1Day27AudioHandler, createSwahiliB1Day26AudioHandler, createSwahiliDayThirteenAudioHandler, createSwahiliB1Day28AudioHandler, createSwahiliDayOneAudioHandler, createSwahiliDayTwoAudioHandler, createSwahiliDayThreeAudioHandler, createSwahiliDayFourAudioHandler, createSwahiliDayFiveAudioHandler, createSwahiliDaySixAudioHandler, createSwahiliDaySevenAudioHandler, createSwahiliDayEightAudioHandler, createSwahiliDayTenAudioHandler, createSwahiliDayElevenAudioHandler, createSwahiliDayTwelveAudioHandler, createClassroomRecordingPathHandler, createClassroomAudioHandler, createClassroomBankAudioHandler, TRACKS, signTrack, signObject, isMusicStaff, createMusicHandler };
