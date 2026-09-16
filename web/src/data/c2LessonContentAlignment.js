import { C2_COURSE_MASTERY } from "./c2CourseMastery";

// C2 now has one canonical content source. Keep this legacy export empty only so
// older imports fail safely while the old supplementary topic data is removed.
const C2_COLLOCATION_SUPPLEMENTS = Object.freeze({});
const C2_CANONICAL_MASTERY = C2_COURSE_MASTERY;

const C2_GRAMMAR_RULES = Object.freeze({
  1:["Registerwechsel bedeutet, dieselbe Kernaussage an Adressat, Situation und Textsorte anzupassen.","Die propositionale Aussage bleibt stabil; verändert werden Wortwahl, Grad der Explizitheit und wertende Marker.","Gehobenes Deutsch ist nicht automatisch besser: unnötig lange oder archaische Formulierungen wirken schnell künstlich."],
  2:["Thema–Rhema steuert, welche Information als bekannt, neu oder besonders wichtig erscheint.","Im Hauptsatz bleibt das finite Verb auf Position 2; das Vorfeld kann unterschiedlich besetzt werden, um den Fokus zu verändern.","Ein Element sollte nur dann ins Vorfeld rücken, wenn die dadurch entstehende Schwerpunktsetzung inhaltlich beabsichtigt ist."],
  3:["Nominalstil verdichtet wissenschaftliche Information; Verbalstil macht Handlungen und Akteure häufig transparenter.","Bei der Nominalisierung müssen logische Rollen durch Genitiv oder Präpositionalergänzungen erhalten bleiben; beim Verbalisieren braucht der Satz wieder Subjekt und finites Verb.","Mehrere abstrakte Nomen hintereinander erschweren das Verständnis und sollten in klare Verbalstrukturen aufgelöst werden."],
  4:["Indirekte Rede kennzeichnet fremde Aussagen und schafft Distanz zur Quelle.","Konjunktiv I steht typischerweise in der wiedergegebenen Aussage; bei formaler Gleichheit mit dem Indikativ kann Konjunktiv II ausweichen.","Nach dem Entfernen der Quellenmarkierung darf eine umstrittene Behauptung nicht plötzlich als gesicherte Tatsache erscheinen."],
  5:["Subjektive Modalverben markieren Hörensagen, Selbstaussage oder unterschiedliche Wahrscheinlichkeitsgrade.","Für Vergangenheitsbezug: soll/will/dürfte/muss + Partizip II + haben/sein.","wollen + Infinitiv Perfekt bedeutet in diesem Gebrauch nicht Absicht, sondern kennzeichnet, was jemand über sich selbst behauptet."],
  6:["Kausale Ausdrücke müssen zur Stärke der Evidenz passen.","resultieren aus blickt auf eine Ursache zurück; führen zu und zur Folge haben zeigen auf eine Folge.","Eine bloße Korrelation darf nicht ohne zusätzliche Evidenz mit verursachen als gesicherte Kausalität dargestellt werden."],
  7:["Funktionsverbgefüge sind feste idiomatische Einheiten, die formelle Aussagen verdichten können.","Lernen Sie Nomen, Verb, Artikel und nötige Präposition gemeinsam: Einfluss nehmen auf, Maßnahmen ergreifen, in Betracht ziehen.","Wörtliche Übersetzungen wie Einfluss machen sind trotz verständlicher Einzelwörter nicht idiomatisch."],
  8:["Partizipialattribute verdichten technische Zusatzinformationen vor einem Nomen.","Partizip I oder II steht mit Adjektivendung vor dem Bezugsnomen; bei zu langen Gruppen ist ein Relativsatz meist lesbarer.","Mehrere lange Attribute vor demselben Nomen können den Satzkern verdecken und sollten aufgelöst werden."],
  9:["Passiversatzformen unterscheiden Möglichkeit, Notwendigkeit und Eigenschaft.","sich lassen + Infinitiv = Möglichkeit; sein + zu + Infinitiv = häufig Notwendigkeit; -bar bildet meist eine Eigenschaft der Machbarkeit.","Die Ersatzformen sind nicht austauschbar, weil sie unterschiedliche Modalität ausdrücken."],
  10:["Subjektive Modalität hilft, medizinische Aussagen nach Evidenzgrad abzustufen.","Für Rückschlüsse auf Vergangenes stehen könnte/dürfte/muss + Partizip II + haben/sein.","muss darf nur bei sehr starker Schlussfolgerung verwendet werden; plausible Evidenz rechtfertigt häufig nur dürfte oder könnte."],
  11:["Konzessive Strukturen integrieren einen Einwand; adversative Strukturen stellen zwei Aspekte gegenüber.","obgleich/wenngleich leiten Nebensätze ein; ungeachtet steht mit nominaler Ergänzung; wohingegen verbindet einen Gegensatz zwischen Aussagen.","Ein konzessiver Konnektor darf nicht verwendet werden, wenn eigentlich Ursache oder Folge gemeint ist."],
  12:["Rektion gehört zum Wortschatz: Verben, Nomen und Adjektive verlangen bestimmte Präpositionen und Kasus.","Beispiele: teilhaben an + Dat., angewiesen sein auf + Akk., Beitrag zu + Dat.","Die Präposition darf nicht direkt aus dem Englischen oder einer anderen Sprache übertragen werden."],
  13:["Wortbildung hilft, komplexe Begriffe zu entschlüsseln und präzise neue Wörter zu bilden.","Bestimmen Sie Grundwort, Bestimmungswort sowie Präfix oder Suffix und prüfen Sie die semantische Beziehung.","Grammatisch mögliche Komposita sind nicht automatisch idiomatisch oder für Leser verständlich."],
  14:["Literarische Analyse trennt sprachliche Beobachtung von Interpretation.","Formulierungen wie nahelegen, konnotieren und lässt sich lesen als verbinden sprachlichen Beleg und vorsichtige Deutung.","Eine mögliche symbolische Lesart darf nicht als einzig faktische Bedeutung präsentiert werden."],
  15:["Vergleichs- und Intensivierungsstrukturen machen Grad und Bezugsrahmen einer Bewertung präzise.","bei weitem und weitaus verstärken einen Vergleich; insofern ... als nennt den Aspekt, für den eine Bewertung gilt.","Intensivierung sollte der Evidenz entsprechen und nicht jede Bewertung künstlich verstärken."],
  16:["Informationsverdichtung ordnet Haupt- und Nebeninformationen hierarchisch.","Relativsatz, Partizipialattribut, Nominalisierung und Apposition können Zusatzinformation tragen, während der Hauptsatzkern sichtbar bleibt.","Ein dichter Satz ist nicht automatisch gut; verliert der Leser die Hauptaussage, muss er aufgeteilt werden."],
  17:["Bedingungssätze unterscheiden einfache Bedingung, formelle Voraussetzung und hypothetischen Fall.","sofern/falls schicken das finite Verb ans Satzende; unter der Voraussetzung, dass verbindet Nominalphrase und dass-Satz.","sofern ist nicht temporal und darf nicht verwendet werden, wenn eigentlich während oder sobald gemeint ist."],
  18:["Konjunktiv II der Vergangenheit beschreibt irreale frühere Bedingungen, verpasste Möglichkeiten und hypothetische Folgen.","Grundform: hätte/wäre + Partizip II; bei Modalverben entsteht häufig eine Infinitivkette.","Wenn Bedingung und Folge beide irreal in der Vergangenheit liegen, sollten sie nicht mit einem realen Indikativsatz gemischt werden."],
  19:["Fortgeschrittene Konnektoren müssen nach ihrer exakten logischen Funktion gewählt werden.","insofern als begrenzt auf einen Aspekt; zumal verstärkt einen Grund; vielmehr korrigiert; geschweige denn verstärkt eine negative Steigerung.","Ein Konnektor ist nicht gut, nur weil er schwierig klingt; seine semantische Relation muss passen."],
  20:["Diskurspartikeln markieren Haltung, geteiltes Wissen, Widerspruch, Einschränkung oder Vermutung in gesprochener Sprache.","Sie stehen typischerweise unbetont im Mittelfeld; ihre Wirkung hängt stark von Kontext und Intonation ab.","Partikeln sollten nicht wortwörtlich übersetzt oder wahllos in formelle Schriftsprache eingefügt werden."],
  21:["Feste Verb-Nomen-Verbindungen werden als lexikalische Einheit gelernt.","Merken Sie Nomen, konventionelles Verb, Artikel und mögliche Präposition gemeinsam.","Produktive, aber unidiomatische Kombinationen wie eine Entscheidung machen müssen vermieden werden."],
  22:["Temporale Konnektoren ordnen Vorzeitigkeit, Gleichzeitigkeit, Beginn und Dauer.","nachdem, ehe, während, sobald und solange leiten Nebensätze mit Verbendstellung ein; die Tempuswahl muss die Chronologie stützen.","Konnektorvielfalt ersetzt keine klare zeitliche Reihenfolge."],
  23:["Hedging ermöglicht klare Kritik ohne unnötige Konfrontation.","Formulierungen wie lässt sich nur bedingt teilen können mit konzessiven oder konditionalen Sätzen kombiniert werden, um Grenzen genau zu benennen.","Eine Position darf nicht so stark abgeschwächt werden, dass der eigentliche Vorbehalt nicht mehr erkennbar ist."],
  24:["Eine vollständige Argumentation besteht aus These, Grund, Beleg, Einwand, Reaktion und Schluss bzw. Synthese.","Konnektoren und Rückverweise müssen zeigen, welche Funktion jeder Satz für die Argumentationslinie erfüllt.","Nach einem Einwand reicht es nicht, die These zu wiederholen; der Einwand muss beantwortet, qualifiziert oder widerlegt werden."],
  25:["Evidenzsprache stuft Aussagen nach der Belastbarkeit von Daten und Studiendesign ab.","belegen ist stärker als nahelegen oder auf etwas hindeuten; kausale Verben erfordern mehr als eine Korrelation.","beweisen ist für statistische Daten meist zu stark, wenn alternative Erklärungen nicht ausgeschlossen sind."],
  26:["Komplexe Satzperioden sollen logische Hierarchie sichtbar machen, nicht nur Satzlänge erzeugen.","Ein klarer Hauptsatz bildet die syntaktische Achse; Nebensätze werden dort eingebettet, wo ihre logische Abhängigkeit erkennbar bleibt.","Zu viele Einschübe und Parenthesen können dazu führen, dass der Leser die Hauptaussage verliert."],
  27:["Redigieren bedeutet, Präzision, Kohäsion, Register und sprachliche Ökonomie systematisch zu prüfen.","Ersetzen Sie schwache Umschreibungen durch präzise Verben und sichern Sie eindeutige Pronomen- und Referenzketten.","Akademischer Stil bedeutet nicht automatisch mehr Nominalisierungen, Passivformen oder längere Sätze."],
  28:["C2-Kontrolle bedeutet, sprachliche Mittel nach Aufgabe, Adressat, Evidenz und kommunikativer Funktion auszuwählen.","Prüfen Sie nach der Formulierung Register, Satzbau, Konnektoren, Referenzen und Bedeutungserhalt bei jeder Umformung.","Komplexität um ihrer selbst willen ist kein C2-Merkmal; entscheidend ist die angemessenste präzise Form."],
});

const getCanonicalC2Mastery = (day) => C2_CANONICAL_MASTERY[Number(day)] || null;

const enhanceC2Mastery = (day, source = null) => {
  const dayNumber = Number(day);
  const mastery = getCanonicalC2Mastery(dayNumber) || source;
  if (!mastery) return null;

  const grammarRule = C2_GRAMMAR_RULES[dayNumber] || [
    `Verwenden Sie ${mastery.grammarFocus} nur dort, wo die Struktur die Aussage präziser macht.`,
    "Halten Sie die Satzstruktur transparent und bewahren Sie die beabsichtigte logische Relation.",
    "Zusätzliche Komplexität ist nur sinnvoll, wenn sie Bedeutung, Register oder Kohäsion verbessert.",
  ];
  const examples = Array.isArray(mastery.contrast) ? mastery.contrast.filter(Boolean) : [];
  const nuance = mastery.nuance || {};
  const collocations = Array.isArray(mastery.collocations) ? mastery.collocations.slice(0, 6) : [];

  return {
    ...source,
    ...mastery,
    collocationTopic: mastery.title,
    collocations,
    grammarNotes: {
      title: mastery.grammarFocus,
      usage: grammarRule[0],
      wordOrder: grammarRule[1],
      examples,
      commonMistakes: [grammarRule[2]],
    },
    grammarChecks: [
      {
        question: nuance.q,
        options: Array.isArray(nuance.o) ? nuance.o : [],
        answerIndex: Number.isInteger(nuance.a) ? nuance.a : 0,
        explanation: nuance.e || "Wählen Sie die Form, die Bedeutung, Register und Zielstruktur am präzisesten verbindet.",
      },
      ...(examples.length >= 2 ? [{
        question: `Welche Version zeigt ${mastery.grammarFocus} am kontrolliertesten?`,
        options: examples,
        answerIndex: examples.length - 1,
        explanation: `Die letzte Version modelliert die heutige Zielstruktur (${mastery.grammarFocus}) am vollständigsten. Entscheidend ist ihre Funktion, nicht bloß ihre Länge.`,
      }] : []),
    ],
    speakingExercise: {
      prompt: mastery.production,
      targetLanguage: mastery.collocations?.slice(0, 4).map((item) => item[0]) || [],
    },
    writingExercise: {
      prompt: mastery.writingPrompt || mastery.challenge || mastery.production,
      planningPrompt: mastery.planningPrompt || mastery.production || "Planen Sie Inhalt und sprachliche Mittel vor dem Schreiben.",
      modelAnswer: [mastery.reformulation?.[1], collocations[0]?.[2], examples.at(-1)]
        .filter(Boolean)
        .filter((value, index, array) => array.indexOf(value) === index)
        .join(" "),
    },
  };
};

const C2_LESSON_CONTENT_ALIGNMENT = Object.freeze(
  Object.fromEntries(
    Object.keys(C2_CANONICAL_MASTERY).map((key) => {
      const day = Number(key);
      return [day, Object.freeze(enhanceC2Mastery(day))];
    }),
  ),
);

const getC2LessonContentAlignment = (day) => C2_LESSON_CONTENT_ALIGNMENT[Number(day)] || null;

const alignC2CurriculumEntry = (entry = {}) => {
  const level = String(entry.level || "").trim().toUpperCase();
  if (level !== "C2") return entry;
  const mastery = getC2LessonContentAlignment(entry.day ?? entry.assignmentDay);
  if (!mastery) return entry;

  return {
    ...entry,
    chapter: mastery.chapter,
    title: mastery.title,
    topic: mastery.title,
    lessonTitle: mastery.title,
    assignmentTitle: mastery.title,
    lessonTopic: mastery.topic,
    grammar_topic: mastery.grammarFocus,
    grammarFocus: mastery.grammarFocus,
    c2Mastery: mastery,
    collocations: mastery.collocations,
    grammarNotes: mastery.grammarNotes,
    grammarChecks: mastery.grammarChecks,
    speakingExercise: mastery.speakingExercise,
    writingExercise: mastery.writingExercise,
  };
};

const alignC2CurriculumEntries = (entries = []) => entries.map((entry) => alignC2CurriculumEntry(entry));

const alignC2SelfLearningLesson = (lesson = {}) => {
  if (String(lesson.level || "").toUpperCase() !== "C2") return lesson;
  const mastery = getC2LessonContentAlignment(lesson.day);
  if (!mastery) return lesson;
  return { ...lesson, ...mastery, c2Mastery: mastery };
};

export {
  C2_CANONICAL_MASTERY,
  C2_COLLOCATION_SUPPLEMENTS,
  C2_LESSON_CONTENT_ALIGNMENT,
  getCanonicalC2Mastery,
  getC2LessonContentAlignment,
  enhanceC2Mastery,
  alignC2CurriculumEntry,
  alignC2CurriculumEntries,
  alignC2SelfLearningLesson,
};
