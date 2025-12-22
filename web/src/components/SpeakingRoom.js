import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { speakingSheetQuestions } from "../data/speakingSheet";

const levels = ["A1", "A2", "B1", "B2", "C1"];
const goethePracticeLink =
  "https://script.google.com/macros/s/AKfycbyJ5lTeXUgaGw-rejDuh_2ex7El_28JgKLurOOsO1c8LWfVE-Em2-vuWuMn1hC5-_IN/exec";

const teilGuidance = {
  A1: {
    "Teil 1": {
      title: "Short introduction (name, origin, city, work/study)",
      description:
        "Introduce yourself briefly. Repeat your name, where you live, what you do, and 1–2 hobbies so the AI can judge pronunciation and clarity.",
      steps: [
        "Start recording, speak clearly, and keep it to about 30–45 seconds.",
        "Say your name, age, city, origin, job/studies, and one hobby.",
        "Stop the clip, listen back, then repeat with small variations.",
      ],
    },
    "Teil 2": {
      title: "Ask and answer questions (topic + keyword)",
      description:
        "Choose a topic and its keyword. Ask 2–3 simple questions, answer them aloud yourself, and let the AI score you.",
      steps: [
        "Click record, ask a WH-question, and answer briefly (e.g., topic: time → question: When does it open?).",
        "Add simple yes/no questions and answer those too.",
        "Stop, listen back, and practise again with a new question.",
      ],
    },
    "Teil 3": {
      title: "Make a request or politely decline",
      description:
        "Phrase polite requests or small plans (e.g., ask for help, ask for an appointment). Use modal verbs like can/would like and a short because to justify.",
      steps: [
        "Start recording, briefly name the situation, and state your request.",
        "Propose a time/option and respond with agreement or a polite no.",
        "Stop, listen, and repeat the same request with a different option.",
      ],
    },
  },
  A2: {
    "Teil 1": {
      title: "Pick a topic and talk about yourself",
      description:
        "Choose a topic (e.g., travel, daily life, work) and speak for 1–2 minutes. Focus on yourself, short examples, a feeling, or an opinion.",
      steps: [
        "Start recording and cover three points: short intro, two details, conclusion.",
        "Use because/that for simple reasons.",
        "Stop, listen back, add one new detail, and record again.",
      ],
    },
    "Teil 2": {
      title: "Answer a question and add a follow-up",
      description:
        "Respond to a question about the topic and ask your own follow-up. Keep sentences connected and clear.",
      steps: [
        "Start recording and answer the main question in 2–3 sentences.",
        "Then ask a related follow-up question and answer it briefly.",
        "Stop and check if your question forms and verb positions are correct.",
      ],
    },
    "Teil 3": {
      title: "Agree on a time/plan with someone",
      description:
        "Plan something together (meeting, meal, sport). Make suggestions, notice conflicts, and reach a decision.",
      steps: [
        "Start recording and propose two times/options.",
        "State which option works better and why.",
        "Stop, listen, and finish the plan with a clear confirmation.",
      ],
    },
  },
  B1: {
    "Teil 1": {
      title: "Short presentation on an everyday topic",
      description:
        "Give a mini-presentation (intro, 2–3 points, opinion, ending). Choose a keyword and use examples.",
      steps: [
        "Start recording and structure clearly: opening → points → opinion.",
        "Use connectors (firstly, also, therefore).",
        "Stop, listen, and note weak spots (pronunciation, word choice).",
      ],
    },
    "Teil 2": {
      title: "Answer questions about the presentation",
      description:
        "Simulate follow-up questions: briefly repeat the question, agree or disagree, and justify.",
      steps: [
        "Start recording and say a possible question out loud.",
        "Answer with a clear opinion and reason; add an example.",
        "Stop and check you were clear and kept verb position.",
      ],
    },
    "Teil 3": {
      title: "Plan together and make a decision",
      description:
        "Plan an activity with another person. Compare options, negotiate a compromise, and summarise.",
      steps: [
        "Start recording, present two options, and list pros/cons.",
        "Agree or disagree politely and suggest a compromise.",
        "Stop, listen, and state a clear decision.",
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
    if (!selectedPrompt) return "Choose a topic to send to the AI.";

    const keyword = selectedPrompt.keywordSubtopic
      ? ` (Keyword: ${selectedPrompt.keywordSubtopic})`
      : "";

    return `Level: ${selectedPrompt.level}\nPart: ${selectedPrompt.teilLabel}\nTopic: ${selectedPrompt.topicPrompt}${keyword}`;
  }, [selectedPrompt]);

  const copyToClipboard = async () => {
    if (!selectedPrompt || !navigator?.clipboard) return;

    try {
      await navigator.clipboard.writeText(aiPayload);
      alert("Topic copied. Paste it into your AI chat.");
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
      setRecordingError("Recording not possible: no microphone access in this browser.");
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
      setRecordingError("Please allow microphone access or try another device.");
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
              <label style={styles.label}>Level</label>
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
              <label style={styles.label}>Part (Teil)</label>
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
              <li>📼 Quick start: Pick your level → choose Teil → pick a topic → hit "Start recording" → speak for 30–90 seconds.</li>
              <li>🧭 Stay focused: Cover the 2–3 steps listed for the Teil. That is what the AI will mark.</li>
              <li>🗣️ Speak first, then read: Glance at the keywords for ideas, then look away while you answer to practise fluency.</li>
            </ul>
          </div>
        </div>

        {guidance ? (
          <div style={{ ...styles.card, background: "#f8fafc", marginTop: 12 }}>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "grid", gap: 6 }}>
                  <p style={{ ...styles.helperText, margin: 0 }}>What do I do in this part?</p>
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
                  <p style={{ ...styles.helperText, margin: 0 }}>Record your answer</p>
                  <button
                    style={isRecording ? styles.dangerButton : styles.primaryButton}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? "Stop recording" : "Start recording"}
                  </button>
                  {isRecording ? (
                    <span style={{ color: "#b91c1c", fontWeight: 600 }}>Recording … speak out loud now</span>
                  ) : null}
                  {recordingError ? (
                    <p style={{ ...styles.helperText, color: "#b91c1c", margin: 0 }}>{recordingError}</p>
                  ) : null}
                  {recordingUrl ? (
                    <div style={{ display: "grid", gap: 4 }}>
                      <span style={{ ...styles.helperText, margin: 0 }}>Practice recording</span>
                      <audio controls src={recordingUrl} style={{ width: "100%" }} />
                      <span style={{ ...styles.helperText, margin: 0 }}>
                        Tip: Check your volume. If it sounds too quiet, move closer to the mic or redo the clip.
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
                      Keyword: {prompt.keywordSubtopic}
                    </span>
                  ) : null}
                </div>
                <div style={{ display: "grid", gap: 6, minWidth: 220 }}>
                  <span style={{ ...styles.helperText, margin: 0 }}>AI prompt</span>
                  <div style={{ ...styles.card, padding: 10, margin: 0 }}>
                    <p style={{ ...styles.helperText, margin: 0 }}>
                      {`Level ${prompt.level}, ${prompt.teilLabel}. Topic: ${prompt.topicPrompt}${prompt.keywordSubtopic ? ` (${prompt.keywordSubtopic})` : ""}.`}
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
              <p style={{ ...styles.helperText, margin: 0 }}>Selected topic</p>
              <h3 style={{ margin: "4px 0" }}>{selectedPrompt?.topicPrompt || "Please choose a topic"}</h3>
              <p style={{ ...styles.helperText, margin: 0 }}>
                Copy the details and start your AI chat for the chosen part.
              </p>
              <ul style={{ margin: "8px 0 0 18px", color: "#4b5563", fontSize: 13, lineHeight: 1.4 }}>
                <li>👉 Read the keywords aloud once so you know what should appear.</li>
                <li>👉 Then start recording and speak freely without staring at the text.</li>
                <li>👉 Save the topic with the button on the right to copy it into the AI quickly.</li>
              </ul>
            </div>
            <button style={styles.primaryButton} disabled={!selectedPrompt} onClick={copyToClipboard}>
              Copy to clipboard
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
