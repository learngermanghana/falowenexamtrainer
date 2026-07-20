import React from "react";
import { useLocation } from "react-router-dom";
import A1Day14ModalVerbsWorkbookCorePage from "./A1Day14ModalVerbsWorkbookCorePage";
import TeacherLectureSupportingMaterials from "./selfLearning/TeacherLectureSupportingMaterials";

const TEACHER_LECTURE = {
  key: "a1-day14-modal-verbs-teacher-lecture",
  type: "teacher-lecture",
  title: "Teacher lecture · Modal verbs with separable verbs",
  description:
    "Optional teacher explanation for modal verbs, normal main verbs and separable main verbs. Open it separately before or after the lesson.",
  url: "https://youtu.be/GJw1aJehYHU",
};

export default function A1Day14ModalVerbsWorkbookPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search || "");
  const isA2Day17Context =
    String(query.get("level") || "").toUpperCase() === "A2"
    && Number(query.get("day") || 0) === 17;

  return (
    <>
      {!isA2Day17Context ? (
        <TeacherLectureSupportingMaterials lesson={{ teacherVideo: TEACHER_LECTURE }} />
      ) : null}
      <A1Day14ModalVerbsWorkbookCorePage />
    </>
  );
}
