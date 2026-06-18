import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { SubmissionHistoryPanel } from "./assignments/AssignmentSubmissionPanel";

const readCachedHistory = () => [];

export default function AssignmentSubmissionPage() {
  const navigate = useNavigate();
  const { studentProfile } = useAuth();
  const preferredLevel = String(studentProfile?.level || studentProfile?.className || "A1").toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0] || "A1";
  const history = readCachedHistory();

  return (
    <section style={{ ...styles.card, display: "grid", gap: 14 }} aria-label="Submission history compatibility page">
      <div>
        <p style={{ ...styles.helperText, margin: 0, fontWeight: 900 }}>Submit Work has moved</p>
        <h2 style={{ margin: "4px 0" }}>Submit assignments inside your Course Book lessons</h2>
        <p style={{ ...styles.helperText, margin: 0 }}>
          This bookmark is still safe, but ordinary new submissions now happen directly inside A1, A2 and B1 lesson pages so the assignment context stays locked to the correct day and canonical assignment ID.
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" style={styles.primaryButton} onClick={() => navigate("/campus/course", { state: { level: preferredLevel, filter: "assignments" } })}>
          Go to Course Book assignments
        </button>
      </div>
      <SubmissionHistoryPanel history={history} />
    </section>
  );
}
