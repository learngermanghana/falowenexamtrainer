import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getA1RadioResource } from "../data/a1RadioResources";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";
import A1Day14ModalVerbsWorkbookPage from "./A1Day14ModalVerbsWorkbookPage";

describe("A1 Day 14 modal verbs with separable verbs workbook", () => {
  test("shows the updated embedded self-learning materials without a full-screen gap", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6?radio=done"]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    const materials = container.querySelector("[data-a1-day14-self-learning-materials='true']");
    expect(materials).toBeVisible();
    expect(materials).toHaveStyle({ minHeight: "0" });
    expect(screen.getByText("Self-learning materials")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Watch and listen before starting the lesson" }),
    ).toBeVisible();
    expect(screen.getByText(/Recommended order: Falowen Radio, tutor lecture, AI lesson video/i)).toBeVisible();

    const radioFrame = screen.getByTitle(/Falowen Radio · Modal verbs with separable verbs/i);
    const tutorFrame = screen.getByTitle(
      /Tutor lecture · Teacher explanation · Modal verbs and separable verbs/i,
    );
    expect(radioFrame).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/GeHygJE7Hww",
    );
    expect(tutorFrame).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/GJw1aJehYHU",
    );

    expect(screen.getByRole("link", { name: /Open Falowen Radio on YouTube/i })).toHaveAttribute(
      "href",
      "https://youtu.be/GeHygJE7Hww",
    );
    expect(screen.getByRole("link", { name: /Open tutor lecture on YouTube/i })).toHaveAttribute(
      "href",
      "https://youtu.be/GJw1aJehYHU",
    );
    expect(container.querySelectorAll("iframe")).toHaveLength(2);
    expect(container.querySelector("[data-teacher-lecture-support='links-only']")).not.toBeInTheDocument();
  });

  test("maps the Day 14 page to the requested Falowen Radio-first flow", () => {
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

  test("does not show the A1 self-learning media on the A2 Day 17 query route", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6?level=A2&day=17"]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    expect(container.querySelector("[data-a1-day14-self-learning-materials='true']")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Open tutor lecture on YouTube/i })).not.toBeInTheDocument();
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
