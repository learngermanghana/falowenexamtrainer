import React from "react";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import { styles } from "../styles";

const grammarThinking = {
  17: {
    title: "Modal verbs and questions: decide what you need first",
    question: "Are you describing a problem, asking for advice, or asking what you may/should do?",
    steps: [
      "Problem / Problem → Ich habe ... / Mir tut ... weh.",
      "Need or wish / Bedarf → Ich brauche ... / Ich möchte ...",
      "Advice or permission / Rat oder Erlaubnis → soll, kann, darf, muss.",
      "Then build the question: Was soll ich nehmen? Kann ich ...? Muss ich ...?",
    ],
    example: "Idea: I have a cough and need advice → Problem + Rat → Ich habe Husten. Was soll ich nehmen?",
  },
  18: {
    title: "Polite requests: turn the purpose into a clear bank question",
    question: "What exactly do you need the bank employee to do or explain?",
    steps: [
      "Name the reason for the call: Karte verloren, Überweisung, Konto, Termin.",
      "Choose a polite request: Könnten Sie bitte ...? / Ich möchte gern ...",
      "Add the important detail: heute, sofort, Betrag, Dokumente.",
      "Confirm the next step before ending the call.",
    ],
    example: "Idea: lost card → urgent action → Könnten Sie meine Karte bitte sofort sperren?",
  },
  19: {
    title: "oder and denn: first decide choice or reason",
    question: "Are you offering an alternative, or explaining why?",
    steps: [
      "Choice / Alternative → oder.",
      "Reason / Begründung → denn.",
      "With denn, normal main-clause word order stays the same.",
      "Add a real shopping detail such as price, quality, place or product.",
    ],
    example: "Idea: market or supermarket + reason → Kaufst du auf dem Markt oder im Supermarkt? Ich kaufe im Supermarkt, denn es ist praktisch.",
  },
  20: {
    title: "Complaints: problem first, solution second",
    question: "What went wrong, and what reasonable solution do you want?",
    steps: [
      "Name the product or service.",
      "Describe the concrete problem without adding unnecessary details.",
      "Ask politely for a solution: Umtausch, Reparatur, Ersatz oder Rückerstattung.",
      "Add a reason if needed: weil ... / denn ...",
    ],
    example: "Idea: broken headphones → replacement → Die Kopfhörer funktionieren nicht. Könnten Sie sie bitte umtauschen?",
  },
  21: {
    title: "wenn, ob, falls: decide condition or yes/no uncertainty",
    question: "Are you saying what happens under a condition, or asking whether something is true?",
    steps: [
      "Condition / Bedingung → wenn or falls.",
      "Yes/no uncertainty / indirekte Ja-Nein-Frage → ob.",
      "In the subordinate clause, the verb goes to the end.",
      "Use the structure to create a real weekend plan and a Plan B.",
    ],
    example: "Idea: weather condition + alternative → Wenn das Wetter gut ist, gehen wir in den Park. Falls es regnet, gehen wir ins Kino.",
  },
};

const speakingHelp = {
  17: {
    title: "More speaking help: In die Apotheke gehen",
    instructions: [
      "Start with one real health problem, not a list of symptoms.",
      "Build the answer in this order: problem → symptoms → medicine/advice → question → thanks.",
      "Use the keywords to create a short pharmacy dialogue.",
    ],
    phraseGroups: [
      { title: "Problem", items: ["Ich fühle mich seit gestern nicht gut.", "Ich habe starke Kopfschmerzen.", "Ich habe Husten und Halsschmerzen."] },
      { title: "Symptoms", items: ["Ich habe auch Fieber.", "Meine Nase läuft.", "Mir ist etwas schwindelig."] },
      { title: "Medicine and advice", items: ["Ich brauche etwas gegen Husten.", "Haben Sie etwas gegen Kopfschmerzen?", "Was würden Sie mir empfehlen?"] },
      { title: "Questions", items: ["Wie oft soll ich das nehmen?", "Gibt es Nebenwirkungen?", "Brauche ich dafür ein Rezept?"] },
      { title: "Closing", items: ["Vielen Dank für Ihre Hilfe.", "Dann nehme ich das Medikament.", "Auf Wiedersehen."] },
    ],
    vocabulary: ["die Apotheke", "die Symptome", "der Husten", "die Halsschmerzen", "das Fieber", "das Medikament", "die Tablette", "der Hustensaft", "die Dosierung", "die Nebenwirkung", "das Rezept"],
    modelAnswer: "Guten Tag. Ich habe seit gestern Husten und Halsschmerzen. Außerdem habe ich leichtes Fieber. Ich brauche etwas gegen den Husten. Was würden Sie mir empfehlen? Wie oft soll ich das Medikament nehmen, und gibt es Nebenwirkungen? Vielen Dank für Ihre Hilfe.",
  },
  18: {
    title: "More speaking help: Die Bank anrufen",
    instructions: [
      "Choose one concrete reason for the call.",
      "Say the reason immediately, then make one or two polite requests.",
      "Finish by confirming what happens next.",
    ],
    phraseGroups: [
      { title: "Reason", items: ["Ich rufe an, weil ich meine Karte verloren habe.", "Ich habe eine Frage zu einer Überweisung.", "Ich möchte ein Konto eröffnen."] },
      { title: "Request", items: ["Könnten Sie die Karte bitte sperren?", "Könnten Sie bitte prüfen, ob die Überweisung angekommen ist?", "Welche Dokumente brauche ich?"] },
      { title: "Details", items: ["Es ist sehr dringend.", "Die Überweisung war gestern.", "Ich bin Student und brauche ein einfaches Konto."] },
      { title: "Confirm", items: ["Bekomme ich eine Bestätigung per E-Mail?", "Wann bekomme ich die neue Karte?", "Kann ich dafür einen Termin vereinbaren?"] },
    ],
    vocabulary: ["das Konto", "die Bankkarte", "sperren", "die Überweisung", "der Kontostand", "das Online-Banking", "der Termin", "die Bestätigung", "die Ersatzkarte"],
    modelAnswer: "Guten Tag, mein Name ist Kojo Mensah. Ich rufe an, weil ich meine Bankkarte verloren habe. Könnten Sie die Karte bitte sofort sperren? Außerdem möchte ich wissen, wann ich eine Ersatzkarte bekomme. Können Sie mir die Bestätigung bitte per E-Mail schicken? Vielen Dank.",
  },
  19: {
    title: "More speaking help: Einkaufen – wo und wie?",
    instructions: [
      "Choose one real shopping place first.",
      "Add what you buy there, the price or quality, and one reason.",
      "Compare it with one alternative if possible.",
    ],
    phraseGroups: [
      { title: "Place", items: ["Ich kaufe meistens im Supermarkt ein.", "Obst kaufe ich gern auf dem Markt.", "Kleidung bestelle ich manchmal online."] },
      { title: "Products", items: ["Dort kaufe ich Lebensmittel.", "Ich kaufe dort frisches Obst und Gemüse.", "Online kaufe ich manchmal Schuhe."] },
      { title: "Price and quality", items: ["Der Markt ist oft günstiger.", "Im Supermarkt ist die Auswahl größer.", "Online kann ich Preise gut vergleichen."] },
      { title: "Reason", items: ["Ich gehe dorthin, denn es ist nah.", "Ich kaufe dort, denn die Qualität ist gut.", "Manchmal kaufe ich online, weil es bequem ist."] },
      { title: "Alternative", items: ["Ich kaufe im Supermarkt oder auf dem Markt.", "Bei teuren Produkten vergleiche ich zuerst die Preise."] },
    ],
    vocabulary: ["einkaufen", "der Supermarkt", "der Markt", "online", "günstig", "teuer", "die Qualität", "die Auswahl", "vergleichen", "oder", "denn"],
    modelAnswer: "Ich kaufe Lebensmittel meistens im Supermarkt, denn er ist in meiner Nähe. Obst und Gemüse kaufe ich aber gern auf dem Markt, weil es dort oft frischer und günstiger ist. Kleidung kaufe ich im Geschäft oder manchmal online. Bei teuren Produkten vergleiche ich zuerst die Preise.",
  },
  20: {
    title: "More speaking help: Eine Reklamation machen",
    instructions: [
      "Choose one product or service and one concrete problem.",
      "Explain what happened, what you already tried and what solution you want.",
      "Stay polite even when the problem is serious.",
    ],
    phraseGroups: [
      { title: "Product/service", items: ["Ich habe gestern diese Kopfhörer gekauft.", "Ich habe bei Ihnen ein Hotelzimmer gebucht.", "Ich habe diese Jacke online bestellt."] },
      { title: "Problem", items: ["Die Kopfhörer funktionieren nicht.", "Das Zimmer war nicht sauber.", "Die Jacke hat die falsche Größe."] },
      { title: "What you tried", items: ["Ich habe das Gerät schon neu gestartet.", "Ich habe bereits an der Rezeption Bescheid gesagt.", "Ich habe die Verpackung noch."] },
      { title: "Solution", items: ["Könnten Sie das Produkt bitte umtauschen?", "Ich hätte gern eine Rückerstattung.", "Könnten Sie mir bitte einen Ersatz schicken?"] },
    ],
    vocabulary: ["die Reklamation", "kaputt", "falsch", "umtauschen", "reparieren", "ersetzen", "die Rückerstattung", "der Kassenbon", "die Rechnung", "höflich"],
    modelAnswer: "Guten Tag. Ich habe gestern diese Kopfhörer bei Ihnen gekauft, aber sie funktionieren nicht. Ich habe sie bereits neu gestartet, aber das Problem bleibt. Könnten Sie die Kopfhörer bitte umtauschen oder mir den Kaufpreis zurückerstatten? Den Kassenbon habe ich dabei.",
  },
  21: {
    title: "More speaking help: Ein Wochenende planen",
    instructions: [
      "Choose a real Saturday or Sunday plan.",
      "Build the plan in this order: day/time → activity → people → place → condition/Plan B.",
      "Use wenn/falls for conditions and ob for a yes/no question.",
    ],
    phraseGroups: [
      { title: "Day and time", items: ["Am Samstag habe ich ab 14 Uhr Zeit.", "Sonntagvormittag passt mir gut."] },
      { title: "Activity", items: ["Wir könnten ins Kino gehen.", "Ich möchte im Park spazieren gehen.", "Wir können zusammen kochen."] },
      { title: "People and place", items: ["Ich treffe mich mit zwei Freunden.", "Wir treffen uns am Bahnhof.", "Danach gehen wir in ein Café."] },
      { title: "Condition", items: ["Wenn das Wetter gut ist, gehen wir in den Park.", "Falls es regnet, gehen wir ins Kino."] },
      { title: "Question", items: ["Weißt du, ob Anna auch Zeit hat?", "Kannst du fragen, ob das Restaurant geöffnet ist?"] },
    ],
    vocabulary: ["das Wochenende", "planen", "sich treffen", "passen", "wenn", "falls", "ob", "Plan B", "gemeinsam", "reservieren"],
    modelAnswer: "Am Samstag möchte ich mich mit meinen Freunden treffen. Wenn das Wetter gut ist, gehen wir am Nachmittag in den Park und spielen Fußball. Danach können wir etwas essen. Falls es regnet, gehen wir stattdessen ins Kino. Ich frage noch, ob Anna auch Zeit hat.",
  },
};

export const A2Days17To21ThinkingFirstGrammarGuide = ({ day }) => {
  const guide = grammarThinking[Number(day)];
  if (!guide) return null;
  return (
    <section style={{ ...styles.card, display: "grid", gap: 10, border: "1px solid #bfdbfe", background: "#f8fbff" }}>
      <span style={{ color: "#1d4ed8", fontWeight: 800 }}>Think first · Erst verstehen, dann anwenden</span>
      <h2 style={{ margin: 0 }}>{guide.title}</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Ask yourself:</strong> {guide.question}</p>
      <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.8 }}>{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      <div style={{ padding: 12, borderRadius: 10, background: "#fff", border: "1px solid #dbeafe", lineHeight: 1.7 }}>
        <strong>Idea → decision → German sentence</strong><br />{guide.example}
      </div>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>Use this thinking path first. The detailed grammar notes below then show you the exact forms.</p>
    </section>
  );
};

export const getA2Days17To21SpeakingConfig = (day) => {
  const base = getA2SpeakingMindMap(day);
  if (!base) return base;
  return { ...base, extraHelp: speakingHelp[Number(day)] || base.extraHelp };
};
