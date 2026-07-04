import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75, display: "grid", gap: 8 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const title = { margin: 0, fontSize: "1.15rem" };
const good = { ...box, background: "#f0fdf4", borderColor: "#bbf7d0" };
const warn = { ...box, background: "#fef2f2", borderColor: "#fecaca" };

export default function B1Day16PruefungsangstStressbewaeltigungGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 16 · Kapitel 5.16 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Prüfungsangst und Stressbewältigung</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatikfokus: Ursachen, Symptome und Tipps erklären mit Nebensätzen, Infinitiv mit zu, Modalverben und Ratschlägen.
        </p>
      </header>

      <section style={card}>
        <h2 style={title}>Warum ist diese Grammatik für das Thema nützlich?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Bei Prüfungsangst musst du Ursachen erklären, Symptome beschreiben und Tipps geben. Dafür brauchst du Nebensätze mit <strong>weil</strong>, <strong>dass</strong>, <strong>wenn</strong> und <strong>damit</strong>, außerdem Formulierungen wie <strong>Es ist wichtig, ... zu ...</strong> und Ratschläge mit <strong>sollte</strong>, <strong>kann</strong> und <strong>muss</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={title}>Lernziele</h2>
        <ul style={list}>
          <li>Ursachen von Prüfungsangst klar nennen und begründen.</li>
          <li>Körperliche, mentale und emotionale Symptome beschreiben.</li>
          <li>Strategien zur Stressbewältigung mit passenden Modalverben formulieren.</li>
          <li>Eine B1-Meinung zu Prüfungsangst und Stressmanagement schreiben.</li>
          <li>Prüfungen und alternative Bewertungsmethoden vergleichen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>1. Ursachen erklären mit „weil“, „dass“ und „wenn“</h2>
        <ul style={list}>
          <li>Viele Schüler haben Angst, <strong>weil sie nicht genug gelernt haben</strong>.</li>
          <li>Ich denke, <strong>dass Prüfungsangst die Leistung beeinflussen kann</strong>.</li>
          <li><strong>Wenn</strong> man unter Zeitdruck steht, wird man oft nervös.</li>
          <li>Manche Schüler bekommen einen Blackout, <strong>wenn sie zu viel Druck spüren</strong>.</li>
        </ul>
        <div style={good}><strong>Richtig:</strong> Ich bin nervös, weil ich Angst vor schlechten Noten habe.</div>
        <div style={warn}><strong>Falsch:</strong> Ich bin nervös, weil ich habe Angst vor schlechten Noten.</div>
      </section>

      <section style={card}>
        <h2 style={title}>2. Symptome beschreiben</h2>
        <div style={box}>
          <strong>Nomen und Verben</strong>
          <span>Herzrasen haben, schwitzen, zittern, sich schlecht konzentrieren, negative Gedanken haben, schlecht schlafen, unter Druck stehen.</span>
        </div>
        <ul style={list}>
          <li>Vor der Prüfung habe ich oft Herzrasen.</li>
          <li>Manche Schüler zittern oder schwitzen, wenn sie sehr nervös sind.</li>
          <li>Negative Gedanken können die Konzentration stören.</li>
          <li>Schlafprobleme sind ein häufiges Zeichen von Stress.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>3. Tipps geben mit Modalverben</h2>
        <ul style={list}>
          <li>Man <strong>sollte</strong> frühzeitig lernen und regelmäßige Pausen machen.</li>
          <li>Man <strong>kann</strong> Atemübungen machen oder ruhige Musik hören.</li>
          <li>Man <strong>muss</strong> nicht perfekt sein, sondern gut vorbereitet.</li>
          <li>Vor der Prüfung <strong>sollte</strong> man genug schlafen.</li>
          <li>Man <strong>darf</strong> sich nicht ständig mit anderen vergleichen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>4. Infinitiv mit „zu“ für Strategien</h2>
        <div style={box}>
          <strong>Struktur</strong>
          <span>Es ist wichtig, + Infinitiv mit <strong>zu</strong>.</span>
        </div>
        <ul style={list}>
          <li>Es ist wichtig, frühzeitig <strong>zu lernen</strong>.</li>
          <li>Es hilft, vor der Prüfung tief <strong>durchzuatmen</strong>.</li>
          <li>Es ist sinnvoll, einen Lernplan <strong>zu erstellen</strong>.</li>
          <li>Es ist besser, negative Gedanken <strong>zu vermeiden</strong>.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>5. Zweck ausdrücken mit „damit“ und „um ... zu“</h2>
        <ul style={list}>
          <li>Ich mache Pausen, <strong>damit ich mich besser konzentrieren kann</strong>.</li>
          <li>Ich lerne regelmäßig, <strong>um sicherer zu werden</strong>.</li>
          <li>Ich spreche mit Freunden, <strong>damit ich meine Angst reduzieren kann</strong>.</li>
          <li>Ich schlafe genug, <strong>um am Prüfungstag fit zu sein</strong>.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>6. Meinung abwägen: Stress als Vorteil und Nachteil</h2>
        <ul style={list}>
          <li><strong>Einerseits</strong> kann Stress motivieren, <strong>andererseits</strong> kann er die Leistung verschlechtern.</li>
          <li>Prüfungen sind <strong>zwar</strong> wichtig, <strong>aber</strong> sie verursachen oft viel Druck.</li>
          <li><strong>Obwohl</strong> Prüfungsangst normal ist, sollte man lernen, richtig damit umzugehen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Redemittel für Sprechen und Schreiben</h2>
        <ul style={list}>
          <li>Ich möchte heute über Prüfungsangst und Stress sprechen.</li>
          <li>Prüfungsangst bedeutet, dass ...</li>
          <li>Ein häufiger Grund ist, dass ...</li>
          <li>Typische Symptome sind ...</li>
          <li>Meiner Meinung nach kann man Prüfungsangst reduzieren, wenn ...</li>
          <li>Eine gute Strategie ist, ... zu ...</li>
          <li>Zusammenfassend finde ich, dass ...</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Häufige B1-Fehler</h2>
        <ul style={list}>
          <li>Nach <strong>weil/dass/wenn/damit/obwohl</strong> das Verb nicht ans Satzende stellen.</li>
          <li>„Ich bin Angst“ schreiben; richtig ist <strong>Ich habe Angst</strong>.</li>
          <li>„Ich mache Sport zu entspannen“ schreiben; richtig: <strong>Ich mache Sport, um mich zu entspannen</strong>.</li>
          <li>Nur Probleme nennen, aber keine Lösung oder eigene Meinung geben.</li>
          <li>Im Schreiben keine Verbindung zu Julias Meinung herstellen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Mini-Übung: Verbinde die Ideen</h2>
        <ol style={list}>
          <li>Viele Schüler sind nervös. Sie stehen unter Druck. → Verwende <strong>weil</strong>.</li>
          <li>Ich mache Atemübungen. Ich möchte ruhig bleiben. → Verwende <strong>um ... zu</strong>.</li>
          <li>Prüfungen sind wichtig. Sie verursachen Stress. → Verwende <strong>zwar ... aber</strong>.</li>
          <li>Man lernt regelmäßig. Man fühlt sich sicherer. → Verwende <strong>damit</strong>.</li>
        </ol>
      </section>
    </div>
  );
}
