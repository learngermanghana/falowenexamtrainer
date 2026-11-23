import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getA1RadioResource } from "../data/a1RadioResources";
import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";
import { buildA1WorkbookVideoModel } from "./A1WorkbookVideoHeader";
import {
  DAY14_GUIDED_CHECKS,
  DAY14_WRITTEN_TASKS,
  DAY14_KNOWLEDGE_QUESTIONS,
  DAY14_FINAL_TASKS,
} from "../data/a1Day14TravelHotelWorkbook";
import A1Day14ModalVerbsWorkbookPage, { isSharedA2Day17Context } from "./A1Day14ModalVerbsWorkbookPage";

const route = "/campus/course/modal-verbs-day-14-3-6";
const workbookRoute = route + "?radio=done&materials=done";

const open = (url = workbookRoute) => render(
  <MemoryRouter initialEntries={[url]}><A1Day14ModalVerbsWorkbookPage /></MemoryRouter>,
);

describe("A1 Day 14 modal verbs, trains and hotels workbook", () => {
  test("preserves Day 14 route, Radio lesson, video resources and self-practice identity", () => {
    const { container } = open(route + "?radio=done");
    expect(container.querySelector('[data-a1-day14-travel-hotel-workbook="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Day 14 Workbook · Modal Verbs with Separable Verbs/i })).toBeVisible();
    expect(screen.getByText(/This is a self-practice workbook/i)).toBeVisible();
    expect(getA1TeacherVideoResources(14)).toEqual([
      expect.objectContaining({ chapter: "3.6", url: "https://youtu.be/0zps4OYwShg" }),
    ]);
    expect(buildA1WorkbookVideoModel({ pathname: route })).toEqual(
      expect.objectContaining({ lessonId: "A1-3.6", assessmentLabel: "Self-practice", youtubeId: "Wkj1-TnNUxY" }),
    );
    expect(getA1RadioResource(14, "3.6")).toEqual(
      expect.objectContaining({ key: "a1-day14-modal-verbs-separable-verbs-falowen-radio",
        chapter: "3.6", youtubeId: "GeHygJE7Hww" }),
    );
    expect(resolveA1RadioFirstWorkbookRoute(route, "")).toEqual({ day: 14, chapter: "3.6" });
  });

  test("revises verb-second, separable infinitives, four modal verbs and hotel vocabulary", () => {
    open();
    expect(document.body).toHaveTextContent("Morgen fahre ich nach Berlin.");
    expect(document.body).toHaveTextContent("Ich steige in den Zug ein.");
    expect(document.body).toHaveTextContent("Ich möchte in den Zug einsteigen.");
    expect(document.body).toHaveTextContent("Heute muss ich umsteigen.");
    for (const term of ["einsteigen", "aussteigen", "umsteigen", "übernachten",
      "reservieren", "buchen", "das Einzelzimmer", "das Doppelzimmer"]) {
      expect(document.body).toHaveTextContent(term);
    }
    expect(screen.getByRole("heading", { name: /Four modal verbs for A1/i })).toBeVisible();
    for (const modal of ["können", "möchten", "wollen", "müssen"]) {
      expect(screen.getByText(modal, { selector: ".a1d14w-modal-card strong" })).toBeInTheDocument();
    }
    expect(screen.queryByText("dürfen", { selector: ".a1d14w-modal-card strong" })).not.toBeInTheDocument();
    expect(screen.queryByText("sollen", { selector: ".a1d14w-modal-card strong" })).not.toBeInTheDocument();
    const combobox = screen.getByRole("combobox", { name: "Choose modal verb to review" });
    fireEvent.change(combobox, { target: { value: "müssen" } });
    expect(within(document.querySelector('[data-a1-modal-conjugation-cards="true"]')).getByText("musst")).toBeVisible();
    fireEvent.click(screen.getByText("Show complete conjugation table (optional)"));
    expect(screen.getByRole("table", { name: "Modal verb conjugation table" })).toBeVisible();
  });

  test("guides four choices with feedback only after selecting an answer", () => {
    const { container } = open();
    const guided = container.querySelector('[data-a1-day14-guided="true"]');
    const questions = guided.querySelectorAll("fieldset");
    expect(questions).toHaveLength(4);
    expect(within(questions[0]).queryByText("Richtig!")).not.toBeInTheDocument();
    DAY14_GUIDED_CHECKS.forEach((q, i) => {
      fireEvent.click(within(questions[i]).getByRole("button", { name: q.answer }));
      expect(within(questions[i]).getByText(/Richtig!/)).toBeVisible();
    });
  });

  test("checks five written statements and questions without requiring punctuation or capitals", () => {
    const { container } = open();
    const written = container.querySelector('[data-a1-day14-written="true"]');
    expect(written.querySelectorAll("textarea")).toHaveLength(5);
    const check = within(written).getByRole("button", { name: "Check my sentences" });
    expect(check).toBeDisabled();
    DAY14_WRITTEN_TASKS.forEach((task, i) => {
      fireEvent.change(within(written).getByRole("textbox", { name: "Rewrite sentence " + (i + 1) }), {
        target: { value: task.answer.toLocaleLowerCase("de-DE").replace(/[.!?]$/, "") },
      });
    });
    expect(check).toBeEnabled();
    fireEvent.click(check);
    expect(within(written).getByText(/5 of 5 example answers matched/)).toBeInTheDocument();
    fireEvent.change(within(written).getByRole("textbox", { name: "Rewrite sentence 1" }), {
      target: { value: "Ich möchte in den Zug steige ein." },
    });
    expect(within(written).queryByText(/5 of 5 example answers matched/)).not.toBeInTheDocument();
  });

  test("presents both a departure board, hotel confirmation and a hidden reception role-play", () => {
    open();
    expect(screen.getByRole("table", { name: "German train departure board" })).toBeVisible();
    expect(document.body).toHaveTextContent("ICE 593");
    expect(document.body).toHaveTextContent("Gleis sieben");
    expect(document.body).toHaveTextContent("Reservierungsbestätigung");
    expect(document.body).toHaveTextContent("Einzelzimmer");
    expect(document.body).toHaveTextContent("zwei Nächte");
    const button = screen.getByRole("button", { name: "Show model conversation after speaking" });
    expect(document.querySelector(".a1d14w-dialogue-lines")).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(document.querySelectorAll(".a1d14w-dialogue-lines p")).toHaveLength(5);
  });

  test("requires all eight final answers and reports six grammar and two reading questions", () => {
    const { container } = open();
    const quiz = container.querySelector('[data-a1-day14-knowledge-check="true"]');
    const check = within(quiz).getByRole("button", { name: "Check knowledge test" });
    const fieldsets = quiz.querySelectorAll("fieldset");
    expect(fieldsets).toHaveLength(8);
    expect(check).toBeDisabled();
    fireEvent.click(within(fieldsets[0]).getByRole("radio", { name: DAY14_KNOWLEDGE_QUESTIONS[0].answer }));
    expect(quiz).toHaveTextContent("1 of 8 questions answered");
    expect(within(fieldsets[0]).queryByText(/Correct answer:/)).not.toBeInTheDocument();
    DAY14_KNOWLEDGE_QUESTIONS.slice(1).forEach((q, i) => {
      fireEvent.click(within(fieldsets[i + 1]).getByRole("radio", { name: q.answer }));
    });
    expect(check).toBeEnabled();
    fireEvent.click(check);
    expect(quiz).toHaveTextContent("Score: 8 / 8");
    expect(quiz).toHaveTextContent("Grammar: 6 / 6");
    expect(quiz).toHaveTextContent("Reading: 2 / 2");
    fireEvent.click(within(quiz).getByRole("button", { name: "Reset test" }));
    expect(quiz).toHaveTextContent("0 of 8 questions answered");
    expect(check).toBeDisabled();
  });

  test("accepts five original sentences and a hotel dialogue before revealing models", () => {
    const { container } = open();
    const exit = container.querySelector('[data-a1-day14-independent-practice="true"]');
    const compare = within(exit).getByRole("button", { name: "Compare with example answers" });
    expect(compare).toBeDisabled();
    const inputs = exit.querySelectorAll("textarea");
    expect(inputs).toHaveLength(6);
    DAY14_FINAL_TASKS.forEach((task, i) => {
      fireEvent.change(inputs[i], { target: { value: "Ich möchte mit dem Zug nach Berlin fahren." } });
    });
    expect(compare).toBeDisabled();
    fireEvent.change(inputs[5], { target: { value: "Gast: Ich möchte ein Zimmer buchen." } });
    expect(compare).toBeEnabled();
    fireEvent.click(compare);
    expect(exit).toHaveTextContent("Example: Ich kann morgen mit dem Zug fahren.");
    expect(exit).toHaveTextContent("Possible dialogue:");
    expect(exit).toHaveTextContent("Other natural correct A1 answers are welcome");
    fireEvent.click(within(exit).getByRole("button", { name: "Start again" }));
    expect(exit).toHaveTextContent("0 of 5 sentences written");
  });

  test("keeps A2 Day 17 on the existing shared A2-only route", () => {
    expect(isSharedA2Day17Context("?level=A2&day=17&radio=done")).toBe(true);
    const { container } = open(route + "?level=A2&day=17&radio=done");
    expect(container.querySelector('[data-a1-day14-travel-hotel-workbook="true"]')).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /A2 Day 17 · In die Apotheke gehen/i })).toBeVisible();
    expect(screen.queryByRole("heading", { name: /A1 · Day 14 Workbook/i })).not.toBeInTheDocument();
  });
});
