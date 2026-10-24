import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const manifest = JSON.parse(read("functions/data/answerKeyManifest.json"));
const listening = read("web/src/data/b1ListeningTasks.js");
const reading = read("web/src/data/b1ReadingTasks.js");
const day25Page = read("web/src/components/B1Day25OnlineShoppingRightsRisksWorkbookPage.js");
const day26Page = read("web/src/components/B1Day26ReiseproblemeLoesungenWorkbookPage.js");

function keyFor(id) {
  const matches=Object.values(manifest).filter(row=>row.assignment_id===id);
  assert.equal(matches.length,1,`Must have one authoritative Firebase key for ${id}`);
  return matches[0].answers;
}
function block(src,day,kind) {
  const head=kind==="listening" ? `  ${day}: task({` : `  ${day}: Object.freeze({`;
  const tail=kind==="listening" ? `  ${day+1}: task({` : `  ${day+1}: Object.freeze({`;
  const a=src.indexOf(head),b=src.indexOf(tail,a+head.length);
  assert.ok(a>=0 && b>a, `Day ${day} ${kind} registry entry must exist`);
  return src.slice(a,b);
}
function extractOptions(section,kind) {
  // These registries encode each response choice as a literal array on one
  // line. Deliberately fail if their format changes; no silent stale marking.
  const regex=kind==="listening" ? /\bq\(".*?",\s*(\[[^\n]*\])\)/g : /\boptions:\s*(\[[^\n]*\])/g;
  return [...section.matchAll(regex)].map(match=>JSON.parse(match[1]));
}
function answerList(keyPart) {
  const n=Object.keys(keyPart||{}).length;
  return Array.from({length:n},(_,i)=>{
    const answer=keyPart[`Answer${i+1}`];
    assert.match(answer,/^[A-F0]\) /i,`Answer${i+1} needs a marked option`);
    return answer;
  });
}
function matchOptions(id,day,part,kind,source,expectedLetters) {
  const section=block(source,day,kind);
  const options=extractOptions(section,kind);
  const answers=answerList(keyFor(id)[part]);
  assert.equal(options.length,expectedLetters.length,`${id}/${part}: current learner task count`);
  assert.equal(answers.length,options.length,`${id}/${part}: Firebase bundled task count`);
  assert.deepEqual(answers.map(x=>x[0].toUpperCase()),expectedLetters);
  for(let i=0;i<answers.length;i++){
    const letters=options[i].map(x=>x.match(/^[A-F0]\)/i)?.[0]?.[0].toUpperCase());
    const letter=answers[i][0].toUpperCase();
    const idx=letters.indexOf(letter);
    assert.ok(idx>=0,`${id}/${part} item ${i+1} has no option ${letter}`);
    const selected=options[i][idx];
    // Matching adverts have a descriptive suffix in the staff key; the
    // displayed advert's title must still be an exact prefix of that key.
    const exactOrTitle=kind==="reading" && day===26
      ? answers[i].startsWith(selected)
      : answers[i].slice(3).trim().toLowerCase().replace(/[.]+$/,"")===
        selected.slice(3).trim().toLowerCase().replace(/[.]+$/,"");
    assert.ok(exactOrTitle,`${id}/${part} item ${i+1}: old answer text or changed learner option`);
  }
}
test("Day 25 bundled Lesen/Hören keys match 7+7 actual learner options",()=>{
  matchOptions("B1-8.25",25,"teil3","reading",reading,["B","B","B","A","A","A","C"]);
  matchOptions("B1-8.25",25,"teil4","listening",listening,["B","C","A","B","A","C","B"]);
  const section=block(listening,25,"listening");
  assert.match(section,/audioKey: "b1\/day-25\/day-25\.mp3"/);
  assert.match(section,/submitRequired: true/);
});
test("Day 26 bundled Lesen/Hören keys match 4+5 actual learner options",()=>{
  matchOptions("B1-9.26",26,"teil3","reading",reading,["A","C","B","E"]);
  matchOptions("B1-9.26",26,"teil4","listening",listening,["A","B","B","B","A"]);
  const section=block(listening,26,"listening");
  assert.match(section,/audioKey: "b1\/day-26\/day-26\.mp3"/);
  assert.match(section,/submitRequired: true/);
});
test("Public submission instructions do not reveal full or partial answer sequences",()=>{
  const notes=[
    ...[block(reading,25,"reading"),block(reading,26,"reading"),
        block(listening,25,"listening"),block(listening,26,"listening")]
      .flatMap(x=>[...x.matchAll(/submissionNote: "([^"]*)"/g)].map(m=>m[1])),
    ...[day25Page,day26Page].flatMap(x=>[...x.matchAll(/submitReadingDescription: "([^"]*)"/g)].map(m=>m[1]))
  ];
  assert.equal(notes.length,6,"Four registry notes and two submission descriptions must be covered");
  for(const note of notes){
    assert.doesNotMatch(note,/\b[1-9][A-F0](?:[,;\s]+[1-9][A-F0])+/i,`Leaking chosen answers in: ${note}`);
    assert.doesNotMatch(note,/\b(?:[1-9][A-F0][,;\s]*){2,}/i);
  }
});
