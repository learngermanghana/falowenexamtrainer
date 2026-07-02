import { getB1LessonResourceOverride } from "./b1LessonResourceOverrides";
import { getCourseCompletionJourney } from "./courseCompletionJourney";
import { getLessonRadioResource } from "./lessonRadioDictionary";

describe("requested video assignments", () => {
  test("B1 Day 20 uses the requested Falowen Radio video", () => {
    expect(getLessonRadioResource("B1", 20)).toEqual(
      expect.objectContaining({
        title: "Wie wird man …? (Ausbildung und Qualifikationen) 6.20",
        youtubeId: "jAsPc3RTL7k",
      })
    );
  });

  test("B1 Day 21 Lebensformen heute uses the requested Falowen Radio video", () => {
    expect(getLessonRadioResource("B1", 21)).toEqual(
      expect.objectContaining({
        title: "Lebensformen heute 7.21",
        youtubeId: "yY7uUgJr31g",
      })
    );
  });

  test("B1 Day 7 Fast Food vs. Hausmannskost uses the requested AI video", () => {
    expect(getB1LessonResourceOverride(7)).toEqual(
      expect.objectContaining({
        chapter: "3.7",
        aiVideo: "https://youtu.be/xky4ziUJIis",
      })
    );
  });

  test("A2 completion journey uses the requested next-step video", () => {
    expect(getCourseCompletionJourney("A2")).toEqual(
      expect.objectContaining({
        title: "After A2: prepare for the Goethe A2 exam",
        videoUrl: "https://youtu.be/Qw54j9GiMd4",
      })
    );
  });
});
