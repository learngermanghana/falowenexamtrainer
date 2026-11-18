import fs from "fs";
import path from "path";

const source = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("GeneralHome live-class identity", () => {
  test("passes the student's resolved record ID to the calendar mount", () => {
    const home = source("./GeneralHome.js");
    const identity = source("../utils/homeClassSchedule.js");

    expect(identity).toContain(
      'profile?.classId || profile?.classRecordId || profile?.assignedClassId || ""'
    );
    expect(home).toContain("getHomeClassIdentity(studentProfile)");
    expect(home.match(/initialClassId=\{preferredClassId\}/g)).toHaveLength(1);
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
