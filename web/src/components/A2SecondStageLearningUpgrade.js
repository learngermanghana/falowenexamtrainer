import React from "react";

const stageContent = {
  15: {
    title: "Sport & Kursanmeldung",
    grammar: "seit + Dativ + Präsens",
    rule: "Mit seit beschreibst du etwas, das in der Vergangenheit begonnen hat und noch heute gilt. Danach steht der Dativ: seit einem Jahr, seit zwei Monaten.",
    examples: ["Ich spiele seit drei Jahren Fußball.", "Seit einem Monat gehe ich ins Fitnessstudio.", "Wie lange machst du schon Yoga? – Seit sechs Monaten."],
    speaking: "Du sprichst mit einer Person im Sportverein. Sage, welchen Sport du machst, seit wann, wie oft du trainierst und warum du ihn magst. Frage danach nach Trainingszeiten und freien Plätzen.",
    phrases: ["Ich interessiere mich für ...", "Ich mache ... seit ...", "Wie oft findet das Training statt?", "Gibt es noch freie Plätze?"],
    writing: ["Grund der E-Mail: Sportkurs", "eigene Erfahrung oder Motivation", "Trainingszeiten und Kosten erfragen", "höflicher Schluss"],
  },
  16: {
    title: "Wohlbefinden & Entspannung",
    grammar: "Reflexive Verben",
    rule: "Viele Verben rund um Wohlbefinden sind reflexiv: sich entspannen, sich ausruhen, sich fühlen. Das Reflexivpronomen passt zur Person: ich mich, du dich, er/sie sich, wir uns.",
    examples: ["Ich entspanne mich am Abend.", "Wenn ich müde bin, ruhe ich mich aus.", "Heute fühle ich mich besser."],
    speaking: "Erkläre einer Freundin oder einem Freund, was du gegen Stress machst. Nenne mindestens drei konkrete Gewohnheiten und begründe eine davon mit weil oder deshalb.",
    phrases: ["Wenn ich gestresst bin, ...", "Ich entspanne mich, indem ...", "Das hilft mir, weil ...", "Deshalb versuche ich ..."],
    writing: ["Gesundheitsproblem kurz nennen", "um einen Termin bitten", "nach Untersuchung oder Behandlung fragen", "Kosten/Versicherung höflich ansprechen"],
  },
  17: {
    title: "In der Apotheke",
    grammar: "Höfliche Wünsche mit möchte / hätte gern / könnten",
    rule: "In Service-Situationen klingt eine Bitte höflicher mit möchte, hätte gern oder könnten. Für Beschwerden benutzt man oft gegen + Akkusativ: etwas gegen Husten.",
    examples: ["Ich hätte gern etwas gegen Halsschmerzen.", "Könnten Sie mir etwas empfehlen?", "Ich möchte wissen, wie oft ich das Medikament nehmen soll."],
    speaking: "Spiele einen Apotheken-Dialog: Beschwerde nennen, Dauer nennen, nach einem Mittel fragen, Dosierung klären und höflich beenden.",
    phrases: ["Ich habe seit ...", "Haben Sie etwas gegen ...?", "Wie oft soll ich das nehmen?", "Gibt es Nebenwirkungen?"],
    writing: ["Medikament oder Problem nennen", "kurz erklären, warum du es brauchst", "Preis/Versicherung erfragen", "Dosierung oder Nebenwirkungen erfragen"],
  },
  18: {
    title: "Bei der Bank",
    grammar: "Höfliche Fragen und Bitten",
    rule: "Mit könnten, würde gern und möchte formulierst du höfliche Wünsche. Bei Fragen bleibt das Verb in der Frage früh: Könnten Sie mir helfen?",
    examples: ["Ich möchte ein Konto eröffnen.", "Könnten Sie mir bitte erklären, welche Unterlagen ich brauche?", "Ich würde gern einen Termin vereinbaren."],
    speaking: "Du bist bei der Bank. Erkläre dein Anliegen, stelle zwei konkrete Fragen und reagiere auf eine Rückfrage des Mitarbeiters.",
    phrases: ["Ich möchte ...", "Könnten Sie mir bitte ...?", "Welche Unterlagen brauche ich?", "Wie hoch sind die Gebühren?"],
    writing: ["Anliegen klar nennen", "eine konkrete Frage stellen", "zweite Information erfragen", "Termin oder Rückmeldung erbitten"],
  },
  19: {
    title: "Einkaufen",
    grammar: "oder / denn + passende Einkaufsfragen",
    rule: "oder verbindet Alternativen. denn gibt einen Grund und behält die normale Hauptsatz-Wortstellung: Ich nehme die Jacke, denn sie passt gut.",
    examples: ["Möchten Sie die blaue oder die schwarze Jacke?", "Ich nehme Größe M, denn Größe S ist zu klein.", "Die Hose gefällt mir, aber sie ist zu teuer."],
    speaking: "Führe ein Verkaufsgespräch: Produkt suchen, Größe/Farbe nennen, nach Preis fragen, zwei Optionen vergleichen und eine Entscheidung begründen.",
    phrases: ["Haben Sie das auch in ...?", "Kann ich das anprobieren?", "Wie viel kostet das?", "Ich nehme ..., denn ..."],
    writing: ["Produkt nennen", "Problem oder Wunsch beschreiben", "nach Größe/Farbe/Preis fragen", "gewünschte Lösung nennen"],
  },
  20: {
    title: "Reklamation",
    grammar: "weil / denn + höfliche Forderungen",
    rule: "Mit weil steht das Verb am Ende des Nebensatzes. Mit denn bleibt die normale Hauptsatzstellung. Für eine Reklamation kombinierst du Problem + Grund + gewünschte Lösung.",
    examples: ["Ich reklamiere den Wasserkocher, weil er nicht funktioniert.", "Ich komme heute, denn das Gerät ist schon wieder kaputt.", "Könnten Sie das Produkt bitte umtauschen?"],
    speaking: "Reklamiere ein Produkt: Kauf nennen, Problem erklären, Beleg erwähnen und eine konkrete Lösung verlangen, ohne unhöflich zu klingen.",
    phrases: ["Leider funktioniert ... nicht.", "Ich habe das Produkt am ... gekauft.", "Könnten Sie es bitte umtauschen?", "Ich hätte gern mein Geld zurück."],
    writing: ["Kaufdatum/Produkt", "Problem genau beschreiben", "Folge des Problems nennen", "Umtausch, Reparatur oder Erstattung verlangen"],
  },
  21: {
    title: "Wochenende planen",
    grammar: "wenn / ob / falls",
    rule: "wenn und falls leiten Bedingungen ein; das Verb steht im Nebensatz am Ende. ob benutzt du bei indirekten Ja/Nein-Fragen.",
    examples: ["Wenn das Wetter gut ist, gehen wir wandern.", "Falls es regnet, können wir ins Museum gehen.", "Ich weiß noch nicht, ob Anna mitkommt."],
    speaking: "Plane mit einer Person das Wochenende. Mach einen Vorschlag, frage nach ihrer Meinung, biete eine Alternative an und einigt euch auf Zeit und Treffpunkt.",
    phrases: ["Wie wäre es mit ...?", "Wenn du möchtest, können wir ...", "Falls das nicht klappt, ...", "Weißt du, ob ...?"],
    writing: ["Vorschlag für das Wochenende", "Zeit und Ort nennen", "Alternative anbieten", "um Antwort bitten"],
  },
  22: {
    title: "Die Woche planen",
    grammar: "Präsens für Zukunft + Zeitangaben + Modalverben",
    rule: "Für feste Pläne benutzt man im Deutschen oft Präsens mit einer klaren Zeitangabe. Modalverben helfen bei Pflichten und Möglichkeiten.",
    examples: ["Am Montag arbeite ich bis 17 Uhr.", "Am Dienstag muss ich zum Arzt.", "Am Freitag kann ich mich mit Freunden treffen."],
    speaking: "Erkläre deinen Wochenplan. Nenne drei Termine, eine Pflicht und eine freie Zeit. Reagiere auf den Vorschlag einer anderen Person.",
    phrases: ["Am ... habe ich ...", "Von ... bis ...", "Da kann ich leider nicht.", "Dann passt ... besser."],
    writing: ["wichtige Termine ordnen", "eine Absage begründen", "einen Alternativtermin vorschlagen", "Bestätigung erbitten"],
  },
  23: {
    title: "Arbeitsweg & Verkehr",
    grammar: "mit + Dativ / zu / nach / von ... bis",
    rule: "Verkehrsmittel stehen oft mit mit + Dativ: mit dem Bus, mit der Bahn. Für Ziele benutzt du je nach Ziel zu oder nach.",
    examples: ["Ich fahre mit dem Bus zur Arbeit.", "Morgen fahre ich nach Accra.", "Von meiner Wohnung bis zur Schule brauche ich 25 Minuten."],
    speaking: "Beschreibe deinen normalen Arbeits- oder Schulweg. Nenne Verkehrsmittel, Dauer, ein typisches Problem und eine Alternative.",
    phrases: ["Ich fahre mit ...", "Der Weg dauert ...", "Normalerweise steige ich ... um.", "Wenn es Stau gibt, ..."],
    writing: ["Start und Ziel nennen", "Verkehrsmittel und Dauer", "Problem unterwegs beschreiben", "Alternative oder Verbesserung nennen"],
  },
  24: {
    title: "Urlaub planen",
    grammar: "möchten / wollen / werden + Reiseplanung",
    rule: "möchten klingt höflicher und weniger direkt als wollen. Für Vorhersagen oder klare Zukunftsaussagen kann werden + Infinitiv benutzt werden.",
    examples: ["Wir möchten im August nach Salzburg fahren.", "Ich will dort viele Sehenswürdigkeiten besuchen.", "Das Wetter wird wahrscheinlich warm sein."],
    speaking: "Plane eine Reise mit einer Person. Entscheidet euch für Ziel, Verkehrsmittel, Unterkunft, zwei Aktivitäten und ein Budget.",
    phrases: ["Ich würde gern nach ...", "Wie fahren wir dorthin?", "Wir könnten ...", "Das ist günstiger, weil ..."],
    writing: ["Reiseziel und Zeitraum", "Unterkunft/Verkehrsmittel", "geplante Aktivitäten", "Frage oder Einladung am Schluss"],
  },
  25: {
    title: "Tagesablauf",
    grammar: "Trennbare Verben + Zeitangaben",
    rule: "Im Hauptsatz steht der abgetrennte Verbteil am Ende: aufstehen → Ich stehe um 7 Uhr auf. Zeitwörter helfen, den Ablauf klar zu ordnen.",
    examples: ["Morgens stehe ich um 6:30 Uhr auf.", "Danach ziehe ich mich an.", "Abends sehe ich noch kurz fern."],
    speaking: "Erzähle deinen Tagesablauf vom Morgen bis zum Abend. Nutze mindestens vier Zeitangaben und zwei trennbare Verben.",
    phrases: ["Zuerst ...", "Danach ...", "Am Nachmittag ...", "Bevor ich schlafen gehe, ..."],
    writing: ["Morgenroutine", "Arbeit/Schule", "Nachmittag", "Abendroutine + eine persönliche Gewohnheit"],
  },
  26: {
    title: "Gefühle ausdrücken",
    grammar: "sich fühlen + weil / wenn",
    rule: "Gefühle beschreibst du oft mit sich fühlen + Adjektiv. Gründe kannst du mit weil erklären; Situationen mit wenn.",
    examples: ["Ich fühle mich glücklich, weil ich die Prüfung bestanden habe.", "Wenn ich zu wenig schlafe, bin ich müde.", "Vor einem wichtigen Termin fühle ich mich nervös."],
    speaking: "Wähle drei Situationen und beschreibe, wie du dich fühlst und warum. Reagiere auch auf das Gefühl einer anderen Person.",
    phrases: ["Ich fühle mich ...", "Das macht mich ...", "Ich verstehe dich.", "Mir hilft es, wenn ..."],
    writing: ["Situation nennen", "Gefühl beschreiben", "Grund erklären", "Reaktion oder Lösung nennen"],
  },
  27: {
    title: "Digitale Kommunikation",
    grammar: "dass-Sätze + Modalverben",
    rule: "Mit dass gibst du Meinungen oder Informationen weiter; das Verb steht am Ende. Modalverben helfen bei Regeln und Empfehlungen.",
    examples: ["Ich finde, dass Nachrichten praktisch sind.", "Man sollte private Daten nicht überall teilen.", "Ich glaube, dass Videotelefonie sehr hilfreich ist."],
    speaking: "Diskutiere digitale Kommunikation: Nenne einen Vorteil, einen Nachteil, eine persönliche Gewohnheit und eine Regel für sicheren Umgang.",
    phrases: ["Ich finde, dass ...", "Ein Vorteil ist ...", "Man sollte ...", "Bei mir ist es so, dass ..."],
    writing: ["Anlass der Nachricht", "wichtige Information klar formulieren", "eine Bitte oder Frage", "passender freundlicher Schluss"],
  },
  28: {
    title: "Zukunft & Pläne",
    grammar: "werden + Infinitiv / hoffen, dass / möchten",
    rule: "Für Zukunftspläne kannst du Präsens oder werden + Infinitiv benutzen. Mit hoffen, dass sprichst du über Wünsche; im dass-Satz steht das Verb am Ende.",
    examples: ["Nächstes Jahr werde ich einen Deutschkurs machen.", "Ich hoffe, dass ich bald nach Deutschland reisen kann.", "Später möchte ich in meinem Beruf mehr Verantwortung übernehmen."],
    speaking: "Sprich 60–90 Sekunden über deine nächsten Jahre: Lernen, Arbeit, Familie/Freizeit und ein persönliches Ziel. Begründe mindestens zwei Pläne.",
    phrases: ["In Zukunft möchte ich ...", "Nächstes Jahr werde ich ...", "Ich hoffe, dass ...", "Das ist mir wichtig, weil ..."],
    writing: ["kurz die aktuelle Situation", "zwei konkrete Zukunftspläne", "einen Grund nennen", "ein realistisches nächstes Ziel formulieren"],
  },
};

const box = {
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  padding: 14,
  background: "#f8fbff",
  display: "grid",
  gap: 10,
};

const label = {
  margin: 0,
  fontSize: "0.78rem",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#1d4ed8",
};

const list = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };

const getStage = (day) => stageContent[Number(day)] || null;

export const A2SecondStageGrammarUpgrade = ({ day }) => {
  const content = getStage(day);
  if (!content) return null;
  return (
    <section data-a2-second-stage-grammar={day} style={box}>
      <p style={label}>A2.2 · Grammar in use</p>
      <h3 style={{ margin: 0 }}>{content.grammar}</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}>{content.rule}</p>
      <div>
        <strong>Beispiele</strong>
        <ul style={list}>{content.examples.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <p style={{ margin: 0, color: "#475569" }}><strong>Mini-Auftrag:</strong> Formuliere zwei eigene Sätze zum heutigen Thema und lies sie laut vor.</p>
    </section>
  );
};

export const A2SecondStageSpeakingUpgrade = ({ day }) => {
  const content = getStage(day);
  if (!content) return null;
  return (
    <section data-a2-second-stage-speaking={day} style={box}>
      <p style={label}>A2.2 · Real-life speaking</p>
      <h3 style={{ margin: 0 }}>{content.title}</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}>{content.speaking}</p>
      <div>
        <strong>Nützliche Redemittel</strong>
        <ul style={list}>{content.phrases.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <p style={{ margin: 0, color: "#475569" }}>Ziel: zuerst 30–45 Sekunden frei sprechen, danach dieselbe Aufgabe als kurzes Rollenspiel wiederholen.</p>
    </section>
  );
};

export const A2SecondStageWritingUpgrade = ({ day }) => {
  const content = getStage(day);
  if (!content) return null;
  return (
    <section data-a2-second-stage-writing={day} style={box}>
      <p style={label}>A2.2 · Writing plan</p>
      <h3 style={{ margin: 0 }}>Vor dem Schreiben planen</h3>
      <ol style={list}>{content.writing.map((item) => <li key={item}>{item}</li>)}</ol>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Sprachziel:</strong> 70–90 Wörter. Verbinde die Punkte mit <em>und, aber, weil, deshalb, dann, außerdem</em>, wo es passt.</p>
      <p style={{ margin: 0, color: "#475569" }}>Kontrolle vor dem Absenden: Anrede · alle Punkte beantwortet · Verbposition geprüft · Satzzeichen · Grußformel.</p>
    </section>
  );
};

export const A2_SECOND_STAGE_DAYS = Object.freeze(Object.keys(stageContent).map(Number));
