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
      jest.advanceTimersByTime(300);
    });
  };

  it("returns hints after a 300 ms pause", () => {
    const { result } = renderHook(() =>
      usePrepositionCaseHints({
        text: "mit einem wichtig Projekt",
        level: "B2",
        enabled: true,
      }),
    );

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current.hints).toEqual([]);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.hints).toHaveLength(1);
    expect(result.current.hints[0].fullCorrection).toBe(
      "mit einem wichtigen Projekt",
    );
    expect(result.current.summary).toEqual({
      checked: 1,
      current: 1,
      cleared: 0,
      dismissed: 0,
    });
  });

  it("detects articleless dative plural public transport phrases", () => {
    const { result } = renderHook(() =>
      usePrepositionCaseHints({
        text: "Bei der Beurteilung von öffentliche Verkehrsmittel sollten mehrere Kriterien berücksichtigt werden.",
        level: "C1",
        enabled: true,
      }),
    );

    runDebounce();
    expect(result.current.hints).toHaveLength(1);
    expect(result.current.hints[0]).toMatchObject({
      fullPhrase: "von öffentliche Verkehrsmittel",
      fullCorrection: "von öffentlichen Verkehrsmitteln",
      case: "dative",
      issueType: "articleless-case",
    });
  });

  it("returns no hints or progress for unsupported levels by default", () => {
    const { result } = renderHook(() =>
      usePrepositionCaseHints({
        text: "mit einen",
        level: "B1",
        enabled: true,
      }),
    );

    runDebounce();
    expect(result.current.hints).toEqual([]);
    expect(result.current.summary.checked).toBe(0);
  });

  it("supports article case hints at every level in marking mode", () => {
    const { result } = renderHook(() =>
      usePrepositionCaseHints({
        text: "Ich arbeite mit einen großen Unterschied.",
        level: "A1",
        enabled: true,
        allowAllLevels: true,
      }),
    );

    runDebounce();
    expect(result.current.hints[0]).toMatchObject({
      fullPhrase: "mit einen",
      fullCorrection: "mit einem",
      issueType: "determiner-case",
    });
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
    expect(result.current.summary).toMatchObject({ current: 0, dismissed: 1 });

    rerender({ text: "Heute arbeiten wir mit einem wichtig Projekt" });
    runDebounce();
    expect(result.current.hints).toEqual([]);

    rerender({ text: "Heute arbeiten wir mit einem wichtigen Projekt" });
    runDebounce();
    expect(result.current.hints).toEqual([]);

    rerender({ text: "Heute arbeiten wir mit einem wichtig Projekt" });
    runDebounce();
    expect(result.current.hints).toHaveLength(1);
    expect(result.current.summary.dismissed).toBe(1);
  });

  it("removes a fixed article hint and records it as cleared", () => {
    const { result, rerender } = renderHook(
      ({ text }) =>
        usePrepositionCaseHints({ text, level: "B2", enabled: true }),
      { initialProps: { text: "Wir arbeiten mit einen" } },
    );

    runDebounce();
    expect(result.current.hints).toHaveLength(1);

    rerender({ text: "Wir arbeiten mit einem" });
    runDebounce();
    expect(result.current.hints).toEqual([]);
    expect(result.current.summary).toEqual({
      checked: 1,
      current: 0,
      cleared: 1,
      dismissed: 0,
    });
  });

  it("supports contracted-preposition hints", () => {
    const { result } = renderHook(() =>
      usePrepositionCaseHints({
        text: "Wir arbeiten im modern Gebäude.",
        level: "C1",
        enabled: true,
      }),
    );

    runDebounce();
    expect(result.current.hints[0].fullCorrection).toBe(
      "im modernen Gebäude",
    );
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
    expect(result.current.summary.current).toBe(5);
  });

  it("can reset its local session summary", () => {
    const { result } = renderHook(() =>
      usePrepositionCaseHints({
        text: "mit einem wichtig Projekt",
        level: "B2",
        enabled: true,
      }),
    );

    runDebounce();
    act(() => result.current.resetCoach());
    expect(result.current.hints).toEqual([]);
    expect(result.current.summary).toEqual({
      checked: 0,
      current: 0,
      cleared: 0,
      dismissed: 0,
    });
  });
});
