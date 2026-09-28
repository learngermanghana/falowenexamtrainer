import { getGoetheExamOrientationConfig } from "./goetheExamOrientation";

const ADVANCED_GUIDES = Object.freeze({
  B2: {
    level: "B2",
    structureNote: "B2 has four modules. The modules can be taken individually or together.",
    sections: [
      { key: "lesen", name: "Lesen", duration: "65 min", description: "Read longer everyday and public texts and identify main ideas, details, opinions and rules." },
      { key: "hoeren", name: "Hören", duration: "40 min", description: "Understand interviews, talks, conversations and radio-style contributions." },
      { key: "schreiben", name: "Schreiben", duration: "75 min", description: "Write a reasoned forum contribution and a formal message in an appropriate register." },
      { key: "sprechen", name: "Sprechen", duration: "15 min", description: "Give a short presentation, respond to questions and exchange arguments in a discussion." },
    ],
  },
  C1: {
    level: "C1",
    structureNote: "C1 has four modules. The oral module is normally a pair exam.",
    sections: [
      { key: "lesen", name: "Lesen", duration: "65 min", description: "Understand complex articles and contributions, including viewpoints, details and implicit meaning." },
      { key: "hoeren", name: "Hören", duration: "40 min", description: "Understand podcasts, interviews, discussions and presentations on demanding topics." },
      { key: "schreiben", name: "Schreiben", duration: "75 min", description: "Write a well-argued forum contribution and a formal message using an appropriate style." },
      { key: "sprechen", name: "Sprechen", duration: "20 min", description: "Present a complex topic and discuss a controversial issue with a speaking partner." },
    ],
  },
  C2: {
    level: "C2",
    structureNote: "C2 has four modules. The speaking module is an individual oral exam.",
    sections: [
      { key: "lesen", name: "Lesen", duration: "80 min", description: "Understand complex factual texts, commentaries, reports and advertisements, including implicit meaning." },
      { key: "hoeren", name: "Hören", duration: "35 min", description: "Understand reports, natural-speed conversations and expert interviews in detail." },
      { key: "schreiben", name: "Schreiben", duration: "80 min", description: "Reformulate source material and write a structured, stylistically appropriate extended text." },
      { key: "sprechen", name: "Sprechen", duration: "15 min", description: "Present and defend a complex position and respond precisely to counterarguments." },
    ],
  },
});

export const getGoetheExamFileGuide = (level = "") => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const courseGuide = getGoetheExamOrientationConfig(normalizedLevel);
  if (courseGuide) {
    return {
      level: normalizedLevel,
      structureNote:
        normalizedLevel === "B1"
          ? "B1 has four modules that can be taken individually or together."
          : `${normalizedLevel} tests the four skills Lesen, Hören, Schreiben and Sprechen.`,
      sections: courseGuide.sections,
    };
  }

  return ADVANCED_GUIDES[normalizedLevel] || null;
};

export const GOETHE_EXAM_FILE_LEVELS = Object.freeze(["A1", "A2", "B1", "B2", "C1", "C2"]);
