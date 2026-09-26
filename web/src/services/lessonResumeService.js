import {
  auth,
  collection,
  db,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "../firebase";

export const LESSON_RESUME_SUBCOLLECTION = "lessonResume";

const clean = (value) => String(value ?? "").trim();
const normalizeLevel = (value) => {
  const match = clean(value).toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match ? match[1] : "";
};
const asBool = (value) => value === true;

const progressSectionDefinitions = [
  ["learn", ["learnDone", "learnNotesDone", "learningDone", "quizDone"]],
  ["lesen", ["lesenDone", "readingDone"]],
  ["hoeren", ["hoerenDone", "listeningDone"]],
  ["speak", ["speakDone", "speakingDone"]],
  ["write", ["writeDone", "writingDone", "aiWritingDone"]],
  ["review", ["reviewDone"]],
  ["finish", ["completed", "finishDone", "finished"]],
];

export const buildLessonResumeDocId = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  const numericDay = Number(day);
  if (!normalizedLevel || !Number.isInteger(numericDay) || numericDay < 0) return "";
  return `${normalizedLevel.toLowerCase()}-day-${numericDay}`;
};

export const buildLessonResumeRoute = ({
  level,
  day,
  chapter = "",
  activeView = "",
  route = "",
  radioDone,
} = {}) => {
  const direct = clean(route);
  if (direct.startsWith("/")) return direct;

  const normalizedLevel = normalizeLevel(level);
  const numericDay = Number(day);
  if (!normalizedLevel || !Number.isInteger(numericDay) || numericDay < 0) return "/campus/course";

  const params = new URLSearchParams();
  if (clean(chapter)) params.set("chapter", clean(chapter));
  if (clean(activeView) && clean(activeView) !== "learn") params.set("view", clean(activeView));
  if (radioDone === true) params.set("radio", "done");
  const search = params.toString();
  return `/campus/course/lesson/${normalizedLevel}/${numericDay}${search ? `?${search}` : ""}`;
};

export const normalizeLessonSections = (progress = {}) => {
  const sections = {};
  progressSectionDefinitions.forEach(([section, aliases]) => {
    const presentAliases = aliases.filter((key) => Object.prototype.hasOwnProperty.call(progress || {}, key));
    if (!presentAliases.length) return;
    sections[section] = presentAliases.some((key) => asBool(progress?.[key]));
  });
  return sections;
};

export const mergeResumeSectionsIntoProgress = (progress = {}, sections = {}) => {
  if (!sections || typeof sections !== "object") return progress;
  const next = { ...(progress || {}) };

  const setTrue = (aliases) => {
    const existing = aliases.find((key) => Object.prototype.hasOwnProperty.call(next, key));
    if (existing) next[existing] = true;
    else next[aliases[0]] = true;
  };

  progressSectionDefinitions.forEach(([section, aliases]) => {
    if (sections[section] === true) setTrue(aliases);
  });

  if (sections.finish === true && !next.completedAt) {
    next.completedAt = new Date().toISOString();
  }

  return next;
};

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value === "number") return value > 100000000000 ? value : value * 1000;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getResumeActivityMillis = (resume = {}) =>
  Math.max(
    toMillis(resume.lastActivityAt),
    toMillis(resume.lastActivityAtClient),
    toMillis(resume.updatedAt),
  );

export const pickLatestLessonResume = (rows = []) =>
  rows
    .filter((row) => normalizeLevel(row?.level) && Number.isInteger(Number(row?.day)))
    .slice()
    .sort((a, b) => getResumeActivityMillis(b) - getResumeActivityMillis(a))[0] || null;

export const recordLessonResumeActivity = async ({
  userId,
  studentCode = "",
  level,
  day,
  chapter = "",
  title = "",
  activeView = "",
  route = "",
  radioDone,
  progress,
  sections,
  completed,
  source = "lesson",
} = {}) => {
  const uid = clean(userId || auth?.currentUser?.uid);
  const normalizedLevel = normalizeLevel(level);
  const numericDay = Number(day);
  const docId = buildLessonResumeDocId(normalizedLevel, numericDay);
  if (!db || !uid || !docId) return { ok: false, reason: "missing" };

  const normalizedSections =
    sections && typeof sections === "object"
      ? Object.fromEntries(Object.entries(sections).filter(([, value]) => typeof value === "boolean"))
      : normalizeLessonSections(progress || {});
  const sectionValues = Object.values(normalizedSections);
  const inferredCompleted =
    typeof completed === "boolean"
      ? completed
      : normalizedSections.finish === true ||
        (sectionValues.length > 0 && normalizedSections.learn === true && sectionValues.every(Boolean));

  const lastRoute = buildLessonResumeRoute({
    level: normalizedLevel,
    day: numericDay,
    chapter,
    activeView,
    route,
    radioDone,
  });
  const nowIso = new Date().toISOString();
  const payload = {
    ownerUid: uid,
    uid,
    userId: uid,
    studentCode: clean(studentCode) || null,
    level: normalizedLevel,
    day: numericDay,
    chapter: clean(chapter) || null,
    title: clean(title) || null,
    activeView: clean(activeView) || "learn",
    lastRoute,
    sections: normalizedSections,
    completed: Boolean(inferredCompleted),
    source: clean(source) || "lesson",
    lastActivityAt: serverTimestamp(),
    lastActivityAtClient: nowIso,
    updatedAt: serverTimestamp(),
  };

  if (radioDone === true) {
    payload.radioDone = true;
    payload.radioCompletedAt = serverTimestamp();
  } else if (radioDone === false) {
    payload.radioDone = false;
  }

  await setDoc(doc(db, "users", uid, LESSON_RESUME_SUBCOLLECTION, docId), payload, { merge: true });
  return { ok: true, docId, resume: { ...payload, lastActivityAtClient: nowIso } };
};

export const subscribeLessonResume = ({
  userId,
  level,
  day,
  onChange,
  onError,
} = {}) => {
  const uid = clean(userId);
  const docId = buildLessonResumeDocId(level, day);
  if (!db || !uid || !docId) {
    onChange?.(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, "users", uid, LESSON_RESUME_SUBCOLLECTION, docId),
    (snapshot) => {
      onChange?.(snapshot.exists() ? { id: snapshot.id, ...(snapshot.data() || {}) } : null);
    },
    (error) => {
      console.warn("Could not load lesson resume state", error);
      onError?.(error);
    },
  );
};

export const loadLatestLessonResume = async ({ userId } = {}) => {
  const uid = clean(userId || auth?.currentUser?.uid);
  if (!db || !uid) return null;
  const snapshot = await getDocs(collection(db, "users", uid, LESSON_RESUME_SUBCOLLECTION));
  return pickLatestLessonResume(
    snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() || {}) })),
  );
};

export const subscribeLatestLessonResume = ({ userId, onChange, onError } = {}) => {
  const uid = clean(userId);
  if (!db || !uid) {
    onChange?.(null);
    return () => {};
  }
  return onSnapshot(
    collection(db, "users", uid, LESSON_RESUME_SUBCOLLECTION),
    (snapshot) => {
      onChange?.(
        pickLatestLessonResume(
          snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() || {}) })),
        ),
      );
    },
    (error) => {
      console.warn("Could not subscribe to latest lesson resume", error);
      onError?.(error);
    },
  );
};
