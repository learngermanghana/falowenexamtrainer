import fs from "fs";
import path from "path";
import { normalizeB2C1Lesson } from "../data/lessonModel";
import { normalizeCourseBookEntry } from "../utils/courseBookEntries";
import {
  hasPlayableRadioResource,
  shouldShowRadioFirst,
} from "./RadioFirstWorkbookGate";
import { resolveCanonicalLessonForPage } from "./StandardLessonWritingCoachPage";

describe("B2 redesigned media gate policy", () => {
  test("requires a real Radio link and currently shows no B2 Radio gate", () => {
    expect(hasPlayableRadioResource(null)).toBe(false);
    expect(hasPlayableRadioResource({ youtubeId: "" })).toBe(false);
    expect(hasPlayableRadioResource({ url: "   " })).toBe(false);
    expect(hasPlayableRadioResource({ youtubeId: "abc123" })).toBe(true);
    expect(hasPlayableRadioResource({ url: "https://youtu.be/abc123" })).toBe(true);

    [1, 2, 6, 28].forEach((day) => {
      expect(shouldShowRadioFirst("B2", day)).toBe(false);
    });
  });

  test("shared lesson model rejects stale B2 grammar links and videos", () => {
    const lesson = normalizeB2C1Lesson({
      level: "B2",
      day: 2,
      chapter: "1.2",
      video: "https://youtu.be/wrong-old-video",
      youtube_link: "https://youtu.be/wrong-old-video",
      ai_video: "https://youtu.be/wrong-ai-video",
      grammarbook_link: "https://drive.google.com/wrong-old-grammar",
      workbook_link: "/campus/course/lesson/B2/2?view=workbook",
      lesen_hören: {
        chapter: "1.2",
        grammar_link: "https://drive.google.com/wrong-nested-grammar",
        workbook_link: "/campus/course/lesson/B2/2?view=workbook",
      },
    }, "B2");

    expect(lesson.resources.falowenRadio).toBeNull();
    expect(lesson.resources.grammarBook).toBeNull();
    expect(lesson.resources.teacherVideo).toBeNull();
    expect(lesson.resources.aiVideo).toBeNull();
    expect(lesson.resources.videos).toEqual([]);
    expect(lesson.resources.resourceGroups.every((group) => group.grammarBook === null)).toBe(true);
    expect(lesson.resources.workbook).toEqual(
      expect.objectContaining({ url: "/campus/course/lesson/B2/2?view=workbook" }),
    );
  });

  test("legacy writing-coach fallback also scrubs stale B2 media", () => {
    const canonical = resolveCanonicalLessonForPage(
      { level: "B2", day: 2 },
      {
        resources: {
          falowenRadio: { youtubeId: "wrong" },
          grammarBook: { url: "https://drive.google.com/old-grammar" },
          workbook: { url: "/campus/course/lesson/B2/2?view=workbook" },
          aiVideo: { url: "https://youtu.be/wrong-ai" },
          videos: [{ url: "https://youtu.be/wrong-ai" }],
          resourceGroups: [{
            chapter: "1.2",
            grammarBook: { url: "https://drive.google.com/old-grammar" },
            workbook: { url: "/campus/course/lesson/B2/2?view=workbook" },
          }],
        },
      },
    );

    expect(canonical.resources.falowenRadio).toBeNull();
    expect(canonical.resources.grammarBook).toBeNull();
    expect(canonical.resources.aiVideo).toBeNull();
    expect(canonical.resources.videos).toEqual([]);
    expect(canonical.resources.workbook.url).toBe(
      "/campus/course/lesson/B2/2?view=workbook",
    );
    expect(canonical.resources.resourceGroups[0].grammarBook).toBeNull();
  });

  test("Course Book normalization cannot reintroduce stale B2 media", () => {
    const entry = normalizeCourseBookEntry(
      {
        day: 2,
        chapter: "1.2",
        topic: "Legacy B2",
        grammarPage: "https://drive.google.com/wrong-grammar",
        grammarbook_link: "https://drive.google.com/wrong-grammar",
        grammar_link: "https://drive.google.com/wrong-grammar",
        video: "https://youtu.be/wrong-video",
        youtube_link: "https://youtu.be/wrong-video",
        ai_grammar_video: "https://youtu.be/wrong-ai",
        falowenRadio: { youtubeId: "wrong-radio" },
        workbook_link: "/campus/course/lesson/B2/2?view=workbook",
      },
      { level: "B2" },
    );

    expect(entry.grammarPage).toBe("");
    expect(entry.grammarbook_link).toBeNull();
    expect(entry.grammar_link).toBeNull();
    expect(entry.video).toBeNull();
    expect(entry.youtube_link).toBeNull();
    expect(entry.ai_grammar_video).toBeNull();
    expect(entry.falowenRadio).toBeNull();
    expect(entry.workbook_link).toBe("/campus/course/lesson/B2/2?view=workbook");
  });

  test("B2 lesson UI tells students the grammar video is not added yet", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "B2UnifiedGuidedWorkbookPage.js"),
      "utf8",
    );
    expect(source).toContain('data-b2-grammar-video-status="missing"');
    expect(source).toContain("Grammar video not added yet");
    expect(source).toContain("Falowen zeigt bewusst kein altes oder themenfremdes Video.");
  });
});
