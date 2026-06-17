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

const asArray = (value) => Array.isArray(value) ? value.filter(Boolean).map(String) : value ? [String(value)] : [];
const num = (value, fallback = 0) => {
  const n = Number(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : fallback;
};

export const extractJsonCandidate = (input) => {
  if (input && typeof input === "object") return input;
  const text = String(input || "").trim();
  if (!text) throw new Error("Empty feedback response");
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced ? fenced[1] : text;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("No JSON object found");
  return JSON.parse(source.slice(start, end + 1));
};

export const normalizeWritingFeedback = (input) => {
  try {
    const parsed = extractJsonCandidate(input);
    const rubric = parsed.rubric && typeof parsed.rubric === "object" ? parsed.rubric : {};
    const areas = asArray(parsed.areasToImprove || parsed.areas_to_improve || parsed.mainIssues || parsed.main_issues);
    return {
      ...empty,
      score: num(parsed.score ?? parsed.totalScore ?? rubric.overall, 0),
      maxScore: num(parsed.maxScore ?? parsed.max_score, 25) || 25,
      rubric,
      summary: String(parsed.summary || parsed.feedbackSummary || parsed.feedback || "").trim(),
      strengths: asArray(parsed.strengths),
      areasToImprove: areas,
      mainIssues: asArray(parsed.mainIssues || parsed.main_issues || areas),
      corrections: Array.isArray(parsed.corrections) ? parsed.corrections.map((c) => ({
        wrong: String(c?.wrong || c?.original || "").trim(),
        correct: String(c?.correct || c?.improved || c?.correction || "").trim(),
        reason: String(c?.reason || c?.explanation || "").trim(),
      })).filter((c) => c.wrong || c.correct) : [],
      improvedVersion: String(parsed.improvedVersion || parsed.improved_version || "").trim(),
      nextTask: String(parsed.nextTask || parsed.next_task || parsed.nextAction || "").trim(),
      parseError: false,
    };
  } catch (error) {
    return { ...empty, parseError: true, summary: "We could not read the AI feedback safely. Please try again." };
  }
};

export default normalizeWritingFeedback;
