import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "../i18n";
import StudyBuddyBar from "../components/StudyBuddyBar";

describe("StudyBuddyBar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("opens the full Study Buddy from the launcher and closes back to the launcher", async () => {
    const user = userEvent.setup();
    render(<StudyBuddyBar studentProfile={{}} />);

    const launcher = screen.getByRole("button", { name: /open study buddy/i });
    expect(launcher).toBeInTheDocument();

    await user.click(launcher);

    const closeButtons = screen.getAllByRole("button", { name: /^hide details$/i });
    expect(closeButtons[0]).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/start a conversation/i)).toBeInTheDocument();

    await user.click(closeButtons[0]);

    expect(screen.getByRole("button", { name: /open study buddy/i })).toBeInTheDocument();
  });

  it("mobile close returns to the launcher", async () => {
    const user = userEvent.setup();
    render(<StudyBuddyBar studentProfile={{}} />);

    await user.click(screen.getByRole("button", { name: /open study buddy/i }));

    const closeButtons = screen.getAllByRole("button", { name: /^hide details$/i });
    expect(closeButtons).toHaveLength(2);

    await user.click(closeButtons[1]);

    expect(screen.getByRole("button", { name: /open study buddy/i })).toBeInTheDocument();
  });

  it("toggles the progress details disclosure", async () => {
    const user = userEvent.setup();
    render(<StudyBuddyBar studentProfile={{ latestScore: 72, attendanceRate: 85 }} />);

    await user.click(screen.getByRole("button", { name: /open study buddy/i }));

    const progressToggle = screen.getByRole("button", { name: /show progress details/i });
    expect(progressToggle).toHaveAttribute("aria-expanded", "false");

    await user.click(progressToggle);

    expect(screen.getByRole("button", { name: /hide progress details/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/latest result/i)).toBeInTheDocument();
    expect(screen.getByText(/attendance/i)).toBeInTheDocument();
    expect(screen.getByText(/weekly plan/i)).toBeInTheDocument();
  });
});
