import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 10 };
const tableCellStyle = { border: "1px solid #d1d5db", padding: 8, textAlign: "left" };

const ObjectsAndColorsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Objects and Colors</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 6 • Possessive Determiners with Nouns</p>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Instruction Note</h2>
        <p style={{ margin: 0 }}>
          Understanding possessive and indefinite articles in German is essential for indicating ownership and
          making general statements.
        </p>
        <p style={{ margin: 0 }}>
          Before reading this chapter, students should already be able to differentiate between definite articles
          (<strong>der, die, das</strong>) and indefinite articles (<strong>ein, eine, einen</strong>) in nominative and
          accusative cases.
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Possessive Articles (Nominative Reference)</h2>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={tableCellStyle}>Pronoun</th>
              <th style={tableCellStyle}>Masculine/Neuter</th>
              <th style={tableCellStyle}>Feminine/Plural</th>
              <th style={tableCellStyle}>English</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ich", "mein", "meine", "my"],
              ["du", "dein", "deine", "your"],
              ["er/es", "sein", "seine", "his/its"],
              ["sie (she)", "ihr", "ihre", "her"],
              ["wir", "unser", "unsere", "our"],
              ["ihr (plural)", "euer", "eure", "your (plural)"],
              ["sie (they)", "ihr", "ihre", "their"],
              ["Sie (formal)", "Ihr", "Ihre", "your (formal)"],
            ].map(([pronoun, mn, fp, english]) => (
              <tr key={pronoun}>
                <td style={tableCellStyle}>{pronoun}</td>
                <td style={tableCellStyle}>{mn}</td>
                <td style={tableCellStyle}>{fp}</td>
                <td style={tableCellStyle}>{english}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Quick Guide: ihr / Ihr</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Ihr/Ihre</strong> (capitalized) = formal possession.
            <br />Das ist Ihr Buch.
          </li>
          <li>
            <strong>ihr/ihre</strong> (lowercase) = her / their possession.
            <br />Ihr Bruder heißt Tom.
          </li>
          <li>
            <strong>ihr</strong> (lowercase pronoun) = you all (plural informal).
            <br />Wo wohnt ihr?
          </li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Article Reference (Nominative & Accusative)</h2>
        <h3 style={{ margin: 0 }}>Nominative</h3>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={tableCellStyle}>Gender/Number</th>
              <th style={tableCellStyle}>Definite</th>
              <th style={tableCellStyle}>Indefinite</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={tableCellStyle}>Masculine</td><td style={tableCellStyle}>der</td><td style={tableCellStyle}>ein</td></tr>
            <tr><td style={tableCellStyle}>Feminine</td><td style={tableCellStyle}>die</td><td style={tableCellStyle}>eine</td></tr>
            <tr><td style={tableCellStyle}>Neuter</td><td style={tableCellStyle}>das</td><td style={tableCellStyle}>ein</td></tr>
            <tr><td style={tableCellStyle}>Plural</td><td style={tableCellStyle}>die</td><td style={tableCellStyle}>-</td></tr>
          </tbody>
        </table>
        <h3 style={{ margin: 0 }}>Accusative</h3>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={tableCellStyle}>Gender/Number</th>
              <th style={tableCellStyle}>Definite</th>
              <th style={tableCellStyle}>Indefinite</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={tableCellStyle}>Masculine</td><td style={tableCellStyle}>den</td><td style={tableCellStyle}>einen</td></tr>
            <tr><td style={tableCellStyle}>Feminine</td><td style={tableCellStyle}>die</td><td style={tableCellStyle}>eine</td></tr>
            <tr><td style={tableCellStyle}>Neuter</td><td style={tableCellStyle}>das</td><td style={tableCellStyle}>ein</td></tr>
            <tr><td style={tableCellStyle}>Plural</td><td style={tableCellStyle}>die</td><td style={tableCellStyle}>-</td></tr>
          </tbody>
        </table>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Indefinite Articles and Possessive Determiners</h2>
        <p style={{ margin: 0 }}>
          Possessive determiners follow the same ending pattern as <strong>ein / eine / einen</strong>.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Base form: <strong>ein</strong> (masculine/neuter nominative).</li>
          <li>Add <strong>-e</strong> for feminine nominative/accusative: <strong>eine</strong>.</li>
          <li>Add <strong>-en</strong> for masculine accusative: <strong>einen</strong>.</li>
        </ul>
        <p style={{ margin: 0 }}>
          You do not use an indefinite article together with a possessive determiner. The indefinite article pattern
          only helps you choose the correct ending.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Das ist ein Tisch → Das ist mein/dein/sein/ihr/unser/euer/Ihr Tisch.</li>
          <li>Das ist eine Tasche → Das ist meine/deine/seine/ihre/unsere/eure/Ihre Tasche.</li>
          <li>Ich suche einen Tisch → Ich suche meinen/deinen/seinen/ihren/unseren/euren/Ihren Tisch.</li>
          <li>Ich nehme eine Tasche → Ich nehme meine/deine/seine/ihre/unsere/eure/Ihre Tasche.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Using Adjectives with zu, super, sehr</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>zu + adjective</strong> = too (excessive, often negative): Das Auto ist zu teuer.
          </li>
          <li>
            <strong>super + adjective</strong> = super/very (high positive intensity): Das Essen ist super lecker.
          </li>
          <li>
            <strong>sehr + adjective</strong> = very (general intensifier): Das Buch ist sehr interessant.
          </li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Practical German Colors (Farben)</h2>
        <p style={{ margin: 0 }}>
          Rot, Blau, Gelb, Grün, Schwarz, Weiß, Grau, Braun, Orange, Lila, Rosa.
        </p>
        <p style={{ margin: 0 }}>
          Key phrase: <strong>Meine Lieblingsfarbe ist ...</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Meine Lieblingsfarbe ist rot.</li>
          <li>Was ist deine Lieblingsfarbe?</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ margin: 0 }}>German Vocabulary: Objects in the House and Room</h2>
        <p style={{ margin: 0 }}>
          <strong>Im Haus:</strong> das Haus, die Wohnung, das Zimmer, die Küche, das Wohnzimmer, das Schlafzimmer,
          das Badezimmer, der Flur, der Keller, der Garten.
        </p>
        <p style={{ margin: 0 }}>
          <strong>Im Zimmer:</strong> das Bett, der Tisch, der Stuhl, die Lampe, der Schrank, die Tür, das Fenster,
          der Teppich, das Sofa, der Fernseher, das Bild, die Uhr, das Regal, die Kommode, der Spiegel.
        </p>
        <p style={{ margin: 0 }}>
          Sentence frame: <strong>In meinem Zimmer habe ich ...</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>In meinem Zimmer habe ich ein Bett.</li>
          <li>In meinem Zimmer habe ich einen Tisch.</li>
        </ul>
      </div>
    </div>
  );
};

export default ObjectsAndColorsPage;
