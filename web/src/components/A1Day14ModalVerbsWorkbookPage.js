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

const modalVerbs = [
  { verb: "können", meaning: "can / to be able to", example: "Ich kann heute mit dem Zug fahren." },
  { verb: "müssen", meaning: "must / to have to", example: "Wir müssen in Hannover umsteigen." },
  { verb: "dürfen", meaning: "may / to be allowed to", example: "Darf ich diesen Zug nehmen?" },
  { verb: "wollen", meaning: "to want to", example: "Wir wollen am Samstag fahren." },
  { verb: "sollen", meaning: "should / to be supposed to", example: "Soll ich einen Sitzplatz reservieren?" },
  { verb: "möchten", meaning: "would like", example: "Ich möchte eine Fahrkarte kaufen." },
];

const modalConjugations = [
  { pronoun: "ich", können: "kann", müssen: "muss", dürfen: "darf", wollen: "will", sollen: "soll", möchten: "möchte" },
  { pronoun: "du", können: "kannst", müssen: "musst", dürfen: "darfst", wollen: "willst", sollen: "sollst", möchten: "möchtest" },
  { pronoun: "er / sie / es", können: "kann", müssen: "muss", dürfen: "darf", wollen: "will", sollen: "soll", möchten: "möchte" },
  { pronoun: "wir", können: "können", müssen: "müssen", dürfen: "dürfen", wollen: "wollen", sollen: "sollen", möchten: "möchten" },
  { pronoun: "ihr", können: "könnt", müssen: "müsst", dürfen: "dürft", wollen: "wollt", sollen: "sollt", möchten: "möchtet" },
  { pronoun: "Sie / sie", können: "können", müssen: "müssen", dürfen: "dürfen", wollen: "wollen", sollen: "sollen", möchten: "möchten" },
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
    id: "conjugation-ich",
    prompt: "Complete: Ich ___ heute mit dem Zug fahren.",
    options: ["kann", "können", "kannst"],
    answer: "kann",
    explanation: "With ich, können becomes kann.",
  },
  {
    id: "conjugation-du",
    prompt: "Complete: Du ___ eine Fahrkarte kaufen.",
    options: ["musst", "muss", "müssen"],
    answer: "musst",
    explanation: "With du, müssen becomes musst.",
  },
  {
    id: "moegen-moechten",
    prompt: "Which sentence politely asks for a ticket?",
    options: ["Ich mag eine Fahrkarte.", "Ich möchte eine Fahrkarte.", "Ich muss eine Fahrkarte."],
    answer: "Ich möchte eine Fahrkarte.",
    explanation: "möchten expresses a polite wish. mögen normally expresses liking.",
  },
  {
    id: "word-order",
    prompt: "Choose the correct word order.",
    options: ["Ich kann Deutsch sprechen.", "Ich kann sprechen Deutsch.", "Ich Deutsch kann sprechen."],
    answer: "Ich kann Deutsch sprechen.",
    explanation: "The conjugated modal verb is in position 2 and the infinitive goes to the end.",
  },
  {
    id: "permission",
    prompt: "Complete: ___ ich diesen Zug nehmen?",
    options: ["Darf", "Möchte", "Muss"],
    answer: "Darf",
    explanation: "Darf ich ...? asks for permission: May I ...?",
  },
  {
    id: "advice",
    prompt: "Which modal verb normally gives advice or says what someone should do?",
    options: ["sollen", "wollen", "dürfen"],
    answer: "sollen",
    explanation: "sollen is used for advice, recommendations and instructions from another person.",
  },
  {
    id: "modal-transfer",
    prompt: "Choose the correct sentence with a separable verb and a modal verb.",
    options: ["Wir müssen in Hannover umsteigen.", "Wir müssen in Hannover steigen um.", "Wir umsteigen müssen in Hannover."],
    answer: "Wir müssen in Hannover umsteigen.",
    explanation: "After a modal verb, the complete infinitive umsteigen stays together at the end.",
  },
  {
    id: "separable-depart",
    prompt: "Complete without a modal verb: Der Zug ___ um 14:20 Uhr ___.",
    options: ["fährt ... ab", "ab ... fährt", "muss ... fährt"],
    answer: "fährt ... ab",
    explanation: "Without a modal verb, abfahren separates: fährt ... ab.",
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
            <div style={{ fontWeight: 800, fontSize: 19 }}>A1 · Day 14 · Modal Verbs</div>
            <div style={{ opacity: 0.94, fontSize: 13 }}>können · müssen · dürfen · wollen · sollen · möchten</div>
          </div>
        </div>

        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
          <div style={{ display: "grid", gap: 6 }}>
            <h1 style={{ ...styles.title, margin: 0 }}>A1 · Day 14 Workbook · Modal Verbs</h1>
            <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 3.6 · Core grammar first · Train travel application</p>
            <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.7 }}>
              Learn the meaning, conjugation and sentence position of the most important A1 modal verbs. Then apply them in a practical train-station situation.
            </p>
          </div>
        </div>
      </div>

      <SectionCard title="1) Learning goals">
        <div style={softBlue}>
          This lesson teaches modal verbs first. The detailed train board, ticket and vocabulary are available later as optional extra practice.
        </div>
        <ul style={listStyle}>
          <li>Choose the correct modal verb for ability, obligation, permission, intention, advice and polite wishes.</li>
          <li>Conjugate <strong>können, müssen, dürfen, wollen, sollen</strong> and <strong>möchten</strong>.</li>
          <li>Put the conjugated modal verb in position 2 and the infinitive at the end.</li>
          <li>Understand the difference between <strong>mögen</strong> and <strong>möchten</strong>.</li>
        </ul>
      </SectionCard>

      <SectionCard title="2) Meaning and usage">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
          {modalVerbs.map((item) => (
            <div key={item.verb} style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 13, background: "#f8fafc" }}>
              <strong>{item.verb}</strong> — {item.meaning}<br />
              <span style={{ color: "#334155" }}>{item.example}</span>
            </div>
          ))}
        </div>
        <div style={softAmber}>
          <strong>mögen and möchten are not used in the same way.</strong><br />
          <strong>mögen = to like:</strong> Ich mag Zugreisen. Ich mag Kaffee.<br />
          <strong>möchten = would like:</strong> Ich möchte eine Fahrkarte. Ich möchte nach Hamburg fahren.
        </div>
      </SectionCard>

      <SectionCard title="3) Conjugation table">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The singular forms often change strongly. Learn <strong>ich</strong>, <strong>du</strong> and <strong>er / sie / es</strong> carefully.
        </p>
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
        <div style={softGreen}>
          <strong>Notice:</strong> ich and er / sie / es have the same form: <em>ich kann</em> and <em>er kann</em>; <em>ich muss</em> and <em>sie muss</em>.
        </div>
      </SectionCard>

      <SectionCard title="4) Sentence structure">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The modal verb is conjugated in position 2. The second verb stays in the infinitive and goes to the end.
        </p>
        <div style={softBlue}>
          <strong>Pattern:</strong> Subject + modal verb + time / place / details + infinitive.<br />
          <strong>Example:</strong> Ich <strong>möchte</strong> morgen nach Hamburg <strong>fahren</strong>.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
          <div style={softGreen}>
            <strong>Correct</strong><br />
            Ich kann Deutsch sprechen.<br />
            Wir müssen in Hannover umsteigen.
          </div>
          <div style={softAmber}>
            <strong>Common mistakes</strong><br />
            <s>Ich kann spreche Deutsch.</s><br />
            <s>Wir müssen steigen in Hannover um.</s>
          </div>
        </div>
        <div style={softBlue}>
          <strong>Separable verb rule:</strong> Without a modal verb: <em>Der Zug fährt um 14:20 Uhr ab.</em> With a modal verb, keep the infinitive together: <em>Der Zug muss um 14:20 Uhr abfahren.</em>
        </div>
      </SectionCard>

      <SectionCard title="5) Practical application · Eine Fahrkarte buchen">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          <div style={softAmber}><strong>Destination</strong><br />Ich möchte nach Hamburg fahren.</div>
          <div style={softAmber}><strong>Journey type</strong><br />Eine einfache Fahrt, bitte.<br />Hin und zurück, bitte.</div>
          <div style={softAmber}><strong>Permission or possibility</strong><br />Darf ich diesen Zug nehmen?<br />Kann ich mit Karte bezahlen?</div>
          <div style={softAmber}><strong>Obligation</strong><br />Muss ich umsteigen?</div>
        </div>
        <div style={{ ...softGreen, display: "grid", gap: 7 }}>
          <strong>Model dialogue</strong>
          <span><strong>Reisender:</strong> Guten Tag. Ich möchte eine Fahrkarte nach Hamburg.</span>
          <span><strong>Mitarbeiterin:</strong> Einfach oder hin und zurück?</span>
          <span><strong>Reisender:</strong> Hin und zurück, bitte. Muss ich umsteigen?</span>
          <span><strong>Mitarbeiterin:</strong> Nein. Sie können direkt fahren.</span>
          <span><strong>Reisender:</strong> Kann ich mit Karte bezahlen?</span>
        </div>
      </SectionCard>

      <SectionCard title="6) Extra train reading practice">
        <details>
          <summary style={{ cursor: "pointer", fontWeight: 800, padding: "4px 0" }}>
            Open departure board, ticket and vocabulary
          </summary>
          <div style={{ display: "grid", gap: 16, marginTop: 14 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Die Abfahrtstafel · Departure board</h3>
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

            <div style={{ display: "grid", gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Die Fahrkarte · Ticket</h3>
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

            <div style={{ display: "grid", gap: 8 }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>Essential vocabulary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 8 }}>
                {travelVocabulary.map(([german, english]) => (
                  <div key={german} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 11, background: "#f8fafc" }}>
                    <strong>{german}</strong><br /><span style={{ color: "#475569" }}>{english}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </details>
      </SectionCard>

      <SectionCard title="7) Speaking practice · At the ticket counter">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Work with a partner. Student A is the traveller. Student B works at the ticket counter. Use at least three different modal verbs.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
          <div style={softBlue}>
            <strong>Student A must include:</strong>
            <ul style={listStyle}>
              <li>Ich möchte ...</li>
              <li>Muss ich ...?</li>
              <li>Kann ich ...?</li>
              <li>Darf ich ...?</li>
            </ul>
          </div>
          <div style={softAmber}>
            <strong>Student B should answer with:</strong>
            <ul style={listStyle}>
              <li>Sie können ...</li>
              <li>Sie müssen nicht ...</li>
              <li>Sie dürfen ...</li>
              <li>Sie sollen ...</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="8) Knowledge test">
        <p style={{ margin: 0 }}>Answer all ten questions. The final two questions use the optional train-reading practice.</p>
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
              ? "Good understanding. Review any incorrect conjugations and practise the model dialogue aloud."
              : "Review the meanings, conjugation table and sentence-position rule, then try the test again."}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="9) Final self-check">
        <ul style={listStyle}>
          <li>I understand the main meanings of können, müssen, dürfen, wollen, sollen and möchten.</li>
          <li>I can conjugate the modal verbs with ich, du, er / sie / es, wir, ihr and Sie.</li>
          <li>I understand that mögen means to like and möchten means would like.</li>
          <li>I can put the modal verb in position 2 and the infinitive at the end.</li>
          <li>I can use modal verbs in a practical ticket-counter conversation.</li>
        </ul>
      </SectionCard>
    </div>
  );
};

export default A1Day14ModalVerbsWorkbookPage;
