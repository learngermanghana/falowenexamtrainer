import React, { useMemo, useState } from "react";
import { styles } from "../styles";
import { courseOverview, courseBook, sheetResults, chatPrompts } from "../data/courseData";
import { writingLetters } from "../data/writingLetters";

const tabs = [
  { key: "home", label: "Home" },
  { key: "course", label: "My Course" },
  { key: "chat", label: "Class Chat" },
  { key: "results", label: "My Results" },
  { key: "letters", label: "Schreiben Trainer" },
];

const StatCard = ({ label, value, helper }) => (
  <div style={{ ...styles.card, marginBottom: 0 }}>
    <div style={{ fontSize: 13, color: "#4b5563" }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{value}</div>
    {helper ? <div style={{ ...styles.helperText, margin: "6px 0 0" }}>{helper}</div> : null}
  </div>
);

const CourseTab = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "coach",
      text: `Willkommen, ${courseOverview.studentName}! Wähle einen Prompt oder frag mich direkt, ich bereite dich auf ${courseOverview.upcomingSession.topic} vor.`,
    },
  ]);
  const [letterLevel, setLetterLevel] = useState("all");

  const filteredLetters = useMemo(() => {
    if (letterLevel === "all") return writingLetters;
    return writingLetters.filter((letter) => letter.level === letterLevel);
  }, [letterLevel]);

  const handleSend = (value) => {
    const content = value?.trim();
    if (!content) return;

    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: content },
      {
        sender: "coach",
        text: `Notiert. Für ${courseOverview.nextAssignment.title} nutze bitte die Redemittel aus Kapitel 5. Denk an dein Ziel: ${courseOverview.assignmentStreak} Tage Streak und ${courseOverview.attendanceSummary}.`,
      },
    ]);
    setChatInput("");
  };

  const renderHome = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h2 style={styles.sectionTitle}>Course Home</h2>
        <span style={styles.badge}>Live aus Kurs-Dictionary</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        <StatCard
          label="Assignment Streak"
          value={`${courseOverview.assignmentStreak} Tage`}
          helper="Halte die Serie – jede Aufgabe zählt."
        />
        <StatCard
          label="Anwesenheit"
          value={`${courseOverview.attendanceRate}%`}
          helper={courseOverview.attendanceSummary}
        />
        <StatCard
          label="Nächste Session"
          value={courseOverview.upcomingSession.topic}
          helper={`${courseOverview.upcomingSession.materials} · Fokus: ${courseOverview.upcomingSession.focus}`}
        />
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Nächste empfohlene Aufgabe</h3>
          <span style={styles.levelPill}>Due: {courseOverview.nextAssignment.dueDate}</span>
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>{courseOverview.nextAssignment.title}</p>
        <p style={{ margin: 0 }}>{courseOverview.nextAssignment.description}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={styles.badge}>Kapitel 5</span>
          <span style={styles.badge}>Schreiben</span>
          <span style={styles.badge}>80–100 Wörter</span>
        </div>
      </div>
    </div>
  );

  const renderCourse = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <h2 style={styles.sectionTitle}>My Course</h2>
        <span style={styles.badge}>{courseBook.instructor} · Kursleiterin</span>
      </div>
      <p style={styles.helperText}>{courseBook.title}</p>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {courseBook.units.map((unit) => (
          <div key={unit.id} style={{ ...styles.card, marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <h3 style={{ margin: "0 0 4px 0" }}>{unit.name}</h3>
              <span style={styles.levelPill}>{unit.status}</span>
            </div>
            <div style={{ ...styles.helperText, marginBottom: 6 }}>{unit.pages}</div>
            <p style={{ margin: "0 0 6px 0" }}>Aufgabe: {unit.assignment}</p>
            <ul style={styles.checklist}>
              {unit.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChat = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <h2 style={styles.sectionTitle}>Class Chat · AI Coach</h2>
        <span style={styles.badge}>Vorbereitung auf den Unterricht</span>
      </div>
      <p style={styles.helperText}>Fragen für die nächste Stunde, Redemittel oder Mini-Übungen – die Antworten nutzen dein Kurs-Dictionary.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {chatPrompts.map((prompt) => (
          <button
            key={prompt}
            style={styles.secondaryButton}
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={styles.chatLog}>
          {chatMessages.map((message, index) => (
            <div
              key={`${message.sender}-${index}`}
              style={message.sender === "coach" ? styles.chatBubbleCoach : styles.chatBubbleUser}
            >
              <strong>{message.sender === "coach" ? "Coach" : "Du"}:</strong> {message.text}
            </div>
          ))}
        </div>
        <textarea
          style={styles.textareaSmall}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Frag den Coach nach Redemitteln oder lasse dir eine Mini-Übung geben"
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button style={styles.primaryButton} onClick={() => handleSend(chatInput)}>Nachricht senden</button>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <h2 style={styles.sectionTitle}>My Results</h2>
        <span style={styles.badge}>Import: Google Sheet</span>
      </div>
      <p style={styles.helperText}>Die Werte stammen aus dem letzten Google-Sheet-Sync und zeigen Score, Aufgabe und Kurzfeedback.</p>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {sheetResults.map((row) => (
          <div key={`${row.date}-${row.task}`} style={{ ...styles.card, marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
              <h3 style={{ margin: "0 0 4px 0" }}>{row.skill}</h3>
              <span style={styles.badge}>{row.date}</span>
            </div>
            <p style={{ margin: "0 0 6px 0" }}>{row.task}</p>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{row.score}</div>
            <p style={{ ...styles.helperText, margin: 0 }}>{row.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLetters = () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <h2 style={styles.sectionTitle}>Schreiben Trainer</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={styles.helperText}>Level filtern:</span>
          <select
            style={styles.select}
            value={letterLevel}
            onChange={(e) => setLetterLevel(e.target.value)}
          >
            <option value="all">Alle</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
          </select>
        </div>
      </div>
      <p style={styles.helperText}>Wähle eine Vorlage und schreibe den Text in 10–20 Minuten. Nutze sie im Unterricht oder lade sie im Schreib-Tab hoch.</p>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {filteredLetters.map((letter) => (
          <div key={letter.id} style={{ ...styles.card, marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <h3 style={{ margin: "0 0 4px 0" }}>{letter.letter}</h3>
              <span style={styles.badge}>{letter.level}</span>
            </div>
            <div style={{ ...styles.helperText, marginBottom: 6 }}>Dauer: {letter.durationMinutes} Minuten</div>
            <p style={{ margin: "0 0 6px 0" }}>{letter.situation}</p>
            <ul style={styles.checklist}>
              {letter.whatToInclude.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            style={activeTab === tab.key ? styles.tabButtonActive : styles.tabButton}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "home" && renderHome()}
      {activeTab === "course" && renderCourse()}
      {activeTab === "chat" && renderChat()}
      {activeTab === "results" && renderResults()}
      {activeTab === "letters" && renderLetters()}
    </div>
  );
};

export default CourseTab;
