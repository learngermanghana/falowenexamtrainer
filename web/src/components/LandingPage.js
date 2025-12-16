import React from "react";
import { styles } from "../styles";

const Highlight = ({ title, description }) => (
  <div
    style={{
      ...styles.card,
      border: "1px solid #e0e7ff",
      background: "linear-gradient(180deg, #ffffff, #f8fafc)",
      height: "100%",
    }}
  >
    <h3 style={{ ...styles.sectionTitle, marginBottom: 8 }}>{title}</h3>
    <p style={{ ...styles.helperText, marginBottom: 0 }}>{description}</p>
  </div>
);

const LandingPage = ({ onSignUp, onLogin }) => {
  const highlights = [
    {
      title: "Über uns",
      description:
        "Wir sind ein kleines Team aus Sprachcoaches und Techies, das dich mit smarter Vorbereitung durch jede Prüfung begleitet.",
    },
    {
      title: "Unsere Mission",
      description:
        "Individuelle Lernpfade, echte Prüfungsnähe und kontinuierliches Feedback – damit du sicher und selbstbewusst in jede Prüfung gehst.",
    },
    {
      title: "Was dich erwartet",
      description:
        "Geführte Speaking- und Writing-Sessions, Wortschatz-Drills und ein Fortschritts-Cockpit mit klaren nächsten Schritten.",
    },
  ];

  const pillars = [
    {
      title: "Fokus auf Ergebnisse",
      copy: "Klare Zieldefinition, adaptive Aufgaben und realistische Mock-Tests beschleunigen deine Fortschritte.",
    },
    {
      title: "Coach im Loop",
      copy: "Feedback in Echtzeit, personalisierte Tipps und Erinnerungen halten dich verlässlich im Flow.",
    },
    {
      title: "Technologie + Didaktik",
      copy: "Wir verbinden modernste Sprach-Tools mit erprobten Lernmethoden für nachhaltige Erfolge.",
    },
  ];

  const steps = [
    "Level Check machen und dein Profil freischalten.",
    "Daily Plan folgen und Speaking/Writing Sessions absolvieren.",
    "Wöchentliche Auswertung mit klaren Next Steps und Streak-Sicherung.",
  ];

  return (
    <div
      style={{
        ...styles.container,
        background: "radial-gradient(circle at 10% 20%, #eef2ff 0, #f3f4f6 35%, #f3f4f6 100%)",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 16,
          margin: "0 auto",
          maxWidth: 1080,
        }}
      >
        <section
          style={{
            ...styles.card,
            background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
            color: "#ffffff",
            border: "1px solid #1d4ed8",
            boxShadow: "0 18px 36px rgba(37, 99, 235, 0.28)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ ...styles.badge, alignSelf: "flex-start", background: "#c7d2fe", color: "#1e3a8a" }}>
              Falowen Exam Coach
            </p>
            <h1 style={{ ...styles.title, fontSize: 32, color: "#ffffff", margin: 0 }}>
              Dein smarter Weg zu sicheren Prüfungsergebnissen.
            </h1>
            <p style={{ ...styles.helperText, color: "#e0e7ff", marginBottom: 4 }}>
              Alltagstaugliche Trainings, echte Prüfungssimulationen und ein Coach, der dich Schritt für Schritt begleitet.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={styles.primaryButton} onClick={onSignUp}>
                Jetzt kostenlos registrieren
              </button>
              <button style={styles.secondaryButton} onClick={onLogin}>
                Ich habe bereits einen Account
              </button>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
              <span style={styles.badge}>A1–B2 Speaking & Writing</span>
              <span style={styles.badge}>Adaptiver Daily Plan</span>
              <span style={styles.badge}>Push-Erinnerungen</span>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {highlights.map((item) => (
            <Highlight key={item.title} title={item.title} description={item.description} />
          ))}
        </section>

        <section style={{ ...styles.card, background: "#111827", color: "#e5e7eb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 260 }}>
              <h2 style={{ ...styles.sectionTitle, color: "#fff" }}>Mission & Ansatz</h2>
              <p style={{ ...styles.helperText, color: "#d1d5db" }}>
                Wir glauben daran, dass Vorbereitung messbar, motivierend und machbar sein muss. Deshalb kombinieren wir
                kurze Daily Sessions, klare Wochenziele und persönliche Rückmeldung zu jeder Übung.
              </p>
            </div>
            <div style={{ display: "grid", gap: 10, flex: 1, minWidth: 240 }}>
              {pillars.map((pillar) => (
                <div key={pillar.title} style={{ ...styles.uploadCard, background: "#0f172a", borderColor: "#1f2937" }}>
                  <h3 style={{ ...styles.sectionTitle, color: "#fff", marginBottom: 6 }}>{pillar.title}</h3>
                  <p style={{ ...styles.helperText, color: "#d1d5db", margin: 0 }}>{pillar.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...styles.card }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h2 style={styles.sectionTitle}>So funktioniert's</h2>
              <p style={styles.helperText}>In drei einfachen Schritten startklar:</p>
              <ul style={{ ...styles.checklist, margin: 0 }}>
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1, minWidth: 260, display: "grid", gap: 10 }}>
              <div style={{ ...styles.resultCard, marginTop: 0 }}>
                <h3 style={styles.sectionTitle}>Warum jetzt starten?</h3>
                <p style={styles.helperText}>
                  Sichere dir einen frühen Vorsprung, erhalte einen klaren Plan und verfolge deinen Fortschritt mit jedem
                  Login.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={{ ...styles.primaryButton, padding: "10px 14px" }} onClick={onSignUp}>
                    Account anlegen
                  </button>
                  <button style={{ ...styles.secondaryButton, padding: "10px 14px" }} onClick={onLogin}>
                    Zum Login
                  </button>
                </div>
              </div>
              <div style={{ ...styles.uploadCard }}>
                <h4 style={{ ...styles.sectionTitle, marginBottom: 8 }}>Community-Facts</h4>
                <ul style={{ ...styles.checklist, margin: 0 }}>
                  <li>98% behalten ihren Streak in den ersten 14 Tagen.</li>
                  <li>Weekly Review mit individuellen Schreib- und Sprech-Tipps.</li>
                  <li>Push-Reminder und E-Mail-Summaries inklusive.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
