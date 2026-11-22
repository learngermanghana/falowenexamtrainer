import React, { useState } from "react";
import { getBackendUrl } from "../services/backendUrl";

const LEVELS = ["A1", "A2", "B1"];

export default function StudentDocumentsPanel({ user, studentProfile }) {
  const initialLevel = LEVELS.includes(String(studentProfile?.level || "").toUpperCase())
    ? String(studentProfile.level).toUpperCase() : "A1";
  const [level, setLevel] = useState(initialLevel);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function download(kind) {
    if (busy || !user) return;
    setBusy(kind);
    setError("");
    setNotice("");
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${getBackendUrl()}/students/me/documents/${kind}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ level }), // Never send a student code or email.
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Falowen could not prepare the document.");
      }
      const pdf = await response.blob();
      if (!pdf.size || !pdf.type.includes("pdf")) {
        throw new Error("Falowen returned an invalid document.");
      }
      const disposition = response.headers.get("Content-Disposition") || "";
      const fallbackName = `Falowen_${kind}_${level}.pdf`;
      const suggestedName = disposition.match(/filename="([^"]+)"/i)?.[1] || fallbackName;
      const filename = suggestedName.replace(/[^a-z0-9._-]/gi, "_");
      const url = URL.createObjectURL(pdf);
      try {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setNotice(`Your ${level} ${kind === "certificate" ? "certificate" : "score transcript"} has been prepared for download.`);
      } finally {
        window.setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch (err) {
      setError(err.message || "Document download failed. Please try again.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section aria-labelledby="student-documents-heading" style={{
      background: "#fff", border: "1px solid #e2e8f0",
      borderRadius: 14, padding: 20, display: "grid", gap: 16,
    }}>
      <div>
        <h2 id="student-documents-heading" style={{ margin: "0 0 6px", fontSize: 20 }}>My school documents</h2>
        <p style={{ margin: 0, color: "#475569", fontSize: 14, lineHeight: 1.5 }}>
          Request your own official Falowen document and download it immediately.
          Only verified scores and approved course completions are used.
        </p>
      </div>

      <label style={{ display: "grid", gap: 6, maxWidth: 280, fontSize: 14, fontWeight: 650 }}>
        German course level
        <select aria-label="German course level" value={level} disabled={Boolean(busy)}
          onChange={(event) => { setLevel(event.target.value); setError(""); setNotice(""); }}
          style={{ border: "1px solid #cbd5e1", background: "#fff", borderRadius: 9, padding: 10, fontSize: 14 }}>
          {LEVELS.map((item) => <option key={item} value={item}>{item} German</option>)}
        </select>
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        <article style={{ border: "1px solid #dbe4ef", borderRadius: 12, padding: 16, display: "grid", gap: 10 }}>
          <strong>Score transcript</strong>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>
            A PDF of your verified scores for the selected course. Available as soon as results are recorded.
            Unfinished work appears as incomplete.
          </p>
          <button type="button" disabled={Boolean(busy) || !user} onClick={() => download("transcript")}
            style={{ border: "1px solid #3158e7", borderRadius: 9, background: "#eef2ff", color: "#244cda", padding: 11, cursor: "pointer", fontWeight: 700 }}>
            {busy === "transcript" ? "Preparing transcript…" : "Download transcript PDF"}
          </button>
        </article>

        <article style={{ border: "1px solid #dbe4ef", borderRadius: 12, padding: 16, display: "grid", gap: 10 }}>
          <strong>Certificate of completion</strong>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>
            The signed course certificate is available only after every required marked task
            and the official final assessment have passed verification.
          </p>
          <button type="button" disabled={Boolean(busy) || !user} onClick={() => download("certificate")}
            style={{ border: "1px solid #3158e7", borderRadius: 9, background: "#3158e7", color: "#fff", padding: 11, cursor: "pointer", fontWeight: 700 }}>
            {busy === "certificate" ? "Checking eligibility…" : "Check & download certificate"}
          </button>
        </article>
      </div>

      <p style={{ margin: 0, color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>
        German A1–B1 documents are supported first. Kiswahili documents require their own
        approved certificate template. If an expected score is missing, contact your tutor.
      </p>
      {error ? <p role="alert" style={{ color: "#991b1b", margin: 0 }}>{error}</p> : null}
      {notice ? <p role="status" style={{ color: "#166534", margin: 0 }}>{notice}</p> : null}
    </section>
  );
}
