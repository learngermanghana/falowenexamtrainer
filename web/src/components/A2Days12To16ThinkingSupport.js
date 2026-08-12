import React from "react";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import { styles } from "../styles";

const grammarThinking = {
  12: {
    title: "Career language: first decide what you want to express",
    question: "Are you talking about a job, a task, a strength, or a future goal?",
    steps: [
      "Job / Beruf → name the profession: Ich möchte Lehrer werden.",
      "Task / Aufgabe → use an action: Ich möchte Menschen helfen.",
      "Strength / Stärke → use können or an adjective: Ich kann gut organisieren.",
      "Goal / Ziel → connect it with weil, deshalb or später möchte ich ...",
    ],
    example: "Idea: I want to be a nurse because I like helping people → Beruf + Grund → Ich möchte Krankenpfleger werden, weil ich Menschen gern helfe.",
  },
  13: {
    title: "Modal verbs in the past: separate ability, duty and intention",
    question: "What could, had to, or wanted to happen in the past?",
    steps: [
      "können → konnte: past ability.",
      "müssen → musste: past necessity.",
      "wollen → wollte: past intention.",
      "Then add the main action so the sentence tells a complete story.",
    ],
    example: "Idea: I had to work on Saturday → past necessity → musste → Ich musste am Samstag arbeiten.",
  },
  14: {
    title: "um ... zu: first identify the goal",
    question: "Are you explaining why somebody does something?",
    steps: [
      "Say the action first: Ich mache einen Deutschkurs.",
      "Ask: What is the goal? / Was ist das Ziel?",
      "If the subject is the same, use um ... zu + infinitive.",
      "Put the infinitive at the end: ..., um besser Deutsch zu sprechen.",
    ],
    example: "Idea: I take a course so I can improve my German → same person + goal → Ich mache einen Kurs, um mein Deutsch zu verbessern.",
  },
  15: {
    title: "seit + Dativ: think of a starting point that continues until now",
    question: "Did the activity start in the past and is it still true now?",
    steps: [
      "Choose the starting point: seit einem Jahr / seit meiner Kindheit.",
      "Use Dativ after seit.",
      "Use the present tense when the activity still continues.",
      "Then add frequency, place or reason to make the idea useful.",
    ],
    example: "Idea: I have played football for two years and still play → seit + Dativ + present → Ich spiele seit zwei Jahren Fußball.",
  },
  16: {
    title: "Reflexive verbs: first ask who receives the action",
    question: "Is the person doing something to or for themselves?",
    steps: [
      "Start with the verb: sich entspannen, sich bewegen, sich fühlen.",
      "Choose the correct reflexive pronoun: ich → mich, du → dich, wir → uns.",
      "Build the normal sentence: Ich entspanne mich am Abend.",
      "Add a reason, frequency or result so it becomes a real answer.",
    ],
    example: "Idea: I relax after work because I am tired → reflexive action + reason → Nach der Arbeit entspanne ich mich, weil ich müde bin.",
  },
};

const speakingHelp = {
  12: {
    title: "More speaking help: Mein Traumberuf",
    instructions: [
      "Choose one real job first. Do not list many jobs.",
      "Build your answer: job → tasks → workplace → strengths → future goal/reason.",
      "Use one personal reason so the answer sounds like your own idea.",
    ],
    phraseGroups: [
      { title: "Beruf", items: ["Mein Traumberuf ist Lehrer.", "Ich möchte später als Ingenieur arbeiten.", "Ich interessiere mich für den Beruf Arzt."] },
      { title: "Aufgaben", items: ["Ich möchte Menschen helfen.", "Ich möchte mit Computern arbeiten.", "Ich möchte Kinder unterrichten."] },
      { title: "Arbeitsplatz", items: ["Ich möchte in einem Krankenhaus arbeiten.", "Ich arbeite gern im Büro.", "Ich möchte manchmal reisen."] },
      { title: "Stärken", items: ["Ich kann gut organisieren.", "Ich bin geduldig und kommunikativ.", "Ich arbeite gern im Team."] },
      { title: "Ziel und Grund", items: ["Dieser Beruf passt zu mir, weil ich gern mit Menschen arbeite.", "Später möchte ich mich weiterbilden.", "Deshalb lerne ich jetzt Deutsch."] },
    ],
    vocabulary: ["der Traumberuf", "arbeiten als", "die Aufgabe", "der Arbeitsplatz", "die Stärke", "geduldig", "kommunikativ", "organisieren", "Menschen helfen", "sich weiterbilden"],
    modelAnswer: "Mein Traumberuf ist Lehrer. Ich möchte Schüler unterrichten und ihnen beim Lernen helfen. Ich möchte in einer Schule arbeiten und gern mit Kollegen im Team arbeiten. Ich bin geduldig und kann gut erklären. Dieser Beruf passt zu mir, weil ich gern mit Menschen arbeite. Deshalb möchte ich mich später weiterbilden.",
  },
  13: {
    title: "More speaking help: Vorstellungsgespräch",
    instructions: [
      "Imagine one real interview and answer as the applicant.",
      "Build the answer: greeting → experience → strengths → past responsibility → question → polite ending.",
      "Give one concrete example instead of saying only 'I am good'.",
    ],
    phraseGroups: [
      { title: "Begrüßung", items: ["Guten Tag, vielen Dank für die Einladung.", "Mein Name ist ... und ich freue mich auf das Gespräch."] },
      { title: "Erfahrung", items: ["Ich habe bereits im Verkauf gearbeitet.", "Ich habe ein Praktikum in einem Büro gemacht.", "Dort konnte ich viel lernen."] },
      { title: "Stärken", items: ["Ich bin zuverlässig und freundlich.", "Ich kann gut mit Kunden sprechen.", "Ich arbeite gern im Team."] },
      { title: "Vergangenheit", items: ["In meiner letzten Arbeit musste ich viele Termine organisieren.", "Ich konnte selbstständig arbeiten.", "Ich wollte mehr Verantwortung übernehmen."] },
      { title: "Eigene Frage", items: ["Wie sind die Arbeitszeiten?", "Gibt es Weiterbildungsmöglichkeiten?", "Wann könnte ich anfangen?"] },
    ],
    vocabulary: ["das Vorstellungsgespräch", "die Erfahrung", "die Stärke", "zuverlässig", "selbstständig", "Verantwortung", "Arbeitszeiten", "Weiterbildung", "anfangen", "Einladung"],
    modelAnswer: "Guten Tag, vielen Dank für die Einladung. Ich habe bereits im Verkauf gearbeitet und konnte dort viel Erfahrung mit Kunden sammeln. Ich bin freundlich, zuverlässig und arbeite gern im Team. In meiner letzten Stelle musste ich auch Bestellungen organisieren. Ich interessiere mich für diese Stelle, weil ich mich beruflich weiterentwickeln möchte. Wie sind die Arbeitszeiten? Vielen Dank für das Gespräch.",
  },
  14: {
    title: "More speaking help: Beruf und Karriere",
    instructions: [
      "Choose what matters most to you at work: team, working hours, salary, learning or future opportunities.",
      "Explain each choice with a reason or goal.",
      "Use um ... zu for at least one career goal.",
    ],
    phraseGroups: [
      { title: "Arbeit", items: ["Mir ist eine interessante Arbeit wichtig.", "Ich möchte abwechslungsreiche Aufgaben haben."] },
      { title: "Team", items: ["Ein gutes Team ist mir wichtig, weil man sich gegenseitig helfen kann.", "Ich arbeite gern mit anderen zusammen."] },
      { title: "Arbeitszeit", items: ["Flexible Arbeitszeiten sind für mich wichtig.", "Ich möchte genug Zeit für meine Familie haben."] },
      { title: "Gehalt", items: ["Ein gutes Gehalt ist wichtig, aber nicht alles.", "Ich möchte genug verdienen, um selbstständig zu leben."] },
      { title: "Zukunft", items: ["Ich möchte Kurse besuchen, um neue Fähigkeiten zu lernen.", "Später möchte ich mehr Verantwortung übernehmen."] },
    ],
    vocabulary: ["die Karriere", "die Arbeitszeit", "das Gehalt", "das Team", "die Aufgabe", "flexibel", "Verantwortung übernehmen", "Fähigkeiten erweitern", "um ... zu", "sich weiterentwickeln"],
    modelAnswer: "Im Beruf sind mir ein gutes Team und interessante Aufgaben besonders wichtig. Ich möchte flexible Arbeitszeiten haben, weil ich auch Zeit für meine Familie brauche. Ein gutes Gehalt ist wichtig, aber ich möchte auch etwas lernen. Deshalb möchte ich regelmäßig Kurse besuchen, um meine Fähigkeiten zu erweitern. Später möchte ich mehr Verantwortung übernehmen.",
  },
  15: {
    title: "More speaking help: Mein Lieblingssport",
    instructions: [
      "Choose one sport and stay with it.",
      "Build your answer: sport → since when → where → with whom/how often → why/how you feel.",
      "Use seit to connect your past starting point with the present.",
    ],
    phraseGroups: [
      { title: "Sportart", items: ["Mein Lieblingssport ist Fußball.", "Ich spiele gern Tennis.", "Ich gehe gern schwimmen."] },
      { title: "Seit wann", items: ["Ich spiele seit drei Jahren Fußball.", "Ich schwimme seit meiner Kindheit.", "Seit einem Jahr trainiere ich regelmäßig."] },
      { title: "Ort", items: ["Ich trainiere auf einem Sportplatz.", "Ich gehe ins Fitnessstudio.", "Ich schwimme im Schwimmbad."] },
      { title: "Personen und Häufigkeit", items: ["Ich spiele zweimal pro Woche mit Freunden.", "Am Wochenende trainiere ich mit meinem Team."] },
      { title: "Grund und Gefühl", items: ["Ich mag Fußball, weil er spannend ist.", "Sport hilft mir, mich zu entspannen.", "Danach fühle ich mich fit."] },
    ],
    vocabulary: ["der Lieblingssport", "seit", "seit einem Jahr", "seit meiner Kindheit", "trainieren", "zweimal pro Woche", "der Sportplatz", "das Team", "fit", "sich entspannen"],
    modelAnswer: "Mein Lieblingssport ist Fußball. Ich spiele seit drei Jahren regelmäßig Fußball. Ich trainiere zweimal pro Woche auf einem Sportplatz und spiele meistens mit meinen Freunden. Am Wochenende haben wir manchmal ein Spiel. Ich mag Fußball, weil er spannend ist und ich mich danach fit und entspannt fühle.",
  },
  16: {
    title: "More speaking help: Wohlbefinden und Entspannung",
    instructions: [
      "Start with one real stress situation, then explain what helps you.",
      "Build the answer: stress → relaxation → sleep → movement → personal tip.",
      "Use reflexive verbs naturally: mich entspannen, mich bewegen, mich fühlen.",
    ],
    phraseGroups: [
      { title: "Stress", items: ["Nach der Arbeit bin ich manchmal gestresst.", "Wenn ich viele Aufgaben habe, fühle ich mich müde."] },
      { title: "Entspannung", items: ["Am Abend entspanne ich mich mit Musik.", "Ich nehme mir Zeit für eine Pause.", "Ich treffe mich mit Freunden."] },
      { title: "Schlaf", items: ["Ich versuche, sieben oder acht Stunden zu schlafen.", "Vor dem Schlafen benutze ich mein Handy weniger."] },
      { title: "Bewegung", items: ["Ich bewege mich jeden Tag.", "Ich gehe spazieren oder joggen.", "Sport hilft mir gegen Stress."] },
      { title: "Tipp", items: ["Mein Tipp ist: Plane jeden Tag eine kurze Pause.", "Man sollte genug schlafen und sich regelmäßig bewegen."] },
    ],
    vocabulary: ["das Wohlbefinden", "der Stress", "sich entspannen", "sich fühlen", "sich bewegen", "die Pause", "genug schlafen", "spazieren gehen", "regelmäßig", "der Tipp"],
    modelAnswer: "Wenn ich viele Aufgaben habe, fühle ich mich manchmal gestresst. Nach der Arbeit entspanne ich mich oft mit Musik oder gehe spazieren. Ich versuche auch, genug zu schlafen und mich jeden Tag etwas zu bewegen. Sport hilft mir, mich besser zu fühlen. Mein Tipp ist, regelmäßig kurze Pausen zu machen.",
  },
};

export const A2Days12To16ThinkingFirstGrammarGuide = ({ day }) => {
  const guide = grammarThinking[Number(day)];
  if (!guide) return null;
  return (
    <section style={{ ...styles.card, display: "grid", gap: 10, border: "1px solid #bfdbfe", background: "#f8fbff" }}>
      <span style={{ color: "#1d4ed8", fontWeight: 800 }}>Think first · Erst verstehen, dann anwenden</span>
      <h2 style={{ margin: 0 }}>{guide.title}</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Ask yourself:</strong> {guide.question}</p>
      <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.8 }}>
        {guide.steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
      <div style={{ padding: 12, borderRadius: 10, background: "#fff", border: "1px solid #dbeafe", lineHeight: 1.7 }}>
        <strong>Idea → decision → German sentence</strong><br />{guide.example}
      </div>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
        First understand what you want to say. Then use the detailed grammar notes below to choose the correct form.
      </p>
    </section>
  );
};

export const getA2Days12To16SpeakingConfig = (day) => {
  const base = getA2SpeakingMindMap(day);
  if (!base) return base;
  return { ...base, extraHelp: speakingHelp[Number(day)] || base.extraHelp };
};
