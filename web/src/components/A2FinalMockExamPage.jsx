import React from "react";
import MockExamHub from "./MockExamHub";
import { getMockExam } from "../data/mockExamCatalog";

export default function A2FinalMockExamPage() {
  return (
    <MockExamHub
      exam={getMockExam("a2-course-preview-01")}
      backLabel="Back to Course Book"
      backPath="/campus/course"
    />
  );
}
