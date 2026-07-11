import React from "react";
import { render, screen } from "@testing-library/react";
import Day0OrientationVideoPanel, {
  DAY0_ORIENTATION_VIDEOS,
  getDay0OrientationVideo,
} from "./Day0OrientationVideoPanel";
import { __private__ as day0RoutePrivate } from "./Day0StudentWorkflowAutoMount";

describe("Day 0 unified orientation pages", () => {
  test.each([
    ["A1", "qPwxBYlu3CE"],
    ["A2", "ORX4KELTPEQ"],
    ["B1", "QMWj_N6ncwI"],
    ["B2", "AH2dPdqjfTo"],
  ])("embeds the configured %s orientation video in the guide", (level, videoId) => {
    render(<Day0OrientationVideoPanel level={level} />);

    expect(screen.getByTitle(DAY0_ORIENTATION_VIDEOS[level].title)).toHaveAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&playsinline=1`,
    );
    expect(screen.getByText(/video and orientation text are now on the same page/i)).toBeInTheDocument();
  });

  test("normalizes level casing and leaves an unconfigured level empty", () => {
    expect(getDay0OrientationVideo(" b1 ")).toEqual(DAY0_ORIENTATION_VIDEOS.B1);
    expect(getDay0OrientationVideo("C1")).toBeNull();
  });

  test("routes only Day 0 lesson URLs to the dedicated orientation pages", () => {
    expect(day0RoutePrivate.DAY0_LESSON_REDIRECTS).toEqual(
      expect.objectContaining({
        "/campus/course/lesson/a1/0": "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook",
        "/campus/course/lesson/a2/0": "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook",
        "/campus/course/lesson/b1/0": "/campus/course/b1-day-0-orientation-and-knowledge-test-workbook",
        "/campus/course/lesson/b2/0": "/campus/course/b2-day-0-self-learning-orientation-workbook",
        "/campus/course/lesson/c1/0": "/campus/course/c1-day-0-progression-workbook",
      }),
    );
    expect(day0RoutePrivate.DAY0_LESSON_REDIRECTS["/campus/course/lesson/b1/1"]).toBeUndefined();
  });
});
