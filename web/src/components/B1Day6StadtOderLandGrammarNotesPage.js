import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const sectionTitle = { margin: 0, fontSize: "1.15rem" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" };
const cellStyle = {
  border: "1px solid #e5e7eb",
  padding: "10px 12px",
  textAlign: "left",
  verticalAlign: "top",
};

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", background: "#eff6ff", color: "#1e3a8a" },
    green: { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" },
    amber: { border: "#fde68a", background: "#fffbeb", color: "#92400e" },
    red: { border: "#fecaca", background: "#fef2f2", color: "#991b1b" },
  };
  const selected = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${selected.border}`, background: selected.background, color: selected.color, borderRadius: 14, padding: 14, lineHeight: 1.7 }}>
      {children}
    </div>
  );
};

const ExampleBox = ({ children }) => (
  <div style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: 12, lineHeight: 1.75 }}>
    {children}
  </div>
);

export default function B1Day6StadtOderLandGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 6 · Kapitel 2.6 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Leben in der Stadt oder auf dem Land?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Vergleiche Stadt- und Landleben, begründe deine Meinung und verbinde deine Argumente mit passenden B1-Strukturen.
        </p>
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80"
          alt="Stadt und Landschaft im Vergleich"
          loading="lazy"
          style={{ width: "100%", borderRadius: 14, maxHeight: 290, objectFit: "cover" }}
        />
      </header>

      <section style={card}>
        <h2 style={sectionTitle}>Lernziele</h2>
        <ul style={listStyle}>
          <li>Vorteile und Nachteile von Stadt und Land vergleichen.</li>
          <li>Gründe mit <strong>weil</strong>, <strong>da</strong> und <strong>denn</strong> nennen.</li>
          <li>Gegensätze mit <strong>aber</strong>, <strong>obwohl</strong>, <strong>während</strong> und zweiteiligen Konnektoren ausdrücken.</li>
          <li>Relativsätze passend zum Thema Wohnen bilden.</li>
          <li>Eine klare B1-Meinung mit Einleitung, Argumenten, Beispiel und Schluss formulieren.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>1. Vergleichen mit Komparativ und als</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Wenn zwei Orte unterschiedlich sind, benutzt du den <strong>Komparativ + als</strong>. Bei gleicher Eigenschaft benutzt du <strong>so ... wie</strong>.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr><th style={cellStyle}>Grundform</th><th style={cellStyle}>Komparativ</th><th style={cellStyle}>Beispiel</th></tr>
            </thead>
            <tbody>
              <tr><td style={cellStyle}>ruhig</td><td style={cellStyle}>ruhiger</td><td style={cellStyle}>Auf dem Land ist es ruhiger als in der Stadt.</td></tr>
              <tr><td style={cellStyle}>günstig</td><td style={cellStyle}>günstiger</td><td style={cellStyle}>Wohnungen auf dem Land sind oft günstiger.</td></tr>
              <tr><td style={cellStyle}>gut</td><td style={cellStyle}>besser</td><td style={cellStyle}>In der Stadt ist die medizinische Versorgung oft besser.</td></tr>
              <tr><td style={cellStyle}>viel</td><td style={cellStyle}>mehr</td><td style={cellStyle}>In der Stadt gibt es mehr Freizeitangebote.</td></tr>
            </tbody>
          </table>
        </div>
        <ExampleBox>
          Die Luft auf dem Land ist <strong>sauberer als</strong> in der Stadt.<br />
          Eine Kleinstadt ist oft <strong>nicht so hektisch wie</strong> eine Großstadt.<br />
          In der Stadt gibt es <strong>mehr</strong> Arbeitsplätze, aber auf dem Land hat man oft <strong>mehr</strong> Platz.
        </ExampleBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>2. Gründe nennen: weil, da und denn</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
          <ExampleBox>
            <strong>weil / da</strong><br />
            Das Verb steht am Ende.<br /><br />
            Ich lebe gern auf dem Land, <strong>weil es dort ruhiger ist</strong>.<br />
            <strong>Da die Mieten niedriger sind</strong>, können Familien mehr Platz bezahlen.
          </ExampleBox>
          <ExampleBox>
            <strong>denn</strong><br />
            Normale Hauptsatzstellung.<br /><br />
            Ich bevorzuge die Stadt, <strong>denn dort gibt es viele Arbeitsmöglichkeiten</strong>.<br />
            Das Land ist für mich ideal, <strong>denn ich brauche Ruhe</strong>.
          </ExampleBox>
        </div>
        <NoteBox tone="red">
          <strong>Typischer Fehler:</strong> „Ich wohne auf dem Land, weil ich brauche Ruhe.“<br />
          <strong>Richtig:</strong> „Ich wohne auf dem Land, weil ich Ruhe brauche.“
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>3. Gegensätze und Abwägungen</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead><tr><th style={cellStyle}>Struktur</th><th style={cellStyle}>Beispiel</th></tr></thead>
            <tbody>
              <tr><td style={cellStyle}><strong>aber</strong></td><td style={cellStyle}>In der Stadt gibt es viele Jobs, aber die Mieten sind hoch.</td></tr>
              <tr><td style={cellStyle}><strong>obwohl</strong></td><td style={cellStyle}>Obwohl das Leben auf dem Land ruhiger ist, fehlen manchmal gute Busverbindungen.</td></tr>
              <tr><td style={cellStyle}><strong>während</strong></td><td style={cellStyle}>Während man in der Stadt vieles schnell erreicht, braucht man auf dem Land oft ein Auto.</td></tr>
              <tr><td style={cellStyle}><strong>einerseits ... andererseits</strong></td><td style={cellStyle}>Einerseits bietet die Stadt viele Chancen, andererseits ist der Alltag oft stressig.</td></tr>
              <tr><td style={cellStyle}><strong>zwar ... aber</strong></td><td style={cellStyle}>Das Land ist zwar ruhig, aber für junge Leute manchmal langweilig.</td></tr>
            </tbody>
          </table>
        </div>
        <NoteBox tone="amber">
          Für eine gute B1-Antwort solltest du nicht nur eine Seite nennen. Zeige mindestens einen Vorteil und einen Nachteil und erkläre danach deine persönliche Entscheidung.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>4. Relativsätze zum Thema Wohnen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Relativsätze geben zusätzliche Informationen über ein Nomen. Das Relativpronomen richtet sich nach Genus und Kasus; das Verb steht am Ende.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead><tr><th style={cellStyle}>Nomen</th><th style={cellStyle}>Relativsatz</th></tr></thead>
            <tbody>
              <tr><td style={cellStyle}>die Stadt</td><td style={cellStyle}>Die Stadt, <strong>die</strong> viele Arbeitsplätze bietet, ist für Berufstätige attraktiv.</td></tr>
              <tr><td style={cellStyle}>das Dorf</td><td style={cellStyle}>Das Dorf, <strong>in dem</strong> meine Familie lebt, ist sehr ruhig.</td></tr>
              <tr><td style={cellStyle}>der Bus</td><td style={cellStyle}>Der Bus, <strong>mit dem</strong> ich zur Arbeit fahre, kommt nur zweimal am Tag.</td></tr>
              <tr><td style={cellStyle}>die Nachbarn</td><td style={cellStyle}>Die Nachbarn, <strong>mit denen</strong> wir oft sprechen, sind sehr hilfsbereit.</td></tr>
            </tbody>
          </table>
        </div>
        <NoteBox>
          <strong>Wortstellung:</strong> Nomen + Komma + Relativpronomen + Ergänzungen + Verb am Ende.<br />
          Das ist die Gegend, in der ich gern wohnen würde.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>5. Meinung ausdrücken und begründen</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <ExampleBox>
            <strong>Meinung einleiten</strong><br />
            Meiner Meinung nach ...<br />
            Ich persönlich finde, dass ...<br />
            Für mich überwiegen die Vorteile von ...
          </ExampleBox>
          <ExampleBox>
            <strong>Argumente ordnen</strong><br />
            Ein wichtiger Vorteil ist, dass ...<br />
            Außerdem darf man nicht vergessen, dass ...<br />
            Ein Beispiel dafür ist ...
          </ExampleBox>
          <ExampleBox>
            <strong>Schluss formulieren</strong><br />
            Zusammenfassend würde ich sagen, dass ...<br />
            Letztlich hängt die Entscheidung davon ab, ob ...<br />
            Deshalb würde ich lieber ... wohnen.
          </ExampleBox>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>B1-Struktur für Sprechen und Schreiben</h2>
        <ol style={listStyle}>
          <li><strong>Einleitung:</strong> Thema nennen und die Frage aufgreifen.</li>
          <li><strong>Stadt:</strong> mindestens einen Vorteil und einen Nachteil nennen.</li>
          <li><strong>Land:</strong> mindestens einen Vorteil und einen Nachteil nennen.</li>
          <li><strong>Eigene Meinung:</strong> klare Präferenz mit Begründung und Beispiel.</li>
          <li><strong>Schluss:</strong> Ergebnis oder Ratschlag formulieren.</li>
        </ol>
        <ExampleBox>
          Ich möchte über das Thema „Stadt oder Land“ sprechen. Einerseits bietet die Stadt viele Arbeits- und Freizeitmöglichkeiten, andererseits ist sie oft laut und teuer. Auf dem Land ist das Leben ruhiger und die Natur näher, obwohl die Infrastruktur manchmal schlechter ist. Ich persönlich würde lieber am Stadtrand wohnen, weil ich dort Ruhe habe und trotzdem schnell in die Stadt fahren kann. Letztlich hängt die beste Wahl von den persönlichen Bedürfnissen ab.
        </ExampleBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Mini-Übung</h2>
        <ol style={listStyle}>
          <li>Verbinde mit <strong>weil</strong>: Ich lebe gern auf dem Land. Die Luft ist sauber.</li>
          <li>Vergleiche: Die Stadt ist laut. Das Land ist ruhig.</li>
          <li>Bilde einen Relativsatz: Das ist die Stadt. In der Stadt habe ich studiert.</li>
          <li>Formuliere mit <strong>einerseits ... andererseits</strong> einen Vor- und Nachteil der Stadt.</li>
          <li>Schreibe zwei Sätze mit deiner persönlichen Meinung.</li>
        </ol>
        <NoteBox tone="green">
          <strong>Mögliche Lösungen:</strong> Ich lebe gern auf dem Land, weil die Luft sauber ist. · Die Stadt ist lauter als das Land. · Das ist die Stadt, in der ich studiert habe. · Einerseits gibt es viele Jobs, andererseits sind die Mieten hoch.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Kontrollliste</h2>
        <ul style={listStyle}>
          <li>Habe ich Stadt und Land wirklich verglichen?</li>
          <li>Habe ich Gründe und Beispiele genannt?</li>
          <li>Steht das Verb nach weil, obwohl und im Relativsatz am Ende?</li>
          <li>Habe ich mindestens einen passenden B1-Konnektor verwendet?</li>
          <li>Ist meine eigene Meinung klar?</li>
        </ul>
      </section>
    </div>
  );
}
