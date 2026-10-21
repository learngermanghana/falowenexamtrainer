import React from "react";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SpeakingAiLoadingStatus, { AI_SPEAKING_WAIT_PHASES } from "./SpeakingAiLoadingStatus";
import LiveSpeakPage from "./LiveSpeakPage";
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
    expect(Object.keys(AI_SPEAKING_WAIT_PHASES)).toEqual(["connecting","opening","reply","feedback"]);
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
      .toHaveAttribute("data-ai-wait-phase","connecting");
    expect(screen.getByText(/who will speak first in German/)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
