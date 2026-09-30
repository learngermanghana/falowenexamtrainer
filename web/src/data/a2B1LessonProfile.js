import { hasA2B1GrammarNotes } from "./a2B1GrammarAvailability";
import { isA2WritingRequired } from "./a2WritingSchedule";
import { isB1WritingRequired } from "./b1WritingSchedule";
import {
  A2_LISTENING_MODES,
  getA2ListeningTask,
} from "./a2ListeningTasks";
import { getB1ListeningTask } from "./b1ListeningTasks";
import { getA2ReadingTask } from "./a2ReadingTasks";
import { getB1ReadingTask } from "./b1ReadingTasks";
import { getTimedAssignmentConfig } from "./timedAssignmentConfig";

export const A2_B1_LESSON_PROFILE_VERSION = 1;

const SUPPORTED_LEVELS = new Set(["A2", "B1"]);

const resolveAssignmentKey = (level, day) => {
  if (level === "A2") {
    const chapter = String(getA2ReadingTask(day)?.chapter || "").trim();
    return chapter ? `A2-${chapter}` : "";
  }
  if (level === "B1") {
    return String(getB1ReadingTask(day)?.assignmentKey || "").trim().toUpperCase();
  }
  return "";
};

const freezeSection = (value) => Object.freeze({ ...value });

const makeBaseSections = ({ level, day, writingRequired }) => ({
  grammar: freezeSection({
    key: "grammar",
    visible: hasA2B1GrammarNotes(level, day),
    mode: "study",
    submitRequired: false,
    partNumber: null,
    label: "Grammar",
  }),
  speaking: freezeSection({
    key: "speaking",
    visible: true,
    mode: "practice",
    submitRequired: false,
    partNumber: 1,
    label: "Sprechen",
  }),
  writing: freezeSection({
    key: "writing",
    visible: Boolean(writingRequired),
    mode: writingRequired ? "graded" : "none",
    submitRequired: Boolean(writingRequired),
    partNumber: 2,
    label: "Schreiben",
  }),
  reading: freezeSection({
    key: "reading",
    visible: true,
    mode: "graded",
    submitRequired: true,
    partNumber: 3,
    label: "Lesen",
  }),
});

const resolveA2Part4 = (day) => {
  const task = getA2ListeningTask(day);
  const mode = task?.mode || A2_LISTENING_MODES.NONE;

  if (!task || mode === A2_LISTENING_MODES.NONE) {
    return freezeSection({
      key: "part4",
      visible: false,
      mode: "none",
      submitRequired: false,
      partNumber: 4,
      contentType: null,
      label: null,
    });
  }

  if (mode === A2_LISTENING_MODES.SELF_CHECK) {
    return freezeSection({
      key: "part4",
      visible: true,
      mode: "self-check",
      submitRequired: false,
      partNumber: 4,
      contentType: "listening",
      label: "Hören",
    });
  }

  return freezeSection({
    key: "part4",
    visible: true,
    mode: "graded",
    submitRequired: true,
    partNumber: 4,
    contentType: "listening",
    label: "Hören",
  });
};

const resolveB1Part4 = (day) => {
  const task = getB1ListeningTask(day);

  if (!task || task.status === "unavailable") {
    return freezeSection({
      key: "part4",
      visible: false,
      mode: "none",
      submitRequired: false,
      partNumber: 4,
      contentType: null,
      label: null,
    });
  }

  if (task.mode === "reading-fallback") {
    return freezeSection({
      key: "part4",
      visible: true,
      mode: "graded",
      sourceMode: "reading-fallback",
      submitRequired: Boolean(task.submitRequired),
      partNumber: 4,
      contentType: "reading",
      label: "Lesen",
    });
  }

  if (task.submitRequired) {
    return freezeSection({
      key: "part4",
      visible: true,
      mode: "graded",
      submitRequired: true,
      partNumber: 4,
      contentType: "listening",
      label: "Hören",
    });
  }

  return freezeSection({
    key: "part4",
    visible: true,
    mode: "self-check",
    submitRequired: false,
    partNumber: 4,
    contentType: "listening",
    label: "Hören",
  });
};

const buildSubmissionParts = (sections) => {
  const candidates = [sections.writing, sections.reading, sections.part4];
  return Object.freeze(
    candidates
      .filter((section) => section?.visible && section?.submitRequired && section?.partNumber)
      .map((section) =>
        Object.freeze({
          partId: `teil${section.partNumber}`,
          number: section.partNumber,
          heading: `TEIL ${section.partNumber}`,
          label: section.label,
          sectionKey: section.key,
        }),
      ),
  );
};

const buildTabs = (sections) =>
  Object.freeze({
    grammar: Boolean(sections.grammar.visible),
    sprechen: Boolean(sections.speaking.visible),
    schreiben: Boolean(sections.writing.visible),
    lesen: Boolean(sections.reading.visible),
    hoeren: Boolean(sections.part4.visible),
    references: true,
    submit: true,
  });

const joinPartLabels = (parts = []) => {
  const labels = parts.map((part) => `Teil ${part.number} · ${part.label}`);
  if (labels.length <= 1) return labels[0] || "";
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
};

const buildSubmissionCopy = ({ sections, requiredSubmissionParts }) => {
  const requiredLabel = joinPartLabels(requiredSubmissionParts);
  const notes = ["Teil 1 · Sprechen is class practice and is not submitted."];

  if (!sections.writing.visible) {
    notes.push("Teil 2 · Schreiben is not required for this lesson.");
  }
  if (!sections.part4.visible) {
    notes.push("This lesson has no Teil 4.");
  } else if (!sections.part4.submitRequired && sections.part4.mode === "self-check") {
    notes.push(`Teil 4 · ${sections.part4.label} is self-check and is not submitted.`);
  }

  return Object.freeze({
    requiredLabel,
    title: requiredLabel ? `Submit ${requiredLabel}.` : "No written submission is required.",
    instructions: requiredLabel
      ? `Enter your final answers for ${requiredLabel} in the submission form below.`
      : "No written answers are required for this lesson.",
    note: notes.join(" "),
  });
};

const TIMED_TAB_BY_SECTION = Object.freeze({
  writing: "schreiben",
  reading: "lesen",
  part4: "hoeren",
});

const buildCanonicalTimer = ({ assignmentKey, requiredSubmissionParts }) => {
  const raw = assignmentKey ? getTimedAssignmentConfig(assignmentKey) : null;
  if (!raw) return null;

  const timedTabs = Object.freeze(
    requiredSubmissionParts
      .map((part) => TIMED_TAB_BY_SECTION[part.sectionKey])
      .filter(Boolean),
  );

  return Object.freeze({
    ...raw,
    timedTabs,
    scope: joinPartLabels(requiredSubmissionParts) || raw.scope,
    source: "lesson-profile",
  });
};

export const getA2B1LessonProfile = (level, day) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const normalizedDay = Number(day);

  if (!SUPPORTED_LEVELS.has(normalizedLevel) || !Number.isInteger(normalizedDay) || normalizedDay < 1 || normalizedDay > 28) {
    return null;
  }

  const writingRequired =
    normalizedLevel === "A2"
      ? isA2WritingRequired(normalizedDay)
      : isB1WritingRequired(normalizedDay);

  const base = makeBaseSections({
    level: normalizedLevel,
    day: normalizedDay,
    writingRequired,
  });
  const part4 =
    normalizedLevel === "A2"
      ? resolveA2Part4(normalizedDay)
      : resolveB1Part4(normalizedDay);

  const sections = Object.freeze({
    ...base,
    part4,
    references: freezeSection({
      key: "references",
      visible: true,
      mode: "reference",
      submitRequired: false,
      partNumber: null,
      label: "References",
    }),
    submit: freezeSection({
      key: "submit",
      visible: true,
      mode: "submit",
      submitRequired: false,
      partNumber: null,
      label: "Submit",
    }),
  });

  const requiredSubmissionParts = buildSubmissionParts(sections);
  const assignmentKey = resolveAssignmentKey(normalizedLevel, normalizedDay);
  const timer = buildCanonicalTimer({ assignmentKey, requiredSubmissionParts });
  const selfCheckParts = Object.freeze(
    Object.values(sections)
      .filter((section) => section?.visible && section?.mode === "self-check")
      .map((section) => section.key),
  );
  const practiceParts = Object.freeze(
    Object.values(sections)
      .filter((section) => section?.visible && section?.mode === "practice")
      .map((section) => section.key),
  );

  return Object.freeze({
    version: A2_B1_LESSON_PROFILE_VERSION,
    level: normalizedLevel,
    day: normalizedDay,
    assignmentKey,
    timer,
    sections,
    tabs: buildTabs(sections),
    requiredSubmissionParts,
    grading: Object.freeze({
      tutorMarkedParts: Object.freeze(requiredSubmissionParts.map((part) => part.partId)),
      selfCheckParts,
      practiceParts,
    }),
    submission: buildSubmissionCopy({ sections, requiredSubmissionParts }),
  });
};

export const getA2B1LessonProfiles = (level) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  if (!SUPPORTED_LEVELS.has(normalizedLevel)) return Object.freeze([]);
  return Object.freeze(
    Array.from({ length: 28 }, (_, index) => getA2B1LessonProfile(normalizedLevel, index + 1)),
  );
};

export default getA2B1LessonProfile;
