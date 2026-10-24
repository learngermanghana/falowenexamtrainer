import { getTeacherLectureVideoResources } from "./teacherLectureVideoResources";

describe("A2 Day 6 teacher lecture", () => {
  test("uses the Möbel und Räume lecture requested for chapter 3.6", () => {
    const resources = getTeacherLectureVideoResources("A2", 6);
    expect(resources).toHaveLength(1);
    expect(resources[0].chapter).toBe("3.6");
    expect(resources[0].url).toBe("https://youtu.be/lr00YnyH0GI");
  });
});
