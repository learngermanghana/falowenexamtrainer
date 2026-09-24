// C2 rotating skill cycle
const C2_SKILL_ORDER = Object.freeze(["lesen", "hoeren", "speak", "write"]);

const C2_SKILL_LABELS = Object.freeze({
  lesen: { label: "Lesen", description: "Read" },
  hoeren: { label: "Hören", description: "Listen" },
  speak: { label: "Speak", description: "Sprechen" },
  write: { label: "Write", description: "Schreiben" },
});

export const getC2SkillFocus = (day) => {
  const dayNumber = Number(day);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 28) return null;
  return C2_SKILL_ORDER[(dayNumber - 1) % C2_SKILL_ORDER.length];
};

export const getC2SkillLabel = (day) => {
  const focus = getC2SkillFocus(day);
  return focus ? C2_SKILL_LABELS[focus] : null;
};

export const getC2DayTabs = (day) => {
  const focus = getC2SkillFocus(day);
  const skill = focus ? C2_SKILL_LABELS[focus] : null;
  return [
    { key: "learn", label: "Grammar", description: "Learn" },
    ...(focus && skill ? [{ key: focus, ...skill }] : []),
    { key: "review", label: "Review", description: "Wiederholen" },
    { key: "references", label: "Ref", description: "Notes" },
  ];
};


export const getC2SpeakingSupport = (day) => {
  const numericDay = Number(day);
  if ([3, 7].includes(numericDay)) return "full";
  if ([11, 15, 19].includes(numericDay)) return "keywords";
  if ([23, 27].includes(numericDay)) return "exam";
  return "full";
};

export const getC2SpeakingSupportNote = (day) => {
  const mode = getC2SpeakingSupport(day);
  if (mode === "full") return "Early speaking stage: sentence starters and idea support are available.";
  if (mode === "keywords") return "Middle speaking stage: work mainly from keywords and guiding questions.";
  return "Late speaking stage: start in exam mode and build the argument independently.";
};

export const C2_SKILL_DAYS = Object.freeze(
  C2_SKILL_ORDER.reduce((groups, skill) => {
    groups[skill] = Object.freeze(
      Array.from({ length: 28 }, (_, index) => index + 1).filter(
        (day) => getC2SkillFocus(day) === skill,
      ),
    );
    return groups;
  }, {}),
);

export default getC2SkillFocus;
