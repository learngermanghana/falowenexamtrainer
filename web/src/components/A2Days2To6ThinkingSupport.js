import React from "react";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import { styles } from "../styles";

const grammarThinking = {
  2: {
    title: "Adjective endings: think about the noun first",
    question: "What are you describing, and is it the subject or the object?",
    steps: [
      "1. Find the noun: Hund, Blume, Auto, Bücher.",
      "2. Ask: subject (Nominativ) or object (Akkusativ)?",
      "3. Check the article: ein, eine, einen, keine.",
      "4. Add the adjective ending: ein großer Hund / einen kleinen Hund.",
    ],
    example: "Idea: I see a small dog → object → masculine → einen → kleinen → Ich sehe einen kleinen Hund.",
  },
  3: {
    title: "Comparisons: decide equal or different first",
    question: "Are the two things equal, or is one different from the other?",
    steps: [
      "Equal / gleich → so oder genauso + adjective + wie.",
      "Different / unterschiedlich → comparative + als.",
      "One is number 1 in a group → am + superlative.",
      "Build the meaning first, then choose als or wie.",
    ],
    example: "Idea: The train is faster than the bus → different → schneller + als → Der Zug ist schneller als der Bus.",
  },
  4: {
    title: "Wo oder Wohin: first ask location or movement",
    question: "Is something already in a place, or is it moving to a place?",
    steps: [
      "Wo? = location / position → usually Dativ.",
      "Wohin? = movement to a destination → usually Akkusativ.",
      "Think of the picture: already there or moving there?",
      "Then choose the article: im Park / in den Park.",
    ],
    example: "Idea: We meet in the park → location → Wo? → im Park. We go to the park → movement → Wohin? → in den Park.",
  },
  5: {
    title: "Separable verbs: find the verb in two pieces",
    question: "Does the verb have a prefix that separates in a normal main sentence?",
    steps: [
      "Start with the full verb: fernsehen, einkaufen, aufstehen.",
      "Conjugate the main verb part: ich sehe / ich kaufe / ich stehe.",
      "Move the prefix to the end: fern / ein / auf.",
      "Add time, person or reason to make the sentence useful.",
    ],
    example: "Idea: I watch TV in the evening → fernsehen → Ich sehe am Abend fern.",
  },
  6: {
    title: "Two-way prepositions: picture position versus movement",
    question: "Where is the object now, or where are you moving it?",
    steps: [
      "Wo? = position → Dativ: Der Stuhl steht neben dem Tisch.",
      "Wohin? = movement → Akkusativ: Ich stelle den Stuhl neben den Tisch.",
      "Use stehen/liegen for position and stellen/legen for movement when helpful.",
      "Think first: no movement or movement? Then choose the case.",
    ],
    example: "Idea: The book is on the table → position → auf dem Tisch. I put the book on the table → movement → auf den Tisch.",
  },
};

const speakingHelp = {
  2: {
    title: "More speaking help: Eine Person beschreiben",
    instructions: [
      "Choose one real person you know. Do not start with random adjectives.",
      "Build the answer in this order: relationship → appearance → clothes → character → your opinion.",
      "For every keyword, turn it into one full sentence and then add one extra detail.",
    ],
    phraseGroups: [
      { title: "Relationship / Beziehung", items: ["Das ist meine Schwester / mein Freund / mein Kollege.", "Ich kenne sie aus der Schule.", "Wir arbeiten zusammen."] },
      { title: "Appearance / Aussehen", items: ["Er ist groß und sportlich.", "Sie hat lange schwarze Haare und braune Augen.", "Er hat einen Bart."] },
      { title: "Clothes / Kleidung", items: ["Sie trägt oft ein Kleid.", "Er trägt eine Brille und meistens ein Hemd.", "Ihre Lieblingsfarbe ist blau."] },
      { title: "Character / Charakter", items: ["Sie ist freundlich und geduldig.", "Er ist ruhig, aber sehr lustig.", "Sie hilft anderen gern."] },
      { title: "Opinion / Meinung", items: ["Ich finde sie sympathisch, weil sie gut zuhört.", "Ich mag ihn, weil er immer hilfsbereit ist."] },
    ],
    vocabulary: ["groß", "klein", "mittelgroß", "Haare", "Augen", "Brille", "Bart", "freundlich", "ruhig", "lustig", "hilfsbereit", "geduldig", "tragen", "aussehen"],
    modelAnswer: "Ich möchte meine Schwester beschreiben. Sie ist mittelgroß und hat lange schwarze Haare und braune Augen. Sie trägt oft Jeans und eine Brille. Vom Charakter her ist sie freundlich, ruhig und sehr hilfsbereit. Ich finde sie besonders sympathisch, weil sie immer gut zuhört.",
  },
  3: {
    title: "More speaking help: Zwei Dinge oder Personen vergleichen",
    instructions: [
      "Choose two clear things first: two people, two phones, two cities or two transport options.",
      "Say one similarity, two differences and your opinion.",
      "Use keywords to create ideas, not just to list vocabulary.",
    ],
    phraseGroups: [
      { title: "Choose / Auswahl", items: ["Ich vergleiche meinen Bruder mit meiner Schwester.", "Ich vergleiche Accra mit Kumasi.", "Ich vergleiche mein altes Handy mit meinem neuen Handy."] },
      { title: "Similar / Gemeinsamkeiten", items: ["Beide sind freundlich.", "Beide Handys sind modern.", "Accra ist genauso interessant wie Kumasi."] },
      { title: "Different / Unterschiede", items: ["Mein Bruder ist größer als meine Schwester.", "Das neue Handy ist schneller als das alte.", "Accra ist größer als Kumasi."] },
      { title: "Price and quality", items: ["Das neue Handy ist teurer, aber die Kamera ist besser.", "Der Bus ist günstiger als das Taxi."] },
      { title: "Your opinion", items: ["Ich finde das neue Handy besser, weil es schneller ist.", "Ich bevorzuge den Bus, weil er günstiger ist."] },
    ],
    vocabulary: ["größer als", "kleiner als", "schneller als", "teurer als", "günstiger als", "besser als", "genauso ... wie", "beide", "aber", "weil"],
    modelAnswer: "Ich vergleiche mein altes Handy mit meinem neuen Handy. Beide Handys sind modern, aber das neue Handy ist größer und schneller als das alte. Es ist auch teurer, aber die Kamera ist besser. Ich finde das neue Handy besser, weil der Akku länger hält.",
  },
  4: {
    title: "More speaking help: Ein Treffen planen",
    instructions: [
      "Think of a real plan: activity → place → time → how you get there → confirmation.",
      "Do not say only a place. Explain what you want to do there.",
      "Use one alternative if the first plan is not possible.",
    ],
    phraseGroups: [
      { title: "Activity / Aktivität", items: ["Wollen wir ins Kino gehen?", "Wir könnten in einem Café etwas trinken.", "Lass uns im Park spazieren gehen."] },
      { title: "Place / Treffpunkt", items: ["Treffen wir uns vor dem Kino.", "Wir können uns am Bahnhof treffen.", "Treffen wir uns im Park am Haupteingang."] },
      { title: "Time / Zeit", items: ["Hast du am Samstag um 18 Uhr Zeit?", "Passt dir Sonntag Nachmittag?", "Um 17 Uhr wäre gut für mich."] },
      { title: "Travel / Anreise", items: ["Ich komme mit dem Bus.", "Ich fahre mit der Bahn, weil es schneller ist.", "Ich kann zu Fuß kommen."] },
      { title: "Confirm / Bestätigung", items: ["Gut, dann treffen wir uns am Samstag um 18 Uhr.", "Wenn das nicht geht, können wir uns am Sonntag treffen.", "Abgemacht, bis dann!"] },
    ],
    vocabulary: ["sich treffen", "Treffpunkt", "passen", "am Samstag", "um 18 Uhr", "vor dem Kino", "im Park", "mit dem Bus", "Alternative", "abgemacht"],
    modelAnswer: "Wollen wir am Samstag ins Kino gehen? Wir können uns um 18 Uhr vor dem Kino treffen. Ich komme mit dem Bus, weil die Haltestelle direkt dort ist. Wenn Samstag nicht passt, können wir uns am Sonntag treffen. Abgemacht, bis dann!",
  },
  5: {
    title: "More speaking help: Freizeit",
    instructions: [
      "Start with one hobby you really do or want to do.",
      "Add when, how often, where and with whom.",
      "Finish with a reason or feeling so the answer is not only a list.",
    ],
    phraseGroups: [
      { title: "Hobby", items: ["In meiner Freizeit spiele ich Fußball.", "Ich lese gern Romane.", "Ich interessiere mich für Musik."] },
      { title: "When and how often", items: ["Am Wochenende spiele ich Fußball.", "Ich gehe zweimal pro Woche joggen.", "Abends lese ich oft."] },
      { title: "Where", items: ["Ich trainiere im Sportverein.", "Ich lese meistens zu Hause.", "Ich jogge im Park."] },
      { title: "With whom", items: ["Ich spiele mit meinen Freunden.", "Manchmal gehe ich mit meiner Schwester spazieren.", "Ich mache Yoga allein."] },
      { title: "Reason and feeling", items: ["Ich mag Fußball, weil es Spaß macht.", "Ich lese gern, weil ich mich dabei entspannen kann.", "Danach fühle ich mich ruhig und fit."] },
    ],
    vocabulary: ["in meiner Freizeit", "am Wochenende", "oft", "manchmal", "zweimal pro Woche", "mit Freunden", "gern", "Spaß machen", "sich entspannen", "sich interessieren für"],
    modelAnswer: "In meiner Freizeit spiele ich gern Fußball. Ich spiele meistens am Wochenende mit meinen Freunden auf einem Sportplatz. Manchmal gehe ich auch im Park joggen. Ich mag Sport, weil es Spaß macht und ich mich danach fit und entspannt fühle.",
  },
  6: {
    title: "More speaking help: Meine Wohnung und mein Zimmer",
    instructions: [
      "Choose one room first and create a picture in your head.",
      "Name the furniture, then say where each item is.",
      "Add colors, condition and your favourite place. Use movement only when you explain a change.",
    ],
    phraseGroups: [
      { title: "Room / Raum", items: ["Ich beschreibe mein Wohnzimmer.", "Mein Schlafzimmer ist klein, aber hell.", "Die Küche ist neben dem Wohnzimmer."] },
      { title: "Furniture / Möbel", items: ["Im Wohnzimmer gibt es ein Sofa, einen Tisch und zwei Stühle.", "In meinem Zimmer stehen ein Bett und ein Schrank."] },
      { title: "Position / Wo?", items: ["Das Sofa steht neben dem Fenster.", "Der Teppich liegt unter dem Tisch.", "Die Lampe steht auf dem Schreibtisch."] },
      { title: "Change / Wohin?", items: ["Ich stelle den Stuhl neben den Tisch.", "Ich lege das Buch auf den Schreibtisch.", "Ich hänge das Bild an die Wand."] },
      { title: "Favourite place", items: ["Am liebsten sitze ich auf dem Sofa am Fenster.", "Dort kann ich lesen und mich entspannen."] },
    ],
    vocabulary: ["das Wohnzimmer", "das Schlafzimmer", "das Sofa", "der Tisch", "der Stuhl", "der Schrank", "das Bett", "neben", "unter", "auf", "zwischen", "stehen", "liegen", "stellen", "legen"],
    modelAnswer: "Ich beschreibe mein Wohnzimmer. Es ist hell und gemütlich. Dort gibt es ein Sofa, einen Tisch, zwei Stühle und einen Schrank. Das Sofa steht neben dem Fenster und der Teppich liegt unter dem Tisch. Am liebsten sitze ich auf dem Sofa, weil ich dort lesen und mich entspannen kann.",
  },
};

export const A2ThinkingFirstGrammarGuide = ({ day }) => {
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
        The detailed notes below give you the forms and examples. Use this thinking routine first so the rule has a purpose.
      </p>
    </section>
  );
};

export const getA2Days2To6SpeakingConfig = (day) => {
  const base = getA2SpeakingMindMap(day);
  if (!base) return base;
  return { ...base, extraHelp: speakingHelp[Number(day)] || base.extraHelp };
};
