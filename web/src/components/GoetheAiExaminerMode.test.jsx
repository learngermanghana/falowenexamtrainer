import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SpeakingPracticeModePicker from "./SpeakingPracticeModePicker";
import ExamLiveSpeakPanel from "./ExamLiveSpeakPanel";

jest.mock("./LiveSpeakPage",()=>{
  const React=require("react");
  return {__esModule:true,default:props=>React.createElement("div",{
    "data-testid":"examiner-voice-tutor",
    "data-context":JSON.stringify({level:props.initialLevel,topic:props.practiceTopic,
      source:props.practiceSource,task:props.examTask}),
  },"Spoken AI Examiner")};
});

const example={
  id:"a1-teil-1-introduction",teilLabel:"Teil 1",
  topicPrompt:"Stellen Sie sich kurz vor",
  keywordSubtopic:"Name, Alter, Wohnort, Land, Beruf, Hobby",
  hint:"Sprechen Sie kurz über alle Punkte",
};

test("two clear exam speaking modes with the AI Examiner separate from text coach",()=>{
  const onChange=jest.fn();
  render(<SpeakingPracticeModePicker value="coach" onChange={onChange} compact />);
  expect(screen.getByRole("button",{name:/Exam Coach/})).toHaveAttribute("aria-pressed","true");
  expect(screen.getByRole("button",{name:/Practise with AI Examiner/})).toHaveAttribute("aria-pressed","false");
  fireEvent.click(screen.getByRole("button",{name:/Practise with AI Examiner/}));
  expect(onChange).toHaveBeenCalledWith("voice");
});

test("selected real Goethe task flows to same voice engine with level and keywords",()=>{
  const onQuestionChange=jest.fn();
  render(<ExamLiveSpeakPanel level="A1" teil="1" onTeilChange={()=>{}} selectedQuestionId={example.id}
    onQuestionChange={onQuestionChange} questions={[example]} question={example}
    formatQuestion={q=>q.topicPrompt} />);
  const spoken=screen.getByTestId("examiner-voice-tutor");
  const context=JSON.parse(spoken.getAttribute("data-context"));
  expect(context).toEqual({
    level:"A1",topic:"Stellen Sie sich kurz vor",source:"exam-speaking-practice",
    task:{id:example.id,teil:"Teil 1",prompt:example.topicPrompt,
      keywords:example.keywordSubtopic,hint:example.hint},
  });
  expect(screen.getByRole("heading",{name:"Goethe AI Examiner"})).toBeInTheDocument();
  expect(screen.queryByText(/free voice pilot|payment|test access expires/i)).not.toBeInTheDocument();
});

test("no examiner is started when no speaking prompt has been selected",()=>{
  render(<ExamLiveSpeakPanel level="B1" teil="2" selectedQuestionId=""
    onTeilChange={()=>{}} onQuestionChange={()=>{}} questions={[]}
    formatQuestion={q=>q.topicPrompt} />);
  expect(screen.queryByTestId("examiner-voice-tutor")).not.toBeInTheDocument();
  expect(screen.getByText(/Select a speaking task to start your AI Examiner/)).toBeInTheDocument();
});

test("mode switch cannot be used while a legacy recording is in progress",()=>{
  const onChange=jest.fn();
  render(<SpeakingPracticeModePicker value="coach" onChange={onChange} disabled />);
  fireEvent.click(screen.getByRole("button",{name:/Practise with AI Examiner/}));
  expect(onChange).not.toHaveBeenCalled();
});
