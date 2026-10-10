import { getTeacherLectureVideoResources } from "../data/teacherLectureVideoResources";
import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";

test("B1 Day 19 uses the requested teacher lecture", () => {
  expect(getTeacherLectureVideoResources("B1", 19).find(item => item.chapter === "6.19")?.url)
    .toBe("https://youtu.be/Le_pW3eoBZA");
});

test("A1 Day 6 family and hobbies uses the requested teacher lecture", () => {
  expect(getA1TeacherVideoResources(6, "2.3")[0]?.url)
    .toBe("https://youtu.be/sHYGyoOZ31Q");
});
