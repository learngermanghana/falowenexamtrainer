import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SpeakingExamIntroPage from "./SpeakingExamIntroPage";

describe("SpeakingExamIntroPage", () => {
  test("includes the closing and switching-off verbs in the Teil 3 trainer", () => {
    render(
      <MemoryRouter>
        <SpeakingExamIntroPage />
      </MemoryRouter>,
    );

    const closeRow = screen.getByText("zumachen").closest("tr");
    expect(closeRow).not.toBeNull();
    expect(within(closeRow).getByText("Können Sie bitte das Fenster zumachen?")).toBeInTheDocument();
    expect(within(closeRow).getByText("Can you please close the window?")).toBeInTheDocument();

    const switchOffRow = screen.getByText("ausmachen").closest("tr");
    expect(switchOffRow).not.toBeNull();
    expect(within(switchOffRow).getByText("Können Sie bitte das Licht ausmachen?")).toBeInTheDocument();
    expect(within(switchOffRow).getByText("Can you please turn off the light?")).toBeInTheDocument();
  });
});
