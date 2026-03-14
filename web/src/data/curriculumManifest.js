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
  { level: "A1", assignmentDay: 3, chapter: "1.1", mode: "Schreiben & Sprechen", assignment: false, topic: "Personal Pronouns and Verb Conjugation + Introducing Yourself" },
  { level: "A1", assignmentDay: 3, chapter: "1.2", mode: "Lesen & Hören", assignment: true, topic: "Introducing Yourself" },
  { level: "A1", assignmentDay: 4, chapter: "2", mode: "Lesen & Hören", assignment: true, topic: "Numbers and Addresses" },
  { level: "A1", assignmentDay: 5, chapter: "1.2", mode: "Schreiben & Sprechen", assignment: false, topic: "Introducing Yourself (Practical Recap)" },
  { level: "A1", assignmentDay: 6, chapter: "2.3", mode: "Schreiben & Sprechen", assignment: false, topic: "Family and Hobbies" },
  { level: "A1", assignmentDay: 7, chapter: "3", mode: "Lesen & Hören", assignment: true, topic: "Asking About Prices and Preferences" },
  { level: "A1", assignmentDay: 8, chapter: "4", mode: "Lesen & Hören", assignment: true, topic: "Countries and Languages" },
  { level: "A1", assignmentDay: 9, chapter: "5", mode: "Lesen & Hören", assignment: true, topic: "Nominative and Accusative Cases" },
  { level: "A1", assignmentDay: 10, chapter: "6", mode: "Lesen & Hören", assignment: true, topic: "Objects, Colors and Possessive Articles" },
  { level: "A1", assignmentDay: 10, chapter: "2.4", mode: "Schreiben & Sprechen", assignment: false, topic: "Asking for and Giving Directions" },
  { level: "A1", assignmentDay: 11, chapter: "7", mode: "Lesen & Hören", assignment: true, topic: "The 12 Hour Clock" },
  { level: "A1", assignmentDay: 12, chapter: "8", mode: "Lesen & Hören", assignment: true, topic: "The 24 Hour Clock and Dates" },
  { level: "A1", assignmentDay: 13, chapter: "3.5", mode: "Lesen & Hören", assignment: false, topic: "Revision: Numbers, Time and Prices" },
  { level: "A1", assignmentDay: 14, chapter: "3.6", mode: "Schreiben & Sprechen", assignment: false, topic: "Modal Verbs" },
  { level: "A1", assignmentDay: 15, chapter: "4.7", mode: "Schreiben & Sprechen", assignment: false, topic: "Imperatives" },
  { level: "A1", assignmentDay: 16, chapter: "9", mode: "Lesen & Hören", assignment: true, topic: "Food and Negation" },
  { level: "A1", assignmentDay: 16, chapter: "10", mode: "Lesen & Hören", assignment: true, topic: "Daily Activities" },
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
      video: "https://youtu.be/2iJQFYGUqRE",
      youtube_link: "https://youtu.be/2iJQFYGUqRE",
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
  ["1.1", "Small Talk", "Small Talk"],["1.2", "Personen beschreiben", "Describing People"],["1.3", "Dinge und Personen vergleichen", "Comparing Things and People"],["2.4", "Wo möchten wir uns treffen?", "Where Shall We Meet?"],["2.5", "Was machst du in deiner Freizeit?", "What Do You Do in Your Free Time?"],["3.6", "Möbel und Räume kennenlernen", "Getting to Know Furniture and Rooms"],["3.7", "Eine Wohnung suchen", "Looking for an Apartment"],["3.8", "Rezepte und Essen", "Recipes and Food"],["4.9", "Urlaub", "Vacation"],["4.10", "Tourismus und traditionelle Feste", "Tourism and Traditional Festivals"],["4.11", "Unterwegs: Verkehrsmittel vergleichen", "On the Move: Comparing Means of Transport"],["5.12", "Mein Traumberuf", "My Dream Job"],["5.13", "Ein Vorstellungsgespräch", "A Job Interview"],["5.14", "Beruf und Karriere", "Career and Profession"],["6.15", "Mein Lieblingssport", "My Favorite Sport"],["6.16", "Hobbys und Interessen", "Hobbies and Interests"],["6.17", "Einladung und Vorschläge", "Invitations and Suggestions"],["7.18", "Im Restaurant bestellen", "Ordering in a Restaurant"],["7.19", "Gesunde Ernährung", "Healthy Nutrition"],["7.20", "Feste und Traditionen", "Festivals and Traditions"],["8.21", "In der Stadt orientieren", "Finding Your Way in the City"],["8.22", "Wie war dein Wochenende?", "How Was Your Weekend?"],["9.23", "Wie kommst du zur Schule oder zur Arbeit?", "How Do You Go to School or Work"],["9.24", "Einen Urlaub planen", "Planning a Vacation"],["9.25", "Tagesablauf", "Daily Routine"],["10.26", "Gefühle beschreiben", "Describing Feelings"],["10.27", "Digitale Kommunikation", "Digital Communication"],["10.28", "Über die Zukunft sprechen", "Talking About the Future"],
].map(([chapter, de, en], index) => ({ level: "A2", assignmentDay: index + 1, chapter, mode: "Lesen & Hören", assignment: true, de, en, topic: en }));

const B1_ENTRIES = [
  ["2.5", "Der Besichtigungstermin", "Apartment Viewing Appointment"],["2.6", "Leben in der Stadt oder auf dem Land", "Living in the City or Countryside"],["3.7", "Fast Food vs Hausmannskost", "Fast Food vs Home Cooking"],["3.8", "Alles für die Gesundheit", "Everything for Health"],["3.9", "Work-Life-Balance im modernen Arbeitsumfeld", "Work-Life Balance in the Modern Workplace"],["4.10", "Digitale Auszeit und Selbstfürsorge", "Digital Detox and Self-care"],["4.11", "Teamspiele und kooperative Aktivitäten", "Team Games and Cooperative Activities"],["4.12", "Abenteuer in der Natur", "Adventures in Nature"],["4.13", "Eine Filmkritik schreiben", "Writing a Film Review"],["5.14", "Traditionelles vs digitales Lernen", "Traditional vs Digital Learning"],["5.15", "Medien und Arbeiten im Homeoffice", "Media and Working from Home"],["5.16", "Prüfungsangst und Stressbewältigung", "Exam Anxiety and Stress Management"],["5.17", "Wie lernt man am besten?", "How Do We Learn Best?"],["6.18", "Wege zum Wunschberuf", "Paths to Your Dream Job"],["6.19", "Das Vorstellungsgespräch", "The Job Interview"],["6.20", "Wie wird man …? (Ausbildung und Qualifikation)", "How Do You Become …? (Training and Qualification)"],["7.21", "Lebensformen heute – Familie und Wohngemeinschaft", "Modern Lifestyles – Family and Shared Living"],["7.22", "Was ist dir in einer Beziehung wichtig?", "What Is Important to You in a Relationship?"],["7.23", "Erstes Date – typische Situationen", "First Date – Typical Situations"],["8.24", "Konsum und Nachhaltigkeit", "Consumption and Sustainability"],["8.25", "Online einkaufen – Rechte und Risiken", "Online Shopping – Rights and Risks"],["9.26", "Reiseprobleme und Lösungen", "Travel Problems and Solutions"],["10.27", "Umweltfreundlich im Alltag", "Environmentally Friendly in Everyday Life"],["10.28", "Klimafreundlich leben", "Living in a Climate-Friendly Way"],
].map(([chapter, de, en], index) => ({ level: "B1", assignmentDay: index + 1, chapter, mode: "Lesen & Hören", assignment: true, de, en, topic: en }));

const CURRICULUM_ENTRIES = [...A1_CURRICULUM_ENTRIES, ...A2_ENTRIES, ...B1_ENTRIES].map(withCanonicalIdentity);

const CURRICULUM_BY_LEVEL = CURRICULUM_ENTRIES.reduce((acc, entry) => {
  if (!acc[entry.level]) acc[entry.level] = [];
  acc[entry.level].push(entry);
  return acc;
}, {});

const getCurriculumEntriesForLevel = (level) => {
  const normalizedLevel = normalizeLevel(level);
  return normalizedLevel ? [...(CURRICULUM_BY_LEVEL[normalizedLevel] || [])] : [];
};

module.exports = {
  CURRICULUM_ENTRIES,
  CURRICULUM_BY_LEVEL,
  getCurriculumEntriesForLevel,
  normalizeLevel,
};
