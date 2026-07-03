import { act, renderHook } from "@testing-library/react";
import { usePrepositionCaseHints } from "./usePrepositionCaseHints";

describe("usePrepositionCaseHints", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const runDebounce = () => {
    act(() => {
      jest.advanceTimersByTime(900);
    });
  };

  it("debounces and returns local B2 hints", () => {
    const { result } = renderHook(() =>
      usePrepositionCaseHints({
        text: "mit einem wichtig Projekt",
        level: "B2",
        enabled: true,
      }),
    );

    expect(result.current.hints).toEqual([]);
    runDebounce();
    expect(result.current.hints).toHaveLength(1);
    expect(result.current.hints[0].fullCorrection).toBe(
      "mit einem wichtigen Projekt",
    );
  });

  it("returns no hints for unsupported levels", () => {
    const { result } = renderHook(() =>
      usePrepositionCaseHints({
        text: "mit einem wichtig Projekt",
        level: "B1",
        enabled: true,
      }),
    );

    runDebounce();
    expect(result.current.hints).toEqual([]);
  });

  it("keeps a dismissed phrase hidden until that phrase changes", () => {
    const { result, rerender } = renderHook(
      ({ text }) =>
        usePrepositionCaseHints({ text, level: "C1", enabled: true }),
      { initialProps: { text: "mit einem wichtig Projekt" } },
    );

    runDebounce();
    const dismissedId = result.current.hints[0].id;
    act(() => result.current.dismissHint(dismissedId));
    expect(result.current.hints).toEqual([]);

    rerender({ text: "Heute arbeiten wir mit einem wichtig Projekt" });
    runDebounce();
    expect(result.current.hints).toEqual([]);

    rerender({ text: "Heute arbeiten wir mit einem wichtigen Projekt" });
    runDebounce();
    expect(result.current.hints).toEqual([]);

    rerender({ text: "Heute arbeiten wir mit einem wichtig Projekt" });
    runDebounce();
    expect(result.current.hints).toHaveLength(1);
  });

  it("removes a hint as soon as the debounced corrected text is checked", () => {
    const { result, rerender } = renderHook(
      ({ text }) =>
        usePrepositionCaseHints({ text, level: "B2", enabled: true }),
      { initialProps: { text: "für eine besser Zukunft" } },
    );

    runDebounce();
    expect(result.current.hints).toHaveLength(1);

    rerender({ text: "für eine bessere Zukunft" });
    runDebounce();
    expect(result.current.hints).toEqual([]);
  });

  it("returns at most five current hints", () => {
    const text = Array.from(
      { length: 7 },
      (_, index) => `mit einem wichtig Projekt${String.fromCharCode(65 + index)}`,
    ).join(". ");
    const { result } = renderHook(() =>
      usePrepositionCaseHints({ text, level: "B2", enabled: true }),
    );

    runDebounce();
    expect(result.current.hints).toHaveLength(5);
  });
});
