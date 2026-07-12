import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
  lineHeight: 1.75,
  display: "grid",
  gap: 8,
};
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const title = { margin: 0, fontSize: "1.15rem" };
const good = { ...box, background: "#f0fdf4", borderColor: "#bbf7d0" };
const warn = { ...box, background: "#fef2f2", borderColor: "#fecaca" };

export default function B1Day15MedienHomeofficeGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>
          B1 · Day 15 · Kapitel 5.15 · Grammar Notes
        </span>
        <h1 style={{ ...styles.title, margin: 0 }}>
          Medien und Arbeiten im Homeoffice
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatikfokus: Passiv im Präsens und Passiv mit Modalverben für digitale Prozesse, Regeln und Arbeitsabläufe.
        </p>
      </header>

      <section style={card}>
        <h2 style={title}>Warum passt das Passiv zu diesem Thema?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Beim Thema Homeoffice beschreibst du oft, <strong>was gemacht wird</strong>, nicht unbedingt, wer es macht. Nachrichten werden verschickt, Daten werden gespeichert, Videokonferenzen werden organisiert und Passwörter müssen geschützt werden. Deshalb ist das Passiv besonders nützlich.
        </p>
      </section>

      <section style={card}>
        <h2 style={title}>Lernziele</h2>
        <ul style={list}>
          <li>Arbeitsprozesse im Homeoffice mit dem Passiv beschreiben.</li>
          <li>Aktiv- und Passivsätze unterscheiden.</li>
          <li>Regeln und Notwendigkeiten mit Modalverben im Passiv formulieren.</li>
          <li>Vor- und Nachteile digitaler Medien klar begründen.</li>
          <li>Datenschutz und digitale Sicherheit sachlich erklären.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>1. Passiv im Präsens: werden + Partizip II</h2>
        <div style={box}>
          <strong>Struktur</strong>
          <span>Subjekt + Form von <strong>werden</strong> + Partizip II.</span>
          <span>Die E-Mail <strong>wird verschickt</strong>.</span>
          <span>Die Daten <strong>werden gespeichert</strong>.</span>
        </div>
        <ul style={list}>
          <li>ich werde informiert</li>
          <li>du wirst informiert</li>
          <li>er/sie/es wird informiert</li>
          <li>wir werden informiert</li>
          <li>ihr werdet informiert</li>
          <li>sie/Sie werden informiert</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>2. Aktiv und Passiv vergleichen</h2>
        <div style={good}>
          <strong>Aktiv:</strong>
          <span>Die Mitarbeiter organisieren eine Videokonferenz.</span>
          <strong>Passiv:</strong>
          <span>Eine Videokonferenz wird organisiert.</span>
        </div>
        <div style={box}>
          <strong>Aktiv:</strong>
          <span>Die Firma speichert persönliche Daten.</span>
          <strong>Passiv:</strong>
          <span>Persönliche Daten werden gespeichert.</span>
        </div>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Im Passiv steht die Handlung im Mittelpunkt. Die handelnde Person kann mit <strong>von + Dativ</strong> genannt werden: Die Videokonferenz wird <strong>von der Teamleiterin</strong> organisiert.
        </p>
      </section>

      <section style={card}>
        <h2 style={title}>3. Passiv mit Modalverben</h2>
        <div style={box}>
          <strong>Struktur</strong>
          <span>Subjekt + Modalverb + Partizip II + <strong>werden</strong>.</span>
          <span>Sichere Passwörter <strong>müssen verwendet werden</strong>.</span>
          <span>Private Daten <strong>dürfen nicht weitergegeben werden</strong>.</span>
          <span>Neue Programme <strong>können schnell gelernt werden</strong>.</span>
        </div>
        <ul style={list}>
          <li>müssen: Pflicht – Arbeitszeiten müssen eingehalten werden.</li>
          <li>dürfen: Erlaubnis oder Verbot – Passwörter dürfen nicht geteilt werden.</li>
          <li>können: Möglichkeit – Dokumente können online bearbeitet werden.</li>
          <li>sollen: Empfehlung – Pausen sollen regelmäßig gemacht werden.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>4. Wortstellung</h2>
        <div style={good}>
          <strong>Hauptsatz:</strong>
          <span>Im Homeoffice werden viele Besprechungen online durchgeführt.</span>
        </div>
        <div style={good}>
          <strong>Nebensatz mit weil:</strong>
          <span>Viele Menschen arbeiten gern zu Hause, weil Arbeitswege vermieden werden.</span>
        </div>
        <div style={good}>
          <strong>Modalverb im Nebensatz:</strong>
          <span>Es ist wichtig, dass persönliche Daten geschützt werden müssen.</span>
        </div>
        <div style={warn}>
          <strong>Typischer Fehler:</strong>
          <span>Falsch: Die Daten müssen werden geschützt.</span>
          <span>Richtig: Die Daten müssen geschützt werden.</span>
        </div>
      </section>

      <section style={card}>
        <h2 style={title}>5. Vor- und Nachteile logisch verbinden</h2>
        <ul style={list}>
          <li><strong>Einerseits</strong> wird Zeit gespart, <strong>andererseits</strong> fehlen soziale Kontakte.</li>
          <li>Digitale Medien erleichtern die Kommunikation, <strong>weil</strong> Informationen schnell geteilt werden können.</li>
          <li><strong>Obwohl</strong> viele Aufgaben flexibel erledigt werden, kann ständige Erreichbarkeit stressig sein.</li>
          <li>Man sollte klare Arbeitszeiten festlegen, <strong>damit</strong> Arbeit und Privatleben besser getrennt werden.</li>
          <li>Es gibt technische Probleme; <strong>trotzdem</strong> ist Homeoffice für viele Menschen praktisch.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>6. Nützliche Passivsätze zum Thema</h2>
        <ul style={list}>
          <li>E-Mails werden täglich verschickt und beantwortet.</li>
          <li>Besprechungen werden über Videokonferenzen durchgeführt.</li>
          <li>Aufgaben werden in Projektmanagement-Programmen organisiert.</li>
          <li>Persönliche Daten müssen geschützt werden.</li>
          <li>Sichere Passwörter sollen regelmäßig geändert werden.</li>
          <li>Nach Feierabend sollten berufliche Benachrichtigungen ausgeschaltet werden.</li>
          <li>Neue digitale Programme können durch Schulungen gelernt werden.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Redemittel für Sprechen und Schreiben</h2>
        <ul style={list}>
          <li>Ich möchte heute über die Arbeit im Homeoffice sprechen.</li>
          <li>Digitale Medien spielen dabei eine wichtige Rolle, weil ...</li>
          <li>Im Homeoffice werden ... verwendet.</li>
          <li>Ein Vorteil besteht darin, dass ...</li>
          <li>Ein Nachteil ist, dass ...</li>
          <li>Persönliche Daten müssen ...</li>
          <li>Meiner Meinung nach sollte ...</li>
          <li>Zusammenfassend kann gesagt werden, dass ...</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Häufige B1-Fehler</h2>
        <ul style={list}>
          <li>Das Hilfsverb <strong>werden</strong> vergessen: „Die Daten gespeichert“ statt „Die Daten werden gespeichert“.</li>
          <li>Beim Modalverb die falsche Reihenfolge benutzen: richtig ist „müssen geschützt werden“.</li>
          <li>Nach <strong>weil, obwohl, dass, damit</strong> das Verb nicht ans Ende stellen.</li>
          <li>Nur Vorteile nennen und keine Gegenposition erklären.</li>
          <li>„Homeoffice machen“ überall verwenden; besser sind auch „im Homeoffice arbeiten“ und „von zu Hause aus arbeiten“.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Mini-Übung: Aktiv ins Passiv</h2>
        <ol style={list}>
          <li>Die Mitarbeiter verschicken viele E-Mails. → Viele E-Mails ...</li>
          <li>Die Firma schützt persönliche Daten. → Persönliche Daten ...</li>
          <li>Man muss klare Arbeitszeiten festlegen. → Klare Arbeitszeiten ...</li>
          <li>Man darf Passwörter nicht teilen. → Passwörter ...</li>
          <li>Die Teamleiterin organisiert die Videokonferenz. → Die Videokonferenz ...</li>
        </ol>
        <div style={box}>
          <strong>Lösungen</strong>
          <span>1. Viele E-Mails werden verschickt.</span>
          <span>2. Persönliche Daten werden geschützt.</span>
          <span>3. Klare Arbeitszeiten müssen festgelegt werden.</span>
          <span>4. Passwörter dürfen nicht geteilt werden.</span>
          <span>5. Die Videokonferenz wird von der Teamleiterin organisiert.</span>
        </div>
      </section>
    </div>
  );
}
