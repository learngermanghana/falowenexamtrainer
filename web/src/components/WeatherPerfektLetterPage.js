import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 8 };

const WeatherPerfektLetterPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <button style={styles.secondaryButton} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <section style={cardStyle}>
        <h1 style={{ margin: 0 }}>Chapter 13: Weather + Simple Letter Writing</h1>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          This chapter comes after <strong>Introduction to Letter Writing</strong>. Here you learn weather words and
          simple A1 connectors to write a short letter for <strong>Termin absagen</strong>.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>1) Weather words (A1)</h2>
        <ul style={listStyle}>
          <li>Es regnet. (It is raining.)</li>
          <li>Es schneit. (It is snowing.)</li>
          <li>Es ist windig. (It is windy.)</li>
          <li>Es ist kalt. (It is cold.)</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>2) Simple A1 connectors</h2>
        <ul style={listStyle}>
          <li>
            <strong>und</strong>: Ich komme heute nicht, <strong>und</strong> ich schreibe Ihnen.
          </li>
          <li>
            <strong>aber</strong>: Ich möchte kommen, <strong>aber</strong> es regnet stark.
          </li>
          <li>
            <strong>weil</strong>: Ich komme heute nicht, <strong>weil</strong> es regnet.
          </li>
        </ul>
        <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>
          Tip: Use <strong>weil</strong> instead of complex forms like <em>wegen</em> at this level.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>3) Letter steps: Termin absagen</h2>
        <ol style={listStyle}>
          <li>
            <strong>Cancel:</strong> Ich möchte den Termin absagen.
          </li>
          <li>
            <strong>Reason with weather:</strong> Ich kann heute nicht kommen, weil es regnet.
          </li>
          <li>
            <strong>Request a new appointment:</strong> Können wir einen neuen Termin machen?
          </li>
          <li>
            <strong>Polite ending:</strong> Ich freue mich auf Ihre Antwort. Mit freundlichen Grüßen
          </li>
        </ol>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>4) Practice: formulate correct statements</h2>
        <p style={{ margin: 0 }}>Rewrite each note as one correct A1 sentence.</p>
        <ul style={listStyle}>
          <li>ich / heute / nicht kommen / es regnet</li>
          <li>ich / termin absagen / und / ich / neuen termin / möchten</li>
          <li>ich / kommen / aber / es / sehr windig</li>
        </ul>
        <InfoAnswer />
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>5) Mini sample (formal)</h2>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, lineHeight: 1.7 }}>
          <p style={{ margin: 0 }}>Sehr geehrte Damen und Herren,</p>
          <p style={{ margin: "10px 0 0" }}>ich möchte den Termin absagen, weil es heute stark regnet.</p>
          <p style={{ margin: "10px 0 0" }}>Können wir einen neuen Termin für nächste Woche machen?</p>
          <p style={{ margin: "10px 0 0" }}>Ich freue mich auf Ihre Antwort.</p>
          <p style={{ margin: "10px 0 0" }}>
            Mit freundlichen Grüßen
            <br />
            [Ihr Name]
          </p>
        </div>
      </section>
    </div>
  );
};

const InfoAnswer = () => (
  <div style={{ border: "1px dashed #9ca3af", borderRadius: 10, padding: 10, fontSize: 14, lineHeight: 1.6 }}>
    <strong>Possible answers:</strong>
    <div>1. Ich kann heute nicht kommen, weil es regnet.</div>
    <div>2. Ich möchte den Termin absagen, und ich möchte einen neuen Termin.</div>
    <div>3. Ich komme, aber es ist sehr windig.</div>
  </div>
);

export default WeatherPerfektLetterPage;
