import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 10 };
const paragraph = { margin: 0, lineHeight: 1.78 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };

const focusedLesson = {
  title: "Knowledge Test · Schul- und Arbeitsweg",
  english:
    "Use mit + dative for transport, zu + dative for many destinations, nach for cities and countries without an article, and the fixed phrase zu Fuß. Use weil with the conjugated verb at the end.",
  rule:
    "Transport: mit + Dativ. Destination: zu + Dativ for many places, nach for cities/countries without an article, and zu Fuß as a fixed phrase.",
  examples: [
    "Ich fahre mit dem Bus zur Arbeit.",
    "Sie fährt mit der Bahn zur Schule.",
    "Ich gehe zu Fuß zum Bahnhof.",
    "Wir fahren morgen nach Accra.",
  ],
  commonMistake:
    "Do not say mit die Bahn, mit Fuß or zu Berlin. Say mit der Bahn, zu Fuß and nach Berlin. After weil, put the conjugated verb at the end.",
  questions: [
    { stem: "Ich fahre ___ dem Bus zur Arbeit.", options: ["mit", "zu", "nach"], answer: 0, explanation: "Means of transport use mit + dative." },
    { stem: "Ich fahre mit ___ Bahn.", options: ["die", "der", "den"], answer: 1, explanation: "mit takes dative: die Bahn → der Bahn." },
    { stem: "Welcher Satz ist richtig?", options: ["Ich gehe mit Fuß.", "Ich gehe zu Fuß.", "Ich gehe nach Fuß."], answer: 1, explanation: "zu Fuß is a fixed expression." },
    { stem: "Wir fahren morgen ___ Berlin.", options: ["nach", "zu", "mit"], answer: 0, explanation: "Cities normally use nach." },
    { stem: "Ich fahre ___ Arbeit.", options: ["zur", "zum", "nach"], answer: 0, explanation: "die Arbeit → zu der Arbeit → zur Arbeit." },
    { stem: "Which weil-sentence is correct?", options: ["..., weil der Bus ist schnell.", "..., weil der Bus schnell ist.", "..., weil ist der Bus schnell."], answer: 1, explanation: "In a weil-clause, the conjugated verb goes to the end." },
  ],
  outputPrompt:
    "Beschreibe deinen Weg zur Schule oder Arbeit in 5–6 Sätzen. Nenne Verkehrsmittel, Dauer, Reihenfolge und einen Grund.",
  starters: [
    "Ich fahre/gehe ...",
    "Zuerst ...",
    "Dann ...",
    "Der Weg dauert ...",
    "Ich benutze ..., weil ...",
  ],
};

const GrammarContent = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <section style={card}>
      <h2 style={{ margin: 0 }}>Grammar Notes · Verkehrsmittel und Wege</h2>
      <p style={paragraph}>
        In this lesson you describe <strong>how you travel</strong>, <strong>where you are going</strong>,
        and <strong>how long the journey takes</strong>. The most important grammar is the difference
        between <strong>mit</strong>, <strong>zu</strong>, <strong>nach</strong> and <strong>zu Fuß</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>1. mit + Dativ for transport</h2>
      <p style={paragraph}>
        Use <strong>mit</strong> when you say which vehicle or means of transport you use.
        <strong> mit always takes the dative.</strong>
      </p>
      <ul style={list}>
        <li>Ich fahre <strong>mit dem Bus</strong> zur Arbeit.</li>
        <li>Sie fährt <strong>mit der Bahn</strong> zur Schule.</li>
        <li>Wir fahren <strong>mit dem Auto</strong> ins Zentrum.</li>
        <li>Er kommt <strong>mit dem Fahrrad</strong>.</li>
      </ul>
      <p style={paragraph}>
        <strong>Dative forms:</strong> der Bus → <strong>dem Bus</strong>, die Bahn → <strong>der Bahn</strong>,
        das Auto → <strong>dem Auto</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>2. zu + Dativ for people and many destinations</h2>
      <p style={paragraph}>
        Use <strong>zu</strong> when the destination is a person, an institution, or a common place.
        <strong> zu also takes the dative.</strong>
      </p>
      <ul style={list}>
        <li>Ich gehe <strong>zur Schule</strong>.</li>
        <li>Ich fahre <strong>zur Arbeit</strong>.</li>
        <li>Wir gehen <strong>zum Bahnhof</strong>.</li>
        <li>Sie fährt <strong>zum Arzt</strong>.</li>
      </ul>
      <p style={paragraph}>
        <strong>Contractions:</strong> zu + der = <strong>zur</strong>, zu + dem = <strong>zum</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>3. nach for cities and countries without an article</h2>
      <p style={paragraph}>
        Use <strong>nach</strong> with cities and most countries that do not use an article.
      </p>
      <ul style={list}>
        <li>Ich fahre morgen <strong>nach Accra</strong>.</li>
        <li>Wir fliegen <strong>nach Deutschland</strong>.</li>
        <li>Sie fährt am Wochenende <strong>nach Kumasi</strong>.</li>
      </ul>
      <p style={paragraph}>
        Do not use <strong>zu</strong> for a city in this meaning. Say <strong>nach Berlin</strong>, not <strong>zu Berlin</strong>.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>4. zu Fuß is a fixed expression</h2>
      <p style={paragraph}>
        When you walk, use the fixed phrase <strong>zu Fuß</strong>. Do not use <strong>mit Fuß</strong>.
      </p>
      <ul style={list}>
        <li>Ich gehe <strong>zu Fuß</strong> zur Schule.</li>
        <li>Vom Bahnhof gehe ich <strong>zu Fuß</strong> weiter.</li>
      </ul>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>5. Wohin? and Woher?</h2>
      <p style={paragraph}>
        <strong>Wohin?</strong> asks for the destination. <strong>Woher?</strong> asks where someone comes from.
      </p>
      <ul style={list}>
        <li><strong>Wohin</strong> fährst du? – Ich fahre <strong>zur Arbeit</strong>.</li>
        <li><strong>Woher</strong> kommst du? – Ich komme <strong>aus der Schule</strong>.</li>
      </ul>
      <p style={paragraph}>
        <strong>Common mistake:</strong> do not use <strong>woher</strong> for a destination and do not use <strong>wohin</strong> for an origin.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>6. Describing duration and route</h2>
      <p style={paragraph}>
        To describe your complete journey, add the duration and the sequence of transport.
      </p>
      <ul style={list}>
        <li><strong>Der Weg dauert 30 Minuten.</strong></li>
        <li><strong>Zuerst</strong> fahre ich mit dem Bus.</li>
        <li><strong>Dann</strong> steige ich in die Bahn um.</li>
        <li><strong>Danach</strong> gehe ich zehn Minuten zu Fuß.</li>
      </ul>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>7. Giving a reason with weil</h2>
      <p style={paragraph}>
        Use <strong>weil</strong> to explain why you choose a particular way to travel. The conjugated verb goes to the end of the <strong>weil</strong> clause.
      </p>
      <ul style={list}>
        <li>Ich fahre mit dem Bus, <strong>weil er schnell ist</strong>.</li>
        <li>Ich gehe zu Fuß, <strong>weil die Schule nicht weit entfernt ist</strong>.</li>
        <li>Ich nehme die Bahn, <strong>weil ich keinen Parkplatz suchen muss</strong>.</li>
      </ul>
      <p style={paragraph}>
        <strong>Pattern:</strong> main clause + weil + subject + rest + verb.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>8. Full A2 model answer</h2>
      <p style={paragraph}>
        <strong>Ich fahre jeden Morgen mit dem Bus zur Arbeit. Der Weg dauert ungefähr 35 Minuten.
        Zuerst fahre ich zehn Minuten mit dem Bus, dann steige ich in die Bahn um. Vom Bahnhof gehe
        ich noch fünf Minuten zu Fuß. Ich benutze öffentliche Verkehrsmittel, weil sie praktisch sind
        und ich keinen Parkplatz brauche.</strong>
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>Common mistakes</h2>
      <ul style={list}>
        <li><strong>Wrong:</strong> Ich fahre mit die Bahn. → <strong>Correct:</strong> Ich fahre mit der Bahn.</li>
        <li><strong>Wrong:</strong> Ich gehe mit Fuß. → <strong>Correct:</strong> Ich gehe zu Fuß.</li>
        <li><strong>Wrong:</strong> Ich fahre zu Berlin. → <strong>Correct:</strong> Ich fahre nach Berlin.</li>
        <li><strong>Wrong:</strong> Ich fahre zum Arbeit. → <strong>Correct:</strong> Ich fahre zur Arbeit.</li>
        <li><strong>Wrong:</strong> Ich nehme den Bus, weil er ist schnell. → <strong>Correct:</strong> ..., weil er schnell ist.</li>
      </ul>
    </section>

    <A2MiniLearningBlock {...focusedLesson} />  </div>
);

export default function A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage({ embedded = false }) {
  if (embedded) return <GrammarContent />;
  return (
    <main style={styles.pageWrap}>
      <div style={{ ...styles.container, display: "grid", gap: 16 }}>
        <AppBackButton label="Back" fallbackPath="/campus/course" />
        <h1 style={{ margin: 0 }}>A2 · Day 23 · Wie kommst du zur Schule / zur Arbeit?</h1>
        <GrammarContent />
      </div>
    </main>
  );
}
