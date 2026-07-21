import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getA1RadioResource } from "../data/a1RadioResources";
import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";
import { buildA1WorkbookVideoModel } from "./A1WorkbookVideoHeader";
import A1Day14ModalVerbsWorkbookPage from "./A1Day14ModalVerbsWorkbookPage";

describe("A1 Day 14 modal verbs with separable verbs workbook", () => {
  test("separates chapter media from the workbook AI video", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6?radio=done"]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    expect(container.querySelector("[data-a1-day14-self-learning-materials='true']")).not.toBeInTheDocument();
    expect(container.querySelector("[data-teacher-lecture-support='links-only']")).not.toBeInTheDocument();
    expect(container.querySelector("iframe")).not.toBeInTheDocument();

    expect(getA1TeacherVideoResources(14)).toEqual([
      expect.objectContaining({
        chapter: "3.6",
        url: "https://youtu.be/GJw1aJehYHU",
      }),
    ]);

    expect(buildA1WorkbookVideoModel({ pathname: "/campus/course/modal-verbs-day-14-3-6" })).toEqual(
      expect.objectContaining({
        lessonId: "A1-3.6",
        assessmentLabel: "Self-practice",
        youtubeId: "Wkj1-TnNUxY",
      }),
    );
  });

  test("maps the Day 14 chapter to the requested Falowen Radio-first flow", () => {
    expect(getA1RadioResource(14, "3.6")).toEqual(
      expect.objectContaining({
        key: "a1-day14-modal-verbs-separable-verbs-falowen-radio",
        chapter: "3.6",
        youtubeId: "GeHygJE7Hww",
      }),
    );
    expect(
      resolveA1RadioFirstWorkbookRoute("/campus/course/modal-verbs-day-14-3-6", ""),
    ).toEqual({ day: 14, chapter: "3.6" });
  });

  test("explains normal and separable main verbs and keeps train resources visible", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6?radio=done"]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Modal Verbs with Separable Verbs/i })).toBeVisible();
    expect(screen.getByRole("table", { name: /Modal verb conjugation table/i })).toBeVisible();
    expect(document.body).toHaveTextContent("Subject + conjugated modal verb + details + main verb in the infinitive form");
    expect(document.body).toHaveTextContent("Normal main verb: kaufen · to buy");
    expect(document.body).toHaveTextContent("Separable main verb: ab|fahren · to depart");
    expect(document.body).toHaveTextContent("Ich möchte eine Fahrkarte kaufen.");
    expect(document.body).toHaveTextContent("Der Zug muss um 14:20 Uhr abfahren.");
    expect(document.body).toHaveTextContent("The train has to depart at 2:20 p.m.");
    expect(document.body).toHaveTextContent("We would like to travel back on Sunday.");
    expect(screen.queryByRole("heading", { name: /Practical application · Eine Fahrkarte buchen/i })).not.toBeInTheDocument();

    const departureSummary = screen.getByText("Departure board · Die Abfahrtstafel");
    const ticketSummary = screen.getByText("Ticket · Die Fahrkarte");
    const vocabularySummary = screen.getByText("Vocabulary · Wortschatz");

    expect(departureSummary.closest("details")).toHaveAttribute("open");
    expect(ticketSummary.closest("details")).toHaveAttribute("open");
    expect(vocabularySummary.closest("details")).toHaveAttribute("open");
    expect(screen.getByLabelText("German train departure board")).toBeVisible();
    expect(screen.getByLabelText("Example German train ticket")).toBeVisible();
  });

  test("still switches to the A2 Day 17 grammar page in its shared query context", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6?level=A2&day=17"]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("heading", { name: /A1 · Day 14 Workbook/i })).not.toBeInTheDocument();
  });

  test("scores and resets the separable-verb knowledge test", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6?radio=done"]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    const correctAnswer = screen.getByLabelText("ab-");
    fireEvent.click(correctAnswer);
    fireEvent.click(screen.getByRole("button", { name: /Check knowledge test/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Score: 1 / 10");
    expect(screen.getByText(/The separable prefix in abfahren is ab-/i)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Reset test/i }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(correctAnswer).not.toBeChecked();
  });
});
