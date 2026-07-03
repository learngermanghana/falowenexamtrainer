import { fireEvent, render, screen } from "@testing-library/react";
import PrepositionCaseHints from "./PrepositionCaseHints";

const hint = {
  id: "hint-1",
  fullPhrase: "mit einem wichtig Projekt",
  fullCorrection: "mit einem wichtigen Projekt",
  hint: "“mit” requires dative. After “einem”, the adjective normally ends in -en.",
};

describe("PrepositionCaseHints", () => {
  it("keeps the correction hidden until requested", () => {
    render(<PrepositionCaseHints hints={[hint]} onDismiss={jest.fn()} />);

    expect(screen.getByText("Preposition Case Coach")).toBeInTheDocument();
    expect(
      screen.getByText(/Check “mit einem wichtig Projekt”/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Try: mit einem wichtigen Projekt/),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show correction" }));
    expect(
      screen.getByText("Try: mit einem wichtigen Projekt"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Hide correction" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("dismisses a hint without modifying text", () => {
    const onDismiss = jest.fn();
    render(<PrepositionCaseHints hints={[hint]} onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledWith("hint-1");
  });
});
