import { isDifferentLiveSpeakSessionContext, liveSpeakSessionContext } from "./liveSpeakSessionContext";

const saved = { level:"B1", topic:"Nachhaltige Mobilität", source:"exam-speaking-practice" };

test("displayed context stays on the backend session when a same-source prompt changes", () => {
  expect(liveSpeakSessionContext(saved, {level:"A2",topic:"Im Restaurant",source:"exam-speaking-practice"}))
    .toEqual(saved);
  expect(isDifferentLiveSpeakSessionContext(saved, {level:"B1",topic:"Im Restaurant",source:"exam-speaking-practice"}))
    .toBe(true);
  expect(isDifferentLiveSpeakSessionContext(saved, {level:"A2",topic:saved.topic,source:"exam-speaking-practice"}))
    .toBe(true);
});

test("same context does not show an unnecessary warning; whitespace matches server normalization", () => {
  expect(isDifferentLiveSpeakSessionContext(saved,{level:"b1",topic:"  Nachhaltige  Mobilität  ",source:"exam-speaking-practice"})).toBe(false);
  expect(isDifferentLiveSpeakSessionContext(saved,{level:"B1",topic:saved.topic,source:"course-workbook"})).toBe(true);
  expect(isDifferentLiveSpeakSessionContext(null,{level:"B1",topic:"Im Restaurant",source:"course-workbook"})).toBe(false);
  expect(liveSpeakSessionContext(null,{level:"A2",topic:"Im Restaurant",source:"course-workbook"}))
    .toEqual({level:"A2",topic:"Im Restaurant",source:"course-workbook"});
});

test("empty saved topic stays empty instead of pretending to use a new lesson topic", () => {
  const empty = {level:"B2",topic:"",source:"standalone"};
  expect(liveSpeakSessionContext(empty,{level:"B2",topic:"Klimaschutz",source:"standalone"}).topic).toBe("");
  expect(isDifferentLiveSpeakSessionContext(empty,{level:"B2",topic:"Klimaschutz",source:"standalone"})).toBe(true);
});

test("different examiner task IDs are detected even with identical topic labels", () => {
  const saved = {level:"B1",topic:"Gesundheit",source:"exam-speaking-practice",examTask:{id:"card-1"}};
  expect(isDifferentLiveSpeakSessionContext(saved,{...saved,examTask:{id:"card-2"}})).toBe(true);
  expect(isDifferentLiveSpeakSessionContext(saved,{...saved})).toBe(false);
});
