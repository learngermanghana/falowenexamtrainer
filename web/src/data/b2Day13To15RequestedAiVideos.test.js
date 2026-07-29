import {
  B2_C1_LESSON_RADIO_OVERRIDES,
  B2_C1_LESSON_VIDEO_OVERRIDES,
  applyB2C1LessonVideoOverrides,
} from "./b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "./lessonModel";

const requestedAiVideos = [
  {
    day: 13,
    chapter: "3.3",
    key: "b2-day13-chapter-3-3-ai-video",
    url: "https://youtu.be/MGtC8QQrdSs",
  },
  {
    day: 14,
    chapter: "3.4",
    key: "b2-day14-chapter-3-4-ai-video",
    url: "https://youtu.be/Hqowo8xhrpw",
  },
  {
    day: 15,
    chapter: "3.5",
    key: "b2-day15-chapter-3-5-ai-video",
    url: "https://youtu.be/5fdtLPqHe7A",
  },
];

const requestedRadioVideos = [
  {
    day: 12,
    chapter: "3.2",
    title: "Kultur und Freizeit",
    key: "b2-day12-kultur-freizeit-falowen-radio",
    youtubeId: "juDa8R56Mtc",
  },
  {
    day: 13,
    chapter: "3.3",
    title: "Familie und Generationen",
    key: "b2-day13-familie-generationen-falowen-radio",
    youtubeId: "9LLc7AAqrOc",
  },
  {
    day: 14,
    chapter: "3.4",
    title: "Freundschaft und soziale Beziehungen",
    key: "b2-day14-freundschaft-beziehungen-falowen-radio",
    youtubeId: "BdO8p8C-aSs",
  },
];

describe("requested B2 Day 13 to 15 AI videos", () => {
  test.each(requestedAiVideos)(
    "maps B2 Day $day Chapter $chapter to the requested AI video",
    ({ day, chapter, key, url }) => {
      expect(B2_C1_LESSON_VIDEO_OVERRIDES.B2[day].videoResources[0]).toEqual(
        expect.objectContaining({ key, chapter, url }),
      );

      const dictionary = { B2: {}, C1: {} };
      applyB2C1LessonVideoOverrides(dictionary);
      expect(dictionary.B2[day].videoResources).toContainEqual(
        expect.objectContaining({ key, chapter, url }),
      );

      const lesson = normalizeB2C1Lesson(
        { level: "B2", day, chapter, title: `B2 Day ${day}` },
        "B2",
      );

      expect(lesson.resources.aiVideo).toEqual(
        expect.objectContaining({ key, chapter, url }),
      );
      expect(lesson.resources.aiVideo.key).toContain("ai-video");
      expect(lesson.resources.falowenRadio?.youtubeId || "").not.toBe(
        url.split("/").pop(),
      );
    },
  );
});

describe("requested B2 Day 12 to 14 Falowen Radio videos", () => {
  test.each(requestedRadioVideos)(
    "maps B2 Day $day Chapter $chapter to the requested Falowen Radio video",
    ({ day, chapter, title, key, youtubeId }) => {
      expect(B2_C1_LESSON_RADIO_OVERRIDES.B2[day]).toEqual(
        expect.objectContaining({ key, youtubeId }),
      );

      const lesson = normalizeB2C1Lesson(
        { level: "B2", day, chapter, title },
        "B2",
      );

      expect(lesson.resources.falowenRadio).toEqual(
        expect.objectContaining({ key, youtubeId }),
      );
      expect(lesson.resources.aiVideo).toBeTruthy();
      expect(lesson.resources.aiVideo.url).not.toContain(youtubeId);
    },
  );
});
