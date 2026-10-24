import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
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

const noteBox = {
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
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

const practiceBox = {
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
  borderRadius: 12,
  padding: 14,
  display: "grid",
  gap: 10,
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
};

const getPieceStyle = (type) => {
  const common = {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid transparent",
    fontWeight: 600,
    fontSize: "0.95rem",
  };

  const stylesByType = {
    one: {
      background: "#dbeafe",
      borderColor: "#93c5fd",
      color: "#1d4ed8",
    },
    ten: {
      background: "#dcfce7",
      borderColor: "#86efac",
      color: "#15803d",
    },
    hundred: {
      background: "#fef3c7",
      borderColor: "#fcd34d",
      color: "#b45309",
    },
    thousand: {
      background: "#f3e8ff",
      borderColor: "#d8b4fe",
      color: "#7e22ce",
    },
    link: {
      background: "#f3f4f6",
      borderColor: "#d1d5db",
      color: "#374151",
    },
  };

  return {
    ...common,
    ...(stylesByType[type] || {
      background: "#f9fafb",
      borderColor: "#d1d5db",
      color: "#111827",
    }),
  };
};

const BuilderPiece = ({ children, type }) => (
  <span style={getPieceStyle(type)}>{children}</span>
);

const numbersZeroToTwenty = [
  ["0", "null", "nuul"],
  ["1", "eins", "ains"],
  ["2", "zwei", "tsvai"],
  ["3", "drei", "drai"],
  ["4", "vier", "feer"],
  ["5", "fünf", "fuenf"],
  ["6", "sechs", "zeks"],
  ["7", "sieben", "zee-ben"],
  ["8", "acht", "ahkt"],
  ["9", "neun", "noyn"],
  ["10", "zehn", "tsayn"],
  ["11", "elf", "elf"],
  ["12", "zwölf", "tsvölf"],
  ["13", "dreizehn", "drai-tsayn"],
  ["14", "vierzehn", "feer-tsayn"],
  ["15", "fünfzehn", "fuenf-tsayn"],
  ["16", "sechzehn", "zekh-tsayn"],
  ["17", "siebzehn", "zeeb-tsayn"],
  ["18", "achtzehn", "ahkt-tsayn"],
  ["19", "neunzehn", "noyn-tsayn"],
  ["20", "zwanzig", "tsvan-tsikh"],
];

const tens = [
  ["20", "zwanzig"],
  ["30", "dreißig"],
  ["40", "vierzig"],
  ["50", "fünfzig"],
  ["60", "sechzig"],
  ["70", "siebzig"],
  ["80", "achtzig"],
  ["90", "neunzig"],
  ["100", "hundert"],
];

const hundreds = [
  ["100", "hundert / einhundert"],
  ["200", "zweihundert"],
  ["300", "dreihundert"],
  ["400", "vierhundert"],
  ["500", "fünfhundert"],
  ["600", "sechshundert"],
  ["700", "siebenhundert"],
  ["800", "achthundert"],
  ["900", "neunhundert"],
];

const thousands = [
  ["1,000", "tausend / eintausend"],
  ["2,000", "zweitausend"],
  ["3,000", "dreitausend"],
  ["4,000", "viertausend"],
  ["5,000", "fünftausend"],
  ["6,000", "sechstausend"],
  ["7,000", "siebentausend"],
  ["8,000", "achttausend"],
  ["9,000", "neuntausend"],
  ["10,000", "zehntausend"],
];

const NumberTable = ({ rows, showPronunciation = false, minWidth = 420 }) => (
  <div style={{ overflowX: "auto" }}>
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        minWidth,
      }}
    >
      <thead>
        <tr>
          <th style={tableCell}>Number</th>
          <th style={tableCell}>German</th>
          {showPronunciation && <th style={tableCell}>Pronunciation</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map(([number, german, pronunciation]) => (
          <tr key={number}>
            <td style={tableCell}>{number}</td>
            <td style={tableCell}>
              <strong>{german}</strong>
            </td>
            {showPronunciation && <td style={tableCell}>{pronunciation}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const GermanNumbersGrammarPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreen = () => setIsMobile(window.innerWidth < 640);
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
            <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
            <h1 style={{ ...styles.title, marginBottom: 6, color: "#fff" }}>
              German Numbers 0–10,000 and Address Expressions
            </h1>
            <p style={{ ...styles.subtitle, margin: 0, color: "#f3f4f6" }}>
              Chapter 2 • Learn the basic number groups first, then build mixed
              numbers step by step.
            </p>
          </div>
        </div>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Lesson Goal</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Learn German numbers in a clear order: <strong>0–20</strong>, the tens,
          the complete hundreds, the complete thousands, and then mixed-number
          variations. At the end, use numbers in addresses with <strong>wohnen</strong>.
        </p>
        <div style={infoBox}>
          <strong>Learning order</strong>
          <span>1. Learn the basic number words.</span>
          <span>2. Learn 100, 200, 300 ... 900.</span>
          <span>3. Learn 1,000, 2,000, 3,000 ... 10,000.</span>
          <span>4. Combine them to form numbers such as 315 and 7,842.</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Part 1: Numbers 0–20</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Learn these numbers well because they are the foundation for larger
          numbers.
        </p>
        <NumberTable rows={numbersZeroToTwenty} showPronunciation />
        <div style={practiceBox}>
          <strong>Quick Check: 0–20</strong>
          <span>Write these in German: 6, 11, 17, and 20.</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Part 2: Numbers 20–100</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          First learn the tens. After that, combine a unit with <strong>und</strong>
          and the tens word.
        </p>
        <NumberTable rows={tens} />
        <div style={infoBox}>
          <strong>Pattern: unit + und + tens</strong>
          <span>21 = ein + und + zwanzig → einundzwanzig</span>
          <span>34 = vier + und + dreißig → vierunddreißig</span>
          <span>47 = sieben + und + vierzig → siebenundvierzig</span>
        </div>
        <div style={practiceBox}>
          <strong>Quick Check: 20–100</strong>
          <span>Write these in German: 21, 38, 54, and 96.</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Part 3: Numbers 100–900</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Before forming mixed numbers, learn every full hundred. German joins the
          number and <strong>hundert</strong> into one word.
        </p>

        <div style={noteBox}>
          <strong>Learn the complete hundreds first</strong>
          <span>Pattern: number + hundert</span>
          <span>Example: vier + hundert = vierhundert</span>
        </div>

        <NumberTable rows={hundreds} />

        <div style={infoBox}>
          <strong>Now form variations</strong>
          <span>315 = dreihundert + fünfzehn → dreihundertfünfzehn</span>
          <span>
            642 = sechshundert + zweiundvierzig →
            sechshundertzweiundvierzig
          </span>
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

        <div style={practiceBox}>
          <strong>Quick Check: Hundreds</strong>
          <span>First say: 200, 400, 600, and 900.</span>
          <span>Then write the variations: 209, 451, and 777.</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Part 4: Numbers 1,000–10,000</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Before forming mixed thousands, learn every full thousand. German joins
          the number and <strong>tausend</strong> into one word.
        </p>

        <div style={noteBox}>
          <strong>Learn the complete thousands first</strong>
          <span>Pattern: number + tausend</span>
          <span>Example: vier + tausend = viertausend</span>
          <span>10,000 is zehntausend.</span>
        </div>

        <NumberTable rows={thousands} />

        <div style={infoBox}>
          <strong>Now form variations</strong>
          <span>3,015 = dreitausend + fünfzehn → dreitausendfünfzehn</span>
          <span>
            7,842 = siebentausend + achthundert + zweiundvierzig →
            siebentausendachthundertzweiundvierzig
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

        <div style={practiceBox}>
          <strong>Quick Check: Thousands</strong>
          <span>First say: 2,000, 4,000, 7,000, and 10,000.</span>
          <span>Then write the variations: 2,500, 4,312, and 9,999.</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Common Mistakes</h2>
        <div style={warningBox}>
          <span>❌ vier hunder → ✔ vierhundert</span>
          <span>❌ vier tausend → ✔ viertausend</span>
          <span>❌ siebenzehn → ✔ siebzehn</span>
          <span>❌ sechszehn → ✔ sechzehn</span>
          <span>❌ zwanzigundeins → ✔ einundzwanzig</span>
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
          After learning numbers, use them in addresses.
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
                <td style={tableCell}>in + city</td>
                <td style={tableCell}>Ich wohne in Berlin.</td>
              </tr>
              <tr>
                <td style={tableCell}>Living on a street</td>
                <td style={tableCell}>in der + street name</td>
                <td style={tableCell}>Ich wohne in der Hauptstraße.</td>
              </tr>
              <tr>
                <td style={tableCell}>Full address</td>
                <td style={tableCell}>in der + street + number</td>
                <td style={tableCell}>Ich wohne in der Hauptstraße 12.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={practiceBox}>
          <strong>Mini Practice: Address Expressions</strong>
          <span>Complete: Ich wohne ___ Accra.</span>
          <span>Complete: Ich wohne ___ Ringstraße.</span>
          <span>Write one full sentence about where you live.</span>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Lesson Summary</h2>
        <div style={infoBox}>
          <span>✔ You learned 100, 200, 300 ... 900 before mixed hundreds.</span>
          <span>
            ✔ You learned 1,000, 2,000, 3,000 ... 10,000 before mixed thousands.
          </span>
          <span>✔ German large numbers are normally written as one word.</span>
          <span>✔ You can use numbers in prices, time, phone numbers, and addresses.</span>
        </div>
      </section>
    </main>
  );
};

export default GermanNumbersGrammarPage;
