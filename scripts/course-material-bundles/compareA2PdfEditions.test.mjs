import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { PDFDocument } from "pdf-lib";

test("edition comparison confirms the 356-page identity without exposing original learner text", async () => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"a2-edition-test-"));
  try {
    const original=await PDFDocument.create();
    for(let i=0;i<356;i++) original.addPage();
    original.getPage(0).drawText("Draft saved: PRIVATE_LEARNER. wanted todo.");
    fs.writeFileSync(path.join(dir,"original.pdf"),await original.save());
    const corrected=await PDFDocument.create();
    corrected.addPage().drawText("Worked example: Ich konnte schwimmen.");
    fs.writeFileSync(path.join(dir,"corrected.pdf"),await corrected.save());
    const run=(originalName="original.pdf") => spawnSync(process.execPath,[
      "scripts/course-material-bundles/compareA2PdfEditions.mjs",path.join(dir,originalName),
      path.join(dir,"corrected.pdf"),path.join(dir,"report.json"),
    ],{encoding:"utf8"});
    const result=run();
    assert.equal(result.status,0,result.stderr);
    const report=JSON.parse(fs.readFileSync(path.join(dir,"report.json"),"utf8"));
    assert.equal(report.original.matchesReported356Pages,true);
    assert.equal(report.original.joinedDay13Text,true);
    assert.deepEqual(report.original.safetyFindings,["saved learner work"]);
    assert.doesNotMatch(result.stdout,/PRIVATE_LEARNER/);
    assert.equal(run("unavailable.pdf").status,0);
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir,"report.json"))).original.comparisonPending,true);
    const unsafe=await PDFDocument.create();
    unsafe.addPage().drawText("Draft saved: PRIVATE_LEARNER");
    fs.writeFileSync(path.join(dir,"corrected.pdf"),await unsafe.save());
    const blocked=run();
    assert.notEqual(blocked.status,0);
    assert.match(blocked.stderr,/safety preflight failed/);
    assert.doesNotMatch(blocked.stderr,/PRIVATE_LEARNER/);
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
