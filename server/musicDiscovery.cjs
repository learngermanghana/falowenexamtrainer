'use strict';
// On-demand public music discovery. Listing is restricted to music/ and never
// exposes the bucket, keys outside that namespace, or storage credentials.
// Uploading to music/<level>/day-XX/ is intentionally a publication action.
const crypto = require('node:crypto');
const { getR2AudioConfig } = require('../functions/functionz/r2CourseAudio');
const LEVELS = new Set(['A1','A2','B1','B2','C1','C2']);
const OBJECT_KEY = /^music\/(a1|a2|b1|b2|c1|c2)\/day-(0[1-9]|1[0-9]|2[0-8])\/([A-Za-z0-9 _()\-]{1,150})\.mp3$/i;
const AUTO_ID = /^r2-(a1|a2|b1|b2|c1|c2)-day-(0[1-9]|1[0-9]|2[0-8])-([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const enc = value => encodeURIComponent(String(value)).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase());
const hmac = (key,msg) => crypto.createHmac('sha256',key).update(msg).digest();
function musicKeyFromAutoId(id) {
  const encoded=String(id || '').match(/^r2-(a1|a2|b1|b2|c1|c2)-day-(0[1-9]|1[0-9]|2[0-8])-b64_([a-zA-Z0-9_-]{4,220})$/);
  if (encoded) {
    try {
      const name=Buffer.from(encoded[3],'base64url').toString('utf8');
      const match=musicTrackFromKey('music/'+encoded[1]+'/day-'+encoded[2]+'/'+name);
      if(match && match.id === id) return match.objectKey;
    } catch {}
    return '';
  }
  const match = String(id || '').match(AUTO_ID);
  return match ? 'music/' + match[1] + '/day-' + match[2] + '/' + match[3] + '.mp3' : '';
}
function musicTrackFromKey(key) {
  const match = String(key || '').match(OBJECT_KEY);
  if (!match || match[3].trim().length < 1) return null;
  const level = match[1].toUpperCase();
  if (!LEVELS.has(level)) return null;
  const filename=match[3]+'.mp3';
  const isSlug=/^[a-z0-9]+(?:-[a-z0-9]+)*\.mp3$/.test(filename);
  const suffix=isSlug?match[3]:'b64_'+Buffer.from(filename,'utf8').toString('base64url');
  if(suffix.length>225) return null;
  const id = 'r2-' + match[1].toLowerCase() + '-day-' + match[2] + '-' + suffix;
  const name=match[3].replace(/[-_]+/g,' ').replace(/\s+/g,' ').trim();
  return {
    id, title:name.charAt(0).toUpperCase()+name.slice(1), level, day:Number(match[2]),
    topic:'Day '+Number(match[2])+' · German music',
    type:'Learning story', genre:'', language:'German',
    audioUrl:'https://www.falowen.app/api/music?track='+id,
    assignmentKey:'', coursebook:true, autoDiscovered:true,
    objectKey:key,
  };
}
function signatureForList(env=process.env, continuationToken='', now=new Date()) {
  const { accountId, accessKeyId, secretAccessKey, bucket } = getR2AudioConfig(env);
  const host = bucket+'.'+accountId+'.r2.cloudflarestorage.com';
  const stamp=now.toISOString().replace(/[:-]|\.\d{3}/g,'');
  const date=stamp.slice(0,8);
  const scope=date+'/auto/s3/aws4_request';
  const values=[
    ['list-type','2'],['max-keys','1000'],['prefix','music/'],
    ...(continuationToken ? [['continuation-token',continuationToken]] : []),
    ['X-Amz-Algorithm','AWS4-HMAC-SHA256'],
    ['X-Amz-Content-Sha256','UNSIGNED-PAYLOAD'],
    ['X-Amz-Credential',accessKeyId+'/'+scope],
    ['X-Amz-Date',stamp],
    ['X-Amz-Expires','60'],
    ['X-Amz-SignedHeaders','host'],
  ];
  const query = values.map(([k,v])=>[enc(k),enc(v)]).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>k+'='+v).join('&');
  const canonical = ['GET','/',query,'host:'+host+'\n','host','UNSIGNED-PAYLOAD'].join('\n');
  const digest=crypto.createHash('sha256').update(canonical).digest('hex');
  const toSign=['AWS4-HMAC-SHA256',stamp,scope,digest].join('\n');
  const secret=hmac(hmac(hmac(hmac('AWS4'+secretAccessKey,date),'auto'),'s3'),'aws4_request');
  const sig=crypto.createHmac('sha256',secret).update(toSign).digest('hex');
  return 'https://'+host+'/?'+query+'&X-Amz-Signature='+sig;
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
    const url=signatureForList(env,token,now());
    const response=await fetchImpl(url,{method:'GET',signal:AbortSignal.timeout(12000)});
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
module.exports={musicKeyFromAutoId,musicTrackFromKey,signatureForList,parseMusicList,listMusicTracks};
