const IMPORTANT_PHRASE_LINE_REGEX = /^(?:[-•\d.)\s]*)?(important phrases?|key phrases?|useful phrases?|wichtige ausdrücke)\s*:\s*(.*)$/i;

export const parseImportantPhraseLine = (line = "") => {
  const text = String(line || "");
  const matches = text.match(IMPORTANT_PHRASE_LINE_REGEX);
  if (!matches) return null;

  const label = matches[1];
  const phrases = String(matches[2] || "")
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    label,
    phrases,
  };
};
