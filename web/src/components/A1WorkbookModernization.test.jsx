import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1TutorMarkedWorkbookShell, { WorkbookSection } from "./A1TutorMarkedWorkbookShell";
import { getA1WorkbookMediaResources, getYouTubeVideoId } from "./A1WorkbookMediaPanel";

jest.mock("./navigation/AppBackButton", () => () => <button type="button">Back to Course Book</button>);
jest.mock("./A1CanonicalSubmissionPanel", () => ({ assignment }) => (
  <div data-testid="canonical-a1-submit">Submit {assignment.assignmentKey}</div>
));
jest.mock("./A1WorkbookGrammarNotes", () => () => <div>Grammar notes</div>);
jest.mock("./A1TutorMarkedOverviewGuidance", () => ({
  __esModule: true,
  default: () => <div>Beginner workbook guidance</div>,
  A1_TUTOR_MARKED_OVERVIEW_GUIDANCE: "Tutor-marked guidance",
}));

const renderAlphabetWorkbook = () => {
  const route = "/campus/course/a1-day-2-german-alphabet-reviewing-workbook";
  window.history.pushState({}, "", route);

  return render(
    <MemoryRouter initialEntries={[route]}>
      <A1TutorMarkedWorkbookShell fallbackAssignmentKey="A1-0.2" title="German Alphabet Workbook">
        <WorkbookSection sectionKey="teil-1">
          <h2>Teil 1 · Reading and Questions</h2>
          <p>Alphabet reading practice</p>
        </WorkbookSection>
        <WorkbookSection sectionKey="teil-2">
          <h2>Teil 2 · Hören</h2>
          <p>Alphabet listening practice</p>
        </WorkbookSection>
      </A1TutorMarkedWorkbookShell>
    </MemoryRouter>,
  );
};

describe("A1 workbook modernization", () => {
  test("keeps A1 media chapter-aware on days that contain multiple assignments", () => {
    const chapter02 = getA1WorkbookMediaResources({ day: 2, chapter: "0.2" });
    const chapter11 = getA1WorkbookMediaResources({ day: 2, chapter: "1.1" });

    expect(chapter02.some(({ url }) => url.includes("uhFgKp4WVEc"))).toBe(true);
    expect(chapter02.some(({ url }) => url.includes("AjsnO1hxDs4"))).toBe(false);
    expect(chapter11.some(({ url }) => url.includes("AjsnO1hxDs4"))).toBe(true);
    expect(chapter11.some(({ url }) => url.includes("uhFgKp4WVEc"))).toBe(false);
  });

  test("parses supported YouTube links for privacy-enhanced embeds", () => {
    expect(getYouTubeVideoId("https://youtu.be/uhFgKp4WVEc")).toBe("uhFgKp4WVEc");
    expect(getYouTubeVideoId("https://www.youtube.com/watch?v=uhFgKp4WVEc")).toBe("uhFgKp4WVEc");
  });

  test("renders modern metadata, progress, teacher media and canonical submission", () => {
    renderAlphabetWorkbook();

    const header = document.querySelector('[data-a1-modern-workbook-header="true"]');
    expect(header).toBeTruthy();
    expect(within(header).getByText("A1")).toBeInTheDocument();
    expect(within(header).getByText("Day 2")).toBeInTheDocument();
    expect(within(header).getByText("Kapitel 0.2")).toBeInTheDocument();
    expect(within(header).getByText("Assignment A1-0.2")).toBeInTheDocument();
    expect(within(header).getByText("Assignment 2 of 19")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "A1 assignment progress" })).toHaveAttribute("aria-valuenow", "11");

    const media = screen.getByRole("region", { name: "A1 lesson videos" });
    expect(media).toBeInTheDocument();
    const teacherFrame = within(media).getByTitle("Teacher lecture · A1 Day 2");
    expect(teacherFrame).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/uhFgKp4WVEc");

    const sectionProgress = screen.getByRole("progressbar", { name: "A1 workbook section progress" });
    expect(sectionProgress).toHaveAttribute("aria-valuenow", "20");
    expect(screen.getByText("Section 1 of 5")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Grammar" }));
    expect(screen.getByText("Grammar notes")).toBeVisible();
    expect(sectionProgress).toHaveAttribute("aria-valuenow", "40");

    fireEvent.click(screen.getByRole("tab", { name: "Teil 1 · Reading and Questions" }));
    expect(screen.getByText("Finished this Teil? Continue to the next required Teil before submitting the assignment.")).toBeVisible();
    const continueCta = screen.getByRole("button", { name: "Continue to Teil 2 · Hören" });
    expect(continueCta).toBeVisible();
    expect(screen.queryByRole("button", { name: "Submit Complete Assignment" })).not.toBeInTheDocument();

    const teil2Panel = document.querySelector('[data-workbook-panel="teil-2"]');
    teil2Panel.scrollIntoView = jest.fn();
    fireEvent.click(continueCta);

    expect(screen.getByRole("tab", { name: "Teil 2 · Hören" })).toHaveAttribute("aria-selected", "true");
    expect(teil2Panel.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(document.activeElement).toBe(teil2Panel.querySelector("h2"));
    expect(screen.getByText(/This is the final required Teil/)).toBeVisible();

    const submitPanel = document.querySelector('[data-workbook-panel="submit"]');
    submitPanel.scrollIntoView = jest.fn();
    const finalSubmitCta = screen.getByRole("button", { name: "Submit Complete Assignment" });
    expect(finalSubmitCta).toBeVisible();
    fireEvent.click(finalSubmitCta);

    expect(screen.getByRole("tab", { name: "Submit Assignment" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("canonical-a1-submit")).toHaveTextContent("Submit A1-0.2");
    expect(submitPanel.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(sectionProgress).toHaveAttribute("aria-valuenow", "100");

    expect(screen.getByRole("navigation", { name: "Previous and next A1 assignments" })).toBeInTheDocument();
  });
});
