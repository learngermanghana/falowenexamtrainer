import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 12 };

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 15,
};

const thTdStyle = {
  border: "1px solid #d1d5db",
  padding: "8px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const quizStyle = {
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const adjectiveRows = [
  ["das Gesicht", "round/oval", "ein rundes Gesicht", "Sie hat ein ovales Gesicht."],
  ["die Haare", "kurz/lang/lockig/glatt", "kurze Haare", "Er hat kurze, lockige Haare."],
  ["die Augen", "blau/braun/grün", "blaue Augen", "Sie hat große braune Augen."],
  ["die Figur", "sportlich/schlank", "eine sportliche Figur", "Er hat eine sportliche Figur."],
  ["der Charakter", "freundlich/ruhig/lustig", "ein ruhiger Charakter", "Sie ist sehr freundlich und ruhig."],
];

const A1Day3Kapitel12GrammarNotesPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 10 }}>
        <button
          type="button"
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Personen beschreiben (1.2) · Grammar Notes</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Aussehen und Charakter beschreiben mit Adjektiven</p>

        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80"
          alt="Group of people smiling outdoors"
          style={{ width: "100%", borderRadius: 12, maxHeight: 320, objectFit: "cover" }}
        />
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>1) Satzmuster für Personenbeschreibungen</h2>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
          <li>
            <strong>Aussehen:</strong> <em>Er/Sie hat + Akkusativ</em> → <em>Sie hat lange Haare.</em>
          </li>
          <li>
            <strong>Charakter:</strong> <em>Er/Sie ist + Adjektiv</em> → <em>Er ist sehr freundlich.</em>
          </li>
          <li>
            <strong>Kleidung:</strong> <em>Er/Sie trägt + Akkusativ</em> → <em>Sie trägt ein rotes Kleid.</em>
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>2) Häufige Adjektive: Aussehen & Charakter</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Nomen</th>
                <th style={thTdStyle}>Adjektive</th>
                <th style={thTdStyle}>Beispielphrase</th>
                <th style={thTdStyle}>Beispielsatz</th>
              </tr>
            </thead>
            <tbody>
              {adjectiveRows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell} style={thTdStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>3) Gradpartikeln: sehr, ziemlich, ein bisschen</h2>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
          <li>
            <strong>sehr</strong> = strong: <em>Sie ist sehr offen.</em>
          </li>
          <li>
            <strong>ziemlich</strong> = medium: <em>Er ist ziemlich sportlich.</em>
          </li>
          <li>
            <strong>ein bisschen</strong> = weak: <em>Sie ist ein bisschen schüchtern.</em>
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>4) Gegensätze verbinden: aber</h2>
        <p style={{ margin: 0 }}>
          Nutze <strong>aber</strong>, um Kontraste in einer Beschreibung zu zeigen.
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
          <li>
            <em>Er ist ruhig, aber sehr humorvoll.</em>
          </li>
          <li>
            <em>Sie ist klein, aber sehr sportlich.</em>
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>5) Mini quiz</h2>
        <div style={quizStyle}>
          <p style={{ margin: 0 }}>
            <strong>1.</strong> Ergänze: <em>Sie hat _____ Haare.</em> (lang)
          </p>
          <p style={{ margin: 0 }}>
            <strong>2.</strong> Ergänze: <em>Er ist _____ freundlich.</em> (very)
          </p>
          <p style={{ margin: 0 }}>
            <strong>3.</strong> Verbinde mit <em>aber</em>: <em>Er ist schüchtern. Er ist hilfsbereit.</em>
          </p>
          <p style={{ margin: 0, color: "#475569" }}>
            Antworten: 1) <strong>lange</strong>, 2) <strong>sehr</strong>, 3) <strong>Er ist schüchtern, aber hilfsbereit.</strong>
          </p>
        </div>
      </section>
    </main>
  );
};

export default A1Day3Kapitel12GrammarNotesPage;
