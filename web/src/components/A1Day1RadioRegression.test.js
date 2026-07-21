import fs from "fs";
import path from "path";
import { getA1RadioResource } from "../data/a1RadioResources";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A1 Day 1 Falowen Radio", () => {
  it("uses the approved greetings and well-being radio video", () => {
    expect(getA1RadioResource(1)).toEqual(
      expect.objectContaining({
        key: "a1-day1-greetings-wellbeing-falowen-radio",
        title: "Greetings and Asking About Well-being · Kapitel 0.1",
        youtubeId: "rqnqC3AyfDk",
      }),
    );
  });

  it("opens Falowen Radio before the canonical Day 1 Kapitel 0.1 hub", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/1",
        "?chapter=0.1&hub=1",
      ),
    ).toEqual({ day: 1, chapter: "0.1" });
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/1",
        "?chapter=0.2&hub=1",
      ),
    ).toBeNull();
  });

  it("keeps the existing A1 Day 1 assignment behind the radio gate", () => {
    const source = read("A1Day1GreetingsWorkbookPage.js");

    expect(source).toContain('import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate"');
    expect(source).toContain('import { getA1RadioResource } from "../data/a1RadioResources"');
    expect(source).toContain('<RadioFirstWorkbookGate level="A1" day={1} resource={radio}>');
    expect(source).toContain("<A1TutorMarkedWorkbookShell");
    expect(source).toContain('fallbackAssignmentKey="A1-0.1"');
    expect(source).toContain('chapter="0.1"');
  });

  it("marks an active radio gate so workbook AI media cannot appear at the same time", () => {
    const source = read("RadioFirstWorkbookGate.js");

    expect(source).toContain('data-radio-first-workbook-gate="true"');
    expect(source).toContain("const RadioFirstWorkbookGate = ({ level, day, children, resource = null })");
    expect(source).toContain("const radio = resource || getRadioResource(level, day)");
  });
});
