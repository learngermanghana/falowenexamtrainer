import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SpeakingAiLoadingStatus, { AI_SPEAKING_WAIT_PHASES } from "./SpeakingAiLoadingStatus";
import LiveSpeakPage from "./LiveSpeakPage";
import { requestCoachSpeech } from "../services/presentationCoachService";
import { useAuth } from "../context/AuthContext";

jest.mock("../context/AuthContext", () => ({useAuth:jest.fn()}));
jest.mock("../services/presentationCoachService", () => ({requestCoachSpeech:jest.fn()}));

describe("shared accessible AI examiner waiting indicator", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test.each([
    ["connecting", "Connecting to your AI examiner"],
    ["opening", "Preparing the examiner's voice"],
    ["reply", "Preparing the examiner's reply"],
    ["feedback", "Preparing your speaking feedback"],
  ])("%s shows a clear spinner and wait instruction", (phase, heading) => {
    render(<SpeakingAiLoadingStatus phase={phase}/>);
    const status=screen.getByRole("status", {name:"AI speaking loading status"});
    expect(status).toHaveAttribute("aria-live","polite");
    expect(status).toHaveAttribute("data-ai-wait-phase",phase);
    expect(status.querySelector(".speaking-ai-wait__spinner")).toHaveAttribute("aria-hidden","true");
    expect(screen.getByText(heading)).toBeInTheDocument();
    expect(status).toHaveTextContent("Please wait");
    expect(screen.queryByText(/a little longer than usual/)).not.toBeInTheDocument();
    act(() => {jest.advanceTimersByTime(12000);});
    expect(screen.getByText(/a little longer than usual/)).toBeInTheDocument();
  });

  test("reassurance does not appear early and restarts on phase change", () => {
    const view=render(<SpeakingAiLoadingStatus phase="opening"/>);
    act(()=>{jest.advanceTimersByTime(11999);});
    expect(screen.queryByText(/a little longer than usual/)).not.toBeInTheDocument();
    view.rerender(<SpeakingAiLoadingStatus phase="reply"/>);
    act(()=>{jest.advanceTimersByTime(1);});
    expect(screen.queryByText(/a little longer than usual/)).not.toBeInTheDocument();
    act(()=>{jest.advanceTimersByTime(12000);});
    expect(screen.getByText(/a little longer than usual/)).toBeInTheDocument();
    view.unmount();
    expect(jest.getTimerCount()).toBe(0);
  });

  test("unsupported phase renders nothing", () => {
    const view=render(<SpeakingAiLoadingStatus phase={null}/>);
    expect(view.container).toBeEmptyDOMElement();
    expect(AI_SPEAKING_WAIT_PHASES.reply).toBeDefined();
  });
});

describe("A1–C2 LiveSpeakPage all use the same speaking connection screen", () => {
  beforeEach(()=>{
    useAuth.mockReturnValue({idToken:"test",studentProfile:{level:"A1"}});
    global.fetch=jest.fn(()=>new Promise(()=>{})); // keep loading until status request completes
  });
  test.each(["A1","A2","B1","B2","C1","C2"])("%s shows spinner while connecting, without a second start request", level => {
    render(<MemoryRouter><LiveSpeakPage embedded initialLevel={level}
      practiceSource="exam-speaking-practice"
      examTask={{id:"intro-"+level,teil:"Teil 1",prompt:"Stellen Sie sich vor."}}/>
    </MemoryRouter>);
    expect(screen.getByRole("status",{name:"AI speaking loading status"}))
      .toHaveAttribute("data-ai-wait-phase","loading");
    expect(screen.getByText(/checks your speaking access and saved session/)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

const ok = data => ({ok:true,json:async()=>data});
const deferred = () => { let resolve; const promise = new Promise(r=>{resolve=r;}); return {promise,resolve}; };
const task = {id:"b1-2",teil:"Teil 2",prompt:"Gesund bleiben"};
const saved = {sessionId:"saved",level:"B1",source:"exam-speaking-practice",topic:task.prompt,
  examTask:task,expiresAt:new Date(Date.now()+600000).toISOString(),resumed:true,
  messages:[{role:"assistant",text:"Was essen Sie gern?"}],answeredTurns:0,answerLimit:3};
const status = () => screen.queryByRole("status",{name:"AI speaking loading status"});

beforeEach(()=>{requestCoachSpeech.mockReset();});

test("standalone tutor loading never identifies an examiner", async()=>{
  useAuth.mockReturnValue({idToken:"test",studentProfile:{level:"B1"}});
  global.fetch=jest.fn(()=>new Promise(()=>{}));
  render(<MemoryRouter><LiveSpeakPage initialLevel="B1"/></MemoryRouter>);
  expect(status()).toHaveTextContent("Loading speaking practice");
  expect(status()).not.toHaveTextContent(/examiner/i);
});

test.each(["connecting","opening","reply"])("tutor %s uses tutor copy", phase=>{
  render(<SpeakingAiLoadingStatus phase={phase} examiner={false}/>);
  expect(status()).toHaveTextContent(/tutor/i);
  expect(status()).not.toHaveTextContent(/examiner/i);
});

test.each([
  ["replay", "▶ Listen to question again", "Preparing question audio"],
  ["discard", "Record again", "Discarding your unconfirmed answer"],
  ["confirm", "Confirm answer", "Preparing the examiner's reply"],
  ["recovery", "Check saved answer / speaking progress", "Checking saved speaking progress"],
])("%s reports the actual request and clears on completion", async(operation, button, heading)=>{
  useAuth.mockReturnValue({idToken:"test",studentProfile:{level:"B1"}});
  const active = operation === "discard" || operation === "confirm" || operation === "recovery"
    ? {...saved,pending:{pendingId:"pending",transcript:"Ich esse Gemüse."}} : saved;
  const request=deferred();
  let holdStatus=false;
  global.fetch=jest.fn(async url=>{
    if(String(url).endsWith("/status")) return holdStatus ? request.promise : ok({enabled:true,activeSession:active});
    if(String(url).endsWith("/start")) return ok(active);
    return request.promise;
  });
  requestCoachSpeech.mockImplementation(()=>request.promise);
  render(<MemoryRouter><LiveSpeakPage embedded initialLevel="B1" gradedCourseMock
    practiceSource="exam-speaking-practice" examTask={task}/></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  await waitFor(()=>expect(status()).not.toBeInTheDocument());
  if(operation === "recovery") holdStatus=true;
  fireEvent.click(screen.getByRole("button",{name:button}));
  expect(status()).toHaveTextContent(heading);
  if(operation !== "confirm") expect(status()).not.toHaveTextContent("processing your answer");
  await act(async()=>{request.resolve(operation === "replay" ? "" : {ok:false,json:async()=>({error:"Request failed"})});});
  await waitFor(()=>expect(status()).not.toBeInTheDocument());
});
