import React, { useEffect, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";
import { getActionCodeSettings, reload, sendEmailVerification } from "../firebase";

const LEVELS = ["A1", "A2", "B1"];

const REGISTRATION_DOCUMENTS = {
  enrollment: "Enrollment letter",
  agreement: "Payment agreement",
  receipt: "Latest issued payment receipt",
  residence: "Issued residence-permit support letter",
};

export default function StudentDocumentsPanel({ user, studentProfile }) {
  const initialLevel = LEVELS.includes(String(studentProfile?.level || "").toUpperCase())
    ? String(studentProfile.level).toUpperCase() : "A1";
  const [level, setLevel] = useState(initialLevel);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState(Boolean(user?.emailVerified));
  const [verificationBusy, setVerificationBusy] = useState("");
  const [verificationNotice, setVerificationNotice] = useState("");

  useEffect(() => {
    setVerifiedEmail(Boolean(user?.emailVerified));
    setVerificationNotice("");
  }, [user?.uid, user?.emailVerified]);

  async function resendVerificationEmail() {
    if (!user?.email || verificationBusy || verifiedEmail) return;
    setVerificationBusy("send");
    setError("");
    setVerificationNotice("");
    try {
      await sendEmailVerification(user, getActionCodeSettings());
      setVerificationNotice(`Verification email sent to ${user.email}. Check your inbox or spam folder, then return here.`);
    } catch (err) {
      setError(err?.code === "auth/too-many-requests"
        ? "Too many verification emails have been requested. Please try again later."
        : "We could not send a verification email. Please try again or contact Falowen.");
    } finally {
      setVerificationBusy("");
    }
  }

  async function refreshEmailVerification() {
    if (!user || verificationBusy) return;
    setVerificationBusy("refresh");
    setError("");
    setVerificationNotice("");
    try {
      // Firebase updates emailVerified on reload; a forced ID token refresh
      // makes the server's email_verified claim reflect the new verification.
      await reload(user);
      await user.getIdToken(true);
      const isVerified = user.emailVerified === true;
      setVerifiedEmail(isVerified);
      setVerificationNotice(isVerified
        ? "Email verified. You can now request your school documents."
        : "Your email is not verified yet. Open the verification link, then check again.");
    } catch (_err) {
      setError("Could not refresh verification. Check your connection and try again.");
    } finally {
      setVerificationBusy("");
    }
  }

  async function download(kind) {
    if (busy || !user || verificationBusy) return;
    if (!verifiedEmail) {
      setError("Verify your account email first using the controls above.");
      return;
    }
    setBusy(kind);
    setError("");
    setNotice("");
    try {
      const registrationLabel = REGISTRATION_DOCUMENTS[kind];
      const token = await user.getIdToken(true);
      const response = await fetch(`${getBackendUrl()}/students/me/documents/${kind}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationLabel ? {} : { level }), // Never send a student code or email.
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
      const fallbackName = registrationLabel ? `Falowen_${kind}.pdf` : `Falowen_${kind}_${level}.pdf`;
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
        setNotice(registrationLabel ? `${registrationLabel} is ready to download.` : `Your ${level} ${kind === "certificate" ? "certificate" : "score transcript"} has been prepared for download.`);
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

        </p>
      </div>

      {!verifiedEmail && user ? (
        <div style={{ border: "1px solid #fbd38d", background: "#fffbeb", borderRadius: 12, padding: 16, display: "grid", gap: 10 }}>
          <strong>Verify your account email</strong>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            To protect your academic records, verify {user.email || "your email address"} before downloading documents.
            We send a verification link by email; no SMS is required.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button type="button" onClick={resendVerificationEmail} disabled={Boolean(verificationBusy) || Boolean(busy)}>
              {verificationBusy === "send" ? "Sending…" : "Send verification email"}
            </button>
            <button type="button" onClick={refreshEmailVerification} disabled={Boolean(verificationBusy) || Boolean(busy)}>
              {verificationBusy === "refresh" ? "Checking…" : "I've verified my email — check again"}
            </button>
          </div>
        </div>
      ) : null}
      {verifiedEmail ? <p style={{ margin: 0, color: "#166534", fontSize: 13 }}>Email verified — school documents are available subject to eligibility.</p> : null}
      {verificationNotice ? <p role="status" style={{ margin: 0, color: "#334155", fontSize: 13 }}>{verificationNotice}</p> : null}

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
          <button type="button" disabled={Boolean(busy) || Boolean(verificationBusy) || !user || !verifiedEmail} onClick={() => download("transcript")}
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
          <button type="button" disabled={Boolean(busy) || Boolean(verificationBusy) || !user || !verifiedEmail} onClick={() => download("certificate")}
            style={{ border: "1px solid #3158e7", borderRadius: 9, background: "#3158e7", color: "#fff", padding: 11, cursor: "pointer", fontWeight: 700 }}>
            {busy === "certificate" ? "Checking eligibility…" : "Check & download certificate"}
          </button>
        </article>
      </div>

      <p style={{ margin: 0, color: "#64748b", fontSize: 12, lineHeight: 1.5 }}>
        Academic downloads cover German A1–B1. Kiswahili documents require their own
        approved certificate template. If an expected score is missing, contact your tutor.
      </p>
      <section aria-label="Enrollment and payment documents" style={{ display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Enrollment and payment documents</h3>
        <p style={{ margin: 0 }}>These documents use your registered student record. Receipts and residence letters are available once issued to your registered email by Student Docs. For online payment receipts, open <a href="/campus/account?tab=billing">Billing history</a>.</p>
        {Object.entries(REGISTRATION_DOCUMENTS).map(([kind, label]) => (
          <button type="button" key={kind} disabled={Boolean(busy) || Boolean(verificationBusy) || !user || !verifiedEmail}
            onClick={() => download(kind)}>
            {busy === kind ? "Preparing PDF…" : `Download ${label.toLowerCase()} PDF`}
          </button>
        ))}
      </section>
      {error ? <p role="alert" style={{ color: "#991b1b", margin: 0 }}>{error}</p> : null}
      {notice ? <p role="status" style={{ color: "#166534", margin: 0 }}>{notice}</p> : null}
    </section>
  );
}
