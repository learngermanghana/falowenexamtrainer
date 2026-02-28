import React from "react";
import { useNavigate } from "react-router-dom";
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

const cell = { borderBottom: "1px solid #e6e8ef", padding: "8px 10px", verticalAlign: "top" };

function SmallTalkIllustration({ height = 160 }) {
  // Simple “picture” (SVG) — no external image needed.
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
      {/* People */}
      <g transform="translate(120, 90)">
        <circle cx="60" cy="55" r="40" fill="#111827" opacity="0.85" />
        <rect x="22" y="102" width="76" height="140" rx="24" fill="#111827" opacity="0.85" />
      </g>
      <g transform="translate(660, 90)">
        <circle cx="60" cy="55" r="40" fill="#0f172a" opacity="0.85" />
        <rect x="22" y="102" width="76" height="140" rx="24" fill="#0f172a" opacity="0.85" />
      </g>

      {/* Speech bubbles */}
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

      {/* Title */}
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

const exampleBox = {
  margin: 0,
  padding: "10px 12px",
  border: "1px dashed #d1d5db",
  borderRadius: 12,
  background: "#fafafa",
  lineHeight: 1.7,
  color: "#111827",
};

const A2StarterConjunctionsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      {/* Header */}
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 Starter Grammar Note: weil, deshalb, denn</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Topic: Small talk • Day 1 • Chapter 1.1</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
          <span style={chip}>Goal: give simple reasons in conversation</span>
          <span style={chip}>A2 tip: keep sentences short</span>
          <span style={chip}>Pronunciation: speak slowly and clearly</span>
        </div>
      </div>

      {/* Picture */}
      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Small talk picture</h2>
        <p style={{ margin: 0, color: "#374151", lineHeight: 1.7 }}>
          In small talk, you often add a short reason. That’s exactly where <strong>weil</strong>,{" "}
          <strong>deshalb</strong>, and <strong>denn</strong> are useful.
        </p>
        <SmallTalkIllustration height={180} />
      </div>

      {/* What to remember (expanded + examples) */}
      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>What to remember (with small-talk examples)</h2>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>1) weil</strong> → subordinate clause: the conjugated verb goes to the end.
            </p>
            <div style={exampleBox}>
              <div>
                <strong>Pattern:</strong> Ich ..., <strong>weil</strong> ich ... <strong>VERB</strong>.
              </div>
              <div>
                <strong>Examples:</strong>
                <ul style={{ margin: "6px 0 0 18px", display: "grid", gap: 6 }}>
                  <li>Ich bin heute entspannt, weil ich frei habe.</li>
                  <li>Ich gehe früher, weil ich morgen früh aufstehen muss.</li>
                  <li>Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.</li>
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
                <strong>Pattern:</strong> Satz 1. <strong>Deshalb</strong> <strong>VERB</strong> ich ...
              </div>
              <div>
                <strong>Examples:</strong>
                <ul style={{ margin: "6px 0 0 18px", display: "grid", gap: 6 }}>
                  <li>Es ist kalt. Deshalb trage ich eine Jacke.</li>
                  <li>Ich habe gleich Unterricht. Deshalb bin ich pünktlich.</li>
                  <li>Ich habe wenig Zeit. Deshalb schreibe ich nur kurz.</li>
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
                <strong>Pattern:</strong> Ich ..., <strong>denn</strong> ich <strong>VERB</strong> ...
              </div>
              <div>
                <strong>Examples:</strong>
                <ul style={{ margin: "6px 0 0 18px", display: "grid", gap: 6 }}>
                  <li>Ich trinke Tee, denn Kaffee ist mir zu stark.</li>
                  <li>Ich komme später, denn ich habe einen Termin.</li>
                  <li>Ich bin gut drauf, denn das Wetter ist schön.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p style={{ margin: 0, color: "#374151", lineHeight: 1.7 }}>
          Fast rule: If you want <strong>one long sentence</strong>, use <strong>weil</strong> or <strong>denn</strong>.
          If you want <strong>two short sentences</strong>, use <strong>deshalb</strong>.
        </p>
      </div>

      {/* Quick reference table */}
      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
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

      {/* Small talk mini-dialogues */}
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Small talk mini-dialogues (A2)</h2>

        <div style={{ display: "grid", gap: 10 }}>
          <div style={exampleBox}>
            <strong>Dialog 1 (weil)</strong>
            <div>A: Wie geht’s?</div>
            <div>B: Gut, weil ich heute frei habe.</div>
          </div>

          <div style={exampleBox}>
            <strong>Dialog 2 (deshalb)</strong>
            <div>A: Kommst du heute mit?</div>
            <div>B: Ich bin müde. Deshalb bleibe ich zu Hause.</div>
          </div>

          <div style={exampleBox}>
            <strong>Dialog 3 (denn)</strong>
            <div>A: Warum lernst du Deutsch?</div>
            <div>B: Ich lerne Deutsch, denn ich möchte in Deutschland arbeiten.</div>
          </div>
        </div>
      </div>

      {/* Mini practice */}
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Mini practice (A2 starter)</h2>
        <p style={{ margin: 0, color: "#374151", lineHeight: 1.7 }}>
          Make each sentence sound like small talk: short, friendly, and simple.
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
          <li>
            Ich bleibe heute zu Hause, weil <em>...</em>
            <div style={{ marginTop: 6, ...exampleBox }}>
              Example: Ich bleibe heute zu Hause, weil ich müde bin.
            </div>
          </li>
          <li>
            Es regnet. Deshalb <em>...</em>
            <div style={{ marginTop: 6, ...exampleBox }}>
              Example: Es regnet. Deshalb nehme ich einen Schirm mit.
            </div>
          </li>
          <li>
            Ich höre gut zu, denn <em>...</em>
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
