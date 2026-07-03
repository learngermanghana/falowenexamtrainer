import React, { createRef } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import PrepositionCaseCoachField, {
  isFrenchWritingProfile,
  resolveCoachTextarea,
  selectCoachPhrase,
} from "./PrepositionCaseCoachField";

describe("PrepositionCaseCoachField", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders directly beside a controlled B2 textarea and selects its phrase", () => {
    const textareaRef = createRef();
    const text = "Heute arbeiten wir mit einem wichtig Projekt.";

    render(
      <>
        <textarea ref={textareaRef} value={text} readOnly />
        <PrepositionCaseCoachField
          text={text}
          level="B2"
          textareaRef={textareaRef}
          studentProfile={{ program: "German" }}
        />
      </>,
    );

    act(() => {
      jest.advanceTimersByTime(900);
    });

    expect(screen.getByText(/Check “mit einem wichtig Projekt”/)).toBeInTheDocument();
    expect(textareaRef.current.dataset.prepositionCaseHint).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Find in text" }));
    const start = text.indexOf("mit einem wichtig Projekt");
    expect(textareaRef.current.selectionStart).toBe(start);
    expect(textareaRef.current.selectionEnd).toBe(
      start + "mit einem wichtig Projekt".length,
    );
    expect(textareaRef.current.value).toBe(text);
  });

  it("does not activate for French writing profiles", () => {
    const textareaRef = createRef();
    render(
      <>
        <textarea ref={textareaRef} value="mit einem wichtig Projekt" readOnly />
        <PrepositionCaseCoachField
          text="mit einem wichtig Projekt"
          level="B2"
          textareaRef={textareaRef}
          studentProfile={{ program: "French A1" }}
        />
      </>,
    );

    act(() => {
      jest.advanceTimersByTime(900);
    });

    expect(screen.queryByLabelText("Preposition Case Coach")).not.toBeInTheDocument();
    expect(textareaRef.current.dataset.prepositionCaseHint).toBeUndefined();
  });

  it("resolves object and callback textarea references", () => {
    const textarea = document.createElement("textarea");
    expect(resolveCoachTextarea({ textareaRef: { current: textarea } })).toBe(textarea);
    expect(resolveCoachTextarea({ getTextarea: () => textarea })).toBe(textarea);
  });

  it("rejects invalid selection offsets", () => {
    const textarea = document.createElement("textarea");
    textarea.value = "Test";
    expect(selectCoachPhrase(textarea, { start: 2, end: 2 })).toBe(false);
  });

  it("recognizes French profile aliases", () => {
    expect(isFrenchWritingProfile({ courseLanguage: "Français" })).toBe(true);
    expect(isFrenchWritingProfile({ program: "German B2" })).toBe(false);
  });
});
