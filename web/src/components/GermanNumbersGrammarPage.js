import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 12 };

const tableCell = {
  border: "1px solid #d1d5db",
  padding: 8,
  verticalAlign: "top",
};

const infoBox = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
};

const warningBox = {
  border: "1px solid #fde68a",
  background: "#fffbeb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
};

const noteBox = {
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
};

const builderWrap = {
  display: "grid",
  gap: 12,
};

const builderRow = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  background: "#ffffff",
  display: "grid",
  gap: 10,
};

const builderPieces = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
};

const arrowStyle = {
  fontWeight: 700,
  color: "#6b7280",
  alignSelf: "center",
};

const legendWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const placeValueGrid = {
  display: "grid",
  gap: 12,
};

const placeValueCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 10,
};

const getPlaceValueRowStyle = (isMobile) => ({
  display: "grid",
  gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
  gap: 8,
});

const placeValueBox = (background, borderColor, color) => ({
  background,
  border: `1px solid ${borderColor}`,
  color,
  borderRadius: 12,
  padding: 10,
  display: "grid",
  gap: 4,
  textAlign: "center",
});

const getPieceStyle = (type) => {
  const common = {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid transparent",
    fontWeight: 600,
    fontSize: "0.95rem",
  };

  if (type === "one") {
    return {
      ...common,
      background: "#dbeafe",
      borderColor: "#93c5fd",
      color: "#1d4ed8",
    };
  }

  if (type === "ten") {
    return {
      ...common,
      background: "#dcfce7",
      borderColor: "#86efac",
      color: "#15803d",
    };
  }

  if (type === "hundred") {
    return {
      ...common,
      background: "#fef3c7",
      borderColor: "#fcd34d",
      color: "#b45309",
    };
  }

  if (type === "thousand") {
    return {
      ...common,
      background: "#f3e8ff",
      borderColor: "#d8b4fe",
      color: "#7e22ce",
    };
  }

  if (type === "link") {
    return {
      ...common,
      background: "#f3f4f6",
      borderColor: "#d1d5db",
      color: "#374151",
    };
  }

  return {
    ...common,
    background: "#f9fafb",
    borderColor: "#d1d5db",
    color: "#111827",
  };
};

const BuilderPiece = ({ children, type }) => (
  <span style={getPieceStyle(type)}>{children}</span>
);

const numbersOneToTwenty = [
  ["0", "Null", "nuu"],
  ["1", "Eins", "ains"],
  ["2", "Zwei", "tsvai"],
  ["3", "Drei", "dry"],
  ["4", "Vier", "feer"],
  ["5", "Fünf", "fuenf"],
  ["6", "Sechs", "zex"],
  ["7", "Sieben", "zee-ben"],
  ["8", "Acht", "ahkt"],
  ["9", "Neun", "noyn"],
  ["10", "Zehn", "tsayn"],
  ["11", "Elf", "elf"],
  ["12", "Zwölf", "tsvölf"],
  ["13", "Dreizehn", "dry-tsayn"],
  ["14", "Vierzehn", "feer-tsayn"],
  ["15", "Fünfzehn", "fuenf-tsayn"],
  ["16", "Sechzehn", "zex-tsayn"],
  ["17", "Siebzehn", "zeeb-tsayn"],
  ["18", "Achtzehn", "ahkt-tsayn"],
  ["19", "Neunzehn", "noyn-tsayn"],
  ["20", "Zwanzig", "tsvantsig"],
];

const GermanNumbersGrammarPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreen = () => {
      setIsMobile(window.innerWidth < 640);
    };

    updateScreen();
    window.addEventListener("resize", updateScreen);

    return () => window.removeEventListener("resize", updateScreen);
  }, []);

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          German Numbers 0–10,000 and Address Expressions
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter 2 • German Numbers and Using <strong>wohnen</strong> with <strong>in</strong> and{" "}
          <strong>in der</strong>
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Goal</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          In this lesson you will learn how German numbers work from <strong>0 to 10,000</strong>. You
          will also learn how to say where you live using <strong>wohnen</strong>.
        </p>

        <div style={infoBox}>
          <strong>Today you will learn:</strong>
          <span>✔ Numbers from 0–20</span>
          <span>✔ Numbers from 21–100</span>
          <span>✔ Numbers from 100–1000</span>
          <span>✔ Numbers from 1000–10000</span>
          <span>✔ How to say where you live</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>German Numbers 0–20</h2>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              minWidth: 420,
            }}
          >
            <thead>
              <tr>
                <th style={tableCell}>Number</th>
                <th style={tableCell}>German</th>
                <th style={tableCell}>Pronunciation</th>
              </tr>
            </thead>

            <tbody>
              {numbersOneToTwenty.map(([num, word, pronunciation]) => (
                <tr key={num}>
                  <td style={tableCell}>{num}</td>
                  <td style={tableCell}>
                    <strong>{word}</strong>
                  </td>
                  <td style={tableCell}>{pronunciation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>How German Numbers Work</h2>

        <div style={infoBox}>
          <p style={{ margin: 0 }}>German numbers are built from smaller parts.</p>
          <p style={{ margin: 0 }}>
            <strong>21</strong> = ein + und + zwanzig → <strong>einundzwanzig</strong>
          </p>
          <p style={{ margin: 0 }}>
            <strong>47</strong> = sieben + und + vierzig → <strong>siebenundvierzig</strong>
          </p>
          <p style={{ margin: 0 }}>
            <strong>315</strong> = drei + hundert + fünfzehn → <strong>dreihundertfünfzehn</strong>
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Visual Number Builder</h2>

        <div style={noteBox}>
          <strong>Color Guide</strong>
          <div style={legendWrap}>
            <BuilderPiece type="one">ones</BuilderPiece>
            <BuilderPiece type="ten">tens</BuilderPiece>
            <BuilderPiece type="hundred">hundreds</BuilderPiece>
            <BuilderPiece type="thousand">thousands</BuilderPiece>
            <BuilderPiece type="link">und / link</BuilderPiece>
          </div>
        </div>

        <div style={builderWrap}>
          <div style={builderRow}>
            <strong>21</strong>
            <div style={builderPieces}>
              <BuilderPiece type="one">ein</BuilderPiece>
              <BuilderPiece type="link">und</BuilderPiece>
              <BuilderPiece type="ten">zwanzig</BuilderPiece>
              <span style={arrowStyle}>→</span>
              <BuilderPiece>einundzwanzig</BuilderPiece>
            </div>
          </div>

          <div style={builderRow}>
            <strong>47</strong>
            <div style={builderPieces}>
              <BuilderPiece type="one">sieben</BuilderPiece>
              <BuilderPiece type="link">und</BuilderPiece>
              <BuilderPiece type="ten">vierzig</BuilderPiece>
              <span style={arrowStyle}>→</span>
              <BuilderPiece>siebenundvierzig</BuilderPiece>
            </div>
          </div>

          <div style={builderRow}>
            <strong>315</strong>
            <div style={builderPieces}>
              <BuilderPiece type="one">drei</BuilderPiece>
              <BuilderPiece type="hundred">hundert</BuilderPiece>
              <BuilderPiece type="ten">fünfzehn</BuilderPiece>
              <span style={arrowStyle}>→</span>
              <BuilderPiece>dreihundertfünfzehn</BuilderPiece>
            </div>
          </div>

          <div style={builderRow}>
            <strong>642</strong>
            <div style={builderPieces}>
              <BuilderPiece type="one">sechs</BuilderPiece>
              <BuilderPiece type="hundred">hundert</BuilderPiece>
              <BuilderPiece type="one">zwei</BuilderPiece>
              <BuilderPiece type="link">und</BuilderPiece>
              <BuilderPiece type="ten">vierzig</BuilderPiece>
              <span style={arrowStyle}>→</span>
              <BuilderPiece>sechshundertzweiundvierzig</BuilderPiece>
            </div>
          </div>

          <div style={builderRow}>
            <strong>7,842</strong>
            <div style={builderPieces}>
              <BuilderPiece type="one">sieben</BuilderPiece>
              <BuilderPiece type="thousand">tausend</BuilderPiece>
              <BuilderPiece type="one">acht</BuilderPiece>
              <BuilderPiece type="hundred">hundert</BuilderPiece>
              <BuilderPiece type="one">zwei</BuilderPiece>
              <BuilderPiece type="link">und</BuilderPiece>
              <BuilderPiece type="ten">vierzig</BuilderPiece>
              <span style={arrowStyle}>→</span>
              <BuilderPiece>siebentausendachthundertzweiundvierzig</BuilderPiece>
            </div>
          </div>
        </div>

        <div style={noteBox}>
          <strong>Important idea</strong>
          <span>German often puts the parts together into one long word.</span>
          <span>For 21–99, the ones usually come before the tens.</span>
          <span>
            That is why 47 is <strong>sieben-und-vierzig</strong>, not <strong>vierzig-und-sieben</strong>.
          </span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Place-Value Chart</h2>

        <div style={placeValueGrid}>
          <div style={placeValueCard}>
            <strong>47</strong>
            <div style={getPlaceValueRowStyle(isMobile)}>
              <div style={placeValueBox("#f3e8ff", "#d8b4fe", "#7e22ce")}>
                <span style={{ fontWeight: 700 }}>0</span>
                <span>thousands</span>
              </div>
              <div style={placeValueBox("#fef3c7", "#fcd34d", "#b45309")}>
                <span style={{ fontWeight: 700 }}>0</span>
                <span>hundreds</span>
              </div>
              <div style={placeValueBox("#dcfce7", "#86efac", "#15803d")}>
                <span style={{ fontWeight: 700 }}>4</span>
                <span>tens</span>
              </div>
              <div style={placeValueBox("#dbeafe", "#93c5fd", "#1d4ed8")}>
                <span style={{ fontWeight: 700 }}>7</span>
                <span>ones</span>
              </div>
            </div>
            <span>
              47 = 4 tens + 7 ones → <strong>siebenundvierzig</strong>
            </span>
          </div>

          <div style={placeValueCard}>
            <strong>315</strong>
            <div style={getPlaceValueRowStyle(isMobile)}>
              <div style={placeValueBox("#f3e8ff", "#d8b4fe", "#7e22ce")}>
                <span style={{ fontWeight: 700 }}>0</span>
                <span>thousands</span>
              </div>
              <div style={placeValueBox("#fef3c7", "#fcd34d", "#b45309")}>
                <span style={{ fontWeight: 700 }}>3</span>
                <span>hundreds</span>
              </div>
              <div style={placeValueBox("#dcfce7", "#86efac", "#15803d")}>
                <span style={{ fontWeight: 700 }}>1</span>
                <span>tens</span>
              </div>
              <div style={placeValueBox("#dbeafe", "#93c5fd", "#1d4ed8")}>
                <span style={{ fontWeight: 700 }}>5</span>
                <span>ones</span>
              </div>
            </div>
            <span>
              315 = 3 hundreds + 15 → <strong>dreihundertfünfzehn</strong>
            </span>
          </div>

          <div style={placeValueCard}>
            <strong>642</strong>
            <div style={getPlaceValueRowStyle(isMobile)}>
              <div style={placeValueBox("#f3e8ff", "#d8b4fe", "#7e22ce")}>
                <span style={{ fontWeight: 700 }}>0</span>
                <span>thousands</span>
              </div>
              <div style={placeValueBox("#fef3c7", "#fcd34d", "#b45309")}>
                <span style={{ fontWeight: 700 }}>6</span>
                <span>hundreds</span>
              </div>
              <div style={placeValueBox("#dcfce7", "#86efac", "#15803d")}>
                <span style={{ fontWeight: 700 }}>4</span>
                <span>tens</span>
              </div>
              <div style={placeValueBox("#dbeafe", "#93c5fd", "#1d4ed8")}>
                <span style={{ fontWeight: 700 }}>2</span>
                <span>ones</span>
              </div>
            </div>
            <span>
              642 = 6 hundreds + 42 → <strong>sechshundertzweiundvierzig</strong>
            </span>
          </div>

          <div style={placeValueCard}>
            <strong>7,842</strong>
            <div style={getPlaceValueRowStyle(isMobile)}>
              <div style={placeValueBox("#f3e8ff", "#d8b4fe", "#7e22ce")}>
                <span style={{ fontWeight: 700 }}>7</span>
                <span>thousands</span>
              </div>
              <div style={placeValueBox("#fef3c7", "#fcd34d", "#b45309")}>
                <span style={{ fontWeight: 700 }}>8</span>
                <span>hundreds</span>
              </div>
              <div style={placeValueBox("#dcfce7", "#86efac", "#15803d")}>
                <span style={{ fontWeight: 700 }}>4</span>
                <span>tens</span>
              </div>
              <div style={placeValueBox("#dbeafe", "#93c5fd", "#1d4ed8")}>
                <span style={{ fontWeight: 700 }}>2</span>
                <span>ones</span>
              </div>
            </div>
            <span>
              7,842 = 7 thousands + 8 hundreds + 42 → <strong>siebentausendachthundertzweiundvierzig</strong>
            </span>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Common Mistakes</h2>

        <div style={warningBox}>
          <span>❌ siebenzehn</span>
          <span>✔ <strong>siebzehn</strong></span>
          <span>❌ sechszehn</span>
          <span>✔ <strong>sechzehn</strong></span>
          <span>❌ zwanzigundeins</span>
          <span>✔ <strong>einundzwanzig</strong></span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Numbers 21–100</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Numbers between 21 and 99 follow this pattern:
        </p>

        <div style={noteBox}>
          <strong>unit + und + tens</strong>
          <span>
            21 → <strong>einundzwanzig</strong>
          </span>
          <span>
            43 → <strong>dreiundvierzig</strong>
          </span>
          <span>
            99 → <strong>neunundneunzig</strong>
          </span>
        </div>

        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>30 – Dreißig</li>
          <li>40 – Vierzig</li>
          <li>50 – Fünfzig</li>
          <li>60 – Sechzig</li>
          <li>70 – Siebzig</li>
          <li>80 – Achtzig</li>
          <li>90 – Neunzig</li>
          <li>100 – Hundert</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Numbers 100–1000</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>Hundreds are written as one word.</p>

        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>101 – Einhunderteins</li>
          <li>209 – Zweihundertneun</li>
          <li>315 – Dreihundertfünfzehn</li>
          <li>551 – Fünfhunderteinundfünfzig</li>
          <li>777 – Siebenhundertsiebenundsiebzig</li>
          <li>1000 – Tausend</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Numbers 1000–10000</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          German numbers combine thousands, hundreds, tens, and ones.
        </p>

        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>2000 – Zweitausend</li>
          <li>3015 – Dreitausendfünfzehn</li>
          <li>5551 – Fünftausendfünfhunderteinundfünfzig</li>
          <li>7867 – Siebentausendachthundertsiebenundsechzig</li>
          <li>10000 – Zehntausend</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Where You Use Numbers</h2>

        <div style={noteBox}>
          <span>Age → Ich bin 24 Jahre alt.</span>
          <span>Phone number → Meine Telefonnummer ist ...</span>
          <span>Prices → Das kostet 15 Euro.</span>
          <span>Addresses → Ich wohne in der Hauptstraße 12.</span>
          <span>Time → Es ist 8 Uhr.</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Using “in” and “in der” with wohnen</h2>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              minWidth: 520,
            }}
          >
            <thead>
              <tr>
                <th style={tableCell}>Context</th>
                <th style={tableCell}>Pattern</th>
                <th style={tableCell}>Example</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={tableCell}>Living in a city</td>
                <td style={tableCell}>
                  <strong>in</strong> + city
                </td>
                <td style={tableCell}>
                  <em>Ich wohne in Berlin.</em>
                </td>
              </tr>

              <tr>
                <td style={tableCell}>Living on a street</td>
                <td style={tableCell}>
                  <strong>in der</strong> + street name
                </td>
                <td style={tableCell}>
                  <em>Ich wohne in der Hauptstraße.</em>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={noteBox}>
          <strong>Why?</strong>
          <span>Straße = die Straße (feminine)</span>
          <span>Dative form → der Straße</span>
          <span>
            So we say: <strong>in der Straße</strong>
          </span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Summary</h2>

        <div style={infoBox}>
          <span>✔ German numbers from 0–10,000</span>
          <span>✔ How numbers are built from smaller words</span>
          <span>✔ Pattern: unit + und + tens</span>
          <span>✔ Hundreds and thousands</span>
          <span>
            ✔ Difference between <strong>in Berlin</strong> and <strong>in der Hauptstraße</strong>
          </span>
        </div>
      </section>
    </main>
  );
};

export default GermanNumbersGrammarPage;
