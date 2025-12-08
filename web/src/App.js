import React, { useState } from "react";
import { ExamProvider } from "./context/ExamContext";
import Navigation from "./components/Navigation";
import SpeakingPage from "./components/SpeakingPage";
import WritingPage from "./components/WritingPage";
import VocabPage from "./components/VocabPage";
import { styles } from "./styles";

function App() {
  const [activePage, setActivePage] = useState("sprechen");

  return (
    <ExamProvider>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Falowen Exam Coach</h1>
          <p style={styles.subtitle}>
            Trainieren für Goethe-Prüfungen – wähle Sprechen, Schreiben oder Vokabeln.
          </p>
          <Navigation activePage={activePage} onNavigate={setActivePage} />
        </header>

        <main>
          {activePage === "sprechen" && <SpeakingPage />}
          {activePage === "schreiben" && <WritingPage />}
          {activePage === "vocabs" && <VocabPage />}
        </main>
      </div>
    </ExamProvider>
  );
}

export default App;
