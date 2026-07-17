import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1Day14ModalVerbsWorkbookPage from "./A1Day14ModalVerbsWorkbookPage";

describe("A1 Day 14 modal verbs workbook", () => {
  test("teaches meanings, conjugation, sentence structure and optional train practice", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6"]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /A1 · Day 14 Workbook · Modal Verbs/i })).toBeVisible();
    expect(screen.getByRole("table", { name: /Modal verb conjugation table/i })).toBeVisible();
    expect(document.body).toHaveTextContent("mögen = to like");
    expect(document.body).toHaveTextContent("möchten = would like");
    expect(document.body).toHaveTextContent("Ich kann Deutsch sprechen.");

    fireEvent.click(screen.getByText(/Open departure board, ticket and vocabulary/i));
    expect(screen.getByLabelText("German train departure board")).toBeVisible();
    expect(screen.getByLabelText("Example German train ticket")).toBeVisible();
    expect(document.body).toHaveTextContent("ICE 593 → Hamburg Hbf");
  });

  test("scores and resets the knowledge test", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6"]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    const correctAnswer = screen.getByLabelText("kann");
    fireEvent.click(correctAnswer);
    fireEvent.click(screen.getByRole("button", { name: /Check knowledge test/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Score: 1 / 10");
    expect(screen.getByText(/With ich, können becomes kann/i)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Reset test/i }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(correctAnswer).not.toBeChecked();
  });
});
