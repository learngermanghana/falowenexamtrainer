import React from "react";
import {render,screen,fireEvent} from "@testing-library/react";
import HorenPage from "./HorenPage";
const mockNavigate=jest.fn();
let mockLevel="A2";
jest.mock("react-router-dom",()=>({useNavigate:()=>mockNavigate}));
jest.mock("../context/ExamContext",()=>({useExam:()=>({level:mockLevel})}));
jest.mock("react-i18next",()=>({useTranslation:()=>({t:k=>k})}));
jest.mock("./ListeningPracticeSamplePage",()=>()=>null);
jest.mock("./A2Mock3Hoeren",()=>()=>null);
jest.mock("./A2MockListeningPractice",()=>()=>null);
jest.mock("../services/interactionFeedback",()=>({announceExamSuccess:jest.fn()}));
beforeEach(()=>{mockNavigate.mockClear();mockLevel="A2";});
test("A2 Hören lists exactly Samples 1 to 7, reusing mock content rather than the full exam route",()=>{
  render(<HorenPage/>);
  const buttons=screen.getAllByRole("button",{name:/Hören Sample [1-7]/});
  expect(buttons).toHaveLength(7);
  for(let n=1;n<=7;n++){
    const card=screen.getByRole("button",{name:new RegExp(`Hören Sample ${n}`)});
    expect(card).toHaveTextContent(`Hören Sample ${n}`);
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenLastCalledWith(`/exams/horen/a2/sample-${n}`);
  }
});
test("Other levels keep their own listening samples",()=>{
  mockLevel="B1";
  render(<HorenPage/>);
  expect(screen.queryByRole("button",{name:/Hören Sample 7/})).not.toBeInTheDocument();
});
test("Missing A2 listening sample is not sent to the default Mock 1 practice",()=>{
  render(<HorenPage practiceLevel="A2" sampleId="sample-8"/>);
  expect(screen.getByText(/sample not found/)).toBeInTheDocument();
});
