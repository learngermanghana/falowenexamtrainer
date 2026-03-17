import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const heroImage =
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80";

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

const practiceBox = {
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
  borderRadius: 12,
  padding: 14,
  display: "grid",
  gap: 10,
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
  gridTemplateColumns: isMobile
    ? "repeat(2, minmax(0, 1fr))"
    : "repeat(4, minmax(0, 1fr))",
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

const numbersZeroToTwenty = [
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
      <header
        style={{
          ...styles.card,
          overflow: "hidden",
          padding: 0,
          display: "grid",
          gap: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            height: isMobile ? 180 : 280,
            backgroundImage: `linear-gradient(rgba(17,24,39,0.45), rgba(17,24,39,0.45)), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "end",
          }}
        >
          <div style={{ padding: 20, color: "#fff", width: "100%" }}>
            <button
              style={{
                ...styles.secondaryButton,
                width: "fit-content",
                marginBottom: 14,
                background: "rgba(255,255,255,0.9)",
              }}
              onClick={() => navigate("/campus/course")}
            >
              Back to Course
            </button>

            <h1 style={{ ...styles.title, marginBottom: 6, color: "#fff" }}>
              German Numbers 0–10,000 and Address Expressions
            </h1>

            <p style={{ ...styles.subtitle, margin: 0, color: "#f3f4f6" }}>
              Chapter 2 • Learn numbers step by step and say where you live in
              German.
            </p>
          </div>
        </div>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Lesson Goal</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          In this lesson you will learn German numbers in a clear order:
          <strong> 0–20</strong>, <strong>20–100</strong>,
          <strong> 100–1000</strong>, and <strong>1000–10000</strong>. At the
          end, you will also learn how to say your city, street, and address
          using <strong>wohnen</strong>.
        </p>

        <div style={infoBox}>
          <strong>Today you will learn:</strong>
          <span>✔ Numbers from 0–20</span>
          <span>✔ Numbers from 20–100</span>
          <span>✔ Numbers from 100–1000</span>
          <span>✔ Numbers from 1000–10000</span>
          <span>✔ How to say where you live</span>
          <span>✔ A small practice check inside the notes</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Part 1: Numbers 0–20</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Start by learning these numbers very well. They are the foundation for
          bigger numbers.
        </p>

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
              {numbersZeroToTwenty.map(([num, word, pronunciation]) => (
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

        <div style={practiceBox}>
          <strong>Quick Check: 0–20</strong>
          <span>Write these in German:</span>
          <span>1. 6 = ______</span>
          <span>2. 11 = ______</span>
          <span>3. 17 = ______</span>
          <span>4. 20 = ______</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Part 2: Numbers 20–100</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          From 21 to 99, German usually follows this pattern:
        </p>

        <div style={infoBox}>
          <strong>unit + und + tens</strong>
          <span>
            21 = <strong>ein + und + zwanzig</strong> →
            <strong> einundzwanzig</strong>
          </span>
          <span>
            34 = <strong>vier + und + dreißig</strong> →
            <strong> vierunddreißig</strong>
          </span>
          <span>
            47 = <strong>sieben + und + vierzig</strong> →
            <strong> siebenundvierzig</strong>
          </span>
        </div>

        <div style={noteBox}>
          <strong>Tens to know</strong>
          <span>20 – zwanzig</span>
          <span>30 – dreißig</span>
          <span>40 – vierzig</span>
          <span>50 – fünfzig</span>
          <span>60 – sechzig</span>
          <span>70 – siebzig</span>
          <span>80 – achtzig</span>
          <span>90 – neunzig</span>
          <span>100 – hundert</span>
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
            <strong>99</strong>
            <div style={builderPieces}>
              <BuilderPiece type="one">neun</BuilderPiece>
              <BuilderPiece type="link">und</BuilderPiece>
              <BuilderPiece type="ten">neunzig</BuilderPiece>
              <span style={arrowStyle}>→</span>
              <BuilderPiece>neunundneunzig</BuilderPiece>
            </div>
          </div>
        </div>

        <div style={practiceBox}>
          <strong>Quick Check: 20–100</strong>
          <span>Write these in German:</span>
          <span>1. 21 = ______</span>
          <span>2. 38 = ______</span>
          <span>3. 54 = ______</span>
          <span>4. 96 = ______</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Part 3: Numbers 100–1000</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Hundreds are also written as one long word in German.
        </p>

        <div style={infoBox}>
          <span>
            100 = <strong>hundert</strong>
          </span>
          <span>
            200 = <strong>zweihundert</strong>
          </span>
          <span>
            315 = <strong>dreihundertfünfzehn</strong>
          </span>
          <span>
            642 = <strong>sechshundertzweiundvierzig</strong>
          </span>
        </div>

        <div style={builderWrap}>
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
        </div>

        <div style={placeValueGrid}>
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
              642 = 6 hundreds + 42 →{" "}
              <strong>sechshundertzweiundvierzig</strong>
            </span>
          </div>
        </div>

        <div style={practiceBox}>
          <strong>Quick Check: 100–1000</strong>
          <span>Write these in German:</span>
          <span>1. 100 = ______</span>
          <span>2. 209 = ______</span>
          <span>3. 451 = ______</span>
          <span>4. 777 = ______</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Part 4: Numbers 1000–10000</h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Bigger numbers combine thousands, hundreds, tens, and ones into one
          word.
        </p>

        <div style={infoBox}>
          <span>
            1000 = <strong>tausend</strong>
          </span>
          <span>
            2000 = <strong>zweitausend</strong>
          </span>
          <span>
            3015 = <strong>dreitausendfünfzehn</strong>
          </span>
          <span>
            7842 = <strong>siebentausendachthundertzweiundvierzig</strong>
          </span>
          <span>
            10000 = <strong>zehntausend</strong>
          </span>
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
            <BuilderPiece>
              siebentausendachthundertzweiundvierzig
            </BuilderPiece>
          </div>
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
            7,842 = 7 thousands + 8 hundreds + 42 →{" "}
            <strong>siebentausendachthundertzweiundvierzig</strong>
          </span>
        </div>

        <div style={practiceBox}>
          <strong>Quick Check: 1000–10000</strong>
          <span>Write these in German:</span>
          <span>1. 1000 = ______</span>
          <span>2. 2500 = ______</span>
          <span>3. 4312 = ______</span>
          <span>4. 9999 = ______</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Common Mistakes</h2>

        <div style={warningBox}>
          <span>❌ siebenzehn</span>
          <span>
            ✔ <strong>siebzehn</strong>
          </span>
          <span>❌ sechszehn</span>
          <span>
            ✔ <strong>sechzehn</strong>
          </span>
          <span>❌ zwanzigundeins</span>
          <span>
            ✔ <strong>einundzwanzig</strong>
          </span>
          <span>❌ vierzigundsieben</span>
          <span>
            ✔ <strong>siebenundvierzig</strong>
          </span>
        </div>
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
        <h2 style={{ margin: 0 }}>
          At the End: City, Street, and Address with wohnen
        </h2>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          After learning numbers, you can now use them in addresses.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              minWidth: 560,
            }}
          >
            <thead>
              <tr>
                <th style={tableCell}>Situation</th>
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
              <tr>
                <td style={tableCell}>Full address</td>
                <td style={tableCell}>
                  <strong>in der</strong> + street + number
                </td>
                <td style={tableCell}>
                  <em>Ich wohne in der Hauptstraße 12.</em>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={noteBox}>
          <strong>Why do we say “in der Straße”?</strong>
          <span>Straße = die Straße (feminine noun)</span>
          <span>With wohnen, we use the dative here: die → der</span>
          <span>
            So we say: <strong>in der Hauptstraße</strong>
          </span>
        </div>

        <div style={practiceBox}>
          <strong>Mini Practice: Address Expressions</strong>
          <span>Complete the sentences:</span>
          <span>1. Ich wohne ___ Accra.</span>
          <span>2. Ich wohne ___ Ringstraße.</span>
          <span>3. Ich wohne in der Ringstraße ___.</span>
          <span>4. Write one full sentence about where you live.</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Lesson Summary</h2>

        <div style={infoBox}>
          <span>✔ Numbers are now grouped in easy learning stages</span>
          <span>✔ 0–20 first</span>
          <span>✔ 20–100 next</span>
          <span>✔ 100–1000 after that</span>
          <span>✔ 1000–10000 last</span>
          <span>✔ You also learned how to use numbers in addresses</span>
          <span>
            ✔ You can now say <strong>in Berlin</strong> and{" "}
            <strong>in der Hauptstraße 12</strong>
          </span>
        </div>
      </section>
    </main>
  );
};

export default GermanNumbersGrammarPage;
