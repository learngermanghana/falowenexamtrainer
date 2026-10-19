const choiceItems = (count, choices = ["A", "B", "C", "D"]) =>
  Array.from({ length: count }, (_, index) => ({
    number: index + 1,
    type: "choice",
    choices,
  }));

const shortItems = (count, placeholder = "Type your answer") =>
  Array.from({ length: count }, (_, index) => ({
    number: index + 1,
    type: "short",
    placeholder,
  }));

const section = (items, options = {}) => ({
  required: options.required !== false,
  items,
  label: options.label || "",
  writing: Boolean(options.writing),
  speaking: Boolean(options.speaking),
  embeddedWriting: Boolean(options.embeddedWriting),
  readOnly: Boolean(options.readOnly),
  inlineAnswers: Boolean(options.inlineAnswers),
  placeholder: options.placeholder || "",
});

const profiles = {
  "A1-0.1": {
    sections: {
      "teil-1": section([], { required: false, readOnly: true, label: "Reading text" }),
      "teil-2": section(choiceItems(10), { label: "Multiple-choice questions" }),
    },
  },
  "A1-0.2": {
    sections: {
      "teil-1": section(choiceItems(7), { label: "Reading and alphabet questions" }),
      "teil-2": section(shortItems(5, "Complete the word"), { label: "Hören" }),
    },
  },
  "A1-1.1": {
    sections: {
      "teil-1": section(choiceItems(4), { label: "Hören" }),
      "teil-2": section([], {
        label: "Schreiben",
        writing: true,
        placeholder: "Write your short self-introduction in German.",
      }),
    },
  },
  "A1-1.2": {
    sections: {
      "teil-1": section(shortItems(9, "Write the correct verb form"), { label: "Lesen" }),
      "teil-2": section([], {
        label: "Schreiben",
        writing: true,
        placeholder: "Write your short self-introduction in German.",
      }),
      "teil-3": section(choiceItems(5), { label: "Hören" }),
    },
  },
  "A1-2": {
    sections: {
      "teil-1": section(shortItems(5, "Copy the number from Elena's information"), { label: "Formular ausfüllen" }),
      "teil-2": section(shortItems(5, "Write the number as a German word"), { label: "Zahlen als Wörter" }),
      "teil-3": section([], { label: "Sprechen: Telefonnummer", speaking: true }),
    },
  },
  // A1-3 is page-owned by the Chapter 3 pilot. Its draft structure remains
  // compatible with the shared serializer and final submission page.
  "A1-4": {
    sections: {
      "teil-1": section(shortItems(5, "Translate into German"), { label: "Translation", inlineAnswers: true }),
      "teil-2": section([], { label: "Sprechen: Sich vorstellen", speaking: true }),
      "teil-3": section(choiceItems(5, ["A", "B", "C"]), { label: "Hören", inlineAnswers: true }),
    },
  },
  "A1-5": {
    sections: {
      "teil-1": section(shortItems(10, "Write the full English meaning"), { label: "Vocabulary review" }),
      "teil-2": section(shortItems(10, "Write der, die or das"), { label: "Nominative case" }),
      "teil-3": section(shortItems(10, "Write den, die or das"), { label: "Accusative case" }),
    },
  },
  "A1-6": {
    sections: {
      "teil-1": section(choiceItems(5, ["Richtig", "Falsch"]), { label: "Lesen" }),
      "teil-2": section(choiceItems(5, ["A", "B", "C"]), { label: "Hören" }),
    },
  },
  "A1-7": {
    sections: {
      "teil-1": section(choiceItems(5, ["Richtig", "Falsch"]), { label: "Lesen" }),
      "teil-2": section([
        ...choiceItems(3, ["Richtig", "Falsch"]),
        { number: 4, type: "choice", choices: ["A", "B", "C"] },
        { number: 5, type: "choice", choices: ["A", "B", "C"] },
      ], { label: "Hören" }),
    },
  },
  "A1-8": {
    sections: {
      "teil-1": section(choiceItems(5), { label: "Lesen" }),
      "teil-2": section([], { label: "Sprechen: Fragen und Antworten", speaking: true }),
    },
  },
  "A1-9": {
    sections: {
      "teil-1": section(choiceItems(10), { label: "Lesen" }),
      "teil-2": section(choiceItems(5), { label: "Hörverstehen" }),
      "teil-3": section([], {
        label: "Schreiben",
        writing: true,
        placeholder: "Schreiben Sie einen kurzen Text über Ihre Essgewohnheiten.",
      }),
    },
  },
  "A1-10": {
    sections: {
      "teil-1": section(choiceItems(10, ["Wahr", "Falsch"]), { label: "Lesen / Schreiben" }),
      "teil-2": section(choiceItems(5, ["A", "B", "C"]), { label: "Hören" }),
    },
  },
  "A1-11": {
    sections: {
      "teil-1": section([], { label: "Sprechen: Bitten und Reagieren", speaking: true }),
      "teil-2": section([
        ...choiceItems(3, ["A", "B"]),
        { number: 4, type: "choice", choices: ["A", "B", "C"] },
        { number: 5, type: "choice", choices: ["A", "B", "C"] },
      ], { label: "Hören" }),
      "teil-3": section(choiceItems(5, ["Richtig", "Falsch"]), { label: "Lesen: Wegbeschreibung" }),
    },
  },
  "A1-12.1": {
    sections: {
      "teil-1": section(choiceItems(5, ["Richtig", "Falsch"]), { label: "Lesen" }),
      "teil-3": section(choiceItems(5, ["Richtig", "Falsch"]), { label: "Hören" }),
    },
  },
  "A1-12.3": {
    sections: {
      "teil-1": section([], { label: "Informal letter", embeddedWriting: true }),
      "teil-2": section([], { label: "Formal letter", embeddedWriting: true }),
    },
  },
  "A1-13": {
    sections: {
      "teil-1": section(choiceItems(5, ["A", "B"]), { label: "Anzeigen" }),
      "teil-2": section(choiceItems(5, ["Richtig", "Falsch"]), { label: "Nachricht" }),
      "teil-3": section([], { label: "Schreiben", embeddedWriting: true }),
      "teil-4": section(choiceItems(6, ["A", "B", "C"]), { label: "Hören" }),
    },
  },
  "A1-14.1": {
    sections: {
      "teil-1": section(choiceItems(5, ["A", "B"]), { label: "Lesen" }),
      "teil-2": section(choiceItems(5, ["Richtig", "Falsch"]), { label: "Lesen: Ihr Termin" }),
      "teil-3": section(choiceItems(6, ["A", "B", "C"]), { label: "Hören" }),
    },
  },
};

export const A1_TUTOR_DRAFT_PROFILES = Object.freeze(profiles);

export const getA1TutorDraftProfile = (assignmentKey = "") =>
  A1_TUTOR_DRAFT_PROFILES[String(assignmentKey || "").trim().toUpperCase()] || null;

const hasValue = (value) => Boolean(String(value || "").trim());

const A1_PHONE_CHECKPOINT_MARKER = "A1_NUMBERS_PHONE_SPEAKING_V1";
const PHONE_SCORE_LINE = /^Score: (?:10(?:\\.0+)?|[0-9](?:\\.\\d+)?)\\/10\\s*$/m;
export const isA1TutorSpeakingAssessment = (sectionKey, assignmentKey, value) => {
  const text = String(value || "");
  const phoneTask = String(assignmentKey || "").trim().toUpperCase() === "A1-2" && sectionKey === "teil-3";
  const marker = phoneTask ? A1_PHONE_CHECKPOINT_MARKER : "GOETHE_A1_TUTOR_SPEAKING_V1";
  const heading = phoneTask ? "Speaking task: phone number" : "Speaking exam part: [123]";
  const headingPattern = new RegExp("^" + heading + "$", "m");
  return text.startsWith(marker + "\\n") && headingPattern.test(text) &&
    PHONE_SCORE_LINE.test(text) && /^Feedback: \\S/m.test(text);
};


export const getA1TutorDraftSectionProgress = ({ assignmentKey = "", sectionKey = "", draft } = {}) => {
  const profile = getA1TutorDraftProfile(assignmentKey);
  const sectionProfile = profile?.sections?.[sectionKey];
  if (!sectionProfile) return null;
  if (sectionProfile.readOnly || sectionProfile.required === false) {
    return { complete: true, completed: 0, total: 0, missing: [] };
  }

  const savedSection = draft?.sections?.[sectionKey] || {};
  if (sectionProfile.writing || sectionProfile.embeddedWriting || sectionProfile.speaking) {
    const complete = sectionProfile.speaking
      ? isA1TutorSpeakingAssessment(sectionKey, assignmentKey, String(savedSection.text || ""))
      : hasValue(savedSection.text);
    return { complete, completed: complete ? 1 : 0, total: 1, missing: complete ? [] : [sectionProfile.speaking ? "speaking assessment" : "writing"] };
  }

  const missing = sectionProfile.items
    .filter(({ number }) => !hasValue(savedSection.answers?.[number]))
    .map(({ number }) => number);
  return {
    complete: missing.length === 0,
    completed: sectionProfile.items.length - missing.length,
    total: sectionProfile.items.length,
    missing,
  };
};

export const getA1TutorDraftProgress = ({ assignmentKey = "", draft } = {}) => {
  const profile = getA1TutorDraftProfile(assignmentKey);
  if (!profile) return null;
  const sections = Object.entries(profile.sections).map(([sectionKey]) => ({
    sectionKey,
    ...getA1TutorDraftSectionProgress({ assignmentKey, sectionKey, draft }),
  }));
  const required = sections.filter((item) => item.total > 0);
  return {
    sections,
    complete: required.every((item) => item.complete),
    completed: required.reduce((sum, item) => sum + item.completed, 0),
    total: required.reduce((sum, item) => sum + item.total, 0),
  };
};

export const validateA1TutorDraftSubmissionSections = ({ assignmentKey = "", sections = new Map() } = {}) => {
  const profile = getA1TutorDraftProfile(assignmentKey);
  if (!profile) return { ok: true, message: "" };

  const missing = [];
  Object.entries(profile.sections).forEach(([sectionKey, sectionProfile]) => {
    if (sectionProfile.readOnly || sectionProfile.required === false) return;
    const serializedLines = sections.get(sectionKey) || [];
    if (sectionProfile.writing || sectionProfile.embeddedWriting || sectionProfile.speaking) {
      const response = serializedLines.join("\\n");
      if (sectionProfile.speaking ? !isA1TutorSpeakingAssessment(sectionKey, assignmentKey, response) : !response.trim()) {
        missing.push(`${sectionKey.replace("teil-", "Teil ")} ${sectionProfile.speaking ? "speaking assessment" : "writing"}`);
      }
      return;
    }

    const answered = new Set();
    serializedLines.forEach((line) => {
      const match = String(line || "").match(/^\s*(\d{1,2})\s*(?:[\).:\-]\s*|\s+)(\S.*)$/);
      if (match && hasValue(match[2])) answered.add(Number(match[1]));
    });
    const missingNumbers = sectionProfile.items
      .map(({ number }) => number)
      .filter((number) => !answered.has(number));
    if (missingNumbers.length) {
      missing.push(`${sectionKey.replace("teil-", "Teil ")} answers ${missingNumbers.join(", ")}`);
    }
  });

  if (!missing.length) return { ok: true, message: "" };
  return {
    ok: false,
    message: `Your workbook is still incomplete. Return to the workbook and finish: ${missing.join("; ")}. Your saved work is still a draft and has not been submitted to your tutor.`,
  };
};

export const __TESTING__ = { choiceItems, shortItems, section, hasValue };

