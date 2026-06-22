import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  onIdTokenChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  reload,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
  limit,
  addDoc,
  startAfter,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  Timestamp,
  collectionGroup,
  deleteField,
  arrayUnion,
  runTransaction,
} from "firebase/firestore";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { getFunctions, httpsCallable as firebaseHttpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const resolveActionCodeUrl = () => {
  if (process.env.REACT_APP_AUTH_CONTINUE_URL) {
    return process.env.REACT_APP_AUTH_CONTINUE_URL;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  if (firebaseConfig.authDomain) {
    return `https://${firebaseConfig.authDomain}`;
  }

  return "http://localhost";
};

const getActionCodeSettings = () => ({
  url: resolveActionCodeUrl(),
  handleCodeInApp: false,
});

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const missingConfigError = new Error(
  "Firebase config is missing. Please set REACT_APP_FIREBASE_* env vars."
);

const getFirebaseApp = () => {
  if (!isFirebaseConfigured) {
    throw missingConfigError;
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

const app = isFirebaseConfigured ? getFirebaseApp() : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const functions = app ? getFunctions(app, "europe-west1") : null;

const RESUBMISSION_COOLDOWN_MS = 10 * 60 * 1000;
const MAX_TOTAL_SUBMISSION_ATTEMPTS = 3;
const RESUBMISSION_ATTEMPT_STATUSES = new Set([
  "submitted",
  "resubmitted",
  "pending_review",
  "pending",
  "awaiting_review",
  "passed",
  "failed",
]);

const normalizeCallableText = (value) => String(value ?? "").trim();
const normalizeCallableIdentity = (value) =>
  normalizeCallableText(value).toLowerCase().replace(/[^a-z0-9]+/g, "");

const toCallableNumber = (value) => {
  if (value === null || value === undefined || normalizeCallableText(value) === "") return null;
  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
};

const toCallableMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return Number.isFinite(date?.getTime?.()) ? date.getTime() : 0;
  }
  if (typeof value?.seconds === "number") {
    return Number(value.seconds) * 1000 + Math.floor(Number(value.nanoseconds || 0) / 1000000);
  }
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.getTime() : 0;
  if (typeof value === "number") return value > 100000000000 ? value : value * 1000;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

const getCallableSubmissionMillis = (row = {}) =>
  Math.max(
    toCallableMillis(row.resubmittedAt),
    toCallableMillis(row.submittedAt),
    toCallableMillis(row.createdAt),
    toCallableMillis(row.updatedAt),
    toCallableMillis(row.timestamp),
    toCallableMillis(row.date)
  );

const makeCallableError = (code, message, details = undefined) => {
  const error = new Error(message);
  error.code = code.startsWith("functions/") ? code : `functions/${code}`;
  if (details) error.details = details;
  return error;
};

const doesCallableRowMatchAssignment = (row = {}, payload = {}) => {
  const selectedAliases = [
    payload.canonicalAssignmentKey,
    payload.assignmentKey,
    payload.assignmentId,
    payload.assignment_id,
  ]
    .map(normalizeCallableIdentity)
    .filter(Boolean);
  const rowAliases = [
    row.canonicalAssignmentKey,
    row.assignmentKey,
    row.assignmentId,
    row.assignment_id,
  ]
    .map(normalizeCallableIdentity)
    .filter(Boolean);

  if (rowAliases.some((alias) => selectedAliases.includes(alias))) return true;

  const selectedLevel = normalizeCallableText(payload.level).toUpperCase();
  const rowLevel = normalizeCallableText(row.level || row.courseLevel).toUpperCase();
  const selectedDay = toCallableNumber(payload.day);
  const rowDay = toCallableNumber(row.day || row.assignmentDay);
  const selectedTitle = normalizeCallableText(payload.assignmentTitle || payload.title).toLowerCase();
  const rowTitle = normalizeCallableText(row.assignmentTitle || row.title || row.assignment).toLowerCase();

  return Boolean(
    selectedTitle &&
      rowTitle === selectedTitle &&
      (!selectedLevel || !rowLevel || rowLevel === selectedLevel) &&
      (selectedDay === null || rowDay === null || rowDay === selectedDay)
  );
};

const persistResubmissionFallback = async (payload = {}) => {
  const currentUser = auth?.currentUser;
  if (!db || !currentUser?.uid) {
    throw makeCallableError("unauthenticated", "Please sign in before resubmitting work.");
  }

  const correctedText = normalizeCallableText(
    payload.submissionText || payload.answer || payload.workContent
  );
  const improvementSummary = normalizeCallableText(payload.improvementSummary);
  const previousScore = toCallableNumber(payload.previousScore);
  const canonicalAssignmentKey = normalizeCallableText(
    payload.canonicalAssignmentKey || payload.assignmentKey || payload.assignmentId || payload.assignment_id
  );
  const assignmentId = normalizeCallableText(
    payload.assignmentId || payload.assignment_id || canonicalAssignmentKey
  );

  if (!canonicalAssignmentKey || !assignmentId) {
    throw makeCallableError(
      "invalid-argument",
      "Assignment details are missing. Please reopen the assignment and try again."
    );
  }
  if (correctedText.length < 80) {
    throw makeCallableError("invalid-argument", "Corrected text is too short.");
  }
  if (improvementSummary.length < 25) {
    throw makeCallableError(
      "invalid-argument",
      "Please explain what you improved in this resubmission."
    );
  }
  if (previousScore === null || previousScore >= 60) {
    throw makeCallableError(
      "failed-precondition",
      previousScore === null
        ? "A reviewed score is required before resubmitting."
        : "This assignment is already passed, so resubmission is disabled."
    );
  }

  const submissionsRef = collection(db, "submissions");
  const snapshot = await getDocs(
    query(submissionsRef, where("studentId", "==", currentUser.uid))
  );
  const matchingRows = snapshot.docs
    .map((entry) => ({ id: entry.id, ...entry.data() }))
    .filter((row) => doesCallableRowMatchAssignment(row, payload));
  const attemptRows = matchingRows.filter((row) => {
    const status = normalizeCallableText(row.status || row.reviewStatus).toLowerCase();
    const hasText = Boolean(
      normalizeCallableText(row.submissionText || row.answer || row.workContent)
    );
    const attempt = toCallableNumber(row.attempt || row.attemptNumber);
    return Boolean(
      hasText &&
        (RESUBMISSION_ATTEMPT_STATUSES.has(status) ||
          row.isResubmission === true ||
          (typeof attempt === "number" && attempt > 0) ||
          getCallableSubmissionMillis(row) > 0)
    );
  });

  if (!attemptRows.length) {
    throw makeCallableError(
      "failed-precondition",
      "Submit and receive review for this assignment before resubmitting."
    );
  }

  const latestSubmissionMillis = Math.max(
    ...attemptRows.map(getCallableSubmissionMillis),
    0
  );
  if (
    latestSubmissionMillis > 0 &&
    Date.now() < latestSubmissionMillis + RESUBMISSION_COOLDOWN_MS
  ) {
    const nextAllowedMillis = latestSubmissionMillis + RESUBMISSION_COOLDOWN_MS;
    const remainingSeconds = Math.max(
      0,
      Math.ceil((nextAllowedMillis - Date.now()) / 1000)
    );
    throw makeCallableError(
      "resource-exhausted",
      "Please wait before submitting again.",
      {
        code: "RESUBMISSION_COOLDOWN",
        nextAllowedAt: new Date(nextAllowedMillis).toISOString(),
        remainingSeconds,
      }
    );
  }

  const explicitAttempts = attemptRows
    .map((row) => toCallableNumber(row.attemptNumber || row.attempt))
    .filter((value) => typeof value === "number" && value > 0);
  const historicalAttempts = Math.max(
    1,
    explicitAttempts.length ? Math.max(...explicitAttempts) : attemptRows.length
  );
  const requestedAttempt = toCallableNumber(payload.attemptNumber || payload.attempt);
  const nextAttempt = Math.max(historicalAttempts + 1, requestedAttempt || 0);
  if (nextAttempt > MAX_TOTAL_SUBMISSION_ATTEMPTS) {
    throw makeCallableError(
      "resource-exhausted",
      "You have used all resubmissions for this assignment."
    );
  }

  const incomingFingerprint = normalizeCallableText(payload.submissionFingerprint);
  if (
    incomingFingerprint &&
    matchingRows.some(
      (row) => normalizeCallableText(row.submissionFingerprint) === incomingFingerprint
    )
  ) {
    throw makeCallableError(
      "failed-precondition",
      "This corrected text has already been submitted for this assignment."
    );
  }

  const orderedAttempts = attemptRows
    .slice()
    .sort((left, right) => getCallableSubmissionMillis(left) - getCallableSubmissionMillis(right));
  const firstAttempt = orderedAttempts[0] || {};
  const latestAttempt = orderedAttempts[orderedAttempts.length - 1] || {};
  const now = serverTimestamp();
  const submissionRef = await addDoc(submissionsRef, {
    title: normalizeCallableText(payload.title || payload.assignmentTitle),
    assignmentTitle: normalizeCallableText(payload.assignmentTitle || payload.title),
    assignmentKey: canonicalAssignmentKey,
    canonicalAssignmentKey,
    assignmentId,
    assignment_id: assignmentId,
    chapter: normalizeCallableText(payload.chapter),
    chapterKey: normalizeCallableText(payload.chapterKey),
    day: toCallableNumber(payload.day),
    level: normalizeCallableText(payload.level).toUpperCase(),
    className: normalizeCallableText(payload.className),
    studentId: currentUser.uid,
    studentEmail: normalizeCallableText(payload.studentEmail || currentUser.email),
    studentCode: normalizeCallableText(payload.studentCode),
    studentScopeKey: normalizeCallableText(payload.studentScopeKey),
    studentName: normalizeCallableText(payload.studentName),
    submissionFingerprint: incomingFingerprint,
    submissionText: correctedText,
    answer: correctedText,
    workContent: correctedText,
    improvementSummary,
    previousSubmissionText: normalizeCallableText(
      payload.previousSubmissionText ||
        latestAttempt.submissionText ||
        latestAttempt.answer ||
        latestAttempt.workContent
    ),
    previousScore,
    originalSubmittedAt:
      firstAttempt.createdAt || firstAttempt.submittedAt || firstAttempt.updatedAt || null,
    originalSubmissionId: firstAttempt.id || "",
    attempt: nextAttempt,
    attemptNumber: nextAttempt,
    isResubmission: true,
    reviewStatus: "pending_review",
    status: "resubmitted",
    createdAt: now,
    updatedAt: now,
    submittedAt: now,
    resubmittedAt: now,
    clientFallback: true,
  });

  const counterId = `${currentUser.uid.replace(/[^a-zA-Z0-9._-]/g, "_")}__${canonicalAssignmentKey.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  )}`.slice(0, 300);
  await setDoc(
    doc(db, "submissionAttemptCounters", counterId),
    {
      studentId: currentUser.uid,
      canonicalAssignmentKey,
      assignmentId,
      level: normalizeCallableText(payload.level).toUpperCase(),
      attempts: nextAttempt,
      passed: false,
      lastSubmissionId: submissionRef.id,
      lastSubmissionFingerprint: incomingFingerprint,
      lastSubmittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  ).catch((error) => {
    console.warn("Could not update resubmission counter after fallback", error);
  });

  return {
    data: {
      success: true,
      submissionId: submissionRef.id,
      attempt: nextAttempt,
      maxAttempts: MAX_TOTAL_SUBMISSION_ATTEMPTS,
      fallback: true,
    },
  };
};

const httpsCallable = (functionsInstance, name, options) => {
  const callable = firebaseHttpsCallable(functionsInstance, name, options);
  if (name !== "submitAssignmentResubmission") return callable;

  return async (payload) => {
    try {
      return await callable(payload);
    } catch (error) {
      const code = normalizeCallableText(error?.code).toLowerCase();
      if (code !== "internal" && code !== "functions/internal") throw error;

      console.warn(
        "Resubmission callable returned an internal error; using validated Firestore fallback.",
        error
      );
      return persistResubmissionFallback(payload);
    }
  };
};

let messagingServiceWorkerRegistrationPromise = null;
let unregisteringMessagingServiceWorkerPromise = null;

const sendFirebaseConfigToServiceWorker = async (registration) => {
  if (!registration) return null;
  const serviceWorker = registration.active || registration.waiting;

  if (serviceWorker) {
    serviceWorker.postMessage({
      type: "INIT_FIREBASE",
      payload: firebaseConfig,
    });
    return registration;
  }

  const installingWorker = registration.installing;
  if (installingWorker) {
    return new Promise((resolve) => {
      installingWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "activated" && registration.active) {
          registration.active.postMessage({
            type: "INIT_FIREBASE",
            payload: firebaseConfig,
          });
          resolve(registration);
        }
      });
    });
  }

  return registration;
};

const registerMessagingServiceWorker = async () => {
  if (messagingServiceWorkerRegistrationPromise) {
    return messagingServiceWorkerRegistrationPromise;
  }

  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  messagingServiceWorkerRegistrationPromise = navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(() => navigator.serviceWorker.ready)
    .then(sendFirebaseConfigToServiceWorker)
    .catch((error) => {
      console.error("Failed to register messaging service worker", error);
      return null;
    });

  return messagingServiceWorkerRegistrationPromise;
};

const unregisterMessagingServiceWorker = async () => {
  if (unregisteringMessagingServiceWorkerPromise) {
    return unregisteringMessagingServiceWorkerPromise;
  }

  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  unregisteringMessagingServiceWorkerPromise = navigator.serviceWorker
    .getRegistrations()
    .then((registrations) =>
      Promise.all(
        registrations
          .filter((registration) =>
            [registration.active, registration.waiting, registration.installing]
              .filter(Boolean)
              .some((worker) => worker.scriptURL.includes("firebase-messaging-sw.js"))
          )
          .map((registration) => registration.unregister())
      )
    )
    .then(() => {
      messagingServiceWorkerRegistrationPromise = null;
      unregisteringMessagingServiceWorkerPromise = null;
      return null;
    })
    .catch((error) => {
      console.error("Failed to unregister messaging service worker", error);
      unregisteringMessagingServiceWorkerPromise = null;
      return null;
    });

  return unregisteringMessagingServiceWorkerPromise;
};

const isIosDevice = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(platform || userAgent) || (platform === "MacIntel" && navigator.maxTouchPoints > 1);
};

const isRunningStandalone = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator?.standalone === true;
};

const assertFirebaseReady = () => {
  if (!isFirebaseConfigured || !app) {
    throw missingConfigError;
  }
};

const ensureNotificationPermission = async () => {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return "unsupported";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  return Notification.requestPermission();
};

const requestMessagingToken = async (shouldRetry = true) => {
  assertFirebaseReady();
  const supported = await isSupported().catch(() => false);
  if (!supported) {
    if (isIosDevice() && !isRunningStandalone()) {
      throw new Error("On iPhone, add Falowen to your Home Screen and open it from that app icon before enabling push notifications.");
    }
    throw new Error("This browser does not support Firebase Cloud Messaging. Please use Chrome/Edge on Android or the installed Home Screen app on iPhone.");
  }

  const permission = await ensureNotificationPermission();
  if (permission !== "granted") {
    return null;
  }

  const messaging = getMessaging(app);
  const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    throw new Error("Missing REACT_APP_FIREBASE_VAPID_KEY for push notifications.");
  }

  const serviceWorkerRegistration = await registerMessagingServiceWorker();

  if (!serviceWorkerRegistration) {
    throw new Error(
      "Push notifications require a registered service worker. Please use HTTPS or localhost."
    );
  }

  try {
    return await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: serviceWorkerRegistration || undefined,
    });
  } catch (error) {
    const isSubscribeFailed = error?.code === "messaging/token-subscribe-failed";

    if (shouldRetry && isSubscribeFailed) {
      await unregisterMessagingServiceWorker();
      return requestMessagingToken(false);
    }

    throw error;
  }
};

const listenForForegroundMessages = async (callback) => {
  if (!isFirebaseConfigured || !app) return () => {};
  const supported = await isSupported().catch(() => false);
  if (!supported) return () => {};
  const messaging = getMessaging(app);
  return onMessage(messaging, callback);
};

export {
  app,
  auth,
  db,
  isFirebaseConfigured,
  onIdTokenChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  reload,
  GoogleAuthProvider,
  requestMessagingToken,
  listenForForegroundMessages,
  getActionCodeSettings,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp,
  limit,
  addDoc,
  startAfter,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  Timestamp,
  collectionGroup,
  deleteField,
  arrayUnion,
  runTransaction,
  functions,
  httpsCallable,
};
