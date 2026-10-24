import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import B2ExamDomainGrammarNotes from "./B2ExamDomainGrammarNotes";
import B2KnowledgeChoicePractice from "./B2KnowledgeChoicePractice";
import { enhanceB2ExamDomainLesson, getB2ExamDomainTeaching } from "../data/b2ExamDomainTeaching";
import { B2_LESSON_CONTENT_ALIGNMENT } from "../data/b2LessonContentAlignment";
import { B2_TOPIC_COLLOCATIONS } from "../data/b2TopicCollocations";

it.each(Array.from({ length: 28 }, (_, i) => i + 1))("renders detailed grammar and aligned practice for Day %i", (day) => {
  const lesson = enhanceB2ExamDomainLesson({ day, grammarLesson: { title: "Old grammar", explanation: ["Old notes"] } });
  render(<B2ExamDomainGrammarNotes lesson={lesson} />);
  const grammar = getB2ExamDomainTeaching(day).grammarLesson;
  expect(lesson.title).toBe(B2_LESSON_CONTENT_ALIGNMENT[day].title);
  expect(screen.queryByText("Old notes")).not.toBeInTheDocument();
  grammar.sections.forEach((section) => {
    expect(screen.getByText(section.sentence)).toBeInTheDocument();
    expect(screen.getByText(section.analysis)).toBeInTheDocument();
  });
  expect(screen.getByText("Mögliche Lösung anzeigen")).toBeInTheDocument();
  expect(grammar.knowledgeTest).toHaveLength(2);
  grammar.knowledgeTest.forEach((item) => {
    expect(item.options.filter((option) => option === item.answer)).toHaveLength(1);
    expect(new Set(item.options).size).toBe(3);
    expect(item.explanation).toBeTruthy();
  });
  expect(B2_TOPIC_COLLOCATIONS[day]).toHaveLength(6);
});

it("keeps the reading acknowledgement controlled", () => {
  const onCheckedChange = jest.fn();
  const lesson = enhanceB2ExamDomainLesson({ day: 1 });
  render(<B2ExamDomainGrammarNotes lesson={lesson} onCheckedChange={onCheckedChange} />);
  fireEvent.click(screen.getByRole("checkbox"));
  expect(onCheckedChange).toHaveBeenCalledWith(true);
});

it("uses grammar decisions with feedback in the existing knowledge-check flow", () => {
  window.localStorage.clear();
  const lesson = enhanceB2ExamDomainLesson({ day: 1 });
  const onCompleteChange = jest.fn();
  render(<B2KnowledgeChoicePractice lesson={lesson} onCompleteChange={onCompleteChange} />);
  lesson.grammarLesson.knowledgeTest.forEach((item) => {
    fireEvent.click(screen.getByRole("button", { name: item.answer }));
    expect(screen.getByText(new RegExp(item.explanation.slice(0, 35)))).toBeInTheDocument();
  });
  expect(screen.getByText(/Ergebnis: 2\/2/)).toBeInTheDocument();
  expect(onCompleteChange).toHaveBeenLastCalledWith(true);
});
