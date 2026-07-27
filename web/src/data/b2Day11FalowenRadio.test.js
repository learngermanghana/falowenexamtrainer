import fs from "fs";
import path from "path";
import { courseSchedules } from "./courseSchedule";
import { getB2C1RadioResource } from "./b2C1LessonMediaOverrides";
import { normalizeB2C1Lesson } from "./lessonModel";

const RADIO_YOUTUBE_ID = "AWEHnJd1o3M";
const RADIO_YOUTUBE_URL = `https://youtu.be/${RADIO_YOUTUBE_ID}`;

describe("B2 Day 11 Falowen Radio resource ownership", () => {
  test("maps the requested episode to the B2 Day 11 Falowen Radio resource", () => {
    expect(getB2C1RadioResource("B2", 11)).toEqual(
      expect.objectContaining({
        key: "b2-day11-gesellschaft-integration-falowen-radio",
        title: "Gesellschaft und Integration 3.1",
        youtubeId: RADIO_YOUTUBE_ID,
      }),
    );
  });

  test("normalizeB2C1Lesson exposes the episode through resources.falowenRadio", () => {
    const lesson = courseSchedules.B2.find((entry) => Number(entry?.day) === 11);
    expect(lesson).toBeTruthy();
    expect(lesson.chapter).toBe("3.1");

    const normalized = normalizeB2C1Lesson(lesson, "B2");
    expect(normalized.resources.falowenRadio).toEqual(
      expect.objectContaining({
        youtubeId: RADIO_YOUTUBE_ID,
      }),
    );
  });

  test("does not repurpose the Falowen Radio episode as an ordinary lesson or Hören video", () => {
    const lesson = courseSchedules.B2.find((entry) => Number(entry?.day) === 11);
    const lessonResources = Array.isArray(lesson?.lesen_hören)
      ? lesson.lesen_hören
      : [lesson?.lesen_hören].filter(Boolean);

    lessonResources.forEach((resource) => {
      expect(resource?.video).not.toBe(RADIO_YOUTUBE_URL);
      expect(resource?.youtube_link).not.toBe(RADIO_YOUTUBE_URL);
    });

    const normalized = normalizeB2C1Lesson(lesson, "B2");
    expect(normalized.resources.videos.map((resource) => resource?.url)).not.toContain(RADIO_YOUTUBE_URL);

    const courseScheduleSource = fs.readFileSync(
      path.resolve(__dirname, "./courseSchedule.js"),
      "utf8",
    );
    expect(courseScheduleSource).not.toContain(`video: "${RADIO_YOUTUBE_URL}"`);
    expect(courseScheduleSource).not.toContain(`youtube_link: "${RADIO_YOUTUBE_URL}"`);

    const patchSource = fs.readFileSync(
      path.resolve(__dirname, "../../../scripts/patchRequestedCourseMedia.mjs"),
      "utf8",
    );
    expect(patchSource).toContain("B2 Day 11 Falowen Radio must not be injected into ordinary lesson video fields.");
  });
});