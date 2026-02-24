import {
  addDoc,
  collection,
  doc,
  db,
  getDocs,
  isFirebaseConfigured,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "../firebase";

const COLLECTION_NAME = "examTutorReviewQueue";

export const isTutorReviewCloudEnabled = () => Boolean(isFirebaseConfigured && db);

export const saveExamLetterForTutorReview = async ({
  user,
  studentProfile,
  level,
  promptTitle,
  promptId,
  draft,
  aiFeedback,
  revisedDraft,
  reflection,
}) => {
  const createdAt = new Date().toISOString();
  const ownerKey = String(studentProfile?.studentCode || studentProfile?.studentcode || user?.uid || "")
    .trim()
    .toLowerCase();

  const payload = {
    studentId: user?.uid || "",
    studentEmail: user?.email || "",
    studentName: studentProfile?.name || user?.displayName || "",
    studentCode: studentProfile?.studentCode || studentProfile?.studentcode || "",
    className: studentProfile?.className || "",
    program: studentProfile?.program || "",
    level: level || "",
    source: "exam-room",
    ownerKey,
    reviewStatus: "pending",
    tutorFeedback: "",
    reviewedAt: null,
    promptTitle: promptTitle || "Custom prompt",
    promptId: promptId || "custom",
    draft: draft || "",
    aiFeedback: aiFeedback || "",
    revisedDraft: revisedDraft || "",
    reflection: reflection || "",
    createdAt,
  };

  if (!isFirebaseConfigured || !db) {
    throw new Error("Tutor review saving requires Firebase/Firestore configuration.");
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, createdAt, storage: "firestore" };
};



export const loadLatestTutorReviewForStudent = async ({ userId, studentCode } = {}) => {
  const ownerCandidates = [
    String(studentCode || "").trim().toLowerCase(),
    String(userId || "").trim().toLowerCase(),
  ].filter(Boolean);

  if (!ownerCandidates.length) return null;

  if (!isFirebaseConfigured || !db) {
    return null;
  }

  const reviewQuery = query(
    collection(db, COLLECTION_NAME),
    where("ownerKey", "in", ownerCandidates),
    orderBy("createdAt", "desc"),
    limit(1)
  );
  const snapshot = await getDocs(reviewQuery);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

export const saveTutorReviewResponse = async ({ reviewId, reviewStatus, tutorFeedback = "" } = {}) => {
  if (!reviewId) {
    throw new Error("Missing reviewId for tutor response.");
  }

  if (!isFirebaseConfigured || !db) {
    throw new Error("Tutor responses require Firebase/Firestore configuration.");
  }

  await updateDoc(doc(db, COLLECTION_NAME, reviewId), {
    reviewStatus,
    tutorFeedback,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return true;
};
