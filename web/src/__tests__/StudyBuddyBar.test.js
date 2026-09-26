import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "../i18n";
import StudyBuddyBar from "../components/StudyBuddyBar";
import { fetchLearnerSupportState } from "../services/learnerSupportService";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: "token", user: { uid: "student-1" } }),
}));

jest.mock("../services/learnerSupportService", () => ({
  fetchLearnerSupportState: jest.fn(),
}));

describe("StudyBuddyBar", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    fetchLearnerSupportState.mockReset();
  });

  it("starts as the bottom-right launcher without rendering the Study Buddy bar", () => {
    render(<StudyBuddyBar studentProfile={{}} />);

    expect(screen.getByRole("button", { name: /reopen study buddy bar/i })).toHaveClass("study-buddy-reopen");
    expect(document.body.querySelector(".study-buddy-bar")).not.toBeInTheDocument();
  });

  it("updates aria-expanded when toggling collapse", async () => {
    render(<StudyBuddyBar studentProfile={{}} />);

    await userEvent.click(screen.getByRole("button", { name: /reopen study buddy bar/i }));

    const toggle = screen.getByRole("button", { name: /show details/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("shows mobile close button only when expanded", async () => {
    render(<StudyBuddyBar studentProfile={{}} />);

    expect(screen.queryByRole("button", { name: /^hide details$/i })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /reopen study buddy bar/i }));
    await userEvent.click(screen.getByRole("button", { name: /show details/i }));

    expect(screen.getAllByRole("button", { name: /^hide details$/i })).toHaveLength(2);
  });

  it("toggles the progress details disclosure", async () => {
    render(<StudyBuddyBar studentProfile={{ latestScore: 72, attendanceRate: 85 }} />);

    await userEvent.click(screen.getByRole("button", { name: /reopen study buddy bar/i }));
    await userEvent.click(screen.getByRole("button", { name: /show details/i }));

    const progressToggle = screen.getByRole("button", { name: /show progress details/i });
    expect(progressToggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(progressToggle);

    expect(screen.getByRole("button", { name: /hide progress details/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/latest result/i)).toBeInTheDocument();
    expect(screen.getByText(/attendance/i)).toBeInTheDocument();
    expect(screen.getByText(/^weekly planner$/i)).toBeInTheDocument();
  });

  it("loads the authoritative next action and opens its exact route", async () => {
    fetchLearnerSupportState.mockResolvedValue({
      nextAction: {
        type: "continue-course",
        label: "Continue: Möbel & Räume",
        reason: "next_incomplete_course_item",
        url: "/campus/course/lesson/A2/6?chapter=3.6&view=workbook",
      },
    });

    render(<StudyBuddyBar studentProfile={{ level: "A2", studentCode: "A2-TEST" }} />);

    await userEvent.click(screen.getByRole("button", { name: /reopen study buddy bar/i }));
    await userEvent.click(screen.getByRole("button", { name: /what should i do next/i }));

    expect(await screen.findByText("Continue: Möbel & Räume")).toBeInTheDocument();
    expect(fetchLearnerSupportState).toHaveBeenCalledWith(expect.objectContaining({
      idToken: "token",
    }));

    await userEvent.click(screen.getByRole("button", { name: /^continue$/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/campus/course/lesson/A2/6?chapter=3.6&view=workbook");
  });

  it("renders the Study Buddy launcher in document.body so learning-page layouts cannot clip it", () => {
    const pageShell = document.createElement("div");
    pageShell.style.overflow = "hidden";
    pageShell.style.transform = "translateZ(0)";
    document.body.appendChild(pageShell);

    render(<StudyBuddyBar studentProfile={{}} />, { container: pageShell });

    const launcher = document.body.querySelector(".study-buddy-reopen");
    expect(launcher).toBeTruthy();
    expect(launcher.parentElement).toBe(document.body);
    expect(document.body.querySelector(".study-buddy-bar")).toBeNull();
  });

});
