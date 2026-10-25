import React from "react";
import {render,screen,fireEvent} from "@testing-library/react";
import A1KombiReadingSection from "./A1KombiReadingSection";
import {A1_KOMBI_READING_PAPERS} from "../data/a1KombiReadingPapers";
import {A1_KOMBI_TASK_SETS} from "../data/a1KombiTaskSets";
import {canReviewFullMock,restoreFullMockReviewState} from "../utils/mockReviewAccess";
test.each([4,5,6,7,8])("A1 Mock %s ships its reading paper and five form inputs without solutions",n=>{
 const paper=A1_KOMBI_READING_PAPERS[n];
 const task=A1_KOMBI_TASK_SETS[n];
 expect(paper.questionCount).toBe(15);
 expect(paper.paperText.length).toBeGreaterThan(1000);
 expect(paper.paperText).not.toMatch(/LÖSUNGSSCHLÜSSEL|MUSTERLÖSUNG/i);
 expect(task.writing.teil1.formRows).toHaveLength(5);
 expect(task.writing.teil1.formRows.every(field=>!Object.hasOwn(field,"answer"))).toBe(true);
 expect(task.writing.teil2.points).toHaveLength(3);
 expect(task.speaking.tasks).toHaveLength(3);
});
test("reading student answers use stable server-verifiable keys",()=>{
 const onChange=jest.fn();
 render(<A1KombiReadingSection mockNumber={4} answers={{}} onChange={onChange}/>);
 expect(screen.getAllByRole("radio")).toHaveLength(30);
 expect(screen.getByText(/Julia bleibt vier Tage in Berlin/)).toBeInTheDocument();
 fireEvent.click(screen.getAllByLabelText("Richtig")[0]);
 expect(onChange).toHaveBeenCalledWith("t1-1","richtig");
});
test("a three-module result is not reviewable before server verification",()=>{
 const state={completed:true,stage:"result",assessmentVersion:"three-module-v1",
   sectionScores:{lesen:25,schreiben:20,sprechen:20},
   overall:{score:86.7,maxPoints:75,assessmentVersion:"three-module-v1"}};
 expect(canReviewFullMock({...state,verificationPending:true})).toBe(false);
 expect(restoreFullMockReviewState({...state,verificationPending:true}).stage).toBe("result");
 expect(canReviewFullMock(state)).toBe(true);
 expect(canReviewFullMock({...state,overall:{score:86.7}})).toBe(false);
});
