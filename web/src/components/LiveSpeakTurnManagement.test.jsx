import React from "react";
import {act,fireEvent,render,screen,waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import LiveSpeakPage from "./LiveSpeakPage";
import {useAuth} from "../context/AuthContext";

jest.mock("../context/AuthContext",()=>({useAuth:jest.fn()}));
jest.mock("../services/presentationCoachService",()=>({requestCoachSpeech:jest.fn()}));
import {requestCoachSpeech} from "../services/presentationCoachService";
const examTask={id:"a1-intro",teil:"Teil 1",prompt:"Stellen Sie sich bitte vor"};
const examFlow={key:"A1-1",mode:"guided",title:"Sich vorstellen",cards:[],points:[],hints:[],step:{index:1,role:"examiner",seconds:60},maxAnswers:4};
const session={sessionId:"exam-turn",level:"A1",source:"exam-speaking-practice",examTask,topic:examTask.prompt,
  expiresAt:new Date(Date.now()+180000).toISOString(),answerLimit:4,answeredTurns:0,maxRecordingSeconds:60,examFlow};
const ok=(data)=>({ok:true,json:async()=>data});
const mount=()=>render(<MemoryRouter><LiveSpeakPage embedded initialLevel="A1" practiceSource="exam-speaking-practice"
  practiceTopic={examTask.prompt} examTask={examTask} /></MemoryRouter>);

beforeEach(()=>{
  useAuth.mockReturnValue({idToken:"token",studentProfile:{level:"A1"}});
  global.fetch=jest.fn(async (url,options)=>{
    if(String(url).endsWith("/status")) return ok({enabled:true,remaining:1,examinerFlowVersion:1});
    if(String(url).endsWith("/start")) return ok({...session});
    if(String(url).endsWith("/turn")) return ok({reply:"Guten Tag. Stellen Sie sich bitte vor.",speaker:"examiner",audioBase64:"YXVkaW8="});
    throw new Error("Unexpected request "+url);
  });
});
afterEach(()=>jest.restoreAllMocks());

test("examiner automatically speaks German, then releases microphone when audio finishes",async()=>{
  const voices=[];
  global.Audio=jest.fn(()=>{
    const player={play:jest.fn(async()=>{}),pause:jest.fn(),onended:null,onerror:null};
    voices.push(player);return player;
  });
  mount();
  fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
  await waitFor(()=>expect(screen.getByLabelText("Current examiner question")).toHaveTextContent("Guten Tag. Stellen Sie sich bitte vor."));
  expect(await screen.findByText("Examiner speaking")).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeDisabled();
  expect(screen.getByRole("button",{name:/Listen to question again/})).toBeEnabled();
  await act(async()=>voices[0].onended());
  expect(screen.getByText("Your turn to speak")).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeEnabled();
  expect(global.fetch.mock.calls.filter(([url])=>String(url).endsWith("/turn"))).toHaveLength(1);
});

test("blocked autoplay gives a replay option and actionable microphone permission message",async()=>{
  const voices=[];
  let playAttempts=0;
  global.Audio=jest.fn(()=>{
    const player={play:jest.fn(()=>{
      playAttempts++;
      return playAttempts === 1 ? Promise.reject(new Error("Gesture required")) : Promise.resolve();
    }),pause:jest.fn(),onended:null,onerror:null};
    voices.push(player);return player;
  });
  const previousMediaRecorder=global.MediaRecorder;
  global.MediaRecorder=class {static isTypeSupported(){return true;}};
  const previousMediaDevices=navigator.mediaDevices;
  Object.defineProperty(navigator,"mediaDevices",{configurable:true,value:{
    getUserMedia:jest.fn().mockRejectedValue(Object.assign(new Error("Denied"),{name:"NotAllowedError"}))
  }});
  try {
    mount();
    fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
    expect(await screen.findByText("Examiner audio needs a replay")).toBeInTheDocument();
    expect(screen.getByRole("status",{name:"Examiner audio requires a tap"})).toHaveTextContent(/On iPhone/);
    expect(screen.getByRole("button",{name:"Tap to hear the AI examiner"})).toBeVisible();
    expect(screen.getByRole("button",{name:"Record German answer"})).toBeEnabled();
    fireEvent.click(screen.getByRole("button",{name:"Record German answer"}));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Allow microphone permission/);
    fireEvent.click(screen.getByRole("button",{name:"Tap to hear the AI examiner"}));
    await waitFor(()=>expect(screen.getByText("Examiner speaking")).toBeInTheDocument());
    expect(screen.queryByRole("status",{name:"Examiner audio requires a tap"})).not.toBeInTheDocument();
    await act(async()=>voices[1].onended());
    expect(screen.getByText("Your turn to speak")).toBeInTheDocument();
  } finally {
    global.MediaRecorder=previousMediaRecorder;
    Object.defineProperty(navigator,"mediaDevices",{configurable:true,value:previousMediaDevices});
  }
});


test("long examiner conversation scrolls within the old coach bubbles and keeps recording controls below",async()=>{
  const turns=Array.from({length:28},(_,i)=>({
    role:i%2===0?"assistant":"user",
    text:(i%2===0?"Bitte antworten Sie auf Deutsch. ":"Ich spreche gern Deutsch. ").repeat(8),
    speaker:"examiner"
  }));
  global.fetch=jest.fn(async(url)=>{
    if(String(url).endsWith("/status")) return ok({enabled:true,remaining:1,examinerFlowVersion:1});
    if(String(url).endsWith("/start")) return ok({...session,resumed:true,messages:turns});
    throw new Error("Unexpected network request "+url);
  });
  mount();
  fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
  const history=await screen.findByText("Previous dialogue · 28 messages");
  fireEvent.click(history);
  const log=screen.getByRole("log",{name:"Examiner conversation"});
  expect(log.querySelectorAll(".speaking-exam-message-bubble")).toHaveLength(28);
  expect(log.querySelectorAll(".speaking-exam-message-row.is-student")).toHaveLength(14);
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeInTheDocument();
  expect(log.compareDocumentPosition(screen.getByRole("button",{name:"Record German answer"})) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  Object.defineProperties(log,{
    scrollHeight:{value:1200,configurable:true},
    clientHeight:{value:240,configurable:true},
    scrollTop:{value:200,writable:true,configurable:true}
  });
  fireEvent.scroll(log);
  expect(screen.getByRole("button",{name:"↓ Latest message"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"↓ Latest message"}));
  expect(log.scrollTop).toBe(1200);
  expect(screen.queryByRole("button",{name:"↓ Latest message"})).not.toBeInTheDocument();
});

test("mobile speaking CSS bounds the conversation independently from its sticky answer composer",()=>{
  const fs=require("fs");
  const path=require("path");
  const css=fs.readFileSync(path.resolve(__dirname,"../App.css"),"utf8");
  expect(css).toContain(".speaking-exam-chat-thread");
  expect(css).toContain("height: clamp(220px, 38dvh, 380px)");
  expect(css).toContain("height: clamp(190px, 36dvh, 300px)");
  expect(css).toContain(".speaking-exam-session__answer");
  expect(css).toContain("bottom: env(safe-area-inset-bottom, 0px)");
  expect(css).toContain(".speaking-exam-message-row.is-student");
});


test("an exhausted pilot starts a real AI examiner tryout instead of local-only recording",async()=>{
  const players=[];
  global.Audio=jest.fn(()=>{
    const player={play:jest.fn(async()=>{}),pause:jest.fn(),onended:null,onerror:null};
    players.push(player);return player;
  });
  global.fetch=jest.fn(async(url)=>{
    if(String(url).endsWith("/status")) return ok({
      enabled:true,remaining:0,pilotClaimed:true,pilotAvailable:false,
      capReached:true,examTryoutAvailable:true,examinerFlowVersion:1,
    });
    if(String(url).endsWith("/start")) return ok({...session,examTryout:true});
    if(String(url).endsWith("/turn")) return ok({
      reply:"Guten Tag. Stellen Sie sich bitte vor.",speaker:"examiner",audioBase64:"YXVkaW8=",
    });
    throw new Error("Unexpected network request "+url);
  });
  mount();
  expect(await screen.findByRole("button",{name:"Start speaking"})).toBeInTheDocument();
  expect(screen.queryByRole("button",{name:"Record local speaking practice"})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Start speaking"}));
  await waitFor(()=>expect(screen.getByLabelText("Current examiner question")).toHaveTextContent("Guten Tag. Stellen Sie sich bitte vor."));
  expect(await screen.findByText("Examiner speaking")).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeDisabled();
  await act(async()=>players[0].onended());
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeEnabled();
  expect(global.fetch.mock.calls.some(([url])=>String(url).endsWith("/live-speak/pilot/claim"))).toBe(false);
  expect(global.fetch.mock.calls.some(([url])=>String(url).endsWith("/session/turn"))).toBe(true);
});


test("completed Teil automatically saves feedback and offers continue instead of ending",async()=>{
 const completed=jest.fn(),next=jest.fn();
 const messages=[
   {role:"assistant",text:"Stellen Sie sich vor."},
   {role:"user",text:"Ich heiße Anna."},
   {role:"assistant",text:"Buchstabieren Sie bitte."},
   {role:"user",text:"A N N A"}
 ];
 const finished={...session,taskReady:true,answeredTurns:4,resumed:true,messages};
 let hasFeedback=false;
 global.fetch=jest.fn(async(url)=>{
   if(String(url).endsWith("/status")) return ok({enabled:true,remaining:1,examinerFlowVersion:1,
     ...(hasFeedback?{lastExamResult:{...finished,feedback:"Task Completion: Good introduction."}}:{})});
   if(String(url).endsWith("/start")) return ok(finished);
   if(String(url).endsWith("/exam-feedback")){
     hasFeedback=true;
     return ok({feedback:"**Task Completion:** Clear introduction.\\n**Strength:** Good sentences."});
   }
   throw new Error("Unexpected "+url);
 });
 render(<MemoryRouter><LiveSpeakPage embedded initialLevel="A1" practiceSource="exam-speaking-practice"
   practiceTopic={examTask.prompt} examTask={examTask}
   onExamCompleted={completed} onContinueToNext={next}/></MemoryRouter>);
 fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
 expect(await screen.findByRole("button",{name:/Continue to Teil 2/})).toBeInTheDocument();
 expect(global.fetch.mock.calls.filter(([url])=>String(url).endsWith("/exam-feedback"))).toHaveLength(1);
 expect(completed).toHaveBeenCalledWith(expect.objectContaining({
   taskId:"a1-intro",level:"A1",teil:"Teil 1",feedback:expect.stringContaining("Task Completion")
 }));
 expect(screen.queryByRole("button",{name:"End without feedback"})).not.toBeInTheDocument();
 expect(screen.getByRole("button",{name:"View detailed feedback"})).toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:/Continue to Teil 2/}));
 expect(next).toHaveBeenCalledTimes(1);
});

test("old Teil feedback is not restored into a newly selected task",async()=>{
 const past={level:"A1",examTask:{id:"a1-intro",teil:"Teil 1"},feedback:"Old task feedback",messages:[]};
 global.fetch=jest.fn(async()=>ok({enabled:true,remaining:0,examinerFlowVersion:1,
   pilotClaimed:true,capReached:true,lastExamResult:past}));
 render(<MemoryRouter><LiveSpeakPage embedded initialLevel="A1" practiceSource="exam-speaking-practice"
   practiceTopic="Essen" examTask={{id:"a1-teil2-essen",teil:"Teil 2",prompt:"Essen"}} /></MemoryRouter>);
 expect(await screen.findByRole("button",{name:"Record local speaking practice"})).toBeInTheDocument();
 expect(screen.queryByText("Old task feedback")).not.toBeInTheDocument();
});

test("reset requires confirmation and ends the server session before returning home",async()=>{
 const reset=jest.fn();
 global.fetch=jest.fn(async(url)=>{
   if(String(url).endsWith("/status")) return ok({enabled:true,remaining:1,examinerFlowVersion:1});
   if(String(url).endsWith("/start")) return ok({...session,resumed:true,messages:[]});
   if(String(url).endsWith("/turn")) return ok({reply:"Bitte antworten Sie.",audioBase64:""});
   if(String(url).endsWith("/end")) return ok({ok:true});
   throw new Error("Unexpected "+url);
 });
 render(<MemoryRouter><LiveSpeakPage embedded initialLevel="A1" practiceSource="exam-speaking-practice"
   practiceTopic={examTask.prompt} examTask={examTask} onSessionReset={reset}/></MemoryRouter>);
 fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
 fireEvent.click(await screen.findByRole("button",{name:"Reset session"}));
 expect(screen.getByRole("alertdialog",{name:"Reset speaking session"})).toBeInTheDocument();
 expect(global.fetch.mock.calls.some(([url])=>String(url).endsWith("/end"))).toBe(false);
 fireEvent.click(screen.getByRole("button",{name:"Keep practising"}));
 expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Reset session"}));
 fireEvent.click(screen.getByRole("alertdialog",{name:"Reset speaking session"}).querySelector("button:last-child"));
 await waitFor(()=>expect(reset).toHaveBeenCalledTimes(1));
 expect(global.fetch.mock.calls.some(([url])=>String(url).endsWith("/end"))).toBe(true);
});

test("failed reset keeps session visible so the learner can retry safely",async()=>{
 global.fetch=jest.fn(async(url)=>{
   if(String(url).endsWith("/status")) return ok({enabled:true,remaining:1,examinerFlowVersion:1});
   if(String(url).endsWith("/start")) return ok({...session,resumed:true,messages:[{role:"assistant",text:"Wie heißen Sie?"}]});
   if(String(url).endsWith("/end")) return {ok:false,json:async()=>({error:"Offline"})};
   throw new Error("Unexpected "+url);
 });
 mount();
 fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
 fireEvent.click(await screen.findByRole("button",{name:"Reset session"}));
 fireEvent.click(screen.getByRole("alertdialog",{name:"Reset speaking session"}).querySelector("button:last-child"));
 expect(await screen.findByRole("alert")).toHaveTextContent(/Could not reset the session/);
 expect(screen.getByRole("heading",{name:"AI Examiner · A1"})).toBeInTheDocument();
});

test("typed practice uses the metered answer route and confirms before the examiner responds",async()=>{
 global.fetch=jest.fn(async(url,options)=>{
   if(String(url).endsWith("/status")) return ok({enabled:true,remaining:1,examinerFlowVersion:1});
   if(String(url).endsWith("/start")) return ok({...session,resumed:true,messages:[{role:"assistant",text:"Wie heißen Sie?"}]});
   if(String(url).endsWith("/turn")) return ok({needsConfirmation:true,pendingId:"typed-1",transcript:"Ich heiße Anna.",typed:true});
   if(String(url).endsWith("/confirm")) return ok({transcript:"Ich heiße Anna.",reply:"Danke!",audioBase64:"",taskReady:false});
   throw new Error("Unexpected "+url);
 });
 mount();
 fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
 fireEvent.click(await screen.findByRole("button",{name:"⌨ Type"}));
 fireEvent.change(screen.getByRole("textbox",{name:"Type your German answer"}),{target:{value:"Ich heiße Anna."}});
 fireEvent.click(screen.getByRole("button",{name:"Send typed answer"}));
 await screen.findByText("Check your typed answer, then confirm it.");
 const request=global.fetch.mock.calls.find(([url])=>String(url).endsWith("/turn"));
 expect(JSON.parse(request[1].body)).toEqual(expect.objectContaining({typedAnswer:"Ich heiße Anna.",intro:false}));
 fireEvent.click(screen.getByRole("button",{name:"Confirm answer"}));
 await waitFor(()=>expect(global.fetch.mock.calls.some(([url])=>String(url).endsWith("/confirm"))).toBe(true));
});

test("full-exam continuation starts exactly one session after status loads",async()=>{
  render(<MemoryRouter><LiveSpeakPage embedded initialLevel="A1" practiceSource="exam-speaking-practice"
    practiceTopic={examTask.prompt} examTask={examTask} autoStart freshAttempt /></MemoryRouter>);
  await screen.findByRole("button",{name:"Record German answer"});
  const starts=global.fetch.mock.calls.filter(([url])=>String(url).endsWith("/start"));
  expect(starts).toHaveLength(1);
});

test("deliberate repeat does not restore old feedback over the new attempt",async()=>{
  global.fetch=jest.fn(async(url)=>{
    if(String(url).endsWith("/status")) return ok({enabled:true,remaining:1,examinerFlowVersion:1,lastExamResult:{level:"A1",examTask,feedback:"Old completed attempt"}});
    throw new Error("Unexpected request "+url);
  });
  render(<MemoryRouter><LiveSpeakPage embedded initialLevel="A1" practiceSource="exam-speaking-practice"
    practiceTopic={examTask.prompt} examTask={examTask} freshAttempt /></MemoryRouter>);
  expect(await screen.findByRole("button",{name:"Start speaking"})).toBeInTheDocument();
  expect(screen.queryByText("Old completed attempt")).not.toBeInTheDocument();
});


test("an empty resumed session requests its missing spoken opening",async()=>{
  global.fetch=jest.fn(async(url)=>{
    if(String(url).endsWith("/status")) return ok({enabled:true,remaining:1,examinerFlowVersion:1});
    if(String(url).endsWith("/start")) return ok({...session,resumed:true,messages:[],answeredTurns:0});
    if(String(url).endsWith("/turn")) return ok({reply:"Stellen Sie sich bitte vor.",audioBase64:"YXVkaW8="});
    throw new Error("Unexpected request "+url);
  });
  global.Audio=jest.fn(()=>({play:jest.fn().mockResolvedValue(),pause:jest.fn()}));
  mount();
  fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
  await waitFor(()=>expect(screen.getByLabelText("Current examiner question")).toHaveTextContent("Stellen Sie sich bitte vor."));
  expect(global.fetch.mock.calls.filter(([url])=>String(url).endsWith("/turn"))).toHaveLength(1);
  expect(screen.getByRole("button",{name:/Listen to question again/})).toBeInTheDocument();
});

test("recording does not remove the examiner replay button",async()=>{
  global.Audio=jest.fn(()=>({play:jest.fn().mockResolvedValue(),pause:jest.fn()}));
  mount();
  fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
  await screen.findByRole("button",{name:/Listen to question again/});
  expect(screen.queryByLabelText("Examiner audio player")).not.toBeInTheDocument();
  expect(screen.getByRole("button",{name:/Listen to question again/})).toBeInTheDocument();
});

test("saved questions can request German audio on demand without replaying the opening",async()=>{
  const resume={...session,resumed:true,messages:[{role:"assistant",text:"Wie heißen Sie?"}],answeredTurns:1};
  global.fetch=jest.fn(async(url)=>ok(String(url).endsWith("/status")?{enabled:true,activeSession:resume}:resume));
  requestCoachSpeech.mockResolvedValue("blob:examiner-replay");
  global.Audio=jest.fn(()=>({play:jest.fn().mockResolvedValue(),pause:jest.fn()}));
  const priorRevoke=URL.revokeObjectURL;URL.revokeObjectURL=jest.fn();
  try {
    const view=mount();
    fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
    fireEvent.click(await screen.findByRole("button",{name:/Listen to question again/}));
    await waitFor(()=>expect(requestCoachSpeech).toHaveBeenCalledWith(expect.objectContaining({text:"Wie heißen Sie?",level:"A1",idToken:"token"})));
    expect(global.fetch.mock.calls.some(([url])=>String(url).endsWith("/turn"))).toBe(false);
    view.unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:examiner-replay");
  } finally {URL.revokeObjectURL=priorRevoke;}
});

test("Edit typed answer discards the exact server pending candidate before allowing a replacement turn",async()=>{
  const saved={...session,resumed:true,answeredTurns:1,
    messages:[{role:"assistant",text:"Warum lernen Sie Deutsch?"}],
    pending:{pendingId:"first-typed",transcript:"Ich lerne Deutsch.",typed:true}};
  let unblockDiscard;
  global.fetch=jest.fn(async(url,options)=>{
    if(String(url).endsWith("/status")) return ok({enabled:true,remaining:1,activeSession:saved});
    if(String(url).endsWith("/start")) return ok(saved);
    if(String(url).endsWith("/discard-pending")) return new Promise(resolve=>{unblockDiscard=resolve;});
    if(String(url).endsWith("/turn")) return ok({needsConfirmation:true,typed:true,
      pendingId:"replacement",transcript:JSON.parse(options.body).typedAnswer});
    throw new Error("Unexpected "+url);
  });
  mount();
  fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  fireEvent.click(await screen.findByRole("button",{name:"Edit typed answer"}));
  await waitFor(()=>expect(unblockDiscard).toBeDefined());
  const request=global.fetch.mock.calls.find(([url])=>String(url).endsWith("/discard-pending"));
  expect(JSON.parse(request[1].body)).toEqual({sessionId:"exam-turn",pendingId:"first-typed"});
  expect(screen.getByRole("button",{name:"Confirm answer"})).toBeInTheDocument();
  expect(global.fetch.mock.calls.some(([url])=>String(url).endsWith("/turn"))).toBe(false);
  await act(async()=>unblockDiscard(ok({ok:true,discarded:true})));
  const editable=await screen.findByRole("textbox",{name:"Type your German answer"});
  expect(editable).toHaveValue("Ich lerne Deutsch.");
  fireEvent.change(editable,{target:{value:"Ich lerne Deutsch, weil ich in Berlin arbeiten möchte."}});
  fireEvent.click(screen.getByRole("button",{name:"Send typed answer"}));
  await waitFor(()=>expect(global.fetch.mock.calls.filter(([url])=>String(url).endsWith("/turn"))).toHaveLength(1));
  expect(await screen.findByText("Check your typed answer, then confirm it.")).toBeInTheDocument();
});

test("Record again retains the original pending answer if the server discard fails",async()=>{
  const saved={...session,resumed:true,answeredTurns:1,
    messages:[{role:"assistant",text:"Was essen Sie gern?"}],
    pending:{pendingId:"first-audio",transcript:"Ich esse gern Brot.",typed:false}};
  let discards=0;
  global.fetch=jest.fn(async(url)=>{
    if(String(url).endsWith("/status")) return ok({enabled:true,remaining:1,activeSession:saved});
    if(String(url).endsWith("/start")) return ok(saved);
    if(String(url).endsWith("/discard-pending")) {
      discards++;
      return discards===1
        ? {ok:false,json:async()=>({code:"discard_unavailable",error:"Connection lost"})}
        : ok({ok:true,discarded:true});
    }
    throw new Error("Unexpected "+url);
  });
  mount();
  fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  fireEvent.click(await screen.findByRole("button",{name:"Record again"}));
  expect(await screen.findByRole("alert")).toHaveTextContent(/Could not discard your unfinished answer/);
  expect(screen.getByRole("button",{name:"Confirm answer"})).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeDisabled();
  fireEvent.click(screen.getByRole("button",{name:"Record again"}));
  await waitFor(()=>expect(screen.queryByRole("button",{name:"Confirm answer"})).not.toBeInTheDocument());
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeEnabled();
  expect(discards).toBe(2);
});

test("stuck iPhone examiner playback can be stopped without another AI call or recording", async () => {
  const player = {play:jest.fn().mockResolvedValue(),pause:jest.fn(),onended:null,onerror:null};
  global.Audio=jest.fn(()=>player);
  mount();
  fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
  await screen.findByText("Examiner speaking");
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeDisabled();
  const turnsBefore=global.fetch.mock.calls.filter(([url])=>String(url).endsWith("/turn")).length;
  fireEvent.click(screen.getByRole("button", {name:/Continue with written question · unlock microphone/}));
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeEnabled();
  expect(screen.getByText(/Examiner audio stopped/)).toBeInTheDocument();
  expect(player.pause).toHaveBeenCalled();
  expect(global.fetch.mock.calls.filter(([url])=>String(url).endsWith("/turn"))).toHaveLength(turnsBefore);
});

test("A1 Day 19 resumes a server-graded Teil after lost feedback response without grading twice",async()=>{
  const ownedTask={...examTask,courseAssignmentKey:"A1-5.9",
    mockAttemptId:"11111111-1111-4111-8111-111111111111"};
  const saved={...session,examTask:ownedTask,resumed:true,
    messages:[{role:"assistant",text:"Wie heißen Sie?"},{role:"user",text:"Ich heiße Anna."}],
    confirmedAnswers:["Ich heiße Anna."],answeredTurns:1};
  const assessment={practiceOnly:true,score:7,maxScore:10,percent:70,
    tasks:[{step:1,score:7,maxScore:10}],summary:"Good response"};
  let released=false;
  global.fetch=jest.fn(async(url)=>{
    if(String(url).includes("/live-speak/status")) return ok(released
      ? {enabled:true,activeSession:null,lastExamResult:{...saved,assessment,
          feedback:"Saved speaking feedback"}}
      : {enabled:true,activeSession:saved,examinerFlowVersion:1});
    if(String(url).endsWith("/session/start"))return ok(saved);
    throw new Error("Unexpected API call "+url);
  });
  const completed=jest.fn(()=>true);
  render(<MemoryRouter><LiveSpeakPage embedded initialLevel="A1" gradedCourseMock
    practiceSource="exam-speaking-practice" practiceTopic={ownedTask.prompt}
    examTask={ownedTask} onExamCompleted={completed}/></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button",{name:"Resume speaking"}));
  const recover=await screen.findByRole("button",{name:"Check saved answer / speaking progress"});
  released=true;
  fireEvent.click(recover);
  await waitFor(()=>expect(completed).toHaveBeenCalledWith(expect.objectContaining({
    sessionId:saved.sessionId,taskId:ownedTask.id,teil:"Teil 1",assessment,
  })));
  expect(global.fetch.mock.calls.filter(([url])=>String(url).endsWith("/exam-feedback"))).toHaveLength(0);
});
