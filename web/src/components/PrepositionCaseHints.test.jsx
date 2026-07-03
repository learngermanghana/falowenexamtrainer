import { fireEvent, render, screen } from "@testing-library/react";
import PrepositionCaseHints from "./PrepositionCaseHints";

const hint = {
  id: "hint-1",
  fullPhrase: "mit einem wichtig Projekt",
  fullCorrection: "mit einem wichtigen Projekt",
  hint: "“mit” requires dative. After “einem”, the adjective normally ends in -en.",
  explanation: "“einem” is an ein-word determiner. The adjective follows mixed declension.",
};

const summary = { checked: 1, current: 1, cleared: 0, dismissed: 0 };

describe("PrepositionCaseHints", () => {
  it("keeps correction and explanation hidden until requested", () => {
    render(
      <PrepositionCaseHints
        hints={[hint]}
        summary={summary}
        onDismiss={jest.fn()}
      />,
    );

    expect(screen.getByText("Preposition Case Coach")).toBeInTheDocument();
    expect(
      screen.getByText(/Check “mit einem wichtig Projekt”/),
    ).toBeInTheDocument();
    expect(screen.getByText("1 current")).toBeInTheDocument();
    expect(
      screen.queryByText(/Try: mit einem wichtigen Projekt/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/mixed declension/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show correction" }));
    expect(
      screen.getByText("Try: mit einem wichtigen Projekt"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Hide correction" }),
    ).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(screen.getByRole("button", { name: "Why?" }));
    expect(screen.getByText(/mixed declension/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hide why" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("selects and dismisses a hint without modifying text", () => {
    const onDismiss = jest.fn();
    const onSelectHint = jest.fn();
    render(
      <PrepositionCaseHints
        hints={[hint]}
        summary={summary}
        onDismiss={onDismiss}
        onSelectHint={onSelectHint}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Find in text" }));
    expect(onSelectHint).toHaveBeenCalledWith(hint);

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledWith("hint-1");
  });

  it("keeps a compact progress summary after the active hint is cleared", () => {
    render(
      <PrepositionCaseHints
        hints={[]}
        summary={{ checked: 2, current: 0, cleared: 2, dismissed: 0 }}
      />,
    );

    expect(screen.getByText("0 current")).toBeInTheDocument();
    expect(screen.getByText("2 cleared")).toBeInTheDocument();
    expect(screen.getByText(/No active phrase to check/)).toBeInTheDocument();
  });
});
