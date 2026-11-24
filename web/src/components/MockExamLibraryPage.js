import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getBackendUrl } from "../services/backendUrl";
import { useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import { getMockExamsForLevel } from "../data/mockExamCatalog";
import { styles } from "../styles";
import { announceExamSuccess } from "../services/interactionFeedback";

import { useAccessLock, examLockInfo } from "./AccessLockDialog";
import { TrialExam } from "../context/TrialCatalogContext";

const statusLabel = (status, mock) => {
  if (mock?.mode === "full" && status === "preview" && ["a1-final-04", "a1-final-05", "a1-final-06", "a1-final-07", "a1-final-08", "a2-mock-03"].includes(mock.id)) return "4-module mock · preview";
  if (mock?.mode === "kombi") {
    const count=mock.sections?.length||3;
    return status === "ready" ? `${count}-module Kombiprüfung` : `${count}-module Kombiprüfung · preview`;
  }
  if (mock?.id === "a2-mock-02") return "4-module mock · grading verification pending";
  if (mock?.id === "b1-mock-02") return "Complete 4-module mock";
  if (mock?.id === "b1-mock-03" && status === "preview") return "4-module mock · verification pending";
  if (mock?.id === "b1-mock-04" && status === "preview") return "4-module mock · verification pending";
  if (status === "preview") return "Section practice only";
  if (status === "ready") return "Complete 4-module mock";
  return "Full mock not published";
};

export default function MockExamLibraryPage() {
  const navigate = useNavigate();
  const { level: selectedLevel } = useExam();
  const trialExam = React.useContext(TrialExam);
  const { openLock, lockDialog } = useAccessLock();
  const level = trialExam?.level || selectedLevel;
  const { user, studentProfile } = useAuth();
  const examOnly = studentProfile?.accountType === "exam_only";
  const [ownedLevels, setOwnedLevels] = useState([]);
  const [loadingOwned, setLoadingOwned] = useState(examOnly && !trialExam);
  useEffect(() => {
    if (!examOnly || trialExam || !user) return undefined;
    let mounted = true;
    setLoadingOwned(true);
    user.getIdToken().then(token => fetch(`${getBackendUrl()}/mock/access`, {
      headers: { Authorization: `Bearer ${token}` },
    })).then(async response => {
      if (!response.ok) throw new Error("Access lookup failed");
      return response.json();
    }).then(data => {
      if (mounted) setOwnedLevels((data.active || []).map(entry => entry.level));
    }).catch(() => { if (mounted) setOwnedLevels([]); })
      .finally(() => { if (mounted) setLoadingOwned(false); });
    return () => { mounted = false; };
  }, [examOnly, trialExam, user]);
  const mocks = getMockExamsForLevel(level, { includeCourse: true }).filter(mock =>
    !examOnly || ((trialExam?.level === mock.level || ownedLevels.includes(mock.level)) && mock.status !== "planned" &&
      mock.id !== "a2-course-preview-01")
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {lockDialog}
      <section style={styles.card}>
        <h2 style={{ ...styles.sectionTitle, margin: "6px 0" }}>{level} Mock Exams</h2>
        <p style={{ ...styles.helperText, margin: 0 }}>
          {mocks.some((mock) => mock.mode === "full" && mock.status === "ready") ? "Choose a mock or practise one skill." : "No complete mock is published yet. Choose a skill to practise."}
        </p>
        {trialExam?.accessError && <div role="status"><p>We could not verify your exam access. Retry before making any payment.</p><button type="button" style={styles.secondaryButton} onClick={trialExam.retryAccess}>Retry access check</button></div>}
        {trialExam?.locked && !trialExam.accessError && <a href="/mock/payment">Choose a payment option</a>}
      </section>

      {examOnly && !trialExam && ownedLevels.includes(level) && <section style={styles.card}>
        <strong>Your {level} monthly access · practise in any order</strong>
        <p style={{ ...styles.helperText, margin: "8px 0" }}>
          All published exams and individual skills are included. There is no price per Teil.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { label: "Lesen", route: "/exams/lesen" },
            { label: "Hören", route: "/exams/horen" },
            { label: "Schreiben", route: "/exams/writing" },
            { label: "Sprechen", route: "/exams/speaking" },
          ].map(skill => <button key={skill.label} type="button" style={styles.secondaryButton}
            onClick={() => navigate(skill.route)}>{skill.label}</button>)}
        </div>
      </section>}
      {loadingOwned ? <section style={styles.card}>Checking your monthly exam access…</section> : mocks.length ? (
        <section style={{ display: "grid", gap: 12 }}>
          {mocks.map((mock) => (
            <article key={mock.id} style={{ ...styles.card, margin: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ maxWidth: 720 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <h3 style={{ margin: 0 }}>{mock.shortTitle || mock.title}</h3>
                    {!(mock.mode === "full" && mock.status === "ready" && mock.id !== "a2-mock-02") && <span style={styles.badge}>{statusLabel(mock.status, mock)}</span>}
                  </div>
                  <p style={{ ...styles.helperText, margin: "8px 0 0", fontSize: 12 }}>
                    {mock.durationLabel} · {(mock.sections || []).join(" · ")}
                  </p>
                  {mock.mode === "kombi" ? (
                    <p style={{ ...styles.helperText, margin: "8px 0 0" }}>
                      {mock.sections?.includes("Hören") ? "Four modules · 100 points" : "Three modules · 75 points; Hören not included."}
                    </p>
                  ) : mock.mode !== "full" && mock.id !== "a2-mock-02" && mock.id !== "b1-mock-02" ? (
                    <p style={{ ...styles.helperText, margin: "8px 0 0" }}>
                      Section practice does not generate a complete mock score.
                    </p>
                  ) : null}
                </div>
                <button type="button" style={trialExam && mock.id !== trialExam.id ? styles.secondaryButton : styles.primaryButton} onClick={event => { if (trialExam && mock.id !== trialExam.id) { openLock(examLockInfo({ title: mock.shortTitle || mock.title, trialExam, level, examOnly }), event); return; } announceExamSuccess(`${mock.shortTitle || mock.title} opened successfully.`); navigate(mock.route); }}>
                  {trialExam && mock.id !== trialExam.id ? "🔒 Locked" : mock.mode === "full" || mock.mode === "kombi" ? "Begin" : mock.id === "a2-mock-02" ? "Open A2 Mock 2" : mock.status === "planned" ? "Browse exam skills" : "Open practice section"}
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section style={styles.card}>
          <strong>No full {level} mock is published yet.</strong>
          <p style={styles.helperText}>{examOnly ? "Your monthly subscription includes all published mocks and individual skill practice at this level." : "Use the section practice while a full mock is not yet available."}</p>
          {examOnly ? <a href="/mock/checkout">See monthly access</a> : null}
        </section>
      )}
    </div>
  );
}
