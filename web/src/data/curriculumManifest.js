const LEVEL_PATTERN = /^(A1|A2|B1|B2|C1|C2)$/;

const normalizeLevel = (value = "") => {
  const token = String(value || "").trim().toUpperCase();
  return LEVEL_PATTERN.test(token) ? token : "";
};

const withCanonicalIdentity = (entry) => {
  const level = normalizeLevel(entry.level);
  const chapter = String(entry.chapter || "").trim();
  const canonicalAssignmentId = `${level}-${chapter}`;
  return {
    ...entry,
    level,
    chapter,
    canonicalAssignmentId,
    assignment_id: canonicalAssignmentId,
    title: entry.title || entry.topic || entry.en || entry.de || "",
    type: entry.type || entry.mode || "",
    progressionEligible: Boolean(entry.progressionEligible ?? entry.assignment),
  };
};

const A1_CURRICULUM_ENTRIES = [
  { level: "A1", assignmentDay: 1, chapter: "0.1", mode: "Lesen & Hören", assignment: true, topic: "Greetings and Asking About Well-being" },
  { level: "A1", assignmentDay: 2, chapter: "0.2", mode: "Lesen & Hören", assignment: true, topic: "German Alphabet" },
  { level: "A1", assignmentDay: 2, chapter: "1.1", mode: "Lesen & Hören", assignment: true, topic: "Personal Pronouns and Verb Conjugation" },
  { level: "A1", assignmentDay: 3, chapter: "1.1", mode: "Schreiben & Sprechen", assignment: false, topic: "Pronouns and Identity Expressions in German" },
  { level: "A1", assignmentDay: 3, chapter: "1.2", mode: "Lesen & Hören", assignment: true, topic: "Personal Pronouns and Verb Conjugation + Introducing Yourself" },
  { level: "A1", assignmentDay: 4, chapter: "2", mode: "Lesen & Hören", assignment: true, topic: "Numbers and Addresses" },
  { level: "A1", assignmentDay: 5, chapter: "1.2", mode: "Schreiben & Sprechen", assignment: false, topic: "Introducing Yourself and Articles" },
  { level: "A1", assignmentDay: 6, chapter: "2.3", mode: "Schreiben & Sprechen", assignment: false, topic: "Family and Hobbies" },
  { level: "A1", assignmentDay: 7, chapter: "3", mode: "Lesen & Hören", assignment: true, topic: "Asking About Prices and Preferences" },
  { level: "A1", assignmentDay: 8, chapter: "4", mode: "Lesen & Hören", assignment: true, topic: "Countries and Languages" },
  { level: "A1", assignmentDay: 9, chapter: "5", mode: "Lesen & Hören", assignment: true, topic: "Nominative and Accusative Cases" },
  { level: "A1", assignmentDay: 10, chapter: "6", mode: "Lesen & Hören", assignment: true, topic: "Objects, Colors and Possessive Articles" },
  { level: "A1", assignmentDay: 10, chapter: "2.4", mode: "Schreiben & Sprechen", assignment: false, topic: "Asking for and Giving Directions" },
  { level: "A1", assignmentDay: 11, chapter: "7", mode: "Lesen & Hören", assignment: true, topic: "Understanding Time" },
  { level: "A1", assignmentDay: 12, chapter: "8", mode: "Lesen & Hören", assignment: true, topic: "The 24 Hour Clock and Dates" },
  { level: "A1", assignmentDay: 13, chapter: "3.5", mode: "Lesen & Hören", assignment: false, topic: "Revision: Numbers, Time and Prices" },
  { level: "A1", assignmentDay: 14, chapter: "3.6", mode: "Schreiben & Sprechen", assignment: false, topic: "Modal Verbs" },
  { level: "A1", assignmentDay: 15, chapter: "4.7", mode: "Schreiben & Sprechen", assignment: false, topic: "Imperatives" },
  { level: "A1", assignmentDay: 16, chapter: "9", mode: "Lesen & Hören", assignment: true, topic: "Food and Negation" },
  { level: "A1", assignmentDay: 16, chapter: "10", mode: "Lesen & Hören", assignment: true, topic: "Food and Daily Life" },
  { level: "A1", assignmentDay: 17, chapter: "11", mode: "Lesen & Hören", assignment: true, topic: "Instructions and Directions" },
  { level: "A1", assignmentDay: 18, chapter: "12.1", mode: "Lesen & Hören", assignment: true, topic: "Two-way Prepositions" },
  { level: "A1", assignmentDay: 18, chapter: "12.2", mode: "Lesen & Hören", assignment: true, topic: "Directions and Movement" },
  { level: "A1", assignmentDay: 19, chapter: "5.9", mode: "Schreiben & Sprechen", assignment: false, topic: "Goethe A1 Speaking Practice" },
  {
    level: "A1",
    assignmentDay: 20,
    chapter: "12.3",
    mode: "Schreiben & Sprechen",
    assignment: true,
    topic: "Introduction to Letter Writing 12.3",
    goal: "Practice how to write both formal and informal letters",
    instruction: "For your first letter, open Letter Writing 12.3 and complete the drag-and-drop template first (fill the missing parts of the letter). Then copy the full letter by yourself and submit it using your normal assignment flow.",
    grammar_topic: "Formal and Informal Letter",
    schreiben_sprechen: {
      video: "https://youtu.be/JtgoO2fmOpU",
      youtube_link: "https://youtu.be/JtgoO2fmOpU",
      workbook_link: "https://www.falowen.app/campus/course/letter-writing-intro-german-a1-day-12-3",
    },
  },
  { level: "A1", assignmentDay: 21, chapter: "13", mode: "Lesen & Hören", assignment: true, topic: "Weather" },
  { level: "A1", assignmentDay: 21, chapter: "6.11", mode: "Schreiben & Sprechen", assignment: false, topic: "Weather Speaking Practice" },
  { level: "A1", assignmentDay: 22, chapter: "14.1", mode: "Lesen & Hören", assignment: true, topic: "Health and Body Parts" },
  { level: "A1", assignmentDay: 22, chapter: "7.12", mode: "Schreiben & Sprechen", assignment: false, topic: "Health Speaking Practice" },
  { level: "A1", assignmentDay: 23, chapter: "14.2", mode: "Lesen & Hören", assignment: false, topic: "Dative and Accusative Verbs" },
  { level: "A1", assignmentDay: 24, chapter: "8.13", mode: "Schreiben & Sprechen", assignment: false, topic: "Schreiben & Sprechen" },
];

const A2_ENTRIES = [
  ["1.1", "Small Talk"],["1.2", "Personen beschreiben"],["1.3", "Dinge und Personen vergleichen"],["2.4", "Wo möchten wir uns treffen?"],["2.5", "Was machst du in deiner Freizeit?"],["3.6", "Möbel und Räume kennenlernen"],["3.7", "Eine Wohnung suchen"],["3.8", "Rezepte und Essen"],["4.9", "Urlaub"],["4.10", "Tourismus und traditionelle Feste"],["4.11", "Unterwegs: Verkehrsmittel vergleichen"],["5.12", "Mein Traumberuf"],["5.13", "Ein Vorstellungsgespräch"],["5.14", "Beruf und Karriere"],["6.15", "Mein Lieblingssport"],["6.16", "Hobbys und Interessen"],["6.17", "Einladung und Vorschläge"],["7.18", "Die Bank Anrufen"],["7.19", "Einkaufen? Wo und wie? (Exercise) 7.19"],["7.20", "Feste und Traditionen"],["8.21", "In der Stadt orientieren"],["8.22", "Wie war dein Wochenende?"],["9.23", "Wie kommst du zur Schule oder zur Arbeit?"],["9.24", "Einen Urlaub planen"],["9.25", "Tagesablauf"],["10.26", "Gefühle beschreiben"],["10.27", "Digitale Kommunikation"],["10.28", "Über die Zukunft sprechen"],
].map(([chapter, de], index) => ({ level: "A2", assignmentDay: index + 1, chapter, mode: "Lesen & Hören", assignment: true, de, topic: de }));

const B1_ENTRIES = [
  ["2.5", "Traumwelt"],["2.6", "Leben in der Stadt oder auf dem Land"],["3.7", "Fast Food vs Hausmannskost"],["3.8", "Alles für die Gesundheit"],["3.9", "Work-Life-Balance im modernen Arbeitsumfeld"],["4.10", "Digitale Auszeit und Selbstfürsorge"],["4.11", "Teamspiele und kooperative Aktivitäten"],["4.12", "Abenteuer in der Natur"],["4.13", "Eine Filmkritik schreiben"],["5.14", "Traditionelles vs digitales Lernen"],["5.15", "Medien und Arbeiten im Homeoffice"],["5.16", "Prüfungsangst und Stressbewältigung"],["5.17", "Wie lernt man am besten?"],["6.18", "Wege zum Wunschberuf"],["6.19", "Das Vorstellungsgespräch"],["6.20", "Wie wird man …? (Ausbildung und Qualifikation)"],["7.21", "Lebensformen heute – Familie und Wohngemeinschaft"],["7.22", "Was ist dir in einer Beziehung wichtig?"],["7.23", "Erstes Date – typische Situationen"],["8.24", "Konsum und Nachhaltigkeit"],["8.25", "Online einkaufen – Rechte und Risiken"],["9.26", "Reiseprobleme und Lösungen"],["10.27", "Umweltfreundlich im Alltag"],["10.28", "Klimafreundlich leben"],
].map(([chapter, de], index) => ({
  level: "B1",
  assignmentDay: index + 1,
  chapter,
  mode: "Lesen & Hören",
  assignment: true,
  de,
  topic: de,
  grammar_topic: index === 0 ? "Präsens und Perfekt" : null,
  schreiben_sprechen:
    index === 0
      ? {
          grammar_link: "/campus/course/lesson/B1/1?view=grammar",
          workbook_link: "/campus/course/lesson/B1/1",
        }
      : index === 1
        ? {
            grammar_link: "/campus/course/lesson/B1/2?view=grammar",
            workbook_link: "/campus/course/lesson/B1/2",
          }
        : { grammar_link: null, workbook_link: null },
}));

const B2_ENTRIES = [
  ["1.1", "Persönliche Identität und Selbstverständnis", "Adjektivdeklination"],
  ["1.2", "Beziehungen und Kommunikation", "Konjunktiv II"],
  ["1.3", "Öffentliches vs. privates Leben", "Passiv"],
  ["1.4", "Beruf und Karriere", "Konjunktiv I"],
  ["1.5", "Bildung und Lernen", "Nominalisierung"],
  ["2.1", "Migration und Integration", "Temporale Nebensätze"],
  ["2.2", "Gesellschaftliche Vielfalt", "Relativsätze mit Präpositionen"],
  ["2.3", "Politik und Engagement", "Finale und kausale Nebensätze"],
  ["2.4", "Technologie und Digitalisierung", "Infinitivkonstruktionen mit zu"],
  ["2.5", "Umwelt und Nachhaltigkeit", "Konjunktiv II Vergangenheit"],
  ["3.1", "Gesundheit und Wohlbefinden", "Reflexive Verben und Pronomen"],
  ["3.2", "Konsum und Medien", "Modalverben im Passiv"],
  ["3.3", "Reisen und Mobilität", "Präpositionen mit Genitiv"],
  ["3.4", "Wohnen und Zusammenleben", "Komparativ und Superlativ"],
  ["3.5", "Kunst und Kultur", "Satzbau und Satzstellung"],
  ["4.1", "Wissenschaft und Forschung", "Partizipialkonstruktionen"],
  ["4.2", "Feste und Traditionen", "Konnektoren für Berichte"],
  ["4.3", "Freizeit und Hobbys", "Pronominaladverbien"],
  ["4.4", "Ernährung und Esskultur", "Indirekte Rede"],
  ["4.5", "Mode und Lebensstil", "Adverbiale Nebensätze"],
  ["5.1", "Werte und Normen", "Negation"],
  ["5.2", "Sprache und Kommunikation", "Nominalstil vs. Verbalstil"],
  ["5.3", "Innovation und Zukunft", "Futur I und II"],
  ["5.4", "Gesellschaftliche Herausforderungen", "Subjekt- und Objektsätze"],
  ["5.5", "Globalisierung und internationale Beziehungen", "Partizipialattribute"],
  ["6.1", "Kreatives Schreiben und Projekte", "Textkohäsion"],
  ["6.2", "Prüfungstraining und Wiederholung", "Prüfungsstrategien"],
  ["6.3", "Abschlusspräsentation und Feedback", "Präsentationssprache"],
].map(([chapter, de, grammar_topic], index) => ({
  level: "B2",
  assignmentDay: index + 1,
  chapter,
  mode: "Lesen & Hören",
  assignment: true,
  de,
  topic: de,
  grammar_topic,
  schreiben_sprechen:
    index === 0
      ? {
          grammar_link: "/campus/course/b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-grammar-notes",
          workbook_link: "/campus/course/b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-workbook",
        }
      : { grammar_link: null, workbook_link: null },
}));

const C1_ENTRIES = [
  ["1.1", "Ziele und Lernweg", "Komplexe Haupt- und Nebensatzverbindungen"],
  ["1.2", "Kultur und Identität", "Relativsätze auf C1-Niveau"],
  ["1.3", "Medien und Informationskompetenz", "Passivvarianten und Funktionsverbgefüge"],
  ["1.4", "Beziehungen und Teamarbeit", "Partizip I/II als Attribute"],
  ["1.5", "Berufliche Entwicklung", "Konditionale und finale Strukturen"],
  ["2.1", "Gesundheit und Lebensstil", "Modalpartikeln im argumentativen Stil"],
  ["2.2", "Reisen und Nachhaltigkeit", "Kausale und konsekutive Verknüpfungen"],
  ["2.3", "Wohnen und Stadtentwicklung", "Nominalisierung und Präpositionalstil"],
  ["2.4", "Konsum und Werbung", "Argumentative Redemittel"],
  ["2.5", "Integration und Gesellschaft", "Konjunktiv I in Bericht und Kommentar"],
  ["3.1", "Engagement und Ehrenamt", "Textverknüpfung mit Konnektoren"],
  ["3.2", "Freizeit und Kultur", "Erweiterte Vergleichsformen"],
  ["3.3", "Mehrsprachigkeit", "Indirekte Rede und Distanzierung"],
  ["3.4", "Innovation und Zukunft", "Futurformen und Prognosesprache"],
  ["3.5", "Bildung und lebenslanges Lernen", "Argumentative Satzmuster"],
  ["4.1", "Technologie im Alltag", "Ursache-Wirkung-Strukturen"],
  ["4.2", "Umwelt und Verantwortung", "Wenn-/falls-Strukturen"],
  ["4.3", "Gesellschaft und Zusammenhalt", "Kontrastive Verknüpfung"],
  ["4.4", "Arbeit der Zukunft", "Formeller Meinungsstil"],
  ["4.5", "Digitale Gesundheit", "Reflexive Verben im Fachkontext"],
  ["5.1", "Migration und Teilhabe", "Zeitliche Abfolgen"],
  ["5.2", "Politik und Mitbestimmung", "Konjunktiv II für Hypothesen"],
  ["5.3", "Freizeit und Work-Life-Balance", "Temporalsätze"],
  ["5.4", "Mobilität und Infrastruktur", "Passiv im formellen Schreiben"],
  ["5.5", "Wissenschaft und Forschung", "Fachsprachliche Textmuster"],
  ["6.1", "Nachhaltiger Konsum", "Genitiv- und Vergleichsstrukturen"],
  ["6.2", "Digitalisierung und Verwaltung", "Formelle Empfehlungssprache"],
  ["6.3", "Review und Transfer", "Zusammenfassung und Schlussfolgerung"],
];

const C1_CURRICULUM_ENTRIES = [
  {
    level: "C1",
    assignmentDay: 0,
    chapter: "Tutorial",
    mode: "Lesen & Hören",
    assignment: false,
    de: "Tutorial",
    topic: "Tutorial",
    schreiben_sprechen: {
      grammar_link: null,
      workbook_link: "/campus/course/c1-day-0-progression-workbook",
    },
  },
  ...C1_ENTRIES.map(([chapter, de, grammar_topic], index) => {
  const assignmentDay = index + 1;
  const schreibenSprechen =
    assignmentDay === 10
      ? {
          grammar_link: "/campus/course/c1-day-10-integration-und-gesellschaft-grammar-notes",
          workbook_link: "/campus/course/c1-day-10-integration-und-gesellschaft-workbook",
        }
      : assignmentDay === 11
        ? {
            grammar_link: "/campus/course/c1-day-11-engagement-und-ehrenamt-grammar-notes",
            workbook_link: "/campus/course/c1-day-11-engagement-und-ehrenamt-workbook",
          }
        : assignmentDay === 12
          ? {
              grammar_link: "/campus/course/c1-day-12-freizeit-und-kultur-grammar-notes",
              workbook_link: "/campus/course/c1-day-12-freizeit-und-kultur-workbook",
            }
          : assignmentDay === 13
            ? {
                grammar_link: "/campus/course/c1-day-13-mehrsprachigkeit-grammar-notes",
                workbook_link: "/campus/course/c1-day-13-mehrsprachigkeit-workbook",
              }
            : assignmentDay === 14
              ? {
                  grammar_link: "/campus/course/c1-day-14-innovation-und-zukunft-grammar-notes",
                  workbook_link: "/campus/course/c1-day-14-innovation-und-zukunft-workbook",
                }
              : assignmentDay === 15
                ? {
                    grammar_link: "/campus/course/c1-day-15-bildung-und-lebenslanges-lernen-grammar-notes",
                    workbook_link: "/campus/course/c1-day-15-bildung-und-lebenslanges-lernen-workbook",
                  }
                : assignmentDay === 16
                  ? {
                      grammar_link: "/campus/course/c1-day-16-technologie-im-alltag-grammar-notes",
                      workbook_link: "/campus/course/c1-day-16-technologie-im-alltag-workbook",
                    }
                  : { grammar_link: null, workbook_link: null };

    return {
      level: "C1",
      assignmentDay,
      chapter,
      mode: "Lesen & Hören",
      assignment: true,
      de,
      topic: de,
      grammar_topic,
      schreiben_sprechen: schreibenSprechen,
    };
  }),
];

const CURRICULUM_ENTRIES = [...A1_CURRICULUM_ENTRIES, ...A2_ENTRIES, ...B1_ENTRIES, ...B2_ENTRIES, ...C1_CURRICULUM_ENTRIES].map(withCanonicalIdentity);

const CURRICULUM_BY_LEVEL = CURRICULUM_ENTRIES.reduce((acc, entry) => {
  if (!acc[entry.level]) acc[entry.level] = [];
  acc[entry.level].push(entry);
  return acc;
}, {});

const getCurriculumEntriesForLevel = (level) => {
  const normalizedLevel = normalizeLevel(level);
  return normalizedLevel ? [...(CURRICULUM_BY_LEVEL[normalizedLevel] || [])] : [];
};

export {
  CURRICULUM_ENTRIES,
  CURRICULUM_BY_LEVEL,
  getCurriculumEntriesForLevel,
  normalizeLevel,
};
