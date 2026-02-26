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

});
