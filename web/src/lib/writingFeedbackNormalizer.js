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

const asArray = (value) =>
  Array.isArray(value)
    ? value.filter(Boolean).map(String)
    : value
      ? [String(value)]
      : [];

const parseScorePair = (value) => {
  if (typeof value === "string") {
    const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if (match) return { score: Number(match[1]), maxScore: Number(match[2]) };
  }
  return null;
};

const num = (value, fallback = 0) => {
  if (typeof value === "number")
    return Number.isFinite(value) ? value : fallback;
  const pair = parseScorePair(value);
  if (pair) return pair.score;
  const match = String(value ?? "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return fallback;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeRubric = (rubric = {}) =>
  Object.fromEntries(
    Object.entries(rubric || {}).map(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return [
          key,
          {
            score: num(value.score ?? value.value, 0),
            maxScore: num(value.maxScore ?? value.max_score ?? value.max, 0),
            feedback: String(
              value.feedback || value.comment || value.explanation || "",
            ).trim(),
          },
        ];
      }
      return [key, { score: num(value, 0), maxScore: 0, feedback: "" }];
    }),
  );

export const extractJsonCandidate = (input) => {
  if (input && typeof input === "object") return input;
  const text = String(input || "").trim();
  if (!text) throw new Error("Empty feedback response");
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced ? fenced[1] : text;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start)
    throw new Error("No JSON object found");
  return JSON.parse(source.slice(start, end + 1));
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
      rawRubric && typeof rawRubric === "object"
        ? normalizeRubric(rawRubric)
        : {};
    const areas = asArray(parsed.areasToImprove || parsed.areas_to_improve);
    const issues = asArray(parsed.mainIssues || parsed.main_issues);
    return {
      ...empty,
      score:
        scorePair?.score ??
        num(
          parsed.score ??
            parsed.totalScore ??
            parsed.total_score ??
            parsed.overallScore,
          0,
        ),
      maxScore:
        (scorePair?.maxScore ??
          num(
            parsed.maxScore ?? parsed.max_score ?? parsed.maximumScore,
            25,
          )) ||
        25,
      rubric,
      summary: String(
        parsed.summary ||
          parsed.feedbackSummary ||
          parsed.feedback ||
          parsed.overallFeedback ||
          "",
      ).trim(),
      strengths: asArray(parsed.strengths || parsed.positiveFeedback),
      areasToImprove: areas.length ? areas : issues,
      mainIssues: issues.length ? issues : areas,
      corrections: Array.isArray(parsed.corrections)
        ? parsed.corrections
            .map((c) => ({
              wrong: String(c?.wrong || c?.original || "").trim(),
              correct: String(
                c?.correct ||
                  c?.corrected ||
                  c?.improved ||
                  c?.correction ||
                  "",
              ).trim(),
              reason: String(c?.reason || c?.explanation || "").trim(),
            }))
            .filter((c) => c.wrong || c.correct)
        : [],
      improvedVersion: String(
        parsed.improvedVersion ||
          parsed.improved_version ||
          parsed.modelAnswer ||
          "",
      ).trim(),
      nextTask: String(
        parsed.nextTask || parsed.next_task || parsed.nextAction || "",
      ).trim(),
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
