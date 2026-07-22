import React from "react";
import A1Day14ModalVerbsWorkbookCorePage from "./A1Day14ModalVerbsWorkbookCorePage";
import { A1_CANONICAL_LESSON_CATALOG } from "../data/a1CanonicalLessonCatalog";
import { getA1SelfLearningJourneyResources } from "./A1CoursePracticeAutoMount";
import { SelfLearningMaterialsSelector } from "./selfLearning/SelfLearningJourneyGate";

const day14Practice = A1_CANONICAL_LESSON_CATALOG.find(
  (lesson) =>
    lesson.kind === "practice" &&
    Number(lesson.day) === 14 &&
    String(lesson.chapter) === "3.6",
);

export default function A1Day14ModalVerbsWorkbookPage() {
  if (!day14Practice) return <A1Day14ModalVerbsWorkbookCorePage />;

  const resources = getA1SelfLearningJourneyResources(day14Practice);

  return (
    <SelfLearningMaterialsSelector
      level="A1"
      day={14}
      title="Modal Verbs · Kapitel 3.6"
      teacherVideo={resources.teacherVideo}
      aiVideo={resources.aiVideo}
      grammarBook={resources.grammarBook}
    >
      <A1Day14ModalVerbsWorkbookCorePage />
    </SelfLearningMaterialsSelector>
  );
}
