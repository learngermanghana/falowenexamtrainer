'use strict';
// Owner-only publication of a reviewed lyric sidecar alongside the exact R2 MP3.
// The Firebase token and R2 credentials never reach the browser or video export.
const crypto = require('node:crypto');
const { isSwahiliMusicKey } = require('./swahiliMusic.cjs');
const {musicTrackFromKey} = require('./musicDiscovery.cjs');
const {signObject} = require('./courseMusic.cjs');
const {validateLyrics,sameSungLines} = require('./musicLyrics.cjs');
const approved = require('../web/public/music/approved-recording-lyrics.json');
const DEFAULT_OWNER_UID_SHA256 = 'e8bc09aac410e86216e384ab4c612d6ac6551273085f8344206b23f4004f90a1';

function ownerAllowed(uid,env=process.env) {
  const configured=String(env.MUSIC_STUDIO_OWNER_UID || env.HOEREN_STUDIO_OWNER_UID || '').trim();
  if (configured) return uid===configured;
  const hash=crypto.createHash('sha256').update(String(uid||'')).digest();
  return crypto.timingSafeEqual(hash,Buffer.from(DEFAULT_OWNER_UID_SHA256,'hex'));
}
function validateTimingUpload(body) {
  const key=body?.objectKey;
  if(typeof key!=='string' || (!musicTrackFromKey(key) && !isSwahiliMusicKey(key))) throw Object.assign(new Error('Choose an exact published music MP3 key.'),{status:400});
  const checked=validateLyrics(body,key);
  if (!checked || !checked.cues.length || !Number.isInteger(body.version) || body.version!==1)
    throw Object.assign(new Error('Review and mark every lyric line before saving shared timing.'),{status:400});
  if (Buffer.byteLength(JSON.stringify({version:1,...checked}),'utf8')>100000)
    throw Object.assign(new Error('Lyric timing exceeds the file size limit.'),{status:413});
  const pinned=approved.recordings.find(row=>row.objectKey===key);
  if ((pinned?.recordingSha256 || pinned?.strictRecordingLyrics) && !sameSungLines(checked.lyrics,pinned.lyrics))
    throw Object.assign(new Error('These lyrics do not match the approved recording. Confirm the exact MP3 and lyric text.'),{status:409});
  return {version:1,...checked};
}
function createSaveHandler({env=process.env,fetchImpl=fetch}={}) {
  return async(req,res)=>{
    const origin=String(req.headers?.origin||'');
    if(origin==='https://admin.falowen.app'){
      res.setHeader('Access-Control-Allow-Origin',origin);
      res.setHeader('Vary','Origin');
    }
    res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    if(req.method==='OPTIONS')return res.status(204).end();
    if(req.method!=='POST')return res.status(405).json({ok:false,error:'Method not allowed.'});
    if(origin && origin!=='https://admin.falowen.app')return res.status(403).json({ok:false,error:'Open Music Studio in Falowen Admin.'});
    try {
      const token=String(req.headers?.authorization||'').match(/^Bearer (.+)$/i)?.[1];
      if(!token)return res.status(401).json({ok:false,error:'Sign in to Falowen Admin first.'});
      const key=String(env.FIREBASE_API_KEY||env.REACT_APP_FIREBASE_API_KEY||'').trim();
      if(!key)return res.status(503).json({ok:false,error:'Music authentication is not configured.'});
      const identity=await fetchImpl('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='+encodeURIComponent(key),{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({idToken:token}),signal:AbortSignal.timeout(10000),
      });
      const account=identity.ok?(await identity.json()).users?.[0]:null;
      if(!account?.localId || account.disabled)return res.status(401).json({ok:false,error:'Your Falowen session has expired.'});
      if(!ownerAllowed(account.localId,env))return res.status(403).json({ok:false,error:'Only the Music Studio owner can publish shared timing.'});
      const payload=validateTimingUpload(req.body);
      const mp3=signObject({key:payload.objectKey},env);
      const existence=await fetchImpl(mp3.url,{method:'GET',headers:{Range:'bytes=0-0'},signal:AbortSignal.timeout(10000)});
      try{await existence.body?.cancel?.();}catch{}
      if(existence.status===404)return res.status(404).json({ok:false,error:'This MP3 was not found in the published music bucket.'});
      if(!existence.ok)return res.status(503).json({ok:false,error:'Could not verify the published MP3. Nothing was saved.'});
      const timingKey=payload.objectKey.replace(/\.mp3$/i,'.lyrics.json');
      const url=signObject({key:timingKey},env,new Date(),'PUT').url;
      const saved=await fetchImpl(url,{
        method:'PUT',headers:{'Content-Type':'application/json; charset=utf-8'},
        body:JSON.stringify(payload),signal:AbortSignal.timeout(15000),
      });
      if(!saved.ok)return res.status(503).json({ok:false,error:'Cloudflare could not save the timing file. Your local marks are still available.'});
      return res.status(200).json({ok:true,saved:true,objectKey:payload.objectKey,cueCount:payload.cues.length});
    }catch(error){
      return res.status(error.status||503).json({ok:false,error:error.status?error.message:'Could not save timing. Your marks remain in the editor.'});
    }
  };
}
module.exports={ownerAllowed,validateTimingUpload,createSaveHandler};
