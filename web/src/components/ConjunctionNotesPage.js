import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const HERO_IMAGE_URL = "/falo.png";

const keyTakeaways = [
  "Denn joins two main clauses and keeps the verb order the same.",
  "Weil sends the conjugated verb to the end of the clause.",
  "Deshalb is usually placed in position 1, and the conjugated verb stays in position 2.",
  "Use these structures to build clear, exam-ready sentences in letters and messages.",
];

const comparisonRows = [
  {
    name: "denn",
    type: "Coordinating conjunction",
    order: "Verb stays in position 2",
    example: "Ich gehe nicht ins Kino, denn ich habe keine Zeit.",
  },
  {
    name: "weil",
    type: "Subordinating conjunction",
    order: "Conjugated verb goes to the end",
    example: "Ich gehe nicht ins Kino, weil ich keine Zeit habe.",
  },
  {
    name: "deshalb",
    type: "Adverb / conjunctional adverb",
    order: "Verb stays in position 2",
    example: "Ich habe keine Zeit, deshalb gehe ich nicht ins Kino.",
  },
];

const practiceData = [
  {
    title: "1. Denn (because)",
    explanation:
      "Use denn to join two main clauses. The normal word order stays the same.",
    exercises: [
      {
        level: "A1 core",
        prompt:
          "Combine these two sentences with denn: Ich kann nicht kommen. Ich bin krank.",
        hint: "Main clause + , denn + subject + verb + ...",
        answer: "Ich kann nicht kommen, denn ich bin krank.",
      },
      {
        level: "A1 core",
        prompt:
          "Combine these two sentences with denn: Wir gehen heute ins Kino. Es gibt einen neuen Film.",
        hint: "Do not move the verb to the end.",
        answer: "Wir gehen heute ins Kino, denn es gibt einen neuen Film.",
      },
      {
        level: "A1+",
        prompt:
          "Combine these two sentences with denn: Sie bleibt zu Hause. Sie hat viel zu tun.",
        hint: "Keep normal main-clause order after denn.",
        answer: "Sie bleibt zu Hause, denn sie hat viel zu tun.",
      },
    ],
  },
  {
    title: "2. Weil (because)",
    explanation:
      "Use weil to introduce a subordinate clause. The conjugated verb goes to the end.",
    exercises: [
      {
        level: "A1 core",
        prompt:
          "Combine these two sentences with weil: Ich bleibe zu Hause. Ich bin müde.",
        hint: "After weil, put the conjugated verb at the end.",
        answer: "Ich bleibe zu Hause, weil ich müde bin.",
      },
      {
        level: "A1 core",
        prompt:
          "Combine these two sentences with weil: Er kommt später. Er muss noch arbeiten.",
        hint: "Watch the modal structure in the weil clause.",
        answer: "Er kommt später, weil er noch arbeiten muss.",
      },
      {
        level: "A1+",
        prompt:
          "Combine these two sentences with weil: Wir fahren nach Berlin. Wir wollen dort Freunde besuchen.",
        hint: "The conjugated verb goes at the end of the weil clause.",
        answer: "Wir fahren nach Berlin, weil wir dort Freunde besuchen wollen.",
      },
    ],
  },
  {
    title: "3. Deshalb (therefore)",
    explanation:
      "Deshalb often comes in position 1, so the conjugated verb stays in position 2.",
    exercises: [
      {
        level: "A1 core",
        prompt:
          "Combine these two sentences with deshalb: Es regnet. Wir bleiben drinnen.",
        hint: "After deshalb, the verb comes before the subject.",
        answer: "Es regnet, deshalb bleiben wir drinnen.",
      },
      {
        level: "A1 core",
        prompt:
          "Combine these two sentences with deshalb: Sie ist sehr beschäftigt. Sie kann nicht kommen.",
        hint: "Use deshalb to show the result.",
        answer: "Sie ist sehr beschäftigt, deshalb kann sie nicht kommen.",
      },
      {
        level: "A1+",
        prompt:
          "Combine these two sentences with deshalb: Ich habe die Prüfung bestanden. Ich bin sehr glücklich.",
        hint: "Deshalb introduces the result clause.",
        answer: "Ich habe die Prüfung bestanden, deshalb bin ich sehr glücklich.",
      },
    ],
  },
];

const revisionChallenges = [
  {
    title: "1) Task",
    prompt: "Write a sentence saying that you live in Berlin.",
    hint: "Start with: Ich ...",
    answer: "Ich wohne in Berlin.",
  },
  {
    title: "2) Task",
    prompt: "Write a sentence saying that you want to learn German today.",
    hint: "Use the modal verb: möchten",
    answer: "Ich möchte heute Deutsch lernen.",
  },
  {
    title: "3) Task",
    prompt: "Ask where the language school is.",
    hint: "Use a W-question with: wo",
    answer: "Wo ist die Sprachschule?",
  },
  {
    title: "4) Task",
    prompt: "Ask if your friend is coming tomorrow.",
    hint: "Use a yes/no question",
    answer: "Kommt dein Freund morgen?",
  },
  {
    title: "5) Task",
    prompt: "Write that you are staying home because you are tired.",
    hint: "Use: weil",
    answer: "Ich bleibe zu Hause, weil ich müde bin.",
  },
  {
    title: "6) Task",
    prompt:
      "Write two short correct sentences about your study day. Use correct capitalization, verb position, and punctuation.",
    hint: "Example topic: learning German and writing an email",
    answer:
      "Heute lerne ich Deutsch. Danach schreibe ich eine E-Mail an meinen Lehrer.",
  },
];

const examGuidance = [
  "If you are preparing for A1 exams, go to the Exam Room and make a clear plan with daily sentence practice.",
  "If you are preparing for A2 exams, review letter-writing concepts and important grammar points to keep progressing.",
  "Wishing you success in your German learning journey — keep going!",
];

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const Section = ({ title, children }) => (
  <section style={sectionStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item, index) => (
      <li key={`${index}-${item}`}>{item}</li>
    ))}
  </ul>
);

const Callout = ({ children }) => (
  <div
    style={{
      background: "#f4f6ff",
      borderLeft: "4px solid #5666f4",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 14,
      display: "grid",
      gap: 4,
    }}
  >
    {children}
  </div>
);

const ChallengeCard = ({ title, prompt, hint, answer, level }) => (
  <div
    style={{
      border: "1px solid #e6e8ef",
      borderRadius: 12,
      padding: 12,
      display: "grid",
      gap: 8,
      background: "#fbfbfd",
    }}
  >
    {title && <strong>{title}</strong>}
    {level && (
      <span
        style={{
          width: "fit-content",
          fontSize: 12,
          fontWeight: 600,
          padding: "4px 8px",
          borderRadius: 999,
          background: "#eef2ff",
          color: "#3f51d6",
        }}
      >
        {level}
      </span>
    )}

    <span style={{ color: "#1f2430" }}>{prompt}</span>

    <div
      style={{
        fontSize: 14,
        color: "#4f5565",
        background: "#f7f8fb",
        borderRadius: 8,
        padding: "8px 10px",
      }}
    >
      <strong>Hint:</strong> {hint}
    </div>

    <details>
      <summary style={{ cursor: "pointer", fontWeight: 600 }}>
        Reveal answer
      </summary>
      <p style={{ margin: "8px 0 0" }}>{answer}</p>
    </details>
  </div>
);

const PracticeSectionBlock = ({ title, explanation, exercises }) => (
  <div style={{ display: "grid", gap: 12 }}>
    <h3 style={{ margin: 0 }}>{title}</h3>

    <Callout>
      <strong>Focus:</strong> {explanation}
    </Callout>

    <div style={{ display: "grid", gap: 10 }}>
      {exercises.map((exercise, index) => (
        <ChallengeCard
          key={`${title}-${index}`}
          level={exercise.level}
          prompt={exercise.prompt}
          hint={exercise.hint}
          answer={exercise.answer}
        />
      ))}
    </div>
  </div>
);

const ConjunctionNotesPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 10 }}>
        <button
          type="button"
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        {/* Hero image */}
        <div style={{ display: "grid", gap: 6 }}>
          <img
            src={HERO_IMAGE_URL}
            alt="Notebook and study desk"
            loading="lazy"
            style={{
              width: "100%",
              height: 190,
              objectFit: "cover",
              borderRadius: 12,
              border: "1px solid #e6e8ef",
            }}
          />
          <span style={{ fontSize: 12, color: "#6b7280" }}>Image: Falowen</span>
        </div>

        <h1 style={{ ...styles.title, margin: 0 }}>
          Conjunctions in A1 German Letters
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Use these notes to connect sentences clearly and politely when writing
          letters.
        </p>
      </div>

      <Section title="Key Takeaways">
        <BulletList items={keyTakeaways} />
      </Section>

      <Section title="Introduction to Conjunctions">
        <p style={{ margin: 0 }}>
          Conjunctions connect clauses or sentences to make your writing clearer,
          more coherent, and smoother to read. In A1 German, common connectors for
          letters and short messages include <em>denn</em>, <em>weil</em>, and{" "}
          <em>deshalb</em>.
        </p>
      </Section>

      <Section title="Conjunctions and Their Usage">
        <h3 style={{ margin: 0 }}>1. Denn (because)</h3>
        <Callout>
          <strong>Word order:</strong> Verb stays in position 2 — <em>denn</em>{" "}
          does not change normal main-clause word order.
        </Callout>
        <BulletList
          items={[
            "Rule → Coordinating conjunction; verb order stays the same.",
            "Structure → Main clause + , denn + subject + verb + ...",
            "Example → Ich schreibe dir, denn ich habe gute Nachrichten.",
            "Letter example → Ich komme heute nicht, denn ich bin krank.",
          ]}
        />

        <h3 style={{ margin: 0 }}>2. Weil (because)</h3>
        <Callout>
          <strong>Word order:</strong> After <em>weil</em>, the conjugated verb
          goes to the end.
        </Callout>
        <BulletList
          items={[
            "Rule → Subordinating conjunction; the conjugated verb moves to the end.",
            "Structure → Main clause + , weil + subject + ... + verb.",
            "Example → Ich schreibe dir, weil ich gute Nachrichten habe.",
            "Example with modal → Ich gehe nach Hause, weil ich schlafen möchte.",
            "Letter example → Ich kann heute nicht kommen, weil ich krank bin.",
          ]}
        />

        <h3 style={{ margin: 0 }}>3. Deshalb (therefore)</h3>
        <Callout>
          <strong>Word order:</strong> If <em>deshalb</em> is in the first
          position, the conjugated verb stays in position 2.
        </Callout>
        <BulletList
          items={[
            "Rule → Adverb / conjunctional adverb; it connects ideas across clauses.",
            "Structure → Main clause + , deshalb + verb + subject + ...",
            "Example → Ich habe gute Nachrichten, deshalb schreibe ich dir.",
            "Letter example → Ich bin müde, deshalb schreibe ich die E-Mail später.",
          ]}
        />
      </Section>

      <Section title="Quick Comparison: denn, weil, deshalb">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <caption
              style={{
                textAlign: "left",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Comparison of denn, weil, and deshalb
            </caption>
            <thead>
              <tr>
                {["Conjunction", "Type", "Word order", "Example"].map(
                  (header) => (
                    <th
                      key={header}
                      scope="col"
                      style={{
                        textAlign: "left",
                        padding: "8px 10px",
                        borderBottom: "2px solid #e6e8ef",
                        background: "#f7f8fb",
                      }}
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.name}>
                  {[row.name, row.type, row.order, row.example].map(
                    (cell, index) => (
                      <td
                        key={`${row.name}-${index}`}
                        style={{
                          padding: "8px 10px",
                          borderBottom: "1px solid #e6e8ef",
                          verticalAlign: "top",
                        }}
                      >
                        {cell}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Practice Exercise: Build the Sentences Yourself">
        <p style={{ margin: 0 }}>
          Read each task carefully and try to form the sentence on your own
          before opening the answer.
        </p>

        <Callout>
          <strong>How to practise well:</strong>
          <BulletList
            items={[
              "Read the prompt slowly.",
              "Say the sentence aloud first.",
              "Use the hint only if needed.",
              "Open the answer only after your attempt.",
            ]}
          />
        </Callout>

        <div style={{ display: "grid", gap: 16 }}>
          {practiceData.map((block, index) => (
            <PracticeSectionBlock
              key={`${block.title}-${index}`}
              title={block.title}
              explanation={block.explanation}
              exercises={block.exercises}
            />
          ))}
        </div>
      </Section>

      <Section title="Final Revision: Sentence Formulation Check">
        {/* UPDATED TEXT (your requested replacement) */}
        <p style={{ margin: 0 }}>
          Congratulations on completing the course! If you’re preparing for the A1
          exams, head to the Exam Room and make a clear plan for what to practise
          each day until you write the exams. If you want to progress to A2, make
          sure you understand the concepts of building statements in German,
          writing letters, and related basics — this will give you a solid
          foundation.
        </p>

        <Callout>
          <strong>How to use this section:</strong>
          <BulletList
            items={[
              "Read the task carefully.",
              "Say or write your own answer first.",
              "Check the hint only if you need support.",
              "Open the answer only after you try it yourself.",
            ]}
          />
        </Callout>

        <div style={{ display: "grid", gap: 10 }}>
          {revisionChallenges.map((item, index) => (
            <ChallengeCard
              key={`${item.title}-${index}`}
              title={item.title}
              prompt={item.prompt}
              hint={item.hint}
              answer={item.answer}
            />
          ))}
        </div>

        <Callout>
          <strong>Exam path guidance:</strong>
          <BulletList items={examGuidance} />
        </Callout>
      </Section>
    </main>
  );
};

export default ConjunctionNotesPage;
