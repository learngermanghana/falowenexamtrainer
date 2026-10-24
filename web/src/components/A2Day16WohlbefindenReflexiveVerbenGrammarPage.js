import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 12 };
const listStyle = { margin: 0, paddingLeft: 22, display: "grid", gap: 7, lineHeight: 1.7 };
const patternStyle = {
  borderRadius: 12,
  padding: 14,
  background: "rgba(59,130,246,0.08)",
  border: "1px solid rgba(59,130,246,0.2)",
  lineHeight: 1.7,
};
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const cellStyle = { padding: "9px 10px", borderBottom: "1px solid #e5e7eb", textAlign: "left" };

const SectionCard = ({ title, children }) => (
  <section style={cardStyle} aria-label={title}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const pronouns = [
  ["ich", "mich"],
  ["du", "dich"],
  ["er / sie / es", "sich"],
  ["wir", "uns"],
  ["ihr", "euch"],
  ["sie / Sie", "sich"],
];

const reflexiveVerbs = [
  ["sich fühlen", "to feel", "Ich fühle mich heute gut."],
  ["sich entspannen", "to relax", "Ich entspanne mich am Abend."],
  ["sich ausruhen", "to rest", "Du ruhst dich nach der Arbeit aus."],
  ["sich erholen", "to recover", "Er erholt sich am Wochenende."],
  ["sich bewegen", "to move / exercise", "Wir bewegen uns jeden Tag."],
  ["sich treffen", "to meet", "Wir treffen uns nach dem Kurs."],
  ["sich freuen", "to be happy / look forward", "Ich freue mich auf das Wochenende."],
  ["sich ärgern", "to get annoyed", "Sie ärgert sich über den Stress."],
  ["sich interessieren", "to be interested", "Ich interessiere mich für Yoga."],
];

export default function A2Day16WohlbefindenReflexiveVerbenGrammarPage() {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div style={styles.pageWrap}>
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <header style={{ ...styles.card, display: "grid", gap: 8 }}>
          <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 16 · Reflexive Verben</h1>
          <p style={{ ...styles.subtitle, margin: 0 }}>
            Wohlbefinden und Entspannung: sagen, wie du dich fühlst und was du für dich selbst tust.
          </p>
        </header>

        <SectionCard title="1) Was ist ein reflexives Verb?">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Bei einem reflexiven Verb bezieht sich die Handlung auf dieselbe Person wie das Subjekt. Deshalb gehört ein
            <strong> Reflexivpronomen</strong> zum Verb.
          </p>
          <div style={patternStyle}>
            <strong>Grundmuster:</strong> Subjekt + konjugiertes Verb + Reflexivpronomen + Information
            <br />
            <strong>Ich entspanne mich am Abend.</strong>
            <br />
            <strong>Du fühlst dich heute besser.</strong>
          </div>
        </SectionCard>

        <SectionCard title="2) Reflexivpronomen">
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={cellStyle}>Person</th>
                  <th style={cellStyle}>Reflexivpronomen</th>
                  <th style={cellStyle}>Beispiel</th>
                </tr>
              </thead>
              <tbody>
                {pronouns.map(([person, pronoun]) => (
                  <tr key={person}>
                    <td style={cellStyle}>{person}</td>
                    <td style={{ ...cellStyle, fontWeight: 800 }}>{pronoun}</td>
                    <td style={cellStyle}>
                      {person === "ich" && "Ich entspanne mich."}
                      {person === "du" && "Du entspannst dich."}
                      {person === "er / sie / es" && "Er entspannt sich."}
                      {person === "wir" && "Wir entspannen uns."}
                      {person === "ihr" && "Ihr entspannt euch."}
                      {person === "sie / Sie" && "Sie entspannen sich."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="3) Wichtige reflexive Verben für Day 16">
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={cellStyle}>Verb</th>
                  <th style={cellStyle}>Meaning</th>
                  <th style={cellStyle}>Beispiel</th>
                </tr>
              </thead>
              <tbody>
                {reflexiveVerbs.map(([verb, meaning, example]) => (
                  <tr key={verb}>
                    <td style={{ ...cellStyle, fontWeight: 800 }}>{verb}</td>
                    <td style={cellStyle}>{meaning}</td>
                    <td style={cellStyle}>{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="4) Position im Satz">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Im Hauptsatz steht das konjugierte Verb normalerweise auf Position 2. Das Reflexivpronomen steht meistens direkt danach.
          </p>
          <ul style={listStyle}>
            <li><strong>Ich fühle mich müde.</strong></li>
            <li><strong>Heute fühle ich mich besser.</strong></li>
            <li><strong>Wir treffen uns nach der Arbeit.</strong></li>
          </ul>
        </SectionCard>

        <SectionCard title="5) Modalverben, trennbare Verben und Perfekt">
          <div style={patternStyle}>
            <strong>Mit Modalverb:</strong> Das Reflexivpronomen steht beim Subjekt; der Infinitiv kommt ans Satzende.
            <br />Ich möchte <strong>mich</strong> entspannen.
            <br />Du solltest <strong>dich</strong> ausruhen.
          </div>
          <div style={patternStyle}>
            <strong>Trennbares Verb:</strong> sich ausruhen → Ich ruhe <strong>mich</strong> aus.
          </div>
          <div style={patternStyle}>
            <strong>Perfekt:</strong> Ich habe <strong>mich</strong> entspannt. / Wir haben <strong>uns</strong> getroffen.
          </div>
        </SectionCard>

        <SectionCard title="6) Häufige Fehler">
          <ul style={listStyle}>
            <li>❌ Du fühlst <strong>sich</strong> müde. → ✅ Du fühlst <strong>dich</strong> müde.</li>
            <li>❌ Wir treffen <strong>sich</strong> am Samstag. → ✅ Wir treffen <strong>uns</strong> am Samstag.</li>
            <li>❌ Ich ruhe <strong>mich ausruhe</strong>. → ✅ Ich ruhe <strong>mich aus</strong>.</li>
            <li>Bei <strong>sich entspannen</strong> nicht das Reflexivpronomen vergessen: Ich entspanne <strong>mich</strong>.</li>
          </ul>
        </SectionCard>

        <SectionCard title="7) Mini-Übung">
          <ol style={listStyle}>
            <li>Ich entspanne ___ nach der Arbeit.</li>
            <li>Du fühlst ___ heute besser.</li>
            <li>Er erholt ___ am Wochenende.</li>
            <li>Wir treffen ___ um 18 Uhr.</li>
            <li>Ihr ruht ___ nach dem Sport aus.</li>
            <li>Schreibe mit Modalverb: Ich / möchten / sich entspannen.</li>
          </ol>
          <button type="button" onClick={() => setShowAnswers((value) => !value)} style={styles.secondaryBtn}>
            {showAnswers ? "Hide answers" : "Show answers"}
          </button>
          {showAnswers ? (
            <div style={patternStyle}>
              <strong>Antworten:</strong> 1) mich · 2) dich · 3) sich · 4) uns · 5) euch · 6) Ich möchte mich entspannen.
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="Sprechziel">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sprich 4–5 Sätze über dein Wohlbefinden. Benutze mindestens zwei reflexive Verben.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Start:</strong> Ich fühle mich ... · Nach der Arbeit entspanne ich mich ... · Am Wochenende erhole ich mich ...
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
