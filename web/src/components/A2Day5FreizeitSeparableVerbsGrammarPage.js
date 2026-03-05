import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };

const SectionCard = ({ title, children }) => (
  <section style={cardStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const InlineCode = ({ children }) => (
  <span
    style={{
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "0.95em",
      padding: "2px 6px",
      borderRadius: 6,
      background: "rgba(0,0,0,0.06)",
    }}
  >
    {children}
  </span>
);

const A2Day5FreizeitSeparableVerbsGrammarPage = () => {
  const navigate = useNavigate();
  const splashImageUrl =
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1800&q=80";

  const verbs = [
    { infinitive: "fernsehen", stem: "sehen", prefix: "fern", meaning: "to watch TV" },
    { infinitive: "aufstehen", stem: "stehen", prefix: "auf", meaning: "to get up" },
    { infinitive: "ausgehen", stem: "gehen", prefix: "aus", meaning: "to go out" },
    { infinitive: "einkaufen", stem: "kaufen", prefix: "ein", meaning: "to shop" },
    { infinitive: "anrufen", stem: "rufen", prefix: "an", meaning: "to call" },
    { infinitive: "mitkommen", stem: "kommen", prefix: "mit", meaning: "to come along" },
  ];

  const examples = [
    "Ich stehe am Wochenende spät auf.",
    "Am Abend sehe ich oft fern.",
    "Wir gehen am Freitag mit Freunden aus.",
    "Sie kauft samstags im Zentrum ein.",
    "Er ruft seine Freundin nach dem Kurs an.",
    "Kommst du heute mit?",
  ];

  return (
    <div style={styles.pageWrap}>
      <div style={styles.container}>
        <button type="button" onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>

        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: "0 0 8px" }}>A2 • 2.5 Was machst du in deiner Freizeit?</h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Grammar focus: <strong>Trennbare Verben (Separable Verbs)</strong>
          </p>

          <div
            style={{
              marginTop: 12,
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={splashImageUrl}
              alt="Freizeitaktivitäten in der Stadt"
              loading="lazy"
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <SectionCard title="1) Rule: Where does the prefix go?">
            <p style={{ margin: 0 }}>
              In a normal present tense sentence, the conjugated verb stem stays in position 2 and the prefix
              moves to the end.
            </p>
            <p style={{ margin: 0 }}>
              Pattern: <InlineCode>Subject + verb stem + ... + prefix.</InlineCode>
            </p>
            <p style={{ margin: 0 }}>
              Example: <InlineCode>Ich stehe um 7 Uhr auf.</InlineCode>
            </p>
          </SectionCard>

          <SectionCard title="2) Common separable verbs for free time">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.04)" }}>
                    <th style={{ padding: 10, textAlign: "left", border: "1px solid rgba(0,0,0,0.08)" }}>Infinitive</th>
                    <th style={{ padding: 10, textAlign: "left", border: "1px solid rgba(0,0,0,0.08)" }}>Stem in sentence</th>
                    <th style={{ padding: 10, textAlign: "left", border: "1px solid rgba(0,0,0,0.08)" }}>Prefix at end</th>
                    <th style={{ padding: 10, textAlign: "left", border: "1px solid rgba(0,0,0,0.08)" }}>Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {verbs.map((verb) => (
                    <tr key={verb.infinitive}>
                      <td style={{ padding: 10, border: "1px solid rgba(0,0,0,0.08)" }}>{verb.infinitive}</td>
                      <td style={{ padding: 10, border: "1px solid rgba(0,0,0,0.08)" }}>{verb.stem}</td>
                      <td style={{ padding: 10, border: "1px solid rgba(0,0,0,0.08)" }}>{verb.prefix}</td>
                      <td style={{ padding: 10, border: "1px solid rgba(0,0,0,0.08)" }}>{verb.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="3) A2 model sentences (Freizeit)">
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {examples.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="4) Important reminder: modal verbs">
            <p style={{ margin: 0 }}>
              With modal verbs ({" "}
              <InlineCode>können, wollen, müssen</InlineCode>), the separable verb stays together in infinitive
              form at the end.
            </p>
            <p style={{ margin: 0 }}>
              Example: <InlineCode>Ich will heute Abend fernsehen.</InlineCode>
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default memo(A2Day5FreizeitSeparableVerbsGrammarPage);
