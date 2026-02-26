import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const ruleTable = [
  {
    conjunction: "weil",
    meaning: "because",
    pattern: "Main clause, weil + subject + ... + verb.",
    example: "Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.",
  },
  {
    conjunction: "deshalb",
    meaning: "therefore / that is why",
    pattern: "Main clause. Deshalb + verb + subject + ...",
    example: "Ich habe heute Unterricht, deshalb komme ich pünktlich.",
  },
  {
    conjunction: "denn",
    meaning: "because",
    pattern: "Main clause, denn + subject + verb + ...",
    example: "Ich mache die Aufgabe, denn ich möchte besser werden.",
  },
];

const A2StarterConjunctionsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 Starter Grammar Note: weil, deshalb, denn</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Day 1 • Chapter 1.1 • First class after A1</p>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>What to remember</h2>
        <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>
            <strong>weil</strong> starts a subordinate clause, so the conjugated verb goes to the end.
          </li>
          <li>
            <strong>deshalb</strong> starts a new main clause, and the verb comes directly after <em>deshalb</em>.
          </li>
          <li>
            <strong>denn</strong> connects two main clauses and keeps normal word order.
          </li>
        </ul>
      </div>

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
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #e6e8ef" }}>
                    <strong>{row.conjunction}</strong>
                  </td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #e6e8ef" }}>{row.meaning}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #e6e8ef" }}>{row.pattern}</td>
                  <td style={{ padding: "8px 10px", borderBottom: "1px solid #e6e8ef" }}>{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Mini practice (A2 starter)</h2>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
          <li>Ich bleibe zu Hause, weil ich müde bin.</li>
          <li>Es regnet. Deshalb nehme ich einen Schirm mit.</li>
          <li>Ich höre gut zu, denn ich möchte alles verstehen.</li>
        </ol>
      </div>
    </div>
  );
};

export default A2StarterConjunctionsPage;
