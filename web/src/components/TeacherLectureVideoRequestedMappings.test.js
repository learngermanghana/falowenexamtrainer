import { getTeacherLectureVideoResources } from "../data/teacherLectureVideoResources";
import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";
import { getLessonVideoResources } from "../data/lessonVideoDictionary";

test("A1 Day 19 chapter 5.9 replaces the teacher lecture without adding a duplicate", () => {
  const videos = getA1TeacherVideoResources(19, "5.9");
  expect(videos).toHaveLength(1);
  expect(videos[0].url).toBe("https://youtu.be/uAAlpkhZ2qs");

  const lessonVideos = getLessonVideoResources("A1", 19, { day: 19, chapter: "5.9" });
  const teachers = lessonVideos.filter((video) =>
    video.chapter === "5.9" && /teacher|tutor lecture/i.test([video.key, video.title].join(" "))
  );
  expect(teachers.map((video) => video.url)).toEqual(["https://youtu.be/uAAlpkhZ2qs"]);
  expect(JSON.stringify(lessonVideos)).not.toContain("ZfXw4fRQ0Tg");
});

test("A2 Day 16 uses the new teacher lecture, keeping the AI grammar video separate", () => {
  const lectures = getTeacherLectureVideoResources("A2", 16);
  expect(lectures).toEqual([
    expect.objectContaining({
      key: "a2-day16-6.16-teacher-lecture-video",
      chapter: "6.16",
      url: "https://youtu.be/WZVEQ9jRONw",
    }),
  ]);
  const lessonVideos = getLessonVideoResources("A2", 16, { day: 16, chapter: "6.16" });
  expect(lessonVideos.filter((video) =>
    /teacher|tutor lecture/i.test([video.key, video.title].join(" "))
  ).map((video) => video.url)).toEqual(["https://youtu.be/WZVEQ9jRONw"]);
  expect(JSON.stringify(lessonVideos)).not.toContain("t_9HDdZbbEA");
  expect(lessonVideos.some((video) => /ai grammar/i.test(video.title))).toBe(true);
});

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

test("B1 Day 21 Lebensformen heute uses the requested teacher lecture video", () => {
  const lectures = getTeacherLectureVideoResources("B1", 21);
  expect(lectures).toEqual([
    expect.objectContaining({
      key: "b1-day21-7.21-teacher-lecture-video",
      chapter: "7.21",
      url: "https://youtu.be/SFLT4cun5Fg",
    }),
  ]);

  const lessonVideos = getLessonVideoResources("B1", 21, {
    day: 21,
    chapter: "7.21",
    assignmentKey: "B1-7.21",
  });
  const teacherVideos = lessonVideos.filter((video) =>
    /teacher|tutor lecture/i.test([video.key, video.title].join(" "))
  );
  expect(teacherVideos).toHaveLength(1);
  expect(teacherVideos[0].url).toBe("https://youtu.be/SFLT4cun5Fg");
  expect(JSON.stringify(lessonVideos)).not.toContain("j-BLeB5eEKw");
});

test("A1 Day 11 Chapter 7 and Day 12 Chapter 8 use their requested lectures without old teacher duplicates", () => {
  const updates = [
    { day: 11, chapter: "7", url: "https://youtu.be/I_bDa_Vz4JE", old: "https://youtu.be/8FnvD8LQEu0" },
    { day: 12, chapter: "8", url: "https://youtu.be/O10ziTyE3Ww", old: "https://youtu.be/ckuH1McZqJk" },
  ];
  for (const { day, chapter, url, old } of updates) {
    const teacher = getA1TeacherVideoResources(day, chapter);
    expect(teacher).toHaveLength(1);
    expect(teacher[0].url).toBe(url);
    const visible = getLessonVideoResources("A1", day, {day, chapter});
    const lectures = visible.filter(resource =>
      resource.chapter === chapter && /teacher|tutor lecture/i.test([resource.key, resource.title].join(" ")));
    expect(lectures.map(resource => resource.url)).toEqual([url]);
    expect(JSON.stringify(visible)).not.toContain(old);
  }
});
