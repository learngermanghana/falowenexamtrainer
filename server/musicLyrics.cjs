'use strict';
const { musicTrackFromKey, musicKeyFromAutoId } = require('./musicDiscovery.cjs');
const { signObject } = require('./courseMusic.cjs');
const catalog = require('../web/public/music/catalog.json');
const builtInTimings = require('../web/public/music/timings.json');
const approvedRecordingLyrics = require('../web/public/music/approved-recording-lyrics.json');
const estimatedTimings = require('../web/public/music/estimated-timings.json');
const englishTranslations = require('../web/public/music/english-translations.json');
const studioDrafts = require('../web/public/music/studio-drafts.json');
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
function sameSungLines(a,b) {
  const lines=text => String(text||'')
    .replaceAll(String.fromCharCode(92)+'n',String.fromCharCode(10))
    .split(String.fromCharCode(10))
    .map(s=>s.trim()).filter(s=>s&&!(s.startsWith('[')&&s.endsWith(']')));
  return JSON.stringify(lines(a))===JSON.stringify(lines(b));
}
function validateEstimate(pack, objectKey, approved, studio=studioDrafts) {
  if (pack?.timingStatus !== 'estimated' || !/^[a-f0-9]{64}$/.test(pack.recordingSha256 || '') ||
      !Number.isFinite(pack.duration) || pack.duration <= 0 || pack.duration > 7200) return null;
  const checked=validateLyrics(pack,objectKey);
  if (!checked?.cues.length || checked.cues.some((cue,i)=>!Number.isFinite(cue.end) ||
      cue.end>pack.duration || (i>0 && cue.start<checked.cues[i-1].end))) return null;
  if (pack.transcriptionStatus === 'automatic') {
    const words=pack.wordTimestamps;
    if (!pack.referenceOnly || !Array.isArray(words) || !words.length || words.length>4000) return null;
    if (words.some((word,i)=>typeof word.text!=='string' || !word.text.trim() ||
      !Number.isFinite(word.start) || !Number.isFinite(word.end) || word.start<0 ||
      word.end<=word.start || word.end>pack.duration || (i>0 && word.start<words[i-1].start))) return null;
    let cursor=0;
    for (const cue of checked.cues) {
      const first=cursor;
      let text='';
      while (cursor<words.length && text.length<cue.text.length) {
        text+=(text?' ':'')+words[cursor++].text;
      }
      if (text!==cue.text || cursor===first ||
        Math.abs(cue.start-words[first].start)>.015 ||
        Math.abs(cue.end-words[cursor-1].end)>.015) return null;
    }
    if (cursor!==words.length) return null;
    return {...checked,referenceOnly:true,transcriptionStatus:'automatic',
      timingStatus:'estimated',recordingSha256:pack.recordingSha256};
  }
  if (!Number.isFinite(pack.matchCoverage) || pack.matchCoverage < .70 ||
      !Number.isFinite(pack.weakestLineCoverage) || pack.weakestLineCoverage < .45) return null;
  let draft=null;
  if (approved) {
    if (!sameSungLines(checked.lyrics,approved.lyrics)) return null;
  } else {
    draft=studio.tracks?.find(row=>row.assignmentKey===pack.assignmentKey && row.title===pack.draftTitle);
    if (!pack.referenceOnly || !draft || !objectKey.startsWith(
      `music/${draft.level.toLowerCase()}/day-${String(draft.day).padStart(2,'0')}/`) ||
      !sameSungLines(checked.lyrics,draft.lyrics)) return null;
  }
  return {...checked,timingStatus:'estimated',recordingSha256:pack.recordingSha256,
    ...(draft ? {referenceOnly:true,assignmentKey:pack.assignmentKey,draftTitle:pack.draftTitle} : {})};
}
// Recording identity comes from the exact storage path, never its display title.
function withEnglishTranslation(pack, translations=englishTranslations) {
  const lines=String(pack.lyrics||'').replace(/\\n/g,'\n').split(/\r?\n/)
    .map(line=>line.trim()).filter(line=>line&&!/^\[.*\]$/.test(line));
  const candidates=[...(translations.recordings||[]),
    ...(pack.referenceOnly && pack.transcriptionStatus!=='automatic' ? translations.drafts||[] : [])];
  const match=candidates.find(row=>row.objectKey===pack.objectKey &&
    Array.isArray(row.lines) && lines.length>0 && row.lines.length===lines.length &&
    row.lines.every((line,i)=>line.de===lines[i] && typeof line.en==='string' && line.en.trim()));
  return match ? {...pack,englishTranslation:{source:match.source||'recording',lines:match.lines}} : pack;
}
async function readBounded(response) {
  if (Number(response.headers.get('content-length')) > 100000) throw Error('Lyrics file too large');
  const reader=response.body.getReader(); const chunks=[]; let size=0;
  try { while(true) { const {done,value}=await reader.read(); if(done) break; size+=value.byteLength; if(size>100000) throw Error('Lyrics file too large'); chunks.push(Buffer.from(value)); } }
  finally { await reader.cancel().catch(()=>{}); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
function createLyricsHandler({env=process.env,fetchImpl=fetch,timings=builtInTimings,approvedLyrics=approvedRecordingLyrics,estimates=estimatedTimings}={}) {
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
    // R2 owner-reviewed sidecars override bundled cues. Bundled packs and
    // approved text remain read-only fallbacks if no matching sidecar exists.
    const approved = approvedLyrics.recordings?.find(pack => pack.objectKey === objectKey);
    const ownerFallback = approved ? validateLyrics(approved, objectKey) : null;
    const estimate=validateEstimate(estimates.recordings?.find(pack=>pack.objectKey===objectKey),objectKey,approved);
    const fallback = checkedRecording?.cues.length ? checkedRecording
      : ownerFallback?.cues.length ? ownerFallback : estimate || checkedRecording || ownerFallback;
    const sendFallback = () => res.status(200).json(withEnglishTranslation({...fallback,
      source:fallback===estimate ? 'acoustic-estimate' : checkedRecording ? 'bundled' : 'owner-supplied',
      timingStatus:fallback===estimate ? 'estimated' : checkedRecording ? 'published' : approved?.timingStatus || 'missing'}));
    try {
      const timingKey=objectKey.replace(/\.mp3$/i,'.lyrics.json');
      const signed=signObject({key:timingKey},env);
      const response=await fetchImpl(signed.url,{signal:AbortSignal.timeout(10000)});
      if(response.status===404) return fallback ? sendFallback() : res.status(404).json({error:'Lyrics not published'});
      if(!response.ok) throw Error('Lyrics storage unavailable');
      const checked=validateLyrics(await readBounded(response),objectKey);
      if(!checked) return fallback ? sendFallback() : res.status(422).json({error:'Lyrics timing does not match this recording'});
      // Never allow a stale R2 sidecar to resurrect earlier lyrics after the
      // teacher replaces a recording at the same filename. Compare sung lines,
      // ignoring [Verse] headers, against the owner-approved MP3 transcript.
      if((approved?.recordingSha256 || approved?.strictRecordingLyrics) && !sameSungLines(checked.lyrics,approved.lyrics))
        return fallback ? sendFallback() : res.status(422).json({error:'Stale lyrics for published recording'});
      // An exact-wording but untimed sidecar must not disable waveform-guided
      // fallback cues for this fingerprinted recording. Reviewed R2 cues still win.
      if(fallback?.cues?.length && !checked.cues?.length && sameSungLines(checked.lyrics,fallback.lyrics))
        return sendFallback();
      return res.status(200).json(withEnglishTranslation(checked));
    } catch { if(fallback) return sendFallback(); res.setHeader('Cache-Control','no-store'); return res.status(503).json({error:'Lyrics temporarily unavailable'}); }
  };
}
module.exports={withEnglishTranslation,validateLyrics,sameSungLines,validateEstimate,createLyricsHandler};
