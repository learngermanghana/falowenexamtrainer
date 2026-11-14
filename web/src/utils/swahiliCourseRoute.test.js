import { getSwahiliCampusRoute } from "./swahiliCourseRoute";

const swahiliStudent = {
  user: { uid: "student-swahili" },
  studentProfile: { program: "swahili" },
};

describe("Kiswahili uses the existing Falowen Campus shell", () => {
  test("opens the signed-in Kiswahili course overview in Campus", () => {
    expect(getSwahiliCampusRoute({ pathname: "/swahili", ...swahiliStudent }))
      .toBe("/campus/course");
    expect(getSwahiliCampusRoute({ pathname: "/swahili/", ...swahiliStudent }))
      .toBe("/campus/course");
  });

  test("preserves workbook lesson and tab links when moving to Campus", () => {
    expect(getSwahiliCampusRoute({
      pathname: "/swahili/day-1",
      search: "?view=submit",
      ...swahiliStudent,
    })).toBe("/campus/course/swahili/day-1?view=submit");

    expect(getSwahiliCampusRoute({
      pathname: "/swahili/day-6/",
      search: "?teacher=1",
      ...swahiliStudent,
    })).toBe("/campus/course/swahili/day-6?teacher=1");
  });

  test("continues to serve public previews to visitors and non-Swahili accounts", () => {
    expect(getSwahiliCampusRoute({ pathname: "/swahili", user: null, studentProfile: null }))
      .toBeNull();
    expect(getSwahiliCampusRoute({
      pathname: "/swahili/day-1",
      user: { uid: "student-german" },
      studentProfile: { program: "german" },
    })).toBeNull();
  });

  test("does not intercept other programme routes or unpublished lessons", () => {
    expect(getSwahiliCampusRoute({ pathname: "/swahili/day-2", ...swahiliStudent }))
      .toBeNull();
    expect(getSwahiliCampusRoute({ pathname: "/campus/course/swahili/day-6", ...swahiliStudent }))
      .toBeNull();
  });

  test("accepts a case-insensitive programme value", () => {
    expect(getSwahiliCampusRoute({
      pathname: "/swahili",
      user: { uid: "student-swahili" },
      studentProfile: { program: " Kiswahili " },
    })).toBeNull();
    expect(getSwahiliCampusRoute({
      pathname: "/swahili",
      user: { uid: "student-swahili" },
      studentProfile: { program: " SWAHILI " },
    })).toBe("/campus/course");
  });
});
