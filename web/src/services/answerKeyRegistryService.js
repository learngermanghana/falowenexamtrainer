import { collection, db, getDocs } from "../firebase";

const COLLECTION = "answerKeyRegistry";

export const fetchAnswerKeyRegistry = async () => {
  if (!db) return new Map();
  const snapshot = await getDocs(collection(db, COLLECTION));
  const map = new Map();
  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data() || {};
    const key = data.assignmentKey || data.assignmentId || docSnap.id;
    if (!key) return;
    map.set(String(key).toUpperCase(), { id: docSnap.id, ...data });
  });
  return map;
};

export const resolveAnswerKeySource = (registryMap, assignmentKey) => {
  if (!registryMap?.size || !assignmentKey) return null;
  return registryMap.get(String(assignmentKey).toUpperCase()) || null;
};
