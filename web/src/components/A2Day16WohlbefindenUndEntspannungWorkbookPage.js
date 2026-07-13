import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const sectionStyle = { display: "grid", gap: 12 };
const boxStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 14,
  background: "#f8fafc",
  display: "grid",
  gap: 8,
};

const sprechenContent = (
  <div style={sectionStyle}>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      In this chapter, we&apos;ll engage in group exercises discussing these topics.
    </p>
    <h3 style={{ margin: 0 }}>Zentrales Thema: „Wohlbefinden, Entspannung &amp; Gesundheit“</h3>
    <p style={{ margin: 0 }}>
      <strong>Leitfrage:</strong> Was machst du, um dich zu entspannen und dich wohlzufühlen?
    </p>

    <ol style={listStyle}>
      <li>
        <strong>Körperliches Wohlbefinden (Physical Well-being)</strong>
        <ul style={listStyle}>
          <li>Gesunde Ernährung: Obst, Gemüse, viel Wasser trinken</li>
          <li>Bewegung: Sport treiben, spazieren gehen, Yoga machen</li>
          <li>Schlaf: genug schlafen, früher ins Bett gehen</li>
          <li>Wellness: Massagen, Sauna, heiße Bäder</li>
        </ul>
      </li>
      <li>
        <strong>Mentales Wohlbefinden (Mental Well-being)</strong>
        <ul style={listStyle}>
          <li>Entspannung: Meditation, Atemübungen, Ruhe genießen</li>
          <li>Hobbys: lesen, Musik hören, kreativ sein</li>
          <li>Digitale Auszeit: weniger Zeit am Handy, soziale Medien pausieren</li>
          <li>Freunde &amp; Familie: Gespräche führen, lachen, Zeit zusammen verbringen</li>
        </ul>
      </li>
      <li>
        <strong>Krankheiten &amp; Symptome (Illnesses &amp; Symptoms)</strong>
        <ul style={listStyle}>
          <li>Krankheiten: Erkältung, Grippe, Kopfschmerzen, Bauchschmerzen, Fieber, Husten</li>
          <li>Symptome: Halsschmerzen, Schnupfen, Schwindel, Übelkeit, Müdigkeit</li>
        </ul>
      </li>
      <li>
        <strong>Beim Arzt (At the Doctor&apos;s)</strong>
        <ul style={listStyle}>
          <li>Termin machen: „Ich möchte einen Termin vereinbaren.“</li>
          <li>Gespräch beim Arzt: „Was fehlt Ihnen?“ – „Ich habe Kopfschmerzen.“</li>
          <li>Untersuchung &amp; Diagnose: „Wir machen einen Bluttest.“ – „Sie brauchen ein Rezept.“</li>
        </ul>
      </li>
      <li>
        <strong>Körperteile (Parts of the Body)</strong>
        <ul style={listStyle}>
          <li>Kopf, Hals, Bauch, Rücken</li>
          <li>Arm, Hand, Finger</li>
          <li>Bein, Fuß, Zehen</li>
          <li>Auge, Nase, Ohr</li>
        </ul>
      </li>
      <li>
        <strong>Gesunde Lebensweise (Healthy Living)</strong>
        <ul style={listStyle}>
          <li>Ernährung: viel Gemüse und Obst essen, ausreichend Wasser trinken</li>
          <li>Sport &amp; Bewegung: joggen, Yoga machen, schwimmen, spazieren gehen</li>
          <li>Entspannung: genug schlafen, Stress abbauen</li>
          <li>Regelmäßige Vorsorgeuntersuchungen: Arztbesuche nicht vergessen</li>
        </ul>
      </li>
      <li>
        <strong>Medizin &amp; Heilmittel (Medicine &amp; Remedies)</strong>
        <ul style={listStyle}>
          <li>Verschreibungspflichtige Medikamente: Antibiotika, Schmerzmittel</li>
          <li>Freiverkäufliche Medikamente: Nasenspray, Hustensaft, Halstabletten</li>
          <li>Hausmittel: Kräutertee, inhalieren, Ingwer mit Honig</li>
        </ul>
      </li>
      <li>
        <strong>Freizeit &amp; Stressbewältigung (Leisure &amp; Coping with Stress)</strong>
        <ul style={listStyle}>
          <li>Musik &amp; Kunst: Instrument spielen, malen, tanzen</li>
          <li>Lesen &amp; Filme: Bücher lesen, Filme oder Serien schauen</li>
          <li>Natur genießen: wandern, am Strand entspannen, Gartenarbeit</li>
          <li>Spiele &amp; Unterhaltung: Videospiele, Brettspiele, Sport</li>
        </ul>
      </li>
      <li>
        <strong>Eigene Meinung (Own Opinion)</strong>
        <ul style={listStyle}>
          <li>Was machst du, um dich zu entspannen?</li>
          <li>Wie wichtig ist Gesundheit für dich?</li>
          <li>Wie verbringst du deine Freizeit?</li>
          <li>Hast du schon einmal eine Krankheit gehabt? Wie hast du dich gefühlt?</li>
        </ul>
      </li>
    </ol>

    <div style={boxStyle}>
      <strong>Beispielantwort</strong>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        „Wenn ich gestresst bin, höre ich Musik und lese ein Buch. Ich gehe auch oft spazieren, um frische Luft zu bekommen.
        Gesundheit ist mir sehr wichtig, deshalb esse ich viel Obst und Gemüse. Wenn ich krank bin, trinke ich Kräutertee und
        schlafe viel.“
      </p>
    </div>
  </div>
);

const schreibenContent = (
  <div style={sectionStyle}>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      <strong>Aufgabenstellung (A2-Niveau):</strong> Sie möchten einen Arzt wegen Ihrer Gesundheit kontaktieren. Schreiben Sie
      einen Brief oder eine E-Mail an den Arzt.
    </p>
    <ol style={listStyle}>
      <li>Fragen Sie nach einem Termin, zum Beispiel wann Sie kommen können.</li>
      <li>Fragen Sie nach den Kosten oder ob Ihre Versicherung die Behandlung abdeckt.</li>
      <li>Fragen Sie nach möglichen Untersuchungen oder Behandlungen, die der Arzt vorschlägt.</li>
    </ol>
  </div>
);

const lesenText = `Anzeige A: Yoga-Kurs für Anfänger
Jeden Montag und Donnerstag von 18:00 bis 19:00 Uhr bieten wir Yoga-Kurse für Anfänger an. Unser erfahrener Lehrer hilft Ihnen, die Grundlagen des Yoga zu erlernen und Ihre Flexibilität sowie Ihr allgemeines Wohlbefinden zu verbessern. Die Teilnahme ist kostenlos, aber eine vorherige Anmeldung ist erforderlich. Kontaktieren Sie uns unter yoga@fit.de oder rufen Sie uns unter 030-987654321 an.

Anzeige B: Fitnessstudio Mitgliedschaft
Profitieren Sie von unserem exklusiven Sommerangebot und erhalten Sie 20% Rabatt auf alle Jahresmitgliedschaften. Unser Fitnessstudio bietet eine Vielzahl von Kursen, moderne Trainingsgeräte und persönliche Trainingsprogramme. Besuchen Sie uns in der Hauptstraße 12 oder rufen Sie uns unter 030-123456789 an, um mehr zu erfahren. Unser Team freut sich darauf, Ihnen zu helfen, Ihre Fitnessziele zu erreichen.

Anzeige C: Gesunde Ernährung Kochkurs
Lernen Sie, wie man leckere und gesunde Mahlzeiten zubereitet. Unser Kochkurs findet jeden Samstag um 10:00 Uhr statt und bietet praktische Tipps zur Verbesserung Ihrer Ernährungsgewohnheiten. Unsere erfahrenen Köche zeigen Ihnen, wie man einfache, gesunde Rezepte mit frischen Zutaten zubereitet. Für weitere Informationen und zur Anmeldung schreiben Sie an kochkurs@gesund.de oder besuchen Sie unsere Website www.gesund-kochen.de.

Anzeige D: Zahnarztpraxis Dr. Müller
Wir bieten umfassende zahnärztliche Versorgung, einschließlich Zahnreinigung, Vorsorgeuntersuchungen und Behandlungen. Unsere Praxis ist von Montag bis Freitag von 8:00 bis 18:00 Uhr geöffnet. Vereinbaren Sie einen Termin unter 030-123456 oder besuchen Sie uns in der Zahnstraße 5. Ihr Lächeln ist uns wichtig!

Anzeige E: Physiotherapiezentrum Gesund
Unsere spezialisierten Therapeuten bieten Behandlungen für Rückenschmerzen, Sportverletzungen und andere Beschwerden. Wir erstellen individuelle Therapiepläne, die auf Ihre speziellen Bedürfnisse abgestimmt sind. Termine sind nach Vereinbarung möglich. Kontaktieren Sie uns unter physiotherapie@gesund.de oder rufen Sie uns unter 030-654321987 an.

Anzeige F: Laufgruppe im Stadtpark
Treffen Sie sich mit anderen Laufbegeisterten und bleiben Sie fit. Unsere Laufgruppe trifft sich jeden Sonntag um 9:00 Uhr am Haupteingang des Stadtparks. Egal ob Anfänger oder Fortgeschrittene, alle sind willkommen. Genießen Sie die frische Luft und die Gemeinschaft. Für weitere Informationen schreiben Sie an laufgruppe@gesund.de.`;

const lesenQuestions = [
  {
    stem: "Welche Anzeige informiert über einen Kochkurs für gesunde Ernährung?",
    options: ["A) Anzeige A", "B) Anzeige C", "C) Anzeige D", "D) Anzeige F"],
  },
  {
    stem: "Wo kann man einen Rabatt für eine Jahresmitgliedschaft im Fitnessstudio bekommen?",
    options: ["A) Anzeige B", "B) Anzeige A", "C) Anzeige E", "D) Anzeige C"],
  },
  {
    stem: "Wer bietet Physiotherapie speziell für Rückenschmerzen an?",
    options: ["A) Anzeige D", "B) Anzeige E", "C) Anzeige B", "D) Anzeige F"],
  },
  {
    stem: "Welche Anzeige ist für eine Laufgruppe im Stadtpark?",
    options: ["A) Anzeige A", "B) Anzeige C", "C) Anzeige F", "D) Anzeige D"],
  },
  {
    stem: "Wo kann man einen Yoga-Kurs für Anfänger besuchen?",
    options: ["A) Anzeige A", "B) Anzeige B", "C) Anzeige E", "D) Anzeige D"],
  },
];

const hoerenQuestions = [
  {
    stem: "Was wird als ein einfacher Anfang für eine gesunde Ernährung empfohlen?",
    options: ["A) Mehr Fleisch essen", "B) Mehr Obst und Gemüse essen", "C) Mehr Fast Food essen"],
  },
  {
    stem: "Wie lange sollte man täglich mindestens gehen oder sich bewegen?",
    options: ["A) 10 Minuten", "B) 20 Minuten", "C) 30 Minuten"],
  },
  {
    stem: "Was kann motivierend sein, um fit zu bleiben?",
    options: ["A) Der Besuch eines Fitnessstudios", "B) Mehr zu schlafen", "C) Mehr Fernsehen schauen"],
  },
  {
    stem: "Warum ist der regelmäßige Besuch beim Arzt wichtig?",
    options: ["A) Um neue Rezepte zu bekommen", "B) Um Krankheiten frühzeitig zu erkennen", "C) Um Medikamente zu kaufen"],
  },
  {
    stem: "Welche Sportarten werden im Text als motivierend erwähnt?",
    options: ["A) Yoga und Pilates", "B) Schwimmen und Laufen", "C) Tanzen und Radfahren"],
  },
];

export default function A2Day16WohlbefindenUndEntspannungWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={16}
      title="Wohlbefinden und Entspannung"
      chapter="6.16"
      workbookId="A2Day16WohlbefindenUndEntspannung"
      topicPrompt="Was machen Sie für Ihr Wohlbefinden, Ihre Entspannung und Ihre Gesundheit?"
      sprechenContent={sprechenContent}
      schreibenTask="E-Mail an einen Arzt wegen Ihrer Gesundheit"
      schreibenContent={schreibenContent}
      schreibenPlaceholder="Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen, weil ..."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Hören Sie den Text über gesunde Ernährung, Bewegung, Fitness und regelmäßige Arztbesuche. Wählen Sie jeweils die richtige Antwort."
      hoerenAudioUrl="https://drive.google.com/file/d/1xexwu1sM-Prp_2iyhBbY7UP-91gJ1S5G/view?usp=sharing"
      hoerenQuestions={hoerenQuestions}
    />
  );
}
