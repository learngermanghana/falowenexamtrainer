import React, { createContext, useContext, useState } from "react";

export const ALLOWED_TEILE = [
  "Teil 1 – Vorstellung",
  "Teil 2 – Fragen",
  "Teil 3 – Bitten / Planen",
];

export const ALLOWED_LEVELS = ["A1", "A2", "B1", "B2"];

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [teil, setTeil] = useState(ALLOWED_TEILE[0]);
  const [level, setLevel] = useState(ALLOWED_LEVELS[0]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <ExamContext.Provider
      value={{
        teil,
        setTeil,
        level,
        setLevel,
        result,
        setResult,
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
