import { createContext } from "react";

export const ReadingStudentContext = createContext(null);

const prefix = uid => "falowen:reading-phrases:" + encodeURIComponent(uid) + ":";

export function saveReadingPhrase(uid, phrase) {
  if (!uid || !phrase.day) throw new Error("Missing lesson or student");
  const id = JSON.stringify([phrase.level, phrase.day, phrase.de.toLowerCase(), phrase.sentence]);
  localStorage.setItem(prefix(uid) + id, JSON.stringify(phrase));
}

export function readSavedReadingPhrases(uid) {
  if (!uid) return [];
  const phrases = [];
  for (const key of Object.keys(localStorage)) {
    if (!key.startsWith(prefix(uid))) continue;
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value?.de && value.en && value.sentence && value.day) phrases.push(value);
    } catch { /* Ignore a damaged entry and continue reading the rest. */ }
  }
  return phrases.sort((a, b) => a.level.localeCompare(b.level) || a.day - b.day || a.de.localeCompare(b.de));
}

// A1 notices sometimes split a sentence across bold and plain text nodes.
export function sourceSentence(trigger, fallback, start) {
  const paragraph = trigger?.closest("p");
  let text = fallback;
  if (paragraph) {
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    range.setEndBefore(trigger);
    const cleanText = node => {
      node.querySelectorAll('[role="status"], .reading-glossary-toggle').forEach(el => el.remove());
      return node.textContent;
    };
    start = cleanText(range.cloneContents()).length;
    text = cleanText(paragraph.cloneNode(true));
  }
  if (typeof Intl.Segmenter === "function") {
    const sentence = new Intl.Segmenter("de", { granularity: "sentence" }).segment(text).containing(start);
    if (sentence) return sentence.segment.trim();
  }
  const before = text.slice(0, start).split(/(?<=[.!?])\s+|\n/).pop();
  const after = text.slice(start).split(/(?<=[.!?])\s+|\n/)[0];
  return (before + after).trim();
}
