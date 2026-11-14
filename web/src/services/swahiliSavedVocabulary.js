import { SWAHILI_DICTIONARY_WORDS } from "../data/swahili/vocabulary";

// Store stable IDs, never duplicate a translated curriculum or student records.
// German reading-phrase storage uses a distinct key and is never read or written.
export const getSwahiliVocabularyKey = (uid) =>
  uid ? `falowen:swahili:vocabulary:v1:${encodeURIComponent(String(uid))}` : null;

export const getSwahiliWordId = (word) =>
  `${word.source}:${String(word.sw || "").normalize("NFC").trim().toLocaleLowerCase("sw")}`;

const approvedWordIds = new Set(SWAHILI_DICTIONARY_WORDS.map(getSwahiliWordId));

const clientStorage = () => {
  try { return typeof window === "undefined" ? null : window.localStorage; }
  catch { return null; }
};

export const readSavedSwahiliWordIds = (uid, storage = clientStorage()) => {
  const key = getSwahiliVocabularyKey(uid);
  if (!key || !storage) return [];
  try {
    const data = JSON.parse(storage.getItem(key) || "[]");
    if (!Array.isArray(data)) return [];
    return Array.from(new Set(data.filter((id) => typeof id === "string" && approvedWordIds.has(id))));
  } catch {
    return []; // Corrupt or inaccessible device storage must not block the course.
  }
};

export const setSwahiliWordSaved = (uid, wordId, saved, storage = clientStorage()) => {
  const key = getSwahiliVocabularyKey(uid);
  if (!key || !storage || !approvedWordIds.has(wordId)) throw new Error("Invalid learner or vocabulary item");
  const next = new Set(readSavedSwahiliWordIds(uid, storage));
  if (saved) next.add(wordId);
  else next.delete(wordId);
  storage.setItem(key, JSON.stringify([...next]));
  return [...next];
};
