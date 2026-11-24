import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SpeakingExamIntroPage from "./SpeakingExamIntroPage";

describe("SpeakingExamIntroPage", () => {
  test("keeps the correct object-specific A1 requests and a compact picture", () => {
    render(<MemoryRouter><SpeakingExamIntroPage initialTab="workbook" /></MemoryRouter>);

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

jest.mock("./A1Teil3SpeakingPracticePanel", () => () => <div data-testid="ai-practice-coach">A1 Teil 3 coach</div>);
test("opens overview first, preserves workbook and only mounts AI on the third tab", async () => {
 render(<MemoryRouter><SpeakingExamIntroPage /></MemoryRouter>);
 expect(screen.getAllByRole("tab").map(tab => tab.textContent)).toEqual(["Overview","Workbook","AI Practice"]);
 expect(screen.getByRole("tab",{name:"Overview"})).toHaveAttribute("aria-selected","true");
 expect(screen.getByTitle("Video lesson: Introduction to the Goethe A1 Speaking Exam")).toHaveAttribute("src","https://www.youtube-nocookie.com/embed/TKJk3hF76qw?rel=0");
 expect(screen.queryByTestId("ai-practice-coach")).not.toBeInTheDocument();
 expect(screen.queryByRole("heading",{name:"Picture-card verbs you really need"})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Open Workbook"}));
 expect(screen.getByRole("tab",{name:"Workbook"})).toHaveAttribute("aria-selected","true");
 expect(screen.getAllByRole("img",{name:/picture$/})).toHaveLength(10);
 expect(screen.queryByTitle("Video lesson: Introduction to the Goethe A1 Speaking Exam")).not.toBeInTheDocument();
 expect(screen.queryByTestId("ai-practice-coach")).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Continue to AI Practice"}));
 expect(await screen.findByTestId("ai-practice-coach")).toBeInTheDocument();
 expect(screen.queryByRole("heading",{name:"Picture-card verbs you really need"})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Back to Workbook"}));
 expect(screen.queryByTestId("ai-practice-coach")).not.toBeInTheDocument();
});
