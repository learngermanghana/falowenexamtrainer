"use strict";

const exams = require("./trialExams.json");
const { activeSubscriptionsFor } = require("./mockCommerce");
const { getLessonsByLevel } = require("../data/lessonCatalog");

function courseExpiry(profile) {
  if (profile.program === "swahili" || !exams[profile.level] || profile.isTutor ||
      ["tutor", "admin"].includes(profile.role)) return null;
  const balance = profile.balanceDue ?? profile.balance;
  if (["paid", "active", "partial", "partially paid", "partially_paid", "part paid", "part-paid"].includes(String(profile.paymentStatus).toLowerCase()) ||
      Number(profile.paid ?? profile.paidAmount) > 0 || (balance != null && Number(balance) <= 0)) return null;
  const millis = value => value?.toMillis?.() ?? new Date(value || "").getTime();
  const end = millis(profile.trialEndsAt);
  if (Number.isFinite(end)) return end;
  if (profile.trialStatus !== "active") return null;
  const start = millis(profile.trialStartedAt || profile.trialUsedAt || profile.joined_at || profile.joinedAt);
  return Number.isFinite(start) ? start + 7 * 86400000 : 0;
}

async function trialRestriction(db, identity, profile, courseResource = false) {
  const examOnly = profile.accountType === "exam_only" || (!profile.accountType && identity.examOnly === true);
  const ends = courseExpiry(profile);
  if (!examOnly && ends === null) return null;
  if (courseResource) return { level: profile.level, course: !examOnly && ends > Date.now() };
  const grants = await activeSubscriptionsFor(db, identity.uid);
  if (grants.some(row => row.scope !== "trial" && (examOnly || row.level === profile.level))) return null;
  const trial = grants.find(row => row.scope === "trial");
  return { level: examOnly ? trial?.level : ends > Date.now() ? profile.level : null, course: !examOnly && ends > Date.now() };
}

async function allowsTrialRequest(req, restriction, db, uid) {
  const {level, course} = restriction;
  const exam = exams[level];
  if (!exam) return false;
  const path = req.path.toLowerCase().replace(/\/+$/, "");
  const prefix = level.toLowerCase();
  const body = req.body || {};
  const query = req.query || {};
  if (path === "/course-media/studio/lesson" || path === "/course-media/studio/score") {
    const key = req.method === "GET" ? query.assignmentKey : body.assignmentKey;
    return course && getLessonsByLevel(level).some(item => item.day === 1 && item.assignmentId === key);
  }
  if (path === "/course-media/" + prefix + "/audio-url") return course && Number(query.day) === 1;
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
