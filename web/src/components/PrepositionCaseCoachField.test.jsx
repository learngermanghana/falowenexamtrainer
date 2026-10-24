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

  it("shows an all-level article hint after 300 ms and selects its phrase", () => {
    const textareaRef = createRef();
    const text = "Heute arbeiten wir mit einen großen Unterschied.";

    render(
      <>
        <textarea ref={textareaRef} value={text} readOnly />
        <PrepositionCaseCoachField
          text={text}
          level="A1"
          textareaRef={textareaRef}
          studentProfile={{ program: "German" }}
        />
      </>,
    );

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText(/Check “mit einen”/)).toBeInTheDocument();
    expect(textareaRef.current.dataset.prepositionCaseHint).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Show correction" }));
    expect(screen.getByText("Try: mit einem")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Find in text" }));
    const start = text.indexOf("mit einen");
    expect(textareaRef.current.selectionStart).toBe(start);
    expect(textareaRef.current.selectionEnd).toBe(start + "mit einen".length);
    expect(textareaRef.current.value).toBe(text);
  });

  it("does not activate for French writing profiles", () => {
    const textareaRef = createRef();
    render(
      <>
        <textarea ref={textareaRef} value="mit einen" readOnly />
        <PrepositionCaseCoachField
          text="mit einen"
          level="A1"
          textareaRef={textareaRef}
          studentProfile={{ program: "French A1" }}
        />
      </>,
    );

    act(() => {
      jest.advanceTimersByTime(300);
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
