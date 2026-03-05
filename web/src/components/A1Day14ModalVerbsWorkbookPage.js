import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listStyle = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };

const modalVerbs = [
  { verb: "können", meaning: "can, to be able to", forms: "ich kann · du kannst · er/sie/es kann" },
  { verb: "müssen", meaning: "must, to have to", forms: "ich muss · du musst · er/sie/es muss" },
  { verb: "dürfen", meaning: "may, to be allowed to", forms: "ich darf · du darfst · er/sie/es darf" },
  { verb: "wollen", meaning: "to want to", forms: "ich will · du willst · er/sie/es will" },
  { verb: "sollen", meaning: "should, to be supposed to", forms: "ich soll · du sollst · er/sie/es soll" },
  { verb: "mögen", meaning: "to like", forms: "ich mag · du magst · er/sie/es mag" },
];

const sentenceBuilding = [
  "können, ich, morgen, einchecken, um 15 Uhr",
  "müssen, wir, um 10 Uhr, auschecken, heute",
  "darf, hier, er, nicht, rauchen",
  "möchte, ich, in Deutschland, Urlaub, machen",
  "will, sie, ein, Zimmer, mit Balkon, buchen",
];

const separableNoModal = [
  "ich / um 6 Uhr / aufstehen",
  "er / abends / fernsehen",
  "wir / am Samstag / einkaufen",
  "sie / einen Kuchen / mitbringen",
  "du / um 7 Uhr / aufwachen",
];

const A1Day14ModalVerbsWorkbookPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 14 In-App Workbook · Modal Verbs</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter 3.6 · Schreiben &amp; Sprechen · Self-practice only
        </p>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Objective: Understand modal verbs with main verbs and separable verbs, then build correct A1-level sentences.
        </p>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>1) Introduction to German Modal Verbs</h2>
        <p style={{ margin: 0 }}>
          Modal verbs are used with the infinitive form of the main verb. The modal verb is conjugated and the main verb goes
          to the end of the sentence.
        </p>
        <p style={{ margin: 0 }}>
          <strong>Rule:</strong> Subject + modal verb + time + other details + main verb (infinitive).
        </p>
        <p style={{ margin: 0 }}>
          <strong>Example:</strong> Ich möchte morgen nach Deutschland reisen.
        </p>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>2) Modal Verbs and Meaning (Präsens)</h2>
        <ul style={listStyle}>
          {modalVerbs.map((item) => (
            <li key={item.verb}>
              <strong>{item.verb}</strong> — {item.meaning}
              <br />
              <span style={{ color: "#4b5563" }}>{item.forms}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>3) Example Sentences</h2>
        <ol style={listStyle}>
          <li>Ich kann um 15 Uhr einchecken.</li>
          <li>Wir müssen um 12 Uhr auschecken.</li>
          <li>Du darfst nicht in diesem Zimmer rauchen.</li>
          <li>Ich will ein Zimmer mit Blick aufs Meer.</li>
          <li>Wir sollen unseren Reiseplan ändern.</li>
          <li>Er mag in Hotels übernachten.</li>
        </ol>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>4) Difference: wollen vs. möchten</h2>
        <ul style={listStyle}>
          <li>
            <strong>wollen</strong> = strong intention. Example: Ich will nach Deutschland reisen.
          </li>
          <li>
            <strong>möchten</strong> = polite / softer desire. Example: Ich möchte nach Deutschland reisen.
          </li>
        </ul>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>5) Arrival and Departure (Ankunft und Abreise)</h2>
        <p style={{ margin: 0 }}><strong>Abreise:</strong> die Abreise, die Abfahrt, abfahren, verlassen</p>
        <p style={{ margin: 0 }}><strong>Ankunft:</strong> die Ankunft, die Anreise, ankommen, eintreffen</p>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>6) Übung: Modalverb-Satzbildung (Self-practice)</h2>
        <p style={{ margin: 0 }}>Ordnen Sie die Wörter zu einem korrekten Satz mit einem Modalverb.</p>
        <ol style={listStyle}>
          {sentenceBuilding.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ol>
        <h3 style={sectionTitle}>Answers (self-check)</h3>
        <ol style={listStyle}>
          <li>Ich kann morgen um 15 Uhr einchecken.</li>
          <li>Wir müssen heute um 10 Uhr auschecken.</li>
          <li>Er darf hier nicht rauchen.</li>
          <li>Ich möchte in Deutschland Urlaub machen.</li>
          <li>Sie will ein Zimmer mit Balkon buchen.</li>
        </ol>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>7) Separable Verbs (Trennbare Verben)</h2>
        <p style={{ margin: 0 }}>
          Without a modal verb, the prefix separates in present tense: Ich stehe um 6 Uhr <strong>auf</strong>.
        </p>
        <p style={{ margin: 0 }}>
          With a modal verb, the separable verb stays together in infinitive form at sentence end: Ich muss um 6 Uhr
          <strong> aufstehen</strong>.
        </p>
        <h3 style={sectionTitle}>Practice (without modal verb)</h3>
        <ol style={listStyle}>
          {separableNoModal.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ol>
        <h3 style={sectionTitle}>Answers</h3>
        <ol style={listStyle}>
          <li>Ich stehe um 6 Uhr auf.</li>
          <li>Er sieht abends fern.</li>
          <li>Wir kaufen am Samstag ein.</li>
          <li>Sie bringt einen Kuchen mit.</li>
          <li>Du wachst um 7 Uhr auf.</li>
        </ol>
      </div>
    </div>
  );
};

export default A1Day14ModalVerbsWorkbookPage;
