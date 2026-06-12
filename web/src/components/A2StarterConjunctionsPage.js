import React from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";

/**
 * Topic focus: Small talk (A2 starter)
 * Goal: show how weil / deshalb / denn sound in real small-talk situations
 */

const ruleTable = [
  {
    conjunction: "weil",
    meaning: "because",
    pattern: "Main clause, weil + subject + ... + verb (at the end).",
    example: "Ich bleibe heute kurz, weil ich morgen früh arbeiten muss.",
  },
  {
    conjunction: "deshalb",
    meaning: "therefore / that is why",
    pattern: "Main clause. Deshalb + verb + subject + ...",
    example: "Ich bin müde. Deshalb gehe ich heute früher nach Hause.",
  },
  {
    conjunction: "denn",
    meaning: "because",
    pattern: "Main clause, denn + subject + verb + ... (normal word order).",
    example: "Ich trinke Tee, denn Kaffee ist mir zu stark.",
  },
];

const cell = {
  borderBottom: "1px solid #e6e8ef",
  padding: "8px 10px",
  verticalAlign: "top",
};

const markStyles = {
  conjunction: {
    background: "#fff3bf",
    padding: "2px 6px",
    borderRadius: 6,
    fontWeight: 700,
  },
  subject: {
    background: "#d0ebff",
    padding: "2px 6px",
    borderRadius: 6,
    fontWeight: 600,
  },
  verb: {
    background: "#d3f9d8",
    padding: "2px 6px",
    borderRadius: 6,
    fontWeight: 700,
  },
  moved: {
    background: "#ffd8a8",
    padding: "2px 6px",
    borderRadius: 6,
    fontWeight: 700,
  },
};

const noteStyle = {
  padding: 12,
  borderRadius: 10,
  background: "#f8f9fa",
  border: "1px solid #e9ecef",
};

const exampleBox = {
  margin: 0,
  padding: "10px 12px",
  border: "1px dashed #d1d5db",
  borderRadius: 12,
  background: "#fafafa",
  lineHeight: 1.7,
  color: "#111827",
};

const shiftBox = {
  display: "grid",
  gap: 8,
  padding: 12,
  borderRadius: 10,
  background: "#fcfcfc",
  border: "1px solid #e9ecef",
};

const arrowStyle = {
  fontWeight: 700,
  color: "#495057",
};

const chip = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid #e6e8ef",
  background: "#f8fafc",
  color: "#111827",
  fontSize: 13,
};

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const Mark = ({ type, children }) => (
  <span style={markStyles[type]}>{children}</span>
);

function ShiftExample({ title, normal, changed, note }) {
  return (
    <div style={shiftBox}>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div>
        <strong>Normal sentence:</strong> {normal}
      </div>
      <div style={arrowStyle}>↓ connected sentence</div>
      <div>
        <strong>Changed sentence:</strong> {changed}
      </div>
      <div style={{ fontSize: 14, color: "#495057" }}>{note}</div>
    </div>
  );
}

function SmallTalkIllustration({ height = 160 }) {
  return (
    <svg
      viewBox="0 0 900 380"
      width="100%"
      height={height}
      role="img"
      aria-label="Small talk illustration with two speech bubbles"
      style={{
        borderRadius: 14,
        border: "1px solid #e6e8ef",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
      }}
    >
      <g transform="translate(120, 90)">
        <circle cx="60" cy="55" r="40" fill="#111827" opacity="0.85" />
        <rect x="22" y="102" width="76" height="140" rx="24" fill="#111827" opacity="0.85" />
      </g>
      <g transform="translate(660, 90)">
        <circle cx="60" cy="55" r="40" fill="#0f172a" opacity="0.85" />
        <rect x="22" y="102" width="76" height="140" rx="24" fill="#0f172a" opacity="0.85" />
      </g>

      <g>
        <rect x="240" y="40" width="360" height="120" rx="18" fill="#ffffff" stroke="#e6e8ef" />
        <path d="M 330 160 L 300 195 L 365 165" fill="#ffffff" stroke="#e6e8ef" />
        <text x="270" y="85" fontSize="22" fontFamily="system-ui, -apple-system, Segoe UI, Roboto" fill="#111827">
          Hallo! Wie geht’s?
        </text>
        <text x="270" y="115" fontSize="18" fontFamily="system-ui, -apple-system, Segoe UI, Roboto" fill="#374151">
          Ich bin gut, weil heute frei ist.
        </text>
      </g>

      <g>
        <rect x="260" y="205" width="360" height="120" rx="18" fill="#ffffff" stroke="#e6e8ef" />
        <path d="M 560 205 L 615 175 L 595 225" fill="#ffffff" stroke="#e6e8ef" />
        <text x="290" y="250" fontSize="18" fontFamily="system-ui, -apple-system, Segoe UI, Roboto" fill="#111827">
          Es regnet. Deshalb bleibe ich drinnen.
        </text>
        <text x="290" y="282" fontSize="18" fontFamily="system-ui, -apple-system, Segoe UI, Roboto" fill="#374151">
          Ich lese, denn ich habe Zeit.
        </text>
      </g>

      <text
        x="450"
        y="360"
        textAnchor="middle"
        fontSize="16"
        fontFamily="system-ui, -apple-system, Segoe UI, Roboto"
        fill="#6b7280"
      >
        Small talk = short, friendly reasons (weil / deshalb / denn)
      </text>
    </svg>
  );
}

const A2StarterConjunctionsPage = () => {

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      {/* Header */}
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A2 Starter Grammar Note: weil, deshalb, denn
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Topic: Small talk • Day 1 • Chapter 1.1
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
          <span style={chip}>Goal: give simple reasons in conversation</span>
          <span style={chip}>A2 tip: keep sentences short</span>
          <span style={chip}>Pronunciation: speak slowly and clearly</span>
        </div>
        <div style={{ ...noteStyle, marginTop: 4 }}>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Day 1 reminder (A1 → A2):</strong> This first lesson is very important. If you can connect ideas with
            simple words, your speaking sounds clearer and more natural from the beginning.
          </p>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Start with short sentences: one idea per sentence.</li>
            <li>Use one connector correctly (for example: <strong>weil</strong>) before adding more.</li>
            <li>Practice 5 minutes daily: greeting + one reason sentence + one follow-up question.</li>
          </ul>
        </div>
      </div>

      {/* Picture */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Small talk picture</h2>
        <p style={{ margin: 0, color: "#374151", lineHeight: 1.7 }}>
          In small talk, you often add a short reason. That’s exactly where{" "}
          <strong>weil</strong>, <strong>deshalb</strong>, and <strong>denn</strong> are useful.
        </p>
        <SmallTalkIllustration height={180} />
      </div>

      {/* WORD ORDER CHANGES */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>What changes in the sentence?</h2>

        <div style={noteStyle}>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            These three words all give a reason, but the word order is not the same:
            <br />
            <Mark type="conjunction">weil</Mark> → the{" "}
            <Mark type="moved">verb moves to the end</Mark>
            <br />
            <Mark type="conjunction">deshalb</Mark> → the{" "}
            <Mark type="moved">verb comes directly after deshalb</Mark>
            <br />
            <Mark type="conjunction">denn</Mark> →{" "}
            <Mark type="verb">normal word order stays the same</Mark>
          </p>
        </div>

        <ShiftExample
          title='1) "weil" changes the verb position'
          normal={
            <>
              <Mark type="subject">Ich</Mark> <Mark type="verb">muss</Mark> morgen früh arbeiten.
            </>
          }
          changed={
            <>
              Ich bleibe heute kurz, <Mark type="conjunction">weil</Mark>{" "}
              <Mark type="subject">ich</Mark> morgen früh arbeiten{" "}
              <Mark type="moved">muss</Mark>.
            </>
          }
          note='With "weil", the clause becomes subordinate, so the conjugated verb goes to the end.'
        />

        <ShiftExample
          title='2) "deshalb" puts the verb before the subject'
          normal={
            <>
              <Mark type="subject">Ich</Mark> <Mark type="verb">gehe</Mark> heute früher nach Hause.
            </>
          }
          changed={
            <>
              Ich bin müde. <Mark type="conjunction">Deshalb</Mark>{" "}
              <Mark type="moved">gehe</Mark> <Mark type="subject">ich</Mark> heute früher nach Hause.
            </>
          }
          note='After "Deshalb", the verb comes immediately, and the subject comes after the verb.'
        />

        <ShiftExample
          title='3) "denn" keeps normal word order'
          normal={
            <>
              <Mark type="subject">Kaffee</Mark> <Mark type="verb">ist</Mark> mir zu stark.
            </>
          }
          changed={
            <>
              Ich trinke Tee, <Mark type="conjunction">denn</Mark>{" "}
              <Mark type="subject">Kaffee</Mark> <Mark type="verb">ist</Mark> mir zu stark.
            </>
          }
          note='With "denn", the second clause stays a normal main clause, so the word order does not change.'
        />
      </div>

      {/* What to remember */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>What to remember (with small-talk examples)</h2>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>1) weil</strong> → subordinate clause: the conjugated verb goes to the end.
            </p>
            <div style={exampleBox}>
              <div>
                <strong>Pattern:</strong> Ich ..., <Mark type="conjunction">weil</Mark> ich ...{" "}
                <Mark type="moved">VERB</Mark>.
              </div>
              <div>
                <strong>Examples:</strong>
                <ul style={{ margin: "6px 0 0 18px", display: "grid", gap: 6 }}>
                  <li>
                    Ich bin heute entspannt, <Mark type="conjunction">weil</Mark>{" "}
                    <Mark type="subject">ich</Mark> frei <Mark type="moved">habe</Mark>.
                  </li>
                  <li>
                    Ich gehe früher, <Mark type="conjunction">weil</Mark>{" "}
                    <Mark type="subject">ich</Mark> morgen früh aufstehen{" "}
                    <Mark type="moved">muss</Mark>.
                  </li>
                  <li>
                    Ich lerne Deutsch, <Mark type="conjunction">weil</Mark>{" "}
                    <Mark type="subject">ich</Mark> in Deutschland arbeiten{" "}
                    <Mark type="moved">möchte</Mark>.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>2) deshalb</strong> → new main clause: the verb comes directly after <em>deshalb</em>.
            </p>
            <div style={exampleBox}>
              <div>
                <strong>Pattern:</strong> Satz 1. <Mark type="conjunction">Deshalb</Mark>{" "}
                <Mark type="moved">VERB</Mark> ich ...
              </div>
              <div>
                <strong>Examples:</strong>
                <ul style={{ margin: "6px 0 0 18px", display: "grid", gap: 6 }}>
                  <li>
                    Es ist kalt. <Mark type="conjunction">Deshalb</Mark>{" "}
                    <Mark type="moved">trage</Mark> <Mark type="subject">ich</Mark> eine Jacke.
                  </li>
                  <li>
                    Ich habe gleich Unterricht. <Mark type="conjunction">Deshalb</Mark>{" "}
                    <Mark type="moved">bin</Mark> <Mark type="subject">ich</Mark> pünktlich.
                  </li>
                  <li>
                    Ich habe wenig Zeit. <Mark type="conjunction">Deshalb</Mark>{" "}
                    <Mark type="moved">schreibe</Mark> <Mark type="subject">ich</Mark> nur kurz.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>3) denn</strong> → connects two main clauses: normal word order stays.
            </p>
            <div style={exampleBox}>
              <div>
                <strong>Pattern:</strong> Ich ..., <Mark type="conjunction">denn</Mark> ich{" "}
                <Mark type="verb">VERB</Mark> ...
              </div>
              <div>
                <strong>Examples:</strong>
                <ul style={{ margin: "6px 0 0 18px", display: "grid", gap: 6 }}>
                  <li>
                    Ich trinke Tee, <Mark type="conjunction">denn</Mark>{" "}
                    <Mark type="subject">Kaffee</Mark> <Mark type="verb">ist</Mark> mir zu stark.
                  </li>
                  <li>
                    Ich komme später, <Mark type="conjunction">denn</Mark>{" "}
                    <Mark type="subject">ich</Mark> <Mark type="verb">habe</Mark> einen Termin.
                  </li>
                  <li>
                    Ich bin gut drauf, <Mark type="conjunction">denn</Mark>{" "}
                    <Mark type="subject">das Wetter</Mark> <Mark type="verb">ist</Mark> schön.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p style={{ margin: 0, color: "#374151", lineHeight: 1.7 }}>
          Fast rule: If you want <strong>one long sentence</strong>, use <strong>weil</strong> or{" "}
          <strong>denn</strong>. If you want <strong>two short sentences</strong>, use{" "}
          <strong>deshalb</strong>.
        </p>
      </div>

      {/* Quick reference */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Quick reference</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Conjunction", "Meaning", "Structure", "Example"].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      borderBottom: "2px solid #e6e8ef",
                      background: "#f7f8fb",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ruleTable.map((row) => (
                <tr key={row.conjunction}>
                  <td style={cell}>
                    <strong>{row.conjunction}</strong>
                  </td>
                  <td style={cell}>{row.meaning}</td>
                  <td style={cell}>{row.pattern}</td>
                  <td style={cell}>{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mini-dialogues */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Small talk mini-dialogues (A2)</h2>

        <div style={{ display: "grid", gap: 10 }}>
          <div style={exampleBox}>
            <strong>Dialog 1 (weil)</strong>
            <div>A: Wie geht’s?</div>
            <div>
              B: Gut, <Mark type="conjunction">weil</Mark> <Mark type="subject">ich</Mark> heute frei{" "}
              <Mark type="moved">habe</Mark>.
            </div>
          </div>

          <div style={exampleBox}>
            <strong>Dialog 2 (deshalb)</strong>
            <div>A: Kommst du heute mit?</div>
            <div>
              B: Ich bin müde. <Mark type="conjunction">Deshalb</Mark>{" "}
              <Mark type="moved">bleibe</Mark> <Mark type="subject">ich</Mark> zu Hause.
            </div>
          </div>

          <div style={exampleBox}>
            <strong>Dialog 3 (denn)</strong>
            <div>A: Warum lernst du Deutsch?</div>
            <div>
              B: Ich lerne Deutsch, <Mark type="conjunction">denn</Mark>{" "}
              <Mark type="subject">ich</Mark> <Mark type="verb">möchte</Mark> in Deutschland arbeiten.
            </div>
          </div>
        </div>
      </div>

      {/* Practice */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Mini practice (A2 starter)</h2>
        <p style={{ margin: 0, color: "#374151", lineHeight: 1.7 }}>
          Make each sentence sound like small talk: short, friendly, and simple.
        </p>

        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
          <li>
            Ich bleibe heute zu Hause, <Mark type="conjunction">weil</Mark> <em>...</em>
            <div style={{ marginTop: 6, ...exampleBox }}>
              Example: Ich bleibe heute zu Hause, weil ich müde bin.
            </div>
          </li>

          <li>
            Es regnet. <Mark type="conjunction">Deshalb</Mark> <em>...</em>
            <div style={{ marginTop: 6, ...exampleBox }}>
              Example: Es regnet. Deshalb nehme ich einen Schirm mit.
            </div>
          </li>

          <li>
            Ich höre gut zu, <Mark type="conjunction">denn</Mark> <em>...</em>
            <div style={{ marginTop: 6, ...exampleBox }}>
              Example: Ich höre gut zu, denn ich möchte alles verstehen.
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default A2StarterConjunctionsPage;
