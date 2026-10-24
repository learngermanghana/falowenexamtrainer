import React from "react";
import {fireEvent,render,screen,waitFor} from "@testing-library/react";
import B1MockConversationalSpeaking,{makeB1MockSpeakingTasks} from "./B1MockConversationalSpeaking";
import {scoreB1MockSpeaking} from "../services/coachService";
jest.mock("../services/coachService",()=>({scoreB1MockSpeaking:jest.fn()}));
jest.mock("../context/AuthContext",()=>({
  useAuth:()=>({idToken:"b1-test-token",user:{uid:"b1-learner"}}),
}));
jest.mock("./LiveSpeakPage",()=>props=><section>
  <span data-testid="examiner-topic">{props.examTask.prompt}</span>
  <button type="button" onClick={()=>props.onExamCompleted({
    sessionId:`session-${props.examTask.id}`,
    taskId:props.examTask.id,level:props.initialLevel,teil:props.examTask.teil,
    feedback:"The German examiner marked this B1 response.",
    assessment:{score:8,maxScore:10,summary:"Good interaction."},
  })}>Complete AI examiner Teil</button>
</section>);
beforeEach(()=>{
  scoreB1MockSpeaking.mockReset().mockResolvedValue({
    score:20,maxScore:25,assessmentIdentity:"b1-mock-02-examiner-verified",
  });
});
test("B1 Mock 2 uses the same A2 live examiner with Frau Keller and the selected presentation",async()=>{
  const finished=jest.fn(),onProgress=jest.fn();
  render(<B1MockConversationalSpeaking mockId="b1-mock-02" attemptId="attempt-b1-mock2"
    externalSecondsLeft={900} onProgress={onProgress} onComplete={finished}/>);
  fireEvent.click(screen.getByLabelText(/Thema B: Verreisen/));
  fireEvent.click(screen.getByRole("button",{name:/Start full speaking exam/}));
  expect(screen.getByTestId("examiner-topic")).toHaveTextContent("Frau Keller");
  fireEvent.click(screen.getByText("Complete AI examiner Teil"));
  expect(screen.getByTestId("examiner-topic")).toHaveTextContent("Verreisen");
  fireEvent.click(screen.getByText("Complete AI examiner Teil"));
  expect(screen.getByTestId("examiner-topic")).toHaveTextContent("Feedback");
  fireEvent.click(screen.getByText("Complete AI examiner Teil"));
  await waitFor(()=>expect(finished).toHaveBeenCalledTimes(1));
  expect(scoreB1MockSpeaking).toHaveBeenCalledWith(expect.objectContaining({
    idToken:"b1-test-token",attemptId:"attempt-b1-mock2",mockId:"b1-mock-02",
    examinerSessionIds:[
      "session-b1-mock-02-speaking-teil-1",
      "session-b1-mock-02-speaking-teil-2",
      "session-b1-mock-02-speaking-teil-3",
    ]
  }));
  expect(onProgress).toHaveBeenCalledTimes(4); // topic + three verified parts
});
test("Mock 1 is equally conversational but keeps its original task cards",()=>{
  expect(makeB1MockSpeakingTasks("b1-mock-01")[1].prompt).toContain("gedruckte Bücher");
  expect(makeB1MockSpeakingTasks("b1-mock-02","b")[1].prompt).toContain("Verreisen");
  expect(makeB1MockSpeakingTasks("b1-mock-02","a")[1].prompt).toContain("Bio-Produkte");
  expect(makeB1MockSpeakingTasks("b1-mock-02")[0].prompt).toContain("Frau Keller");
});
test("No final B1 mark is released when server verification fails",async()=>{
  scoreB1MockSpeaking.mockRejectedValueOnce(new Error("Unverified examiner receipt"));
  const finished=jest.fn();
  render(<B1MockConversationalSpeaking mockId="b1-mock-02" attemptId="attempt-b1"
    externalSecondsLeft={900} onComplete={finished}/>);
  fireEvent.click(screen.getByRole("button",{name:/Start full speaking exam/}));
  for(let i=0;i<3;i++) fireEvent.click(screen.getByText("Complete AI examiner Teil"));
  await waitFor(()=>expect(screen.getByRole("button",{name:/Retry speaking verification/})).toBeInTheDocument());
  expect(finished).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:/Retry speaking verification/}));
  await waitFor(()=>expect(finished).toHaveBeenCalledTimes(1));
});
