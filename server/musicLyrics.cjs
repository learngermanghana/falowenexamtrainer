'use strict';
const { musicTrackFromKey, musicKeyFromAutoId } = require('./musicDiscovery.cjs');
const { signObject } = require('./courseMusic.cjs');
const catalog = require('../web/public/music/catalog.json');
const builtInTimings = require('../web/public/music/timings.json');
const approvedRecordingLyrics = require('../web/public/music/approved-recording-lyrics.json');
function validateLyrics(data, objectKey) {
  if (!data || data.objectKey !== objectKey) return null;
  if (data.cues !== undefined && !Array.isArray(data.cues)) return null;
  const cuesInput = data.cues || [];
  if (cuesInput.length > 500) return null;
  const lyrics = typeof data.lyrics === 'string' ? data.lyrics : cuesInput.map(c => c?.text || '').join('\n');
  if (!lyrics.trim() || lyrics.length > 60000) return null;
  const lines = lyrics.replace(/\\n/g, '\n').split(/\r?\n/).map(s => s.trim()).filter(s => s && !/^\[.*\]$/.test(s));
  if (!lines.length || lines.length > 500 || lines.some(line => line.length > 1000)) return null;
  // Matching .lyrics.json files may be published before manual cue timing.
  // Display readable lyrics without claiming synchronized highlighting.
  if (!cuesInput.length) return { objectKey, lyrics, cues: [] };
  if (lines.length !== cuesInput.length) return null;
  let previous = -1;
  const cues = [];
  for (let i = 0; i < lines.length; i++) {
    const cue = cuesInput[i];
    if (!lines[i] || lines[i].length > 1000 || cue?.text !== lines[i] || !Number.isFinite(cue.start) || cue.start < 0 || cue.start > 7200 || cue.start <= previous) return null;
    if (cue.end !== undefined && (!Number.isFinite(cue.end) || cue.end <= cue.start || cue.end > 7200)) return null;
    cues.push({start:cue.start,text:cue.text,...(cue.end !== undefined ? {end:cue.end} : {})}); previous = cue.start;
  }
  return { objectKey, lyrics, cues };
}
async function readBounded(response) {
  if (Number(response.headers.get('content-length')) > 100000) throw Error('Lyrics file too large');
  const reader=response.body.getReader(); const chunks=[]; let size=0;
  try { while(true) { const {done,value}=await reader.read(); if(done) break; size+=value.byteLength; if(size>100000) throw Error('Lyrics file too large'); chunks.push(Buffer.from(value)); } }
  finally { await reader.cancel().catch(()=>{}); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
function createLyricsHandler({env=process.env,fetchImpl=fetch,timings=builtInTimings,approvedLyrics=approvedRecordingLyrics}={}) {
  return async (req,res) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Cache-Control','public, max-age=30, s-maxage=60');
    if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
    const id=typeof req.query?.track==='string'?req.query.track:'';
    const key=typeof req.query?.key==='string'?req.query.key:'';
    const pinned=catalog.tracks.find(t=>t.id===id && t.approved===true);
    const objectKey=key || pinned?.objectKey || musicKeyFromAutoId(id);
    if(!musicTrackFromKey(objectKey)) return res.status(404).json({error:'Lyrics not published'});
    const recorded = timings.recordings?.find(pack => pack.objectKey === objectKey);
    const checkedRecording = validateLyrics(recorded, objectKey);
    if (checkedRecording) return res.status(200).json(checkedRecording);
    // Exact-object owner lyrics remain readable before manual timing exists.
    // A valid uploaded sidecar still takes precedence so reviewed cues can be added later.
    const approved = approvedLyrics.recordings?.find(pack => pack.objectKey === objectKey);
    const fallback = approved && (!approved.cues || !approved.cues.length) ? validateLyrics(approved, objectKey) : null;
    const sendFallback = () => res.status(200).json({...fallback, source:'owner-supplied', timingStatus:'missing'});
    try {
      const timingKey=objectKey.replace(/\.mp3$/i,'.lyrics.json');
      const signed=signObject({key:timingKey},env);
      const response=await fetchImpl(signed.url,{signal:AbortSignal.timeout(10000)});
      if(response.status===404) return fallback ? sendFallback() : res.status(404).json({error:'Lyrics not published'});
      if(!response.ok) throw Error('Lyrics storage unavailable');
      const checked=validateLyrics(await readBounded(response),objectKey);
      if(!checked) return fallback ? sendFallback() : res.status(422).json({error:'Lyrics timing does not match this recording'});
      return res.status(200).json(checked);
    } catch { if(fallback) return sendFallback(); res.setHeader('Cache-Control','no-store'); return res.status(503).json({error:'Lyrics temporarily unavailable'}); }
  };
}
module.exports={validateLyrics,createLyricsHandler};
