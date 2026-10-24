import React from "react";
import { render, screen } from "@testing-library/react";
import TeacherLectureSupportingMaterials, {
  removeTeacherLectureFromCanonicalLesson,
  removeTeacherLectureFromLesson,
  resolveTeacherLectureResources,
} from "./TeacherLectureSupportingMaterials";

const teacherVideo = {
  key: "teacher-lecture",
  title: "Teacher lecture: Engagement und Ehrenamt",
  url: "https://youtu.be/teacher123",
};

const aiVideo = {
  key: "ai-video",
  title: "AI lesson: Engagement und Ehrenamt",
  url: "https://youtu.be/ai123",
};

test("shows teacher lectures as links without embedding them", () => {
  const { container } = render(
    <TeacherLectureSupportingMaterials
      canonicalLesson={{
        resources: {
          teacherVideo,
          aiVideo,
          videos: [teacherVideo, aiVideo],
        },
      }}
    />,
  );

  expect(screen.getByRole("heading", { name: "Teacher lecture" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open teacher lecture" })).toHaveAttribute(
    "href",
    teacherVideo.url,
  );
  expect(container.querySelectorAll("iframe")).toHaveLength(0);
});

test("removes teacher lecture resources from the embedded lesson payload but preserves AI video", () => {
  const lesson = {
    videoResource: aiVideo,
    resources: { teacherVideo, videos: [teacherVideo, aiVideo] },
  };
  const canonicalLesson = {
    resources: { teacherVideo, aiVideo, videos: [teacherVideo, aiVideo] },
  };

  const pageLesson = removeTeacherLectureFromLesson(lesson);
  const pageCanonical = removeTeacherLectureFromCanonicalLesson(canonicalLesson);

  expect(pageLesson.videoResource).toEqual(aiVideo);
  expect(pageLesson.resources.teacherVideo).toBeNull();
  expect(pageLesson.resources.videos).toEqual([aiVideo]);
  expect(pageCanonical.resources.aiVideo).toEqual(aiVideo);
  expect(pageCanonical.resources.teacherVideo).toBeNull();
  expect(pageCanonical.resources.videos).toEqual([aiVideo]);
});

test("deduplicates the same teacher lecture from canonical resource aliases", () => {
  expect(
    resolveTeacherLectureResources({
      canonicalLesson: { resources: { teacherVideo, videos: [teacherVideo] } },
    }),
  ).toEqual([teacherVideo]);
});
