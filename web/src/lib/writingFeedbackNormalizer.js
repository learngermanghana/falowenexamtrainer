const empty = {
  score: 0,
  maxScore: 25,
  rubric: {},
  summary: "",
  strengths: [],
  areasToImprove: [],
  mainIssues: [],
  corrections: [],
  improvedVersion: "",
  nextTask: "",
  parseError: false,
};

const MAX_NESTED_DEPTH = 4;
const NESTED_KEYS = [
  "structuredFeedback",
  "analysis",
  "result",
  "content",
  "message",
  "feedback",
];
const FEEDBACK_SHAPE_KEYS = [
  "score",
  "totalScore",
  "total_score",
  "rubric",
  "rubricScores",
  "criteria",
  "summary",
  "feedbackSummary",
  "strengths",
  "areasToImprove",
  "areas_to_improve",
  "mainIssues",
  "main_issues",
  "corrections",
  "improvedVersion",
  "improved_version",
  "nextTask",
  "next_task",
];

const cleanText = (value) =>
  String(value ?? "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

const asArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string" || typeof item === "number") {
          return cleanText(item);
        }
        if (item && typeof item === "object") {
          return cleanText(item.text || item.feedback || item.message || item.label || "");
        }
        return "";
      })
      .filter(Boolean);
  }

  if (typeof value === "string" || typeof value === "number") {
    const cleaned = cleanText(value);
    return cleaned ? [cleaned] : [];
  }

  return [];
};

const parseScorePair = (value) => {
  if (typeof value === "string") {
    const match = value
      .trim()
      .match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if (match) {
      return { score: Number(match[1]), maxScore: Number(match[2]) };
    }
  }
  return null;
};

const num = (value, fallback = 0) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }
  if (value && typeof value === "object") {
    return num(value.score ?? value.value, fallback);
  }
  const pair = parseScorePair(value);
  if (pair) return pair.score;
  const match = String(value ?? "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return fallback;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeRubric = (rubric = {}) =>
  Object.fromEntries(
    Object.entries(rubric || {}).map(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return [
          key,
          {
            score: num(value.score ?? value.value, 0),
            maxScore: num(
              value.maxScore ?? value.max_score ?? value.maximum ?? value.max,
              0,
            ),
            feedback: cleanText(
              value.feedback || value.comment || value.explanation || "",
            ),
          },
        ];
      }
      return [key, { score: num(value, 0), maxScore: 0, feedback: "" }];
    }),
  );

const hasFeedbackShape = (value) =>
  Boolean(
    value &&
      typeof value === "object" &&
      FEEDBACK_SHAPE_KEYS.some((key) => Object.prototype.hasOwnProperty.call(value, key)),
  );

const looksJsonLike = (value) => {
  const text = String(value || "").trim();
  return (
    /^```(?:json)?/i.test(text) ||
    text.startsWith("{") ||
    text.startsWith("[") ||
    (/\{[\s\S]*\}/.test(text) && /"(?:score|rubric|summary|feedback)"\s*:/.test(text))
  );
};

const parseTextCandidate = (input) => {
  const text = String(input || "").trim();
  if (!text) throw new Error("Empty feedback response");

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced ? fenced[1].trim() : text;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    if (looksJsonLike(text)) throw new Error("Malformed JSON feedback");
    return { summary: cleanText(text) };
  }

  try {
    return JSON.parse(source.slice(start, end + 1));
  } catch (error) {
    throw new Error("Malformed JSON feedback");
  }
};

export const extractJsonCandidate = (input, depth = 0) => {
  if (depth > MAX_NESTED_DEPTH) {
    throw new Error("Feedback response is nested too deeply");
  }

  if (typeof input === "string" || typeof input === "number") {
    return parseTextCandidate(input);
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Unsupported feedback response");
  }

  for (const key of NESTED_KEYS) {
    const nested = input[key];
    if (nested == null || nested === input) continue;

    const shouldInspect =
      (typeof nested === "string" && looksJsonLike(nested)) ||
      (nested && typeof nested === "object" && !Array.isArray(nested));

    if (!shouldInspect) continue;

    try {
      const parsedNested = extractJsonCandidate(nested, depth + 1);
      return {
        ...input,
        ...parsedNested,
        feedback:
          parsedNested.feedback || parsedNested.summary ||
          (typeof input.feedback === "string" && !looksJsonLike(input.feedback)
            ? cleanText(input.feedback)
            : ""),
      };
    } catch (error) {
      if (typeof nested === "string" && looksJsonLike(nested)) throw error;
    }
  }

  if (hasFeedbackShape(input)) return input;

  for (const key of NESTED_KEYS) {
    const nested = input[key];
    if (typeof nested === "string" && nested.trim()) {
      return { ...input, summary: cleanText(nested) };
    }
  }

  return input;
};

export const normalizeWritingFeedback = (input) => {
  try {
    const parsed = extractJsonCandidate(input);
    const scorePair = parseScorePair(
      parsed.score ?? parsed.totalScore ?? parsed.total_score,
    );
    const rawRubric =
      parsed.rubric || parsed.rubricScores || parsed.criteria || {};
    const rubric =
      rawRubric && typeof rawRubric === "object" && !Array.isArray(rawRubric)
        ? normalizeRubric(rawRubric)
        : {};
    const overallRubric = rubric.overall || {};
    const areas = asArray(parsed.areasToImprove || parsed.areas_to_improve);
    const issues = asArray(parsed.mainIssues || parsed.main_issues);
    const summary = cleanText(
      parsed.summary ||
        parsed.feedbackSummary ||
        parsed.overallFeedback ||
        parsed.feedback ||
        "",
    );

    return {
      ...empty,
      score:
        scorePair?.score ??
        num(
          parsed.score ??
            parsed.totalScore ??
            parsed.total_score ??
            parsed.overallScore ??
            overallRubric.score,
          0,
        ),
      maxScore:
        (scorePair?.maxScore ??
          num(
            parsed.maxScore ??
              parsed.max_score ??
              parsed.maximumScore ??
              overallRubric.maxScore,
            25,
          )) ||
        25,
      rubric,
      summary,
      strengths: asArray(parsed.strengths || parsed.positiveFeedback),
      areasToImprove: areas.length ? areas : issues,
      mainIssues: issues.length ? issues : areas,
      corrections: Array.isArray(parsed.corrections)
        ? parsed.corrections
            .map((correction) => ({
              wrong: cleanText(correction?.wrong || correction?.original || ""),
              correct: cleanText(
                correction?.correct ||
                  correction?.corrected ||
                  correction?.improved ||
                  correction?.correction ||
                  "",
              ),
              reason: cleanText(
                correction?.reason || correction?.explanation || "",
              ),
            }))
            .filter((correction) => correction.wrong || correction.correct)
        : [],
      improvedVersion: cleanText(
        parsed.improvedVersion ||
          parsed.improved_version ||
          parsed.modelAnswer ||
          "",
      ),
      nextTask: cleanText(
        parsed.nextTask || parsed.next_task || parsed.nextAction || "",
      ),
      parseError: false,
    };
  } catch (error) {
    return {
      ...empty,
      parseError: true,
      summary: "We could not read the AI feedback safely. Please try again.",
    };
  }
};

export default normalizeWritingFeedback;
