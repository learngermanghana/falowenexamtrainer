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

    const toggle = screen.getByRole("button", { name: /^Hide$/i });
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
