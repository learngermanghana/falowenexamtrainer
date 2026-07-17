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
  { verb: "können", meaning: "can / to be able to", travel: "Kann ich mit Karte bezahlen?" },
  { verb: "müssen", meaning: "must / to have to", travel: "Muss ich in Hannover umsteigen?" },
  { verb: "dürfen", meaning: "may / to be allowed to", travel: "Darf ich diesen Zug nehmen?" },
  { verb: "wollen", meaning: "to want to", travel: "Wir wollen am Samstag fahren." },
  { verb: "sollen", meaning: "should / to be supposed to", travel: "Soll ich einen Sitzplatz reservieren?" },
  { verb: "mögen", meaning: "to like", travel: "Ich mag Zugreisen." },
  { verb: "möchten", meaning: "would like", travel: "Ich möchte eine Fahrkarte nach Hamburg." },
];

const trainBoardRows = [
  { train: "ICE 593", destination: "Hamburg Hbf", departure: "14:20", platform: "7", status: "pünktlich" },
  { train: "RE 4", destination: "Potsdam Hbf", departure: "14:35", platform: "3", status: "+10 Min." },
  { train: "ICE 847", destination: "München Hbf", departure: "14:48", platform: "11", status: "Gleiswechsel: 12" },
];

const ticketDetails = [
  ["Von", "Berlin Hbf"],
  ["Nach", "Hamburg Hbf"],
  ["Datum", "18. Juli 2026"],
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
  ["abfahren", "to depart"],
  ["die Ankunft", "arrival"],
  ["ankommen", "to arrive"],
  ["das Gleis", "platform / track"],
  ["umsteigen", "to change trains"],
  ["die Verspätung", "delay"],
  ["der Wagen", "coach"],
  ["der Sitzplatz", "seat"],
  ["die Reservierung", "reservation"],
];

const knowledgeQuestions = [
  {
    id: "board-platform",
    prompt: "Auf welchem Gleis fährt der ICE 593 ab?",
    options: ["Gleis 3", "Gleis 7", "Gleis 11"],
    answer: "Gleis 7",
    explanation: "The board shows ICE 593 on Gleis 7.",
  },
  {
    id: "ticket-arrival",
    prompt: "Wann ist die Ankunft in Hamburg?",
    options: ["um 14:20 Uhr", "um 16:08 Uhr", "um 18:07 Uhr"],
    answer: "um 16:08 Uhr",
    explanation: "Ankunft is the noun for arrival. The ticket shows 16:08 Uhr.",
  },
  {
    id: "booking-request",
    prompt: "Which sentence is a polite ticket request?",
    options: ["Ich muss ein Ticket.", "Ich möchte eine Fahrkarte nach Hamburg.", "Ich darf Hamburg fahren."],
    answer: "Ich möchte eine Fahrkarte nach Hamburg.",
    explanation: "möchte is the normal polite form for ordering or requesting something.",
  },
  {
    id: "separable-arrive",
    prompt: "Choose the correct sentence without a modal verb.",
    options: ["Der Zug ankommt um 16:08 Uhr.", "Der Zug kommt um 16:08 Uhr an.", "Der Zug kommt an um 16:08 Uhr an."],
    answer: "Der Zug kommt um 16:08 Uhr an.",
    explanation: "Without a modal verb, ankommen separates: kommt ... an.",
  },
  {
    id: "modal-arrive",
    prompt: "Choose the correct sentence with a modal verb.",
    options: ["Der Zug muss um 16:08 Uhr ankommen.", "Der Zug muss kommt um 16:08 Uhr an.", "Der Zug ankommen muss um 16:08 Uhr."],
    answer: "Der Zug muss um 16:08 Uhr ankommen.",
    explanation: "With a modal verb, the complete infinitive ankommen stays together at the end.",
  },
  {
    id: "change-trains",
    prompt: "What does “Muss ich umsteigen?” mean?",
    options: ["Must I change trains?", "May I sit here?", "When does the train arrive?"],
    answer: "Must I change trains?",
    explanation: "umsteigen means to change trains or transfer.",
  },
  {
    id: "permission",
    prompt: "Complete: ___ ich diesen Zug nehmen?",
    options: ["Darf", "Möchte", "Muss"],
    answer: "Darf",
    explanation: "Darf ich ...? asks for permission: May I ...?",
  },
  {
    id: "departure-noun",
    prompt: "Which word is the noun for departure?",
    options: ["ankommen", "die Abfahrt", "umsteigen"],
    answer: "die Abfahrt",
    explanation: "abfahren is the verb; die Abfahrt is the noun.",
  },
  {
    id: "separable-depart",
    prompt: "Complete: Der Zug ___ um 14:20 Uhr ___.",
    options: ["fährt ... ab", "ab ... fährt", "muss ... fährt"],
    answer: "fährt ... ab",
    explanation: "The separable verb abfahren becomes fährt ... ab in a normal main clause.",
  },
  {
    id: "modal-transfer",
    prompt: "Choose the correct word order.",
    options: ["Wir müssen in Hannover umsteigen.", "Wir umsteigen müssen in Hannover.", "Wir müssen steigen in Hannover um."],
    answer: "Wir müssen in Hannover umsteigen.",
    explanation: "The conjugated modal is in position 2 and the full separable infinitive is at the end.",
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
            <div style={{ fontWeight: 800, fontSize: 19 }}>A1 · Day 14 · Practical Train Travel</div>
            <div style={{ opacity: 0.94, fontSize: 13 }}>Modalverben · ankommen · abfahren · umsteigen · Fahrkarten buchen</div>
          </div>
        </div>

        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
          <div style={{ display: "grid", gap: 6 }}>
            <h1 style={{ ...styles.title, margin: 0 }}>A1 · Day 14 Workbook · Modal Verbs at the Train Station</h1>
            <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 3.6 · Schreiben &amp; Sprechen · Practical self-practice</p>
            <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.7 }}>
              Learn to read a German departure board and train ticket, book a journey, ask practical questions, and combine modal verbs with separable verbs.
            </p>
          </div>
        </div>
      </div>

      <SectionCard title="1) Your practical mission">
        <div style={softBlue}>
          By the end of this workbook, you should be able to buy a ticket, find your train and platform, understand departure and arrival information, and ask whether you must change trains.
        </div>
        <ul style={listStyle}>
          <li>Read <strong>Abfahrt</strong>, <strong>Ankunft</strong>, <strong>Gleis</strong> and <strong>Verspätung</strong>.</li>
          <li>Ask for a one-way or return ticket.</li>
          <li>Use <strong>möchten, können, müssen, dürfen</strong> and <strong>sollen</strong> in real situations.</li>
          <li>Use separable verbs correctly—with and without modal verbs.</li>
        </ul>
      </SectionCard>

      <SectionCard title="2) Booking a train ticket · Eine Fahrkarte buchen">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          <div style={softAmber}><strong>1. Destination</strong><br />Ich möchte nach Hamburg fahren.</div>
          <div style={softAmber}><strong>2. Journey type</strong><br />Eine einfache Fahrt, bitte.<br />Hin und zurück, bitte.</div>
          <div style={softAmber}><strong>3. Date and time</strong><br />Am Samstag um 14 Uhr.</div>
          <div style={softAmber}><strong>4. Extra question</strong><br />Muss ich umsteigen?<br />Kann ich mit Karte bezahlen?</div>
        </div>
        <div style={{ ...softGreen, display: "grid", gap: 7 }}>
          <strong>Model dialogue</strong>
          <span><strong>Reisender:</strong> Guten Tag. Ich möchte eine Fahrkarte nach Hamburg.</span>
          <span><strong>Mitarbeiterin:</strong> Einfach oder hin und zurück?</span>
          <span><strong>Reisender:</strong> Hin und zurück, bitte. Ich möchte am Samstag um 14 Uhr abfahren.</span>
          <span><strong>Mitarbeiterin:</strong> Der ICE fährt um 14:20 Uhr ab.</span>
          <span><strong>Reisender:</strong> Muss ich umsteigen?</span>
          <span><strong>Mitarbeiterin:</strong> Nein. Sie können direkt fahren.</span>
        </div>
      </SectionCard>

      <SectionCard title="3) Read a German train board · Die Abfahrtstafel">
        <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid #334155", background: "#0f172a", color: "#f8fafc" }}>
          <div style={{ padding: "12px 14px", fontWeight: 800, letterSpacing: 0.5, borderBottom: "1px solid #475569" }}>
            ABFAHRT · DEPARTURES
          </div>
          <div style={{ minWidth: 610 }}>
            <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.5fr 0.8fr 0.6fr 1.2fr", gap: 8, padding: "9px 14px", color: "#facc15", fontWeight: 800 }}>
              <span>Zug</span><span>Nach</span><span>Abfahrt</span><span>Gleis</span><span>Hinweis</span>
            </div>
            {trainBoardRows.map((row) => (
              <div key={row.train} style={{ display: "grid", gridTemplateColumns: "0.8fr 1.5fr 0.8fr 0.6fr 1.2fr", gap: 8, padding: "11px 14px", borderTop: "1px solid #334155" }}>
                <strong>{row.train}</strong><span>{row.destination}</span><span>{row.departure}</span><strong>{row.platform}</strong><span>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
          <div style={softBlue}>
            <strong>abfahren → die Abfahrt</strong><br />Der Zug <strong>fährt</strong> um 14:20 Uhr <strong>ab</strong>.<br />Die <strong>Abfahrt</strong> ist um 14:20 Uhr.
          </div>
          <div style={softGreen}>
            <strong>ankommen → die Ankunft</strong><br />Der Zug <strong>kommt</strong> um 16:08 Uhr <strong>an</strong>.<br />Die <strong>Ankunft</strong> ist um 16:08 Uhr.
          </div>
        </div>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Important:</strong> A verb describes the action: <em>ankommen, abfahren</em>. A noun names the event: <em>die Ankunft, die Abfahrt</em>. German nouns begin with a capital letter.
        </p>
      </SectionCard>

      <SectionCard title="4) Read the ticket · Die Fahrkarte">
        <div aria-label="Example German train ticket" style={{ border: "2px solid #1d4ed8", borderRadius: 18, overflow: "hidden", background: "#ffffff", boxShadow: "0 10px 24px rgba(15,23,42,.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: 16, background: "linear-gradient(135deg,#1d4ed8,#1e3a8a)", color: "white" }}>
            <div><strong style={{ fontSize: 20 }}>FALOWEN BAHN</strong><br /><span>Digitales Ticket</span></div>
            <div style={{ textAlign: "right" }}><strong>ICE 593</strong><br /><span>2. Klasse</span></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 0 }}>
            {ticketDetails.map(([label, value]) => (
              <div key={label} style={{ padding: 13, borderRight: "1px solid #dbeafe", borderBottom: "1px solid #dbeafe" }}>
                <div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", fontWeight: 800 }}>{label}</div>
                <div style={{ marginTop: 3, fontWeight: 800 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 14, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span><strong>Direktverbindung:</strong> kein Umstieg</span>
            <span aria-hidden="true" style={{ fontFamily: "monospace", letterSpacing: 2 }}>▮▯▮▮▯▮▯▮▮▯</span>
          </div>
        </div>
        <div style={softAmber}>
          <strong>Ticket questions:</strong> Wo fährt der Zug ab? Wohin fährt er? Wann kommt er an? Auf welchem Gleis fährt er ab? Muss die Person umsteigen? Wie viel kostet die Fahrkarte?
        </div>
      </SectionCard>

      <SectionCard title="5) Essential train vocabulary">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
          {travelVocabulary.map(([german, english]) => (
            <div key={german} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 11, background: "#f8fafc" }}>
              <strong>{german}</strong><br /><span style={{ color: "#475569" }}>{english}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="6) Modal verbs in real train situations">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The modal verb is conjugated in position 2. The main verb stays in the infinitive at the end.
        </p>
        <div style={softBlue}>
          <strong>Pattern:</strong> Subject + modal verb + time / place / details + infinitive.<br />
          <strong>Example:</strong> Ich <strong>möchte</strong> morgen nach Hamburg <strong>fahren</strong>.
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {modalVerbs.map((item) => (
            <div key={item.verb} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 8 }}>
              <strong>{item.verb}</strong> — {item.meaning}<br />
              <span style={{ color: "#334155" }}>{item.travel}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="7) Separable verbs refresher · Trennbare Verben">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          You already met separable verbs in the clock lesson. Now use them for train times.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
          <div style={softAmber}>
            <strong>Without a modal verb: separate the prefix</strong>
            <ul style={listStyle}>
              <li>Der Zug <strong>fährt</strong> um 14:20 Uhr <strong>ab</strong>.</li>
              <li>Wir <strong>kommen</strong> um 16:08 Uhr <strong>an</strong>.</li>
              <li>Ich <strong>steige</strong> in Hannover <strong>um</strong>.</li>
            </ul>
          </div>
          <div style={softGreen}>
            <strong>With a modal verb: keep the infinitive together</strong>
            <ul style={listStyle}>
              <li>Der Zug <strong>muss</strong> um 14:20 Uhr <strong>abfahren</strong>.</li>
              <li>Wir <strong>möchten</strong> um 16:08 Uhr <strong>ankommen</strong>.</li>
              <li>Ich <strong>muss</strong> in Hannover <strong>umsteigen</strong>.</li>
            </ul>
          </div>
        </div>
        <div style={softBlue}>
          <strong>Rule:</strong> Modal verb in position 2 + complete separable infinitive at the end. Do not separate <em>ankommen, abfahren</em> or <em>umsteigen</em> when a modal verb is present.
        </div>
      </SectionCard>

      <SectionCard title="8) Speaking practice · At the ticket counter">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Work with a partner. Student A is the traveller. Student B works at the ticket counter. Then change roles.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
          <div style={softBlue}>
            <strong>Student A must say:</strong>
            <ul style={listStyle}>
              <li>destination and travel date</li>
              <li>one-way or return journey</li>
              <li>preferred departure time</li>
              <li>“Muss ich umsteigen?”</li>
              <li>“Kann ich mit Karte bezahlen?”</li>
            </ul>
          </div>
          <div style={softAmber}>
            <strong>Student B must answer:</strong>
            <ul style={listStyle}>
              <li>train number and departure time</li>
              <li>platform number</li>
              <li>arrival time</li>
              <li>whether a transfer is necessary</li>
              <li>ticket price</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="9) Practical knowledge test">
        <p style={{ margin: 0 }}>Answer all ten questions. Then check your score and corrections.</p>
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
              ? "Good practical understanding. Review any incorrect sentences and practise the dialogue aloud."
              : "Review the train board, ticket and separable-verb rule, then try the test again."}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="10) Final self-check">
        <ul style={listStyle}>
          <li>I can ask for a train ticket politely.</li>
          <li>I understand Abfahrt, Ankunft, Gleis, Verspätung and umsteigen.</li>
          <li>I can read the important information on a train board and ticket.</li>
          <li>I can use modal verbs with an infinitive at the end.</li>
          <li>I can separate ankommen and abfahren without a modal verb.</li>
          <li>I can keep ankommen, abfahren and umsteigen together after a modal verb.</li>
        </ul>
      </SectionCard>
    </div>
  );
};

export default A1Day14ModalVerbsWorkbookPage;
