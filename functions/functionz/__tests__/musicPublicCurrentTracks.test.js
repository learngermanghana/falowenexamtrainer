const fs=require('node:fs');
const path=require('node:path');
const music=path.resolve(__dirname,'../../../web/public/music');
const read=name=>JSON.parse(fs.readFileSync(path.join(music,name),'utf8'));
const catalog=read('catalog.json');
const lessons=read('learning.json').lessons;
const recordings=read('approved-recording-lyrics.json').recordings;
const timing=read('timings.json').recordings;
test('public catalog lists latest approved classroom recordings without older A1 versions',()=>{
  const pins=catalog.tracks.filter(t=>t.approved===true);
  expect(pins).toHaveLength(10);
  const keys=pins.map(t=>t.objectKey);
  expect(new Set(keys).size).toBe(keys.length);
  expect(keys).not.toContain('music/a1/day-04/welche-nummer-hast-du.mp3');
  expect(keys).not.toContain('music/a1/day-22/mein-kopf-tut-weh.mp3');
  expect(pins.find(t=>t.assignmentKey==='A1-2').title).toBe('Meine Nummer, meine Adresse');
  expect(pins.find(t=>t.assignmentKey==='A1-14.1').title).toBe('Arzttermin');
  for(const t of pins){
    expect(t.audioUrl).toBe('https://www.falowen.app/api/music?track='+t.id);
    expect(t.objectKey.startsWith('music/'+t.level.toLowerCase()+'/day-'+String(t.day).padStart(2,'0')+'/')).toBe(true);
  }
});
test('A2 Day 24 and Day 25 have separate URL and lyrics despite shared filename',()=>{
  const p24=catalog.tracks.find(x=>x.assignmentKey==='A2-9.24');
  const p25=catalog.tracks.find(x=>x.assignmentKey==='A2-9.25');
  expect(p24.objectKey).toBe('music/a2/day-24/Endlich Urlaub.mp3');
  expect(p25.objectKey).toBe('music/a2/day-25/Endlich Urlaub.mp3');
  expect(p24.id).not.toBe(p25.id);
  expect(p25.id).toBe('r2-a2-day-25-b64_RW5kbGljaCBVcmxhdWIubXAz');
  for(const t of [p24,p25]){
    const pack=recordings.find(x=>x.objectKey===t.objectKey);
    expect(pack.trackId).toBe(t.id);
    expect(pack.cues).toEqual([]);
    expect(lessons[t.id].lyrics).toBe(pack.lyrics);
    expect(lessons[t.id].questions).toHaveLength(3);
  }
  const uploaded=recordings.find(x=>x.trackId===p25.id);
  expect(uploaded.duration).toBe(177.12);
  expect(uploaded.recordingSha256).toBe('84d4697e7c03467ae8bbe2b13e6e8700029f2e3bbb287d1ba9067cea0791fd29');
  expect(uploaded.lyrics).toContain('Mein Zug fährt schon um acht Uhr ab.');
  expect(uploaded.lyrics).not.toContain('Früher bin ich sehr spät aufgestanden');
  expect(uploaded.lyrics.split('\n').filter(x=>x.trim()&&!x.startsWith('['))).toHaveLength(49);
});
test('retired static timing packs cannot reactivate old learning tracks',()=>{
  expect(timing.some(x=>x.objectKey==='music/a1/day-04/welche-nummer-hast-du.mp3')).toBe(false);
  expect(timing.some(x=>x.objectKey==='music/a1/day-22/mein-kopf-tut-weh.mp3')).toBe(false);
  expect(lessons['a1-day-04-numbers']).toBeUndefined();
  expect(lessons['a1-day-22-health']).toBeUndefined();
  const app=fs.readFileSync(path.join(music,'app.js'),'utf8');
  expect(app).toContain('publishedDays.has(track.level+":"+track.day)');
  expect(app).toContain('catalog=[...pinnedTracks,...dynamic.filter(');
});
