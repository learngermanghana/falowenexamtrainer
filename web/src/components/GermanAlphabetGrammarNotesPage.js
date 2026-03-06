import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 10 };

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  display: "grid",
  gap: 6,
};

const letterGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 10,
};

const letterCardStyle = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 4,
};

const imageStyle = {
  width: "100%",
  maxHeight: 360,
  objectFit: "cover",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  marginTop: 8,
};

const captionStyle = {
  margin: 0,
  fontSize: 14,
  color: "#6b7280",
};

const pronunciationRows = [
  ["A", "[aː]", "similar to 'ah' in 'father'"],
  ["B", "[beː]", "similar to 'bay'"],
  ["C", "[tseː]", "similar to 'tsay'"],
  ["D", "[deː]", "similar to 'day'"],
  ["E", "[eː]", "similar to 'ay' in 'say'"],
  ["F", "[ɛf]", "similar to 'eff'"],
  ["G", "[ɡeː]", "similar to 'gay'"],
  ["H", "[haː]", "similar to 'hah'"],
  ["I", "[iː]", "similar to 'ee' in 'see'"],
  ["J", "[jɔt]", "similar to 'yot'"],
  ["K", "[kaː]", "similar to 'kah'"],
  ["L", "[ɛl]", "similar to 'el'"],
  ["M", "[ɛm]", "similar to 'em'"],
  ["N", "[ɛn]", "similar to 'en'"],
  ["O", "[oː]", "similar to 'oh'"],
  ["P", "[peː]", "similar to 'pay'"],
  ["Q", "[kuː]", "similar to 'koo'"],
  ["R", "[ɛʁ] or [eːʁ]", "similar to 'air' with a rolled r"],
  ["S", "[ɛs]", "similar to 'ess'"],
  ["T", "[teː]", "similar to 'tay'"],
  ["U", "[uː]", "similar to 'oo' in 'moon'"],
  ["V", "[faʊ̯]", "similar to 'fow'"],
  ["W", "[veː]", "similar to 'vay'"],
  ["X", "[ɪks]", "similar to 'iks'"],
  ["Y", "[ʏpsɪlɔn]", "similar to 'u-upsilon'"],
  ["Z", "[͡tsɛt]", "similar to 'tset'"],
  ["Ä", "[ɛː]", "similar to 'eh'"],
  ["Ö", "[øː]", "similar to 'eu' in French 'feu'"],
  ["Ü", "[yː]", "similar to 'u' in French 'lune'"],
  ["ß", "[ɛsʔ͡tsɛt]", "similar to 'ss' in 'kiss'"],
];

const GermanAlphabetGrammarNotesPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>German Alphabet Grammar Notes</h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>Day 2 (Chapter 0.2): German Alphabet</p>

        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80"
          alt="Open notebook with alphabet study notes"
          style={imageStyle}
        />

        <p style={captionStyle}>Learn the German alphabet, umlauts, and key pronunciation basics.</p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>1. The German Alphabet</h2>
        <p style={{ margin: 0 }}>
          The German alphabet consists of 26 basic letters, just like the English alphabet. In
          addition, German uses four special characters: <strong>Ä, Ö, Ü,</strong> and <strong>ß</strong>.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>2. Pronunciation Guide</h2>
        <p style={{ margin: 0 }}>
          Each letter has a specific pronunciation. Use this quick guide as your Day 2 reference.
        </p>
        <div style={letterGridStyle}>
          {pronunciationRows.map(([letter, sound, hint]) => (
            <div key={letter} style={letterCardStyle}>
              <strong>{letter}</strong>
              <span>Pronounced as {sound}</span>
              <span style={{ color: "#475569", fontSize: 14 }}>{hint}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>3. Special Characters</h2>
        <ul style={listStyle}>
          <li>
            <strong>Ä, Ö, Ü</strong>: These are umlauts. They modify the base vowels (a, o, u) and
            create new sounds.
          </li>
          <li>
            <strong>Ä</strong>: sounds like <strong>[ɛː]</strong> (eh).
          </li>
          <li>
            <strong>Ö</strong>: sounds like <strong>[øː]</strong> (like “eu” in French “feu”).
          </li>
          <li>
            <strong>Ü</strong>: sounds like <strong>[yː]</strong> (like “u” in French “lune”).
          </li>
          <li>
            <strong>ß</strong>: called <strong>Eszett</strong> or <strong>scharfes S</strong>. It sounds like
            double “s” in “kiss” and is often used where German writes <strong>ss</strong> after long
            vowels and diphthongs.
          </li>
        </ul>
      </section>
    </main>
  );
};

export default memo(GermanAlphabetGrammarNotesPage);
