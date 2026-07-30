import React from "react";
import CurrentDay0OrientationPage from "./CurrentDay0OrientationPage";

const config = {
  level: "A1",
  subtitle: "Start here before Day 1. This beginner orientation explains how to use Falowen for your first German lessons.",
  testTitle: "A1 Starter Platform Check",
  testIntro: "This is a simple orientation check. You are not expected to know German before starting A1.",
  testAdvice: "Answer every question. A score of",
  threshold: 75,
  selfLearning: false,
  introText:
    "Day 0 is not a graded assignment. It is a beginner orientation. It helps you understand how to open your A1 lessons, watch the video, read the notes, practise in the workbook and submit only when a lesson asks you to submit.",
  todayTasks: [
    "Read the A1 orientation carefully before Day 1.",
    "Open the Course Book and learn how to find your current A1 day.",
    "Understand the beginner flow: instruction, video, grammar notes, workbook practice and Submit tab when required.",
    "Learn the difference between practice work and tutor-marked assignments.",
    "Enable notifications so you receive score updates, class reminders and important announcements.",
    "Complete this short platform check so you know how to use Falowen correctly.",
  ],
  submitNoteTitle: "A1 submission rule:",
  submitNoteText:
    "Use the Submit tab only when the A1 workbook shows it. Some A1 pages are practice-only. Do not use A2/B1-style Teil 1, Teil 2, Teil 3 and Teil 4 instructions unless that exact A1 workbook shows them.",
  finishText:
    "There is no normal assignment submission for A1 Day 0. Finish the orientation check, review any correction and then continue to A1 Day 1.",
  courseFlow: "Falowen Radio → supporting materials → instruction → grammar notes → workbook practice → Submit only when required",
  courseNotes: [
    "Open the Course Book and choose the current A1 day.",
    "Listen to Falowen Radio first and select Continue to open the supporting materials and workbook.",
    "Start with the instruction so you know whether the page is practice-only or tutor-marked.",
    "Watch the beginner video first when it is available.",
    "Read the grammar notes slowly and practise the examples aloud.",
    "Complete the workbook task. If a Submit tab appears, send your clean final answers there.",
    "If no Submit tab appears, treat the page as practice and follow the lesson instruction.",
  ],
  campusItems: ["Course Book", "Exam File", "Attendance", "Class Members", "Vocab Practice", "Results", "Account"],
  nextLink: "/campus/course",
  nextLabel: "Open A1 Course Book",
  questions: [
    {
      question: "Where should an A1 student start normal daily learning?",
      options: ["Course Book", "Only WhatsApp", "Account"],
      answer: 0,
      explanation: "The Course Book is the main path for A1 daily lessons and workbook tasks.",
    },
    {
      question: "What should you do when Falowen Radio appears at the start of an A1 lesson?",
      options: ["Listen first, then select Continue", "Skip directly to Submit", "Leave the Course Book"],
      answer: 0,
      explanation: "Falowen Radio introduces the topic before the lesson materials and workbook practice.",
    },
    {
      question: "What should you do first when you open an A1 lesson?",
      options: ["Skip to submit", "Read the instruction", "Close the page"],
      answer: 1,
      explanation: "The instruction tells you what to watch, read, practise and submit.",
    },
    {
      question: "When should you submit work?",
      options: ["Only when the workbook asks you to submit", "Every time you open any page", "Only on WhatsApp"],
      answer: 0,
      explanation: "Some A1 activities are practice-only. Submit only when the page has a Submit tab or asks for final answers.",
    },
    {
      question: "What should you submit?",
      options: ["Rough notes", "Clean final answers", "Only screenshots"],
      answer: 1,
      explanation: "Submit clean final answers after completing the lesson and workbook.",
    },
    {
      question: "Where do you see marked work and tutor feedback?",
      options: ["Results", "Class Members", "Account"],
      answer: 0,
      explanation: "The Results page shows scores, corrections and improvement areas.",
    },
    {
      question: "What is the purpose of the Exams Room?",
      options: ["Paying fees", "Extra exam-style practice", "Replacing the Course Book"],
      answer: 1,
      explanation: "The Exams Room gives extra exam practice; it does not replace daily learning.",
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
