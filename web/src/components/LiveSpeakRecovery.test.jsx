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
  expect(screen.getByLabelText("Current examiner question")).toHaveTextContent("Was essen Sie gern?");
  expect(screen.getByText(/Follow-up: answer/)).toBeInTheDocument();
});

test("failed automatic feedback keeps saved answers and allows a retry",async()=>{
  let calls=0;
  const finished={...saved,taskReady:true,answeredTurns:2};
  global.fetch.mockImplementation(async (url,options)=>{
    if(String(url).endsWith("/status"))return ok({enabled:true,remaining:1,activeSession:finished});
    if(String(url).endsWith("/exam-feedback")){
      calls++;
      expect(JSON.parse(options.body)).toEqual({sessionId:"saved"});
      return calls===1 ? {ok:false,json:async()=>({code:"feedback_unavailable",error:"Your answers are saved. Try again."})}
        : ok({feedback:"Use weil with the verb at the end."});
    }
    return ok(finished);
  });
  show(); fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  expect(await screen.findByRole("alert")).toHaveTextContent("Your answers are saved.");
  expect(calls).toBe(1);
  fireEvent.click(screen.getByRole("button",{name:"Retry feedback"}));
  expect(await screen.findByText("Use weil with the verb at the end.")).toBeInTheDocument();
  expect(calls).toBe(2);
});

test("pending transcription is recoverable and final confirmation goes directly to feedback",async()=>{
  const pending={...saved, pending:{pendingId:"pending",transcript:"Ich esse Gemüse."}};
  global.fetch.mockImplementation(async url=>{
    if(String(url).endsWith("/status"))return ok({enabled:true,activeSession:pending});
    if(String(url).endsWith("/confirm"))return ok({transcript:"Ich esse Gemüse.",reply:"Danke.",audioBase64:"",taskReady:true});
    if(String(url).endsWith("/exam-feedback"))return ok({feedback:"Good attempt."});
    return ok(pending);
  });
  show(); fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  expect(await screen.findByRole("textbox",{name:/What I said/})).toHaveValue("Ich esse Gemüse.");
  fireEvent.click(screen.getByRole("button",{name:"Confirm answer"}));
  expect(await screen.findByText(/Good attempt/)).toBeInTheDocument();
  expect(screen.queryByRole("button",{name:"Record German answer"})).not.toBeInTheDocument();
  expect(screen.queryByRole("button",{name:/Finish this Teil & see feedback/})).not.toBeInTheDocument();
});

test("saved audio answer advances to the next assigned question when the examiner's voice fails",async()=>{
  const active={...saved,answeredTurns:1,answerLimit:4,
    examFlow:{key:"B1-1",step:{index:2,seconds:60,role:"partner",instruction:"Was schlagen Sie vor?"}},
    pending:{pendingId:"review-voice",transcript:"Wir können uns am Bahnhof treffen.",typed:false}};
  global.fetch.mockImplementation(async url=>{
    if(String(url).endsWith("/status"))return ok({enabled:true,activeSession:active});
    if(String(url).endsWith("/confirm"))return ok({ok:true,recovered:true,
      transcript:"Wir können uns am Bahnhof treffen.",reply:"Danke.",
      nextInstruction:"Wer übernimmt die Fahrkarten?",taskReady:false,audioBase64:"",
      examFlow:{...active.examFlow,step:{index:3,seconds:60,role:"partner",instruction:"Wer übernimmt die Fahrkarten?"}}});
    return ok(active);
  });
  show();fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  fireEvent.click(await screen.findByRole("button",{name:"Confirm answer"}));
  expect(await screen.findByRole("status",{name:"Examiner audio requires a tap"})).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Tap to hear the AI examiner"})).toBeVisible();
  expect(screen.getByLabelText("Current examiner question")).toHaveTextContent("Wer übernimmt die Fahrkarten?");
  expect(screen.getByText(/Your answer was saved/)).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeEnabled();
  expect(screen.queryByText(/Good attempt/)).not.toBeInTheDocument();
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

test("resuming a typed simulation restores typing mode and keeps pending text editable",async()=>{
  const typedPending={...saved,
    examFlow:{mode:"simulation",key:"B1-2",title:"Ein Thema präsentieren",hints:[],points:[],cards:[],step:{index:1,seconds:180,role:"examiner"},maxAnswers:1},
    maxTranscriptChars:4800,
    pending:{pendingId:"typed-asr",transcript:"Ich übe Deutsch jeden Tag.",typed:true,uncertain:false}};
  global.fetch.mockImplementation(async url=>ok(String(url).endsWith("/status")
    ? {enabled:true,activeSession:typedPending} : typedPending));
  show();
  fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  expect(await screen.findByRole("button",{name:"⌨ Type"})).toHaveAttribute("aria-pressed","true");
  const transcript=screen.getByRole("textbox",{name:"Recognised speech"});
  expect(transcript).toHaveValue("Ich übe Deutsch jeden Tag.");
  expect(transcript).not.toHaveAttribute("readonly");
  expect(screen.getByRole("button",{name:"Edit typed answer"})).toBeInTheDocument();
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


async function recordFailedExamAnswer({status=503,code="voice_unavailable",error="Temporary processing error",onStatus}={}) {
  const active={...saved,resumed:true,answeredTurns:1,messages:[{role:"assistant",text:"Was essen Sie gern?"}]};
  let lookups=0,uploadCalls=0;
  global.fetch.mockImplementation(async url=>{
    if(String(url).endsWith("/status")) {
      lookups++;
      return ok({enabled:true,activeSession:onStatus ? onStatus(lookups,active):active});
    }
    if(String(url).endsWith("/start")) return ok(active);
    if(String(url).endsWith("/turn")) {
      uploadCalls++;
      return {ok:false,status,json:async()=>({code,error})};
    }
    throw new Error("Unexpected "+url);
  });
  let current=Date.now();
  jest.spyOn(Date,"now").mockImplementation(()=>current);
  const originalMediaRecorder=global.MediaRecorder,originalMedia=navigator.mediaDevices;
  const originalObjectUrl=URL.createObjectURL,originalRevoke=URL.revokeObjectURL;
  URL.createObjectURL=jest.fn(()=>"blob:fast-german-answer");
  URL.revokeObjectURL=jest.fn();
  let capturedRecorder;
  const stop=jest.fn();
  Object.defineProperty(navigator,"mediaDevices",{configurable:true,value:{
    getUserMedia:jest.fn(async()=>({getTracks:()=>[{stop}]})),
  }});
  global.MediaRecorder=class {
    static isTypeSupported(){return true;}
    constructor(_stream,options) {
      expect(options.audioBitsPerSecond).toBe(32000);
      capturedRecorder=this;this.state="inactive";this.mimeType="audio/webm";
    }
    start(){
      this.state="recording";
      this.ondataavailable({data:new Blob([new Uint8Array(1800)],{type:"audio/webm"})});
    }
    stop(){this.state="inactive";this.onstop?.();}
  };
  const cleanup=()=>{
    global.MediaRecorder=originalMediaRecorder;
    Object.defineProperty(navigator,"mediaDevices",{configurable:true,value:originalMedia});
    URL.createObjectURL=originalObjectUrl;URL.revokeObjectURL=originalRevoke;
  };
  try {
    const rendered=show();
    fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
    fireEvent.click(await screen.findByRole("button",{name:"Record German answer"}));
    await screen.findByRole("button",{name:"Stop and send recording"});
    current+=2200;
    fireEvent.click(screen.getByRole("button",{name:"Stop and send recording"}));
    await waitFor(()=>expect(uploadCalls).toBe(1));
    return {rendered,cleanup,uploadCount:()=>uploadCalls};
  } catch(e) { cleanup();throw e; }
}

test("after an interrupted iPhone upload, checking status restores the saved transcript without sending twice",async()=>{
  const x=await recordFailedExamAnswer({
    onStatus:(lookup,active)=>lookup>=2
      ? {...active,pending:{pendingId:"saved-pending",transcript:"Ich mag Gemüse.",typed:false}}
      : active,
  });
  try {
    expect(await screen.findByRole("group",{name:"Recover unsent speaking audio"})).toBeInTheDocument();
    expect(screen.getByLabelText("Listen to your own recording")).toHaveAttribute("src","blob:fast-german-answer");
    expect(screen.getByRole("link",{name:"Save a copy of your unconfirmed recording"})).toHaveAttribute("href","blob:fast-german-answer");
    fireEvent.click(screen.getByRole("button",{name:"Check saved answer / retry"}));
    expect(await screen.findByRole("textbox",{name:"What I said (you can edit this)"})).toHaveValue("Ich mag Gemüse.");
    expect(screen.getByRole("link",{name:"Save a copy of your unconfirmed recording"})).toHaveAttribute("href","blob:fast-german-answer");
    expect(x.uploadCount()).toBe(1);
    expect(screen.queryByRole("group",{name:"Recover unsent speaking audio"})).not.toBeInTheDocument();
  } finally {x.rendered.unmount();x.cleanup();}
});

test("a still-processing server keeps the device audio and does not create a duplicate turn",async()=>{
  const x=await recordFailedExamAnswer({
    code:"turn_in_progress",status:409,
    onStatus:(lookup,active)=>lookup>=2 ? {...active,processingAnswer:true}:active,
  });
  try {
    fireEvent.click(await screen.findByRole("button",{name:"Check saved answer / retry"}));
    expect(await screen.findByText(/still processing this recording/)).toBeInTheDocument();
    expect(x.uploadCount()).toBe(1);
    expect(screen.getByRole("group",{name:"Recover unsent speaking audio"})).toBeInTheDocument();
  } finally {x.rendered.unmount();x.cleanup();}
});

test("a rejected audio quota is reported honestly rather than as an internet failure",async()=>{
  const x=await recordFailedExamAnswer({
    status:429,code:"audio_limit",error:"The recording allowance is used. Finish with your saved answers.",
  });
  try {
    expect(await screen.findByRole("alert")).toHaveTextContent("The recording allowance is used.");
    expect(screen.queryByRole("group",{name:"Recover unsent speaking audio"})).not.toBeInTheDocument();
    expect(screen.getByLabelText("Listen to your own recording")).toHaveAttribute("src","blob:fast-german-answer");
    expect(x.uploadCount()).toBe(1);
  } finally {x.rendered.unmount();x.cleanup();}
});
