import { courseProfile, enrolledCourses } from "./courseEnrollment";
import { canSubmitSwahiliWorkbook } from "./campusProgram";

test.each(["german", "swahili"])("keeps %s primary placement while switching both ways", primary => {
  const secondary = primary === "german" ? "swahili" : "german";
  const profile = { program: primary, secondaryProgram: secondary, classId: "old", level: "B1", coursePlacements: { [secondary]: { level: "A2", className: "Evening" } } };
  expect(enrolledCourses(profile)).toEqual([primary, secondary]);
  const view = courseProfile(profile, secondary);
  expect(view).toMatchObject({ program: secondary, classId: "", level: "A2", className: "Evening" });
  expect(canSubmitSwahiliWorkbook({ user: { uid: "test" }, studentProfile: view })).toBe(secondary === "swahili");
  expect(courseProfile(profile, primary)).toBe(profile);
});

test("a stored preference cannot re-enable an archived course", () => {
  const legacy = { level: "B1", coursePlacements: { swahili: { level: "A1" } } };
  expect(enrolledCourses(legacy)).toEqual(["german"]);
  expect(courseProfile(legacy, "swahili")).toBe(legacy);
});
