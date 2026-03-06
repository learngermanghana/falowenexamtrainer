import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  db,
  getDocs,
  onSnapshot,
  isFirebaseConfigured,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  where,
} from "../firebase";

const COLLECTION_NAME = "examTutorReviewQueue";

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (typeof value === "object") {
    if (typeof value.seconds === "number") {
      const nanos = typeof value.nanoseconds === "number" ? value.nanoseconds : 0;
      return (value.seconds * 1000) + Math.floor(nanos / 1e6);
    }
    if (typeof value._seconds === "number") {
      const nanos = typeof value._nanoseconds === "number" ? value._nanoseconds : 0;
      return (value._seconds * 1000) + Math.floor(nanos / 1e6);
    }
  }
  return 0;
};

const normalizeReviewTimestamps = (review = {}) => {
  if (!review || typeof review !== "object") return review;

  const createdAtMs = toMillis(review.createdAt);
  const reviewedAtMs = toMillis(review.reviewedAt);
  return {
    ...review,
    createdAtMs,
    reviewedAt: reviewedAtMs ? new Date(reviewedAtMs).toISOString() : review.reviewedAt || null,
  };
};

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
  source = "exam-room",
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
    source,
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
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(reviewQuery);
  if (snapshot.empty) return null;

  const latest = snapshot.docs
    .map((docSnap) => normalizeReviewTimestamps({ id: docSnap.id, ...docSnap.data() }))
    .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0))[0];

  return latest || null;
};

export const loadTutorReviewsForStudent = async ({ userId, studentCode } = {}) => {
  const ownerCandidates = [
    String(studentCode || "").trim().toLowerCase(),
    String(userId || "").trim().toLowerCase(),
  ].filter(Boolean);

  if (!ownerCandidates.length) return [];

  if (!isFirebaseConfigured || !db) {
    return [];
  }

  const reviewQuery = query(
    collection(db, COLLECTION_NAME),
    where("ownerKey", "in", ownerCandidates),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(reviewQuery);
  if (snapshot.empty) return [];

  return snapshot.docs
    .map((docSnap) => normalizeReviewTimestamps({ id: docSnap.id, ...docSnap.data() }))
    .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
};


export const subscribeTutorReviewsForStudent = ({ userId, studentCode } = {}, onChange, onError) => {
  const ownerCandidates = [
    String(studentCode || "").trim().toLowerCase(),
    String(userId || "").trim().toLowerCase(),
  ].filter(Boolean);

  if (!ownerCandidates.length || !isFirebaseConfigured || !db) {
    if (typeof onChange === "function") onChange([]);
    return () => {};
  }

  const reviewQuery = query(
    collection(db, COLLECTION_NAME),
    where("ownerKey", "in", ownerCandidates),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    reviewQuery,
    (snapshot) => {
      const reviews = snapshot.docs
        .map((docSnap) => normalizeReviewTimestamps({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

      if (typeof onChange === "function") onChange(reviews);
    },
    (error) => {
      if (typeof onError === "function") onError(error);
    }
  );
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

export const saveStudentReplyToTutorReview = async ({
  reviewId,
  message,
  studentName = "",
  studentCode = "",
} = {}) => {
  if (!reviewId) {
    throw new Error("Missing reviewId for student response.");
  }

  const trimmed = String(message || "").trim();
  if (!trimmed) {
    throw new Error("Write a message before sending your reply.");
  }

  if (!isFirebaseConfigured || !db) {
    throw new Error("Student responses require Firebase/Firestore configuration.");
  }

  await updateDoc(doc(db, COLLECTION_NAME, reviewId), {
    studentReplies: arrayUnion({
      message: trimmed,
      studentName,
      studentCode,
      createdAt: new Date().toISOString(),
    }),
    updatedAt: serverTimestamp(),
  });

  return true;
};
