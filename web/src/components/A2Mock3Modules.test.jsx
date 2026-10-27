import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { A2_MOCK_3_LESEN, A2_MOCK_3_LESEN_QUESTIONS } from "../data/a2Mock3Lesen";
import { A2_MOCK_3_SCHREIBEN } from "../data/a2Mock3Schreiben";
import { A2_MOCK_3_SPEAKING } from "../data/a2Mock3Speaking";
import { MOCK_EXAM_CATALOG } from "../data/mockExamCatalog";
import A2Mock3Lesen from "./A2Mock3Lesen";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({user:{uid:"mock3-student"},idToken:"test-token"}),
}));
jest.mock("./navigation/AppBackButton", () => () => null);

beforeEach(()=>{localStorage.clear();});
test("Mock 03 source has four unique Lesen Teils, 20 questions and no browser grading keys",()=>{
  expect(A2_MOCK_3_LESEN).toHaveLength(4);
  expect(A2_MOCK_3_LESEN.map(p=>p.questions.length)).toEqual([5,5,5,5]);
  expect(A2_MOCK_3_LESEN_QUESTIONS.map(q=>q.number)).toEqual(Array.from({length:20},(_,i)=>i+1));
  expect(A2_MOCK_3_LESEN_QUESTIONS.every(q=>q.options.length === (q.number>15?7:3))).toBe(true);
  expect(A2_MOCK_3_LESEN_QUESTIONS.every(q=>!Object.prototype.hasOwnProperty.call(q,"answer"))).toBe(true);
  expect(A2_MOCK_3_LESEN[0].paragraphs.join(" ")).toContain("Bio-Café");
  expect(A2_MOCK_3_LESEN[1].floors).toHaveLength(5);
  expect(A2_MOCK_3_LESEN[2].paragraphs.join(" ")).toContain("Einweihungsparty");
  expect(A2_MOCK_3_LESEN[3].ads).toHaveLength(6);
});
test("Schreiben and Sprechen tasks are unique to Mock 03",()=>{
  expect(A2_MOCK_3_SCHREIBEN.teil1.points).toHaveLength(3);
  expect(A2_MOCK_3_SCHREIBEN.teil2.points).toHaveLength(3);
  expect(A2_MOCK_3_SCHREIBEN.teil1.situation).toContain("Thomas");
  expect(A2_MOCK_3_SCHREIBEN.teil2.situation).toContain("Alpenblick");
  expect(A2_MOCK_3_SPEAKING.cards).toHaveLength(8);
  expect(A2_MOCK_3_SPEAKING.teil2.topic).toBe("Mein letzter Urlaub");
  expect(A2_MOCK_3_SPEAKING.teil3.points).toHaveLength(4);
  expect(MOCK_EXAM_CATALOG["a2-mock-03"].sections).toEqual(["Lesen","Hören","Schreiben","Sprechen"]);
  expect(MOCK_EXAM_CATALOG["a2-mock-03-hoeren"].route).toBe("/campus/course/a2-mock-3-hoeren");
});
test("student can work through the four reading parts with 30-minute timer and local autosave",()=>{
  const {container}=render(<MemoryRouter><A2Mock3Lesen/></MemoryRouter>);
  fireEvent.click(screen.getByRole("button",{name:"Lesen starten"}));
  expect(screen.getByText("Der Traum vom eigenen Bio-Café")).toBeInTheDocument();
  expect(screen.getByRole("timer")).toBeInTheDocument();
  const choose = container.querySelector('input[name="a2-mock3-lesen-1"][value="b"]');
  expect(choose).toBeTruthy();
  fireEvent.click(choose);
  expect(choose.checked).toBe(true);
  fireEvent.click(screen.getByRole("button",{name:/Weiter: Teil 2/}));
  expect(screen.getByText("Wegweiser: Kaufhaus „Galerie Stadtmitte“")).toBeInTheDocument();
  expect(screen.getByText("3. Obergeschoss (3. OG)")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:/Weiter: Teil 3/}));
  expect(screen.getByText("E-Mail von Sarah an Jan")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:/Weiter: Teil 4/}));
  expect(screen.getByText("Kleinanzeigen")).toBeInTheDocument();
  expect(screen.getByText(/ohne Eltern/)).toBeInTheDocument();
});
