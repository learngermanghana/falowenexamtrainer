export const makeReferenceId = () => `ref-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const summarizeReferenceBody = (body = "") => {
  const firstLine = String(body).split("\n").find((line) => line.trim()) || "Reference note";
  const cleaned = firstLine.trim().replace(/\s+/g, " ");
  return cleaned.length > 60 ? `${cleaned.slice(0, 57)}...` : cleaned;
};

export const normalizeReferenceNote = (item) => {
  if (typeof item === "string") {
    const body = item.trim();
    if (!body) return null;
    return {
      id: makeReferenceId(),
      topic: summarizeReferenceBody(body),
      body,
      createdAt: new Date().toISOString(),
    };
  }

  if (!item || typeof item !== "object") return null;

  const body = typeof item.body === "string" ? item.body.trim() : "";
  const topic = typeof item.topic === "string" ? item.topic.trim() : "";
  const fallbackBody = typeof item.note === "string" ? item.note.trim() : "";
  const resolvedBody = body || fallbackBody;
  const resolvedTopic = topic || summarizeReferenceBody(resolvedBody);

  if (!resolvedBody && !resolvedTopic) return null;

  return {
    id: typeof item.id === "string" && item.id ? item.id : makeReferenceId(),
    topic: resolvedTopic || "Untitled reference",
    body: resolvedBody || resolvedTopic,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || null,
  };
};

export const normalizeReferenceNotes = (notes) => {
  if (!Array.isArray(notes)) return [];
  return notes.map(normalizeReferenceNote).filter(Boolean);
};

export const countReferenceWords = (value = "") => {
  const trimmed = String(value).trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};
