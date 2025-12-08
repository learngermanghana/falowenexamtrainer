// src/App.js
import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
  const ALLOWED_TEILE = [
    "Teil 1 – Vorstellung",
    "Teil 2 – Fragen",
    "Teil 3 – Bitten / Planen",
  ];

  const ALLOWED_LEVELS = ["A1", "A2", "B1", "B2"];

  const [activePage, setActivePage] = useState("sprechen");
  const [teil, setTeil] = useState("Teil 1 – Vorstellung");
  const [level, setLevel] = useState("A1");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const chunksRef = useRef([]);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const startRecording = async () => {
    setError("");
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert(
        "Falowen Exam Coach: Microphone access failed. Please allow mic access in your browser."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const resetAudio = () => {
    setError("");
    setAudioBlob(null);
    setAudioUrl(null);
    setResult(null);
  };

  const validateSelections = () => {
    if (!ALLOWED_TEILE.includes(teil)) {
      setError("Bitte wähle einen gültigen Teil aus der Liste.");
      return false;
    }

    if (!ALLOWED_LEVELS.includes(level)) {
      setError("Bitte wähle ein gültiges Niveau (A1–B2).");
      return false;
    }

    setError("");
    return true;
  };

  const sendTypedAnswerForCorrection = async () => {
    const trimmed = typedAnswer.trim();

    if (!trimmed) {
      alert("Please type your answer before sending.");
      return;
    }

    if (!validateSelections()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${backendUrl}/api/speaking/analyze-text`, {
        text: trimmed,
        teil,
        level,
      });

      setResult(response.data);
    } catch (err) {
      console.error("Falowen frontend error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Falowen Exam Coach: Error sending text for analysis.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const sendForCorrection = async () => {
    if (!audioBlob) {
      alert("Please record your answer first.");
      return;
    }

    if (!validateSelections()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("teil", teil);
      formData.append("level", level);

      const response = await axios.post(
        `${backendUrl}/api/speaking/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error("Falowen frontend error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Falowen Exam Coach: Error sending audio for analysis.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderSprechenPage = () => (
    <>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>1. Choose Exam Settings</h2>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Teil</label>
            <select
              value={teil}
              onChange={(e) => {
                setError("");
                setTeil(e.target.value);
              }}
              style={styles.select}
            >
              {ALLOWED_TEILE.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Niveau</label>
            <select
              value={level}
              onChange={(e) => {
                setError("");
                setLevel(e.target.value);
              }}
              style={styles.select}
            >
              {ALLOWED_LEVELS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>2. Record Your Answer</h2>
        <p style={styles.helperText}>
          🎙️ Click <b>Start Recording</b>, speak your answer, then click <b>Stop</b>.
        </p>

        <div style={styles.row}>
          {!isRecording ? (
            <button style={styles.primaryButton} onClick={startRecording}>
              Start Recording
            </button>
          ) : (
            <button style={styles.dangerButton} onClick={stopRecording}>
              Stop Recording
            </button>
          )}

          <button
            style={styles.secondaryButton}
            onClick={resetAudio}
            disabled={!audioBlob}
          >
            Clear Recording
          </button>
        </div>

        {audioUrl && (
          <div style={{ marginTop: 16 }}>
            <p style={styles.helperText}>▶️ Preview your recording:</p>
            <audio controls src={audioUrl} style={{ width: "100%" }} />
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <button
            style={styles.primaryButton}
            onClick={sendForCorrection}
            disabled={!audioBlob || loading}
          >
            {loading ? "Analyzing..." : "Send to Falowen for Feedback"}
          </button>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <strong>Hinweis:</strong> {error}
          </div>
        )}
      </section>

      {result && renderFeedback()}
    </>
  );

  const renderSchreibenPage = () => (
    <>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Write a practice answer</h2>
        <p style={styles.helperText}>
          ✍️ Choose the Teil and level, type your response, and get the same AI feedback as the speaking task.
        </p>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Teil</label>
            <select
              value={teil}
              onChange={(e) => {
                setError("");
                setTeil(e.target.value);
              }}
              style={styles.select}
            >
              {ALLOWED_TEILE.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Niveau</label>
            <select
              value={level}
              onChange={(e) => {
                setError("");
                setLevel(e.target.value);
              }}
              style={styles.select}
            >
              {ALLOWED_LEVELS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <textarea
          value={typedAnswer}
          onChange={(e) => {
            setError("");
            setTypedAnswer(e.target.value);
          }}
          placeholder="Schreibe hier deine Antwort auf Deutsch..."
          style={styles.textArea}
          rows={7}
        />

        <div style={{ marginTop: 12 }}>
          <button
            style={styles.primaryButton}
            onClick={sendTypedAnswerForCorrection}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Send Typed Answer"}
          </button>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <strong>Hinweis:</strong> {error}
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>Helpful writing prompts</h3>
        <ul style={styles.promptList}>
          <li>Beschreibe dich selbst mit 5–6 Sätzen (Name, Herkunft, Beruf, Hobbys).</li>
          <li>Stelle drei Fragen zu einem Thema deiner Wahl (z. B. Urlaub, Arbeit, Familie).</li>
          <li>Mache höfliche Bitten für ein Gruppenprojekt (Treffpunkt, Aufgaben, Zeitplan).</li>
        </ul>
      </section>

      {result && renderFeedback()}
    </>
  );

  const vocabLists = [
    {
      title: "Alltag & Vorstellen",
      items: [
        "Ich heiße ...",
        "Ich komme aus ...",
        "Ich wohne in ...",
        "In meiner Freizeit ...",
        "Können Sie das bitte wiederholen?",
      ],
    },
    {
      title: "Fragen stellen",
      items: [
        "Wie viel kostet ...?",
        "Wann beginnt ...?",
        "Wo treffen wir uns?",
        "Wie lange dauert ...?",
        "Mit wem gehst du ...?",
      ],
    },
    {
      title: "Bitten & Vorschläge",
      items: [
        "Könntest du bitte ...?",
        "Wollen wir uns um ... treffen?",
        "Hast du Zeit, mir zu helfen?",
        "Lass uns zusammen ...",
        "Ich schlage vor, dass ...",
      ],
    },
  ];

  const renderVocabsPage = () => (
    <>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Vokabel-Booster</h2>
        <p style={styles.helperText}>
          🧠 Nutze diese Mini-Listen als Schnellhilfe für deine Antworten. Lies sie laut vor und baue sie in deine Beispiele ein.
        </p>
        <div style={styles.vocabGrid}>
          {vocabLists.map((block) => (
            <div key={block.title} style={styles.vocabCard}>
              <h4 style={styles.vocabTitle}>{block.title}</h4>
              <ul style={styles.vocabList}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>Mini-Übung</h3>
        <p style={styles.helperText}>
          Wähle zwei Ausdrücke aus den Listen oben und schreibe oder spreche einen kurzen Dialog. Kombiniere mindestens eine Frage und eine Bitte.
        </p>
      </section>
    </>
  );

  const storySeeds = [
    {
      title: "Verspäteter Zug",
      hook:
        "Du sitzt im Zug nach Berlin. Der Zug hat 50 Minuten Verspätung und du musst deine Freunde informieren.",
      twist: "Plötzlich lernst du jemanden kennen, der dir einen Geheimtipp für Berlin gibt. Was ist er?",
    },
    {
      title: "Wohnungssuche",
      hook:
        "Du besichtigst eine WG. Eine Mitbewohnerin kann am Tag des Einzugs nicht da sein.",
      twist: "Du musst alles per Sprachnachricht klären und eine wichtige Frage stellen – welche?",
    },
    {
      title: "Reise nach Zürich",
      hook:
        "Dein Gepäck ist noch in München. Du brauchst dringend Kleidung für ein Goethe-Prüfungstraining.",
      twist: "Ein Ladenbesitzer bietet dir Hilfe an, aber nur wenn du einen kurzen Dialog auf Deutsch führst.",
    },
  ];

  const examDayPlan = [
    {
      time: "Morgens",
      steps: [
        "10 Minuten Zungenbrecher laut lesen (z. B. 'Zwischen zwei Zwetschgenzweigen').",
        "Atmung 4-4-6: 4 Sekunden einatmen, 4 halten, 6 ausatmen.",
        "Ein kurzer Smalltalk im Kopf: Begrüßung, Name, Herkunft, Tagesziel.",
      ],
    },
    {
      time: "Kurz vor der Prüfung",
      steps: [
        "Eine Karte ziehen: Teil 1, 2 oder 3 simulieren und drei Sätze sprechen.",
        "Checkliste: Pass, Stift, Wasser, Uhr. Dann Schultern lockern und lächeln.",
        "Lieblingssatz bereit halten: 'Darf ich kurz nachfragen ...?'",
      ],
    },
    {
      time: "Nach der Prüfung",
      steps: [
        "Reflexion aufschreiben: 3 Sätze, was gut lief, 1 Satz, was du beim nächsten Mal anders machst.",
        "Belohnungsidee: Kaffee, Spaziergang oder kurzer Call mit Freunden auf Deutsch.",
      ],
    },
  ];

  const challengeDeck = [
    "Führe ein 6-Satz-Rollenspiel: Du bist Touristenführer:in für einen Park in deiner Stadt.",
    "Erkläre einem Freund auf Deutsch, wie man dein Lieblingsrezept kocht – mindestens fünf Verben im Imperativ!",
    "Erfinde eine Mini-Story mit den Wörtern: Prüfung, Regenschirm, Überraschung, Fahrkarte.",
    "Beschreibe einen Gegenstand in deiner Nähe, ohne seinen Namen zu nennen. Lass jemanden raten.",
    "Plane ein Wochenende in Hamburg mit drei Stationen, Preisen und Uhrzeiten.",
  ];

  const renderCreativePage = () => (
    <>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Kreative Story-Seeds</h2>
        <p style={styles.helperText}>
          🌟 Nutze diese Situationen als spontane Prüfungs-Bühne. Setze dir einen Timer von 90 Sekunden
          und erzähle die Szene laut. Kombiniere mindestens zwei Zeiten (Präsens & Perfekt).
        </p>
        <div style={styles.vocabGrid}>
          {storySeeds.map((seed) => (
            <div key={seed.title} style={styles.storyCard}>
              <div style={styles.storyHeader}>{seed.title}</div>
              <p style={styles.resultText}>{seed.hook}</p>
              <p style={styles.twist}>Plot Twist: {seed.twist}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>Challenge-Deck</h3>
        <p style={styles.helperText}>
          🎲 Ziehe mental eine Karte und sprich oder schreibe deine Antwort. Nutze eine Stoppuhr, um
          dein Timing wie in der Goethe-Prüfung zu trainieren.
        </p>
        <ul style={styles.challengeList}>
          {challengeDeck.map((challenge) => (
            <li key={challenge}>{challenge}</li>
          ))}
        </ul>
      </section>
    </>
  );

  const renderExamDayPage = () => (
    <>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Prüfungstag-Plan</h2>
        <p style={styles.helperText}>
          📅 Mini-Rituale, damit du am Goethe-Prüfungstag fokussiert bleibst. Druck dir diese Liste aus und hake sie ab.
        </p>
        <div style={styles.timeline}>
          {examDayPlan.map((block) => (
            <div key={block.time} style={styles.timelineBlock}>
              <div style={styles.timelineLabel}>{block.time}</div>
              <ul style={styles.timelineList}>
                {block.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>Mini-Mantra & Körper</h3>
        <p style={styles.helperText}>
          🧘 Sag laut: "Ich kenne meine Strukturen. Ich kann fragen, reagieren und improvisieren." Dann 30 Sekunden Power-Pose, Schultern hoch, tief atmen.
        </p>
        <div style={styles.tipGrid}>
          <div style={styles.tipCard}>
            <h4 style={styles.tipTitle}>Stimm-Check</h4>
            <p style={styles.resultText}>Sprich drei Mal laut: "Ich bringe Ruhe in den Raum." Danach Zungenbrecher + großes Lächeln.</p>
          </div>
          <div style={styles.tipCard}>
            <h4 style={styles.tipTitle}>Plan B</h4>
            <p style={styles.resultText}>Wenn du ein Wort vergisst: Umschreiben, Beispiele nennen, nachfragen. Dein Ziel ist Verständlichkeit, nicht Perfektion.</p>
          </div>
          <div style={styles.tipCard}>
            <h4 style={styles.tipTitle}>Energie</h4>
            <p style={styles.resultText}>Wasser, leichter Snack, ein kurzer Spaziergang. Keine neuen Grammatikregeln 60 Minuten vor der Prüfung.</p>
          </div>
        </div>
      </section>
    </>
  );

  const renderFeedback = () => (
    <section style={styles.resultCard}>
      <h2 style={styles.sectionTitle}>3. Feedback</h2>

      <h3 style={styles.resultHeading}>Transcript (What the AI heard)</h3>
      <p style={styles.resultText}>{result.transcript}</p>

      <h3 style={styles.resultHeading}>Corrected German Version</h3>
      <p style={styles.resultText}>{result.corrected_text}</p>

      <h3 style={styles.resultHeading}>Mistakes & Explanations (English)</h3>
      <pre style={styles.pre}>{result.mistakes}</pre>

      <h3 style={styles.resultHeading}>Pronunciation / Fluency (from transcript)</h3>
      <p style={styles.resultText}>{result.pronunciation}</p>

      <h3 style={styles.resultHeading}>Score</h3>
      <p style={styles.score}>
        ⭐ <b>{result.score} / 10</b>
      </p>
      <p style={styles.resultText}>{result.comment}</p>
    </section>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Falowen Exam Coach</h1>
        <p style={styles.subtitle}>
          Trainieren für Goethe-Prüfungen – wähle Sprechen, Schreiben oder Vokabeln.
        </p>
        <div style={styles.nav}>
          <button
            style={activePage === "sprechen" ? styles.navButtonActive : styles.navButton}
            onClick={() => {
              setResult(null);
              setError("");
              setActivePage("sprechen");
            }}
          >
            Sprechen
          </button>
          <button
            style={activePage === "schreiben" ? styles.navButtonActive : styles.navButton}
            onClick={() => {
              setResult(null);
              setError("");
              setActivePage("schreiben");
            }}
          >
            Schreiben
          </button>
          <button
            style={activePage === "vocabs" ? styles.navButtonActive : styles.navButton}
            onClick={() => {
              setResult(null);
              setError("");
              setActivePage("vocabs");
            }}
          >
            Vokabeln
          </button>
          <button
            style={activePage === "creative" ? styles.navButtonActive : styles.navButton}
            onClick={() => {
              setResult(null);
              setError("");
              setActivePage("creative");
            }}
          >
            Kreativideen
          </button>
          <button
            style={activePage === "examday" ? styles.navButtonActive : styles.navButton}
            onClick={() => {
              setResult(null);
              setError("");
              setActivePage("examday");
            }}
          >
            Prüfungstag
          </button>
        </div>
      </header>

      <main>
        {activePage === "sprechen" && renderSprechenPage()}
        {activePage === "schreiben" && renderSchreibenPage()}
        {activePage === "vocabs" && renderVocabsPage()}
        {activePage === "creative" && renderCreativePage()}
        {activePage === "examday" && renderExamDayPage()}
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "24px 16px 40px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
  },
  header: {
    marginBottom: 24,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 12,
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  navButton: {
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
  },
  navButtonActive: {
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid #2563eb",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    border: "1px solid #d1d5db",
    backgroundColor: "#f9fafb",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  row: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 8,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 180,
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: "#374151",
  },
  select: {
    padding: "6px 8px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },
  primaryButton: {
    padding: "8px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    background: "#2563eb",
    color: "#ffffff",
    fontSize: 14,
  },
  secondaryButton: {
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    cursor: "pointer",
    background: "#f9fafb",
    fontSize: 14,
  },
  dangerButton: {
    padding: "8px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    background: "#dc2626",
    color: "#ffffff",
    fontSize: 14,
  },
  helperText: {
    fontSize: 13,
    color: "#4b5563",
    marginBottom: 8,
  },
  resultHeading: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  textArea: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #d1d5db",
    fontSize: 14,
    resize: "vertical",
    minHeight: 120,
    boxSizing: "border-box",
  },
  resultText: {
    fontSize: 14,
    color: "#111827",
  },
  pre: {
    background: "#111827",
    color: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
    whiteSpace: "pre-wrap",
    fontSize: 13,
    margin: 0,
  },
  score: {
    fontSize: 16,
  },
  vocabGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 12,
  },
  vocabCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 12,
    background: "#f9fafb",
  },
  vocabTitle: {
    margin: "0 0 8px 0",
    fontSize: 15,
  },
  vocabList: {
    paddingLeft: 18,
    margin: 0,
    display: "grid",
    gap: 4,
  },
  promptList: {
    paddingLeft: 18,
    margin: 0,
    display: "grid",
    gap: 6,
  },
  storyCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 12,
    background: "#ffffff",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  storyHeader: {
    fontWeight: 700,
    marginBottom: 6,
    color: "#1f2937",
  },
  twist: {
    color: "#2563eb",
    fontWeight: 600,
    marginTop: 6,
    fontSize: 14,
  },
  challengeList: {
    paddingLeft: 20,
    display: "grid",
    gap: 6,
    margin: 0,
    color: "#111827",
  },
  timeline: {
    display: "grid",
    gap: 12,
  },
  timelineBlock: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 12,
    background: "#f9fafb",
  },
  timelineLabel: {
    fontWeight: 700,
    marginBottom: 8,
  },
  timelineList: {
    paddingLeft: 18,
    margin: 0,
    display: "grid",
    gap: 6,
    color: "#111827",
  },
  tipGrid: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
  tipCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 12,
    background: "#ffffff",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  tipTitle: {
    margin: "0 0 6px 0",
    fontSize: 15,
  },
  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    background: "#fef3c7",
    color: "#92400e",
    border: "1px solid #f59e0b",
    fontSize: 13,
  },
};

export default App;
