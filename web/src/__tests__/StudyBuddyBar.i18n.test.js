import fs from "fs";
import path from "path";
import de from "../i18n/locales/de/translation.json";
import fr from "../i18n/locales/fr/translation.json";
import en from "../i18n/locales/en/translation.json";

const COMPONENT_FILE = path.resolve(__dirname, "../components/StudyBuddyBar.js");
const TRANSLATION_KEY_REGEX = /\bt\(\s*["'`]([^"'`]+)["'`]/g;
const PLACEHOLDER_REGEX = /{{\s*([^}\s]+)\s*}}/g;

const extractTranslationKeys = (content) => {
  const keys = new Set();
  TRANSLATION_KEY_REGEX.lastIndex = 0;
  let match = TRANSLATION_KEY_REGEX.exec(content);
  while (match) {
    keys.add(match[1]);
    match = TRANSLATION_KEY_REGEX.exec(content);
  }
  return keys;
};

const getTranslationValue = (translations, keyPath) => {
  const segments = keyPath.split(".");
  let current = translations;
  for (const segment of segments) {
    if (current == null) return undefined;
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index)) return undefined;
      current = current[index];
    } else {
      if (!Object.prototype.hasOwnProperty.call(current, segment)) return undefined;
      current = current[segment];
    }
  }
  return current;
};

const extractPlaceholders = (value) => {
  if (typeof value !== "string") return [];
  const placeholders = new Set();
  PLACEHOLDER_REGEX.lastIndex = 0;
  let match = PLACEHOLDER_REGEX.exec(value);
  while (match) {
    placeholders.add(match[1]);
    match = PLACEHOLDER_REGEX.exec(value);
  }
  return [...placeholders].sort();
};

describe("StudyBuddyBar i18n keys", () => {
  it("ensures StudyBuddyBar translation keys exist in every locale", () => {
    const contents = fs.readFileSync(COMPONENT_FILE, "utf-8");
    const keys = extractTranslationKeys(contents);
    const missingKeys = [];

    keys.forEach((key) => {
      if (getTranslationValue(de, key) === undefined) missingKeys.push(`de:${key}`);
      if (getTranslationValue(fr, key) === undefined) missingKeys.push(`fr:${key}`);
      if (getTranslationValue(en, key) === undefined) missingKeys.push(`en:${key}`);
    });

    expect(missingKeys).toEqual([]);
  });

  it("keeps placeholder interpolation consistent across locales", () => {
    const contents = fs.readFileSync(COMPONENT_FILE, "utf-8");
    const keys = extractTranslationKeys(contents);
    const placeholderMismatches = [];

    keys.forEach((key) => {
      const values = [getTranslationValue(de, key), getTranslationValue(fr, key), getTranslationValue(en, key)];
      if (!values.every((value) => typeof value === "string")) return;

      const dePlaceholders = extractPlaceholders(values[0]);
      const frPlaceholders = extractPlaceholders(values[1]);
      const enPlaceholders = extractPlaceholders(values[2]);

      if (dePlaceholders.join("|") !== frPlaceholders.join("|")) {
        placeholderMismatches.push(`${key} (de: ${dePlaceholders.join(", ")}, fr: ${frPlaceholders.join(", ")})`);
      }
      if (dePlaceholders.join("|") !== enPlaceholders.join("|")) {
        placeholderMismatches.push(`${key} (de: ${dePlaceholders.join(", ")}, en: ${enPlaceholders.join(", ")})`);
      }
    });

    expect(placeholderMismatches).toEqual([]);
  });
});
