import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 11 };
const paragraph = { margin: 0, lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, display: "grid", gap: 7, lineHeight: 1.7 };
const formula = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 12,
  padding: 12,
  lineHeight: 1.7,
};
const note = {
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
  borderRadius: 12,
  padding: 12,
  lineHeight: 1.7,
};
const warning = {
  border: "1px solid #fde68a",
  background: "#fffbeb",
  borderRadius: 12,
  padding: 12,
  lineHeight: 1.7,
};
const tableWrap = { width: "100%", overflowX: "auto" };
const table = { width: "100%", minWidth: 560, borderCollapse: "collapse" };
const cell = {
  border: "1px solid #dbe3ef",
  padding: "9px 10px",
  textAlign: "left",
  verticalAlign: "top",
};

const Section = ({ title, children }) => (
  <section style={card}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const lesson = {
  title: "Knowledge Test · Relativsätze",
  english:
    "Choose the relative pronoun by checking two things: the noun's gender/number and the pronoun's job inside the relative clause.",
  rule:
    "Nominative: der / die / das / die. Accusative: den / die / das / die. Put a comma before the relative clause and the conjugated verb at the end.",
  examples: [
    "Der Vermieter, der im Haus wohnt, ist freundlich.",
    "Der Vermieter, den ich anrufe, ist freundlich.",
    "Ich suche eine Wohnung, die einen Balkon hat.",
    "Das Zimmer, das wir besichtigen, ist sehr hell.",
  ],
  commonMistake:
    "Do not choose the relative pronoun only from the noun's article. First identify the noun, then ask whether the relative pronoun is the subject or object inside the relative clause.",
  questions: [
    {
      stem: "Der Vermieter, ___ im Haus wohnt, ist freundlich.",
      options: ["der", "den", "das"],
      answer: 0,
      explanation: "der Vermieter is masculine, and the pronoun is the subject of wohnt → nominative der.",
    },
    {
      stem: "Der Vermieter, ___ ich heute anrufe, ist freundlich.",
      options: ["der", "den", "die"],
      answer: 1,
      explanation: "der Vermieter is masculine, but ich is the subject and the landlord is the object of anrufen → accusative den.",
    },
    {
      stem: "Ich suche eine Wohnung, ___ einen Balkon hat.",
      options: ["der", "die", "das"],
      answer: 1,
      explanation: "die Wohnung is feminine and is the subject of hat → die.",
    },
    {
      stem: "Welche Wortstellung ist richtig?",
      options: [
        "die einen Balkon hat",
        "die hat einen Balkon",
        "die einen Balkon haben",
      ],
      answer: 0,
      explanation: "The conjugated verb goes to the end of the relative clause.",
    },
    {
      stem: "Das Zimmer, ___ wir morgen besichtigen, ist günstig.",
      options: ["der", "die", "das"],
      answer: 2,
      explanation: "das Zimmer is neuter. In the accusative, neuter stays das.",
    },
  ],
  outputPrompt:
    "Beschreibe eine Wohnung oder ein Haus in 4–5 Sätzen. Benutze mindestens zwei Relativsätze, davon wenn möglich einen mit Nominativ und einen mit Akkusativ.",
  starters: [
    "Ich suche eine Wohnung, die ...",
    "Das ist ein Zimmer, das ...",
    "Der Vermieter, der ...",
    "Der Vermieter, den ich ...",
  ],
};

const GrammarContent = () => (
  <div data-a2-day7-relative-clause-notes="true" style={{ display: "grid", gap: 16 }}>
    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>A2 · 3.7 · Grammatik</span>
      <h1 style={{ margin: 0 }}>Relativsätze · Eine Wohnung suchen</h1>
      <p style={paragraph}>
        A <strong>relative clause</strong> gives extra information about a noun without starting a completely new sentence.
        In German, it begins with a <strong>relative pronoun</strong> such as <strong>der, die, das</strong> or <strong>den</strong>.
      </p>
      <div style={formula}>
        Ich suche eine Wohnung. Die Wohnung hat einen Balkon.<br />
        → Ich suche eine Wohnung, <strong>die einen Balkon hat</strong>.
      </div>
    </header>

    <Section title="1. Was ist ein Relativsatz?">
      <p style={paragraph}>
        A relative clause describes a person or thing that has already been mentioned.
        The noun before the relative clause is called the <strong>Bezugswort</strong> (the noun you are describing).
      </p>
      <ul style={list}>
        <li><strong>die Wohnung</strong> → Ich suche eine Wohnung, <strong>die</strong> ruhig ist.</li>
        <li><strong>der Vermieter</strong> → Das ist der Vermieter, <strong>der</strong> im Haus wohnt.</li>
        <li><strong>das Zimmer</strong> → Das ist das Zimmer, <strong>das</strong> einen Balkon hat.</li>
        <li><strong>die Nachbarn</strong> → Die Nachbarn, <strong>die</strong> hier wohnen, sind freundlich.</li>
      </ul>
    </Section>

    <Section title="2. Zwei Entscheidungen: Genus + Kasus">
      <p style={paragraph}>
        To choose the correct relative pronoun, check <strong>two things</strong>.
      </p>
      <ol style={list}>
        <li>
          <strong>Which noun are you describing?</strong> This gives you the gender and number:
          der Vermieter, die Wohnung, das Zimmer, die Nachbarn.
        </li>
        <li>
          <strong>What job does the relative pronoun have inside the relative clause?</strong>
          Is it the subject (<strong>Nominativ</strong>) or the direct object (<strong>Akkusativ</strong>)?
        </li>
      </ol>
      <div style={note}>
        <strong>Important:</strong> The noun gives the gender/number, but the relative clause decides the case.
      </div>
    </Section>

    <Section title="3. Relativpronomen · Nominativ und Akkusativ">
      <div style={tableWrap}>
        <table style={table}>
          <thead>
            <tr>
              <th style={cell}>Noun</th>
              <th style={cell}>Nominativ</th>
              <th style={cell}>Akkusativ</th>
              <th style={cell}>Apartment example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cell}><strong>der</strong> Vermieter / Balkon</td>
              <td style={cell}><strong>der</strong></td>
              <td style={cell}><strong>den</strong></td>
              <td style={cell}>Der Vermieter, <strong>den</strong> ich anrufe, ist nett.</td>
            </tr>
            <tr>
              <td style={cell}><strong>die</strong> Wohnung</td>
              <td style={cell}><strong>die</strong></td>
              <td style={cell}><strong>die</strong></td>
              <td style={cell}>Die Wohnung, <strong>die</strong> ich suche, ist zentral.</td>
            </tr>
            <tr>
              <td style={cell}><strong>das</strong> Zimmer / Haus</td>
              <td style={cell}><strong>das</strong></td>
              <td style={cell}><strong>das</strong></td>
              <td style={cell}>Das Zimmer, <strong>das</strong> wir besichtigen, ist hell.</td>
            </tr>
            <tr>
              <td style={cell}><strong>die</strong> Nachbarn (Plural)</td>
              <td style={cell}><strong>die</strong></td>
              <td style={cell}><strong>die</strong></td>
              <td style={cell}>Die Nachbarn, <strong>die</strong> wir kennen, sind freundlich.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ ...paragraph, color: "#475569" }}>
        At this stage, focus on <strong>Nominativ and Akkusativ</strong>. Dative relative pronouns come later.
      </p>
    </Section>

    <Section title="4. Wie erkenne ich Nominativ oder Akkusativ?">
      <p style={paragraph}>
        Look only at the <strong>relative clause</strong> and ask: Who is doing the action?
      </p>

      <div style={formula}>
        <strong>Nominativ · the relative pronoun does the action</strong><br />
        Der Vermieter, <strong>der im Haus wohnt</strong>, ist freundlich.<br />
        Who lives in the house? → <strong>der Vermieter</strong>. Therefore: <strong>der</strong>.
      </div>

      <div style={formula}>
        <strong>Akkusativ · another subject does the action to the noun</strong><br />
        Der Vermieter, <strong>den ich anrufe</strong>, ist freundlich.<br />
        Who calls? → <strong>ich</strong>. Whom do I call? → <strong>den Vermieter</strong>. Therefore: <strong>den</strong>.
      </div>

      <p style={paragraph}>
        This difference is easiest to see with masculine nouns because <strong>der changes to den</strong>.
        With feminine, neuter and plural nouns, the nominative and accusative forms look the same.
      </p>
    </Section>

    <Section title="5. Wortstellung: Das Verb steht am Ende">
      <p style={paragraph}>
        A relative clause is a subordinate clause. Put a <strong>comma</strong> before it and move the conjugated verb to the <strong>end</strong>.
      </p>
      <ul style={list}>
        <li>Das ist die Wohnung, die sehr ruhig <strong>ist</strong>.</li>
        <li>Ich suche ein Haus, das einen Garten <strong>hat</strong>.</li>
        <li>Der Vermieter, den ich morgen <strong>anrufe</strong>, wohnt in Berlin.</li>
        <li>Das ist das Zimmer, das wir gestern <strong>besichtigt haben</strong>.</li>
      </ul>
      <div style={warning}>
        <strong>Not:</strong> Die Wohnung, die <strong>ist</strong> sehr ruhig.<br />
        <strong>Correct:</strong> Die Wohnung, die sehr ruhig <strong>ist</strong>.
      </div>
    </Section>

    <Section title="6. Zwei Sätze verbinden">
      <p style={paragraph}>
        Use this four-step method instead of guessing.
      </p>
      <ol style={list}>
        <li><strong>Start:</strong> Ich suche eine Wohnung. Die Wohnung hat einen Balkon.</li>
        <li><strong>Find the repeated noun:</strong> die Wohnung.</li>
        <li><strong>Replace the repeated noun:</strong> die → relative pronoun <strong>die</strong>.</li>
        <li><strong>Move the verb to the end:</strong> Ich suche eine Wohnung, <strong>die einen Balkon hat</strong>.</li>
      </ol>

      <div style={note}>
        <strong>Second example:</strong><br />
        Ich kenne den Vermieter. Ich rufe den Vermieter heute an.<br />
        → Ich kenne den Vermieter, <strong>den ich heute anrufe</strong>.
      </div>
    </Section>

    <Section title="7. Wohnung suchen · nützliche Beispiele">
      <ul style={list}>
        <li>Ich suche eine Wohnung, <strong>die nicht mehr als 800 Euro kostet</strong>.</li>
        <li>Ich möchte ein Zimmer, <strong>das viel Licht hat</strong>.</li>
        <li>Das Haus, <strong>das wir morgen besichtigen</strong>, liegt in einer ruhigen Straße.</li>
        <li>Der Vermieter, <strong>der uns die Wohnung zeigt</strong>, ist sehr freundlich.</li>
        <li>Der Makler, <strong>den ich gestern angerufen habe</strong>, schickt mir noch Fotos.</li>
        <li>Die Nachbarn, <strong>die im Erdgeschoss wohnen</strong>, haben zwei Kinder.</li>
      </ul>
    </Section>

    <Section title="8. Häufige Fehler">
      <ul style={list}>
        <li>
          <strong>Case ignored:</strong> Der Vermieter, <s>der</s> ich anrufe → Der Vermieter, <strong>den</strong> ich anrufe.
        </li>
        <li>
          <strong>Verb in position 2:</strong> die <s>ist sehr ruhig</s> → die sehr ruhig <strong>ist</strong>.
        </li>
        <li>
          <strong>No comma:</strong> Always separate the relative clause with a comma.
        </li>
        <li>
          <strong>New noun instead of pronoun:</strong> Do not repeat the full noun inside the relative clause.
        </li>
      </ul>
    </Section>

    <Section title="9. Merksatz">
      <div style={note}>
        <strong>Noun → gender/number. Relative clause → case. Verb → end.</strong><br />
        der Vermieter + subject → <strong>der</strong><br />
        der Vermieter + object → <strong>den</strong><br />
        die Wohnung → <strong>die</strong><br />
        das Zimmer → <strong>das</strong>
      </div>
    </Section>

    <A2MiniLearningBlock {...lesson} />
  </div>
);

export default function A2Day7RelativeClausesWohnungGrammarPage({ embedded = false }) {
  if (embedded) return <GrammarContent />;

  return (
    <main style={styles.pageWrap}>
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <GrammarContent />
      </div>
    </main>
  );
}
