import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 20, display: "grid", gap: 8 };

const noteStyle = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.7,
  color: "#374151",
  background: "#f9fafb",
  border: "1px dashed #9ca3af",
  borderRadius: 12,
  padding: 12,
};

const boxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  lineHeight: 1.75,
  background: "white",
};

const chipRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const chip = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: 999,
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  fontSize: 13,
  fontWeight: 700,
};

const imgStyle = {
  width: "100%",
  borderRadius: 12,
  marginBottom: 12,
  objectFit: "cover",
  maxHeight: 180, // 🔹 reduced for cleaner UI
  border: "1px solid #e5e7eb",
};

const WeatherPerfektLetterPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <button style={styles.secondaryButton} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* INTRO */}
      <section style={cardStyle}>
        <h1 style={{ margin: 0 }}>
          Chapter 13: Weather + Seasons + Dates/Time + Simple Letter Writing (A1)
        </h1>

        <p style={{ margin: 0, lineHeight: 1.65 }}>
          Learn to talk about <strong>weather</strong>, <strong>seasons</strong>,
          and use <strong>im</strong>, <strong>am</strong>, <strong>um</strong>.
          <br />
          Practice simple letters using <strong>weil</strong>.
        </p>

        <div style={chipRow}>
          <span style={chip}>im = months</span>
          <span style={chip}>am = days</span>
          <span style={chip}>um = time</span>
          <span style={chip}>weil = verb at end</span>
        </div>
      </section>

      {/* WEATHER */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>1) Weather (A1)</h2>

        <img
          src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=70"
          alt="Weather"
          style={imgStyle}
        />

        <ul style={listStyle}>
          <li>Es regnet.</li>
          <li>Es schneit.</li>
          <li>Es ist kalt / warm / windig.</li>
          <li>Die Sonne scheint.</li>
        </ul>
      </section>

      {/* SEASONS */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>2) Seasons + Months</h2>

        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=70"
          alt="Seasons"
          style={imgStyle}
        />

        <div style={boxStyle}>
          <strong>Seasons:</strong>
          <ul style={listStyle}>
            <li>der Frühling</li>
            <li>der Sommer</li>
            <li>der Herbst</li>
            <li>der Winter</li>
          </ul>

          <strong>Months:</strong>
          <p>
            Januar, Februar, März, April, Mai, Juni, Juli, August, September,
            Oktober, November, Dezember
          </p>
        </div>
      </section>

      {/* IM AM UM */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>3) im / am / um</h2>

        <div style={boxStyle}>
          <ul style={listStyle}>
            <li>Im August fahre ich in den Urlaub.</li>
            <li>Am Montag habe ich einen Termin.</li>
            <li>Um 10 Uhr komme ich.</li>
          </ul>
        </div>
      </section>

      {/* PRICE + REQUEST */}
      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>4) Asking for Price (A1)</h2>

        <img
          src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1600&q=70"
          alt="Payment"
          style={imgStyle}
        />

        <div style={noteStyle}>
          <strong>Simple price questions:</strong>
          <div>• Wie viel kostet der Kurs?</div>
          <div>• Was kostet der Kurs?</div>

          <div style={{ marginTop: 10 }}>
            <strong>Payment:</strong>
            <div>• Wie kann ich bezahlen?</div>
            <div>• Mit Kreditkarte oder bar?</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <strong>Polite request:</strong>
            <div>• Könnten Sie mir bitte Informationen geben?</div>
            <div>• Könnten Sie mir bitte sagen, wann der Kurs beginnt?</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WeatherPerfektLetterPage;
