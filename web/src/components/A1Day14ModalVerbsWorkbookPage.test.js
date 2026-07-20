import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1Day14ModalVerbsWorkbookPage from "./A1Day14ModalVerbsWorkbookPage";

describe("A1 Day 14 modal verbs with separable verbs workbook", () => {
  test("explains normal and separable main verbs and keeps train resources visible", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6"]}>
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

  test("scores and resets the separable-verb knowledge test", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6"]}>
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