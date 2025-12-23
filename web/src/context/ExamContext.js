import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { loadPreferredLevel, savePreferredLevel } from "../services/levelStorage";

export const SPEAKING_FORMATS = {
  A1: [
    {
      id: "a1_teil_1",
      label: "Teil 1",
      instructions: "Teil 1: kurze Vorstellung (Name, Herkunft, Wohnort, Sprachen, Beruf/Studium, Hobbys).",
      timing: { prepSeconds: 30, speakSeconds: 90 },
      scoringHints: "Kurze, klare Sätze. Basiswortschatz und korrekte Verbposition.",
    },
    {
      id: "a1_teil_2",
      label: "Teil 2",
      instructions: "Teil 2: 3–4 einfache Fragen zu Alltagsthemen (Freizeit, Wohnen, Arbeit).",
      timing: { prepSeconds: 30, speakSeconds: 90 },
      scoringHints: "Fragewort an Position 1, Verb an Position 2 oder am Satzanfang bei Ja/Nein-Fragen.",
    },
    {
      id: "a1_teil_3",
      label: "Teil 3",
      instructions: "Teil 3: Bitten/Planen. Höflich um etwas bitten oder eine Aktivität gemeinsam planen.",
      timing: { prepSeconds: 30, speakSeconds: 120 },
      scoringHints: "Höfliche Formen (können/bitte), einfache Modalverben, kurze Begründungen.",
    },
  ],
  A2: [
    {
      id: "a2_teil_1",
      label: "Teil 1",
      instructions:
        "Teil 1: Vorstellung mit 2–3 Details (z. B. letzte Reise, aktuelles Projekt, typischer Tag).",
      timing: { prepSeconds: 30, speakSeconds: 120 },
      scoringHints: "Zusammenhängende Sätze, Verbzweitstellung, einfache Nebensätze mit weil/dass.",
    },
    {
      id: "a2_teil_2",
      label: "Teil 2",
      instructions: "Teil 2: Fragen stellen und kurz reagieren. Nutze W-Fragen und Entscheidungsfragen passend zum Thema.",
      timing: { prepSeconds: 30, speakSeconds: 120 },
      scoringHints: "Richtige Frageformen, Modalverben für Höflichkeit, kurze Rückfragen.",
    },
    {
      id: "a2_teil_3",
      label: "Teil 3",
      instructions:
        "Teil 3: Gemeinsame Aktivität planen. Vorschläge machen, zustimmen/ablehnen und eine Entscheidung treffen.",
      timing: { prepSeconds: 30, speakSeconds: 150 },
      scoringHints: "Strukturierte Vorschläge (sollen/wollen), Zustimmung/Ablehnung mit kurzer Begründung.",
    },
  ],
  B1: [
    {
      id: "b1_teil_1",
      label: "Teil 1",
      instructions:
        "Teil 1: kurze Präsentation zu einem Alltagsthema. Gliedere in Einleitung, 2–3 Punkte, eigene Meinung und Abschluss.",
      timing: { prepSeconds: 90, speakSeconds: 180 },
      scoringHints: "Klarer Aufbau, Konnektoren (erstens, außerdem, deshalb), Meinung begründen.",
    },
    {
      id: "b1_teil_2",
      label: "Teil 2",
      instructions: "Teil 2: auf Fragen zur Präsentation reagieren, zustimmen/ablehnen und begründen.",
      timing: { prepSeconds: 30, speakSeconds: 180 },
      scoringHints: "Nachfragen paraphrasieren, Zustimmung/Ablehnung mit Begründung, passende Redemittel.",
    },
    {
      id: "b1_teil_3",
      label: "Teil 3",
      instructions:
        "Teil 3: Gemeinsame Veranstaltung planen. Vorschläge machen, Optionen vergleichen und eine Entscheidung treffen.",
      timing: { prepSeconds: 45, speakSeconds: 180 },
      scoringHints: "Abwägen (zuerst, einerseits, andererseits), Modalverben, klare Entscheidung.",
    },
  ],
  B2: [
    {
      id: "b2_teil_1",
      label: "Teil 1",
      instructions:
        "Teil 1: Präsentation mit Stellungnahme. Klare Struktur, Daten/Beispiele und eigenes Fazit.",
      timing: { prepSeconds: 120, speakSeconds: 240 },
      scoringHints: "Fortgeschrittene Konnektoren (folglich, hingegen), klare Argumentationslinie, präziser Wortschatz.",
    },
    {
      id: "b2_teil_2",
      label: "Teil 2",
      instructions: "Teil 2: Diskussion/Streitgespräch. Pro- und Contra-Argumente nennen und auf Gegenpositionen eingehen.",
      timing: { prepSeconds: 60, speakSeconds: 240 },
      scoringHints: "Widerspruch höflich formulieren, Beispiele anführen, logische Verknüpfungen.",
    },
    {
      id: "b2_teil_3",
      label: "Teil 3",
      instructions:
        "Teil 3: Verhandeln/Planen. Differenzierte Vorschläge machen, Kompromisse aushandeln und Ergebnisse zusammenfassen.",
      timing: { prepSeconds: 60, speakSeconds: 210 },
      scoringHints: "Kompromissformeln, Zusammenfassen, präzise Reaktionen auf Einwände.",
    },
  ],
  C1: [
    {
      id: "c1_teil_1",
      label: "Teil 1",
      instructions: "Teil 1: anspruchsvolle Präsentation zu einem gesellschaftlichen Thema mit klarer Struktur und Position.",
      timing: { prepSeconds: 150, speakSeconds: 240 },
      scoringHints: "Nuancierte Argumentation, präziser Wortschatz, Quellen/Beispiele einbinden.",
    },
    {
      id: "c1_teil_2",
      label: "Teil 2",
      instructions: "Teil 2: kontroverse Frage diskutieren, Gegenargumente einordnen und reflektiert reagieren.",
      timing: { prepSeconds: 90, speakSeconds: 240 },
      scoringHints: "Kohärente Struktur, Abwägung, komplexe Konnektoren, kritische Reflexion.",
    },
    {
      id: "c1_teil_3",
      label: "Teil 3",
      instructions: "Teil 3: kooperative Planung oder Debatte auf hohem Sprachniveau, Ergebnisse klar zusammenfassen.",
      timing: { prepSeconds: 90, speakSeconds: 240 },
      scoringHints: "Zusammenfassen, diplomatisch verhandeln, stilistisch sicher argumentieren.",
    },
  ],
};

export const ALLOWED_LEVELS = Object.keys(SPEAKING_FORMATS);

export const getTasksForLevel = (level) =>
  SPEAKING_FORMATS[level] || SPEAKING_FORMATS.A1;

const ExamContext = createContext();

const getInitialLevel = () => {
  const stored = loadPreferredLevel();
  if (stored && ALLOWED_LEVELS.includes(stored)) {
    return stored;
  }
  return ALLOWED_LEVELS[0];
};

const initialLevel = getInitialLevel();

export const ExamProvider = ({ children }) => {
  const { studentProfile, saveStudentProfile } = useAuth();
  const [level, setLevelState] = useState(initialLevel);
  const [levelConfirmed, setLevelConfirmed] = useState(Boolean(loadPreferredLevel()));
  const [teil, setTeil] = useState(getTasksForLevel(initialLevel)[0].label);
  const [result, setResult] = useState(null);
  const [resultHistory, setResultHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setLevel = (newLevel) => {
    const safeLevel = ALLOWED_LEVELS.includes(newLevel)
      ? newLevel
      : ALLOWED_LEVELS[0];
    setLevelState(safeLevel);
    setLevelConfirmed(true);
    savePreferredLevel(safeLevel);

    if (studentProfile?.id && (studentProfile.level || "").toUpperCase() !== safeLevel) {
      saveStudentProfile({ level: safeLevel }).catch((error) => {
        console.warn("Failed to sync level to student profile", error);
      });
    }
  };

  useEffect(() => {
    const profileLevel = (studentProfile?.level || "").toUpperCase();
    if (!profileLevel || !ALLOWED_LEVELS.includes(profileLevel)) return;
    if (profileLevel === level) return;

    setLevel(profileLevel);
  }, [level, studentProfile?.level]);

  useEffect(() => {
    const allowedTeile = getTasksForLevel(level).map((task) => task.label);

    if (!allowedTeile.includes(teil)) {
      setTeil(allowedTeile[0] || "");
    }
  }, [level, teil]);

  const addResultToHistory = (entry) => {
    if (!entry) return;

    setResultHistory((prev) => [
      {
        id: `${Date.now()}-${prev.length + 1}`,
        createdAt: new Date().toISOString(),
        ...entry,
      },
      ...prev,
    ]);
  };

  return (
    <ExamContext.Provider
      value={{
        teil,
        setTeil,
        level,
        setLevel,
        levelConfirmed,
        setLevelConfirmed,
        result,
        setResult,
        resultHistory,
        addResultToHistory,
        error,
        setError,
        loading,
        setLoading,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within an ExamProvider");
  }
  return context;
};
