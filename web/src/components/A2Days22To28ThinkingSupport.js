import React from "react";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import { styles } from "../styles";

const grammarThinking = {
  22: {
    title: "Weekly plans: think time first, then the action",
    question: "When does it happen, and is it a fixed plan, an ability or an obligation?",
    steps: [
      "Choose the day or time first: am Montag, morgen, um 18 Uhr.",
      "For a fixed near-future plan, German often uses Präsens: Morgen treffe ich ...",
      "If you mean ability/availability, use können; if you mean obligation, use müssen.",
      "If the time phrase is first, keep the conjugated verb in position 2.",
    ],
    example: "Idea: Monday + German course + obligation → Am Montag muss ich um 18 Uhr zum Deutschkurs gehen.",
  },
  23: {
    title: "Transport and destinations: choose the relationship first",
    question: "Are you naming the transport, the destination, or the whole route?",
    steps: [
      "Transport → mit + Dativ: mit dem Bus, mit der Bahn.",
      "Walking → fixed phrase: zu Fuß.",
      "Destination person/place → often zu + Dativ: zur Arbeit, zum Bahnhof.",
      "City/country without article → nach: nach Accra, nach Berlin.",
    ],
    example: "Idea: bus + work + 30 minutes → Ich fahre mit dem Bus zur Arbeit. Der Weg dauert 30 Minuten.",
  },
  24: {
    title: "Holiday plans: decide the destination type first",
    question: "Where are you going, and what exactly do you plan to do there?",
    steps: [
      "City/country without article → nach: nach Berlin, nach Deutschland.",
      "Country with article → in + Akkusativ: in die Schweiz.",
      "Water/coast destination → often an + Akkusativ: ans Meer.",
      "For plans use möchte + infinitive, or future forms when useful.",
    ],
    example: "Idea: Switzerland + train + hotel → Ich möchte in die Schweiz fahren. Ich fahre mit dem Zug und übernachte in einem Hotel.",
  },
  28: {
    title: "Future answers: build logic, not only future vocabulary",
    question: "What is your future plan, why do you want it, and what result or contrast do you need?",
    steps: [
      "State the future plan clearly: Ich möchte ... / Ich werde ... / Nächstes Jahr ...",
      "Add a reason with weil; the verb goes to the end.",
      "Add a result with deshalb / darum / daher / deswegen; the verb comes immediately after the connector.",
      "Add contrast with trotzdem or obwohl when the idea needs it.",
    ],
    example: "Idea: work in Germany + improve German → Ich möchte in Deutschland arbeiten, weil ich neue Erfahrungen sammeln möchte. Deshalb lerne ich jeden Tag Deutsch.",
  },
};

const speakingHelp = {
  22: {
    title: "More speaking help: Meine Woche planen",
    instructions: [
      "Do not list seven weekdays. Choose three or four important moments in your real week.",
      "Build the answer as time → activity → reason/obligation → free-time balance → important appointment.",
      "Use exact times or days so the answer sounds real.",
    ],
    phraseGroups: [
      { title: "Work / study", items: ["Am Montag arbeite ich bis 17 Uhr.", "Am Dienstag habe ich Deutschkurs.", "Mittwoch muss ich für eine Prüfung lernen."] },
      { title: "Free time", items: ["Am Donnerstag treffe ich Freunde.", "Freitagabend sehe ich gern einen Film.", "Am Wochenende spiele ich Fußball."] },
      { title: "Housework", items: ["Samstagvormittag putze ich die Wohnung.", "Ich kaufe am Samstag Lebensmittel ein."] },
      { title: "Appointments", items: ["Am Mittwoch habe ich um 10 Uhr einen Termin.", "Ich muss am Freitag zur Bank gehen."] },
      { title: "Balance", items: ["Meine Woche ist ziemlich voll, deshalb plane ich alles früh.", "Sonntag möchte ich mich ausruhen."] },
    ],
    vocabulary: ["am Montag", "morgen", "um ... Uhr", "arbeiten", "lernen", "sich treffen", "einkaufen", "Termin", "müssen", "können", "deshalb"],
    modelAnswer: "Meine Woche ist ziemlich voll. Am Montag arbeite ich bis 17 Uhr und am Dienstag habe ich abends Deutschkurs. Am Mittwoch muss ich für eine Prüfung lernen. Samstagvormittag kaufe ich ein und putze die Wohnung. Am Sonntag habe ich frei, deshalb möchte ich mich ausruhen.",
  },
  23: {
    title: "More speaking help: Mein Schul- oder Arbeitsweg",
    instructions: [
      "Picture one real route you take regularly.",
      "Build it as start → transport → duration → important stop/change → reason/problem.",
      "Use the keywords to explain the journey, not just name vehicles.",
    ],
    phraseGroups: [
      { title: "Transport", items: ["Ich fahre mit dem Bus zur Arbeit.", "Ich fahre mit der Bahn zur Schule.", "Für kurze Wege gehe ich zu Fuß."] },
      { title: "Duration", items: ["Der Weg dauert ungefähr 30 Minuten.", "Mit dem Auto brauche ich nur 20 Minuten."] },
      { title: "Route", items: ["Zuerst fahre ich bis zum Bahnhof.", "Dann steige ich in einen anderen Bus um.", "Ich muss einmal umsteigen."] },
      { title: "Cost", items: ["Das Busticket kostet ...", "Ich benutze eine Monatskarte."] },
      { title: "Problem / reason", items: ["Morgens gibt es oft Stau.", "Ich nehme den Bus, weil er günstiger ist.", "Wenn es regnet, fahre ich nicht mit dem Fahrrad."] },
    ],
    vocabulary: ["mit dem Bus", "mit der Bahn", "zu Fuß", "zur Arbeit", "zur Schule", "dauern", "umsteigen", "Stau", "Monatskarte", "günstig"],
    modelAnswer: "Ich fahre jeden Morgen mit dem Bus zur Arbeit. Der Weg dauert ungefähr 35 Minuten. Zuerst fahre ich bis zum Zentrum und dort steige ich in einen zweiten Bus um. Morgens gibt es manchmal Stau. Trotzdem nehme ich den Bus, weil er günstiger als ein Taxi ist.",
  },
  24: {
    title: "More speaking help: Einen Urlaub planen",
    instructions: [
      "Choose one actual destination first. Then make the trip concrete.",
      "Build the answer as destination → transport → accommodation → two activities → budget/reason.",
      "Avoid saying only 'I want to travel'. Give details a friend could use.",
    ],
    phraseGroups: [
      { title: "Destination", items: ["Im Sommer möchte ich nach Berlin fahren.", "Ich möchte in die Schweiz reisen.", "Ich möchte ans Meer fahren."] },
      { title: "Transport", items: ["Ich fahre mit dem Zug.", "Ich fliege, weil die Reise sonst zu lang dauert."] },
      { title: "Accommodation", items: ["Ich möchte in einem kleinen Hotel übernachten.", "Wir buchen eine Ferienwohnung."] },
      { title: "Activities", items: ["Dort möchte ich Museen besuchen und die Stadt sehen.", "Ich möchte schwimmen und am Strand entspannen."] },
      { title: "Budget / reason", items: ["Mein Budget ist ungefähr ...", "Ich wähle dieses Ziel, weil ich Kultur und Natur mag."] },
    ],
    vocabulary: ["Reiseziel", "nach", "in die", "ans Meer", "Unterkunft", "Hotel", "Ferienwohnung", "buchen", "Budget", "besuchen", "übernachten"],
    modelAnswer: "Im Sommer möchte ich nach Berlin fahren. Ich fahre mit dem Zug und möchte vier Nächte in einem kleinen Hotel übernachten. Dort möchte ich Museen besuchen und eine Stadtrundfahrt machen. Mein Budget ist ungefähr 600 Euro. Ich wähle Berlin, weil ich Geschichte und Kultur interessant finde.",
  },
  25: {
    title: "More speaking help: Mein Tagesablauf",
    instructions: [
      "Think of one normal weekday, not an ideal day.",
      "Move through the day in order: morning → midday → afternoon → evening → bedtime.",
      "For each time block add one clock time, action or reason.",
    ],
    phraseGroups: [
      { title: "Morning", items: ["Ich stehe um 6 Uhr auf.", "Danach dusche ich und frühstücke.", "Um 7 Uhr fahre ich zur Arbeit."] },
      { title: "Midday", items: ["Mittags esse ich mit meinen Kollegen.", "Meine Mittagspause beginnt um 12 Uhr."] },
      { title: "Afternoon", items: ["Am Nachmittag arbeite ich weiter.", "Nach der Arbeit erledige ich manchmal Einkäufe."] },
      { title: "Evening", items: ["Abends lerne ich Deutsch.", "Danach sehe ich fern oder spreche mit meiner Familie."] },
      { title: "Routine", items: ["Normalerweise gehe ich um 22:30 Uhr ins Bett.", "Am Wochenende ist mein Tagesablauf anders."] },
    ],
    vocabulary: ["aufstehen", "frühstücken", "danach", "mittags", "am Nachmittag", "nach der Arbeit", "abends", "normalerweise", "ins Bett gehen"],
    modelAnswer: "An einem normalen Arbeitstag stehe ich um 6 Uhr auf. Danach dusche ich, frühstücke und fahre zur Arbeit. Mittags esse ich mit meinen Kollegen. Nach der Arbeit kaufe ich manchmal ein. Abends lerne ich Deutsch und um ungefähr 22:30 Uhr gehe ich ins Bett.",
  },
  26: {
    title: "More speaking help: Gefühle in Situationen",
    instructions: [
      "Choose real situations first; do not list emotion words.",
      "For each idea use situation → feeling → reason → reaction/help.",
      "Show contrast: one positive feeling and one difficult feeling make the answer stronger.",
    ],
    phraseGroups: [
      { title: "Joy", items: ["Ich freue mich, wenn ich eine Prüfung bestehe.", "Dann bin ich stolz und erleichtert."] },
      { title: "Stress", items: ["Ich bin gestresst, wenn ich zu viele Aufgaben habe.", "Dann mache ich eine kurze Pause."] },
      { title: "Fear", items: ["Vor einer wichtigen Prüfung bin ich manchmal nervös.", "Wenn ich Angst habe, spreche ich mit jemandem."] },
      { title: "Surprise", items: ["Ich bin überrascht, wenn ich unerwartet gute Nachrichten bekomme."] },
      { title: "Help", items: ["Musik hilft mir, mich zu beruhigen.", "Ich bitte meine Freunde um Hilfe, wenn ich ein Problem habe."] },
    ],
    vocabulary: ["sich freuen", "glücklich", "stolz", "erleichtert", "gestresst", "nervös", "Angst haben", "überrascht", "sich beruhigen", "Hilfe"],
    modelAnswer: "Ich freue mich sehr, wenn ich eine Prüfung bestehe, weil ich dann stolz und erleichtert bin. Vor einer wichtigen Prüfung bin ich aber oft nervös. Wenn ich zu viel Stress habe, mache ich eine Pause oder höre Musik. Manchmal spreche ich auch mit einem Freund, weil mir das hilft.",
  },
  27: {
    title: "More speaking help: Digitale Kommunikation",
    instructions: [
      "Choose the apps you really use and connect each app to a purpose.",
      "Build the answer as app → type of communication → who with → rule/habit → common problem.",
      "Compare text, voice and calls instead of simply naming apps.",
    ],
    phraseGroups: [
      { title: "App", items: ["Ich benutze WhatsApp jeden Tag.", "Für die Arbeit benutze ich oft E-Mail."] },
      { title: "Messages", items: ["Ich schreibe kurze Nachrichten an Freunde.", "Längere Informationen schicke ich lieber per E-Mail."] },
      { title: "Calls", items: ["Wenn etwas dringend ist, rufe ich an.", "Mit meiner Familie mache ich manchmal Videoanrufe."] },
      { title: "Rules / habits", items: ["Während der Arbeit schalte ich Benachrichtigungen aus.", "Ich teile keine privaten Daten mit unbekannten Personen."] },
      { title: "Problems", items: ["Manchmal ist die Internetverbindung schlecht.", "Textnachrichten können leicht missverstanden werden."] },
    ],
    vocabulary: ["die Nachricht", "der Anruf", "Videoanruf", "E-Mail", "schicken", "antworten", "dringend", "Benachrichtigung", "private Daten", "Internetverbindung", "missverstehen"],
    modelAnswer: "Ich benutze WhatsApp jeden Tag, um mit Freunden und meiner Familie zu sprechen. Für längere oder formelle Informationen benutze ich lieber E-Mail. Wenn etwas dringend ist, rufe ich direkt an. Während der Arbeit schalte ich viele Benachrichtigungen aus. Ein Problem ist, dass Nachrichten manchmal missverstanden werden können.",
  },
  28: {
    title: "More speaking help: Über meine Zukunft sprechen",
    instructions: [
      "Choose two or three future areas only; do not try to talk about everything.",
      "Build the answer as near plan → career/education → personal wish → reason → next step.",
      "Use connectors so the future answer has logic: weil, deshalb, trotzdem.",
    ],
    phraseGroups: [
      { title: "Near plan", items: ["Nächstes Jahr möchte ich ...", "In den nächsten Monaten werde ich ..."] },
      { title: "Career", items: ["Beruflich möchte ich ...", "Ich möchte meine Deutschkenntnisse verbessern, um ..."] },
      { title: "Family / personal life", items: ["Später möchte ich eine Familie gründen.", "Ich möchte mehr Zeit für meine Familie haben."] },
      { title: "Travel / experience", items: ["Ich möchte neue Länder kennenlernen.", "Ich plane, Deutschland wieder zu besuchen."] },
      { title: "Reason / next step", items: ["Dieses Ziel ist mir wichtig, weil ...", "Deshalb lerne ich schon jetzt ...", "Es ist nicht einfach. Trotzdem möchte ich es versuchen."] },
    ],
    vocabulary: ["in Zukunft", "nächstes Jahr", "planen", "möchten", "werden", "Ziel", "Beruf", "Familie", "reisen", "weil", "deshalb", "trotzdem"],
    modelAnswer: "In Zukunft möchte ich meine Deutschkenntnisse weiter verbessern. Beruflich möchte ich mehr Verantwortung übernehmen, weil ich mich weiterentwickeln möchte. Außerdem plane ich, wieder nach Deutschland zu reisen. Dieses Ziel kostet Zeit und Geld. Trotzdem möchte ich es erreichen, deshalb lerne und plane ich schon jetzt regelmäßig.",
  },
};

export const A2Days22To28ThinkingFirstGrammarGuide = ({ day }) => {
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
        Use this thinking route before the detailed grammar note. First decide the meaning; then choose the German structure.
      </p>
    </section>
  );
};

export const getA2Days22To28SpeakingConfig = (day) => {
  const base = getA2SpeakingMindMap(day);
  if (!base) return base;
  return { ...base, extraHelp: speakingHelp[Number(day)] || base.extraHelp };
};
