const ROUTE_ENTRIES = [
  [1, "1.1", "/campus/course/a2-starter-conjunctions-day-1"],
  [2, "1.2", "/campus/course/personen-beschreiben-1-2-grammar-notes"],
  [3, "1.3", "/campus/course/dinge-und-personen-vergleichen-1-3-grammar-notes"],
  [4, "2.4", "/campus/course/wo-moechten-wir-uns-treffen-2-4-grammar-notes"],
  [5, "2.5", "/campus/course/was-machst-du-in-deiner-freizeit-2-5-grammar-notes"],
  [6, "3.6", "/campus/course/moebel-und-raeume-3-6-grammar-notes"],
  [7, "3.7", "/campus/course/relativsaetze-die-der-das-wohnung-suchen-3-7-notes"],
  [8, "3.8", "/campus/course/imperativ-rezepte-und-essen-3-8-grammar-notes"],
  [9, "4.9", "/campus/course/perfekt-urlaub-4-9-grammar-notes"],
  [10, "4.10", "/campus/course/praeteritum-tourismus-und-traditionelle-feste-4-10-grammar-notes"],
  [11, "4.11", "/campus/course/unterwegs-verkehrsmittel-vergleichen-4-11-grammar-notes"],
  [12, "5.12", "/campus/course/mein-traumberuf-5-12-grammar-notes"],
  [13, "5.13", "/campus/course/modalverben-im-praeteritum-vorstellungsgespraech-5-13-grammar-notes"],
  [14, "5.14", "/campus/course/beruf-und-karriere-5-14-um-zu-grammar-notes"],
  [15, "6.15", "/campus/course/mein-lieblingssport-6-15-seit-dativ-praesens-grammar-notes"],
  [16, "6.16", "/campus/course/wohlbefinden-und-entspannung-6-16-reflexive-verben-grammar-notes"],
  [17, "6.17", "/campus/course/modal-verbs-day-14-3-6"],
  [18, "7.18", "/campus/course/die-bank-anrufen-7-18-hoefliche-fragen-und-bitten-grammar-notes"],
  [19, "7.19", "/campus/course/einkaufen-wo-und-wie-7-19-oder-denn-grammar-notes"],
  [20, "7.20", "/campus/course/typische-reklamationssituationen-7-20-hoefliche-bitten-und-begruendungen-grammar-notes"],
  [21, "8.21", "/campus/course/ein-wochenende-planen-8-21-wenn-ob-falls-grammar-notes"],
  [22, "8.22", "/campus/course/die-woche-planung-8-22-praesens-future-time-phrases-modalverben-grammar-notes"],
  [23, "9.23", "/campus/course/wie-kommst-du-zur-schule-zur-arbeit-9-23-praepositionen-mit-verkehrsmitteln-grammar-notes"],
  [24, "9.24", "/campus/course/einen-urlaub-planen-9-24-final-a2-grammar-notes"],
  [28, "10.28", "/campus/course/ueber-die-zukunft-sprechen-10-28-final-a2-grammar-notes"],
];

export const A2_GRAMMAR_ROUTE_ENTRIES = Object.freeze(
  ROUTE_ENTRIES.map(([day, chapter, route]) => Object.freeze({ day, chapter, route }))
);

const ROUTE_BY_DAY = new Map(A2_GRAMMAR_ROUTE_ENTRIES.map((entry) => [Number(entry.day), entry.route]));
const ROUTE_BY_CHAPTER = new Map(
  A2_GRAMMAR_ROUTE_ENTRIES.map((entry) => [String(entry.chapter).trim(), entry.route])
);

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const normalizeChapter = (value = "") => String(value || "").trim();

export const getA2GrammarRoute = ({ day, chapter } = {}) => {
  const chapterRoute = ROUTE_BY_CHAPTER.get(normalizeChapter(chapter));
  if (chapterRoute) return chapterRoute;
  return ROUTE_BY_DAY.get(Number(day)) || "";
};

export const applyA2GrammarRouteToLesson = (lesson, day = lesson?.day) => {
  if (!lesson || typeof lesson !== "object") return lesson;

  const resolvedDay = Number(day ?? lesson.day ?? lesson.assignmentDay);
  const rootRoute = getA2GrammarRoute({ day: resolvedDay, chapter: lesson.chapter });
  if (rootRoute) {
    lesson.grammarbook_link = rootRoute;
    lesson.grammar_link = rootRoute;
    lesson.grammarPage = rootRoute;
  }

  const resources = [
    ...toArray(lesson.lesen_hören),
    ...toArray(lesson.schreiben_sprechen),
  ];

  resources.forEach((resource) => {
    if (!resource || typeof resource !== "object") return;
    const route = getA2GrammarRoute({
      day: resolvedDay,
      chapter: resource.chapter || lesson.chapter,
    });
    if (!route) return;
    resource.grammarbook_link = route;
    resource.grammar_link = route;
    resource.grammarPage = route;
  });

  return lesson;
};

export const hasOnlyInternalA2GrammarRoutes = () =>
  A2_GRAMMAR_ROUTE_ENTRIES.every(({ route }) => route.startsWith("/campus/course/"));
