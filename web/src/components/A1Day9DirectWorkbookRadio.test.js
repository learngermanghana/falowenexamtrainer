import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";

test("opens the direct A1 Day 9 German cases workbook without replaying Falowen Radio", () => {
  expect(
    resolveA1RadioFirstWorkbookRoute(
      "/campus/course/a1-chapter-5-german-cases-workbook",
      "?assignmentKey=A1-5&assignmentId=A1-5&level=A1",
    ),
  ).toBeNull();
});

test("keeps Falowen Radio on the A1 Day 9 lesson flow before the workbook", () => {
  expect(
    resolveA1RadioFirstWorkbookRoute(
      "/campus/course/lesson/A1/9",
      "?chapter=5&hub=1",
    ),
  ).toEqual({ day: 9, chapter: "5" });
});
