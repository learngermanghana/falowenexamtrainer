import fs from "fs";
import path from "path";
import de from "../i18n/locales/de/translation.json";
import fr from "../i18n/locales/fr/translation.json";

const COMPONENTS_DIR = path.resolve(__dirname, "../components");
const TRANSLATION_KEY_REGEX = /\bt\(\s*["'`]([^"'`]+)["'`]/g;
const PLACEHOLDER_REGEX = /{{\s*([^}\s]+)\s*}}/g;

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
  TRANSLATION_KEY_REGEX.lastIndex = 0;
  let match = TRANSLATION_KEY_REGEX.exec(content);
  while (match) {
    keys.add(match[1]);
    match = TRANSLATION_KEY_REGEX.exec(content);
  }
  return keys;
};

const flattenTranslations = (value, prefix = "") => {
  const entries = {};
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      Object.assign(entries, flattenTranslations(item, prefix ? `${prefix}.${index}` : `${index}`));
    });
    return entries;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, nested]) => {
      Object.assign(entries, flattenTranslations(nested, prefix ? `${prefix}.${key}` : key));
    });
    return entries;
  }
  if (prefix) {
    entries[prefix] = value;
  }
  return entries;
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

const stripPluralSuffix = (key) => key.replace(/_(zero|one|two|few|many|other)$/, "");

const isKeyUsed = (flatKey, usedKeys) => {
  if (usedKeys.has(flatKey)) return true;
  const baseKey = stripPluralSuffix(flatKey);
  if (usedKeys.has(baseKey)) return true;
  for (const usedKey of usedKeys) {
    if (flatKey.startsWith(`${usedKey}.`)) return true;
  }
  return false;
};

const checkPluralForms = (keys) => {
  const baseMap = new Map();
  keys.forEach((key) => {
    const match = key.match(/^(.*)_(zero|one|two|few|many|other)$/);
    if (!match) return;
    const [, base, form] = match;
    const forms = baseMap.get(base) || new Set();
    forms.add(form);
    baseMap.set(base, forms);
  });

  const issues = [];
  baseMap.forEach((forms, base) => {
    if (!forms.has("other")) {
      issues.push(`${base} missing plural form: other`);
    }
    if (!forms.has("one")) {
      issues.push(`${base} missing plural form: one`);
    }
  });

  return issues;
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

  it("warns on unused keys and enforces placeholder/plural consistency", () => {
    const flatDe = flattenTranslations(de);
    const flatFr = flattenTranslations(fr);
    const deKeys = Object.keys(flatDe);
    const frKeys = Object.keys(flatFr);
    const allKeys = new Set([...deKeys, ...frKeys]);

    const componentFiles = getComponentFiles(COMPONENTS_DIR);
    const usedKeys = new Set();
    componentFiles.forEach((filePath) => {
      const contents = fs.readFileSync(filePath, "utf-8");
      extractTranslationKeys(contents).forEach((key) => usedKeys.add(key));
    });

    const unusedKeys = [...allKeys].filter((key) => !isKeyUsed(key, usedKeys));
    if (unusedKeys.length) {
      console.warn(`Unused i18n keys (${unusedKeys.length}):\n${unusedKeys.join("\n")}`);
    }

    const placeholderMismatches = [];
    allKeys.forEach((key) => {
      const dePlaceholders = extractPlaceholders(flatDe[key]);
      const frPlaceholders = extractPlaceholders(flatFr[key]);
      if (dePlaceholders.join("|") !== frPlaceholders.join("|")) {
        placeholderMismatches.push(`${key} (de: ${dePlaceholders.join(", ")}, fr: ${frPlaceholders.join(", ")})`);
      }
    });

    const pluralIssues = [...checkPluralForms(deKeys), ...checkPluralForms(frKeys)];

    expect(placeholderMismatches).toEqual([]);
    expect(pluralIssues).toEqual([]);
  });
});
