import { vocabLists } from "../data/vocabLists";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

const fetchJson = async (path) => {
  const response = await fetch(`${backendUrl}/api${path}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request to ${path} failed (${response.status})`);
  }
  return response.json();
};

const normalizeString = (value, fallback = "") => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
};

export const fetchVocabEntries = async () => {
  try {
    const data = await fetchJson("/vocab");
    const rows = Array.isArray(data?.rows) ? data.rows : [];

    const normalized = rows
      .map((row, index) => {
        const topic =
          normalizeString(
            row.topic || row.theme || row.category || row.set || row.list,
            "Allgemein"
          ) || "Allgemein";
        const phrase =
          normalizeString(
            row.phrase ||
              row.term ||
              row.vocab ||
              row.german ||
              row.de ||
              row.text ||
              row.prompt,
            ""
          ) || normalizeString(row.item, "");
        const translation = normalizeString(
          row.translation || row.english || row.en || row.meaning || row.hint,
          ""
        );

        if (!phrase) return null;

        return {
          id: normalizeString(row.id, `vocab-${index}`),
          topic,
          phrase,
          translation,
        };
      })
      .filter(Boolean);

    if (normalized.length === 0) {
      return vocabLists.flatMap((block, idx) =>
        block.items.map((item, itemIdx) => ({
          id: `fallback-${idx}-${itemIdx}`,
          topic: block.title,
          phrase: item,
          translation: "",
        }))
      );
    }

    return normalized;
  } catch (error) {
    console.error("Failed to fetch vocab entries", error);
    return vocabLists.flatMap((block, idx) =>
      block.items.map((item, itemIdx) => ({
        id: `fallback-${idx}-${itemIdx}`,
        topic: block.title,
        phrase: item,
        translation: "",
      }))
    );
  }
};

export const fetchExamPrompts = async () => {
  try {
    const data = await fetchJson("/exams");
    const rows = Array.isArray(data?.rows) ? data.rows : [];

    return rows
      .map((row, index) => {
        const level = normalizeString(row.level || row.niveau, "").toUpperCase();
        const teil = normalizeString(
          row.teil || row.section || row.task || row.teil_label || row.part,
          ""
        );
        const topic =
          normalizeString(row.topic || row.thema || row.title || row.category, "") ||
          "Prüfungsthema";
        const prompt =
          normalizeString(
            row.prompt ||
              row.question ||
              row.text ||
              row.aufgabe ||
              row.scenario ||
              row.keyword,
            ""
          );
        const hint = normalizeString(
          row.hint || row.tip || row.translation || row.english,
          ""
        );

        if (!prompt && !topic) return null;

        return {
          id: normalizeString(row.id, `exam-${index}`),
          level,
          teil,
          topic,
          prompt: prompt || topic,
          hint,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("Failed to fetch exam prompts", error);
    return [];
  }
};
