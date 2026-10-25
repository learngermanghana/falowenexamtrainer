import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import A1KombiReadingSection from "./A1KombiReadingSection";
import { A1_KOMBI_STRUCTURED_READING } from "../data/a1KombiStructuredReading";
import { A1_KOMBI_TASK_SETS } from "../data/a1KombiTaskSets";
import fs from "fs";
import path from "path";

const mockPageSource = fs.readFileSync(path.join(__dirname, "A1FinalMockExamPage.jsx"), "utf8");
const sharedReadingSource = fs.readFileSync(path.join(__dirname, "A1Mock3ReadingSection.jsx"), "utf8");
const newReadingSource = fs.readFileSync(path.join(__dirname, "A1KombiReadingSection.jsx"), "utf8");

describe("A1 Mocks 4–8 match the existing Mock 3 visual system", () => {
  afterEach(cleanup);
  test.each([4,5,6,7,8])("Mock %s shows separate reading texts, cards and answer controls", n => {
    const paper = A1_KOMBI_STRUCTURED_READING[n];
    expect(paper.texts).toHaveLength(2);
    expect(paper.teil1).toHaveLength(5);
    expect(paper.teil2).toHaveLength(5);
    expect(paper.teil3).toHaveLength(5);
    expect([...paper.teil1,...paper.teil2,...paper.teil3].map(q => q.number)).toEqual(
      Array.from({length:15},(_,i)=>i+1)
    );
    const onChange = jest.fn();
    const { container } = render(<A1KombiReadingSection mockNumber={n} answers={{}} onChange={onChange} />);
    expect(screen.getAllByRole("radio")).toHaveLength(30);
    expect(screen.getAllByRole("heading",{name:/^Aufgabe \d+$/})).toHaveLength(15);
    expect(container.querySelectorAll(".a1-final-mock-part")).toHaveLength(3);
    expect(container.querySelectorAll(".a1-goethe-mock-paper")).toHaveLength(2);
    expect(container.querySelectorAll(".a1-goethe-mock-browser-panel")).toHaveLength(10);
    expect(container.querySelectorAll(".a1-goethe-mock-notice-card")).toHaveLength(5);
    expect(container.querySelectorAll(".a1-goethe-mock-choices")).toHaveLength(15);
    expect(container.querySelector("pre")).toBeNull();
    expect(container.querySelector('[style*="white-space: pre-wrap"]')).toBeNull();
    fireEvent.click(screen.getAllByLabelText("Richtig")[0]);
    expect(onChange).toHaveBeenCalledWith("t1-1","richtig");
  });

  test("Mock 3 reading classes and styles are reused rather than copied or overridden",()=>{
    for (const cssClass of ["a1-mock2-reading","a1-mock3-reading","a1-goethe-mock-question","a1-mock2-sources","a1-goethe-mock-notice-card"]) {
      expect(sharedReadingSource).toContain(cssClass);
      expect(newReadingSource).toContain(cssClass);
    }
    expect(newReadingSource).toContain('import "./A1Mock3Reading.css"');
    expect(newReadingSource).not.toContain("paperText");
  });

  test("Schreiben and Sprechen retain the existing Mock 3 components and styling", () => {
    expect(mockPageSource).toContain("a1-schreiben-mock-exam");
    expect(mockPageSource).toContain("a1-schreiben-form-paper");
    expect(mockPageSource).toContain("a1-schreiben-letter-task");
    expect(mockPageSource).toContain("a1-schreiben-three-points");
    expect(mockPageSource).toContain("<A1GoetheSpeakingMockPreview");
    expect(mockPageSource).toContain("config={isKombi ? kombiSet.speaking : isMock3");
    expect(mockPageSource).toContain('isKombi ? "ANMELDEFORMULAR"');
    expect(mockPageSource).toContain('isKombi ? "Schreiben · 15 min"');
    expect(mockPageSource).toContain('isKombi ? "schreiben" : "hoeren"');
    for (const mockNumber of [4,5,6,7,8]) {
      const mock = A1_KOMBI_TASK_SETS[mockNumber];
      expect(mock.writing.teil1.formRows).toHaveLength(5);
      expect(mock.writing.teil2.points).toHaveLength(3);
      expect(mock.speaking.tasks).toHaveLength(3);
    }
  });
});
