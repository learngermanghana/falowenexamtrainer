import { buildWorkbookRouteIndex, normalizeInAppPath } from "./AutoWorkbookStartGuide";

describe("AutoWorkbookStartGuide route matching", () => {
  test("normalizes relative and Falowen-hosted in-app links", () => {
    expect(normalizeInAppPath("/campus/course/a1-workbook/")).toBe("/campus/course/a1-workbook");
    expect(normalizeInAppPath("https://www.falowen.app/campus/course/a2-workbook?source=course")).toBe(
      "/campus/course/a2-workbook"
    );
  });

  test("ignores external workbook links", () => {
    expect(normalizeInAppPath("https://drive.google.com/file/d/workbook/view")).toBe("");
  });

  test("indexes workbook links from every lesson resource shape", () => {
    const entry = {
      day: 7,
      workbook_link: "/campus/course/direct-workbook",
      lesen_hören: [{ workbook_link: "/campus/course/reading-workbook" }],
      schreiben_sprechen: { workbook_link: "https://www.falowen.app/campus/course/writing-workbook" },
    };

    const index = buildWorkbookRouteIndex({ A1: [entry] });

    expect(index.get("/campus/course/direct-workbook")).toEqual({ level: "A1", day: 7, entry });
    expect(index.get("/campus/course/reading-workbook")).toEqual({ level: "A1", day: 7, entry });
    expect(index.get("/campus/course/writing-workbook")).toEqual({ level: "A1", day: 7, entry });
  });
});
