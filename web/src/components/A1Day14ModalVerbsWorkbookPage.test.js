import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1Day14ModalVerbsWorkbookPage from "./A1Day14ModalVerbsWorkbookPage";

describe("A1 Day 14 practical modal verbs workbook", () => {
  test("teaches train boards, tickets, modal verbs and separable verbs", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6"]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Modal Verbs at the Train Station/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /Read a German train board/i })).toBeVisible();
    expect(screen.getByLabelText("Example German train ticket")).toBeVisible();
    expect(document.body).toHaveTextContent("Der Zug muss um 14:20 Uhr abfahren.");
    expect(document.body).toHaveTextContent("Wir möchten um 16:08 Uhr ankommen.");
    expect(screen.getByRole("heading", { name: /Practical knowledge test/i })).toBeVisible();
  });

  test("scores and resets the practical knowledge test", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/modal-verbs-day-14-3-6"]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    const correctPlatform = screen.getByLabelText("Gleis 7");
    fireEvent.click(correctPlatform);
    fireEvent.click(screen.getByRole("button", { name: /Check knowledge test/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Score: 1 / 10");
    expect(screen.getByText(/The board shows ICE 593 on Gleis 7/i)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Reset test/i }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(correctPlatform).not.toBeChecked();
  });
});
