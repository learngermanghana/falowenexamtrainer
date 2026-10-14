import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LiveSpeakPage from "./LiveSpeakPage";
import { useAuth } from "../context/AuthContext";

jest.mock("../context/AuthContext", () => ({useAuth:jest.fn()}));
const task={id:"b1-2",teil:"Teil 2",prompt:"Gesund bleiben"};
const saved={sessionId:"saved",level:"B1",source:"exam-speaking-practice",topic:task.prompt,
  examTask:task,expiresAt:new Date(Date.now()+240000).toISOString(),resumed:true,
  messages:[{role:"user",text:"Ich mache jeden Tag Sport."},{role:"assistant",text:"Was essen Sie gern?"}],
  confirmedAnswers:["Ich mache jeden Tag Sport."],answeredTurns:1,answerLimit:2};
const ok=data=>({ok:true,json:async()=>data});
const show=()=>render(<MemoryRouter><LiveSpeakPage embedded initialLevel="B1"
  practiceSource="exam-speaking-practice" practiceTopic={task.prompt} examTask={task}/></MemoryRouter>);
beforeEach(()=>{
  useAuth.mockReturnValue({idToken:"test-token",studentProfile:{level:"B1"}});
  global.fetch=jest.fn(async url=>ok(String(url).endsWith("/status")
    ? {enabled:true,remaining:1,activeSession:saved} : saved));
  global.Audio=jest.fn(()=>({play:jest.fn().mockResolvedValue(),pause:jest.fn()}));
});
afterEach(()=>jest.restoreAllMocks());

test("resuming restores saved answers and the original examiner question",async()=>{
  show();
  fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  expect(await screen.findByText("Ich mache jeden Tag Sport.")).toBeInTheDocument();
  expect(screen.getByText("Was essen Sie gern?")).toBeInTheDocument();
  expect(screen.getByText(/Follow-up: answer/)).toBeInTheDocument();
});

test("feedback failure keeps the session; retry sends only session ID and duplicate clicks share one request",async()=>{
  let calls=0;
  global.fetch.mockImplementation(async (url,options)=>{
    if(String(url).endsWith("/status"))return ok({enabled:true,remaining:1,activeSession:saved});
    if(String(url).endsWith("/exam-feedback")){
      calls++;
      expect(JSON.parse(options.body)).toEqual({sessionId:"saved"});
      return calls===1 ? {ok:false,json:async()=>({code:"feedback_unavailable",error:"Your answers are saved. Try again."})}
        : ok({feedback:"Use weil with the verb at the end."});
    }
    return ok(saved);
  });
  show(); fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  const finish=await screen.findByRole("button",{name:"Finish task & see feedback"});
  fireEvent.click(finish); fireEvent.click(finish);
  expect(await screen.findByRole("alert")).toHaveTextContent("Your answers are saved.");
  expect(calls).toBe(1);
  fireEvent.click(screen.getByRole("button",{name:"Finish task & see feedback"}));
  expect(await screen.findByText("Use weil with the verb at the end.")).toBeInTheDocument();
  expect(calls).toBe(2);
});

test("pending transcription is recoverable and final confirmation goes directly to feedback",async()=>{
  const pending={...saved, pending:{pendingId:"pending",transcript:"Ich esse Gemüse."}};
  global.fetch.mockImplementation(async url=>{
    if(String(url).endsWith("/status"))return ok({enabled:true,activeSession:pending});
    if(String(url).endsWith("/confirm"))return ok({transcript:"Ich esse Gemüse.",reply:"Danke.",audioBase64:"",taskReady:true});
    return ok(pending);
  });
  show(); fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  expect(await screen.findByRole("textbox",{name:/What I said/})).toHaveValue("Ich esse Gemüse.");
  fireEvent.click(screen.getByRole("button",{name:"Confirm answer"}));
  expect(await screen.findByText(/Answers saved. You’re ready for feedback/)).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeDisabled();
  expect(screen.getByRole("button",{name:"Finish task & see feedback"})).toBeEnabled();
});

test.each([false,true])("saved feedback survives reload and local rehearsal stays on device (byte stop: %s)",async(autoStop)=>{
  global.fetch.mockResolvedValue(ok({enabled:true,remaining:0,lastExamResult:{...saved,feedback:"Practise the corrected sentence."}}));
  let currentTime=Date.now();
  jest.spyOn(Date,"now").mockImplementation(()=>currentTime);
  const stop=jest.fn();
  Object.defineProperty(navigator,"mediaDevices",{configurable:true,value:{getUserMedia:jest.fn(async()=>({getTracks:()=>[{stop}]}))}});
  const previousRecorder=global.MediaRecorder;
  let capturedRecorder;
  global.MediaRecorder=class {
    static isTypeSupported(){return true;}
    constructor(_stream,options){
      expect(options.audioBitsPerSecond).toBe(24000);
      capturedRecorder=this;
      this.state="inactive";this.mimeType="audio/webm";
    }
    start(){this.state="recording";this.ondataavailable({data:new Blob(["recorded audio"],{type:this.mimeType})});}
    stop(){this.state="inactive";this.onstop?.();}
  };
  const createUrl=URL.createObjectURL, revokeUrl=URL.revokeObjectURL;
  URL.createObjectURL=jest.fn(()=>"blob:local-rehearsal");URL.revokeObjectURL=jest.fn();
  try {
    const view=show();
    expect(await screen.findByText("Practise the corrected sentence.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Try your improved answer"}));
    const stopButton=await screen.findByRole("button",{name:/Stop recording/});
    currentTime+=2100;
    if (autoStop) {
      act(()=>capturedRecorder.ondataavailable({data:new Blob([new Uint8Array(320000)],{type:"audio/webm"})}));
    } else fireEvent.click(stopButton);
    await waitFor(()=>expect(screen.getByLabelText("Listen to your improved answer")).toHaveAttribute("src","blob:local-rehearsal"));
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(stop).toHaveBeenCalled();
    view.unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:local-rehearsal");
  } finally {
    global.MediaRecorder=previousRecorder;
    URL.createObjectURL=createUrl;URL.revokeObjectURL=revokeUrl;
  }
});

test("simulation transcript needs an explicit recognition-correction flag before editing",async()=>{
  const simulation={...saved,examFlow:{mode:"simulation",key:"B1-2",title:"Ein Thema präsentieren",hints:[],points:[],cards:[],step:{index:1,seconds:180,role:"examiner"},maxAnswers:1},
    maxTranscriptChars:4800,pending:{pendingId:"asr",transcript:"Ich lerne heute Deutsch."}};
  global.fetch.mockImplementation(async url=>ok(String(url).endsWith("/status") ? {enabled:true,activeSession:simulation} : simulation));
  show();fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  const transcript=await screen.findByRole("textbox",{name:"Recognised speech"});
  expect(transcript).toHaveAttribute("readonly");
  fireEvent.click(screen.getByRole("checkbox",{name:"Correct a speech-recognition mistake only"}));
  expect(transcript).not.toHaveAttribute("readonly");
});
