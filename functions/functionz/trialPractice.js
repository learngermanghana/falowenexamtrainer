"use strict";

const exams = require("./trialExams.json");
const { courseExpiry, trialRestriction } = require("./entitlementService");
const { getLessonsByLevel } = require("../data/lessonCatalog");

async function allowsTrialRequest(req, restriction, db, uid) {
  const {level, course = false, preview = false} = restriction;
  const exam = exams[level];
  if (!exam) return false;
  const path = req.path.toLowerCase().replace(/\/+$/, "");
  const prefix = level.toLowerCase();
  const body = req.body || {};
  const query = req.query || {};
  if (path === "/course-media/studio/lesson" || path === "/course-media/studio/score") {
    const key = req.method === "GET" ? query.assignmentKey : body.assignmentKey;
    return (course || (preview && path === "/course-media/studio/lesson" && req.method === "GET")) && getLessonsByLevel(level).some(item => item.day === 1 && item.assignmentId === key);
  }
  if (path === "/course-media/" + prefix + "/audio-url") return (course || (preview && req.method === "GET")) && Number(query.day) === 1;
  if (path === "/exam-room/results") {
    if (req.method === "GET") return true;
    return body.level === level && ((level === "C1" && body.setId === exam.resultId && body.section === "lesen") ||
      (level === "B2" && body.setId === "b2-final-mock"));
  }
  if (!exam.engineId) return false;
  if (path === "/course-media/" + prefix + "/mock-audio-url") return query.mockId === exam.engineId.slice(3);
  if (path === "/course-media/a1/exam-hoeren-audio-url") return level === "A1" && query.sampleId === "sample-2";
  if (path === "/speaking/analyze") return body.level === level && body.contextType === level + " full mock exam" && body.mockId === exam.engineId;
  const start = path === "/" + prefix + "-mock/attempt/start";
  const save = path === "/" + prefix + "-mock/attempt/save";
  const scoring = ["writing", "speaking"].some(skill => path === "/" + skill + "/" + prefix + "-mock-score");
  if (!start && !save && !scoring) return false;
  if (!save && (body.mockId || prefix + "-mock-01") !== exam.engineId) return false;
  if (save || (scoring && level !== "B2")) {
    if (!/^[\w-]{1,130}$/.test(body.attemptId || "")) return false;
    const snap = await db.collection(prefix + "MockExamUsers").doc(uid).collection("attempts").doc(body.attemptId).get();
    return snap.exists && (snap.data().mockId || prefix + "-mock-01") === exam.engineId;
  }
  return true;
}

module.exports = { courseExpiry, trialRestriction, allowsTrialRequest };
