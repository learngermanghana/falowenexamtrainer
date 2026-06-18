import { courseSchedules } from "./courseSchedule";
import { normalizeLesson } from "./lessonModel";

const getA1Lesson = (day) =>
  (courseSchedules.A1 || []).find((entry) => Number(entry.day) === Number(day));

const aiVideos = (lesson) =>
  (lesson.resources.videos || []).filter(
    (video) => !`${video.key || ""} ${video.title || ""}`.toLowerCase().includes("teacher"),
  );

test("A1 Day 2 separates Kapitel 0.2 and Kapitel 1.1 AI videos", () => {
  const lesson = normalizeLesson(getA1Lesson(2), "A1");
  const videos = aiVideos(lesson);

  expect(videos).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        chapter: "0.2",
        title: "Kapitel 0.2 · Alphabet · AI video",
        url: "https://youtu.be/pCQVdJGsvtk",
      }),
      expect.objectContaining({
        chapter: "1.1",
        title: "Kapitel 1.1 · Pronouns & Verb Conjugation · AI video",
        url: "https://youtu.be/LyfFDU0U_7U",
      }),
    ]),
  );
  expect(videos.some((video) => video.title.includes("Kapitel 0.2 + 1.1"))).toBe(false);
});

test("A1 Day 4 keeps only Kapitel 2 German Numbers AI video", () => {
  const lesson = normalizeLesson(getA1Lesson(4), "A1");
  const numberVideos = aiVideos(lesson).filter((video) =>
    `${video.title || ""} ${video.description || ""}`.toLowerCase().includes("number"),
  );

  expect(numberVideos).toHaveLength(1);
  expect(numberVideos[0]).toEqual(
    expect.objectContaining({
      title: "Kapitel 2 · German Numbers · AI video",
      url: "https://youtu.be/jb2NDRJPit0",
    }),
  );
  expect(lesson.resources.videos.some((video) => video.title === "Kapitel 2 · Zahlen · AI video")).toBe(false);
});
