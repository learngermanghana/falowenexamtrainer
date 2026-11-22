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

  test("does not leak tuition, trial or access from German to Swahili", () => {
    const source = {
      ...student,
      tuitionFee: 3000, balanceDue: 1200, paid: 1800,
      paymentStatus: "partial", paystackLink: "https://pay.example/german",
      trialEndsAt: "2030-01-01", accessType: "invitation_pending",
      institutionId: "german-partner", courseProgress: { completed: 12 },
      coursePlacements: {
        swahili: { level: "B1", className: "Kiswahili B1", tuitionFee: 700, balanceDue: 700, paymentStatus: "pending" },
      },
    };
    const switched = courseProfile(source, "swahili");
    expect(switched).toEqual(expect.objectContaining({
      level: "B1", className: "Kiswahili B1", tuitionFee: 700,
      balanceDue: 700, paymentStatus: "pending",
    }));
    for (const field of ["paid", "paystackLink", "trialEndsAt", "accessType", "institutionId", "courseProgress"]) {
      expect(switched).not.toHaveProperty(field);
    }
    expect(source.tuitionFee).toBe(3000);
  });

  test("missing secondary placement does not manufacture A1 entitlement", () => {
    const result = courseProfile({ ...student, tuitionFee: 3000, coursePlacements: {} }, "swahili");
    expect(result.level).toBe("");
    expect(result.className).toBe("");
    expect(result.coursePlacementPending).toBe(true);
    expect(result).not.toHaveProperty("tuitionFee");
  });

  test("only official enrollment permits a course, not an admissions interest", () => {
    expect(enrolledCourses({ program: "german", additionalProgrammeInterest: "swahili" })).toEqual(["german"]);
    expect(enrolledCourses({ program: "german", secondaryProgram: "Swahili" })).toEqual(["german", "swahili"]);
    expect(enrolledCourses({ program: "unknown", secondaryProgram: "swahili" })).toEqual([]);
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
