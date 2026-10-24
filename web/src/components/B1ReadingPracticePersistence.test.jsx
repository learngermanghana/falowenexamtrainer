import React from "react";
import {MemoryRouter} from "react-router-dom";
import {render,screen,waitFor,cleanup} from "@testing-library/react";
import B1ReadingPracticeSamples from "./B1ReadingPracticeSamples";
import {B1_READING_PRACTICE_SAMPLES} from "../data/b1ReadingPracticeSamples";
import {getReadingPracticeHistory,READING_PRACTICE_HISTORY_KEY} from "../services/readingPracticeHistory";

jest.mock("../context/AuthContext",()=>({
  useAuth:()=>({user:{uid:"b1-progress-student"},idToken:"signed-token",studentProfile:{id:"b1-progress-student"}}),
}));
jest.mock("../services/examRoomResultService",()=>({
  saveExamRoomResult:jest.fn().mockResolvedValue({saved:true}),
}));
const sample=B1_READING_PRACTICE_SAMPLES[0];
const storeKey="falowen:exams:lesen:b1:three-samples:b1-progress-student";
const renderPractice=()=>render(<MemoryRouter>
  <B1ReadingPracticeSamples initialSampleId={sample.id} standalone/>
</MemoryRouter>);
afterEach(()=>{
  cleanup();
  localStorage.removeItem(storeKey);
  localStorage.removeItem(READING_PRACTICE_HISTORY_KEY);
});
test("B1 reading restores active Teil, student answers and remaining timer after refresh",async()=>{
  localStorage.setItem(storeKey,JSON.stringify({
    selectedId:sample.id,partKey:"teil2",
    answersBySample:{[sample.id]:{1:"richtig",7:"b"}},
    submittedBySample:{},
    timeBySample:{[sample.id]:2400}
  }));
  renderPractice();
  await waitFor(()=>expect(screen.getByText("40:00")).toBeInTheDocument());
  expect(screen.getByText("2/30")).toBeInTheDocument();
  expect(screen.getByText("Teil 2 of 5")).toBeInTheDocument();
  await waitFor(()=>expect(JSON.parse(localStorage.getItem(storeKey)).answersBySample[sample.id][7]).toBe("b"));
});
test("B1 reading time expiry saves a single completed attempt with unanswered questions marked wrong",async()=>{
  localStorage.setItem(storeKey,JSON.stringify({
    selectedId:sample.id,partKey:"teil1",
    answersBySample:{[sample.id]:{}},
    submittedBySample:{},timeBySample:{[sample.id]:0}
  }));
  renderPractice();
  await waitFor(()=>expect(screen.getByText(/Result: 0\/30/)).toBeInTheDocument());
  expect(getReadingPracticeHistory("B1","b1-progress-student")).toHaveLength(1);
  expect(JSON.parse(localStorage.getItem(storeKey)).submittedBySample[sample.id]).toBe(true);
});
