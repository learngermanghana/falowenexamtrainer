const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeMockAttempt, normalizeBrowserProgress, listMockAttempts } = require("../mockAttemptMonitor");

test("mock monitor exposes sections, deadlines and status, never student answer data", () => {
  const doc = {
    id: "a",
    ref: { path: "a2MockExamUsers/uid123/attempts/a" },
    data: () => ({
      uid: "uid123", email: "student@example.org", mockId: "a2-mock-01",
      status: "in_progress", section: "hoeren", attemptNumber: 2,
      sectionScores: { lesen: 17, hoeren: null }, startedAt: "2026-10-09T11:00:00Z",
      updatedAt: "2026-10-09T11:15:00Z",
      state: {
        stage: "hoeren", sectionDeadlineMs: 1791546000000,
        lesenAnswers: { hidden: "secret" }, schreibenText: "private text",
      },
    }),
  };
  const projected = normalizeMockAttempt(doc);
  assert.equal(projected.level, "A2");
  assert.equal(projected.section, "hoeren");
  assert.deepEqual(projected.completedSections, ["lesen"]);
  assert.equal(projected.progressCount, 1);
  assert.equal(projected.sectionDeadlineMs, 1791546000000);
  assert.equal(JSON.stringify(projected).includes("private text"), false);
  assert.equal(JSON.stringify(projected).includes("secret"), false);
});
test("monitor excludes unrelated nested attempts and only reports verified completed scores", () => {
  assert.equal(normalizeMockAttempt({ id:"x", ref:{path:"writingProgress/uid/attempts/x"}, data:()=>({}) }),null);
  const completed = normalizeMockAttempt({
    id:"b", ref:{path:"b1MockExamUsers/uid/attempts/b"},
    data:()=>({ status:"completed", sectionScores:{lesen:0,hoeren:10}, overall:{score:99}, verifiedOverall:{score:80} }),
  });
  assert.equal(completed.overallScore,80);
  assert.equal(completed.progressCount,2);
});
test("mock list filters attempts before returning them to staff", async () => {
  const doc = {id:"a",ref:{path:"a1MockExamUsers/uid/attempts/a"}, data:()=>({status:"in_progress"})};
  const fakeDb = {collectionGroup:() => ({ orderBy:() => ({ limit:() => ({get:async()=>({docs:[doc],size:1})}) }) })};
  const result = await listMockAttempts(fakeDb);
  assert.equal(result.attempts.length,1);
  assert.equal(result.partial,false);
});

test("browser-reported A2 Mock 2 activity is sanitized and never treated as a verified score", () => {
 const row = normalizeBrowserProgress({data:()=>({
   uid:"student",mockId:"a2-mock-02",section:"schreiben",status:"in_progress",
   completedSections:["lesen","hoeren"],sectionDeadlineMs:1791546000000,
   rawAnswers:{"x":"private"},
 })});
 assert.equal(row.level,"A2");
 assert.equal(row.progressCount,2);
 assert.equal(row.overallScore,null);
 assert.equal(row.progressSource,"browser_reported");
 assert.equal(JSON.stringify(row).includes("private"),false);
});
