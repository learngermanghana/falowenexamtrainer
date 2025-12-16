export const courseOverview = {
  studentName: "Alex Student",
  assignmentStreak: 9,
  attendanceRate: 96,
  attendanceSummary: "24 / 25 sessions present",
  nextAssignment: {
    title: "Workbook A2 · Modul 5: Schreiben",
    dueDate: "Freitag, 17:00",
    description: "Kurze E-Mail an die Bibliothek (80–100 Wörter) mit Redemitteln aus Kapitel 5.",
  },
  upcomingSession: {
    topic: "Kapitel 5 – Termine machen & Beschwerden formulieren",
    materials: "Buch S. 72–79, Audio 5.3",
    focus: "Perfekt vs. Präteritum in Gesprächen",
  },
};

export const courseBook = {
  title: "A2 Intensivkurs · Kursbuch",
  instructor: "Frau Novak",
  units: [
    {
      id: "unit-1",
      name: "Kapitel 4: Wohnen & Alltag",
      pages: "S. 52–67",
      status: "Abgeschlossen",
      assignment: "Workbook 4B, Hörverstehen 4.2",
      keyPoints: ["Trennbare Verben im Alltag", "Hausordnung & Bitten höflich formulieren"],
    },
    {
      id: "unit-2",
      name: "Kapitel 5: Service & Beschwerden",
      pages: "S. 68–81",
      status: "Läuft",
      assignment: "Mini-Beschwerde schreiben, Redemittel-Karteikarten wiederholen",
      keyPoints: ["Perfekt mit haben/sein", "Beschwerde-Redemittel", "Telefonnotizen"],
    },
    {
      id: "unit-3",
      name: "Kapitel 6: Termine & Einladungen",
      pages: "S. 82–95",
      status: "Nächste Woche",
      assignment: "Rollenspiel Einladung vorbereiten",
      keyPoints: ["Konnektoren weil/denn/deshalb", "Zeitangaben & Uhrzeiten", "Zu- und Absagen freundlich"],
    },
  ],
};

export const sheetResults = [
  {
    date: "2025-02-28",
    skill: "Schreiben",
    task: "Bibliotheks-E-Mail",
    score: "84 / 100",
    feedback: "Gute Struktur, mehr Konnektoren einsetzen (außerdem, deshalb).",
  },
  {
    date: "2025-02-26",
    skill: "Sprechen",
    task: "Rollenspiel: Termin verschieben",
    score: "B1-, 78%",
    feedback: "Satzklammer bei Modalverben prüfen, höfliche Bitten üben.",
  },
  {
    date: "2025-02-21",
    skill: "Vokabeln",
    task: "Redemittel Kapitel 4",
    score: "92%",
    feedback: "Sehr sicher, Wiederholung nur alle 3 Tage nötig.",
  },
];

export const chatPrompts = [
  "Wie kann ich mich auf die Beschwerde im Unterricht vorbereiten?",
  "Welche Redemittel brauche ich für Telefonnotizen?",
  "Hast du eine Mini-Übung für Perfekt vs. Präteritum?",
];
