import React from "react";
import {act,fireEvent,render,screen,waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import LiveSpeakPage from "./LiveSpeakPage";
import {useAuth} from "../context/AuthContext";

jest.mock("../context/AuthContext",()=>({useAuth:jest.fn()}));
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

test("examiner automatically speaks German, then releases red microphone when audio finishes",async()=>{
  const voices=[];
  global.Audio=jest.fn(()=>{
    const player={play:jest.fn(async()=>{}),pause:jest.fn(),onended:null,onerror:null};
    voices.push(player);return player;
  });
  mount();
  fireEvent.click(await screen.findByRole("button",{name:"Start exam"}));
  expect(await screen.findByText("Guten Tag. Stellen Sie sich bitte vor.")).toBeInTheDocument();
  expect(await screen.findByText("Examiner speaking")).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeDisabled();
  expect(screen.getByRole("button",{name:/Replay examiner audio/})).toBeEnabled();
  await act(async()=>voices[0].onended());
  expect(screen.getByText("Your turn to speak")).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Record German answer"})).toBeEnabled();
  expect(global.fetch.mock.calls.filter(([url])=>String(url).endsWith("/turn"))).toHaveLength(1);
});

test("blocked autoplay gives a replay option and actionable microphone permission message",async()=>{
  const voices=[];
  global.Audio=jest.fn(()=>{
    const player={play:jest.fn().mockRejectedValueOnce(new Error("Gesture required")).mockResolvedValue(undefined),
      pause:jest.fn(),onended:null,onerror:null};
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
    fireEvent.click(await screen.findByRole("button",{name:"Start exam"}));
    expect(await screen.findByText("Examiner audio needs a replay")).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Record German answer"})).toBeEnabled();
    fireEvent.click(screen.getByRole("button",{name:"Record German answer"}));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Allow microphone permission/);
    fireEvent.click(screen.getByRole("button",{name:/Replay examiner audio/}));
    await waitFor(()=>expect(screen.getByText("Examiner speaking")).toBeInTheDocument());
    await act(async()=>voices[1].onended());
    expect(screen.getByText("Your turn to speak")).toBeInTheDocument();
  } finally {
    global.MediaRecorder=previousMediaRecorder;
    Object.defineProperty(navigator,"mediaDevices",{configurable:true,value:previousMediaDevices});
  }
});
