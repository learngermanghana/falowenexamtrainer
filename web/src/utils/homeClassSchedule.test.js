import { buildFullClassScheduleUrl, getHomeClassIdentity } from "./homeClassSchedule";

describe("signed-in learner class schedule shortcut", () => {
  it("reuses the canonical class name and ID from the authenticated student profile", () => {
    expect(getHomeClassIdentity({
      className: "A1 Accra",
      classId: "canonical-a1-123",
      level: "A1",
    })).toEqual({ className: "A1 Accra", classId: "canonical-a1-123" });
    expect(buildFullClassScheduleUrl({ className: "A1 Accra", classId: "canonical-a1-123" }))
      .toBe("/campus/course/full-class-calendar/A1%20Accra?classId=canonical-a1-123");
  });

  it("supports class-name-only placements without fabricating a record ID", () => {
    expect(buildFullClassScheduleUrl({ className: "B1 Hamburg Klasse" }))
      .toBe("/campus/course/full-class-calendar/B1%20Hamburg%20Klasse");
  });

  it("supports canonical ID-only placements without inserting an invented class name", () => {
    expect(buildFullClassScheduleUrl({ classId: "swahili-klasse-3" }))
      .toBe("/campus/course/full-class-calendar/class?classId=swahili-klasse-3");
  });

  it("does not expose a fake schedule for self-study students", () => {
    expect(buildFullClassScheduleUrl(getHomeClassIdentity({ level: "B2" }))).toBe("");
    expect(getHomeClassIdentity({ level: "B2" })).toEqual({ className: "", classId: "" });
  });

  it("encodes international class names and class IDs", () => {
    expect(buildFullClassScheduleUrl({ className: "A2 Köln & Hamburg", classId: "A2?x=1" }))
      .toBe("/campus/course/full-class-calendar/A2%20K%C3%B6ln%20%26%20Hamburg?classId=A2%3Fx%3D1");
  });
});
