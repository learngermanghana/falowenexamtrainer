// B2 rotating skill cycle aligned with the C2 course structure.
const B2_SKILL_ORDER = Object.freeze(["lesen", "hoeren", "speak", "write"]);

const B2_SKILL_LABELS = Object.freeze({
  lesen: { label: "Lesen", description: "Read" },
  hoeren: { label: "Hören", description: "Listen" },
  speak: { label: "Speak", description: "Sprechen" },
  write: { label: "Write", description: "Schreiben" },
});

export const getB2SkillFocus = (day) => {
  const dayNumber = Number(day);
  if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 28) return null;
  return B2_SKILL_ORDER[(dayNumber - 1) % B2_SKILL_ORDER.length];
};

export const getB2SkillLabel = (day) => {
  const focus = getB2SkillFocus(day);
  return focus ? B2_SKILL_LABELS[focus] : null;
};

export const getB2DayTabs = (day) => {
  const focus = getB2SkillFocus(day);
  const skill = focus ? B2_SKILL_LABELS[focus] : null;
  return [
    { key: "learn", label: "Grammar", description: "Learn" },
    ...(focus && skill ? [{ key: focus, ...skill }] : []),
    { key: "review", label: "Review", description: "Wiederholen" },
    { key: "references", label: "Ref", description: "Notes" },
  ];
};

export const B2_SKILL_DAYS = Object.freeze(
  B2_SKILL_ORDER.reduce((groups, skill) => {
    groups[skill] = Object.freeze(
      Array.from({ length: 28 }, (_, index) => index + 1).filter(
        (day) => getB2SkillFocus(day) === skill,
      ),
    );
    return groups;
  }, {}),
);

export default getB2SkillFocus;
