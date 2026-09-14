import fs from "fs";
import path from "path";

const source = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("GeneralHome live-class identity", () => {
  test("passes the student's resolved record ID to both calendar mounts", () => {
    const home = source("./GeneralHome.js");

    expect(home).toContain(
      'studentProfile?.classId || studentProfile?.classRecordId || studentProfile?.assignedClassId || ""'
    );
    expect(home.match(/initialClassId=\{preferredClassId\}/g)).toHaveLength(2);
  });

  test("the home card carries its resolved canonical record into the full timetable", () => {
    const card = source("./ClassCalendarCardV2.js");

    expect(card).toContain(
      "canonicalSummary?.klass?.id || canonicalSummary?.klass?.classId || initialClassId"
    );
    expect(card).toContain('fullCalendarParams.set("classId", resolvedClassId)');
    expect(card).toContain("fullCalendarLink={fullCalendarLink}");
  });
});
