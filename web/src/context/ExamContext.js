import React, { createContext, useContext, useEffect, useState } from "react";
import { loadPreferredLevel, savePreferredLevel } from "../services/levelStorage";

export const SPEAKING_FORMATS = {
  A1: [
    {
      id: "a1_vorstellung",
      label: "Teil 1 – Vorstellung",
      instructions:
        "Stell dich kurz vor (Name, Herkunft, Wohnort, Sprachen, Beruf/Studium, Hobbys).",
      timing: { prepSeconds: 30, speakSeconds: 90 },
      scoringHints: "Kurze, klare Sätze. Basiswortschatz und korrekte Verbposition.",
    },
    {
      id: "a1_fragen",
      label: "Teil 2 – Fragen",
      instructions:
        "Stelle 3–4 einfache Fragen zu Alltagsthemen (Freizeit, Wohnen, Arbeit).",
      timing: { prepSeconds: 30, speakSeconds: 90 },
      scoringHints: "Fragewort an Position 1, Verb an Position 2 oder am Satzanfang bei Ja/Nein-Fragen.",
    },
    {
      id: "a1_planen",
      label: "Teil 3 – Bitten / Planen",
      instructions:
        "Bitte höflich um etwas oder plane eine Aktivität gemeinsam. Nutze Vorschläge und Reaktionen.",
      timing: { prepSeconds: 30, speakSeconds: 120 },
      scoringHints: "Höfliche Formen (können/bitte), einfache Modalverben, kurze Begründungen.",
    },
  ],
  A2: [
    {
      id: "a2_vorstellung",
      label: "Teil 1 – Vorstellung",
      instructions:
        "Stell dich vor und ergänze 2–3 Details (z. B. letzte Reise, aktuelles Projekt, typischer Tag).",
      timing: { prepSeconds: 30, speakSeconds: 120 },
      scoringHints: "Zusammenhängende Sätze, Verbzweitstellung, einfache Nebensätze mit weil/dass.",
    },
    {
      id: "a2_fragen",
      label: "Teil 2 – Fragen",
      instructions:
        "Stelle Fragen und reagiere kurz. Nutze W-Fragen und Entscheidungsfragen passend zum Thema.",
      timing: { prepSeconds: 30, speakSeconds: 120 },
      scoringHints: "Richtige Frageformen, Modalverben für Höflichkeit, kurze Rückfragen.",
    },
    {
      id: "a2_planen",
      label: "Teil 3 – Bitten / Planen",
      instructions:
        "Plant gemeinsam eine Aktivität. Mache Vorschläge, reagiere zustimmend/ablehnend und trefft eine Entscheidung.",
      timing: { prepSeconds: 30, speakSeconds: 150 },
      scoringHints: "Strukturierte Vorschläge (sollen/wollen), Zustimmung/Ablehnung mit kurzer Begründung.",
    },
  ],
  B1: [
    {
      id: "b1_praesentation",
      label: "Teil 1 – Präsentation",
      instructions:
        "Halte eine kurze Präsentation zu einem Alltagsthema. Gliedere in Einleitung, 2–3 Punkte, eigene Meinung und Abschluss.",
      timing: { prepSeconds: 90, speakSeconds: 180 },
      scoringHints: "Klarer Aufbau, Konnektoren (erstens, außerdem, deshalb), Meinung begründen.",
    },
    {
      id: "b1_diskussion",
      label: "Teil 2 – Diskussion / Fragen",
      instructions:
        "Reagiere auf Fragen zur Präsentation, stimme zu oder lehne ab und begründe deine Haltung.",
      timing: { prepSeconds: 30, speakSeconds: 180 },
      scoringHints: "Nachfragen paraphrasieren, Zustimmung/Ablehnung mit Begründung, passende Redemittel.",
    },
    {
      id: "b1_planung",
      label: "Teil 3 – Gemeinsame Planung",
      instructions:
        "Plane gemeinsam eine Veranstaltung. Mache Vorschläge, vergleiche Optionen und trefft eine Entscheidung.",
      timing: { prepSeconds: 45, speakSeconds: 180 },
      scoringHints: "Abwägen (zuerst, einerseits, andererseits), Modalverben, klare Entscheidung.",
    },
  ],
  B2: [
    {
      id: "b2_praesentation",
      label: "Teil 1 – Präsentation mit Stellungnahme",
      instructions:
        "Präsentiere ein Thema mit klarer Struktur, Daten/Beispielen und eigener Bewertung. Schließe mit einer Position.",
      timing: { prepSeconds: 120, speakSeconds: 240 },
      scoringHints: "Fortgeschrittene Konnektoren (folglich, hingegen), klare Argumentationslinie, präziser Wortschatz.",
    },
    {
      id: "b2_diskussion",
      label: "Teil 2 – Diskussion / Streitgespräch",
      instructions:
        "Diskutiere Pro- und Contra-Argumente, gehe auf Gegenpositionen ein und halte den roten Faden.",
      timing: { prepSeconds: 60, speakSeconds: 240 },
      scoringHints: "Widerspruch höflich formulieren, Beispiele anführen, logische Verknüpfungen.",
    },
    {
      id: "b2_verhandlung",
      label: "Teil 3 – Verhandeln / Planung auf B2",
      instructions:
        "Verhandle eine Lösung gemeinsam. Mache differenzierte Vorschläge, handle Kompromisse aus und fasse Ergebnisse zusammen.",
      timing: { prepSeconds: 60, speakSeconds: 210 },
      scoringHints: "Kompromissformeln, Zusammenfassen, präzise Reaktionen auf Einwände.",
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
  };

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
