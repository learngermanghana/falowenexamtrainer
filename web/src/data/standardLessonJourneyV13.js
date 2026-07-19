import { getStandardWritingConfig as getPreviousWritingConfig } from "./standardLessonJourneyV12";
import c1Day16QuestionWritingBuilder from "./writingQuestionBuilders/c1Day16TechnologieImAlltag";
import { C1_APPROVED_OPINION_ESSAY_TEMPLATE } from "./c1ApprovedOpinionEssayTemplate";

export {
  getStandardBrainMap,
  buildStandardLessonFromCanonical,
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
} from "./standardLessonJourneyV12";

const normalizeLevel = (value = "") => String(value || "").trim().toUpperCase();

const isOpinionWriting = (lesson = {}, config = {}) => {
  const text = [
    lesson.writingTaskType,
    lesson.writingTopic,
    config.taskType,
    config.title,
    config.prompt,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /opinion essay|meinungsbeitrag|stellungnahme|erörterung|eroerterung|diskussionsbeitrag|argument writing|argumentation/.test(text);
};

const isFormalWriting = (lesson = {}, config = {}) => {
  const text = [
    lesson.writingTaskType,
    lesson.writingTopic,
    config.taskType,
    config.title,
    config.prompt,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /formal|formell|formelle|e-mail|email|letter|brief|anfrage|beschwerde|bewerbung|absage|termin/.test(text)
    && !isOpinionWriting(lesson, config);
};

export const getWorkspaceWritingPrompt = (lesson = {}, config = {}) => {
  const level = normalizeLevel(lesson.level || config.level || "German");
  const textType = isOpinionWriting(lesson, config)
    ? "opinion essay"
    : isFormalWriting(lesson, config)
      ? "formal text"
      : "text";

  return `Write one complete ${level} ${textType}. Use the clearly formatted Schreibaufgabe above and address every required point.`;
};

const withClearWorkspacePrompt = (lesson = {}, config = {}) => {
  const level = normalizeLevel(lesson.level || config.level);
  if (!["B2", "C1"].includes(level)) return config;

  const originalPrompt = lesson.writingTopic
    || config.writingTopic
    || config.prompt
    || config.topic
    || "";
  const promptBullets = Array.isArray(lesson.writingPromptBullets)
    ? lesson.writingPromptBullets.filter(Boolean)
    : Array.isArray(lesson.writingBuilder?.structure)
      ? lesson.writingBuilder.structure.filter(Boolean)
      : Array.isArray(config.writingPromptBullets)
        ? config.writingPromptBullets.filter(Boolean)
        : [];
  const useApprovedC1OpinionTemplate = level === "C1" && isOpinionWriting(lesson, config);

  return {
    ...config,
    topic: getWorkspaceWritingPrompt(lesson, config),
    prompt: originalPrompt,
    writingTopic: originalPrompt,
    writingPromptBullets: promptBullets,
    ...(useApprovedC1OpinionTemplate
      ? { opinionTemplate: C1_APPROVED_OPINION_ESSAY_TEMPLATE }
      : {}),
  };
};

export const getStandardWritingConfig = (lesson = {}) => {
  const level = normalizeLevel(lesson.level);
  const day = Number(lesson.day || 0);
  const config = level === "C1" && day === 16
    ? c1Day16QuestionWritingBuilder
    : getPreviousWritingConfig(lesson);

  return withClearWorkspacePrompt(lesson, config);
};
