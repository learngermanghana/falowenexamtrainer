const { z } = require("zod");
const { ALLOWED_LEVELS, getAllowedTeile } = require("./speakingConfig");

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : value;
}

function normalizeBoolean(value, defaultValue = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.trim().toLowerCase();
    if (lower === "true") return true;
    if (lower === "false") return false;
  }
  return defaultValue;
}

function optionalTrimmedString() {
  return z
    .string()
    .optional()
    .transform((val) => {
      const normalized = normalizeString(val);
      return normalized === "" ? undefined : normalized;
    });
}

function teilLevelSchema(defaultTeil, defaultLevel) {
  return z
    .object({
      teil: z
        .string()
        .optional()
        .transform((val) => normalizeString(val) || defaultTeil),
      level: z
        .string()
        .optional()
        .transform((val) => (normalizeString(val) || defaultLevel).toUpperCase()),
    })
    .superRefine((data, ctx) => {
      if (!ALLOWED_LEVELS.includes(data.level)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["level"],
          message: "Invalid level provided. Choose A1, A2, B1, or B2.",
        });
      }

      const allowedTeile = getAllowedTeile(data.level);
      if (data.teil && !allowedTeile.includes(data.teil)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["teil"],
          message:
            "Invalid exam teil provided for the selected level. Choose a supported option.",
        });
      }
    });
}

const speakingAnalyzeSchema = teilLevelSchema(
  "Teil 1 – Vorstellung",
  "A1"
).extend({
  userId: optionalTrimmedString(),
  targetLevel: optionalTrimmedString(),
  interactionMode: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((value) => normalizeBoolean(value, false)),
});

const speakingAnalyzeTextSchema = teilLevelSchema(
  "Teil 1 – Vorstellung",
  "A1"
).extend({
  text: z
    .string({ required_error: "Text is required." })
    .transform((value) => normalizeString(value) || "")
    .refine((value) => value.length > 0, { message: "Text is required." }),
  userId: optionalTrimmedString(),
  targetLevel: optionalTrimmedString(),
});

const speakingInteractionScoreSchema = teilLevelSchema(
  "Teil 1 – Vorstellung",
  "A1"
).extend({
  initialTranscript: z
    .string({ required_error: "Initial transcript is required for interaction scoring." })
    .transform((value) => normalizeString(value) || "")
    .refine((value) => value.length > 0, {
      message: "Initial transcript is required for interaction scoring.",
    }),
  followUpQuestion: z
    .string({ required_error: "Please include the follow-up question that was answered." })
    .transform((value) => normalizeString(value) || "")
    .refine((value) => value.length > 0, {
      message: "Please include the follow-up question that was answered.",
    }),
  userId: optionalTrimmedString(),
  targetLevel: optionalTrimmedString(),
});

function formatValidationIssues(issues = []) {
  return issues.map((issue) => ({
    path: issue.path,
    message: issue.message,
  }));
}

function validationErrorResponse(res, issues) {
  return res.status(400).json({
    error: "Invalid request payload",
    details: formatValidationIssues(issues),
  });
}

function validateSchema(schema, data) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { success: false, errors: formatValidationIssues(parsed.error.issues) };
  }
  return { success: true, data: parsed.data };
}

function validateSpeakingAnalyzeBody(body) {
  return validateSchema(speakingAnalyzeSchema, body);
}

function validateSpeakingAnalyzeTextBody(body) {
  return validateSchema(speakingAnalyzeTextSchema, body);
}

function validateInteractionScoreBody(body) {
  return validateSchema(speakingInteractionScoreSchema, body);
}

module.exports = {
  validationErrorResponse,
  validateSpeakingAnalyzeBody,
  validateSpeakingAnalyzeTextBody,
  validateInteractionScoreBody,
};
