import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };
const paragraph = { margin: 0, lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.8 };
const exampleGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 };

const Example = ({ german, english }) => (
  <div style={{ padding: "11px 13px", border: "1px solid #e2e8f0", borderRadius: 12, background: "#f8fafc", display: "grid", gap: 5 }}>
    <strong lang="de">{german}</strong>
    <span style={{ color: "#475569", fontSize: 14, lineHeight: 1.5 }}>EN: {english}</span>
  </div>
);

const GrammarContent = () => (
  <div style={{ display: "grid", gap: 16 }} data-a2-day23-commute-grammar="true">
    <header style={card}>
      <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 23 · Wie kommst du zur Schule oder zur Arbeit?</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>
        <strong>Grammar:</strong> Verkehrsmittel · mit + Dativ · zu / nach / in · Satzstellung
      </p>
      <p style={paragraph}>
        <strong>Learning goal:</strong> Explain <em>how</em> you travel, <em>where</em> you go,
        <em> how long</em> the journey takes and <em>why</em> you choose that transport.
        Learn the four useful questions: <strong>Wie?</strong> (How?),
        <strong> Wohin?</strong> (Where to?), <strong>Wie lange?</strong> (How long?) and
        <strong> Warum?</strong> (Why?).
      </p>
    </header>

    <section style={card}>
      <h2 style={{ margin: 0 }}>1. Wie? · mit + Dativ for transport</h2>
      <p style={paragraph}>
        To say <strong>by bus / by train / by bicycle</strong>, use <strong>mit + dative</strong>.
        The noun's article changes because <em>mit</em> always requires dative.
      </p>
      <div style={exampleGrid}>
        <Example german="der Bus → mit dem Bus" english="by bus (masculine: der → dem)" />
        <Example german="das Fahrrad → mit dem Fahrrad" english="by bicycle (neuter: das → dem)" />
        <Example german="die Bahn → mit der Bahn" english="by train (feminine: die → der)" />
        <Example german="die öffentlichen Verkehrsmittel → mit den öffentlichen Verkehrsmitteln" english="by public transport (plural: die → den; usually add -n to the plural noun)" />
      </div>
      <p style={paragraph}>
        <strong>Important exception:</strong> Walking is the fixed expression <strong>zu Fuß</strong>,
        not <s>mit Fuß</s>. You can say <strong>Ich gehe zu Fuß zur Schule.</strong>
        (I walk to school.)
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>2. Wohin? · zu, nach or in for the destination</h2>
      <p style={paragraph}>
        <strong>mit</strong> tells us <em>how</em> you travel. A destination phrase tells us
        <em> where</em> you are going. Do not mix up the two questions.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        <div>
          <h3 style={{ margin: "0 0 6px" }}>zu + Dativ · to a person or many places</h3>
          <p style={paragraph}>
            Remember: <strong>zu dem becomes zum</strong> and <strong>zu der becomes zur</strong>.
            The dative article depends on the noun.
          </p>
        </div>
        <div style={exampleGrid}>
          <Example german="Ich fahre zur Schule." english="I travel to school. (die Schule → zur Schule)" />
          <Example german="Ich fahre zur Arbeit." english="I travel to work. (die Arbeit → zur Arbeit)" />
          <Example german="Ich gehe zum Bahnhof." english="I walk to the station. (der Bahnhof → zum Bahnhof)" />
        </div>
        <div>
          <h3 style={{ margin: "0 0 6px" }}>nach · to cities and countries without an article</h3>
          <p style={paragraph}>
            Use <strong>nach Berlin</strong>, <strong>nach Accra</strong> and
            <strong> nach Deutschland</strong>. The common expression for going home is
            <strong> nach Hause</strong>; being at home is <strong>zu Hause</strong>.
          </p>
        </div>
        <div style={exampleGrid}>
          <Example german="Morgen fahre ich nach Berlin." english="Tomorrow I am going to Berlin." />
          <Example german="Nach der Arbeit fahre ich nach Hause." english="After work I travel home." />
        </div>
        <div>
          <h3 style={{ margin: "0 0 6px" }}>in + Akkusativ · going into a place or to certain countries</h3>
          <p style={paragraph}>
            When entering a building or travelling to a country with an article,
            <strong> in + accusative</strong> is common: <strong>ins</strong> = in das.
            Compare <em>zum Büro</em> (towards/to the office) with <em>ins Büro</em>
            (into the office).
          </p>
        </div>
        <div style={exampleGrid}>
          <Example german="Ich gehe ins Büro." english="I go into the office." />
          <Example german="Wir fahren in die Schweiz." english="We are travelling to Switzerland." />
        </div>
      </div>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>3. fahren, gehen or nehmen?</h2>
      <p style={paragraph}>
        Choose the verb that matches the journey. <strong>fahren</strong> is usual for
        travelling by vehicle; <strong>gehen</strong> is used for walking.
        With <strong>nehmen</strong> (take), the vehicle is a direct object in the
        <strong> accusative</strong> — not a <em>mit</em> phrase.
      </p>
      <div style={exampleGrid}>
        <Example german="Ich fahre mit dem Bus." english="I travel by bus. (mit + dative)" />
        <Example german="Ich nehme den Bus." english="I take the bus. (nehmen + accusative)" />
        <Example german="Ich gehe zu Fuß." english="I go on foot / I walk." />
        <Example german="Ich steige am Bahnhof in den Zug ein." english="I get on the train at the station. (einsteigen is separable)" />
      </div>
      <p style={paragraph}>
        <strong>Compare:</strong> <em>mit dem Bus</em> but <em>den Bus nehmen</em>.
        These are two different grammar patterns with almost the same meaning.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>4. Satzstellung · keep the verb in position 2</h2>
      <p style={paragraph}>
        A useful order is <strong>time + conjugated verb + subject + transport + destination</strong>.
        In a normal main clause, the conjugated verb stays in second position even
        when you start with a time or transport expression.
      </p>
      <div style={exampleGrid}>
        <Example german="Jeden Morgen fahre ich mit dem Fahrrad zur Schule." english="Every morning I cycle to school." />
        <Example german="Normalerweise fahre ich mit der Bahn zur Arbeit." english="I normally travel to work by train." />
        <Example german="Mit dem Bus fahre ich zum Bahnhof." english="I travel to the station by bus." />
      </div>
      <p style={paragraph}>
        <strong>Not:</strong> <s>Jeden Morgen ich fahre mit dem Bus.</s>
        <strong> Correct:</strong> Jeden Morgen <strong>fahre ich</strong> mit dem Bus.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>5. Wie lange? und Warum? · duration and reasons</h2>
      <p style={paragraph}>
        To make an A2 answer complete, explain how long your commute takes and why
        you prefer that method. Use <strong>brauchen</strong> or <strong>dauern</strong>
        for time. Use <strong>weil</strong> for a reason: in the <em>weil</em>-clause,
        the conjugated verb goes to the <strong>end</strong>.
        After <strong>deshalb</strong> (therefore), the verb stays in position 2.
      </p>
      <div style={exampleGrid}>
        <Example german="Ich brauche 20 Minuten zur Schule." english="It takes me 20 minutes to get to school." />
        <Example german="Der Weg zur Arbeit dauert 30 Minuten." english="The journey to work takes 30 minutes." />
        <Example german="Ich fahre mit dem Bus, weil er günstig ist." english="I take the bus because it is inexpensive." />
        <Example german="Der Bus ist günstig. Deshalb fahre ich mit dem Bus." english="The bus is inexpensive. That is why I take it." />
      </div>
      <p style={paragraph}>
        <strong>Word order:</strong> Ich fahre mit dem Fahrrad, <strong>weil es schnell ist</strong>.
        But: Das Fahrrad ist schnell. <strong>Deshalb fahre ich</strong> damit zur Schule.
      </p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0 }}>6. Musterantwort · put everything together</h2>
      <p style={paragraph} lang="de">
        <strong>Deutsch:</strong> Jeden Morgen fahre ich mit dem Bus zur Arbeit.
        Der Weg dauert ungefähr 25 Minuten. Ich nehme den Bus, weil er günstig ist.
        Manchmal gehe ich zu Fuß, wenn das Wetter schön ist.
      </p>
      <p style={paragraph}>
        <strong>English:</strong> Every morning I travel to work by bus.
        The journey takes about 25 minutes. I take the bus because it is inexpensive.
        Sometimes I walk when the weather is nice.
      </p>
      <p style={paragraph}>
        <strong>Exam tip:</strong> Answer the question first, then add transport,
        duration and a reason. A short, connected answer is better than a list of transport words.
      </p>
    </section>

    <A2MiniLearningBlock
      essential
      title="Wissenstest · Mein Schul- und Arbeitsweg"
      english="Choose the correct preposition, dative or accusative article, and word order. After each choice, read the explanation."
      rule="Wie? → mit + Dativ / zu Fuß. Wohin? → zur Schule, zur Arbeit, zum Bahnhof, nach Berlin or ins Büro. Verb in position 2 in main clauses; verb at the end after weil."
      examples={[
        "Ich fahre mit dem Bus zur Schule.",
        "Ich nehme den Bus zur Arbeit.",
        "Morgens gehe ich zu Fuß zum Bahnhof.",
      ]}
      commonMistake="Say mit dem Bus (not mit den Bus), but den Bus nehmen (not dem Bus nehmen). Walking is zu Fuß, never mit Fuß."
      questions={[
        { stem: "Ich fahre ___ Bus zur Arbeit.", options: ["mit dem", "mit den", "mit der"], answer: 0, explanation: "Der Bus becomes dem Bus after mit (dative)." },
        { stem: "Sie fährt ___ Bahn zur Schule.", options: ["mit die", "mit der", "mit den"], answer: 1, explanation: "Die Bahn is feminine: mit der Bahn." },
        { stem: "Ich gehe ___ zur Schule.", options: ["mit Fuß", "zu Fuß", "nach Fuß"], answer: 1, explanation: "Zu Fuß is the fixed expression for walking." },
        { stem: "Wir fahren morgen ___ Berlin.", options: ["zu", "nach", "mit"], answer: 1, explanation: "Use nach with a city name." },
        { stem: "Ich fahre mit dem Bus ___ Arbeit.", options: ["nach", "zur", "zum"], answer: 1, explanation: "Die Arbeit is feminine: zu der Arbeit → zur Arbeit." },
        { stem: "Ich nehme ___ Bus.", options: ["dem", "der", "den"], answer: 2, explanation: "Nehmen has an accusative direct object: den Bus. Mit dem Bus is a different construction." },
        { stem: "Which sentence has correct word order?", options: ["Morgens ich fahre zur Schule.", "Morgens fahre ich zur Schule.", "Morgens zur Schule fahre ich."], answer: 1, explanation: "When Morgens comes first, the conjugated verb fahre follows in position 2." },
        { stem: "Ich gehe zu Fuß, weil der Weg kurz ___.", options: ["ist", "bin", "sind"], answer: 0, explanation: "Der Weg is singular, so use ist. Weil sends the conjugated verb to the end." },
      ]}
      outputPrompt="Beschreibe deinen Weg zur Schule oder zur Arbeit in 4–5 Sätzen. Nenne das Verkehrsmittel, das Ziel, die Dauer und einen Grund. Verwende mindestens einmal mit + Dativ oder zu Fuß."
      starters={[
        "Normalerweise fahre ich mit ... zur/zum ...",
        "Manchmal nehme ich den/die/das ...",
        "Der Weg dauert ungefähr ... Minuten.",
        "Ich benutze ..., weil ...",
      ]}
    />
  </div>
);

export default function A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage({ embedded = false }) {
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
