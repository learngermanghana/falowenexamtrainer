import { SWAHILI_DICTIONARY_WORDS } from "../data/swahili/vocabulary";
import {
  getSwahiliVocabularyKey, getSwahiliWordId,
  readSavedSwahiliWordIds, setSwahiliWordSaved,
} from "./swahiliSavedVocabulary";

describe("Kiswahili saved vocabulary storage", () => {
  beforeEach(() => window.localStorage.clear());

  test("only teacher-published Day 1 and Day 6 vocabulary is exposed", () => {
    expect(SWAHILI_DICTIONARY_WORDS.map((word) => word.source).every(
      (source) => source === "day-1" || source === "day-6"
    )).toBe(true);
    expect(SWAHILI_DICTIONARY_WORDS.some((word) => word.sw === "mama" && word.en === "mother")).toBe(true);
    expect(SWAHILI_DICTIONARY_WORDS.some((word) => word.sw === "juisi ya embe" && word.en === "mango juice")).toBe(true);
    expect(SWAHILI_DICTIONARY_WORDS.some((word) => word.sw === "kielelezo")).toBe(false);
  });

  test("isolates Kiswahili words by learner UID and never touches German reading phrases", () => {
    const first = SWAHILI_DICTIONARY_WORDS.find((word) => word.sw === "mama");
    const id = getSwahiliWordId(first);
    const germanKey = "falowen:reading-phrases:learner-a:example";
    localStorage.setItem(germanKey, JSON.stringify({ de: "der Hund" }));
    setSwahiliWordSaved("learner-a", id, true);
    expect(readSavedSwahiliWordIds("learner-a")).toEqual([id]);
    expect(readSavedSwahiliWordIds("learner-b")).toEqual([]);
    expect(localStorage.getItem(germanKey)).toContain("der Hund");
    expect(getSwahiliVocabularyKey("learner-a")).not.toBe(getSwahiliVocabularyKey("learner-b"));
    setSwahiliWordSaved("learner-a", id, false);
    expect(readSavedSwahiliWordIds("learner-a")).toEqual([]);
  });

  test("only stores approved stable word IDs, even if local storage is tampered with", () => {
    const validId = getSwahiliWordId(SWAHILI_DICTIONARY_WORDS[0]);
    localStorage.setItem(getSwahiliVocabularyKey("learner"), JSON.stringify(["german:hund", validId, validId, 77]));
    expect(readSavedSwahiliWordIds("learner")).toEqual([validId]);
    expect(() => setSwahiliWordSaved("learner", "german:hund", true)).toThrow();
    expect(() => setSwahiliWordSaved("", validId, true)).toThrow();
  });

  test("gracefully reads corrupted or unavailable device storage", () => {
    localStorage.setItem(getSwahiliVocabularyKey("learner"), "{not-json");
    expect(readSavedSwahiliWordIds("learner")).toEqual([]);
    const broken = { getItem: () => { throw new Error("blocked"); }, setItem: () => {} };
    expect(readSavedSwahiliWordIds("learner", broken)).toEqual([]);
    expect(readSavedSwahiliWordIds(null)).toEqual([]);
  });
});
