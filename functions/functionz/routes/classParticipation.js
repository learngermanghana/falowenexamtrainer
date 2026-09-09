const admin = require("firebase-admin");

const RECORD_COLLECTION = "classParticipationRecords";

const clean = (value) => String(value ?? "").trim();
const lower = (value) => clean(value).toLowerCase();
const count = (value) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
};

const toIso = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const safeQuestionResponses = (value) => (Array.isArray(value) ? value : [])
  .filter((response) => response?.result === "correct" || response?.result === "needs_review")
  .slice(-20)
  .map((response) => ({
    questionId: clean(response.questionId).slice(0, 160),
    question: clean(response.question).slice(0, 700),
    result: response.result,
    questionContext: clean(response.questionContext).slice(0, 120),
    recordedAt: clean(response.recordedAt).slice(0, 80),
  }))
  .filter((response) => response.question);

async function getAuthenticatedStudent(req) {
  const authHeader = clean(req.headers?.authorization);
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  try {
    return await admin.auth().verifyIdToken(match[1]);
  } catch (error) {
    console.warn("class_participation_auth_failed", error?.message || error);
    return null;
  }
}

const studentSafeRecord = (snapshot) => {
  const data = snapshot.data() || {};
  return {
    id: snapshot.id,
    sessionId: clean(data.sessionId),
    classId: clean(data.classId),
    course: clean(data.course),
    assignmentId: clean(data.assignmentId),
    lessonDay: clean(data.lessonDay),
    lessonTitle: clean(data.lessonTitle),
    sessionDate: clean(data.sessionDate),
    turns: count(data.turns),
    correct: count(data.correct),
    needsReview: count(data.needsReview),
    skipped: count(data.skipped),
    questionResponses: safeQuestionResponses(data.questionResponses),
    updatedAt: toIso(data.updatedAt),
  };
};

async function loadRows(db, field, value) {
  if (!clean(value)) return [];
  const snapshot = await db
    .collection(RECORD_COLLECTION)
    .where(field, "==", value)
    .limit(100)
    .get();
  return snapshot.docs.map(studentSafeRecord);
}

async function classParticipationMeHandler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const user = await getAuthenticatedStudent(req);
  if (!user?.uid) {
    return res.status(401).json({ ok: false, error: "Authentication required" });
  }

  try {
    const db = admin.firestore();
    const email = lower(user.email);
    const lookups = [loadRows(db, "studentUid", user.uid)];
    if (email) lookups.push(loadRows(db, "studentEmailNormalized", email));

    const rows = (await Promise.all(lookups)).flat();
    const unique = [...new Map(rows.map((row) => [row.id, row])).values()]
      .sort((a, b) => {
        const dateCompare = String(b.sessionDate || "").localeCompare(String(a.sessionDate || ""));
        if (dateCompare !== 0) return dateCompare;
        return String(b.lessonDay || b.assignmentId || "").localeCompare(
          String(a.lessonDay || a.assignmentId || "")
        );
      });

    return res.json({ ok: true, participation: unique });
  } catch (error) {
    console.error("class_participation_me_failed", error);
    return res.status(500).json({ ok: false, error: "Could not load Class Participation" });
  }
}

module.exports = {
  classParticipationMeHandler,
  safeQuestionResponses,
  studentSafeRecord,
};
