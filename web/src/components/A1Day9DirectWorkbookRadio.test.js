import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";

test("gates the direct A1 Day 9 German cases workbook with Falowen Radio", () => {
  expect(
    resolveA1RadioFirstWorkbookRoute(
      "/campus/course/a1-chapter-5-german-cases-workbook",
      "?assignmentKey=A1-5&level=A1",
    ),
  ).toEqual({ day: 9, chapter: "5" });
});
