import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import A2Mock2ConversationalSpeaking from "./A2Mock2ConversationalSpeaking";
import A2Mock1ConversationalSpeaking from "./A2Mock1ConversationalSpeaking";
import { getA2Mock2StorageKeys, isA2Mock2ReviewReady } from "../utils/mockReviewAccess";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({user:{uid:"a2-voice-mock-student"},idToken:"mock-token"}),
}));
jest.mock("./LiveSpeakPage", () => (props) => (
  <button type="button" data-testid="finish-examiner-part"
    onClick={() => props.onExamCompleted({
      sessionId:`saved-${props.examTask.id}`,
      taskId:props.examTask.id,
      level:props.initialLevel,
      teil:props.examTask.teil,
      feedback:"German AI examiner marked the speaking turn.",
      assessment:{score:8,maxScore:10,summary:"Well understood."},
    })}>
    Complete AI examiner Teil
  </button>
));

beforeEach(() => localStorage.clear());

test("A2 Mock 2 uses A1-style home, German AI voice, three Teils and preserves old recordings", async () => {
  const keys=getA2Mock2StorageKeys("a2-voice-mock-student");
  localStorage.setItem(keys.lesen,JSON.stringify({completedAt:Date.now()}));
  localStorage.setItem(keys.hoeren,JSON.stringify({completedAt:Date.now()}));
  localStorage.setItem(keys.schreiben,JSON.stringify({submittedAt:Date.now()}));
  localStorage.setItem(keys.sprechen,JSON.stringify({t1_questions:{transcript:"Saved previous format"}}));
  const done=jest.fn();
  render(<A2Mock2ConversationalSpeaking embedded onComplete={done}/>);
  expect(screen.getByText(/In Ruhe üben/)).toBeInTheDocument();
  expect(screen.getByRole("button",{name:/Start full speaking exam/})).toBeInTheDocument();
  expect(screen.getByText("Saved previous format")).not.toBeVisible();
  fireEvent.click(screen.getByRole("button",{name:/Start full speaking exam/}));
  for (let part=1;part<=3;part++) {
    expect(screen.getByText(`Full speaking exam · Teil ${part} of 3`)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("finish-examiner-part"));
  }
  await waitFor(() => expect(done).toHaveBeenCalledTimes(1));
  const state=JSON.parse(localStorage.getItem(keys.sprechen));
  expect(Object.keys(state._examinerParts)).toEqual(["1","2","3"]);
  expect(state.t1_questions.transcript).toBe("Saved previous format");
  expect(isA2Mock2ReviewReady(keys)).toBe(true);
});

test("A2 Mock 1 keeps separate task identity and sums only real AI examiner marks", async () => {
  const update=jest.fn();
  const finished=jest.fn();
  render(<A2Mock1ConversationalSpeaking attemptId="a2-mock1-attempt"
    onProgress={update} onComplete={finished}/>);
  fireEvent.click(screen.getByRole("button",{name:/Start full speaking exam/}));
  for(let part=1;part<=3;part++){
    expect(screen.getByText(`Full speaking exam · Teil ${part} of 3`)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("finish-examiner-part"));
  }
  await waitFor(()=>expect(finished).toHaveBeenCalledTimes(1));
  expect(update).toHaveBeenCalledTimes(3);
  expect(update.mock.calls[2][0].attempts.examinerParts["3"].taskId)
    .toBe("a2-mock-01-speaking-teil-3");
  expect(finished.mock.calls[0][0].score).toBe(20);
  expect(finished.mock.calls[0][0].maxScore).toBe(25);
});
