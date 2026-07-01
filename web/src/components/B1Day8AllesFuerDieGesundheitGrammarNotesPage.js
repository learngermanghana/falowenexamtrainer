import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, lineHeight: 1.75, background: "#fff" };
const Note = ({ children, tone = "blue" }) => {
  const colors = { blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"], green: ["#bbf7d0", "#f0fdf4", "#166534"], amber: ["#fde68a", "#fffbeb", "#92400e"], red: ["#fecaca", "#fef2f2", "#991b1b"] }[tone];
  return <div style={{ border: `1px solid ${colors[0]}`, background: colors[1], color: colors[2], borderRadius: 14, padding: 14, lineHeight: 1.7 }}>{children}</div>;
};

export default function B1Day8AllesFuerDieGesundheitGrammarNotesPage() {
  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 8 · Kapitel 3.8 · Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Alles für die Gesundheit</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>Grammatikfokus: Modalverben und Empfehlungen mit sollte, muss, kann, darf und möchte.</p>
    </header>

    <section style={card}><h2 style={{ margin: 0 }}>Warum diese Grammatik zum Thema passt</h2><p style={{ margin: 0, lineHeight: 1.75 }}>Beim Thema Gesundheit geben wir oft Ratschläge, sprechen über Pflichten, Möglichkeiten und persönliche Ziele: Man sollte genug schlafen, man muss nicht perfekt leben, man kann Stress reduzieren und man darf Pausen machen. Modalverben helfen dir, diese Ideen höflich und klar auf B1-Niveau zu formulieren.</p></section>

    <section style={card}><h2 style={{ margin: 0 }}>Lernziele</h2><ul style={list}><li>Ratschläge und Empfehlungen mit <strong>sollte/sollten</strong> geben.</li><li>Notwendigkeit mit <strong>müssen</strong> und Möglichkeit mit <strong>können</strong> ausdrücken.</li><li>Über gesunde Ernährung, Sport, Stress und Vorsorge mit korrekter Wortstellung sprechen.</li><li>Eine B1-Meinung mit Modalverben und passenden Redemitteln schreiben.</li></ul></section>

    <section style={card}><h2 style={{ margin: 0 }}>Regel und Satzbau</h2><div style={box}><strong>Hauptsatz:</strong> Subjekt + Modalverb auf Position 2 + Ergänzungen + Infinitiv am Ende.<br />Man <strong>sollte</strong> täglich genug Wasser <strong>trinken</strong>.<br />Ich <strong>möchte</strong> in Zukunft weniger Bildschirmzeit <strong>haben</strong>.</div><div style={box}><strong>Nebensatz mit dass/weil:</strong> konjugiertes Modalverb am Ende, Infinitiv direkt davor.<br />Ich glaube, dass man regelmäßig Sport <strong>machen sollte</strong>.<br />Stress ist gefährlich, weil er den Schlaf <strong>stören kann</strong>.</div></section>

    <section style={card}><h2 style={{ margin: 0 }}>Welche Bedeutung?</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}><div style={box}><strong>sollte</strong> = Empfehlung<br />Man sollte mehr Obst und Gemüse essen.</div><div style={box}><strong>muss</strong> = Notwendigkeit<br />Bei starken Schmerzen muss man zum Arzt gehen.</div><div style={box}><strong>kann</strong> = Möglichkeit<br />Yoga kann beim Stressabbau helfen.</div><div style={box}><strong>darf</strong> = Erlaubnis / gesunde Grenze<br />Man darf auch Pausen machen.</div></div></section>

    <section style={card}><h2 style={{ margin: 0 }}>Richtig oder falsch?</h2><Note tone="green">✅ Richtig: Man <strong>sollte</strong> mindestens 1,5 Liter Wasser pro Tag <strong>trinken</strong>.</Note><Note tone="red">❌ Falsch: Man <strong>sollte trinkt</strong> mindestens 1,5 Liter Wasser pro Tag.</Note><Note tone="green">✅ Richtig: Ich glaube, dass regelmäßige Arztbesuche wichtig <strong>sein können</strong>.</Note><Note tone="red">❌ Falsch: Ich glaube, dass regelmäßige Arztbesuche <strong>können wichtig sein</strong>.</Note></section>

    <section style={card}><h2 style={{ margin: 0 }}>Typische B1-Fehler</h2><ul style={list}><li>Nach dem Modalverb ein konjugiertes Verb benutzen: „man sollte isst“ → „man sollte essen“.</li><li>Im Nebensatz das Modalverb nicht ans Ende stellen: „weil man sollte schlafen“ → „weil man schlafen sollte“.</li><li>Zu stark formulieren: Statt „alle müssen jeden Tag Sport machen“ oft besser „man sollte sich regelmäßig bewegen“.</li><li>Modalverben ohne konkreten Inhalt verwenden. Ergänze Beispiele: Wasser trinken, Zucker reduzieren, zum Zahnarzt gehen.</li></ul></section>

    <section style={card}><h2 style={{ margin: 0 }}>Redemittel für Sprechen und Schreiben</h2><ul style={list}><li>Ich glaube, dass gesunde Ernährung eine große Rolle spielt, weil ...</li><li>Meiner Meinung nach sollte man darauf achten, dass ...</li><li>Ein gesundes Leben bedeutet für mich, dass man ...</li><li>Man kann Stress reduzieren, indem man ...</li><li>In Zukunft möchte ich ... verbessern.</li></ul></section>

    <section style={card}><h2 style={{ margin: 0 }}>Mini-Übung: Ergänzen Sie das Modalverb</h2><ol style={list}><li>Man ___ weniger Zucker essen. (Empfehlung)</li><li>Bei Beschwerden ___ man den Hausarzt anrufen. (Notwendigkeit)</li><li>Schwimmen ___ die Gelenke schonen. (Möglichkeit)</li><li>Ich glaube, dass man genug schlafen ___. (Empfehlung im Nebensatz)</li></ol><Note>Selbstcheck: Kannst du drei persönliche Gesundheitstipps mit <em>sollte</em>, <em>kann</em> und <em>möchte</em> formulieren?</Note></section>
  </div>;
}
