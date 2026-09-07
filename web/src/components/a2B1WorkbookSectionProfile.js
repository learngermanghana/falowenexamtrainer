import { hasA2B1GrammarNotes } from "./a2B1GrammarAvailability";

export const A2_B1_DEFAULT_SECTION_PROFILE = Object.freeze({
  grammar: false,
  speaking: true,
  writing: true,
  reading: true,
  listening: true,
  references: true,
  submit: true,
});

const A2_B1_SECTION_OVERRIDES = Object.freeze({
  A2: Object.freeze({
    14: Object.freeze({ listening: false }),
  }),
  B1: Object.freeze({}),
});

const TAB_TO_SECTION = Object.freeze({
  grammar: "grammar",
  sprechen: "speaking",
  schreiben: "writing",
  lesen: "reading",
  hoeren: "listening",
  references: "references",
  submit: "submit",
});

export const getA2B1WorkbookSectionProfile = (level, day) => {
  const normalizedLevel = String(level || "").toUpperCase();
  const normalizedDay = Number(day);

  return {
    ...A2_B1_DEFAULT_SECTION_PROFILE,
    grammar: hasA2B1GrammarNotes(normalizedLevel, normalizedDay),
    ...(A2_B1_SECTION_OVERRIDES[normalizedLevel]?.[normalizedDay] || {}),
  };
};

export const filterA2B1WorkbookTabsByProfile = (tabs = [], profile = {}) =>
  tabs.filter((tab) => {
    const section = TAB_TO_SECTION[tab?.key];
    return !section || profile[section] !== false;
  });

export const __TESTING__ = {
  overrides: A2_B1_SECTION_OVERRIDES,
  tabToSection: TAB_TO_SECTION,
};
