import React from "react";
import {act,fireEvent,render,screen,waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import GoetheExamTaskCard from "./GoetheExamTaskCard";
import ExamLiveSpeakPanel from "./ExamLiveSpeakPanel";
import {examinerTaskPreview} from "../lib/examinerTaskPreview";
import {useAuth} from "../context/AuthContext";
const flows=require("../../../functions/functionz/goetheExaminerFlow");
jest.mock("../context/AuthContext",()=>({useAuth:jest.fn()}));
const task={id:"b1-2",teil:"Teil 2",prompt:"Ausbildung"};
afterEach(()=>{jest.restoreAllMocks();jest.useRealTimers();});

test("B1 notes survive starting the section, with preparation outside the voice session",()=>{
  jest.useFakeTimers();
  const preview=examinerTaskPreview("B1",task);
  const {rerender}=render(<GoetheExamTaskCard flow={preview} topic={task.prompt}/>);
  fireEvent.change(screen.getByRole("textbox",{name:"Your brief notes"}),{target:{value:"Erfahrung, Heimatland, Vorteile"}});
  fireEvent.click(screen.getByRole("button",{name:"Optional B1 preparation timer"}));
  act(()=>jest.advanceTimersByTime(2000));
  expect(screen.getByRole("timer")).toHaveTextContent("14:58");
  const examFlow=flows.createExaminerFlow("B1",task);
  rerender(<GoetheExamTaskCard flow={flows.publicFlow({examFlow,answeredTurns:0})} topic={task.prompt} active/>);
  expect(screen.getByRole("textbox",{name:"Your brief notes"})).toHaveValue("Erfahrung, Heimatland, Vorteile");
  expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  expect(screen.getByText(/up to 180s/)).toBeInTheDocument();
});

test("simulation hides coaching hints while retaining the actual exam card and calendar",()=>{
  const flow=examinerTaskPreview("A2",{teil:"Teil 3",prompt:"Zusammen einkaufen"},"simulation");
  render(<GoetheExamTaskCard flow={flow}/>);
  expect(screen.queryByText("Practice hints")).not.toBeInTheDocument();
  expect(screen.getByText("Mittwoch 18:00")).toBeInTheDocument();
  expect(screen.queryByText("Dienstag 17:00")).not.toBeInTheDocument();
  expect(screen.getByText(/Zusammen einkaufen/)).toBeInTheDocument();
});

test("the real examiner panel sends the selected mode and locks changes while active",async()=>{
  useAuth.mockReturnValue({idToken:"test",studentProfile:{level:"A1"}});
  const question={id:"a1",teilLabel:"Teil 1",topicPrompt:"Name"};
  let active=null;
  global.fetch=jest.fn(async (url,options)=>{
    const body=options?.body ? JSON.parse(options.body) : {};
    if(String(url).endsWith("/start")){
      expect(body.examinerFlowVersion).toBe(1);
      expect(body.examMode).toBe("simulation");
      const examFlow=flows.createExaminerFlow("A1",{teil:"Teil 1",prompt:"Name"},body.examMode);
      active={sessionId:"new",source:"exam-speaking-practice",level:"A1",topic:"Name",examTask:{id:"a1",teil:"Teil 1",prompt:"Name"},
        expiresAt:new Date(Date.now()+600000).toISOString(),answerLimit:3,examFlow:flows.publicFlow({examFlow}),maxRecordingSeconds:60};
      return {ok:true,json:async()=>active};
    }
    return {ok:true,json:async()=>String(url).endsWith("/status") ? {enabled:true,remaining:1,activeSession:active,examinerFlowVersion:1} : {reply:"Stellen Sie sich bitte vor.",audioBase64:""}};
  });
  render(<MemoryRouter><ExamLiveSpeakPanel level="A1" teil="1" selectedQuestionId="a1" questions={[question]} question={question}
    onTeilChange={()=>{}} onQuestionChange={()=>{}} formatQuestion={q=>q.topicPrompt}/></MemoryRouter>);
  fireEvent.click(screen.getByRole("button",{name:"Exam simulation"}));
  expect(screen.queryByText("Practice hints")).not.toBeInTheDocument();
  fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
  await waitFor(()=>expect(screen.getByRole("button",{name:"Guided practice"})).toBeDisabled());
  expect(screen.getByLabelText("Live conversation exam part")).toBeDisabled();
  expect(screen.getByLabelText("Live conversation speaking prompt")).toBeDisabled();
});

test("a backend that has not received the examiner update cannot consume a new session credit",async()=>{
  useAuth.mockReturnValue({idToken:"test",studentProfile:{level:"A1"}});
  global.fetch=jest.fn(async()=>({ok:true,json:async()=>({enabled:true,remaining:0,pilotAvailable:true})}));
  const question={id:"a1",teilLabel:"Teil 1",topicPrompt:"Name"};
  render(<MemoryRouter><ExamLiveSpeakPanel level="A1" teil="1" selectedQuestionId="a1" questions={[question]} question={question}
    onTeilChange={()=>{}} onQuestionChange={()=>{}} formatQuestion={q=>q.topicPrompt}/></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button",{name:"Start speaking"}));
  expect(await screen.findByRole("alert")).toHaveTextContent("Examiner practice is temporarily unavailable.");
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test.each(["A2","B1"])("%s shows level-specific stage instructions on the existing card",level=>{
  const task={teil:"Teil 2",prompt:"Freizeit"};
  const preview=examinerTaskPreview(level,task);
  render(<GoetheExamTaskCard flow={preview} topic={task.prompt}/>);
  expect(screen.getByText(preview.stageGuide)).toBeInTheDocument();
});

test("A2 highlights each personal card and says whose question comes next",()=>{
  const examFlow=flows.createExaminerFlow("A2",{teil:"Teil 1",prompt:"Wohnort"});
  render(<GoetheExamTaskCard flow={flows.publicFlow({examFlow,answeredTurns:3})} active/>);
  expect(screen.getByText(/Card 2 of 4/)).toHaveTextContent("Answer your partner’s question.");
  expect(screen.getAllByRole("listitem")[1]).toHaveAttribute("aria-current","step");
});

test("A1 Teil 2 shows one theme and word at a time, advancing after the answer turn",()=>{
  const task={teil:"Teil 2",prompt:"Essen und Trinken",keywords:"Lieblingsessen"};
  const examFlow=flows.createExaminerFlow("A1",task);
  const {rerender}=render(<GoetheExamTaskCard flow={examinerTaskPreview("A1",task)} topic={task.prompt}/>);
  expect(screen.getByText("Thema: Essen und Trinken")).toBeInTheDocument();
  expect(screen.getByText("Lieblingsessen")).toBeInTheDocument();
  expect(screen.queryByText("Frühstück")).not.toBeInTheDocument();
  rerender(<GoetheExamTaskCard flow={flows.publicFlow({examFlow,answeredTurns:1})} topic={task.prompt} active/>);
  expect(screen.getByText("Lieblingsessen")).toBeInTheDocument();
  expect(screen.queryByText("Frühstück")).not.toBeInTheDocument();
  rerender(<GoetheExamTaskCard flow={flows.publicFlow({examFlow,answeredTurns:2})} topic={task.prompt} active/>);
  expect(screen.getByText("Obst")).toBeInTheDocument();
  expect(screen.getByText("Thema: Einkaufen")).toBeInTheDocument();
  expect(screen.queryByText("Lieblingsessen")).not.toBeInTheDocument();
});

test("A1 Teil 1 uses the seven ruled personal prompts",()=>{
  render(<GoetheExamTaskCard flow={examinerTaskPreview("A1",{teil:"Teil 1",prompt:"Name"})}/>);
  expect(screen.getByRole("list",{name:"Personal introduction card"})).toBeInTheDocument();
  for(const prompt of ["Name?","Alter?","Land?","Wohnort?","Sprachen?","Beruf?","Hobby?"]) expect(screen.getByText(prompt)).toBeInTheDocument();
});

test("A1 Teil 3 frames only the current action picture",()=>{
  const task={teil:"Teil 3",prompt:"Fenster"};
  const examFlow=flows.createExaminerFlow("A1",task);
  render(<GoetheExamTaskCard flow={flows.publicFlow({examFlow,answeredTurns:0})} topic={task.prompt}/>);
  expect(screen.getByRole("group",{name:"A1 request picture card"})).toHaveTextContent("Sprechen Teil 3");
  expect(screen.getByRole("group",{name:"A1 request picture card"})).toHaveTextContent("Fenster");
  expect(screen.queryByText(examFlow.requestCards[1].word)).not.toBeInTheDocument();
});

test("A2 Teil 1 displays four personal cards in the reference layout",()=>{
  const task={teil:"Teil 1",prompt:"Wohnort"};
  render(<GoetheExamTaskCard flow={examinerTaskPreview("A2",task)} topic={task.prompt}/>);
  expect(screen.getByRole("list",{name:"A2 personal word cards"}).children).toHaveLength(4);
  expect(screen.getByText("Wohnort?")).toBeInTheDocument();
});

test("A2 Teil 2 shows the central question and exactly four keywords",()=>{
  const task={teil:"Teil 2",prompt:"Wofür geben Sie Ihr Geld aus?"};
  render(<GoetheExamTaskCard flow={examinerTaskPreview("A2",task)} topic={task.prompt}/>);
  expect(screen.getByRole("group",{name:"A2 topic and four keywords"})).toHaveTextContent(task.prompt);
  expect(screen.getByRole("list",{name:"Four speaking keywords"}).children).toHaveLength(4);
  for(const word of ["Kleidung","Lebensmittel / Miete","Sparen","Reisen"]) expect(screen.getByText(word)).toBeInTheDocument();
});

test("A2 Teil 3 displays the student's appointment calendar without the partner calendar",()=>{
  const task={teil:"Teil 3",prompt:"Ein Geschenk kaufen"};
  render(<GoetheExamTaskCard flow={examinerTaskPreview("A2",task)} topic={task.prompt}/>);
  expect(screen.getByRole("group",{name:"Your planning calendar"})).toHaveTextContent("Samstag");
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getByText("Fahrrad abholen")).toBeInTheDocument();
  expect(screen.getByText("13:00").closest("tr")).toHaveTextContent("frei");
  expect(screen.getByText("08:00").closest("tr")).toHaveTextContent("Schlafen");
});
