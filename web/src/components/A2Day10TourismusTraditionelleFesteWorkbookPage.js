import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";

const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 };
const helpCardStyle = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#f8fafc", display: "grid", gap: 8 };

const sprechenContent = (
  <>
    <SpeakingMindMap config={getA2SpeakingMindMap(10)} />

    <WorkbookTaskCard eyebrow="Teil 1 · Practice and class discussion" title="Tourismus und traditionelle Feste" practiceOnly>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Wähle lieber ein konkretes Fest oder einen konkreten Reiseort. Sprich dann in einer klaren Reihenfolge:
        <strong> Ort → Fest/Tradition → Aktivitäten → Vorteil/Nachteil → eigene Meinung.</strong>
      </p>
      <div style={gridStyle}>
        <div style={helpCardStyle}>
          <strong>Tourismus</strong>
          <ul style={listStyle}>
            <li>Neue Kulturen und Menschen kennenlernen</li>
            <li>Sehenswürdigkeiten besuchen</li>
            <li>Sprache üben und neue Erfahrungen sammeln</li>
            <li>Problem: hohe Kosten, Lärm oder zu viele Besucher</li>
          </ul>
        </div>
        <div style={helpCardStyle}>
          <strong>Traditionelle Feste</strong>
          <ul style={listStyle}>
            <li>Oktoberfest, Weihnachten, Karneval, Ostern, Silvester</li>
            <li>Musik, Essen, Kleidung und lokale Traditionen</li>
            <li>Feste bringen Familien und Besucher zusammen</li>
            <li>Traditionen zeigen und bewahren Kultur</li>
          </ul>
        </div>
      </div>
      <p style={{ margin: 0 }}><strong>Fragen zur Diskussion:</strong></p>
      <ul style={listStyle}>
        <li>Welches Fest gibt es in deinem Heimatland?</li>
        <li>Warum ist dieses Fest besonders?</li>
        <li>Welche Orte besuchen Touristen in deinem Land gern?</li>
        <li>Welche Vorteile und Probleme kann Tourismus bringen?</li>
        <li>Welches Fest möchtest du einmal besuchen? Warum?</li>
      </ul>
      <div style={{ ...helpCardStyle, background: "#fff7ed" }}>
        <strong>Mini-Präsentation</strong>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          „Heute spreche ich über Homowo in Ghana. Das Fest ist besonders, weil es eine wichtige Tradition ist.
          Es gibt Musik, traditionelle Kleidung und lokales Essen. Viele Besucher können dort viel über die Kultur lernen.
          Manchmal sind die Straßen sehr voll. Trotzdem empfehle ich das Fest, weil die Atmosphäre sehr interessant ist.“
        </p>
      </div>
    </WorkbookTaskCard>
  </>
);

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Informelle Briefaufgabe" title="Einen Freund oder eine Freundin zu einem Fest einladen">
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Schreiben Sie einen Brief an einen Freund oder eine Freundin und laden Sie die Person zu einem Fest ein.
    </p>
    <ol style={listStyle}>
      <li>Erzählen Sie von dem Fest und warum es besonders ist.</li>
      <li>Laden Sie die Person ein und nennen Sie Datum und Ort.</li>
      <li>Erklären Sie, was die Person mitbringen sollte oder was sie dort erwarten kann.</li>
    </ol>
    <p style={{ margin: 0, color: "#1d4ed8", fontWeight: 700 }}>
      Schreiben Sie ungefähr 60–80 Wörter und kopieren Sie Ihre fertige Antwort anschließend in den Submit-Tab.
    </p>
  </WorkbookTaskCard>
);

const lesenText = `Grundrechte und gesellschaftliches Leben in Deutschland

Die deutsche Verfassung heißt Grundgesetz. Im Grundgesetz stehen die wichtigsten rechtlichen und politischen Regeln der Bundesrepublik Deutschland. Im Grundgesetz steht zum Beispiel, dass Deutschland ein demokratischer Staat ist.

Das heißt: Jeder kann beim politischen Leben mitmachen, zum Beispiel in Verbänden, Initiativen, Gewerkschaften oder Parteien. Die politischen Parteien haben verschiedene Programme und Ziele. Die größten Parteien heißen SPD, CDU, Bündnis 90/Die Grünen, FDP, AfD und Die Linke. Es gibt noch viele andere kleinere Parteien.

Im Grundgesetz stehen auch die Rechte und Pflichten von Menschen in Deutschland. Wichtige Pflichten sind die Schulpflicht, die Steuerpflicht und die Pflicht zur Einhaltung der Gesetze.

Wichtige Rechte sind die Menschenwürde, die Gleichberechtigung, die Gleichheit vor dem Gesetz, das Recht auf freie Meinungsäußerung, die Versammlungsfreiheit, die Freizügigkeit, die Berufsfreiheit, der Schutz von Ehe und Familie, das Wahlrecht und die Religionsfreiheit.

Das Wahlrecht sagt: Die Menschen in Deutschland dürfen wählen und sie dürfen auch gewählt werden. Die Wahlen müssen geheim, allgemein und frei sein. Es gibt die Europawahl, die Bundestagswahl, die Landtagswahl und die Kommunalwahl. Bei Europawahlen und Kommunalwahlen dürfen auch EU-Bürger wählen, die in Deutschland wohnen.

Normalerweise ist das ab 18 Jahren. In einigen Bundesländern kann man bei Kommunalwahlen auch schon ab 16 Jahren wählen. Bei Landtagswahlen und Bundestagswahlen dürfen nur deutsche Bürger wählen, die mindestens 18 Jahre alt sind.

An vielen Orten gibt es Integrationsräte oder Integrationsbeiräte. Sie werden normalerweise von Migranten gewählt. Sie vertreten politische Interessen von Migranten, helfen bei Fragen und Problemen und wollen das Zusammenleben verbessern.

Die Religionsfreiheit sagt: Jeder darf seine Religion frei wählen und ausüben. In den Schulen gibt es unter anderem evangelischen und katholischen Religionsunterricht und an manchen Schulen auch christlich-orthodoxen, jüdischen und islamischen Religionsunterricht.

In Deutschland kann die sexuelle Orientierung offen ausgelebt werden. Seit dem 1. Oktober 2017 dürfen auch gleichgeschlechtliche Paare in Deutschland mit allen Rechten und Pflichten heiraten.`;

const lesenQuestions = [
  {
    stem: "Was steht im Grundgesetz?",
    options: [
      "a) Die Namen aller Politiker in Deutschland",
      "b) Die wichtigsten rechtlichen und politischen Regeln",
      "c) Die Schulnoten der Schüler in Deutschland",
    ],
  },
  {
    stem: "Was ist ein Beispiel für eine Pflicht laut Grundgesetz?",
    options: ["a) Man muss einen Führerschein haben", "b) Man muss eine Partei gründen", "c) Man muss Steuern zahlen"],
  },
  {
    stem: "Welche Aussage über das Wahlrecht ist richtig?",
    options: ["a) Nur Männer dürfen wählen", "b) EU-Bürger dürfen bei Kommunalwahlen wählen", "c) Wählen darf man nur ab 21 Jahren"],
  },
  {
    stem: "Was macht ein Integrationsbeirat?",
    options: ["a) Er kontrolliert den Unterricht", "b) Er vertritt die Interessen von Migranten", "c) Er plant Autobahnen"],
  },
  {
    stem: "Welche Religionen haben in deutschen Schulen teilweise eigenen Unterricht?",
    options: [
      "a) Christlich-orthodox, jüdisch, islamisch, evangelisch und katholisch",
      "b) Nur buddhistisch",
      "c) Nur atheistisch",
    ],
  },
  {
    stem: "Seit wann dürfen gleichgeschlechtliche Paare in Deutschland heiraten?",
    options: ["a) Seit 2005", "b) Seit 1. Oktober 2017", "c) Seit 1990"],
  },
  {
    stem: "Was bedeutet Religionsfreiheit?",
    options: ["a) Man darf keine Religion zeigen", "b) Der Staat bestimmt die Religion", "c) Jeder darf seine Religion frei wählen und ausüben"],
  },
];

const hoerenQuestions = [
  {
    stem: "Wo findet das Oktoberfest statt?",
    options: ["a) Berlin", "b) Hamburg", "c) München", "d) Frankfurt"],
  },
  {
    stem: "Wie lange dauert das Oktoberfest?",
    options: ["a) Eine Woche", "b) Zwei Wochen", "c) Drei Wochen", "d) Vier Wochen"],
  },
  {
    stem: "Welche traditionellen Gerichte werden auf dem Oktoberfest serviert?",
    options: [
      "a) Pizza und Pasta",
      "b) Brezeln, Bratwurst und Schweinebraten",
      "c) Sushi und Ramen",
      "d) Tacos und Burritos",
    ],
  },
  {
    stem: "Welche Kleidung tragen viele Menschen auf dem Oktoberfest?",
    options: ["a) Anzüge und Kleider", "b) Lederhosen und Dirndl", "c) Jeans und T-Shirts", "d) Bademode"],
  },
  {
    stem: "Was gibt es neben Essen und Trinken noch auf dem Oktoberfest?",
    options: ["a) Konzerte und Opern", "b) Fahrgeschäfte und Spiele", "c) Sportveranstaltungen", "d) Filmvorführungen"],
  },
];

export default function A2Day10TourismusTraditionelleFesteWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={10}
      title="Tourismus und traditionelle Feste"
      chapter="4.10"
      workbookId="A2Day10TourismusTraditionelleFeste"
      topicPrompt="Sprich über Tourismus oder ein traditionelles Fest."
      sprechenContent={sprechenContent}
      schreibenTask="Schreiben Sie einen Brief und laden Sie einen Freund oder eine Freundin zu einem Fest ein."
      schreibenContent={schreibenContent}
      schreibenPlaceholder="Liebe/r ...\n\nich möchte dich zu ... einladen. Das Fest findet ... statt."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Höre den Beitrag über das Oktoberfest. Achte auf Ort, Dauer, Essen, Kleidung und Aktivitäten. Submitte deine Antwortbuchstaben im Submit-Tab."
      hoerenAudioUrl="https://youtu.be/yOfTCQDn_JM"
      hoerenQuestions={hoerenQuestions}
      showWorkbookGuidance={false}
    />
  );
}
