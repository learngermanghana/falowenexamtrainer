import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "../i18n";
import StudyBuddyBar from "../components/StudyBuddyBar";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: "token", user: { uid: "student-1" } }),
}));

describe("StudyBuddyBar", () => {
  beforeEach(() => {
    localStorage.clear();
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
