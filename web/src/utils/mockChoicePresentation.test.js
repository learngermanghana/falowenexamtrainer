import fs from "node:fs";
import path from "node:path";
import { arrangeMockChoices, mockDisplayAnswer } from "./mockChoicePresentation";
import { A2_MOCK_2_LESEN_QUESTIONS } from "../data/a2Mock2Lesen";
import { A2_MOCK_2_HOEREN } from "../data/a2Mock2Hoeren";

const webRoot = path.resolve(process.cwd(), "src");

test("stable shuffled letters preserve each original answer ID and its content", () => {
  const options = [
    {id:"a",label:"Apfel"},
    {id:"b",label:"Brot"},
    {id:"c",label:"Kaffee"},
  ];
  const view = arrangeMockChoices(options, "a2-mock2-hoeren-11");
  expect(arrangeMockChoices(options, "a2-mock2-hoeren-11")).toEqual(view);
  expect(options.map(option => option.id)).toEqual(["a","b","c"]); // source stays immutable
  expect(view.map(option => option.displayId)).toEqual(["a","b","c"]);
  expect(view.map(option => option.id).sort()).toEqual(["a","b","c"]);
  expect(new Set(view.map(option => option.label))).toEqual(new Set(options.map(option => option.label)));
  const correctId = "c";
  expect(mockDisplayAnswer(options, correctId, "a2-mock2-hoeren-11"))
    .toBe(view.find(option => option.id === correctId).displayId.toUpperCase());
  expect(mockDisplayAnswer(options, "", "a2-mock2-hoeren-11")).toBe("—");
});

test("A2 Mock 2 correct choices no longer expose the original a,b,c,d,e matching pattern", () => {
  const part = A2_MOCK_2_HOEREN[1];
  const options = part.pictures.map(([id,label,icon]) => ({id:id.toLowerCase(),label,icon}));
  const view = arrangeMockChoices(options, "a2-mock2-picture-board");
  expect(view).toHaveLength(9);
  expect(view.map(v=>v.displayId)).toEqual("abcdefghi".split(""));
  expect(view.map(v=>v.id).sort()).toEqual("abcdefghi".split(""));
  expect([6,7,8,9,10].map(number => {
    const answer = part.questions.find(q=>q.number===number).answer;
    return mockDisplayAnswer(options,answer,"a2-mock2-picture-board");
  }).join("")).not.toBe("ABCDE");
});

test("all A2 Mock 2 multiple-choice answers remain scorable", () => {
  for (const question of A2_MOCK_2_LESEN_QUESTIONS.filter(q => q.options.length >= 3)) {
    const view = arrangeMockChoices(question.options, `a2-mock2-lesen-${question.number}`);
    expect(view.map(v=>v.id)).toContain(question.answer);
    expect(mockDisplayAnswer(question.options, question.answer, `a2-mock2-lesen-${question.number}`))
      .toMatch(/^[A-Z]$/);
  }
  for (const question of A2_MOCK_2_HOEREN.flatMap(p => p.questions).filter(q => q.options?.length >= 3)) {
    const view = arrangeMockChoices(question.options, `a2-mock2-hoeren-${question.number}`);
    expect(view.map(v=>v.id)).toContain(question.answer);
  }
});

test("binary, explicit matching and true/false questions are left intact", () => {
  expect(arrangeMockChoices([["ja","Ja"],["nein","Nein"]],"binary").map(o=>o.id))
    .toEqual(["ja","nein"]);
  expect(arrangeMockChoices([{id:"a",label:"Text A"},{id:"b",label:"Text B"}],"matching").map(o=>o.id))
    .toEqual(["a","b"]);
});

test("all released full-mock writing textareas start without model answers or starter greetings", () => {
  const pages = [
    "../components/A1FinalMockExamPage.jsx",
    "../components/A2FinalMockExamPage.jsx",
    "../components/B1FinalMockExamPage.jsx",
    "../components/B2FinalMockExamPage.jsx",
    "../components/A2Mock2Schreiben.jsx",
  ];
  for (const file of pages) {
    const contents = fs.readFileSync(path.join(webRoot, "utils", file), "utf8");
    const textareas = contents.match(/<textarea\b[\s\S]*?\/>/g) || [];
    expect(textareas.length).toBeGreaterThan(0);
    for(const textArea of textareas) {
      expect(textArea).not.toMatch(/defaultValue|placeholder="(?:Hallo|Liebe|Lieber|Sehr geehrte|Hier schreiben)/i);
      expect(textArea).toMatch(/autoComplete="off"/);
    }
  }
  const a2 = fs.readFileSync(path.join(webRoot,"components","A2Mock2Schreiben.jsx"),"utf8");
  expect(a2).toContain('sms: "", email: ""');
  expect(a2).toContain('Clear answer');
});
