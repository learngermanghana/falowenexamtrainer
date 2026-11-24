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

test("complimentary secondary Swahili access expires independently of the German course", () => {
  const end = "2027-02-24T10:00:00.000Z";
  const profile = { program: "german", secondaryProgram: "swahili", level: "A2",
    contractEnd: "2027-05-24", paid: 3000, coursePlacements: { swahili: { level: "A1",
      accessType: "complimentary", contractEnd: end } } };
  const expires = Date.parse(end);
  expect(enrolledCourses(profile, expires - 1)).toEqual(["german", "swahili"]);
  expect(enrolledCourses(profile, expires)).toEqual(["german"]);
  expect(enrolledCourses(profile, expires + 1)).toEqual(["german"]);
  expect(profile.contractEnd).toBe("2027-05-24");
  expect(profile.paid).toBe(3000);
});
