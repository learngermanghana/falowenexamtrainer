import React from "react";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import { styles } from "../styles";

const grammarThinking = {
  7: {
    title: "Relative clauses: first decide which noun you are adding information about",
    question: "Which person or thing do you want to describe more precisely?",
    steps: [
      "1. Say the main sentence first: Ich suche eine Wohnung.",
      "2. Choose the noun you want to explain more: eine Wohnung.",
      "3. Add der/die/das as the relative word: die ...",
      "4. Put the verb at the end of the relative clause.",
    ],
    example: "Idea: I need an apartment. It has a balcony. → Ich suche eine Wohnung, die einen Balkon hat.",
  },
  8: {
    title: "Imperative: first decide who should do the action",
    question: "Are you giving an instruction to du, ihr or Sie?",
    steps: [
      "1. Choose the action: schneiden, mischen, warten.",
      "2. Choose the person: du / ihr / Sie.",
      "3. Build the command form.",
      "4. Add the object or time: Schneide die Tomaten klein. Warten Sie zehn Minuten.",
    ],
    example: "Idea: Tell one friend to add the onions → du → Gib die Zwiebeln dazu.",
  },
  9: {
    title: "Perfekt: first find the past action, then build the two verb parts",
    question: "What happened, and does the verb normally use haben or sein?",
    steps: [
      "1. Choose one completed action from the past.",
      "2. Choose haben or sein.",
      "3. Form the Partizip II.",
      "4. Put the helper verb in position 2 and the Partizip II at the end.",
    ],
    example: "Idea: Last summer I travelled to Spain → reisen + sein → Ich bin letzten Sommer nach Spanien gereist.",
  },
  10: {
    title: "Präteritum: use the common past forms for background and simple stories",
    question: "Are you talking about sein, haben or a common modal verb in the past?",
    steps: [
      "1. Start with the meaning: was / had / could / wanted / had to.",
      "2. Choose the common Präteritum form: war, hatte, konnte, wollte, musste.",
      "3. Add time and context.",
      "4. Connect one more sentence so you tell a small story, not only one form.",
    ],
    example: "Idea: The festival was crowded, but I had fun → Das Fest war voll, aber ich hatte viel Spaß.",
  },
  11: {
    title: "Comparative forms: compare one clear feature at a time",
    question: "Which two transport options are you comparing, and what feature matters?",
    steps: [
      "1. Choose two options: Bus und Taxi.",
      "2. Choose one feature: Preis, Zeit, Komfort, Umwelt.",
      "3. Build comparative + als: günstiger als, schneller als.",
      "4. Finish with your choice and a reason.",
    ],
    example: "Idea: The bus costs less than a taxi → Der Bus ist günstiger als ein Taxi. Deshalb nehme ich oft den Bus.",
  },
};

const speakingHelp = {
  7: {
    title: "More speaking help: Eine Wohnung suchen",
    instructions: [
      "Create one realistic apartment search. Do not list random housing words.",
      "Build your answer in this order: size → location → price → features → viewing.",
      "For every keyword, say what you want and why it matters to you.",
    ],
    phraseGroups: [
      { title: "Größe und Zimmer", items: ["Ich suche eine Zwei-Zimmer-Wohnung.", "Ich brauche ein Schlafzimmer und ein Wohnzimmer.", "Die Wohnung sollte ungefähr 60 Quadratmeter groß sein."] },
      { title: "Lage", items: ["Die Wohnung sollte in der Nähe meiner Arbeit liegen.", "Eine gute Busverbindung ist mir wichtig.", "Ich möchte nicht zu weit außerhalb wohnen."] },
      { title: "Miete und Kosten", items: ["Mein Budget liegt bei etwa 700 Euro im Monat.", "Ich möchte wissen, wie hoch die Nebenkosten sind.", "Die Warmmiete sollte nicht zu hoch sein."] },
      { title: "Ausstattung", items: ["Ein Balkon wäre schön.", "Ich brauche eine Küche und Platz für eine Waschmaschine.", "Internet ist für mich wichtig, weil ich manchmal zu Hause arbeite."] },
      { title: "Besichtigung", items: ["Ich würde die Wohnung gern besichtigen.", "Haben Sie am Samstag einen Termin frei?", "Könnten Sie mir bitte Fotos und weitere Informationen schicken?"] },
    ],
    vocabulary: ["die Wohnung", "die Warmmiete", "die Nebenkosten", "die Kaution", "der Balkon", "möbliert", "zentral", "ruhig", "die Besichtigung", "verfügbar"],
    modelAnswer: "Ich suche eine Zwei-Zimmer-Wohnung in einer ruhigen Lage. Die Wohnung sollte ungefähr 60 Quadratmeter groß sein und eine gute Busverbindung haben. Mein Budget liegt bei etwa 700 Euro im Monat, deshalb sind die Warmmiete und die Nebenkosten wichtig. Ein Balkon wäre schön. Ich würde die Wohnung gern besichtigen und könnte am Samstag kommen.",
  },
  8: {
    title: "More speaking help: Rezept und Essen",
    instructions: [
      "Choose one real dish first.",
      "Explain it in a useful order: dish → ingredients → preparation → steps → taste/occasion.",
      "Use command forms for the cooking steps instead of only naming ingredients.",
    ],
    phraseGroups: [
      { title: "Gericht", items: ["Ich möchte Jollof-Reis erklären.", "Mein Lieblingsgericht ist Gemüsesuppe.", "Das Gericht ist einfach und sehr beliebt."] },
      { title: "Zutaten", items: ["Man braucht Reis, Tomaten, Zwiebeln und Gewürze.", "Für zwei Personen brauche ich ...", "Außerdem braucht man etwas Öl und Salz."] },
      { title: "Vorbereitung", items: ["Zuerst wasche ich das Gemüse.", "Dann schneide ich die Zwiebeln und Tomaten klein.", "Danach bereite ich alle Zutaten vor."] },
      { title: "Kochschritte", items: ["Brate zuerst die Zwiebeln an.", "Gib dann die Tomaten dazu.", "Lass alles ungefähr zwanzig Minuten kochen."] },
      { title: "Geschmack und Anlass", items: ["Das Gericht schmeckt würzig und lecker.", "Ich esse es gern mit meiner Familie.", "Wir kochen es oft am Wochenende oder bei Feiern."] },
    ],
    vocabulary: ["die Zutaten", "schneiden", "mischen", "braten", "kochen", "dazugeben", "würzig", "süß", "salzig", "lecker"],
    modelAnswer: "Ich möchte Jollof-Reis erklären. Man braucht Reis, Tomaten, Zwiebeln, Öl und Gewürze. Zuerst schneidet man die Zwiebeln und Tomaten klein. Dann brät man die Zwiebeln an und gibt die Tomaten dazu. Danach kommt der Reis in den Topf. Das Gericht schmeckt würzig und ich esse es besonders gern mit meiner Familie.",
  },
  9: {
    title: "More speaking help: Urlaub",
    instructions: [
      "Decide whether you are talking about a past holiday or a future dream holiday.",
      "Use one clear route: place → journey → activities → weather → opinion.",
      "For a past holiday, add at least two Perfekt sentences.",
    ],
    phraseGroups: [
      { title: "Ort", items: ["Letzten Sommer war ich in Cape Coast.", "Mein Traumurlaub ist in Österreich.", "Ich möchte gern ans Meer fahren."] },
      { title: "Reise", items: ["Ich bin mit dem Bus gereist.", "Die Fahrt hat ungefähr drei Stunden gedauert.", "Wir haben in einem kleinen Hotel übernachtet."] },
      { title: "Aktivitäten", items: ["Wir haben den Strand besucht.", "Ich habe viele Fotos gemacht.", "Wir sind durch die Altstadt spaziert."] },
      { title: "Wetter", items: ["Das Wetter war warm und sonnig.", "An einem Tag hat es geregnet.", "Am Abend war es etwas kühl."] },
      { title: "Meinung", items: ["Mir hat die Reise sehr gut gefallen.", "Besonders schön fand ich den Strand.", "Ich möchte noch einmal dorthin fahren, weil es sehr entspannend war."] },
    ],
    vocabulary: ["reisen", "übernachten", "besuchen", "besichtigen", "der Strand", "die Sehenswürdigkeit", "sonnig", "regnerisch", "gefallen", "besonders"],
    modelAnswer: "Letzten Sommer bin ich nach Cape Coast gereist. Ich bin mit Freunden mit dem Bus gefahren und wir haben dort zwei Nächte übernachtet. Wir haben das Cape Coast Castle besucht und sind am Strand spazieren gegangen. Das Wetter war warm und sonnig. Mir hat die Reise sehr gut gefallen, weil sie interessant und entspannend war.",
  },
  10: {
    title: "More speaking help: Tourismus und traditionelle Feste",
    instructions: [
      "Choose one real festival or tourist place instead of trying to discuss everything.",
      "Build your answer: place → festival → food/tradition → activities → recommendation.",
      "Add one advantage, one possible problem and one personal example.",
    ],
    phraseGroups: [
      { title: "Ort", items: ["Ich möchte über München sprechen.", "In Ghana ist Cape Coast ein beliebtes Reiseziel.", "Viele Touristen besuchen diesen Ort jedes Jahr."] },
      { title: "Fest", items: ["Das Oktoberfest findet in München statt.", "Homowo ist ein wichtiges traditionelles Fest in Ghana.", "Das Fest bringt Familien und Besucher zusammen."] },
      { title: "Essen und Tradition", items: ["Es gibt traditionelle Kleidung, Musik und Essen.", "Viele Menschen essen lokale Gerichte.", "Traditionen sind wichtig, weil sie Kultur weitergeben."] },
      { title: "Aktivitäten", items: ["Besucher können tanzen, Musik hören und Sehenswürdigkeiten besuchen.", "Man kann Fotos machen und lokale Produkte kaufen.", "Es gibt viele Veranstaltungen für Familien."] },
      { title: "Tipp / Meinung", items: ["Ich empfehle das Fest, weil man viel über die Kultur lernen kann.", "Ein Problem können hohe Preise und viele Menschen sein.", "Trotzdem würde ich das Fest gern besuchen."] },
    ],
    vocabulary: ["das Fest", "die Tradition", "die Kultur", "die Sehenswürdigkeit", "der Tourist", "besuchen", "empfehlen", "überfüllt", "lokal", "besonders"],
    modelAnswer: "Ich möchte über Homowo in Ghana sprechen. Das Fest ist besonders, weil es eine wichtige Tradition ist und viele Familien zusammenkommen. Es gibt Musik, traditionelle Kleidung und lokales Essen. Besucher können viel über die Kultur lernen. Manchmal sind die Straßen sehr voll, aber ich empfehle das Fest trotzdem, weil die Atmosphäre sehr interessant ist.",
  },
  11: {
    title: "More speaking help: Verkehrsmittel vergleichen",
    instructions: [
      "Choose two transport options for one real situation, for example your way to work.",
      "Compare price, time and comfort instead of listing many vehicles.",
      "Finish with the option you prefer and explain why.",
    ],
    phraseGroups: [
      { title: "Verkehrsmittel", items: ["Ich fahre meistens mit dem Bus zur Arbeit.", "Manchmal nehme ich ein Taxi oder Bolt.", "Für kurze Strecken gehe ich zu Fuß."] },
      { title: "Preis", items: ["Der Bus ist günstiger als ein Taxi.", "Bolt ist teurer, aber manchmal praktischer.", "Ein Fahrrad kostet im Alltag wenig."] },
      { title: "Zeit", items: ["Mit dem Taxi bin ich schneller am Ziel.", "Der Bus braucht länger, besonders im Verkehr.", "Mit dem Zug kann man Staus vermeiden."] },
      { title: "Komfort", items: ["Ein Taxi ist bequemer als ein voller Bus.", "Im Zug kann ich mich besser entspannen.", "Das Fahrrad ist gesund, aber bei Regen unpraktisch."] },
      { title: "Meinung", items: ["Ich bevorzuge den Bus, weil er günstig ist.", "Wenn ich spät dran bin, nehme ich lieber Bolt.", "Für mich sind Preis und Zuverlässigkeit am wichtigsten."] },
    ],
    vocabulary: ["günstiger als", "schneller als", "bequemer als", "zuverlässig", "praktisch", "der Stau", "die Verspätung", "umweltfreundlich", "bevorzugen", "unterwegs"],
    modelAnswer: "Für meinen Arbeitsweg vergleiche ich den Bus mit Bolt. Der Bus ist deutlich günstiger, aber Bolt ist meistens schneller und bequemer. Im Berufsverkehr kann beides länger dauern. Normalerweise nehme ich den Bus, weil ich Geld sparen möchte. Wenn ich spät dran bin, nehme ich Bolt, weil es praktischer ist.",
  },
};

export const A2Days7To11ThinkingFirstGrammarGuide = ({ day }) => {
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
        Use the detailed grammar notes below after you understand the idea. The goal is to know what you want to express before choosing the form.
      </p>
    </section>
  );
};

export const getA2Days7To11SpeakingConfig = (day) => {
  const base = getA2SpeakingMindMap(day);
  if (!base) return base;
  return { ...base, extraHelp: speakingHelp[Number(day)] || base.extraHelp };
};
