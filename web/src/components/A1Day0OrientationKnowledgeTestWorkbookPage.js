import React from "react";
import CurrentDay0OrientationPage from "./CurrentDay0OrientationPage";

const config = {
  level: "A1",
  subtitle: "Begin your German foundation with a clear understanding of the current Falowen app.",
  testTitle: "Day 0 Platform Knowledge Test",
  testIntro: "This is an orientation self-check. You are not expected to know German before starting A1.",
  threshold: 75,
  selfLearning: false,
  courseFlow: "Instruction → lesson resources → workbook practice → Submit tab when the lesson is an assignment",
  courseNotes: [
    "Open the Course Book and choose the current day.",
    "Follow the instruction shown for that lesson; A1 lessons do not all use exactly the same assignment pattern.",
    "Use videos, grammar notes and workbook practice in the order shown.",
    "When an assignment has a Submit tab, send the final answers there inside the Course Book.",
    "When no Submit tab appears, treat the activity as practice and follow the lesson instruction.",
  ],
  campusItems: ["Course Book", "Exam File", "Attendance", "Class Members", "Vocab Practice", "Results", "Account"],
  nextLink: "/campus/course",
  nextLabel: "Open A1 Course Book",
  questions: [
    {
      question: "Where should you start normal daily learning?",
      options: ["Course Book", "Only WhatsApp", "Account"],
      answer: 0,
      explanation: "The Course Book is the main path for daily lessons and workbook tasks.",
    },
    {
      question: "Where is assignment submission now found?",
      options: ["Only in Google Drive", "Inside the assignment workbook when a Submit tab appears", "Only by email"],
      answer: 1,
      explanation: "Falowen now places submission directly in the Course Book workbook flow.",
    },
    {
      question: "What should you do before submitting?",
      options: ["Send rough notes", "Finish the task and check the final answers", "Skip the lesson instruction"],
      answer: 1,
      explanation: "Submit only clean final answers after completing the lesson and workbook.",
    },
    {
      question: "Where do you see marked work and tutor feedback?",
      options: ["Results", "Class Members", "Account"],
      answer: 0,
      explanation: "The Results page shows scores, corrections and improvement areas.",
    },
    {
      question: "What is the purpose of the Exams Room?",
      options: ["Paying fees", "Separate exam-style practice", "Replacing the Course Book"],
      answer: 1,
      explanation: "The Exams Room gives extra exam practice; it does not replace daily learning.",
    },
    {
      question: "What should you do when a lesson has no Submit tab?",
      options: ["Create a separate submission", "Follow the lesson instruction because it may be practice only", "Send it through WhatsApp"],
      answer: 1,
      explanation: "Not every A1 activity is graded. Follow the instruction shown for that lesson.",
    },
    {
      question: "How should Falowen AI be used?",
      options: ["To copy answers without reading", "To practise and improve your own work", "To avoid the workbook"],
      answer: 1,
      explanation: "AI support is for practice and improvement, not blind copying.",
    },
    {
      question: "What is the assignment pass mark?",
      options: ["40%", "50%", "60%"],
      answer: 2,
      explanation: "Falowen uses 60% as the assignment pass mark.",
    },
  ],
};

const A1Day0OrientationKnowledgeTestWorkbookPage = () => <CurrentDay0OrientationPage config={config} />;

export default A1Day0OrientationKnowledgeTestWorkbookPage;
