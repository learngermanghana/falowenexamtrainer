const { createChatCompletion } = require("./openaiClient");

const invalidAssessment = (field = "assessment") => Object.assign(new Error("The AI returned an incomplete assessment."), { code: "INVALID_MOCK_ASSESSMENT", validationField: field });
const numericScore = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;

const validateAssessment = (result, partKeys = [], pointCounts = {}, formatPart = "") => {
  if (!result || Array.isArray(result) || !numericScore(result.score)) throw invalidAssessment("score");
  for (const key of partKeys) {
    if (!numericScore(result.parts?.[key]?.score)) throw invalidAssessment(`parts.${key}.score`);
    const flags = result.parts[key].required_points_met;
    if (flags !== undefined && (!Array.isArray(flags) || flags.some((flag) => typeof flag !== "boolean"))) throw invalidAssessment(`parts.${key}.required_points_met`);
    if (pointCounts[key] && (!Array.isArray(flags) || flags.length !== pointCounts[key])) throw invalidAssessment(`parts.${key}.required_points_met`);
  }
  if (formatPart && ["greeting_ok", "closing_ok"].some((key) => typeof result.parts?.[formatPart]?.[key] !== "boolean")) throw invalidAssessment(`parts.${formatPart}.format`);
  return result;
};

const retryable = (error) => ["INVALID_MOCK_ASSESSMENT", "OPENAI_EMPTY_RESPONSE"].includes(error?.code) ||
  [408, 409, 429, 500, 502, 503, 504].includes(Number(error?.status)) ||
  ["APIConnectionError", "APIConnectionTimeoutError"].includes(error?.name);

// Two bounded attempts fit within the 60-second API gateway budget. Retrying
// here charges the application's quota once and never writes a partial grade.
const createMockAssessment = async (messages, options = {}, { partKeys = [], pointCounts = {}, formatPart = "", prepareResult, validateResult } = {}) => {
  let retryField = "";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const requestMessages = prepareResult && retryField ? [...messages, { role: "user", content: `The previous assessment failed validation at ${retryField}. Return the complete JSON again, correcting that field. Quote only exact text from the matching response; do not invent evidence or scores.` }] : messages;
      const reply = await createChatCompletion(requestMessages, {
        ...options,
        max_tokens: Math.max(Number(options.max_tokens) || 0, 2200),
        response_format: { type: "json_object" },
      }, { timeout: 20000, maxRetries: 0 });
      let result;
      try { result = JSON.parse(reply); } catch (_error) { throw invalidAssessment("json"); }
      if (prepareResult) result = prepareResult(result);
      validateAssessment(result, partKeys, pointCounts, formatPart);
      if (validateResult) validateResult(result);
      return JSON.stringify(result);
    } catch (error) {
      if (!retryable(error)) throw error;
      // Never log model output, answers, or student identity.
      console.warn("mock.assessment.retry", { attempt: attempt + 1, code: error?.code || error?.name, status: error?.status, field: error?.validationField || "unspecified" });
      if (error?.code === "INVALID_MOCK_ASSESSMENT") retryField = error.validationField || "assessment";
      if (attempt === 1) {
        throw Object.assign(new Error("AI marking is temporarily unavailable. Keep this page open and retry marking shortly."), {
          code: "MOCK_MARKING_UNAVAILABLE", status: 503,
        });
      }
      if (error?.code !== "INVALID_MOCK_ASSESSMENT") {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }
};

module.exports = { createMockAssessment, validateAssessment };
