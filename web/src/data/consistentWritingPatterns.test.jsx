import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import ConsistentWritingPatternGuide from "../components/ConsistentWritingPatternGuide";
import { LETTER_PATTERNS, suggestWritingStyle, getOpinionStructureChecks } from "./consistentWritingPatterns";
import { getWritingCheatSheet } from "./writingCheatSheets";
import fs from "fs";
import path from "path";

test("A1–B1 use one repeatable informal and formal opening, three-point progression, and matching sign-off", () => {
  const informal = LETTER_PATTERNS.informal.steps.map(({text}) => text).join("\n");
  const formal = LETTER_PATTERNS.formal.steps.map(({text}) => text).join("\n");
  expect(informal).toContain("Wie geht es dir? Ich hoffe, es geht dir gut.");
  expect(informal).toContain("Ich schreibe dir, weil");
  expect(formal).toContain("Ich hoffe, es geht Ihnen gut.");
  expect(formal).toContain("Ich schreibe Ihnen, weil");
  for (const candidate of [informal, formal]) {
    expect(candidate).toContain("Erstens");
    expect(candidate).toContain("Zweitens");
    expect(candidate).toContain("Außerdem");
  }
  expect(informal).toContain("Liebe Grüße");
  expect(formal).toContain("Mit freundlichen Grüßen");
});

test("A2 and B1 cheat sheets reuse identical templates rather than inventing new openings", () => {
  for(const level of ["A2","B1"]) {
    const sheets=getWritingCheatSheet(level,1);
    for(const style of ["formal","informal"]) {
      const t=sheets.find(x=>x.id===`${level.toLowerCase()}-${style}-letter-template`);
      expect(t?.layout).toBe("template");
      expect(t.items).toEqual(LETTER_PATTERNS[style].steps.map(({label,text})=>({phrase:label,meaning:text})));
    }
  }
  const b1Essay=getWritingCheatSheet("B1",1).find(x=>x.id==="b1-opinion-text-template");
  expect(b1Essay.items.map(x=>x.meaning).join(" ")).toContain("Heutzutage ist das Thema");
  expect(b1Essay.items.map(x=>x.meaning).join(" ")).toContain("Andererseits");
});

test("writing style can be switched, and B1 opinion essay gets a structure-only check", () => {
  const { rerender }=render(<ConsistentWritingPatternGuide level="B1" taskTitle="B1 Meinungsbeitrag über Umwelt" text="" defaultOpen />);
  expect(screen.getByRole("button",{name:"B1 opinion essay"})).toHaveAttribute("aria-pressed","true");
  expect(screen.getByText(/Heutzutage ist das Thema/)).toBeVisible();
  rerender(<ConsistentWritingPatternGuide level="B1" taskTitle="B1 Meinungsbeitrag über Umwelt"
    text="Heutzutage ist das Thema wichtig. Ich bin der Meinung, dass es wichtig ist. Einerseits gibt es Vorteile. Andererseits gibt es Nachteile. Zusammenfassend finde ich es sinnvoll." defaultOpen />);
  const check=screen.getByRole("region",{name:"B1 opinion essay structure check"});
  expect(within(check).getByText(/5\/5 cues found/)).toBeInTheDocument();
  expect(within(check).getByText(/not your exam score/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Formal letter"}));
  expect(screen.getByText(/Ich hoffe, es geht Ihnen gut/)).toBeVisible();
  expect(screen.queryByRole("region",{name:"B1 opinion essay structure check"})).not.toBeInTheDocument();
});

test("A1 guidance keeps short-task word limits and A2 letter paragraphs separate from timed mocks", () => {
  render(<ConsistentWritingPatternGuide level="A1" taskTitle="E-Mail an Anna" defaultOpen />);
  expect(screen.queryByRole("button",{name:"B1 opinion essay"})).not.toBeInTheDocument();
  expect(screen.getByText(/20–30 words/)).toBeVisible();
  const components=path.resolve(process.cwd(),"src/components");
  for(const f of ["A1FinalMockExamPage.jsx","A2FinalMockExamPage.jsx","B1FinalMockExamPage.jsx","B2FinalMockExamPage.jsx","A2Mock2Schreiben.jsx"]) {
    const page=fs.readFileSync(path.join(components,f),"utf8");
    expect(page).not.toContain("<ConsistentWritingPatternGuide");
  }
  const practice=fs.readFileSync(path.join(components,"WritingPage.js"),"utf8");
  expect(practice).toContain('isExamMode && ["A1", "A2", "B1"].includes(level)');
});

test("opinion essay suggestions recognise equivalent sentence starters without assigning marks",()=>{
  expect(suggestWritingStyle("Schreiben Sie einen Meinungsbeitrag","B1")).toBe("opinion");
  expect(suggestWritingStyle("E-Mail an den Vermieter","A2")).toBe("formal");
  expect(suggestWritingStyle("Schreiben Sie an Ihren Freund","A1")).toBe("informal");
  expect(getOpinionStructureChecks("Ich finde das Thema wichtig.")).toHaveLength(5);
});
