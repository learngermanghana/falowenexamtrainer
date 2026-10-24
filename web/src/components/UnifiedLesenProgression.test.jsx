import fs from "fs";
import path from "path";
import { READING_LEVELS, readingTimeLabel } from "./ReadingPracticeShell";
import { A1_READING_PRACTICE_SAMPLES } from "./A1ReadingPracticeSamples";
import { A2_READING_PRACTICE_SAMPLES } from "./A2ReadingPracticeSamples";
import { B1_READING_PRACTICE_SAMPLES } from "../data/b1ReadingPracticeSamples";

const read=p=>fs.readFileSync(path.resolve(__dirname,p),"utf8");
test("Every Lesen level has a defined common progression and honest availability",()=>{
 expect(Object.keys(READING_LEVELS)).toEqual(["A1","A2","B1","B2","C1","C2"]);
 expect(READING_LEVELS.A1).toMatchObject({questions:15,parts:3,minutes:25,samples:3});
 expect(READING_LEVELS.A2).toMatchObject({questions:20,parts:4,minutes:30,samples:3});
 expect(READING_LEVELS.B1).toMatchObject({questions:30,parts:5,minutes:65,samples:3});
 expect(READING_LEVELS.B2.samples).toBe(0);
 expect(READING_LEVELS.C1.samples).toBe(1);
 expect(READING_LEVELS.C2.samples).toBe(0);
 expect(A1_READING_PRACTICE_SAMPLES).toHaveLength(3);
 expect(A2_READING_PRACTICE_SAMPLES).toHaveLength(3);
 expect(B1_READING_PRACTICE_SAMPLES).toHaveLength(3);
});
test("Shared shell exposes progress and previous/next controls for all three available practice banks",()=>{
 for(const p of ["A1ReadingPracticeSamples.jsx","A2ReadingPracticeSamples.jsx","B1ReadingPracticeSamples.jsx"]){
  const src=read(p);
  expect(src).toContain("<ReadingPracticeHeader");
  expect(src).toContain("<ReadingPartNavigation");
  expect(src).toContain("<ReadingPartFooter");
 }
 expect(read("../App.js")).toContain('path="/exams/:section/:practiceLevel"');
 const page=read("LesenPage.js");
 expect(page).toContain('READING_LEVELS');
 expect(page).toContain('onLevelChange={changeLevel}');
});
test("B1 restores answer drafts by student and submits at timeout",()=>{
 const src=read("B1ReadingPracticeSamples.jsx");
 expect(src).toContain('falowen:exams:lesen:b1:three-samples:');
 expect(src).toContain('saved.answersBySample');
 expect(src).toContain('window.localStorage.setItem(storageKey');
 expect(src).toContain('submit(true)');
 expect(src).toContain('deadlineBySample');
});
test("Reading clock is consistently formatted",()=>{
 expect(readingTimeLabel(3900)).toBe("65:00");
 expect(readingTimeLabel(120)).toBe("02:00");
 expect(readingTimeLabel(-4)).toBe("00:00");
});
