import React from "react";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SpeakingExamIntroPage from "./SpeakingExamIntroPage";

describe("SpeakingExamIntroPage", () => {
  test("keeps the correct object-specific A1 requests and a compact picture", () => {
    render(<MemoryRouter><SpeakingExamIntroPage /></MemoryRouter>);

    const imperativeTable = screen.getAllByRole("table")[1];
    const closeRow = within(imperativeTable).getByText("schließen").closest("tr");
    expect(closeRow).not.toBeNull();
    expect(within(closeRow).getByText("Können Sie bitte die Tür schließen?")).toBeInTheDocument();

    const switchOffRow = within(imperativeTable).getByText("ausmachen").closest("tr");
    expect(switchOffRow).not.toBeNull();
    expect(within(switchOffRow).getByText("Können Sie bitte das Radio ausmachen?")).toBeInTheDocument();

    expect(screen.getByRole("img", { name: "Flasche picture" })).toHaveAttribute("height", "50");
    expect(screen.queryByRole("heading", { name: /Five picture cards/ })).not.toBeInTheDocument();
  });
});
