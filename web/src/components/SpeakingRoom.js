import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { speakingSheetQuestions } from "../data/speakingSheet";

const levels = ["A1", "A2", "B1", "B2", "C1"];

const teilGuidance = {
  A1: {
    "Teil 1": {
      title: "Kurzvorstellung (Name, Herkunft, Wohnort, Arbeit/Studium)",
      description:
        "Stelle dich kurz vor. Wiederhole deinen Namen, wo du wohnst, was du machst und 1–2 Hobbys, damit die KI deine Aussprache und Klarheit bewerten kann.",
      steps: [
        "Aufnahme starten, laut sprechen und ca. 30–45 Sekunden bleiben.",
        "Nenne Name, Alter, Wohnort, Herkunft, Beruf/Studium und ein Hobby.",
        "Beende die Aufnahme und höre sie dir noch einmal an. Wiederhole mit kleinen Variationen.",
      ],
    },
    "Teil 2": {
      title: "Fragen stellen und beantworten (Thema + Stichwort)",
      description:
        "Wähle ein Thema und das Stichwort darunter. Stelle 2–3 einfache Fragen dazu, beantworte sie selbst laut und lass die KI mitmarken.",
      steps: [
        "Klicke Aufnahme, stelle eine W-Frage und antworte kurz (z. B. Thema Uhr → Frage: Wann öffnet…?).",
        "Baue einfache Ja/Nein-Fragen ein und beantworte sie ebenfalls.",
        "Stoppen, anhören und erneut üben mit einer neuen Frage.",
      ],
    },
    "Teil 3": {
      title: "Um etwas bitten oder eine Bitte ablehnen", 
      description:
        "Formuliere höfliche Bitten oder kleine Planungen (z. B. um Hilfe bitten, um einen Termin fragen). Nutze Modalverben wie können/möchten und ein kurzes weil als Begründung.",
      steps: [
        "Starte Aufnahme, nenne kurz die Situation und formuliere deine Bitte.",
        "Schlage eine Zeit/Option vor und reagiere mit Zustimmung oder höflicher Ablehnung.",
        "Stoppen, anhören und dieselbe Bitte mit anderer Option wiederholen.",
      ],
    },
  },
  A2: {
    "Teil 1": {
      title: "Thema wählen und über dich erzählen",
      description:
        "Suche dir ein Thema (z. B. Reise, Alltag, Arbeit) und sprich 1–2 Minuten darüber. Fokus: du selbst, kurze Beispiele, ein Gefühl oder eine Meinung.",
      steps: [
        "Aufnahme starten und 3 Punkte nennen: kurze Einleitung, 2 Details, Abschluss.",
        "Nutze weil/dass für einfache Begründungen.",
        "Stoppen, anhören, ein neues Detail ergänzen und erneut aufnehmen.",
      ],
    },
    "Teil 2": {
      title: "Fragen beantworten und Rückfragen stellen",
      description:
        "Reagiere auf eine Frage zum Thema und stelle selbst eine passende Rückfrage. Halte die Sätze verbunden und klar.",
      steps: [
        "Starte Aufnahme, beantworte die Leitfrage mit 2–3 Sätzen.",
        "Stelle danach eine eigene Rückfrage zum gleichen Thema und beantworte sie kurz.",
        "Stoppen und prüfen, ob Frageformen und Verbposition stimmen.",
      ],
    },
    "Teil 3": {
      title: "Einen Termin/Plan mit jemandem abstimmen",
      description:
        "Plane etwas gemeinsam (Treffen, Essen, Sport). Mache Vorschläge, höre auf Konflikte und treffe eine Entscheidung.",
      steps: [
        "Aufnahme starten, zwei Termine/Optionen vorschlagen.",
        "Sage, welche Option besser passt und warum.",
        "Stoppen, anhören und die Planung mit einer Bestätigung abschließen.",
      ],
    },
  },
  B1: {
    "Teil 1": {
      title: "Kurze Präsentation zu einem Alltagsthema",
      description:
        "Gib eine Mini-Präsentation (Einleitung, 2–3 Punkte, Meinung, Abschluss). Wähle ein Stichwort und nutze Beispiele.",
      steps: [
        "Aufnahme starten, klar gliedern: Einstieg → Punkte → Meinung.",
        "Nutze Verknüpfungen (erstens, außerdem, deshalb).",
        "Stoppen, anhören und Schwachstellen (Aussprache, Wortwahl) notieren.",
      ],
    },
    "Teil 2": {
      title: "Fragen zur Präsentation beantworten",
      description:
        "Simuliere Rückfragen: fasse die Frage kurz zusammen, stimme zu oder lehne ab und begründe.",
      steps: [
        "Aufnahme starten und eine mögliche Frage laut wiederholen.",
        "Beantworte mit klarer Meinung + Begründung; füge ein Beispiel an.",
        "Stoppen und prüfen, ob du verständlich reagierst und Verbposition hältst.",
      ],
    },
    "Teil 3": {
      title: "Gemeinsam planen und entscheiden",
      description:
        "Plane eine Veranstaltung/Aktivität mit einer anderen Person. Vergleiche Optionen, handle einen Kompromiss aus und fasse zusammen.",
      steps: [
        "Aufnahme starten, zwei Optionen vorstellen und Vor-/Nachteile nennen.",
        "Formuliere Zustimmung oder Ablehnung höflich und schlage einen Kompromiss vor.",
        "Stoppen, anhören und eine klare Entscheidung formulieren.",
      ],
    },
  },
};

const SpeakingRoom = () => {
  const [levelFilter, setLevelFilter] = useState(levels[0]);
  const [teilFilter, setTeilFilter] = useState("Teil 1");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState("");
  const [recordingUrl, setRecordingUrl] = useState(null);
  const mediaRecorderRef = useRef(null);

  const promptsForLevel = useMemo(
    () => speakingSheetQuestions.filter((prompt) => prompt.level === levelFilter),
    [levelFilter]
  );

  const teilOptions = useMemo(() => {
    const uniqueTeile = Array.from(
      new Set(promptsForLevel.map((prompt) => prompt.teilLabel || prompt.teilId || prompt.teil))
    );

    return uniqueTeile.length ? uniqueTeile : ["Teil 1", "Teil 2", "Teil 3"];
  }, [promptsForLevel]);

  useEffect(() => {
    if (!teilOptions.includes(teilFilter)) {
      setTeilFilter(teilOptions[0]);
    }
  }, [teilOptions, teilFilter]);

  const filteredPrompts = useMemo(() => {
    const normalizedTeil = (teilFilter || "").toLowerCase();

    return promptsForLevel.filter((prompt) => {
      const teilLabel = (prompt.teilLabel || "").toLowerCase();
      const teilId = (prompt.teilId || "").toLowerCase();
      return !normalizedTeil || teilLabel === normalizedTeil || teilId === normalizedTeil;
    });
  }, [promptsForLevel, teilFilter]);

  useEffect(() => {
    setSelectedPrompt(filteredPrompts[0] || null);
  }, [filteredPrompts]);

  const guidance = useMemo(() => {
    const levelGuide = teilGuidance[levelFilter] || {};
    return levelGuide[teilFilter] || null;
  }, [levelFilter, teilFilter]);

  const aiPayload = useMemo(() => {
    if (!selectedPrompt) return "Wähle ein Thema, um es an die KI zu schicken.";

    const keyword = selectedPrompt.keywordSubtopic
      ? ` (Stichwort: ${selectedPrompt.keywordSubtopic})`
      : "";

    return `Niveau: ${selectedPrompt.level}\nTeil: ${selectedPrompt.teilLabel}\nThema: ${selectedPrompt.topicPrompt}${keyword}`;
  }, [selectedPrompt]);

  const copyToClipboard = async () => {
    if (!selectedPrompt || !navigator?.clipboard) return;

    try {
      await navigator.clipboard.writeText(aiPayload);
      alert("Thema kopiert. Füge es im KI-Chat ein.");
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const startRecording = async () => {
    setRecordingError("");
    setRecordingUrl(null);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setRecordingError("Aufnahme nicht möglich: Kein Mikrofonzugriff im Browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordingUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Recording failed", err);
      setRecordingError("Bitte Mikrofon-Zugriff erlauben oder ein anderes Gerät testen.");
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.helperText, margin: 0 }}>Exam speaking room</p>
            <h2 style={{ ...styles.sectionTitle, margin: "4px 0" }}>Warm-up prompts and responses</h2>
            <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
              Choose a level and practise answering out loud. Keep answers short, stay calm, and repeat each prompt a few times with
              different ideas. Record your attempt so the AI can mark it.
            </p>
          </div>
          <span style={styles.badge}>Time-box: 10–12 minutes</span>
        </div>
      </section>

      <section style={styles.card}>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <label style={styles.label}>Niveau</label>
              <div style={styles.segmentedControl}>
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    style={levelFilter === lvl ? styles.segmentedActive : styles.segmentedButton}
                    onClick={() => setLevelFilter(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <label style={styles.label}>Teil</label>
              <div style={styles.segmentedControl}>
                {teilOptions.map((teil) => (
                  <button
                    key={teil}
                    style={teilFilter === teil ? styles.segmentedActive : styles.segmentedButton}
                    onClick={() => setTeilFilter(teil)}
                  >
                    {teil}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, background: "#f9fafb", margin: 0 }}>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Select a topic to rehearse and pass straight to the AI coach. Use the Teil buttons to view Teil 1, 2, or 3 prompts for
              your chosen level. Each Teil below explains exactly what to record so the keywords are no longer just a list.
            </p>
            <ul style={{ margin: "8px 0 0 18px", color: "#4b5563", fontSize: 13, lineHeight: 1.4 }}>
              <li>📼 Quick start: Pick your level → choose Teil → pick a topic → hit "Aufnahme starten" → speak for 30–90 seconds.</li>
              <li>🧭 Stay focused: Cover the 2–3 steps listed for the Teil. That is what the AI will mark.</li>
              <li>🗣️ Speak first, then read: Glance at the keywords for ideas, then look away while you answer to practise fluency.</li>
              <li>🧪 How the AI marks you: Aufgabenbezug (passt du zur Aufgabe?), Verständlichkeit/Aussprache, Grammatik/Verbposition, Wortschatz/Kohärenz.</li>
            </ul>
            <div style={{ ...styles.card, padding: 12, margin: "10px 0 0 0", background: "#eef2ff" }}>
              <strong style={{ display: "block", marginBottom: 4 }}>KI-Feedback bekommen</strong>
              <ol style={{ margin: 0, paddingLeft: 18, color: "#374151", fontSize: 13, lineHeight: 1.5 }}>
                <li>Wähle Thema + Teil und klicke unten „In die Zwischenablage kopieren“.</li>
                <li>Starte die Aufnahme und sprich 30–90 Sekunden. Speichere die Probe (oder notiere die wichtigsten Sätze).</li>
                <li>Füge den kopierten Text im KI-Chat ein, lade die Audio-Datei hoch <em>(falls der Chat Audio erlaubt)</em> oder schreibe eine kurze Zusammenfassung deiner Antwort.</li>
                <li>Bitte die KI um Bewertung nach den Kriterien oben und um 2–3 Verbesserungsvorschläge.</li>
              </ol>
            </div>
          </div>
        </div>

        {guidance ? (
          <div style={{ ...styles.card, background: "#f8fafc", marginTop: 12 }}>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <p style={{ ...styles.helperText, margin: 0 }}>Was mache ich in diesem Teil?</p>
                  <h3 style={{ margin: 0 }}>{guidance.title}</h3>
                  <p style={{ ...styles.helperText, margin: 0 }}>{guidance.description}</p>
                  <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "#374151", fontSize: 13 }}>
                    {guidance.steps.map((step, index) => (
                      <li key={index} style={{ marginBottom: 4 }}>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ minWidth: 260, display: "grid", gap: 8 }}>
                  <p style={{ ...styles.helperText, margin: 0 }}>Eigenes Audio aufnehmen</p>
                  <button
                    style={isRecording ? styles.dangerButton : styles.primaryButton}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? "Aufnahme stoppen" : "Aufnahme starten"}
                  </button>
                  {isRecording ? (
                    <span style={{ color: "#b91c1c", fontWeight: 600 }}>Recording … sprich jetzt laut</span>
                  ) : null}
                  {recordingError ? (
                    <p style={{ ...styles.helperText, color: "#b91c1c", margin: 0 }}>{recordingError}</p>
                  ) : null}
                  {recordingUrl ? (
              <div style={{ display: "grid", gap: 4 }}>
                <span style={{ ...styles.helperText, margin: 0 }}>Probe-Aufnahme</span>
                <audio controls src={recordingUrl} style={{ width: "100%" }} />
                <span style={{ ...styles.helperText, margin: 0 }}>
                  Tipp: Höre dir die Lautstärke an. Wenn es zu leise klingt, sprich näher am Mikro oder wiederhole die Probe.
                </span>
              </div>
            ) : null}
          </div>
        </div>
            </div>
          </div>
        ) : null}

        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              style={{
                ...styles.uploadCard,
                border: selectedPrompt?.id === prompt.id ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                cursor: "pointer",
              }}
              onClick={() => setSelectedPrompt(prompt)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "grid", gap: 4 }}>
                  <span style={styles.levelPill}>{prompt.level}</span>
                  <strong>{prompt.teilLabel}</strong>
                  <span style={{ ...styles.helperText, fontWeight: 600 }}>{prompt.topicPrompt}</span>
                  {prompt.keywordSubtopic ? (
                    <span style={{ ...styles.helperText, color: "#4f46e5" }}>
                      Stichwort: {prompt.keywordSubtopic}
                    </span>
                  ) : null}
                </div>
                <div style={{ display: "grid", gap: 6, minWidth: 220 }}>
                  <span style={{ ...styles.helperText, margin: 0 }}>KI-Anweisung</span>
                  <div style={{ ...styles.card, padding: 10, margin: 0 }}>
                    <p style={{ ...styles.helperText, margin: 0 }}>
                      {`Level ${prompt.level}, ${prompt.teilLabel}. Thema: ${prompt.topicPrompt}${prompt.keywordSubtopic ? ` (${prompt.keywordSubtopic})` : ""}.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...styles.card, marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div>
              <p style={{ ...styles.helperText, margin: 0 }}>Ausgewähltes Thema</p>
              <h3 style={{ margin: "4px 0" }}>{selectedPrompt?.topicPrompt || "Bitte ein Thema wählen"}</h3>
              <p style={{ ...styles.helperText, margin: 0 }}>
                Kopiere die Angaben und starte den KI-Dialog mit dem gewünschten Teil.
              </p>
              <ul style={{ margin: "8px 0 0 18px", color: "#4b5563", fontSize: 13, lineHeight: 1.4 }}>
                <li>👉 Lies die Stichwörter einmal laut vor, damit du weißt, was vorkommen soll.</li>
                <li>👉 Starte danach die Aufnahme und sprich frei, ohne ständig auf den Text zu schauen.</li>
                <li>👉 Speichere das Thema mit dem Button rechts, um es schnell in die KI zu kopieren.</li>
              </ul>
            </div>
            <button style={styles.primaryButton} disabled={!selectedPrompt} onClick={copyToClipboard}>
              In die Zwischenablage kopieren
            </button>
          </div>

          <pre
            style={{
              background: "#0f172a",
              color: "#e2e8f0",
              padding: 12,
              borderRadius: 8,
              marginTop: 12,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {aiPayload}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default SpeakingRoom;
