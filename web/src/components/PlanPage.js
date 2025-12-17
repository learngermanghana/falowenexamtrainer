import React from "react";
import HomeActions from "./HomeActions";
import { styles } from "../styles";
import ClassCalendarCard from "./ClassCalendarCard";
import { useAccess } from "../context/AccessContext";
import {
  COURSE_LEVEL_PRICES,
  EXAM_PREP_PRICE,
  PAYMENT_PROVIDER,
} from "../data/paystackPlans";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

const formatPrice = (amount) =>
  typeof amount === "number"
    ? amount.toLocaleString(undefined, { minimumFractionDigits: 0 })
    : amount;

const PlanPage = ({ onSelect }) => {
  const {
    courseAccessUntil,
    trialEndsAt,
    courseAccessLabel,
    hasExamAccess,
    markPartialPayment,
    markFullPayment,
  } = useAccess();

  const paymentProvider = PAYMENT_PROVIDER;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ ...styles.card, display: "grid", gap: 12, borderColor: "#0ea5e9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div>
            <h2 style={{ ...styles.sectionTitle, marginTop: 0 }}>Access &amp; payments</h2>
            <p style={{ ...styles.helperText, marginBottom: 6 }}>
              Courses are tutor-supported; exams are fully automated. New logins start with a 3-day trial, part payment unlocks
              1 month, and full payment grants 6 months plus exam access.
            </p>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Paystack is the payment provider. Confirm payments below after you receive a Paystack receipt.
            </p>
          </div>
          <span style={{ ...styles.levelPill, background: "#e0f2fe", color: "#0369a1" }}>{courseAccessLabel}</span>
        </div>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>Status</h3>
            <ul style={styles.checklist}>
              <li>Trial ends: {formatDate(trialEndsAt)}</li>
              <li>Course access until: {formatDate(courseAccessUntil)}</li>
              <li>Exam room: {hasExamAccess ? "Unlocked (full payment)" : "Locked until full payment"}</li>
              <li>Provider: {paymentProvider}</li>
            </ul>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#ecfeff", borderColor: "#22d3ee" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>Confirm a payment</h3>
            <p style={{ ...styles.helperText, marginTop: 0 }}>
              Use the Paystack checkout link, then record the payment so access updates immediately.
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              <button style={styles.secondaryButton} type="button" onClick={() => markPartialPayment()}>
                Mark Paystack part payment (1 month access)
              </button>
              <button style={styles.primaryButton} type="button" onClick={() => markFullPayment()}>
                Mark Paystack full payment (6 months + exams)
              </button>
            </div>
          </div>

          <div style={{ ...styles.card, margin: 0 }}>
            <h3 style={{ margin: "0 0 6px 0" }}>Course pricing (cedis)</h3>
            <ul style={{ ...styles.checklist, marginBottom: 0 }}>
              {COURSE_LEVEL_PRICES.map((item) => (
                <li key={item.level}>
                  {item.level}: <strong>{formatPrice(item.price)} GHS</strong>
                </li>
              ))}
              <li>Exam prep add-on: <strong>{formatPrice(EXAM_PREP_PRICE)} GHS / month</strong></li>
            </ul>
          </div>
        </div>
      </div>

      <ClassCalendarCard />

      <HomeActions onSelect={onSelect} />

      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={styles.sectionTitle}>Zwei Wege für heute</h2>
          <span style={styles.badge}>Login nötig</span>
        </div>
        <p style={styles.helperText}>
          Halte die Startseite schlank: Entscheide dich zwischen Kursbuch und Prüfungssimulation. Alle
          weiteren Inhalte erreichst du später innerhalb dieser Bereiche.
        </p>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div style={{ ...styles.card, marginBottom: 0, background: "#f9fafb" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>Kursbuch</h3>
            <p style={{ ...styles.helperText, marginBottom: 10 }}>
              Öffne dein Kursmaterial und arbeite die Lektionen oder Hausaufgaben durch.
            </p>
            <ul style={styles.checklist}>
              <li>Alle PDFs, Videos und Worksheets an einem Ort.</li>
              <li>Roter Faden über die nächsten Aufgaben im Kurs.</li>
              <li>Nach dem Login direkt in das aktuelle Modul springen.</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button style={styles.secondaryButton} onClick={() => onSelect("course")}>Zum Kursbuch</button>
            </div>
          </div>

          <div style={{ ...styles.card, marginBottom: 0, background: "#fef3c7", border: "1px solid #f59e0b" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>Prüfungen</h3>
            <p style={{ ...styles.helperText, marginBottom: 10 }}>
              Starte eine Prüfungssimulation mit klaren Aufgaben und Timer.
            </p>
            <ul style={styles.checklist}>
              <li>Direkt in die nächste Speaking- oder Writing-Session springen.</li>
              <li>Fragen und Prompts erscheinen erst nach Login.</li>
              <li>Feedback und Score werden nach jeder Runde gespeichert.</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button style={styles.primaryButton} onClick={() => onSelect("exam")}>Zur Prüfung</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
