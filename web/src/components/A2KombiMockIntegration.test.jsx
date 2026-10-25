import React from "react";
import fs from "fs";
import path from "path";
import {render,screen,fireEvent,cleanup} from "@testing-library/react";
import A2KombiReadingSection from "./A2KombiReadingSection";
import {A2_KOMBI_MOCK_CONTENT} from "../data/a2KombiMockContent";
import {getMockExam,getMockExamsForLevel} from "../data/mockExamCatalog";
const app=fs.readFileSync(path.join(__dirname,"../App.js"),"utf8");
const exam=fs.readFileSync(path.join(__dirname,"A2FinalMockExamPage.jsx"),"utf8");
describe("A2 Kombiprüfung Mocks 4–8 production-preview contract",()=>{
 afterEach(cleanup);
 test.each([4,5,6,7,8])("Mock %s uses standardized A2 cards, correct questions and no answer key",n=>{
  const mock=A2_KOMBI_MOCK_CONTENT[n];
  expect(mock.modules).toEqual(["lesen","schreiben","sprechen"]);
  expect(Object.values(mock.reading).flatMap(p=>p.questions)).toHaveLength(20);
  expect(mock.reading.teil4.ads).toHaveLength(6);
  expect(mock.writing.teil1.points).toHaveLength(3);
  expect(mock.writing.teil2.points).toHaveLength(3);
  expect(mock.speaking.teil3.points).toHaveLength(3);
  const {container}=render(<A2KombiReadingSection mockNumber={n} answers={{}} onChange={jest.fn()}/>);
  expect(screen.getAllByRole("radio")).toHaveLength(45);
  expect(screen.getAllByRole("combobox")).toHaveLength(5);
  expect(container.querySelectorAll(".a2-mock-part")).toHaveLength(4);
  expect(container.querySelectorAll(".a2-mock-question")).toHaveLength(15);
  expect(container.querySelectorAll(".a2-mock-ads-grid .a2-mock-ad")).toHaveLength(6);
  expect(container.querySelector(".a2-mock-newspaper")).toBeTruthy();
  expect(container.querySelector(".a2-mock-directory")).toBeTruthy();
  expect(container.querySelector(".a2-mock-email")).toBeTruthy();
  expect(JSON.stringify(mock)).not.toMatch(/LÖSUNGSSCHLÜSSEL|Musterlösung Schreiben|correctAnswer/i);
  expect(app).toContain(`mockId="a2-mock-0${n}"`);
  expect(getMockExam(`a2-mock-0${n}`)).toMatchObject({
    status:"preview",mode:"kombi",sections:["Lesen","Schreiben","Sprechen"],
    route:`/campus/course/a2-mock-${n}`});
 });
 test("A2 mock full flow never routes Kombiprüfung students to Hören",()=>{
  expect(exam).toContain('moveToSection(isKombi?"schreiben":"hoeren"');
  expect(exam).toContain('isKombi?<A2KombiMockSpeaking');
  expect(exam).toContain('isKombi ? "Start or resume 3 modules"');
  expect(exam).toContain('isKombi ? <A2KombiReadingSection');
  expect(exam).toContain("verificationPending:false");
  for(const i of [1,2])expect(getMockExamsForLevel("A2").some(e=>e.status==="ready")).toBe(true);
 });
});
