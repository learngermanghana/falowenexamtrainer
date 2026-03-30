import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 6 };
const hintStyle = {
  borderRadius: 12,
  padding: 12,
  background: "rgba(99,102,241,0.09)",
  border: "1px solid rgba(99,102,241,0.22)",
};
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid rgba(148,163,184,0.45)",
  borderRadius: 10,
  overflow: "hidden",
};
const thStyle = {
  textAlign: "left",
  padding: "10px 12px",
  background: "rgba(99,102,241,0.1)",
  borderBottom: "1px solid rgba(148,163,184,0.45)",
  fontWeight: 700,
};
const tdStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(148,163,184,0.25)",
};
const heroMediaStyle = {
  width: "100%",
  height: "clamp(180px, 30vw, 280px)",
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.35)",
};
const creditStyle = {
  margin: 0,
  fontSize: 12,
  opacity: 0.8,
};

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const A2Day13VorstellungsgespraechModalverbenPraeteritumGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn} aria-label="Go back">
          ← Back
        </button>

        <header style={{ ...styles.card, display: "grid", gap: 10, marginBottom: 18 }}>
          <h1 style={{ margin: 0 }}>A2 • 5.13 Ein Vorstellungsgespräch</h1>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80"
            alt="Professionals discussing ideas in a job interview setting"
            style={heroMediaStyle}
            loading="lazy"
          />
          <p style={creditStyle}>
            Hero image:{" "}
            <a href="https://unsplash.com/photos/men-and-woman-sitting-beside-table-rX12B5uX7QM">
              Unsplash
            </a>
          </p>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>Modalverben im Präteritum</strong> for interview stories and past experience.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In job interviews, you often describe what you <em>could</em>, <em>had to</em>, and <em>wanted to</em>
            do in the past. Use these key forms confidently: <strong>konnte</strong>, <strong>musste</strong>,
            and <strong>wollte</strong>.
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Why Präteritum here?">
            <ul style={listStyle}>
              <li>Use it to report past responsibilities and abilities in a clear, compact way.</li>
              <li>Especially common in interview answers and short written summaries.</li>
              <li>Word order stays: subject + modal (Präteritum) + ... + infinitive at the end.</li>
            </ul>
            <div style={hintStyle}>
              Example pattern: <strong>Ich konnte ... / Ich musste ... / Ich wollte ... + infinitive.</strong>
            </div>
          </SectionCard>

          <SectionCard title="2) Core forms you need most (A2)">
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle} aria-label="Modal verbs in Präteritum for interview practice">
                <thead>
                  <tr>
                    <th style={thStyle}>Pronomen</th>
                    <th style={thStyle}>können</th>
                    <th style={thStyle}>müssen</th>
                    <th style={thStyle}>wollen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}>ich</td>
                    <td style={tdStyle}>konnte</td>
                    <td style={tdStyle}>musste</td>
                    <td style={tdStyle}>wollte</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>du</td>
                    <td style={tdStyle}>konntest</td>
                    <td style={tdStyle}>musstest</td>
                    <td style={tdStyle}>wolltest</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>er/sie/es</td>
                    <td style={tdStyle}>konnte</td>
                    <td style={tdStyle}>musste</td>
                    <td style={tdStyle}>wollte</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>wir</td>
                    <td style={tdStyle}>konnten</td>
                    <td style={tdStyle}>mussten</td>
                    <td style={tdStyle}>wollten</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>ihr</td>
                    <td style={tdStyle}>konntet</td>
                    <td style={tdStyle}>musstet</td>
                    <td style={tdStyle}>wolltet</td>
                  </tr>
                  <tr>
                    <td style={{ ...tdStyle, borderBottom: "none" }}>sie/Sie</td>
                    <td style={{ ...tdStyle, borderBottom: "none" }}>konnten</td>
                    <td style={{ ...tdStyle, borderBottom: "none" }}>mussten</td>
                    <td style={{ ...tdStyle, borderBottom: "none" }}>wollten</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="3) Interview-ready examples (Ein Vorstellungsgespräch)">
            <ul style={listStyle}>
              <li>In meinem letzten Job <strong>konnte</strong> ich viel mit Kunden arbeiten.</li>
              <li>Ich <strong>musste</strong> jeden Tag Berichte schreiben.</li>
              <li>Ich <strong>wollte</strong> mehr Verantwortung übernehmen.</li>
              <li>Wir <strong>konnten</strong> als Team gute Lösungen finden.</li>
              <li>Ich <strong>musste</strong> oft unter Zeitdruck arbeiten.</li>
              <li>Ich <strong>wollte</strong> meine Deutschkenntnisse im Beruf verbessern.</li>
            </ul>
          </SectionCard>

          <SectionCard title="4) Mini answer model for interviews">
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Frage:</strong> Was haben Sie in Ihrer letzten Stelle gemacht?
              <br />
              <strong>Musterantwort:</strong> In meiner letzten Stelle <strong>konnte</strong> ich im
              Kundenservice arbeiten. Ich <strong>musste</strong> täglich E-Mails beantworten und Probleme lösen.
              Außerdem <strong>wollte</strong> ich mich beruflich weiterentwickeln.
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default A2Day13VorstellungsgespraechModalverbenPraeteritumGrammarPage;
