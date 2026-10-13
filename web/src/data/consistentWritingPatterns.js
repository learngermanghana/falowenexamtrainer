// One repeatable A1–B1 writing method. These are learning guides, NEVER
// initial textarea values or model answers inside a timed full mock.
export const LETTER_PATTERNS = Object.freeze({
  informal: {
    title: "Informal letter · friend or family",
    steps: [
      { label: "Anrede", text: "Hallo [Name], / Liebe [Name], / Lieber [Name]," },
      { label: "Einleitung", text: "Wie geht es dir? Ich hoffe, es geht dir gut. Ich schreibe dir, weil [Grund + Verb am Ende]." },
      { label: "Punkt 1", text: "Erstens [Punkt 1]." },
      { label: "Punkt 2", text: "Zweitens [Punkt 2]." },
      { label: "Punkt 3", text: "Außerdem [Punkt 3]." },
      { label: "Schluss", text: "Ich freue mich auf deine Antwort.\nLiebe Grüße\n[Vorname]" },
    ],
  },
  formal: {
    title: "Formal letter · company, school or authority",
    steps: [
      { label: "Anrede", text: "Sehr geehrte Frau [Nachname], / Sehr geehrter Herr [Nachname], / Sehr geehrte Damen und Herren," },
      { label: "Einleitung", text: "Ich hoffe, es geht Ihnen gut. Ich schreibe Ihnen, weil [Grund + Verb am Ende]." },
      { label: "Punkt 1", text: "Erstens [Punkt 1]." },
      { label: "Punkt 2", text: "Zweitens [Punkt 2]." },
      { label: "Punkt 3", text: "Außerdem [Punkt 3]." },
      { label: "Schluss", text: "Ich freue mich auf Ihre Antwort.\nMit freundlichen Grüßen\n[Vor- und Nachname]" },
    ],
  },
});

export const WRITING_LEVEL_GUIDANCE = Object.freeze({
  A1: "Keep it short (often about 20–30 words). The greeting, reason, task points and ending matter most. You do NOT need Erstens/Zweitens/Außerdem if the word limit is short; use simple sentences.",
  A2: "Write separate short paragraphs: opening/reason, task points and closing. Practice Erstens, Zweitens and Außerdem for the three points, when they sound natural. Cover each point explicitly.",
  B1: "Use opening/reason, organized paragraphs for all task points, and a closing. For a letter, Erstens, Zweitens and Außerdem can guide the body. For an opinion essay, use the existing five-part B1 essay structure instead.",
});

export const B1_OPINION_STRUCTURE = Object.freeze([
  {label:"Einleitung", cue:"Heutzutage ist das Thema [Thema] ein sehr wichtiges Thema in unserem Leben."},
  {label:"Eigene Meinung", cue:"Ich bin der Meinung, dass [Meinung], weil [Grund]."},
  {label:"Vorteile + Beispiel", cue:"Einerseits [Vorteil]. Zum Beispiel [Beispiel]."},
  {label:"Nachteile + Beispiel", cue:"Andererseits [Nachteil]. Zum Beispiel [Beispiel]."},
  {label:"Schluss", cue:"Zusammenfassend lässt sich sagen, dass [Fazit]."},
]);

export const getWritingPattern = (style) => LETTER_PATTERNS[style] || null;

// Suggest a format but allow the learner to override it, since many task
// titles do not reliably identify the addressee.
export function suggestWritingStyle(task = "", level = "A2") {
  const t = String(task || "").toLowerCase();
  if (String(level).toUpperCase() === "B1" &&
    /meinung|meinungs|forum|diskussion|vor[ -]?und[ -]?nachteile|kommentar|essay|erörterung|beitrag/.test(t)) return "opinion";
  if (/sehr geehrt|frau |herrn? |firma|amt|unternehmen|beschwerde|reklamation|hotel|vermieter|chef|lehrer|schule|bewerbung|arzt|restaurant|bank/.test(t)) return "formal";
  return "informal";
}

export function getOpinionStructureChecks(text) {
  const value = String(text || "");
  const cues = [
    {label:"Einleitung zum Thema", pattern:/heutzutage|das thema|in unserer gesellschaft|in der heutigen zeit|immer mehr|heute (?:ist|sind|gibt)/i},
    {label:"Eigene Meinung mit Begründung", pattern:/meiner meinung|ich (?:bin der meinung|finde|denke|glaube)|aus meiner sicht|ich vertrete/i},
    {label:"Vorteil oder Argument", pattern:/einerseits|vorteil|dafür spricht|ein argument|positiv/i},
    {label:"Nachteil oder Gegenargument", pattern:/andererseits|nachteil|dagegen spricht|ein problem|allerdings|jedoch/i},
    {label:"Schluss / Fazit", pattern:/zusammenfassend|abschließend|zum schluss|insgesamt|alles in allem|mein fazit/i},
  ];
  return cues.map(({label,pattern})=>({label,found:pattern.test(value)}));
}
