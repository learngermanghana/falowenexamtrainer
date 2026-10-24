import { db, doc, getDoc, serverTimestamp, setDoc } from "../firebase";

const DRAFT_COLLECTION = "submissionDrafts";

const normalizeIdPart = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 120);

const buildStudentScopeKey = ({ userId, studentCode, studentEmail }) =>
  [userId, studentCode, studentEmail]
    .map((part) => normalizeIdPart(part || ""))
    .filter(Boolean)
    .join("__") || "anonymous";

const timestampToMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (Number.isFinite(value?.seconds)) return Number(value.seconds) * 1000;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

export const buildA1WorkbookCloudDraftIdentity = ({ user, studentProfile, assignment }) => {
  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "";
  const studentScopeKey = buildStudentScopeKey({
    userId: user?.uid,
    studentCode,
    studentEmail: user?.email,
  });
  const chapterKey = `chapter-${normalizeIdPart(assignment?.chapter || assignment?.assignmentKey || assignment?.day || "unknown")}`;
  const draftDocId = `${studentScopeKey}__a1__${normalizeIdPart(chapterKey)}`;
  return { studentCode, studentScopeKey, chapterKey, draftDocId };
};

export const loadA1WorkbookCloudDraft = async ({ user, studentProfile, assignment }) => {
  if (!db || !user?.uid || !assignment) return { ok: false, reason: "auth" };
  const identity = buildA1WorkbookCloudDraftIdentity({ user, studentProfile, assignment });
  try {
    const snapshot = await getDoc(doc(db, DRAFT_COLLECTION, identity.draftDocId));
    if (!snapshot.exists()) return { ok: true, empty: true, identity };
    return {
      ok: true,
      empty: false,
      identity,
      data: snapshot.data() || {},
      updatedAtMillis: timestampToMillis(snapshot.data()?.updatedAt),
    };
  } catch (error) {
    console.error("A1 workbook cloud draft load failed", error);
    return { ok: false, reason: "firestore", error };
  }
};

export const saveA1WorkbookCloudDraft = async ({
  user,
  studentProfile,
  assignment,
  sections,
  submissionText,
  source = "a1-workbook-autosave",
}) => {
  if (!db || !user?.uid || !assignment) return { ok: false, reason: "auth" };
  const identity = buildA1WorkbookCloudDraftIdentity({ user, studentProfile, assignment });
  const draftRef = doc(db, DRAFT_COLLECTION, identity.draftDocId);

  try {
    const existing = await getDoc(draftRef);
    const existingData = existing.exists() ? existing.data() || {} : {};
    const studentName =
      studentProfile?.name ||
      studentProfile?.fullName ||
      studentProfile?.displayName ||
      user?.displayName ||
      String(user?.email || "").split("@")[0] ||
      "";
    const assignmentTitle = `A1 • Day ${assignment.day}: ${assignment.title} • Chapter ${assignment.chapter}`;

    const payload = {
      title: assignmentTitle,
      assignmentTitle,
      level: "A1",
      day: assignment.day,
      chapter: assignment.chapter,
      chapterKey: identity.chapterKey,
      assignmentId: assignment.assignmentKey,
      assignment_id: assignment.assignmentKey,
      assignmentKey: assignment.assignmentKey,
      canonicalAssignmentKey: assignment.assignmentKey,
      submissionText,
      answer: submissionText,
      workContent: submissionText,
      workbookSections: sections,
      workbookDraftVersion: 1,
      status: "draft",
      studentId: user.uid,
      userId: user.uid,
      uid: user.uid,
      ownerUid: user.uid,
      studentEmail: user?.email || "",
      studentCode: identity.studentCode,
      studentScopeKey: identity.studentScopeKey,
      studentName,
      className: studentProfile?.className || "",
      cloudPersistenceSource: source,
      cloudPersistenceVersion: 4,
      createdAt: existingData.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(draftRef, payload, { merge: true });
    return { ok: true, identity };
  } catch (error) {
    console.error("A1 workbook cloud draft save failed", error);
    return { ok: false, reason: "firestore", error };
  }
};

export const __TESTING__ = { normalizeIdPart, buildStudentScopeKey, timestampToMillis };
