import React from "react";
import {fireEvent,render,screen} from "@testing-library/react";
import GoetheExamSpeakingStage from "./GoetheExamSpeakingStage";
import GoetheExamSpeakingResults from "./GoetheExamSpeakingResults";

const exam={examTask:{teil:"Teil 1",prompt:"Stellen Sie sich kurz vor"}};
const defaults={
  session:exam,level:"A1",topic:"Stellen Sie sich kurz vor",
  messages:[{role:"assistant",text:"Guten Tag. Stellen Sie sich bitte vor."}],
  progress:{answered:0,maxAnswers:3,complete:false},time:"04:34",
  recording:false,recordingSeconds:0,busy:false,audioPlaying:false,
  lastAudio:"abc123",onReplay:jest.fn(),pending:null,recognizedText:"",
  onTextChange:jest.fn(),uncertain:false,studentAudioUrl:"",
  onConfirm:jest.fn(),onRetry:jest.fn(),onRecord:jest.fn(),
  onStopRecording:jest.fn(),onFinish:jest.fn(),onEnd:jest.fn(),
  feedbackBusy:false,expired:false,errorMessage:"",
};
test("exam screen focuses on the spoken prompt, microphone and progress, not a chat feed",()=>{
  const onRecord=jest.fn();
  render(<GoetheExamSpeakingStage {...defaults} onRecord={onRecord}/>);
  expect(screen.getByRole("heading",{name:"Stellen Sie sich kurz vor"})).toBeInTheDocument();
  expect(screen.getByText("Guten Tag. Stellen Sie sich bitte vor.")).toBeInTheDocument();
  expect(screen.getByLabelText("Spoken answers 0 of 3")).toBeInTheDocument();
  expect(screen.getByText("04:34")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Record your answer"}));
  expect(onRecord).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button",{name:/Finish task & view feedback/})).toBeDisabled();
});

test("recording and transcript review use one prominent control and a clear check",()=>{
  const onStop=jest.fn();
  const {rerender}=render(<GoetheExamSpeakingStage {...defaults}
    recording recordingSeconds={7} onStopRecording={onStop}/>);
  fireEvent.click(screen.getByRole("button",{name:"Stop recording"}));
  expect(onStop).toHaveBeenCalledTimes(1);
  const onConfirm=jest.fn(),onRetry=jest.fn();
  rerender(<GoetheExamSpeakingStage {...defaults} pending={{pendingId:"x"}}
    recognizedText="Ich heiße Mia." onConfirm={onConfirm} onRetry={onRetry}
    uncertain studentAudioUrl="blob:test-url"/>);
  expect(screen.getByRole("group",{name:"Review German speech recognition"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Confirm answer"}));
  fireEvent.click(screen.getByRole("button",{name:"Record again"}));
  expect(onConfirm).toHaveBeenCalledTimes(1);
  expect(onRetry).toHaveBeenCalledTimes(1);
  expect(screen.getByLabelText("Listen to your own recording")).toBeInTheDocument();
});

test("completed task disables new answers, collapses history, and enables feedback",()=>{
  const onFinish=jest.fn();
  const student={role:"user",text:"Ich heiße Mia."};
  render(<GoetheExamSpeakingStage {...defaults} onFinish={onFinish}
    progress={{answered:3,maxAnswers:3,complete:true}}
    messages={[...defaults.messages,student]}/>);
  expect(screen.getByLabelText("Spoken answers 3 of 3")).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Record your answer"})).toBeDisabled();
  expect(screen.getByText(/You have answered all questions/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Finish task & view feedback"}));
  expect(onFinish).toHaveBeenCalledTimes(1);
  expect(screen.getByText(/Review your answers \(1\)/)).toBeInTheDocument();
});

test("results show task completion, two corrections and German example without fake scores",()=>{
  const onNewTask=jest.fn();
  const report={
    taskCompletion:"You covered your name and hometown, but not your hobbies.",
    strengths:"Your introduction is easy to understand.",
    improvements:["Say 'Ich wohne in Accra'.","Include your job in a full sentence."],
    modelAnswer:"Ich heiße Mia. Ich wohne in Accra.",
    nextStep:"Practise introductions once more.",
  };
  render(<GoetheExamSpeakingResults report={report} level="A1"
    task="Stellen Sie sich kurz vor" onNewTask={onNewTask}/>);
  expect(screen.getByRole("heading",{name:"Your Speaking Feedback"})).toBeInTheDocument();
  expect(screen.getByText(report.taskCompletion)).toBeInTheDocument();
  expect(screen.getByText(report.improvements[0])).toBeInTheDocument();
  expect(screen.getByText(report.modelAnswer)).toBeInTheDocument();
  expect(screen.getByText(/not an official Goethe exam score/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Try another task"}));
  expect(onNewTask).toHaveBeenCalled();
});
