import fs from "fs";
import path from "path";
import de from "../i18n/locales/de/translation.json";
import fr from "../i18n/locales/fr/translation.json";

const COMPONENTS_DIR = path.resolve(__dirname, "../components");
const TRANSLATION_KEY_REGEX = /\bt\(\s*["'`]([^"'`]+)["'`]/g;

const getComponentFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return getComponentFiles(fullPath);
    }
    if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".jsx"))) {
      return [fullPath];
    }
    return [];
  });
};

const hasTranslationKey = (translations, keyPath) => {
  const segments = keyPath.split(".");
  let current = translations;
  for (const segment of segments) {
    if (current == null) return false;
    if (Array.isArray(current)) {
      const index = Number(segment);
      if (!Number.isInteger(index)) return false;
      current = current[index];
    } else {
      if (!Object.prototype.hasOwnProperty.call(current, segment)) return false;
      current = current[segment];
    }
  }
  return current !== undefined;
};

const extractTranslationKeys = (content) => {
  const keys = new Set();
  let match = TRANSLATION_KEY_REGEX.exec(content);
  while (match) {
    keys.add(match[1]);
    match = TRANSLATION_KEY_REGEX.exec(content);
  }
  return keys;
};

describe("i18n translation keys", () => {
  it("ensures every translation key used in components exists in all locale files", () => {
    const componentFiles = getComponentFiles(COMPONENTS_DIR);
    const usedKeys = new Set();

    componentFiles.forEach((filePath) => {
      const contents = fs.readFileSync(filePath, "utf-8");
      extractTranslationKeys(contents).forEach((key) => usedKeys.add(key));
    });

    const missingKeys = [];

    usedKeys.forEach((key) => {
      if (!hasTranslationKey(de, key)) {
        missingKeys.push(`de:${key}`);
      }
      if (!hasTranslationKey(fr, key)) {
        missingKeys.push(`fr:${key}`);
      }
    });

    expect(missingKeys).toEqual([]);
  });
});
