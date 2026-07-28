import {
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
