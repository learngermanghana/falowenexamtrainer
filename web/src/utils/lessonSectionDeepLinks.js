const normalize = (value = "") => String(value || "").trim().toLowerCase();

const COMMON_ALIASES = Object.freeze({
  ref: "references",
  reference: "references",
  notes: "references",
  submit: "submit",
  submission: "submit",
  radio: "radio",
  workbook: "workbook",
  grammar: "grammar",
});

const A2_B1_ALIASES = Object.freeze({
  ...COMMON_ALIASES,
  speak: "sprechen",
  speaking: "sprechen",
  sprechen: "sprechen",
  write: "schreiben",
  writing: "schreiben",
  schreiben: "schreiben",
  read: "lesen",
  reading: "lesen",
  lesen: "lesen",
  listen: "hoeren",
  listening: "hoeren",
  horen: "hoeren",
  "hören": "hoeren",
  hoeren: "hoeren",
  references: "references",
});

const ADVANCED_ALIASES = Object.freeze({
  ...COMMON_ALIASES,
  learn: "learn",
  grammar: "learn",
  speak: "speak",
  speaking: "speak",
  sprechen: "speak",
  write: "write",
  writing: "write",
  schreiben: "write",
  finish: "finish",
  complete: "finish",
  review: "review",
  read: "lesen",
  reading: "lesen",
  lesen: "lesen",
  listen: "hoeren",
  listening: "hoeren",
  horen: "hoeren",
  "hören": "hoeren",
  hoeren: "hoeren",
  references: "references",
});

const A1_ALIASES = Object.freeze({
  ...COMMON_ALIASES,
  overview: "workbook",
  assignment: "workbook",
  "review-submit": "submit",
  "review & submit": "submit",
});

export const normalizeA2B1SectionView = (value = "") =>
  A2_B1_ALIASES[normalize(value)] || "";

export const normalizeAdvancedSectionView = (value = "") =>
  ADVANCED_ALIASES[normalize(value)] || "";

export const normalizeA1SectionView = (value = "") =>
  A1_ALIASES[normalize(value)] || normalize(value);

export const mergeLessonSearchIntoRoute = (
  route = "",
  search = "",
  { dropKeys = [] } = {},
) => {
  const rawRoute = String(route || "").trim();
  if (!rawRoute) return "";

  const parsed = new URL(rawRoute, "https://www.falowen.app");
  const incoming = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  dropKeys.forEach((key) => incoming.delete(key));

  incoming.forEach((value, key) => parsed.searchParams.set(key, value));
  const query = parsed.searchParams.toString();
  return `${parsed.pathname}${query ? `?${query}` : ""}${parsed.hash || ""}`;
};

export const withLessonSectionView = (route = "", view = "") => {
  const normalizedView = String(view || "").trim();
  if (!route || !normalizedView) return route || "";

  const parsed = new URL(route, "https://www.falowen.app");
  parsed.searchParams.set("view", normalizedView);
  const query = parsed.searchParams.toString();
  return `${parsed.pathname}${query ? `?${query}` : ""}${parsed.hash || ""}`;
};

export const replaceLessonView = (search = "", view = "") => {
  const params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  if (view) params.set("view", view);
  else params.delete("view");
  const query = params.toString();
  return query ? `?${query}` : "";
};
