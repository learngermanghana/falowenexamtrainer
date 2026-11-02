import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const section = { ...styles.card, display: "grid", gap: 12 };
const tableCell = { padding: "10px 12px", textAlign: "left", borderBottom: "1px solid #e2e8f0" };

const alphabet = [
  ["A", "ah"], ["B", "beh"], ["C", "tseh"], ["D", "deh"], ["E", "eh"],
  ["F", "eff"], ["G", "geh"], ["H", "hah"], ["I", "ee"], ["J", "yott"],
  ["K", "kah"], ["L", "ell"], ["M", "emm"], ["N", "enn"], ["O", "oh"],
  ["P", "peh"], ["Q", "koo"], ["R", "err"], ["S", "ess"], ["T", "teh"],
  ["U", "oo"], ["V", "fau"], ["W", "veh"], ["X", "iks"], ["Y", "üpsilon"], ["Z", "tsett"],
];
const pronouns = [
  ["ich", "I", "lerne", "heiße", "bin"],
  ["du", "you (informal singular)", "lernst", "heißt", "bist"],
  ["er / sie / es", "he / she / it", "lernt", "heißt", "ist"],
  ["wir", "we", "lernen", "heißen", "sind"],
  ["ihr", "you (informal plural)", "lernt", "heißt", "seid"],
  ["sie / Sie", "they / you (formal)", "lernen", "heißen", "sind"],
];

export default function A1Day2UnifiedGrammarPage() {
  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={section}>
        <AppBackButton label="Back to Day 2" fallbackPath="/campus/course/lesson/A1/2?chapter=0.2" />
        <p style={{ margin: 0, color: "#475569", fontWeight: 700 }}>A1.1 · Foundations · Day 2</p>
        <h1 style={{ ...styles.title, margin: 0 }}>Das Alphabet, Personalpronomen und erste Verben</h1>
        <p style={{ margin: 0, lineHeight: 1.6 }}>One lesson: spell names, choose the right personal pronoun and build your first German sentences.</p>
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 12 }}>
          <strong>Today's goal:</strong> I can spell my name, say who I am and use simple present-tense verbs.
        </div>
      </header>

      <section style={section}>
        <h2 style={{ margin: 0 }}>1 · Das deutsche Alphabet</h2>
        <p style={{ margin: 0 }}>German uses 26 basic letters, plus Ä, Ö, Ü and ß. Letter names help you spell your name, email address and other words. The English pronunciation hints below are only approximate; practise identifying letters and spelling words.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(76px, 1fr))", gap: 8 }}>
          {alphabet.map(([letter, hint]) => (
            <div key={letter} style={{ border: "1px solid #cbd5e1", borderRadius: 9, padding: 9, textAlign: "center", background: "#f8fafc" }}>
              <strong style={{ display: "block", fontSize: 22 }}>{letter}</strong>
              <span style={{ color: "#475569", fontSize: 12 }}>{hint}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: 0 }}><strong>Special letters:</strong> Ä (A-Umlaut), Ö (O-Umlaut), Ü (U-Umlaut), ß (Eszett / scharfes S). Compare <em>schon</em> (already) and <em>schön</em> (beautiful).</p>
        <p style={{ margin: 0 }}><strong>Useful question:</strong> Wie schreibt man das? (How do you spell that?)</p>
        <p style={{ margin: 0 }}><strong>Example:</strong> Wie heißt du? – Ich heiße Ama. – Wie schreibt man das? – A – M – A.</p>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>2 · Personalpronomen</h2>
        <p style={{ margin: 0 }}>A personal pronoun replaces a person's name. Use <strong>ich</strong> for yourself, <strong>du</strong> for one familiar person and <strong>Sie</strong> for formal you. Unlike <strong>sie</strong> (she/they), formal <strong>Sie</strong> begins with a capital letter.</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead><tr>{["Pronoun", "English", "lernen", "heißen", "sein"].map(h => <th key={h} style={tableCell}>{h}</th>)}</tr></thead>
            <tbody>{pronouns.map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={i} style={tableCell}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p style={{ margin: 0 }}><strong>Remember:</strong> <em>er / sie / es</em> have the same verb ending. <em>sein</em> is irregular, so learn <em>ich bin, du bist, er ist</em> separately.</p>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>3 · Erste Verben im Präsens</h2>
        <p style={{ margin: 0 }}>For regular verbs, remove the ending <strong>-en</strong> to find the stem, then add the correct ending. For <em>lernen</em>: ich lern<strong>e</strong>, du lern<strong>st</strong>, er lern<strong>t</strong>, wir lern<strong>en</strong>.</p>
        <p style={{ margin: 0 }}>The verb <strong>heißen</strong> has a special du-form: <strong>du heißt</strong> (not <em>du heißst</em>).</p>
        <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 12, padding: 12 }}>
          <strong>Build a sentence:</strong>
          <p style={{ margin: "6px 0" }}>Ich + lerne + Deutsch. → Ich lerne Deutsch.</p>
          <p style={{ margin: "6px 0" }}>Du + wohnst + in Accra. → Du wohnst in Accra.</p>
          <p style={{ margin: 0 }}>Sie (formal) + heißen + Maria. → Sie heißen Maria.</p>
        </div>
      </section>

      <section style={section}>
        <h2 style={{ margin: 0 }}>4 · Bring it together</h2>
        <p style={{ margin: 0 }}><strong>A:</strong> Guten Tag! Wie heißen Sie?</p>
        <p style={{ margin: 0 }}><strong>B:</strong> Ich heiße Kojo. K – O – J – O.</p>
        <p style={{ margin: 0 }}><strong>A:</strong> Wo wohnen Sie?</p>
        <p style={{ margin: 0 }}><strong>B:</strong> Ich wohne in Accra. Ich lerne Deutsch.</p>
        <p style={{ margin: 0, color: "#475569" }}>Next: open the single Day 2 workbook. It combines alphabet, listening, pronouns, verbs and short sentences in one assignment.</p>
      </section>
    </main>
  );
}
