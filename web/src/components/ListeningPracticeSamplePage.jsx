import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import { fetchA1MockAudioPlaybackUrl } from "../services/a1AudioService";
import { fetchA1ExamHorenAudioPlaybackUrl } from "../services/a1ExamHorenAudioService";
import { fetchA2MockAudioPlaybackUrl } from "../services/a2AudioService";
import { fetchC1ExamHorenAudioPlaybackUrl } from "../services/c1ExamHorenAudioService";
import { A1_GOETHE_LISTENING_MOCK } from "./A1GoetheListeningMockPreview";
import { A2_GOETHE_LISTENING_TEIL1 } from "./A2GoetheListeningMockTeil1Preview";
import { A2_GOETHE_LISTENING_TEIL2, A2ListeningTeil2PictureScene } from "./A2GoetheListeningMockTeil2Preview";
import { A2_GOETHE_LISTENING_TEIL3, A2ListeningTeil3Picture } from "./A2GoetheListeningMockTeil3Preview";
import { A2_GOETHE_LISTENING_TEIL4 } from "./A2GoetheListeningMockTeil4Preview";
import {
  A1_EXAM_HOEREN_SAMPLE_2_TEIL1,
  A1_EXAM_HOEREN_SAMPLE_2_TEIL2,
  A1_EXAM_HOEREN_SAMPLE_2_TEIL3,
} from "../data/a1ExamHorenSample2";
import {
  C1_EXAM_HOEREN_SAMPLE_1,
  C1_EXAM_HOEREN_SAMPLE_1_TEIL2,
  C1_EXAM_HOEREN_SAMPLE_1_TEIL3,
  C1_EXAM_HOEREN_SAMPLE_1_TEIL4,
} from "../data/c1ExamHorenSample1";
import "./A1GoetheListeningMockPreview.css";
import "./A1ExamHorenSample2.css";
import "./A2GoetheListeningMockTeil2Preview.css";
import "./A2GoetheListeningMockTeil3Preview.css";

const A2_PARTS = Object.freeze([
  { key: "teil1", audioPart: "teil-1", data: A2_GOETHE_LISTENING_TEIL1 },
  { key: "teil2", audioPart: "teil-2", data: A2_GOETHE_LISTENING_TEIL2 },
  { key: "teil3", audioPart: "teil-3", data: A2_GOETHE_LISTENING_TEIL3 },
  { key: "teil4", audioPart: "teil-4", data: A2_GOETHE_LISTENING_TEIL4 },
]);

const A1_PARTS = Object.freeze([
  { key: "teil1", audioPart: "teil-1", data: A1_GOETHE_LISTENING_MOCK.teil1 },
  { key: "teil2", audioPart: "teil-2", data: A1_GOETHE_LISTENING_MOCK.teil2 },
  { key: "teil3", audioPart: "teil-3", data: A1_GOETHE_LISTENING_MOCK.teil3 },
]);

const A1_SAMPLE_2_PARTS = Object.freeze([
  { key: "teil1", audioPart: "teil-1", data: A1_EXAM_HOEREN_SAMPLE_2_TEIL1 },
  { key: "teil2", audioPart: "teil-2", data: A1_EXAM_HOEREN_SAMPLE_2_TEIL2 },
  { key: "teil3", audioPart: "teil-3", data: A1_EXAM_HOEREN_SAMPLE_2_TEIL3 },
]);

const C1_PARTS = Object.freeze([
  { key: "teil1", audioPart: "teil-1", data: C1_EXAM_HOEREN_SAMPLE_1 },
  { key: "teil2", audioPart: "teil-2", data: C1_EXAM_HOEREN_SAMPLE_1_TEIL2 },
  { key: "teil3", audioPart: "teil-3", data: C1_EXAM_HOEREN_SAMPLE_1_TEIL3 },
  { key: "teil4", audioPart: "teil-4", data: C1_EXAM_HOEREN_SAMPLE_1_TEIL4 },
]);

const answerKeyForPart = (level, part) => {
  if (level === "A2" && part.key === "teil2") {
    return part.data.tasks.map((task) => ({
      number: task.number,
      answer: task.answer,
      prompt: task.day,
    }));
  }
  return (part.data.questions || []).map((question) => ({
    number: question.number,
    answer: question.answer,
    prompt: question.question || question.statement || "",
  }));
};

const SampleAudio = ({ level, sampleId, part, objectKey, plays, idToken }) => {
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAudio = async () => {
    if (audioUrl || loading) return;
    setLoading(true);
    setError("");
    try {
      const result =
        level === "A1" && sampleId === "sample-2"
          ? await fetchA1ExamHorenAudioPlaybackUrl({
              sampleId,
              part,
              key: objectKey,
              idToken,
            })
          : level === "C1"
            ? await fetchC1ExamHorenAudioPlaybackUrl({
                sampleId: "sample-1",
                part,
                key: objectKey,
                idToken,
              })
            : await (level === "A2" ? fetchA2MockAudioPlaybackUrl : fetchA1MockAudioPlaybackUrl)({
                mockId: "mock-01",
                part,
                key: objectKey,
                idToken,
              });
      setAudioUrl(result.url);
    } catch (loadError) {
      setError(loadError?.response?.data?.error || loadError?.message || "Could not load audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="a1-hoeren-mock-part-audio">
      <div className="a1-hoeren-mock-part-audio-copy">
        <strong>Exam audio</strong>
        <p>
          {level === "C1" || (level === "A1" && sampleId === "sample-2")
            ? `This audio belongs to ${level} Hören practice in the Exams Room.`
            : plays === 2
              ? "The required repetition is already included in the audio."
              : "This audio is heard once in the mock."}
        </p>
      </div>

      {audioUrl ? (
        <audio
          className="a1-hoeren-mock-native-audio"
          controls
          controlsList="nodownload"
          src={audioUrl}
          preload="metadata"
        >
          Your browser does not support this audio.
        </audio>
      ) : (
        <button type="button" className="a1-hoeren-mock-load-audio" onClick={loadAudio} disabled={loading}>
          {loading ? "Loading audio …" : "Load audio"}
        </button>
      )}

      <span className="a1-hoeren-mock-play-count">
        {level === "C1" || (level === "A1" && sampleId === "sample-2")
          ? `${plays}× practice audio`
          : `${plays}× in the mock audio`}
      </span>
      {error ? <p className="a1-hoeren-mock-audio-error">{error}</p> : null}
    </div>
  );
};

const ChoiceOptions = ({ name, options, value, onChange, disabled }) => (
  <div style={{ display: "grid", gap: 8 }}>
    {options.map((option) => (
      <label
        key={option.id}
        style={{
          display: "grid",
          gridTemplateColumns: "auto 32px 1fr",
          gap: 10,
          alignItems: "center",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: "10px 12px",
          background: "#ffffff",
        }}
      >
        <input
          type="radio"
          name={name}
          checked={String(value) === String(option.id)}
          onChange={() => onChange(option.id)}
          disabled={disabled}
        />
        <strong>{option.id}</strong>
        <span>{option.label || option.short || option.id}</span>
      </label>
    ))}
  </div>
);

const A1ListeningPictureScene = ({ picture }) => {
  const type = picture?.type || "";
  const value = picture?.value || "";

  if (type === "clock") {
    const hour = Number(String(value).split(":")[0]) % 12;
    const angle = (hour / 12) * Math.PI * 2 - Math.PI / 2;
    const x = 60 + Math.cos(angle) * 25;
    const y = 60 + Math.sin(angle) * 25;
    return (
      <svg viewBox="0 0 120 120" className="a1-practice-picture-svg" aria-hidden="true">
        <circle cx="60" cy="60" r="44" fill="white" stroke="currentColor" strokeWidth="3" />
        <line x1="60" y1="60" x2={x} y2={y} stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <line x1="60" y1="60" x2="60" y2="29" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="60" r="4" fill="currentColor" />
        <text x="60" y="108" textAnchor="middle" fontSize="14" fontWeight="700">{value}</text>
      </svg>
    );
  }

  if (type === "train") {
    const cancelled = value === "cancelled";
    const delayed = value === "delay";
    return (
      <svg viewBox="0 0 160 115" className="a1-practice-picture-svg" aria-hidden="true">
        <rect x="28" y="21" width="104" height="64" rx="8" fill="white" stroke="currentColor" strokeWidth="3" />
        <rect x="42" y="32" width="29" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect x="89" y="32" width="29" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <line x1="80" y1="21" x2="80" y2="84" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="51" cy="90" r="8" fill="white" stroke="currentColor" strokeWidth="3" />
        <circle cx="109" cy="90" r="8" fill="white" stroke="currentColor" strokeWidth="3" />
        {cancelled ? (
          <>
            <line x1="35" y1="17" x2="129" y2="99" stroke="currentColor" strokeWidth="7" />
            <line x1="129" y1="17" x2="35" y2="99" stroke="currentColor" strokeWidth="7" />
          </>
        ) : delayed ? (
          <>
            <circle cx="135" cy="28" r="18" fill="white" stroke="currentColor" strokeWidth="3" />
            <line x1="135" y1="28" x2="135" y2="18" stroke="currentColor" strokeWidth="3" />
            <line x1="135" y1="28" x2="144" y2="33" stroke="currentColor" strokeWidth="3" />
            <text x="135" y="61" textAnchor="middle" fontSize="14" fontWeight="800">+10</text>
          </>
        ) : (
          <text x="80" y="111" textAnchor="middle" fontSize="14" fontWeight="800">früher</text>
        )}
      </svg>
    );
  }

  if (type === "action") {
    if (value === "calendar") {
      return (
        <svg viewBox="0 0 140 110" className="a1-practice-picture-svg" aria-hidden="true">
          <rect x="28" y="20" width="84" height="72" rx="5" fill="white" stroke="currentColor" strokeWidth="3" />
          <line x1="28" y1="39" x2="112" y2="39" stroke="currentColor" strokeWidth="3" />
          <text x="70" y="72" textAnchor="middle" fontSize="24" fontWeight="800">MO</text>
        </svg>
      );
    }
    if (value === "email") {
      return (
        <svg viewBox="0 0 140 110" className="a1-practice-picture-svg" aria-hidden="true">
          <rect x="20" y="28" width="100" height="60" rx="4" fill="white" stroke="currentColor" strokeWidth="3" />
          <path d="M22 31 L70 66 L118 31" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 140 110" className="a1-practice-picture-svg" aria-hidden="true">
        <path d="M43 25 C39 32 40 42 45 51 L57 64 C62 69 67 70 73 67 L83 61 C90 69 97 76 105 81 L99 91 C96 96 91 98 85 96 C60 88 40 68 32 43 C30 37 34 31 43 25 Z" fill="white" stroke="currentColor" strokeWidth="3" />
        <path d="M95 27 C107 31 115 40 119 52 M94 38 C101 40 106 46 109 52" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  }

  if (type === "apples") {
    return (
      <svg viewBox="0 0 160 110" className="a1-practice-picture-svg" aria-hidden="true">
        <path d="M36 78 H104 L113 96 H28 Z" fill="white" stroke="currentColor" strokeWidth="3" />
        {[45, 67, 89].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="61" r="14" fill="white" stroke="currentColor" strokeWidth="2.5" />
            <path d={`M${cx} 47 Q${cx + 3} 39 ${cx + 9} 36`} fill="none" stroke="currentColor" strokeWidth="2.5" />
          </g>
        ))}
        <rect x="113" y="22" width="38" height="28" rx="4" fill="white" stroke="currentColor" strokeWidth="2.5" />
        <text x="132" y="42" textAnchor="middle" fontSize="15" fontWeight="800">{value}</text>
      </svg>
    );
  }

  const labels = {
    "bread-milk": ["Brot", "Milch"],
    "cheese-water": ["Käse", "Wasser"],
    "fruit-bread": ["Obst", "Brot"],
  }[value] || ["Brot", "Milch"];

  return (
    <svg viewBox="0 0 160 110" className="a1-practice-picture-svg" aria-hidden="true">
      <rect x="12" y="23" width="62" height="62" rx="8" fill="white" stroke="currentColor" strokeWidth="3" />
      <rect x="86" y="23" width="62" height="62" rx="8" fill="white" stroke="currentColor" strokeWidth="3" />
      <text x="43" y="60" textAnchor="middle" fontSize="13" fontWeight="800">{labels[0]}</text>
      <text x="117" y="60" textAnchor="middle" fontSize="13" fontWeight="800">{labels[1]}</text>
    </svg>
  );
};

const A1PictureOptions = ({ name, options, value, onChange, disabled }) => (
  <div className="a1-practice-picture-options" role="radiogroup">
    {options.map((option) => (
      <label
        key={option.id}
        className={value === option.id ? "a1-practice-picture-card selected" : "a1-practice-picture-card"}
      >
        <div className="a1-practice-picture-frame">
          <A1ListeningPictureScene picture={option.picture} />
        </div>
        <div className="a1-practice-picture-answer">
          <input
            type="radio"
            name={name}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
            disabled={disabled}
          />
          <strong>{option.id})</strong>
          <span>{option.label}</span>
        </div>
      </label>
    ))}
  </div>
);

const BinaryOptions = ({ name, value, onChange, disabled, labels }) => (
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
    {labels.map(([id, label]) => (
      <label
        key={id}
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: "10px 12px",
          background: "#ffffff",
        }}
      >
        <input
          type="radio"
          name={name}
          checked={String(value).toLowerCase() === String(id).toLowerCase()}
          onChange={() => onChange(id)}
          disabled={disabled}
        />
        <span>{label}</span>
      </label>
    ))}
  </div>
);

export default function ListeningPracticeSamplePage({ level = "A1", sampleId = "sample-1" }) {
  const navigate = useNavigate();
  const { idToken } = useAuth();
  const requestedLevel = String(level || "A1").toUpperCase();
  const normalizedLevel = ["A1", "A2", "C1"].includes(requestedLevel) ? requestedLevel : "A1";
  const parts =
    normalizedLevel === "C1"
      ? C1_PARTS
      : normalizedLevel === "A2"
        ? A2_PARTS
        : sampleId === "sample-2"
          ? A1_SAMPLE_2_PARTS
          : A1_PARTS;
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = useMemo(
    () => parts.flatMap((part) =>
      answerKeyForPart(normalizedLevel, part).map((question) => ({
        ...question,
        key: `${part.key}-${question.number}`,
      }))
    ),
    [normalizedLevel, parts],
  );

  const answered = questions.filter((question) => answers[question.key]).length;
  const score = questions.filter(
    (question) => String(answers[question.key] || "").toLowerCase() === String(question.answer).toLowerCase()
  ).length;

  const setAnswer = (key, value) => {
    if (submitted) return;
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const feedback = (key, answer) => {
    if (!submitted) return null;
    const correct = String(answers[key] || "").toLowerCase() === String(answer).toLowerCase();
    return (
      <p style={{ margin: "8px 0 0", fontWeight: 700, color: correct ? "#166534" : "#991b1b" }}>
        {correct ? "Correct." : `Correct answer: ${answer}`}
      </p>
    );
  };

  const renderPartQuestions = (part) => {
    if (normalizedLevel === "A1" && sampleId === "sample-2" && part.key === "teil1") {
      return (
        <div className="a1-practice-picture-question-list">
          {(part.data.questions || []).map((question) => {
            const key = `${part.key}-${question.number}`;
            return (
              <article className="a1-practice-picture-question" key={key}>
                <strong>Aufgabe {question.number}</strong>
                <h3>{question.question}</h3>
                <A1PictureOptions
                  name={key}
                  options={question.options}
                  value={answers[key] || ""}
                  onChange={(value) => setAnswer(key, value)}
                  disabled={submitted}
                />
                {feedback(key, question.answer)}
              </article>
            );
          })}
        </div>
      );
    }

    if (normalizedLevel === "A2" && part.key === "teil2") {
      const used = new Set(
        part.data.tasks
          .map((task) => answers[`${part.key}-${task.number}`])
          .filter(Boolean)
      );
      return (
        <>
          <div style={{ display: "grid", gap: 8 }}>
            {part.data.tasks.map((task) => {
              const key = `${part.key}-${task.number}`;
              return (
                <label key={key} style={{ display: "grid", gap: 6, border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
                  <strong>Aufgabe {task.number} · {task.day}</strong>
                  <select
                    value={answers[key] || ""}
                    onChange={(event) => setAnswer(key, event.target.value)}
                    disabled={submitted}
                    style={{ ...styles.input, maxWidth: 280 }}
                  >
                    <option value="">Choose A–I</option>
                    {part.data.pictures.map((picture) => (
                      <option
                        key={picture.id}
                        value={picture.id}
                        disabled={used.has(picture.id) && answers[key] !== picture.id}
                      >
                        {picture.id} · {picture.label}
                      </option>
                    ))}
                  </select>
                  {feedback(key, task.answer)}
                </label>
              );
            })}
          </div>
          <section className="a2-hoeren-picture-section" style={{ marginTop: 12 }}>
            <h3 style={{ marginTop: 0 }}>Bilder A–I</h3>
            <div className="a2-hoeren-picture-grid">
              {part.data.pictures.map((picture) => (
                <article
                  className={used.has(picture.id) ? "a2-hoeren-picture-card selected" : "a2-hoeren-picture-card"}
                  key={picture.id}
                >
                  <div className="a2-hoeren-picture-letter">{picture.id}</div>
                  <A2ListeningTeil2PictureScene type={picture.type} />
                  <span className="a2-hoeren-picture-admin-label">{picture.label}</span>
                </article>
              ))}
            </div>
          </section>
        </>
      );
    }

    if (normalizedLevel === "A2" && part.key === "teil3") {
      return (
        <div className="a2-t3-list">
          {(part.data.questions || []).map((question) => {
            const key = `${part.key}-${question.number}`;
            return (
              <article className="a2-t3-question" key={key}>
                <header>
                  <div>
                    <strong>Aufgabe {question.number}</strong>
                    {question.context ? <span>{question.context}</span> : null}
                  </div>
                  <h2>{question.question}</h2>
                </header>

                <div className="a2-t3-options">
                  {question.options.map((option) => (
                    <label
                      className={answers[key] === option.id ? "a2-t3-option selected" : "a2-t3-option"}
                      key={option.id}
                    >
                      <input
                        type="radio"
                        name={key}
                        checked={answers[key] === option.id}
                        onChange={() => setAnswer(key, option.id)}
                        disabled={submitted}
                      />
                      <span className="a2-t3-letter">{option.id}</span>
                      <A2ListeningTeil3Picture icon={option.icon} />
                      <span className="a2-t3-hidden-label">{option.label}</span>
                    </label>
                  ))}
                </div>
                {feedback(key, question.answer)}
              </article>
            );
          })}
        </div>
      );
    }

    return (part.data.questions || []).map((question) => {
      const key = `${part.key}-${question.number}`;
      const prompt = question.question || question.statement;
      const isBinary = !question.options;
      const binaryLabels =
        normalizedLevel === "A2" && part.key === "teil4"
          ? [["ja", "Ja"], ["nein", "Nein"]]
          : [["richtig", "Richtig"], ["falsch", "Falsch"]];

      return (
        <article key={key} style={{ borderTop: "1px solid #e5e7eb", paddingTop: 14, display: "grid", gap: 8 }}>
          <div>
            <strong>Aufgabe {question.number}</strong>
            {question.context ? <p style={{ margin: "4px 0", color: "#6b7280" }}>{question.context}</p> : null}
            <p style={{ margin: "4px 0 0" }}>{prompt}</p>
          </div>

          {isBinary ? (
            <BinaryOptions
              name={key}
              value={answers[key] || ""}
              onChange={(value) => setAnswer(key, value)}
              disabled={submitted}
              labels={binaryLabels}
            />
          ) : (
            <ChoiceOptions
              name={key}
              options={question.options}
              value={answers[key] || ""}
              onChange={(value) => setAnswer(key, value)}
              disabled={submitted}
            />
          )}
          {feedback(key, question.answer)}
        </article>
      );
    });
  };

  return (
    <main style={{ display: "grid", gap: 12 }} data-hoeren-practice-sample>
      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/exams/horen")}>
          Back to Hören samples
        </button>
        <p style={{ ...styles.helperText, margin: 0 }}>{normalizedLevel} · Hören</p>
        <h2 style={{ margin: 0 }}>Hören {sampleId === "sample-2" ? "Sample 2" : "Sample 1"}</h2>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Complete all listening parts, then check your answers at the end.
        </p>
      </section>

      {parts.map((part) => (
        <section key={part.key} style={{ ...styles.card, display: "grid", gap: 12 }}>
          <header>
            <h3 style={{ margin: 0 }}>{part.data.title}</h3>
            <p style={{ margin: "6px 0 0", color: "#4b5563" }}>{part.data.instruction}</p>
            <p style={{ margin: "4px 0 0" }}><strong>{part.data.responseInstruction}</strong></p>
          </header>

          <SampleAudio
            level={normalizedLevel}
            sampleId={sampleId}
            part={part.audioPart}
            objectKey={part.data.audioObjectKey}
            plays={part.data.plays}
            idToken={idToken}
          />

          {part.data.example ? (
            <div
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 10,
                padding: 12,
                background: "#f9fafb",
                display: "grid",
                gap: 8,
              }}
            >
              <strong>Beispiel</strong>
              <p style={{ margin: 0 }}>{part.data.example.question}</p>
              <div style={{ display: "grid", gap: 4 }}>
                {part.data.example.options.map((option) => (
                  <span key={option.id}>
                    <strong>{option.id})</strong> {option.label}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 14 }}>
            {renderPartQuestions(part)}
          </div>
        </section>
      ))}

      <section style={{ ...styles.card, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <strong>{answered}/{questions.length} answered</strong>
          {submitted ? (
            <p style={{ margin: "5px 0 0" }}>
              Result: <strong>{score}/{questions.length}</strong> · {Math.round((score / questions.length) * 100)}%
            </p>
          ) : (
            <p style={{ ...styles.helperText, margin: "5px 0 0" }}>Complete every Teil before checking your answers.</p>
          )}
        </div>

        {!submitted ? (
          <button type="button" style={styles.primaryButton} disabled={answered !== questions.length} onClick={() => setSubmitted(true)}>
            Check answers
          </button>
        ) : (
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Try {sampleId === "sample-2" ? "Sample 2" : "Sample 1"} again
          </button>
        )}
      </section>
    </main>
  );
}
