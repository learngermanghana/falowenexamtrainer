'use strict';
// On-demand public music discovery. Listing is restricted to music/ and never
// exposes the bucket, keys outside that namespace, or storage credentials.
// Uploading to music/<level>/day-XX/ is intentionally a publication action.
const crypto = require('node:crypto');
const approvedRecordingLyrics = require('../web/public/music/approved-recording-lyrics.json');
const { getR2AudioConfig } = require('../functions/functionz/r2CourseAudio');
const LEVELS = new Set(['A1','A2','B1','B2','C1','C2','SWAHILI']);
// A2 Day 14 recording was replaced by owner-approved Mein Traumberuf.mp3.
// Keep a stale R2 MP3 out of discovery and prevent matching new lyrics to it.
const RETIRED_MUSIC_KEYS = new Set(['music/a2/day-14/Pläne für mein Leben.mp3']);
const OBJECT_KEY = /^music\/(a1|a2|b1|b2|c1|c2|swahili)\/(library|day-(?:0[1-9]|1[0-9]|2[0-8]))\/([^/\\\u0000-\u001f\u007f]{1,150})\.(mp3)$/i;
const enc = value => encodeURIComponent(String(value)).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());
const hmac = (key,msg) => crypto.createHmac('sha256',key).update(msg).digest();
function musicKeyFromAutoId(id) {
  const match = /^r2-(a1|a2|b1|b2|c1|c2|swahili)-(library|day-(?:0[1-9]|1[0-9]|2[0-8]))-([a-z0-9]+(?:-[a-z0-9]+)*|b64_[A-Za-z0-9_-]{4,220})$/.exec(String(id || ''));
  if (!match) return '';
  const [, program, folder, suffix] = match;
  const filename = suffix.startsWith('b64_') ? Buffer.from(suffix.slice(4), 'base64url').toString('utf8') : suffix + '.mp3';
  const key = 'music/' + program + '/' + folder + '/' + filename;
  return musicTrackFromKey(key)?.id === id ? key : '';
}
function musicTrackFromKey(key) {
  if (RETIRED_MUSIC_KEYS.has(String(key || ''))) return null;
  const match = String(key || '').match(OBJECT_KEY);
  if (!match || !match[3].trim() || match[3] !== match[3].trim()) return null;
  const level = match[1].toUpperCase();
  const folder = match[2];
  if (!LEVELS.has(level) || (folder === 'library' && level !== 'SWAHILI')) return null;
  const day = folder === 'library' ? null : Number(folder.slice(4));
  // Preserve the *exact* original filename for reversible playback IDs,
  // including spaces, umlauts, punctuation and upper-case .MP3 extensions.
  const filename=match[3]+'.'+match[4];
  const isSlug=/^[a-z0-9]+(?:-[a-z0-9]+)*\.mp3$/.test(filename);
  const suffix=isSlug?match[3]:'b64_'+Buffer.from(filename,'utf8').toString('base64url');
  if(suffix.length>225) return null;
  const id = 'r2-' + match[1].toLowerCase() + '-' + folder + '-' + suffix;
  const name=match[3].replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim();
  const approved = approvedRecordingLyrics.recordings.find(recording => recording.objectKey === key);
  return {
    id, title:approved?.title || name.charAt(0).toUpperCase()+name.slice(1), level, day,
    topic:day ? 'Day '+day+(level === 'SWAHILI' ? ' · Swahili music' : ' · German music') : 'Swahili music',
    type:'Learning story', genre:approved?.genre || '', language:level === 'SWAHILI' ? 'Swahili' : 'German',
    audioUrl:'https://www.falowen.app/api/music?track='+id,
    assignmentKey:approved?.assignmentKey || '', coursebook:day !== null, autoDiscovered:true,
    objectKey:key,
  };
}
// Use authenticated S3 ListObjectsV2 with the documented R2 account endpoint.
// Bucket-level presigned GET requests can fail even while object playback works.
// This read-only request signs the exact music/ prefix server-side; no signed
// list URL or credentials are returned to the public website.
function authorizedMusicListRequest(env=process.env, continuationToken='', now=new Date()) {
  const { accountId, accessKeyId, secretAccessKey, bucket } = getR2AudioConfig(env);
  const host=accountId+'.r2.cloudflarestorage.com';
  const uri='/'+enc(bucket);
  const stamp=now.toISOString().replace(/[:-]|\.\d{3}/g,'');
  const date=stamp.slice(0,8);
  const scope=date+'/auto/s3/aws4_request';
  const values=[
    ['list-type','2'],['max-keys','1000'],['prefix','music/'],
    ...(continuationToken ? [['continuation-token',continuationToken]] : []),
  ];
  const query=values.map(([k,v])=>[enc(k),enc(v)]).sort(([a],[b])=>a.localeCompare(b))
    .map(([k,v])=>k+'='+v).join('&');
  const contentHash=crypto.createHash('sha256').update('').digest('hex');
  const signedHeaders='host;x-amz-content-sha256;x-amz-date';
  const canonicalHeaders='host:'+host+'\n'
    +'x-amz-content-sha256:'+contentHash+'\n'
    +'x-amz-date:'+stamp+'\n';
  const canonical=['GET',uri,query,canonicalHeaders,signedHeaders,contentHash].join('\n');
  const digest=crypto.createHash('sha256').update(canonical).digest('hex');
  const toSign=['AWS4-HMAC-SHA256',stamp,scope,digest].join('\n');
  const secret=hmac(hmac(hmac(hmac('AWS4'+secretAccessKey,date),'auto'),'s3'),'aws4_request');
  const sig=crypto.createHmac('sha256',secret).update(toSign).digest('hex');
  return {
    url:'https://'+host+uri+'?'+query,
    headers:{
      'x-amz-content-sha256':contentHash,
      'x-amz-date':stamp,
      Authorization:'AWS4-HMAC-SHA256 Credential='+accessKeyId+'/'+scope
        +', SignedHeaders='+signedHeaders+', Signature='+sig,
    },
  };
}
function unescapeXml(text='') {
  return String(text).replace(/&(?:amp|quot|apos|lt|gt|#(?:x[0-9a-f]+|[0-9]+));/gi,token=>{
    const named={'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>'};
    const key=token.toLowerCase();
    if(named[key]) return named[key];
    const num=key.startsWith('&#x')?parseInt(key.slice(3,-1),16):parseInt(key.slice(2,-1),10);
    return Number.isInteger(num)&&num>0&&num<=0x10ffff ? String.fromCodePoint(num) : '';
  });
}
function parseMusicList(xml) {
  if (!/<ListBucketResult\b/.test(xml)) throw new Error('Unexpected music storage response');
  const keys = [];
  for (const part of xml.match(/<Contents>[\s\S]*?<\/Contents>/g) || []) {
    const m=part.match(/<Key>([\s\S]*?)<\/Key>/);
    if (m) {
      const key=unescapeXml(m[1]);
      if (musicTrackFromKey(key)) keys.push(key);
    }
  }
  const more=/<IsTruncated>\s*true\s*<\/IsTruncated>/i.test(xml);
  const token=xml.match(/<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/)?.[1];
  if (more && !token) throw Error('Incomplete music listing');
  return {keys,continuationToken:more?unescapeXml(token):''};
}
async function listMusicTracks({env=process.env,fetchImpl=fetch,now=()=>new Date()}={}) {
  const found = new Map();
  let token='';
  // Bounded on-demand read: at most three LIST requests, no scheduler/poll.
  for (let page=0;page<3;page++) {
    const signed=authorizedMusicListRequest(env,token,now());
    const response=await fetchImpl(signed.url,{
      method:'GET',headers:signed.headers,signal:AbortSignal.timeout(12000),
    });
    if (!response.ok) throw Error('Music storage listing failed (HTTP '+response.status+')');
    const body=await response.text();
    if (body.length>1000000) throw Error('Music storage listing too large');
    const parsed=parseMusicList(body);
    for(const key of parsed.keys) {
      const track=musicTrackFromKey(key);
      if (track && found.size<200) found.set(track.id,track);
    }
    if (!parsed.continuationToken || found.size>=200) break;
    token=parsed.continuationToken;
  }
  return [...found.values()].sort((a,b)=>a.level.localeCompare(b.level)||a.day-b.day||a.title.localeCompare(b.title));
}
module.exports={musicKeyFromAutoId,musicTrackFromKey,authorizedMusicListRequest,parseMusicList,listMusicTracks};
