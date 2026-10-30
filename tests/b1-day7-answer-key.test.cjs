const test=require('node:test');const assert=require('node:assert/strict');
const manifest=require('../functions/data/answerKeyManifest.json');
test('B1 Day 7 keeps all 12 reading answers and only the five actual listening answers',()=>{
 const entry=Object.values(manifest).find(r=>r.assignment_id==='B1-3.7');
 assert.deepEqual(Object.values(entry.answers.teil3).map(s=>s[0]),['A','B','B','B','B','C','A','F','B','C','D','E']);
 assert.deepEqual(Object.keys(entry.answers.teil4),['Answer1','Answer2','Answer3','Answer4','Answer5']);
 assert.deepEqual(Object.values(entry.answers.teil4).map(s=>s[0]),['B','B','A','A','B']);
 assert.ok(Object.values(entry.answers.teil4).every(s=>!/Anzeige|Werbung|Restaurant|Rabatt/.test(s)));
});
