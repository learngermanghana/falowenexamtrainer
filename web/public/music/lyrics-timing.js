export function lyricLines(text = '') {
  return String(text).replace(/\\n/g, '\n').split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!/^\[.*\]$/.test(s));
}
export function validateCues(cues, lyrics) {
  const lines=lyricLines(lyrics);
  if(!Array.isArray(cues)||!lines.length||cues.length!==lines.length) return [];
  let previous=-1;
  for(let i=0;i<lines.length;i++) {
    if(cues[i]?.text!==lines[i]||!Number.isFinite(cues[i].start)||cues[i].start<0||cues[i].start<=previous) return [];
    if (cues[i].end !== undefined && (!Number.isFinite(cues[i].end) || cues[i].end <= cues[i].start)) return [];
    previous=cues[i].start;
  }
  return cues;
}
export function activeLyricIndex(cues,time) {
  if(!Number.isFinite(time)) return -1;
  for(let i=cues.length-1;i>=0;i--) if(time>=cues[i].start) return cues[i].end === undefined || time < cues[i].end ? i : -1;
  return -1;
}
