import { db, collection, getDocs } from "../firebase";

export async function loadSwahiliSubmissions(uid) {
  const snapshot = await getDocs(collection(db, "users", uid, "swahiliLessons"));
  return new Map(snapshot.docs.map(entry => [entry.id, entry.data()]));
}
