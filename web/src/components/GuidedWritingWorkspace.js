import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loadWritingProgress, saveWritingProgress } from "../services/writingProgressService";
import { markLetterWithAI } from "../services/coachService";
import { styles } from "../styles";
import WritingHistorySection, { buildWritingHistoryRecord } from "./WritingHistorySection";

const countWords = (text = "") => String(text || "").trim().split(/\s+/).filter(Boolean).length;
const emptyState = () => ({ answers: {}, finalEssay: "", combinedDraftMode: "auto", analysisFeedback: "", analysisUpdatedAt: "", writingHistory: [], updatedAt: "" });
export const migrateGuidedWritingState = (saved = {}) => ({ ...emptyState(), ...saved, answers: saved.answers && typeof saved.answers === "object" ? saved.answers : {}, combinedDraftMode: saved.combinedDraftMode || (saved.finalEssay && saved.view === "final" ? "manual" : "auto") });

export default function GuidedWritingWorkspace({ config, storageKey, cloudField, onStatusChange }) {
  const { user, idToken, studentProfile } = useAuth();
  const userId = user?.uid || "";
  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || userId;
  const hasCloudOwner = Boolean(studentCode || userId);
  const [state, setState] = useState(() => { try { return migrateGuidedWritingState(JSON.parse(localStorage.getItem(storageKey) || "{}")); } catch { return emptyState(); } });
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [analysisStatus, setAnalysisStatus] = useState("idle");
  const [analysisError, setAnalysisError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const questions = useMemo(() => config.questions.map((q) => ({ ...q, words: countWords(state.answers[q.id]), complete: countWords(state.answers[q.id]) >= q.minimumWords })), [config.questions, state.answers]);
  const autoText = questions.map((q) => String(state.answers[q.id] || "").trim()).filter(Boolean).join("\n\n");
  const finalEssay = state.combinedDraftMode === "auto" ? autoText : state.finalEssay;
  const completeCount = questions.filter((q) => q.complete).length;
  const allComplete = completeCount === questions.length;

  const update = (updater) => setState((old) => ({ ...(typeof updater === "function" ? updater(old) : { ...old, ...updater }), updatedAt: new Date().toISOString() }));
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify({ ...state, finalEssay })); }, [finalEssay, state, storageKey]);
  useEffect(() => { onStatusChange?.({ complete: allComplete && Boolean(finalEssay.trim()), completedQuestions: completeCount, totalQuestions: questions.length, wordCount: countWords(finalEssay) }); }, [allComplete, completeCount, finalEssay, onStatusChange, questions.length]);
  useEffect(() => {
    let active = true;
    if (!hasCloudOwner) { setCloudLoaded(true); setSaveStatus("device"); return undefined; }
    setSaveStatus("loading");
    loadWritingProgress({ userId, studentCode, mode: "course" }).then((saved) => { if (!active) return; const draft = saved?.[cloudField]; if (draft) setState((local) => Date.parse(local.updatedAt || "") > Date.parse(draft.updatedAt || "") ? local : migrateGuidedWritingState(draft)); setSaveStatus("saved"); }).catch(() => active && setSaveStatus("error")).finally(() => active && setCloudLoaded(true));
    return () => { active = false; };
  }, [cloudField, hasCloudOwner, studentCode, userId]);
  useEffect(() => {
    if (!cloudLoaded || !hasCloudOwner) return undefined;
    setSaveStatus("saving");
    const timer = window.setTimeout(async () => setSaveStatus(await saveWritingProgress({ userId, studentCode, mode: "course", data: { [cloudField]: { ...state, finalEssay } } }) ? "saved" : "error"), 800);
    return () => window.clearTimeout(timer);
  }, [cloudField, cloudLoaded, finalEssay, hasCloudOwner, state, studentCode, userId]);

  const analyse = async () => {
    setAnalysisStatus("loading"); setAnalysisError("");
    try {
      const data = await markLetterWithAI({ text: finalEssay, level: config.level, studentName: studentProfile?.name || user?.displayName || user?.email || "Student", idToken, program: studentProfile?.program, submissionContext: "course-guided-writing-analysis", promptType: "argument" });
      update((old) => ({ ...old, analysisFeedback: data?.structuredFeedback?.summary || data?.summary || data?.feedback || "Analysis completed.", analysisUpdatedAt: new Date().toISOString(), writingHistory: [...(old.writingHistory || []), buildWritingHistoryRecord({ userId, studentCode, level: config.level, workbookId: storageKey, taskId: cloudField, taskTitle: config.title || config.topic || "Guided writing task", text: finalEssay, data, context: "course-guided-writing-analysis" })] }));
      setAnalysisStatus("success");
    } catch (error) { setAnalysisError(error?.response?.data?.error || error?.message || "Falowen could not analyse the text right now."); setAnalysisStatus("error"); }
  };
  const saveLabel = !hasCloudOwner ? "Saved on this device" : saveStatus === "loading" ? "Loading saved work..." : saveStatus === "saving" ? "Saving to Falowen..." : saveStatus === "error" ? "Cloud save failed — device copy is safe" : "Saved to Falowen";
  const buttonLabel = analysisStatus === "loading" ? "Analysing your text..." : analysisStatus === "error" ? "Retry analysis" : state.analysisFeedback ? "Analyse again" : "Analyse my text";

  return <div data-guided-writing-workspace style={{ border: "1px solid #c7d2fe", borderRadius: 18, padding: 16, display: "grid", gap: 16, background: "linear-gradient(180deg,#fff,#f8fafc)" }}>
    <header style={{ display: "grid", gap: 6 }}><span style={{ ...styles.badge, width: "fit-content", background: "#eef2ff", color: "#3730a3" }}>Guided {config.level} Writing</span><h3 style={{ margin: 0 }}>Answer five questions and build your text</h3><small style={{ color: saveStatus === "error" ? "#b91c1c" : "#166534", fontWeight: 800 }}>{saveLabel}</small></header>
    <div style={{ display: "grid", gap: 14 }}>{questions.map((q, i) => <article key={q.id} style={{ border: `1px solid ${q.complete ? "#86efac" : "#e2e8f0"}`, borderRadius: 16, padding: 14, background: q.complete ? "#f0fdf4" : "#fff", display: "grid", gap: 9 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}><strong>Question {i + 1} of 5 · {q.section}</strong><span>{q.words}/{q.minimumWords} words {q.complete ? "✓" : ""}</span></div><h4 style={{ margin: 0 }}>{q.question}</h4><p style={{ margin: 0, color: "#64748b" }}>{q.help}</p><div style={{ borderLeft: "4px solid #818cf8", padding: 9, background: "#f8fafc" }}><strong>Starter:</strong> {q.starter || "Beginne mit einer klaren Aussage und begründe sie."}</div><textarea aria-label={`Question ${i + 1}`} value={state.answers[q.id] || ""} onChange={(e) => update((old) => ({ ...old, answers: { ...old.answers, [q.id]: e.target.value } }))} style={{ minHeight: 125, padding: 12, border: "1px solid #cbd5e1", borderRadius: 12, font: "inherit" }} /><small>{q.complete ? "Section completed." : `Add ${Math.max(q.minimumWords - q.words, 0)} more words.`}</small></article>)}</div>
    <section data-combined-text-card style={{ border: "1px solid #93c5fd", borderRadius: 16, padding: 16, background: "#fff", display: "grid", gap: 12 }}><h3 style={{ margin: 0 }}>Your combined text</h3><small style={{ color: "#475569", fontWeight: 700 }}>{state.combinedDraftMode === "auto" ? "Automatically built from your answers" : "You are editing the combined version"}</small><textarea aria-label="Your combined text" value={finalEssay} onChange={(e) => update((old) => ({ ...old, finalEssay: e.target.value, combinedDraftMode: "manual" }))} style={{ minHeight: 320, padding: 14, border: "1px solid #94a3b8", borderRadius: 12, font: "inherit", lineHeight: 1.7 }} /><div><strong>{countWords(finalEssay)} words</strong> · Target: about {config.targetWords}</div><div><strong>Checklist</strong><ul>{config.checklist.map((x) => <li key={x}>{x}</li>)}</ul></div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button type="button" onClick={analyse} disabled={analysisStatus === "loading" || !finalEssay.trim()} style={styles.primaryButton}>{buttonLabel}</button><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(finalEssay); setCopyMessage("Text copied."); } catch { setCopyMessage("Copy failed. Select the text manually."); } }} disabled={!finalEssay} style={styles.secondaryButton}>Copy text</button></div>{copyMessage && <small>{copyMessage}</small>}{analysisError && <div style={{ color: "#b91c1c", fontWeight: 700 }}>{analysisError}</div>}<WritingHistorySection title="Saved Texts" entries={state.writingHistory || []} level={config.level} onOpen={(entry) => update((old) => ({ ...old, finalEssay: entry.originalLetter || entry.originalText || "", combinedDraftMode: "manual", analysisFeedback: entry.summary || entry.feedback || "", analysisUpdatedAt: entry.submissionDate || entry.updatedAt || "" }))} />{state.analysisFeedback && <div data-analysis-feedback style={{ border: "1px solid #bbf7d0", borderRadius: 14, padding: 14, background: "#f0fdf4", whiteSpace: "pre-wrap", lineHeight: 1.7 }}><strong>Your level-based analysis</strong><br />{state.analysisFeedback}</div>}</section>
  </div>;
}
