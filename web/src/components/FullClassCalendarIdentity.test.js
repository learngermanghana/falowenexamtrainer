import fs from "fs";
import path from "path";

const source = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("full class timetable identity", () => {
  test("Course Book carries the exact canonical class ID into the timetable route", () => {
    const courseBook = source("./CourseBookNextClassIndicator.js");
    expect(courseBook).toContain('const resolvedClassId = canonicalSummary?.klass?.id || canonicalSummary?.klass?.classId || classId;');
    expect(courseBook).toContain('fullCalendarParams.set("classId", resolvedClassId)');
    expect(courseBook).toContain("fullCalendarQuery");
  });

  test("the timetable reads classId from the route and passes it to the canonical subscription", () => {
    const timetable = source("./FullClassCalendarPage.js");
    expect(timetable).toContain("useSearchParams");
    expect(timetable).toContain('const classId = String(searchParams.get("classId") || "").trim();');
    expect(timetable).toContain("const classIdentity = classId || className;");
    expect(timetable).toContain("subscribeCanonicalLiveClass({\n      classId,\n      className,");
  });
});
