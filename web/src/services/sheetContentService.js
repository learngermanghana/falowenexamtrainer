const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

const API_BASE = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");

const toText = (v) => (v == null ? "" : String(v).trim());

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

export async function fetchVocabEntries() {
  const url = `${API_BASE}/api/vocab`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Failed to load vocab (${res.status}): ${body.slice(0, 200)}`);
  }

  const rows = await res.json();

  return (Array.isArray(rows) ? rows : []).map((row, index) => {
    const level = toText(row.level);
    const german = toText(row.german);
    const english = toText(row.english);

    const id = toText(row.id) || `${level || "vocab"}-${index + 1}-${german}`;

    return {
      id,
      topic: level || "Allgemein",
      phrase: german,
      translation: english,
      audioNormal: toText(row.audio_normal),
      audioSlow: toText(row.audio_slow),
    };
  });
}

export const fetchExamPrompts = async () => {
  try {
    const data = await fetchJson("/exams");
    const rows = Array.isArray(data?.rows) ? data.rows : [];

    return rows
      .map((row, index) => {
        const level = normalizeString(row.level || row.niveau, "").toUpperCase();
        const teil = normalizeString(
          row.teil || row.section || row.task || row.teil_label || row.part,
          "",
        );
        const topicPrompt = normalizeString(
          row.topic_prompt || row.prompt || row.topic || row.thema || row.title,
          "",
        );
        const keyword = normalizeString(
          row.keyword_subtopic || row.keyword || row.category,
          "",
        );
        const topic = topicPrompt || keyword || "Prüfungsthema";
        const prompt = topicPrompt || keyword;
        const hint = normalizeString(
          row.hint || row.tip || row.translation || row.english,
          "",
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
