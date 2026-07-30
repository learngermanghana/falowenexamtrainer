export const QUESTION_OF_DAY_LETTER_TEMPLATES = Object.freeze({
  formal: `Sehr geehrte Damen und Herren,
Sehr geehrte Frau [Name] / Sehr geehrter Herr [Name],

ich schreibe Ihnen, weil [Grund].

Ich möchte Ihnen mitteilen, dass [Information 1]. Außerdem [Information 2].

Könnten Sie mir bitte [Bitte oder Frage]?

Vielen Dank im Voraus.

Mit freundlichen Grüßen
[Ihr Name]`,
  informal: `Liebe/r [Name],
Hallo [Name],

wie geht es dir? Ich hoffe, es geht dir gut.

ich schreibe dir, weil [Grund].

Ich möchte dir erzählen, dass [Information 1]. Außerdem [Information 2].

Hast du Zeit? / Was meinst du dazu? / Kannst du mir bitte antworten?

Ich freue mich auf deine Antwort.

Liebe Grüße
[Dein Name]`,
});

const normalizeTemplateText = (value = "") =>
  String(value || "")
    .replace(/\r\n/g, "\n")
    .trim();

export const insertQuestionOfDayLetterTemplate = ({
  currentAnswer = "",
  type = "",
} = {}) => {
  const current = String(currentAnswer || "");
  const template = QUESTION_OF_DAY_LETTER_TEMPLATES[type];
  if (!template) return current;

  const normalizedCurrent = normalizeTemplateText(current);
  const normalizedTemplate = normalizeTemplateText(template);

  if (!normalizedCurrent) return normalizedTemplate;
  if (normalizedCurrent.includes(normalizedTemplate)) return current;

  return `${current.trimEnd()}\n\n${normalizedTemplate}`;
};
