import fs from "fs";
import path from "path";
import { getA1RadioResource } from "../data/a1RadioResources";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";

const DAY17_WORKBOOK = "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook";

describe("A1 Day 2 Kapitel 0.2 and Day 17 Falowen Radio", () => {
  test("maps Day 2 Kapitel 0.2 to the requested Falowen Radio without changing Kapitel 1.1", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/2",
        "?chapter=0.2&hub=1",
      ),
    ).toEqual({ day: 2, chapter: "0.2" });

    expect(getA1RadioResource(2, "0.2")).toEqual(
      expect.objectContaining({
        key: "a1-day2-chapter-0-2-falowen-radio",
        chapter: "0.2",
        youtubeId: "7F9nEMpvRpY",
      }),
    );

    expect(getA1RadioResource(2, "1.1")).toEqual(
      expect.objectContaining({
        key: "a1-day2-chapter-1-1-falowen-radio",
        youtubeId: "Uru9bvr14mw",
      }),
    );
  });

  test("centralizes Day 17 workbook radio ownership in the shared route gate", () => {
    expect(resolveA1RadioFirstWorkbookRoute(DAY17_WORKBOOK)).toEqual({ day: 17, chapter: "11" });
    expect(getA1RadioResource(17, "11")).toEqual(
      expect.objectContaining({
        key: "a1-day17-chapter-11-falowen-radio",
        youtubeId: "8Mh4PCSm6QE",
      }),
    );

    const workbookSource = fs.readFileSync(
      path.resolve(__dirname, "A1Day17StandardWorkbookPage.js"),
      "utf8",
    );
    expect(workbookSource).not.toContain("RadioFirstWorkbookGate");
    expect(workbookSource).not.toContain("getA1RadioResource");
  });
});
