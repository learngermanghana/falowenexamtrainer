export const GOETHE_EXAM_ORIENTATIONS = Object.freeze({
  A1: {
    level: "A1",
    day: 25,
    teachingDays: 24,
    requiredAssignments: 19,
    courseRoute: "/campus/course/a1-day-25-goethe-exam-orientation",
    practiceUrl: "https://bfu.goethe.de/a1_sd1/hoeren.php",
    practiceLabel: "Offizielle Goethe-A1-Prüfung öffnen",
    source: "Goethe-Institut · Goethe-Zertifikat A1 Start Deutsch 1 Modellsatz",
    startSection: "Hören",
    intro:
      "Du hast deine A1-Lernphase abgeschlossen. Heute gibt es keinen neuen Lernstoff und keine Falowen-Abgabe. Nutze stattdessen den offiziellen Goethe-Modellsatz unter Prüfungsbedingungen.",
    practiceDescription:
      "Der offizielle Link startet direkt bei Hören. Auf der Goethe-Seite kannst du anschließend auch zu Lesen, Schreiben und Sprechen wechseln.",
    sections: [
      {
        key: "lesen",
        name: "Lesen",
        duration: "25 Min.",
        description: "Kurze Alltagstexte, Schilder, Anzeigen und Mitteilungen lesen und die wichtigsten Informationen erkennen.",
      },
      {
        key: "hoeren",
        name: "Hören",
        duration: "ca. 20 Min.",
        description: "Kurze Gespräche, Ansagen und Mitteilungen hören und gezielt Informationen verstehen.",
      },
      {
        key: "schreiben",
        name: "Schreiben",
        duration: "20 Min.",
        description: "Ein Formular ergänzen und eine kurze persönliche Mitteilung mit den geforderten Inhaltspunkten schreiben.",
      },
      {
        key: "sprechen",
        name: "Sprechen",
        duration: "ca. 15 Min.",
        description: "Sich vorstellen, Fragen stellen und beantworten sowie Bitten formulieren und darauf reagieren.",
      },
    ],
  },
  A2: {
    level: "A2",
    day: 29,
    teachingDays: 28,
    requiredAssignments: 28,
    courseRoute: "/campus/course/a2-day-29-goethe-exam-orientation",
    practiceUrl: "https://www.goethe.de/ins/gh/en/spr/prf/gzsd2/ueb.html",
    practiceLabel: "Offizielle Goethe-A2-Übungen öffnen",
    source: "Goethe-Institut Ghana · Goethe-Zertifikat A2 Übungsmaterialien",
    startSection: null,
    intro:
      "Du hast deine 28 A2-Lerntage abgeschlossen. Heute gibt es keinen neuen Lernstoff und keine Falowen-Abgabe. Übertrage jetzt dein Training auf das offizielle Goethe-A2-Prüfungsmaterial.",
    practiceDescription:
      "Auf der offiziellen Goethe-Seite findest du Online-Übungen, Modellsätze, Hörmaterial und Material für die Sprechprüfung.",
    sections: [
      {
        key: "lesen",
        name: "Lesen",
        duration: "30 Min.",
        description: "Kurze Zeitungstexte, E-Mails, Anzeigen und öffentliche Hinweise lesen und passende Aufgaben lösen.",
      },
      {
        key: "hoeren",
        name: "Hören",
        duration: "30 Min.",
        description: "Alltagsgespräche, Ansagen, Telefon- oder Radiobeiträge hören und die wichtigsten Informationen erkennen.",
      },
      {
        key: "schreiben",
        name: "Schreiben",
        duration: "30 Min.",
        description: "Kurze Mitteilungen zu vertrauten Alltagssituationen schreiben und alle Inhaltspunkte bearbeiten.",
      },
      {
        key: "sprechen",
        name: "Sprechen",
        duration: "ca. 15 Min.",
        description: "Fragen stellen und beantworten, über das eigene Leben sprechen und gemeinsam etwas planen oder vereinbaren.",
      },
    ],
  },
  B1: {
    level: "B1",
    day: 29,
    teachingDays: 28,
    requiredAssignments: 28,
    courseRoute: "/campus/course/b1-day-29-goethe-exam-orientation",
    practiceUrl: "https://bfu.goethe.de/b1_mod/lesen.php",
    practiceLabel: "Offizielle Goethe-B1-Prüfung öffnen",
    source: "Goethe-Institut · Goethe-Zertifikat B1 Modellsatz",
    startSection: "Lesen",
    intro:
      "Du hast deine 28 B1-Lerntage abgeschlossen. Heute gibt es keinen neuen Lernstoff und keine Falowen-Abgabe. Arbeite stattdessen direkt mit dem offiziellen Goethe-B1-Modellsatz.",
    practiceDescription:
      "Der offizielle Link startet direkt bei Lesen. Auf der Goethe-Seite kannst du anschließend auch zu Hören, Schreiben und Sprechen wechseln.",
    sections: [
      {
        key: "lesen",
        name: "Lesen",
        duration: "65 Min.",
        description: "Fünf Leseteile unter Prüfungsbedingungen bearbeiten und Informationen aus unterschiedlichen Textsorten verstehen.",
      },
      {
        key: "hoeren",
        name: "Hören",
        duration: "ca. 40 Min.",
        description: "Gespräche, Ansagen und Beiträge verstehen und Hauptaussagen sowie wichtige Einzelinformationen erkennen.",
      },
      {
        key: "schreiben",
        name: "Schreiben",
        duration: "60 Min.",
        description: "Prüfungstypische Schreibaufgaben vollständig bearbeiten, passend strukturieren und sprachlich klar formulieren.",
      },
      {
        key: "sprechen",
        name: "Sprechen",
        duration: "ca. 15 Min.",
        description: "Gemeinsam planen, ein Thema präsentieren und auf Fragen oder Rückmeldungen angemessen reagieren.",
      },
    ],
  },
});

export const getGoetheExamOrientationConfig = (level = "") =>
  GOETHE_EXAM_ORIENTATIONS[String(level || "").trim().toUpperCase()] || null;
