import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import { fetchA1MockAudioPlaybackUrl } from "../services/a1AudioService";
import { scoreA1HoerenPractice } from "../services/a1HoerenPracticeService";
import { needsFreshSignedAudio } from "../utils/hoerenSignedAudio";
import { A1_MOCK_4_LISTENING } from "../data/a1Mock4Listening";
import { A1_MOCK_5_LISTENING } from "../data/a1Mock5Listening";
import { A1_MOCK_6_LISTENING } from "../data/a1Mock6Listening";
import { A1_MOCK_7_LISTENING } from "../data/a1Mock7Listening";
import { A1_MOCK_8_LISTENING } from "../data/a1Mock8Listening";
import "./A1GoetheListeningMockPreview.css";

const PRACTICE_MOCKS = Object.freeze({
  4: A1_MOCK_4_LISTENING, 5: A1_MOCK_5_LISTENING,
  6: A1_MOCK_6_LISTENING, 7: A1_MOCK_7_LISTENING, 8: A1_MOCK_8_LISTENING,
});
const parts = Object.freeze(["teil1", "teil2", "teil3"]);
const partKey = (index, number) => `t${index + 1}-${number}`;

function PartAudio({ mockNumber, index, part, idToken }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAudio = async (force = false) => {
    if (!idToken || loading || (url && !force && !needsFreshSignedAudio(url))) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetchA1MockAudioPlaybackUrl({
        mockId: `mock-0${mockNumber}`,
        part: `teil-${index + 1}`,
        key: part.audioObjectKey,
        idToken,
      });
      setUrl(response.url);
    } catch (reason) {
      setUrl("");
      setError(reason?.response?.data?.error || reason?.message || "Audio could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="a1-hoeren-mock-part-audio">
    <div className="a1-hoeren-mock-part-audio-copy">
      <strong>Exam audio · Teil {index + 1}</strong>
      <p>{part.plays === 1 ? "This audio is heard once." : "The required repetition is included in the recording."}</p>
    </div>
    {url ? <audio className="a1-hoeren-mock-native-audio" controls controlsList="nodownload"
      src={url} preload="metadata" aria-label={`Mock ${mockNumber} Hören Teil ${index + 1}`}
      onPlay={event => {
        if (needsFreshSignedAudio(url)) {
          event.currentTarget.pause();
          loadAudio(true);
        }
      }}
      onError={() => { setUrl(""); setError("Audio could not play. Load a fresh link and try again."); }}
    >Your browser does not support audio.</audio> : null}
    {!url || error ? <button type="button" className="a1-hoeren-mock-load-audio"
      disabled={loading || !idToken} onClick={() => loadAudio(true)}>
      {loading ? "Loading audio …" : url ? "Reload audio" : "Load audio"}
    </button> : null}
    {loading ? <span role="status">Preparing protected audio…</span> : null}
    {error ? <p role="alert" className="a1-hoeren-mock-audio-error">{error}</p> : null}
  </div>;
}

export default function A1MockHoerenPractice({ sampleId }) {
  const navigate = useNavigate();
  const { idToken } = useAuth();
  const mockNumber = Number(String(sampleId || "").replace(/^sample-/, ""));
  const data = PRACTICE_MOCKS[mockNumber];
  const mockId = `a1-mock-0${mockNumber}`;
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAnswers({}); setResult(null); setError(""); setBusy(false);
  }, [mockNumber]);

  if (!data) return <section style={styles.card}><h2>Hören sample not found</h2>
    <button type="button" style={styles.secondaryButton} onClick={() => navigate("/exams/horen")}>Back to Hören samples</button>
  </section>;

  const count = parts.reduce((total, part) => total + data[part].questions.length, 0);
  const answered = Object.keys(answers).length;
  const submit = async () => {
    if (busy || result || answered !== count) return;
    setBusy(true);
    setError("");
    try {
      const graded = await scoreA1HoerenPractice({ mockId, answers, idToken });
      setResult(graded);
    } catch (reason) {
      setError(reason?.response?.data?.error || reason?.message || "Could not check answers. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  const reset = () => {
    setAnswers({}); setResult(null); setError("");
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  };

  return <main data-a1-hoeren-standalone={mockId} style={{ display:"grid", gap:12 }}>
    <section style={{ ...styles.card, display:"grid", gap:8 }}>
      <button type="button" style={{ ...styles.secondaryButton, width:"fit-content" }}
        onClick={() => navigate("/exams/horen")}>← Back to Hören samples</button>
      <p style={{ ...styles.helperText, margin:0 }}>A1 · Hören · Sample {mockNumber}</p>
      <h2 style={{ margin:0 }}>A1 Mock {mockNumber} · Hören practice</h2>
      <p style={{ margin:0, color:"#475569" }}>
        The same 15 questions and three recordings used in A1 Mock {mockNumber}.
        Practise Hören separately; results are marked and saved as Hören practice,
        without changing your full mock exam result.
      </p>
    </section>
    {parts.map((partName, index) => {
      const part = data[partName];
      return <section key={partName} style={{ ...styles.card, display:"grid", gap:12 }}>
        <header>
          <h3 style={{ margin:0 }}>{part.title}</h3>
          <p style={{ margin:"6px 0 0", color:"#4b5563" }}>{part.instruction}</p>
          <p style={{ margin:"4px 0 0" }}><strong>{part.responseInstruction}</strong></p>
        </header>
        <PartAudio key={`${mockId}-${partName}`} mockNumber={mockNumber} index={index} part={part} idToken={idToken}/>
        <div style={{ display:"grid", gap:14 }}>
          {part.questions.map(question => {
            const id = partKey(index, question.number);
            const binary = index === 1;
            const options = binary
              ? [{id:"richtig",label:"Richtig"},{id:"falsch",label:"Falsch"}]
              : question.options;
            const selected = answers[id] || "";
            const correct = result?.correctAnswers?.[id];
            return <fieldset key={id} style={{ border:"1px solid #dbe4ed", borderRadius:12, padding:14, minWidth:0 }}>
              <legend style={{ fontWeight:700 }}>Aufgabe {index === 0 ? question.number : index === 1 ? question.number + 6 : question.number + 10}</legend>
              <p style={{ margin:"4px 0 12px" }}>{question.question || question.statement}</p>
              <div style={{ display:"grid", gap:8 }}>
                {options.map(option => <label key={option.id}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:"1px solid #e2e8f0", borderRadius:10, cursor:result ? "default" : "pointer" }}>
                  <input type="radio" name={`${mockId}-${id}`} value={option.id}
                    checked={selected === option.id} disabled={!!result || busy}
                    onChange={() => setAnswers(current => ({...current, [id]:option.id}))}/>
                  <strong style={{ textTransform:"uppercase" }}>{binary ? "" : `${option.id})`}</strong>
                  <span>{option.label}</span>
                </label>)}
              </div>
              {result ? <p style={{ color:selected === correct?"#166534":"#991b1b", margin:"10px 0 0", fontWeight:600 }}>
                {selected === correct ? "Correct." : `Correct answer: ${options.find(o=>o.id===correct)?.label || correct}`}
              </p> : null}
            </fieldset>;
          })}
        </div>
      </section>;
    })}
    <section style={{ ...styles.card, display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:12 }}>
      <div>
        <strong>{answered}/{count} answered</strong>
        {result ? <p role="status" style={{ margin:"5px 0 0" }}>
          Result: <strong>{result.correct}/{result.total}</strong> · {result.percent}% · {result.saved ? "Saved to Results" : "Not saved"}
        </p> : <p style={{ ...styles.helperText, margin:"5px 0 0" }}>Answer all 15 questions before checking.</p>}
        {error ? <p role="alert" style={{ color:"#b91c1c" }}>{error}</p> : null}
      </div>
      {result ? <button type="button" style={styles.secondaryButton} onClick={reset}>Try Sample {mockNumber} again</button>
        : <button type="button" style={styles.primaryButton} onClick={submit} disabled={busy || answered !== count || !idToken}>
          {busy ? "Checking answers…" : "Check answers"}
        </button>}
    </section>
  </main>;
}
