import { hasA2B1GrammarNotes } from "./a2B1GrammarAvailability";

export const A2_B1_DEFAULT_SECTION_PROFILE = Object.freeze({
  grammar: false,
  speaking: true,
  writing: true,
  reading: true,
  listening: true,
  part4: "listening",
  part4Submission: "submit",
  references: true,
  submit: true,
});

const A2_B1_SECTION_OVERRIDES = Object.freeze({
  A2: Object.freeze({
    14: Object.freeze({ listening: false, part4: null, part4Submission: "none" }),
    22: Object.freeze({ part4Submission: "self-check" }),
    23: Object.freeze({ part4Submission: "self-check" }),
    24: Object.freeze({ part4Submission: "self-check" }),
    25: Object.freeze({ listening: false, part4: "reading", part4Submission: "submit" }),
    26: Object.freeze({ part4Submission: "self-check" }),
    27: Object.freeze({ part4Submission: "self-check" }),
    28: Object.freeze({ part4Submission: "self-check" }),
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
  tabs.reduce((visibleTabs, tab) => {
    if (tab?.key === "hoeren" && profile.part4 === "reading" && profile.reading !== false) {
      visibleTabs.push({ ...tab, description: "Lesen" });
      return visibleTabs;
    }

    const section = TAB_TO_SECTION[tab?.key];
    if (!section || profile[section] !== false) visibleTabs.push(tab);
    return visibleTabs;
  }, []);

export const __TESTING__ = {
  overrides: A2_B1_SECTION_OVERRIDES,
  tabToSection: TAB_TO_SECTION,
};