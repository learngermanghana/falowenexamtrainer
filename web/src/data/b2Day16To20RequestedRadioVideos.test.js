import {
  B2_C1_LESSON_RADIO_OVERRIDES,
  B2_C1_LESSON_VIDEO_OVERRIDES,
} from "./b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "./lessonModel";

const requestedRadioVideos = [
  {
    day: 16,
    chapter: "4.1",
    title: "Digitalisierung im Alltag 4.1",
    key: "b2-day16-digitalisierung-alltag-falowen-radio",
    youtubeId: "owg4yrfE3AU",
  },
  {
    day: 17,
    chapter: "4.2",
    title: "Mobilität und Stadtleben 4.2",
    key: "b2-day17-mobilitaet-stadtleben-falowen-radio",
    youtubeId: "YHbNyjnrlFI",
  },
  {
    day: 18,
    chapter: "4.3",
    title: "Natur, Klima und Verantwortung 4.3",
    key: "b2-day18-natur-klima-verantwortung-falowen-radio",
    youtubeId: "Muq_KlmZuBM",
  },
  {
    day: 19,
    chapter: "4.4",
    title: "Freiwilligenarbeit und Engagement 4.4",
    key: "b2-day19-freiwilligenarbeit-engagement-falowen-radio",
    youtubeId: "Mte_sT9D-Pg",
  },
  {
    day: 20,
    chapter: "4.5",
    title: "Technologie und Arbeit der Zukunft 4.5",
    key: "b2-day20-technologie-arbeit-zukunft-falowen-radio",
    youtubeId: "v8kHCzl7EN0",
  },
];

describe("requested B2 Day 16 to 20 Falowen Radio videos", () => {
  test.each(requestedRadioVideos)(
    "maps B2 Day $day Chapter $chapter to the requested Falowen Radio video",
    ({ day, chapter, title, key, youtubeId }) => {
      expect(B2_C1_LESSON_RADIO_OVERRIDES.B2[day]).toEqual(
        expect.objectContaining({ key, title, youtubeId }),
      );

      const lesson = normalizeB2C1Lesson(
        { level: "B2", day, chapter, title },
        "B2",
      );

      expect(lesson.resources.falowenRadio).toEqual(
        expect.objectContaining({ key, title, youtubeId }),
      );

      const aiResources =
        B2_C1_LESSON_VIDEO_OVERRIDES.B2[day]?.videoResources || [];
      expect(aiResources.some((resource) => resource.url?.includes(youtubeId))).toBe(
        false,
      );
      expect(lesson.resources.aiVideo?.url || "").not.toContain(youtubeId);
    },
  );
});
