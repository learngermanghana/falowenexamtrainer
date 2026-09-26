import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import A2Days26To28LearningUpgrade from "./A2Days26To28LearningUpgrade";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 };
const miniCard = { border: "1px solid #bfdbfe", borderRadius: 12, padding: 14, background: "#f8fbff", display: "grid", gap: 7 };

const speakingContent = <>
  <A2Days26To28LearningUpgrade day={27} />
  <SpeakingMindMap config={getA2SpeakingMindMap(27)} />

  <WorkbookTaskCard
    eyebrow="Now speak · Jetzt sprechen"
    title="Welche digitalen Kommunikationsmittel benutzt du am meisten?"
    practiceOnly
  >
    <p style={paragraph}>Build one connected A2 answer, like the earlier workbook days: choose your idea first, then speak in a clear route instead of producing isolated sentences.</p>
    <ol style={list}>
      <li><strong>Start:</strong> Name the communication tools you use most.</li>
      <li><strong>Detail:</strong> Say when and why you use them.</li>
      <li><strong>Opinion:</strong> Add at least one <strong>dass</strong>-sentence.</li>
      <li><strong>Contrast:</strong> Give one advantage and one disadvantage.</li>
      <li><strong>Example:</strong> Add a real example from daily life, work or school.</li>
      <li><strong>Finish:</strong> Give a short recommendation or conclusion.</li>
    </ol>
    <p style={paragraph}><strong>Thinking route:</strong> Kommunikationsmittel → Nutzung → Meinung mit dass → Vorteil/Nachteil → Beispiel → Schluss.</p>
  </WorkbookTaskCard>

  <div style={grid}>
    <div style={miniCard}>
      <strong>Start your answer</strong>
      <span>Ich benutze am meisten ...</span>
      <span>Im Alltag nutze ich vor allem ...</span>
    </div>
    <div style={miniCard}>
      <strong>Give your opinion</strong>
      <span>Ich finde, dass ...</span>
      <span>Ich glaube, dass ...</span>
      <span>Mir ist wichtig, dass ...</span>
    </div>
    <div style={miniCard}>
      <strong>Connect ideas</strong>
      <span>außerdem · aber · deshalb</span>
      <span>weil · zum Beispiel</span>
    </div>
    <div style={miniCard}>
      <strong>Finish clearly</strong>
      <span>Zusammenfassend kann ich sagen, dass ...</span>
      <span>Deshalb versuche ich, ...</span>
    </div>
  </div>

  <div style={{ ...miniCard, background: "#fff" }}>
    <strong>Model answer</strong>
    <p style={paragraph}>Ich benutze am meisten WhatsApp und E-Mail. WhatsApp nutze ich jeden Tag, weil es schnell und praktisch ist. Ich finde, dass E-Mails im Beruf sehr wichtig sind, weil man Informationen gut organisieren kann. Soziale Medien sind praktisch, aber sie können auch viel Zeit kosten. Zum Beispiel schalte ich beim Lernen meine Benachrichtigungen aus. Deshalb versuche ich, digitale Medien bewusst zu benutzen.</p>
  </div>
</>;

const writingContent = <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="E-Mail an den Kundenservice">
  <p style={paragraph}>Sie haben Ihr Handy verloren und möchten ein neues auf www.jumiagh.com bestellen.</p>
  <ul style={list}>
    <li>Erklären Sie, warum Sie ein neues Handy bestellen möchten.</li>
    <li>Fragen Sie nach Empfehlungen für ein passendes Modell.</li>
    <li>Bitten Sie um Informationen zur Bestellung und Lieferung.</li>
  </ul>
  <p style={paragraph}><strong>Useful structure:</strong> Anrede → Grund → Modell/Anforderungen → Bestellung/Lieferung → Schluss.</p>
</WorkbookTaskCard>;



const listeningQuestions = [
  { stem: "Was hat Miriam gestern verloren?", options: ["A) Ihren Laptop", "B) Ihr Handy", "C) Ihre Tasche", "D) Ihren Ausweis"] },
  { stem: "Wo möchte Miriam ein neues Handy bestellen?", options: ["A) Im Supermarkt", "B) Auf www.jumiagh.com", "C) Im Rathaus", "D) In der Bibliothek"] },
  { stem: "Was fragt sie beim Kundenservice?", options: ["A) Nur nach der Farbe", "B) Nach Modell-Empfehlung sowie Bestellung und Lieferung", "C) Nur nach Rabatten", "D) Nach einem Auslandstarif"] },
  { stem: "Was ist ihr wichtig beim neuen Handy?", options: ["A) Gute Kamera und lange Akkulaufzeit", "B) Sehr großes Gewicht", "C) Nur Spiele", "D) Keine Internetfunktion"] },
];

export default function A2Day27DigitaleKommunikationWorkbookPage() {
  return <A2StandardTabbedWorkbookPage
    day={27}
    title="Digitale Kommunikation"
    chapter="10.27"
    workbookId="A2Day27DigitaleKommunikation"
    topicPrompt="Welche digitalen Kommunikationsmittel benutzt du am meisten?"
    sprechenContent={speakingContent}
    schreibenContent={writingContent}
    schreibenPlaceholder={"Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen, weil ich mein Handy verloren habe. ...\n\nKönnten Sie mir bitte ein passendes Modell empfehlen? ...\n\nMit freundlichen Grüßen\n[Name]"}
    hoerenTask="Sieh dir den Beitrag zur digitalen Kommunikation an und beantworte danach die vier Fragen."
    hoerenAudioUrl="https://youtu.be/JEJZypJfrD8?list=PLZ6nUCSTx9pKcy_IKo10vFQIlAhwFpEr5"
    hoerenQuestions={listeningQuestions}
    showWorkbookGuidance={false}
  />;
}
