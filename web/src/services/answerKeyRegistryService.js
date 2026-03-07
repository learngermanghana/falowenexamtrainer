import { collection, db, getDocs } from "../firebase";

const COLLECTION = "answerKeyRegistry";
const SAFE_SOURCE_FIELDS = [
  "assignmentKey",
  "assignmentId",
  "answerUrl",
  "answer_url",
  "format",
  "version",
  "checksum",
  "updatedAt",
  "isActive",
];

const sanitizeAnswerKeySource = (data = {}, docId = "") => {
  const safe = { id: docId };
  SAFE_SOURCE_FIELDS.forEach((field) => {
    if (typeof data[field] !== "undefined") safe[field] = data[field];
  });
  return safe;
};

export const fetchAnswerKeyRegistry = async () => {
  if (!db) return new Map();
  const snapshot = await getDocs(collection(db, COLLECTION));
  const map = new Map();
  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data() || {};
    const key = data.assignmentKey || data.assignmentId || docSnap.id;
    if (!key) return;
    map.set(String(key).toUpperCase(), sanitizeAnswerKeySource(data, docSnap.id));
  });
  return map;
};

export const resolveAnswerKeySource = (registryMap, assignmentKey) => {
  if (!registryMap?.size || !assignmentKey) return null;
  return registryMap.get(String(assignmentKey).toUpperCase()) || null;
};
