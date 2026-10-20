import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
};

const Section = ({ title, eyebrow, children }) => (
  <section style={card}>
    <div style={{ display: "grid", gap: 4 }}>
      {eyebrow ? (
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "#475569" }}>
          {eyebrow}
        </span>
      ) : null}
      <h2 style={{ margin: 0 }}>{title}</h2>
    </div>
    {children}
  </section>
);

const pairRows = [
  { preposition: "in", wohin: "Ich gehe in die Schule.", wohinEn: "I am going to school.", wo: "Ich bin in der Schule.", woEn: "I am at school.", note: "die Schule → Akkusativ: die / Dativ: der" },
  { preposition: "auf", wohin: "Ich lege das Buch auf den Tisch.", wohinEn: "I put the book on the table.", wo: "Das Buch liegt auf dem Tisch.", woEn: "The book is lying on the table.", note: "der Tisch → Akkusativ: den / Dativ: dem · legen (put) / liegen (lie)" },
  { preposition: "an", wohin: "Ich hänge das Bild an die Wand.", wohinEn: "I hang the picture on the wall.", wo: "Das Bild hängt an der Wand.", woEn: "The picture is hanging on the wall.", note: "die Wand → Akkusativ: die / Dativ: der" },
  { preposition: "unter", wohin: "Der Hund läuft unter den Tisch.", wohinEn: "The dog runs under the table.", wo: "Der Hund liegt unter dem Tisch.", woEn: "The dog is lying under the table.", note: "der Tisch → Akkusativ: den / Dativ: dem" },
  { preposition: "zwischen", wohin: "Ich stelle den Stuhl zwischen die Tische.", wohinEn: "I place the chair between the tables.", wo: "Der Stuhl steht zwischen den Tischen.", woEn: "The chair stands between the tables.", note: "Plural: Akkusativ die / Dativ den (+n when needed) · stellen (place) / stehen (stand)" },
];

const quiz = [
  { prompt: "Which case? Ich lege das Buch auf den Tisch.", options: ["Akkusativ", "Dativ", "Nominativ"], answer: "Akkusativ", explanation: "Wohin? legen describes placing the book at a destination; auf den Tisch is accusative." },
  { prompt: "Which case? Das Buch liegt auf dem Tisch.", options: ["Akkusativ", "Dativ", "Nominativ"], answer: "Dativ", explanation: "Wo? liegen describes position; auf dem Tisch is dative." },
  { prompt: "Choose the verb: Ich ___ das Buch auf den Tisch.", options: ["lege", "liege", "liegt"], answer: "lege", explanation: "legen = to put or lay something somewhere (Wohin?)." },
  { prompt: "Choose the verb: Das Buch ___ auf dem Tisch.", options: ["lege", "liegt", "stelle"], answer: "liegt", explanation: "liegen = to be lying in a position (Wo?)." },
  { prompt: "Choose the verb: Ich ___ den Stuhl neben die Tür.", options: ["stehe", "steht", "stelle"], answer: "stelle", explanation: "stellen = to put something in an upright position (Wohin?)." },
  { prompt: "Choose the verb: Der Stuhl ___ neben der Tür.", options: ["steht", "stellt", "stelle"], answer: "steht", explanation: "stehen = to stand in a location (Wo?)." },
  { prompt: "What is the masculine definite article in Dativ?", options: ["den", "dem", "der"], answer: "dem", explanation: "der Tisch → auf dem Tisch (Dativ). Masculine accusative is den." },
  { prompt: "What is the masculine definite article in Akkusativ?", options: ["den", "dem", "der"], answer: "den", explanation: "der Tisch → auf den Tisch (Akkusativ). Masculine dative is dem." },
  { prompt: "Correct the destination sentence: Ich gehe in der Schule.", options: ["Ich gehe in die Schule.", "Ich gehe in dem Schule.", "Ich gehe in den Schule."], answer: "Ich gehe in die Schule.", explanation: "For going into/to school, Wohin? → Akkusativ: die Schule. 'Ich gehe in der Schule' can be grammatical if walking inside the school is intended." },
  { prompt: "Correct the location sentence: Ich bin in die Schule.", options: ["Ich bin in der Schule.", "Ich bin in den Schule.", "Ich bin in das Schule."], answer: "Ich bin in der Schule.", explanation: "Wo? → Dativ: die Schule becomes der Schule." },
  { prompt: "Ich hänge das Bild an ___ Wand.", options: ["die", "der", "dem"], answer: "die", explanation: "Wohin? → Akkusativ: feminine die remains die." },
  { prompt: "Das Bild hängt an ___ Wand.", options: ["die", "der", "dem"], answer: "der", explanation: "Wo? → Dativ: die Wand becomes der Wand." },
  { prompt: "Ich stelle den Stuhl zwischen ___ Tische.", options: ["die", "den", "dem"], answer: "die", explanation: "Wohin? → plural Akkusativ die Tische." },
  { prompt: "Der Stuhl steht zwischen ___ Tischen.", options: ["die", "den", "dem"], answer: "den", explanation: "Wo? → plural Dativ den Tischen, including -n on the noun." },
  { prompt: "Ich fahre mit ___ Bus.", options: ["den", "dem", "der"], answer: "dem", explanation: "mit always takes Dativ, even with movement: mit dem Bus." },
];

const articles = [
  ["Akkusativ", "den", "die", "das", "die"],
  ["Dativ", "dem", "der", "dem", "den (+n)"],
];

const TwoCasePrepositionsPageLegacy = () => {
  const location = useLocation();
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const workbookHref = "/campus/course/two-case-prepositions-wechselpraepositionen-day-18?view=workbook";

  const score = useMemo(
    () => quiz.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );
  const allAnswered = Object.keys(answers).length === quiz.length;

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16, maxWidth: 1080 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <a href={workbookHref} style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}>
          Open Chapter 12.1 workbook
        </a>
      </div>

      <header style={{ ...card, padding: "clamp(20px, 4vw, 34px)", background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
        <span style={{ width: "fit-content", borderRadius: 999, padding: "6px 10px", background: "#e0e7ff", color: "#3730a3", fontWeight: 800, fontSize: 12 }}>
          A1.2 · Day 18 · Chapter 12.1
        </span>
        <h1 style={{ ...styles.title, margin: 0 }}>Wechselpräpositionen</h1>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#334155", maxWidth: 820 }}>
          The same preposition can use either Akkusativ or Dativ. The key is not memorising two random forms: first decide whether the sentence describes a destination or a position.
        </p>
      </header>

      <Section eyebrow="Connect to what you know" title="Before you start">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          You already know places, articles and direction language from earlier A1 lessons. Today you combine those skills. Ask one question first:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 14 }}>
            <strong>Wohin? → Akkusativ</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>A person or object moves to a destination or changes position.</p>
          </div>
          <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 14 }}>
            <strong>Wo? → Dativ</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>The sentence describes where something is or where an activity happens.</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Two-way prepositions" title="Movement or destination?">
        <p><strong>Two-way prepositions:</strong> in, an, auf, über, unter, vor, hinter, neben, zwischen. A destination (Wohin?) takes Akkusativ; a location (Wo?) takes Dativ.</p>
        <p><strong>Movement alone does not mean Akkusativ:</strong> Ich laufe im Park. (I run in the park: where?) Ich laufe in den Park. (I run into the park: where to?)</p>
      </Section>
      <Section eyebrow="Today's targets" title="By the end of this lesson, you should be able to">
        <ol style={{ margin: 0, paddingLeft: 22, display: "grid", gap: 8, lineHeight: 1.65 }}>
          <li>recognise the nine common two-case prepositions;</li>
          <li>choose Akkusativ after <strong>Wohin?</strong> and Dativ after <strong>Wo?</strong>;</li>
          <li>use common movement/position verb pairs such as <strong>legen/liegen</strong>, <strong>stellen/stehen</strong> and <strong>setzen/sitzen</strong>.</li>
        </ol>
      </Section>

      <Section eyebrow="Core vocabulary" title="The nine Wechselpräpositionen">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          {[
            ["an", "at / on a side or edge"],
            ["auf", "on top of"],
            ["hinter", "behind"],
            ["in", "in / into"],
            ["neben", "next to"],
            ["über", "above / over"],
            ["unter", "under"],
            ["vor", "in front of"],
            ["zwischen", "between"],
          ].map(([word, meaning]) => (
            <div key={word} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
              <strong style={{ fontSize: 19 }}>{word}</strong>
              <div style={{ marginTop: 4, color: "#64748b" }}>{meaning}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Main rule" title="Movement is not enough — think destination vs position">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          A sentence can contain a verb of movement and still answer <strong>Wo?</strong>. What matters is whether the prepositional phrase gives a destination. For A1, the clearest shortcut is to compare these common verb pairs:
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Wohin? + Akkusativ", "Meaning", "Wo? + Dativ", "Meaning"].map((heading) => (
                  <th key={heading} style={{ border: "1px solid #e2e8f0", textAlign: "left", padding: 10 }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["legen", "put something down", "liegen", "be lying"],
                ["stellen", "put/place upright", "stehen", "be standing"],
                ["setzen", "put/seat", "sitzen", "be sitting"],
                ["hängen", "hang something up", "hängen", "be hanging"],
              ].map((row) => (
                <tr key={row.join("-")}>
                  {row.map((cell) => <td key={cell} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Article check" title="The article forms you need today">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Case", "der", "die", "das", "Plural"].map((heading) => (
                  <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => <td key={cell} style={{ border: "1px solid #e2e8f0", padding: 10 }}><strong>{cell}</strong></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
          Useful short forms: <strong>im = in dem</strong>, <strong>ins = in das</strong>, <strong>am = an dem</strong>, <strong>ans = an das</strong>.
        </p>
      </Section>

      <Section eyebrow="Model sentences" title="See the same preposition in both cases">
        <div style={{ display: "grid", gap: 12 }}>
          {pairRows.map((pair) => (
            <article key={pair.preposition} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, display: "grid", gap: 6 }}>
              <strong style={{ fontSize: 18 }}>{pair.preposition}</strong>
              <div><strong>Wohin? · Akkusativ</strong> {pair.wohin}<div style={{ color: "#475569", fontSize: 14 }}>{pair.wohinEn}</div></div>
              <div><strong>Wo? · Dativ</strong> {pair.wo}<div style={{ color: "#475569", fontSize: 14 }}>{pair.woEn}</div></div>
              <span style={{ color: "#64748b", fontSize: 14 }}>{pair.note}</span>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Common confusion" title="an or auf?">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          English often uses “on” for both. In German, <strong>an</strong> is common for contact with a side, wall, door, window or edge, while <strong>auf</strong> is common for something resting on top of a surface.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
            <strong>an</strong>
            <p style={{ margin: "5px 0 0" }}>Das Bild hängt <strong>an der Wand</strong>. (The picture is hanging on the wall.)</p>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}>
            <strong>auf</strong>
            <p style={{ margin: "5px 0 0" }}>Das Buch liegt <strong>auf dem Tisch</strong>. (The book is lying on the table.)</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Guided practice" title="Test cases, articles, verb pairs and error correction">
        <div style={{ display: "grid", gap: 12 }}>
          {quiz.map((question, index) => {
            const selected = answers[index];
            const correct = selected === question.answer;
            return (
              <article key={question.prompt} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, display: "grid", gap: 9 }}>
                <strong>{index + 1}. {question.prompt}</strong>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {question.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setAnswers((old) => ({ ...old, [index]: option }));
                        setShowScore(false);
                      }}
                      style={selected === option ? styles.primaryButton : styles.secondaryButton}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {selected ? (
                  <div style={{ color: correct ? "#166534" : "#9f1239", lineHeight: 1.55 }}>
                    <strong>{correct ? "Correct." : `Correct answer: ${question.answer}.`}</strong> {question.explanation}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" disabled={!allAnswered} onClick={() => setShowScore(true)} style={{ ...styles.primaryButton, opacity: allAnswered ? 1 : 0.55 }}>
            Show my score
          </button>
          <button type="button" onClick={() => { setAnswers({}); setShowScore(false); }} style={styles.secondaryButton}>
            Restart practice
          </button>
        </div>
        {showScore ? (
          <div style={{ border: "1px solid #cbd5e1", background: "#f8fafc", borderRadius: 12, padding: 12 }}>
            <strong>{score}/{quiz.length} correct.</strong> {score >= Math.ceil(quiz.length * 0.8) ? "You are ready for the workbook." : "Review Wo/Wohin and repeat the practice before continuing."}
          </div>
        ) : null}
      </Section>

      <Section eyebrow="Workbook preparation" title="Use the grammar across different tasks">
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The workbook combines this grammar with reading, listening and familiar A1 language. When you see a place phrase, first ask <strong>Wo?</strong> or <strong>Wohin?</strong>, then choose the case and article.
        </p>
        <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", padding: 12, borderRadius: 10, lineHeight: 1.65 }}>
          <strong>Tip:</strong> Focus on meaning first. Then check whether the sentence describes a location or a destination before choosing Dativ or Akkusativ.
        </div>
      </Section>

      <Section eyebrow="A small note for now" title="mit, bei und zu">
        <p><strong>mit, bei and zu are dative prepositions, not two-way prepositions.</strong> After them, put the noun phrase (including its article) into the dative. There is no Wo?/Wohin? case choice.</p>
        <p>mit <strong>dem Bus</strong> (by bus) · bei <strong>der Arbeit</strong> (at work) · zu <strong>dem Arzt</strong> (to the doctor)</p>
        <p>You will study dative prepositions in more detail in A2. For now, just remember: mit, bei, zu → Dativ.</p>
      </Section>

      <section style={{ ...card, background: "#172554", color: "#fff" }}>
        <h2 style={{ margin: 0 }}>Ready for Chapter 12.1?</h2>
        <p style={{ margin: 0, color: "#dbeafe", lineHeight: 1.65 }}>
          Before opening the workbook, make sure you can explain the difference between <strong>Wo?</strong> and <strong>Wohin?</strong> in one sentence and form at least two example pairs yourself.
        </p>
        <a href={workbookHref} style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none", background: "#fff", color: "#172554", borderColor: "#fff" }}>
          Continue to the tutor-marked workbook
        </a>
      </section>
    </main>
  );
};

export default TwoCasePrepositionsPageLegacy;
