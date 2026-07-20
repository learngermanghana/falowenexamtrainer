import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import A2Day17InDieApothekeModalverbenFragenGrammarPage from "./A2Day17InDieApothekeModalverbenFragenGrammarPage";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = { margin: 0, fontSize: "1.15rem" };
const listStyle = { margin: 0, paddingLeft: 20, lineHeight: 1.75 };
const primaryBtn = styles.primaryButton || styles.secondaryButton;
const secondaryBtn = styles.secondaryButton || styles.primaryButton;
const softBlue = { border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 14 };
const softAmber = { border: "1px solid #fde68a", background: "#fffbeb", borderRadius: 14, padding: 14 };
const softGreen = { border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 14 };
const detailsStyle = { border: "1px solid #dbeafe", borderRadius: 14, background: "#ffffff", overflow: "hidden" };
const summaryStyle = { cursor: "pointer", fontWeight: 800, padding: "13px 14px", background: "#eff6ff" };

const modalVerbs = [
  { verb: "können", meaning: "can / to be able to", example: "Ich kann am Hauptbahnhof aussteigen." },
  { verb: "müssen", meaning: "must / to have to", example: "Wir müssen in Hannover umsteigen." },
  { verb: "dürfen", meaning: "may / to be allowed to", example: "Die Fahrgäste dürfen jetzt einsteigen." },
  { verb: "wollen", meaning: "to want to", example: "Wir wollen früh abfahren." },
  { verb: "sollen", meaning: "should / to be supposed to", example: "Du sollst um 16:08 Uhr ankommen." },
  { verb: "möchten", meaning: "would like", example: "Ich möchte morgen zurückfahren." },
];

const modalConjugations = [
  { pronoun: "ich", können: "kann", müssen: "muss", dürfen: "darf", wollen: "will", sollen: "soll", möchten: "möchte" },
  { pronoun: "du", können: "kannst", müssen: "musst", dürfen: "darfst", wollen: "willst", sollen: "sollst", möchten: "möchtest" },
  { pronoun: "er / sie / es", können: "kann", müssen: "muss", dürfen: "darf", wollen: "will", sollen: "soll", möchten: "möchte" },
  { pronoun: "wir", können: "können", müssen: "müssen", dürfen: "dürfen", wollen: "wollen", sollen: "sollen", möchten: "möchten" },
  { pronoun: "ihr", können: "könnt", müssen: "müsst", dürfen: "dürft", wollen: "wollt", sollen: "sollt", möchten: "möchtet" },
  { pronoun: "Sie / sie", können: "können", müssen: "müssen", dürfen: "dürfen", wollen: "wollen", sollen: "sollen", möchten: "möchten" },
];

const separableVerbs = [
  {
    display: "ab|fahren",
    prefix: "ab-",
    meaning: "to depart",
    withoutModal: "Der Zug fährt um 14:20 Uhr ab.",
    withoutModalEnglish: "The train departs at 2:20 p.m.",
    withModal: "Der Zug muss um 14:20 Uhr abfahren.",
    withModalEnglish: "The train has to depart at 2:20 p.m.",
  },
  {
    display: "an|kommen",
    prefix: "an-",
    meaning: "to arrive",
    withoutModal: "Der Zug kommt um 16:08 Uhr an.",
    withoutModalEnglish: "The train arrives at 4:08 p.m.",
    withModal: "Der Zug soll um 16:08 Uhr ankommen.",
    withModalEnglish: "The train is supposed to arrive at 4:08 p.m.",
  },
  {
    display: "um|steigen",
    prefix: "um-",
    meaning: "to change trains",
    withoutModal: "Wir steigen in Hannover um.",
    withoutModalEnglish: "We change trains in Hanover.",
    withModal: "Wir müssen in Hannover umsteigen.",
    withModalEnglish: "We have to change trains in Hanover.",
  },
  {
    display: "ein|steigen",
    prefix: "ein-",
    meaning: "to get on",
    withoutModal: "Die Fahrgäste steigen jetzt ein.",
    withoutModalEnglish: "The passengers are getting on now.",
    withModal: "Die Fahrgäste dürfen jetzt einsteigen.",
    withModalEnglish: "The passengers are allowed to get on now.",
  },
  {
    display: "aus|steigen",
    prefix: "aus-",
    meaning: "to get off",
    withoutModal: "Ich steige am Hauptbahnhof aus.",
    withoutModalEnglish: "I get off at the central station.",
    withModal: "Ich muss am Hauptbahnhof aussteigen.",
    withModalEnglish: "I have to get off at the central station.",
  },
  {
    display: "zurück|fahren",
    prefix: "zurück-",
    meaning: "to travel back",
    withoutModal: "Wir fahren am Sonntag zurück.",
    withoutModalEnglish: "We travel back on Sunday.",
    withModal: "Wir möchten am Sonntag zurückfahren.",
    withModalEnglish: "We would like to travel back on Sunday.",
  },
];

const trainBoardRows = [
  { train: "ICE 593", destination: "Hamburg Hbf", departure: "14:20", platform: "7", status: "pünktlich" },
  { train: "RE 4", destination: "Potsdam Hbf", departure: "14:35", platform: "3", status: "+10 Min." },
  { train: "ICE 847", destination: "München Hbf", departure: "14:48", platform: "11", status: "Gleiswechsel: 12" },
];

const ticketDetails = [
  ["Von", "Berlin Hbf"],
  ["Nach", "Hamburg Hbf"],
  ["Datum", "18. Juli"],
  ["Abfahrt", "14:20 Uhr"],
  ["Ankunft", "16:08 Uhr"],
  ["Zug", "ICE 593"],
  ["Gleis", "7"],
  ["Wagen / Sitz", "Wagen 6 · Sitz 42"],
  ["Preis", "39,90 €"],
];

const travelVocabulary = [
  ["die Fahrkarte / das Ticket", "ticket"],
  ["die einfache Fahrt", "one-way journey"],
  ["die Hin- und Rückfahrt", "return journey"],
  ["die Abfahrt", "departure"],
  ["die Ankunft", "arrival"],
  ["das Gleis", "platform / track"],
  ["umsteigen", "to change trains"],
  ["die Verspätung", "delay"],
];

const knowledgeQuestions = [
  {
    id: "prefix-abfahren",
    prompt: "Which prefix belongs to abfahren?",
    options: ["ab-", "an-", "um-"],
    answer: "ab-",
    explanation: "The separable prefix in abfahren is ab-: ab|fahren.",
  },
  {
    id: "without-modal-abfahren",
    prompt: "Choose the correct sentence without a modal verb.",
    options: ["Der Zug fährt um 14:20 Uhr ab.", "Der Zug abfährt um 14:20 Uhr.", "Der Zug fährt ab um 14:20 Uhr ab."],
    answer: "Der Zug fährt um 14:20 Uhr ab.",
    explanation: "Without a modal verb, the separable main verb is conjugated and the prefix moves to the end: fährt ... ab.",
  },
  {
    id: "with-modal-abfahren",
    prompt: "Choose the correct sentence with a modal verb.",
    options: ["Der Zug muss um 14:20 Uhr abfahren.", "Der Zug muss um 14:20 Uhr fährt ab.", "Der Zug abfahren muss um 14:20 Uhr."],
    answer: "Der Zug muss um 14:20 Uhr abfahren.",
    explanation: "After a modal verb, the separable main verb abfahren stays together in the infinitive form at the end.",
  },
  {
    id: "modal-ankommen",
    prompt: "Complete: Der Zug soll um 16:08 Uhr ___.",
    options: ["ankommen", "kommt ... an", "an ... kommen"],
    answer: "ankommen",
    explanation: "With sollen, the separable main verb ankommen stays together at the end.",
  },
  {
    id: "modal-umsteigen",
    prompt: "Choose the correct word order.",
    options: ["Wir müssen in Hannover umsteigen.", "Wir müssen in Hannover steigen um.", "Wir umsteigen müssen in Hannover."],
    answer: "Wir müssen in Hannover umsteigen.",
    explanation: "The modal verb is conjugated and the separable main verb umsteigen stays together at the end.",
  },
  {
    id: "modal-einsteigen",
    prompt: "Complete: Die Fahrgäste dürfen jetzt ___.",
    options: ["einsteigen", "steigen ... ein", "ein ... steigen"],
    answer: "einsteigen",
    explanation: "After dürfen, use the complete separable main verb einsteigen at the end.",
  },
  {
    id: "modal-aussteigen",
    prompt: "Which sentence is correct?",
    options: ["Ich muss am Hauptbahnhof aussteigen.", "Ich muss am Hauptbahnhof steige aus.", "Ich aussteigen muss am Hauptbahnhof."],
    answer: "Ich muss am Hauptbahnhof aussteigen.",
    explanation: "The separable main verb aussteigen goes to the end in the infinitive form.",
  },
  {
    id: "modal-zurueckfahren",
    prompt: "Complete: Wir möchten am Sonntag ___.",
    options: ["zurückfahren", "fahren ... zurück", "zurück ... fahren"],
    answer: "zurückfahren",
    explanation: "After möchten, the separable main verb zurückfahren stays together at the end.",
  },
  {
    id: "board-platform",
    prompt: "Auf welchem Gleis fährt der ICE 593 ab?",
    options: ["Gleis 3", "Gleis 7", "Gleis 11"],
    answer: "Gleis 7",
    explanation: "The departure board shows ICE 593 on Gleis 7.",
  },
  {
    id: "ticket-arrival",
    prompt: "Wann ist die Ankunft in Hamburg?",
    options: ["um 14:20 Uhr", "um 16:08 Uhr", "um 18:07 Uhr"],
    answer: "um 16:08 Uhr",
    explanation: "The example ticket shows the arrival time as 16:08 Uhr.",
  },
];

const SectionCard = ({ title, children }) => (
  <section style={card}>
    <h2 style={sectionTitle}>{title}</h2>
    {children}
  </section>
);

const Translation = ({ children }) => (
  <div style={{ marginTop: 5, color: "#475569", fontSize: ".92rem", lineHeight: 1.55 }}>
    <strong>English:</strong> {children}
  </div>
);

const A1Day14ModalVerbsWorkbookPage = () => {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const requestedLevel = String(query.get("level") || "").toUpperCase();
  const requestedDay = Number(query.get("day") || 0);
  const isA2Day17Context = requestedLevel === "A2" && requestedDay === 17;
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);

  const score = useMemo(
    () => knowledgeQuestions.reduce(
      (total, question) => total + (selectedAnswers[question.id] === question.answer ? 1 : 0),
      0,
    ),
    [selectedAnswers],
  );

  if (isA2Day17Context) {
    return <A2Day17InDieApothekeModalverbenFragenGrammarPage />;
  }

  const resetTest = () => {
    setSelectedAnswers({});
    setTestSubmitted(false);
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...card, gap: 14, overflow: "hidden", padding: 0 }}>
        <div style={{ position: "relative" }}>
          <img
            src="https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1600&q=80"
            alt="Train journey through Germany"
            loading="lazy"
            style={{ width: "100%", height: 230, objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.15))" }} />
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 12, color: "white" }}>
            <div style={{ fontWeight: 800, fontSize: 19 }}>A1 · Day 14 · Modal Verbs with Separable Verbs</div>
            <div style={{ opacity: 0.94, fontSize: 13 }}>ab|fahren · an|kommen · um|steigen · ein|steigen · aus|steigen</div>
          </div>
        </div>

        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
          <div style={{ display: "grid", gap: 6 }}>
            <h1 style={{ ...styles.title, margin: 0 }}>A1 · Day 14 Workbook · Modal Verbs with Separable Verbs</h1>
            <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 3.6 · Trennbare Verben after modal verbs</p>
            <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.7 }}>
              You already know how modal verbs work with normal main verbs. This lesson shows what changes when the main verb is separable.
            </p>
          </div>
        </div>
      </div>

      <SectionCard title="1) Learning goals">
        <div style={softBlue}>
          The important idea is simple: the modal verb is conjugated, while the <strong>main verb</strong> goes to the end in the infinitive form. A separable main verb stays together at the end.
        </div>
        <ul style={listStyle}>
          <li>Identify the modal verb and the main verb in a sentence.</li>
          <li>Compare a normal main verb with a separable main verb.</li>
          <li>Recognise common prefixes such as <strong>ab-, an-, ein-, aus-, um-</strong> and <strong>zurück-</strong>.</li>
          <li>Keep the prefix and verb together after <strong>können, müssen, dürfen, wollen, sollen</strong> and <strong>möchten</strong>.</li>
          <li>Build correct sentences such as <strong>Wir müssen in Hannover umsteigen.</strong></li>
        </ul>
      </SectionCard>

      <SectionCard title="2) Quick modal-verb review">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
          {modalVerbs.map((item) => (
            <div key={item.verb} style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 13, background: "#f8fafc" }}>
              <strong>{item.verb}</strong> — {item.meaning}<br />
              <span style={{ color: "#334155" }}>{item.example}</span>
            </div>
          ))}
        </div>
        <div style={softAmber}>
          <strong>Remember:</strong> <strong>mögen</strong> means to like: <em>Ich mag Zugreisen.</em> <strong>möchten</strong> expresses a polite wish: <em>Ich möchte morgen zurückfahren.</em>
        </div>
      </SectionCard>

      <SectionCard title="3) Quick conjugation review">
        <div style={{ overflowX: "auto", border: "1px solid #dbeafe", borderRadius: 14 }}>
          <table aria-label="Modal verb conjugation table" style={{ width: "100%", minWidth: 760, borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr style={{ background: "#eff6ff" }}>
                {["Pronoun", "können", "müssen", "dürfen", "wollen", "sollen", "möchten"].map((heading) => (
                  <th key={heading} scope="col" style={{ textAlign: "left", padding: 11, borderBottom: "1px solid #bfdbfe", whiteSpace: "nowrap" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modalConjugations.map((row) => (
                <tr key={row.pronoun}>
                  <th scope="row" style={{ textAlign: "left", padding: 11, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>{row.pronoun}</th>
                  {["können", "müssen", "dürfen", "wollen", "sollen", "möchten"].map((verb) => (
                    <td key={verb} style={{ padding: 11, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" }}>{row[verb]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="4) Modal verb + main verb">
        <div style={softBlue}>
          <strong>Sentence pattern:</strong> Subject + conjugated modal verb + details + <strong>main verb in the infinitive form</strong>.<br />
          <strong>German pattern:</strong> Subjekt + konjugiertes Modalverb + Angaben + Hauptverb im Infinitiv.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
          <div style={softAmber}>
            <strong>Normal main verb: kaufen · to buy</strong><br /><br />
            <strong>No modal:</strong> Ich kaufe eine Fahrkarte.<br />
            <Translation>I buy a ticket.</Translation><br />
            <strong>With modal:</strong> Ich möchte eine Fahrkarte kaufen.
            <Translation>I would like to buy a ticket.</Translation>
          </div>
          <div style={softGreen}>
            <strong>Separable main verb: ab|fahren · to depart</strong><br /><br />
            <strong>No modal:</strong> Der Zug fährt um 14:20 Uhr ab.<br />
            <Translation>The train departs at 2:20 p.m.</Translation><br />
            <strong>With modal:</strong> Der Zug muss um 14:20 Uhr abfahren.
            <Translation>The train has to depart at 2:20 p.m.</Translation>
          </div>
        </div>

        <div style={softAmber}>
          <strong>See the difference:</strong>
          <ul style={{ ...listStyle, marginTop: 8 }}>
            <li>A normal main verb has no separable prefix: <strong>kaufen</strong>.</li>
            <li>A separable main verb has a prefix: <strong>ab|fahren</strong>.</li>
            <li>Without a modal verb, the separable prefix moves to the end: <strong>fährt ... ab</strong>.</li>
            <li>With a modal verb, the complete separable main verb stays together at the end: <strong>muss ... abfahren</strong>.</li>
          </ul>
        </div>
      </SectionCard>

      <SectionCard title="5) Separable main verbs · Trennbare Hauptverben">
        <div style={softBlue}>
          <strong>Pattern for a separable main verb:</strong> Subject + conjugated modal verb + details + <strong>complete separable main verb</strong>.<br />
          <strong>Example:</strong> Wir <strong>müssen</strong> in Hannover <strong>umsteigen</strong>.
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {separableVerbs.map((item) => (
            <article key={item.display} style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 14, background: "#ffffff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
                <strong style={{ fontSize: "1.05rem" }}>{item.display}</strong>
                <span><strong>Prefix:</strong> {item.prefix} · <strong>English:</strong> {item.meaning}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8, marginTop: 10 }}>
                <div style={softAmber}>
                  <strong>No modal:</strong><br />
                  {item.withoutModal}
                  <Translation>{item.withoutModalEnglish}</Translation>
                </div>
                <div style={softGreen}>
                  <strong>With modal:</strong><br />
                  {item.withModal}
                  <Translation>{item.withModalEnglish}</Translation>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={softBlue}>
          <strong>Three steps:</strong>
          <ol style={{ ...listStyle, marginTop: 8 }}>
            <li>Conjugate the modal verb: <strong>müssen → wir müssen</strong>.</li>
            <li>Keep the prefix attached to the main verb: <strong>um + steigen → umsteigen</strong>.</li>
            <li>Put the complete separable main verb at the end: <strong>Wir müssen in Hannover umsteigen.</strong></li>
          </ol>
        </div>

        <div style={softAmber}>
          <strong>Do not separate the main verb after a modal verb.</strong><br />
          <s>Wir müssen in Hannover steigen um.</s><br />
          <strong>Correct:</strong> Wir müssen in Hannover umsteigen.
        </div>
      </SectionCard>

      <SectionCard title="6) Extra train reading practice">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The practice resources are shown below. Each part is open by default and can be collapsed or expanded separately.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          <details open style={detailsStyle}>
            <summary style={summaryStyle}>Departure board · Die Abfahrtstafel</summary>
            <div style={{ padding: 14 }}>
              <div aria-label="German train departure board" style={{ borderRadius: 14, border: "1px solid #334155", background: "#0f172a", color: "#f8fafc", overflow: "hidden" }}>
                <div style={{ padding: "12px 14px", fontWeight: 800, letterSpacing: 0.5, borderBottom: "1px solid #475569" }}>
                  ABFAHRT · DEPARTURES
                </div>
                <div style={{ display: "grid", gap: 10, padding: 10 }}>
                  {trainBoardRows.map((row) => (
                    <article key={row.train} style={{ background: "#1e293b", border: "1px solid #475569", borderRadius: 12, padding: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                        <strong>{row.train} → {row.destination}</strong>
                        <span style={{ color: row.status === "pünktlich" ? "#bbf7d0" : "#fde68a", fontWeight: 800 }}>{row.status}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(105px, 1fr))", gap: 8, marginTop: 10 }}>
                        <div><span style={{ color: "#cbd5e1", fontSize: 12 }}>Abfahrt</span><br /><strong>{row.departure}</strong></div>
                        <div><span style={{ color: "#cbd5e1", fontSize: 12 }}>Gleis</span><br /><strong>{row.platform}</strong></div>
                        <div><span style={{ color: "#cbd5e1", fontSize: 12 }}>Nach</span><br /><strong>{row.destination}</strong></div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </details>

          <details open style={detailsStyle}>
            <summary style={summaryStyle}>Ticket · Die Fahrkarte</summary>
            <div style={{ padding: 14 }}>
              <div aria-label="Example German train ticket" style={{ border: "2px solid #1d4ed8", borderRadius: 18, overflow: "hidden", background: "#ffffff", boxShadow: "0 10px 24px rgba(15,23,42,.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: 16, background: "linear-gradient(135deg,#1d4ed8,#1e3a8a)", color: "white" }}>
                  <div><strong style={{ fontSize: 20 }}>FALOWEN BAHN</strong><br /><span>Digitales Ticket</span></div>
                  <div style={{ textAlign: "right" }}><strong>ICE 593</strong><br /><span>2. Klasse</span></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 0 }}>
                  {ticketDetails.map(([label, value]) => (
                    <div key={label} style={{ padding: 13, borderRight: "1px solid #dbeafe", borderBottom: "1px solid #dbeafe" }}>
                      <div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", fontWeight: 800 }}>{label}</div>
                      <div style={{ marginTop: 3, fontWeight: 800 }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: 14 }}><strong>Direktverbindung:</strong> kein Umstieg</div>
              </div>
            </div>
          </details>

          <details open style={detailsStyle}>
            <summary style={summaryStyle}>Vocabulary · Wortschatz</summary>
            <div style={{ padding: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 8 }}>
              {travelVocabulary.map(([german, english]) => (
                <div key={german} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 11, background: "#f8fafc" }}>
                  <strong>{german}</strong><br /><span style={{ color: "#475569" }}>{english}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      </SectionCard>

      <SectionCard title="7) Sentence-building practice">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Change each sentence so that it contains a modal verb. Keep the separable main verb together at the end.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
          <div style={softAmber}><strong>Der Zug fährt um 14:20 Uhr ab.</strong><br />→ Der Zug muss um 14:20 Uhr abfahren.</div>
          <div style={softAmber}><strong>Wir steigen in Hannover um.</strong><br />→ Wir müssen in Hannover umsteigen.</div>
          <div style={softAmber}><strong>Die Fahrgäste steigen jetzt ein.</strong><br />→ Die Fahrgäste dürfen jetzt einsteigen.</div>
          <div style={softAmber}><strong>Ich steige am Hauptbahnhof aus.</strong><br />→ Ich muss am Hauptbahnhof aussteigen.</div>
        </div>
        <div style={softGreen}>
          <strong>Your turn:</strong> Write one sentence each with <strong>ankommen, abfahren, umsteigen, einsteigen</strong> and <strong>aussteigen</strong>. Use a different modal verb where possible.
        </div>
      </SectionCard>

      <SectionCard title="8) Knowledge test">
        <p style={{ margin: 0 }}>Answer all ten questions. The final two questions use the train-reading practice above.</p>
        <div style={{ display: "grid", gap: 14 }}>
          {knowledgeQuestions.map((question, index) => {
            const selected = selectedAnswers[question.id];
            const correct = selected === question.answer;
            return (
              <fieldset key={question.id} style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 14, display: "grid", gap: 9 }}>
                <legend style={{ padding: "0 6px", fontWeight: 800 }}>{index + 1}. {question.prompt}</legend>
                {question.options.map((option) => (
                  <label key={option} style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={selected === option}
                      onChange={() => {
                        setSelectedAnswers((current) => ({ ...current, [question.id]: option }));
                        setTestSubmitted(false);
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
                {testSubmitted ? (
                  <div style={correct ? softGreen : softAmber}>
                    <strong>{correct ? "Correct." : `Correct answer: ${question.answer}`}</strong><br />
                    {question.explanation}
                  </div>
                ) : null}
              </fieldset>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={primaryBtn} onClick={() => setTestSubmitted(true)}>
            Check knowledge test
          </button>
          <button type="button" style={secondaryBtn} onClick={resetTest}>
            Reset test
          </button>
        </div>
        {testSubmitted ? (
          <div role="status" style={score >= 7 ? softGreen : softAmber}>
            <strong>Score: {score} / {knowledgeQuestions.length}</strong><br />
            {score >= 7
              ? "Good understanding. Review any incorrect separable prefixes and practise the sentence pairs aloud."
              : "Review the prefix list and the difference between sentences with and without modal verbs, then try again."}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="9) Final self-check">
        <ul style={listStyle}>
          <li>I can identify the conjugated modal verb and the main verb.</li>
          <li>I know that the main verb goes to the end in the infinitive form after a modal verb.</li>
          <li>I can recognise common separable prefixes such as ab-, an-, ein-, aus-, um- and zurück-.</li>
          <li>I can separate the main verb when there is no modal verb: <strong>Der Zug fährt ab.</strong></li>
          <li>I can keep the separable main verb together after a modal verb: <strong>Der Zug muss abfahren.</strong></li>
          <li>I can explain the difference between a normal main verb such as <strong>kaufen</strong> and a separable main verb such as <strong>abfahren</strong>.</li>
        </ul>
      </SectionCard>
    </div>
  );
};

export default A1Day14ModalVerbsWorkbookPage;