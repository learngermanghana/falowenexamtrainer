import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const draft = JSON.parse(readFileSync(new URL("../web/src/data/mockDrafts/b1-mock-02-hoeren-teil-1.json", import.meta.url), "utf8"));
test("B1 Mock 2 Teil 1 stays a draft with canonical audio", () => {
 assert.equal(draft.mockId,"b1-mock-02"); assert.equal(draft.publicationStatus,"draft-teacher-review");
 assert.equal(draft.studentVisible,false); assert.equal(draft.audioObjectKey,"b1/mock-hoeren/mock-02/teil-1.mp3");
 assert.equal(draft.expectedPlaysPerText,2); assert.equal(draft.teacherReviewRequired,true);
});
test("B1 Mock 2 Teil 1 has five original recordings and ten unambiguous paired tasks", () => {
 assert.equal(draft.recordings.length,5); assert.equal(draft.questions.length,10);
 assert.deepEqual(draft.questions.map(q=>q.number),Array.from({length:10},(_,i)=>i+1));
 for(let i=1;i<=5;i++){ const items=draft.questions.filter(q=>q.textNumber===i);
  assert.equal(items.length,2); assert.deepEqual(items.map(q=>q.kind),["richtig-falsch","multiple-choice"]);
  for(const q of items){assert.ok(draft.recordings[i-1].transcript.includes(q.evidence));assert.ok(q.options.some(o=>o.id===q.answer));}
 }
});
test("Draft does not silently claim recorded audio has the revised instructions",()=>{
 assert.match(draft.audioVerification,/not independently checked/i);
 assert.ok(draft.issuesToResolveBeforeStudentPublication.some(x=>x.includes("introduction")));
});

test("uploaded recording QA is recorded but does not authorize student release",()=>{
 assert.equal(draft.audioReview.durationSeconds,333.624);
 assert.equal(draft.audioReview.fullSequenceRepetitionCount,2);
 assert.equal(draft.audioReview.secondPassStartSecondsApprox,169.78);
 assert.equal(draft.audioReview.playbackReadyForStudentRelease,false);
 assert.match(draft.audioReview.observedRecordedIntroduction,/eine Aufgabe/);
 assert.match(draft.audioReview.blocker,/mislead learners/);
});
