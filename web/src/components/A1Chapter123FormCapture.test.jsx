import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import A1TutorDraftSectionCapture from "./A1TutorDraftSectionCapture";
import { A1TutorWorkbookDraftProvider } from "./A1TutorWorkbookDraftContext";
import { readA1WorkbookDraft } from "../utils/a1WorkbookDraft";
it("saves all five real form controls to the canonical assignment draft", async () => {
 window.localStorage.clear();
 render(<A1TutorWorkbookDraftProvider assignment={{assignmentKey:"A1-12.3",sections:[{key:"teil-1",number:1},{key:"teil-2",number:2}]}}><A1TutorDraftSectionCapture sectionKey="teil-1" /></A1TutorWorkbookDraftProvider>);
 expect(screen.getAllByRole("textbox")).toHaveLength(5);
 await act(async () => {
  ["Intensivkurs","August","vier","Einzelzimmer","Kreditkarte"].forEach((value,index)=>fireEvent.change(screen.getByLabelText(`Question ${index+1}`),{target:{value}}));
  await new Promise(resolve => setTimeout(resolve, 10));
 });
 expect(readA1WorkbookDraft("A1-12.3").sections["teil-1"].answers).toEqual({1:"Intensivkurs",2:"August",3:"vier",4:"Einzelzimmer",5:"Kreditkarte"});
});
