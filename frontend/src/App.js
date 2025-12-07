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
        </div>
      </header>

      <main>
        {activePage === "sprechen" && renderSprechenPage()}
        {activePage === "schreiben" && renderSchreibenPage()}
        {activePage === "vocabs" && renderVocabsPage()}
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
