import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

// A1-12.1 grammar notes. Also used inside the tutor workbook Grammar tab.
// This is an ungraded practice lesson; the workbook's canonical questions,
 // answer keys, draft state and Review & Submit flow live elsewhere.
const palette = {
  subject: { color: "#166534", background: "#dcfce7", label: "Subject · Nominativ" },
  verb: { color: "#334155", background: "#e2e8f0", label: "Verb" },
  object: { color: "#9f1239", background: "#ffe4e6", label: "Akkusativ object" },
  preposition: { color: "#6d28d9", background: "#ede9fe", label: "Preposition" },
  accusative: { color: "#9f1239", background: "#ffe4e6", label: "Akkusativ phrase" },
  dative: { color: "#1d4ed8", background: "#dbeafe", label: "Dativ phrase" },
};

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: "clamp(16px, 3vw, 24px)",
};

const Section = ({ number, title, eyebrow, children }) => (
  <section style={card}>
    <div style={{ display: "grid", gap: 5 }}>
      <span style={{ color: "#475569", fontSize: 12, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" }}>
        {number ? "Step " + number + " · " : ""}{eyebrow}
      </span>
      <h2 style={{ margin: 0, fontSize: "clamp(20px, 3vw, 24px)" }}>{title}</h2>
    </div>
    {children}
  </section>
);

const Role = ({ kind, children }) => (
  <span
    style={{
      color: palette[kind].color,
      background: palette[kind].background,
      padding: "4px 7px",
      borderRadius: 7,
      display: "inline-block",
      fontWeight: 800,
      lineHeight: 1.65,
    }}
  >
    {children}
  </span>
);

const Sentence = ({ parts, english }) => (
  <div style={{ display: "grid", gap: 5 }}>
    <div lang="de" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 5, lineHeight: 1.8, fontSize: 17 }}>
      {parts.map(([kind, word], i) => (
        <Role key={i} kind={kind}>{word}</Role>
      ))}
    </div>
    <span style={{ color: "#475569", fontSize: 14 }}>{english}</span>
  </div>
);

const Table = ({ headings, rows, label }) => (
  <div style={{ overflowX: "auto" }}>
    <table aria-label={label} style={{ borderCollapse: "collapse", minWidth: 510, width: "100%" }}>
      <thead>
        <tr style={{ background: "#f1f5f9" }}>
          {headings.map((heading) => (
            <th key={heading} scope="col" style={{ border: "1px solid #cbd5e1", padding: 10, textAlign: "left" }}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((value, j) => (
              <td key={j} style={{ border: "1px solid #e2e8f0", padding: 10, fontWeight: j === 0 ? 750 : 500 }}>
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const twoWayPrepositions = [
  ["an", "at / on (a vertical surface or edge)"],
  ["auf", "on / onto (a surface)"],
  ["hinter", "behind"],
  ["in", "in / into"],
  ["neben", "next to"],
  ["über", "over / above"],
  ["unter", "under / below"],
  ["vor", "in front of / before"],
  ["zwischen", "between"],
];

const definiteArticles = [
  ["Masculine (der)", "der", "den", "dem"],
  ["Feminine (die)", "die", "die", "der"],
  ["Neuter (das)", "das", "das", "dem"],
  ["Plural (die)", "die", "die", "den"],
];

const indefiniteArticles = [
  ["Masculine", "ein", "einen", "einem"],
  ["Feminine", "eine", "eine", "einer"],
  ["Neuter", "ein", "ein", "einem"],
];

const quiz = [
  {
    prompt: "Ich lege das Handy auf ___ Tisch.",
    options: ["den", "dem", "der"],
    answer: "den",
    explanation: "Wohin? The phone is being placed onto the table. Auf takes Akkusativ for a destination: auf den Tisch.",
  },
  {
    prompt: "Das Handy liegt auf ___ Tisch.",
    options: ["den", "dem", "das"],
    answer: "dem",
    explanation: "Wo? The phone is already on the table. Auf takes Dativ for a location: auf dem Tisch.",
  },
  {
    prompt: "Ich fahre mit ___ Bus.",
    options: ["den", "der", "dem"],
    answer: "dem",
    explanation: "Mit always requires Dativ, even when travelling involves movement: mit dem Bus.",
  },
  {
    prompt: "Ich gehe in ___ Küche.",
    options: ["die", "der", "dem"],
    answer: "die",
    explanation: "Wohin? The kitchen is the destination. In takes Akkusativ, and feminine die stays die.",
  },
  {
    prompt: "Ich bin in ___ Küche.",
    options: ["die", "der", "den"],
    answer: "der",
    explanation: "Wo? The kitchen is a location. In takes Dativ; die Küche becomes in der Küche.",
  },
  {
    prompt: "Ich sehe ___ Hund neben ___ Auto.",
    options: ["der / dem", "den / dem", "dem / das"],
    answer: "den / dem",
    explanation: "Sehen takes an Akkusativ object (den Hund). Neben describes the dog's location and takes Dativ (dem Auto).",
  },
  {
    prompt: "Ich laufe ___ Park. (I run inside the park.)",
    options: ["in den", "im", "ins"],
    answer: "im",
    explanation: "The action happens inside the park (Wo?), even though laufen means to run. In dem = im: Dativ.",
  },
  {
    prompt: "Ich gehe zu ___ Arzt.",
    options: ["den", "dem", "der"],
    answer: "dem",
    explanation: "Zu always requires Dativ, even for a destination. Zu dem is commonly shortened to zum.",
  },
  {
    prompt: "Ich stelle den Stuhl zwischen ___ Tische.",
    options: ["die", "den", "dem"],
    answer: "die",
    explanation: "The chair is placed in a destination (Wohin?). Zwischen takes plural Akkusativ: die Tische.",
  },
  {
    prompt: "Der Stuhl steht zwischen ___ Tischen.",
    options: ["die", "den", "dem"],
    answer: "den",
    explanation: "Wo? Zwischen takes Dativ for the chair's position: den Tischen. Dative plural usually adds -n to the noun.",
  },
];

const prepositionTypes = [
  {
    title: "Always Akkusativ",
    description: "These prepositions always require an Akkusativ noun phrase.",
    words: "durch (through) · für (for) · gegen (against) · ohne (without) · um (around)",
    color: "#9f1239",
    background: "#fff1f2",
  },
  {
    title: "Always Dativ",
    description: "These prepositions always require a Dativ noun phrase.",
    words: "mit (with) · bei (at/with) · zu (to) · aus (from/out of) · von (from/of) · nach (to/after) · seit (since/for)",
    color: "#1d4ed8",
    background: "#eff6ff",
  },
  {
    title: "Two-way (Wechselpräpositionen)",
    description: "These can require Akkusativ for a destination or Dativ for a location.",
    words: "an · auf · hinter · in · neben · über · unter · vor · zwischen",
    color: "#6d28d9",
    background: "#f5f3ff",
  },
];

export default function TwoCasePrepositionsPageLegacy() {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const score = useMemo(() => quiz.reduce((total, question, index) =>
    total + (answers[index] === question.answer ? 1 : 0), 0), [answers]);
  const allAnswered = quiz.every((_, index) => answers[index] !== undefined);
  const workbookHref = "/campus/course/two-case-prepositions-wechselpraepositionen-day-18?view=workbook&assignmentKey=A1-12.1&assignmentId=A1-12.1&level=A1";

  return (
    <main data-a1-day18-preposition-lesson="true" style={{ ...styles.container, display: "grid", gap: 16, maxWidth: 1080 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <a href={workbookHref} style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}>
          Open Chapter 12.1 workbook
        </a>
      </div>

      <header style={{ ...card, background: "linear-gradient(135deg, #f8fafc, #eef2ff)" }}>
        <span style={{ color: "#3730a3", fontSize: 13, fontWeight: 900 }}>A1 · Day 18 · Kapitel 12.1 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Wechselpräpositionen – Two-Way Prepositions</h1>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          You already know how verbs such as <strong>sein, werden, haben</strong> and <strong>sehen</strong>
          {" "}help you identify Nominativ and Akkusativ. Today you will learn that <strong>prepositions can also determine a German case.</strong>
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>Your goal: find the preposition, choose the correct case, and then choose the correct article.</p>
      </header>

      <Section number="1" eyebrow="Connect to your earlier lesson" title="What you already know">
        <p style={{ margin: 0 }}>You know that the subject normally uses Nominativ. Some verbs take an Akkusativ object; after <em>sein</em> and <em>werden</em>, a noun describing the subject is Nominativ.</p>
        <Sentence parts={[["subject", "Das"], ["verb", "ist"], ["subject", "der Mann."]]} english="That is the man. Sein connects the subject to its identity (Nominativ)." />
        <Sentence parts={[["subject", "Ich"], ["verb", "sehe"], ["object", "den Mann."]]} english="I see the man. Sehen takes an Akkusativ object." />
        <Sentence parts={[["subject", "Er"], ["verb", "wird"], ["subject", "ein Lehrer."]]} english="He becomes a teacher. Werden links the subject to its new identity." />
        <Sentence parts={[["subject", "Ich"], ["verb", "habe"], ["object", "einen Hund."]]} english="I have a dog. Haben takes an Akkusativ object." />
        <p style={{ margin: 0, fontWeight: 750 }}>New today: a preposition can choose the case of the noun phrase after it, even when the verb takes a different case elsewhere in the sentence.</p>
      </Section>

      <Section number="2" eyebrow="The new idea" title="What is a preposition?">
        <p style={{ margin: 0, lineHeight: 1.65 }}>
          A preposition is a small word such as <strong>in, on, under, with</strong> or <strong>to</strong>.
          In German, prepositions help describe places, directions and relationships. Learn these three groups:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
          {prepositionTypes.map((group) => (
            <div key={group.title} style={{ border: "1px solid #e2e8f0", borderRadius: 13, padding: 14, background: group.background, display: "grid", gap: 6 }}>
              <strong style={{ color: group.color }}>{group.title}</strong>
              <span>{group.description}</span>
              <span style={{ lineHeight: 1.6, fontSize: 14 }}>{group.words}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, color: "#475569" }}>Today we focus on the third group: the nine <strong>Wechselpräpositionen</strong> (two-way prepositions). These are prepositions, not verbs.</p>
      </Section>

      <Section number="3" eyebrow="Core vocabulary" title="The nine two-way prepositions and their English meanings">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
          {twoWayPrepositions.map(([word, meaning]) => (
            <div key={word} style={{ border: "1px solid #ddd6fe", background: "#faf5ff", borderRadius: 12, padding: 12 }}>
              <strong style={{ color: "#6d28d9", fontSize: 19 }}>{word}</strong>
              <div style={{ color: "#475569", marginTop: 4 }}>{meaning}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section number="4" eyebrow="Before choosing a case" title="Learn the Akkusativ and Dativ articles">
        <p style={{ margin: 0 }}>First identify the noun's gender (der, die, das) or plural form. Then choose the article for the case.</p>
        <h3 style={{ margin: 0 }}>Definite articles – “the”</h3>
        <Table label="Definite articles by grammatical case" headings={["Gender / number", "Nominativ", "Akkusativ", "Dativ"]} rows={definiteArticles} />
        <h3 style={{ margin: 0 }}>Indefinite articles – “a / an”</h3>
        <Table label="Indefinite articles by grammatical case" headings={["Gender", "Nominativ", "Akkusativ", "Dativ"]} rows={indefiniteArticles} />
        <div style={{ borderLeft: "4px solid #2563eb", borderRadius: 10, background: "#eff6ff", padding: 12, display: "grid", gap: 5 }}>
          <strong>Remember: der Tisch → den Tisch (Akkusativ) / dem Tisch (Dativ)</strong>
          <span>Dativ plural usually uses <strong>den</strong> and adds <strong>-n</strong> to the noun when possible: mit den Kindern. There is no normal plural form of <em>ein</em>.</span>
          <span>Useful short forms: <strong>im = in dem</strong>, <strong>ins = in das</strong>, <strong>am = an dem</strong>, <strong>ans = an das</strong>.</span>
        </div>
      </Section>

      <Section number="5" eyebrow="The decision rule" title="First find the preposition. Then ask: Wo or Wohin?">
        <p style={{ margin: 0 }}>This question applies when the preposition is one of the <strong>nine two-way prepositions</strong>.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))", gap: 12 }}>
          <div style={{ background: "#fff1f2", border: "1px solid #fda4af", borderRadius: 14, padding: 15, display: "grid", gap: 8 }}>
            <strong style={{ color: "#9f1239" }}>Wohin? (Where to?) → Akkusativ</strong>
            <span>There is a destination or change of location.</span>
            <span role="img" aria-label="Book moving onto a table">📖 ➜ 🪑</span>
            <Sentence parts={[["subject", "Ich"], ["verb", "lege"], ["object", "das Buch"], ["preposition", "auf"], ["accusative", "den Tisch."]]} english="I put the book onto the table." />
            <span><strong>auf den Tisch</strong> tells us the destination of the book.</span>
          </div>
          <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 14, padding: 15, display: "grid", gap: 8 }}>
            <strong style={{ color: "#1d4ed8" }}>Wo? (Where?) → Dativ</strong>
            <span>There is a location or position, not a destination.</span>
            <span role="img" aria-label="Book resting on a table">📖 🪑</span>
            <Sentence parts={[["subject", "Das Buch"], ["verb", "liegt"], ["preposition", "auf"], ["dative", "dem Tisch."]]} english="The book is lying on the table." />
            <span><strong>auf dem Tisch</strong> tells us where the book is.</span>
          </div>
        </div>
        <div style={{ borderLeft: "4px solid #d97706", background: "#fffbeb", borderRadius: 10, padding: 12, display: "grid", gap: 7 }}>
          <strong>Important: movement alone does not always mean Akkusativ!</strong>
          <p style={{ margin: 0 }}><strong>Ich laufe im Park.</strong> = I run in the park (Wo? → Dativ).</p>
          <p style={{ margin: 0 }}><strong>Ich laufe in den Park.</strong> = I run into the park (Wohin? → Akkusativ).</p>
          <span>Ask whether the prepositional phrase describes <strong>where an action happens</strong> or <strong>where someone/something is going</strong>.</span>
        </div>
      </Section>

      <Section number="6" eyebrow="Colour-coded examples" title="Verbs and prepositions can control different parts of the same sentence">
        <p style={{ margin: 0 }}>Use the colours and the labels. The noun after the verb and the noun after the preposition may have different cases.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {["subject", "verb", "object", "preposition", "dative"].map((kind) => (
            <span key={kind} style={{ color: palette[kind].color, background: palette[kind].background, padding: "5px 9px", borderRadius: 8, fontWeight: 750, fontSize: 13 }}>{palette[kind].label}</span>
          ))}
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, display: "grid", gap: 9 }}>
          <strong>Example A · Verb + Akkusativ object + destination</strong>
          <Sentence parts={[["subject", "Ich"], ["verb", "lege"], ["object", "das Buch"], ["preposition", "auf"], ["accusative", "den Tisch."]]} english="I put the book onto the table." />
          <span><em>legen</em> takes a direct object (<strong>das Buch</strong>). <em>auf</em> introduces the destination (<strong>den Tisch</strong>).</span>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, display: "grid", gap: 9 }}>
          <strong>Example B · Akkusativ object + Dativ location</strong>
          <Sentence parts={[["subject", "Ich"], ["verb", "sehe"], ["object", "den Mann"], ["preposition", "in"], ["dative", "dem Park."]]} english="I see the man in the park." />
          <span><em>sehen</em> requires <strong>den Mann</strong> (Akkusativ). <em>in</em> describes where the man is, so we say <strong>dem Park</strong> (Dativ).</span>
          <strong>A single German sentence can contain both Akkusativ and Dativ.</strong>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, display: "grid", gap: 9 }}>
          <strong>Example C · No direct object needed</strong>
          <Sentence parts={[["subject", "Ich"], ["verb", "gehe"], ["preposition", "in"], ["accusative", "die Schule."]]} english="I go into the school / I go to school." />
          <span>Here <em>in die Schule</em> identifies the destination. There is no separate direct object between the verb and the preposition.</span>
        </div>
        <p style={{ margin: 0, fontWeight: 750 }}>Useful starter pattern: Subject + Verb + (Object, if needed) + Preposition + German case phrase.</p>
        <p style={{ margin: 0, color: "#475569" }}>This is a learning pattern, not a fixed word order for every German sentence. First inspect the verb and the preposition separately.</p>
      </Section>

      <Section number="7" eyebrow="Compare locations and destinations" title="More examples with the same preposition">
        <Table
          label="Two-way preposition example pairs"
          headings={["Preposition", "Wohin? · Akkusativ", "Wo? · Dativ"]}
          rows={[
            ["in", "Ich gehe in die Schule. (I go to school.)", "Ich bin in der Schule. (I am at school.)"],
            ["an", "Ich hänge das Bild an die Wand. (I hang the picture on the wall.)", "Das Bild hängt an der Wand. (The picture hangs on the wall.)"],
            ["unter", "Der Hund läuft unter den Tisch. (The dog runs under the table.)", "Der Hund liegt unter dem Tisch. (The dog lies under the table.)"],
            ["zwischen", "Ich stelle den Stuhl zwischen die Tische. (I put the chair between the tables.)", "Der Stuhl steht zwischen den Tischen. (The chair stands between the tables.)"],
          ]}
        />
        <p style={{ margin: 0 }}>Verb pairs to recognise: <strong>legen / liegen</strong> (put down / lie), <strong>stellen / stehen</strong> (put upright / stand), <strong>setzen / sitzen</strong> (seat / sit).</p>
      </Section>

      <Section number="8" eyebrow="Brief introduction" title="Mit, bei and zu: always Dativ">
        <p style={{ margin: 0 }}>These are <strong>not</strong> two-way prepositions. With <strong>mit (with), bei (at/with), zu (to)</strong>, the article after the preposition must be Dativ — even when someone is travelling.</p>
        <Sentence parts={[["subject", "Ich"], ["verb", "spiele"], ["preposition", "mit"], ["dative", "dem Kind."]]} english="I play with the child." />
        <Sentence parts={[["subject", "Ich"], ["verb", "bin"], ["preposition", "bei"], ["dative", "meiner Mutter."]]} english="I am at my mother's place." />
        <Sentence parts={[["subject", "Ich"], ["verb", "gehe"], ["preposition", "zu"], ["dative", "dem Arzt."]]} english="I am going to the doctor." />
        <p style={{ margin: 0 }}><strong>zu dem = zum</strong> and <strong>zu der = zur</strong>. Remember: <strong>mit, bei, zu → Dativ</strong>. Do not apply the Wo?/Wohin? case choice to these fixed-Dativ prepositions.</p>
      </Section>

      <Section number="9" eyebrow="Self-check · Ungraded practice" title="Test yourself: choose the correct article">
        <p style={{ margin: 0 }}>Read each sentence. First identify its preposition, then its case, and finally its article. Your answers here do not affect your tutor-marked assignment.</p>
        <div role="status" aria-live="polite" style={{ color: "#475569", fontWeight: 750 }}>
          {Object.keys(answers).length} of {quiz.length} answered
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {quiz.map((question, index) => (
            <fieldset key={question.prompt} style={{ border: "1px solid #e2e8f0", borderRadius: 12, margin: 0, padding: 13, minWidth: 0, display: "grid", gap: 8 }}>
              <legend style={{ padding: "0 4px", fontWeight: 800 }}>{index + 1}. {question.prompt}</legend>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {question.options.map((option) => (
                  <label key={option} style={{ display: "inline-flex", gap: 6, alignItems: "center", border: answers[index] === option ? "2px solid #2563eb" : "1px solid #cbd5e1", borderRadius: 9, padding: "8px 11px", cursor: "pointer", background: answers[index] === option ? "#eff6ff" : "#fff" }}>
                    <input
                      type="radio"
                      name={"a1-day18-q-" + index}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => { setAnswers((old) => ({ ...old, [index]: option })); setChecked(false); }}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {checked ? (
                <div role="status" style={{ background: answers[index] === question.answer ? "#f0fdf4" : "#fff1f2", color: answers[index] === question.answer ? "#166534" : "#9f1239", borderRadius: 9, padding: 10, lineHeight: 1.6 }}>
                  <strong>{answers[index] === question.answer ? "Correct." : "Correct answer: " + question.answer + "."}</strong> {question.explanation}
                </div>
              ) : null}
            </fieldset>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          <button type="button" disabled={!allAnswered} onClick={() => setChecked(true)} style={{ ...styles.primaryButton, opacity: allAnswered ? 1 : 0.55 }}>
            Check my answers
          </button>
          <button type="button" onClick={() => { setAnswers({}); setChecked(false); }} style={styles.secondaryButton}>
            Try again
          </button>
        </div>
        {checked ? (
          <div role="status" aria-live="polite" style={{ border: "1px solid #bfdbfe", borderRadius: 12, background: "#eff6ff", padding: 12 }}>
            <strong>{score}/{quiz.length} correct.</strong> {score === quiz.length ? "Excellent! You are ready for the workbook." : "Review the explanations and try again."}
          </div>
        ) : null}
      </Section>

      <Section number="10" eyebrow="Lesson summary" title="Four questions to ask before choosing an article">
        <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.85 }}>
          <li><strong>Who is the subject?</strong> The subject is normally Nominativ.</li>
          <li><strong>What verb is used?</strong> Does it require a particular object case, such as Akkusativ after sehen?</li>
          <li><strong>Is there a preposition?</strong> Is it always Akkusativ, always Dativ, or one of the nine two-way prepositions?</li>
          <li><strong>If it is two-way, is the phrase Wo or Wohin?</strong> Choose Dativ for a location, Akkusativ for a destination. Then check the noun's article.</li>
        </ol>
      </Section>
      <section style={{ ...card, background: "#172554", color: "#fff" }}>
        <h2 style={{ margin: 0 }}>Ready for Kapitel 12.1?</h2>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#dbeafe" }}>
          Review the coloured examples, then complete your separate tutor-marked Lesen and Hören activities. This practice quiz is not your graded submission.
        </p>
        <a href={workbookHref} style={{ ...styles.primaryButton, width: "fit-content", background: "#fff", color: "#172554", borderColor: "#fff", textDecoration: "none" }}>
          Continue to the tutor-marked workbook
        </a>
      </section>
    </main>
  );
}
