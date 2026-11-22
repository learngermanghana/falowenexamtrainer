import { courseProfile, enrolledCourses, readCoursePreference, saveCoursePreference } from "./courseEnrollment";

describe("enrolled course switching", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  const student = {
    program: "german",
    level: "A2",
    className: "German A2",
    secondaryProgram: "swahili",
    coursePlacements: { swahili: { level: "B1", className: "Kiswahili B1" } },
  };

  test("only enrolled programs are selectable, with separate class and level", () => {
    expect(enrolledCourses(student)).toEqual(["german", "swahili"]);
    const swahili = courseProfile(student, "swahili");
    expect(swahili).toEqual(expect.objectContaining({ program: "swahili", level: "B1", className: "Kiswahili B1" }));
    expect(student).toEqual(expect.objectContaining({ program: "german", level: "A2", className: "German A2" }));
    expect(courseProfile(student, "french")).toBe(student);
    expect(courseProfile({ program: "german" }, "swahili")).toEqual({ program: "german" });
  });

  test("remembers only a permitted course for this account, not another account", () => {
    const allowed = enrolledCourses(student);
    expect(saveCoursePreference("student-a", "swahili", allowed)).toBe(true);
    expect(readCoursePreference("student-a", allowed)).toBe("swahili");
    expect(readCoursePreference("student-b", allowed)).toBeNull();
    expect(saveCoursePreference("student-b", "swahili", ["german"])).toBe(false);
    expect(readCoursePreference("student-a", ["german"])).toBeNull();
  });

  test("migrates existing session choice and rejects unsupported stored values", () => {
    window.sessionStorage.setItem("falowen:course:student-c", "swahili");
    expect(readCoursePreference("student-c", ["german", "swahili"])).toBe("swahili");
    expect(saveCoursePreference("student-c", "swahili", ["german", "swahili"])).toBe(true);
    expect(window.sessionStorage.getItem("falowen:course:student-c")).toBeNull();
    window.localStorage.setItem("falowen:course:student-c", "french");
    expect(readCoursePreference("student-c", ["german", "swahili"])).toBeNull();
  });
});
