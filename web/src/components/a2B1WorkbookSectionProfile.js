import { getA2B1LessonProfile } from "../data/a2B1LessonProfile";

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
  const lesson = getA2B1LessonProfile(level, day);
  if (!lesson) return { ...A2_B1_DEFAULT_SECTION_PROFILE };

  const part4 = lesson.sections.part4;
  return {
    grammar: lesson.sections.grammar.visible,
    speaking: lesson.sections.speaking.visible,
    writing: lesson.sections.writing.visible,
    reading: lesson.sections.reading.visible,
    listening: Boolean(part4.visible && part4.contentType === "listening"),
    part4: part4.visible ? part4.contentType : null,
    part4Submission: !part4.visible
      ? "none"
      : part4.submitRequired
        ? "submit"
        : part4.mode === "self-check"
          ? "self-check"
          : "none",
    references: lesson.sections.references.visible,
    submit: lesson.sections.submit.visible,
    lessonProfileVersion: lesson.version,
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
  tabToSection: TAB_TO_SECTION,
};
