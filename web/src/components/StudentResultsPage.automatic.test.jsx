import React from "react";
import { render, screen } from "@testing-library/react";
import { onSnapshot } from "../firebase";
import StudentResultsPage from "./StudentResultsPage";
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: key => key }) }));
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: {uid:"u1"}, idToken:"token", studentProfile:{studentCode:"S1",level:"A1"} }) }));
jest.mock("../firebase", () => ({db:{},collection:jest.fn(),query:jest.fn(),where:jest.fn(),onSnapshot:jest.fn((_q,cb)=>{
  cb({docs:[{id:"score1",data:()=>({studentId:"u1",studentcode:"S1",assignment_id:"A1-1.1",assignment:"Day 1",score:85,source:"automatic_course_marking",date:"2026-10-17T07:00:00Z"})}]});return jest.fn();
})}));
jest.mock("../services/resultsApi",()=>({fetchStudentResultsHistory:async()=>[]}));
jest.mock("../services/resultsSheetService",()=>({fetchResultsFromPublishedSheet:async()=>[]}));
jest.mock("../services/resultsService",()=>({fetchResults:async()=>({results:[]})}));
jest.mock("../services/scoreSummaryService",()=>({fetchScoreSummary:async()=>({})}));
jest.mock("../utils/assignmentProgress",()=>({PASS_MARK:60,mergeAssignmentProgress:()=>[]}));
jest.mock("./ExamReadinessBadge",()=>()=>null);
jest.mock("./ResultHistory",()=>({results})=><div>{results.map(row=><span key={row.assignment_id}>Saved result: {row.score}</span>)}</div>);
test("shows a saved automatic result even when the Sheet/API has no rows yet",async()=>{
  render(<StudentResultsPage />);
  expect(await screen.findByText("Saved result: 85")).toBeInTheDocument();
  expect(screen.queryByText("No feedback has been recorded for your student code yet.")).not.toBeInTheDocument();
});

test("includes saved admin corrections even when their source is not automatic marking", async () => {
  onSnapshot.mockImplementationOnce((_q, cb) => {
    cb({docs:[{id:"admin-score",data:()=>({studentId:"u1",assignment_id:"B1-7.21",score:92,scoreOverrideAuthoritative:true,source:"tutor_marking"})}]});
    return jest.fn();
  });
  render(<StudentResultsPage />);
  expect(await screen.findByText("Saved result: 92")).toBeInTheDocument();
});
