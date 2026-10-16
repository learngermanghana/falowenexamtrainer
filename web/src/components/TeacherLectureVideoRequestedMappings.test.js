import { getTeacherLectureVideoResources } from "../data/teacherLectureVideoResources";
import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";
import { getLessonVideoResources } from "../data/lessonVideoDictionary";

test("B1 Day 19 uses the requested teacher lecture", () => {
  expect(getTeacherLectureVideoResources("B1", 19).find(item => item.chapter === "6.19")?.url)
    .toBe("https://youtu.be/Le_pW3eoBZA");
});

test("A1 Day 6 family and hobbies uses the requested teacher lecture", () => {
  expect(getA1TeacherVideoResources(6, "2.3")[0]?.url)
    .toBe("https://youtu.be/sHYGyoOZ31Q");
});

test("A2 Day 14 Beruf und Karriere uses only the replacement teacher lecture", () => {
  const lectures = getTeacherLectureVideoResources("A2", 14);
  expect(lectures).toEqual([
    expect.objectContaining({
      key: "a2-day14-5.14-teacher-lecture-video",
      chapter: "5.14",
      url: "https://youtu.be/peuEAMRsFKI",
    }),
  ]);
  const lessonVideos = getLessonVideoResources("A2", 14);
  const teacherVideos = lessonVideos.filter((video) => /teacher|tutor lecture/i.test(
    [video.key, video.title].join(" ")
  ));
  expect(teacherVideos).toHaveLength(1);
  expect(teacherVideos[0].url).toBe("https://youtu.be/peuEAMRsFKI");
  expect(JSON.stringify(lessonVideos)).not.toContain("hGK64aXtARk");
});
