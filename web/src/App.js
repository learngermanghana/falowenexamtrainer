import React, { useState } from "react";
import { ExamProvider } from "./context/ExamContext";
import SpeakingPage from "./components/SpeakingPage";
import WritingPage from "./components/WritingPage";
import VocabPage from "./components/VocabPage";
import CoachPanel from "./components/CoachPanel";
import HomeActions from "./components/HomeActions";
import PlacementCheck from "./components/PlacementCheck";
import { styles } from "./styles";

function App() {
  const [activePage, setActivePage] = useState("home");

  const renderMain = () => {
    if (activePage === "home") return <HomeActions onSelect={setActivePage} />;
    if (activePage === "level-check") return <PlacementCheck />;
    if (activePage === "daily") return <SpeakingPage mode="daily" />;
    if (activePage === "exam") return <SpeakingPage mode="exam" />;
    if (activePage === "schreiben") return <WritingPage />;
    if (activePage === "vocabs") return <VocabPage />;
    return <SpeakingPage />;
  };

  return (
    <ExamProvider>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Falowen Exam Coach</h1>
          <p style={styles.subtitle}>
            Wähle deinen nächsten Schritt: Level Check, Daily Trainer oder eine komplette Simulation.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <main style={{ minWidth: 0 }}>{renderMain()}</main>
          <CoachPanel />
        </div>
      </div>
    </ExamProvider>
  );
}

export default App;
