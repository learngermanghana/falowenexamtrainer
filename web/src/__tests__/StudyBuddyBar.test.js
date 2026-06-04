import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "../i18n";
import StudyBuddyBar from "../components/StudyBuddyBar";

describe("StudyBuddyBar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("updates aria-expanded when toggling collapse", async () => {
    const user = userEvent.setup();
    render(<StudyBuddyBar studentProfile={{}} />);

    const toggle = screen.getByRole("button", { name: /show details/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("shows mobile close button only when expanded", async () => {
    const user = userEvent.setup();
    render(<StudyBuddyBar studentProfile={{}} />);

    expect(screen.queryByRole("button", { name: /^hide details$/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /show details/i }));

    expect(screen.getAllByRole("button", { name: /^hide details$/i })).toHaveLength(2);
  });

  it("toggles the progress details disclosure", async () => {
    const user = userEvent.setup();
    render(<StudyBuddyBar studentProfile={{ latestScore: 72, attendanceRate: 85 }} />);

    await user.click(screen.getByRole("button", { name: /show details/i }));

    const progressToggle = screen.getByRole("button", { name: /show progress details/i });
    expect(progressToggle).toHaveAttribute("aria-expanded", "false");

    await user.click(progressToggle);

    expect(screen.getByRole("button", { name: /hide progress details/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/latest result/i)).toBeInTheDocument();
    expect(screen.getByText(/attendance/i)).toBeInTheDocument();
    expect(screen.getByText(/weekly plan/i)).toBeInTheDocument();
  });

});
