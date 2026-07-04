import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75, display: "grid", gap: 8 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const title = { margin: 0, fontSize: "1.15rem" };
const good = { ...box, background: "#f0fdf4", borderColor: "#bbf7d0" };
const warn = { ...box, background: "#fef2f2", borderColor: "#fecaca" };

export default function B1Day13EigeneFilmkritikGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 13 · Kapitel 4.13 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Eigene Filmkritik schreiben</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatikfokus: Eine Filmkritik strukturiert schreiben mit Passiv, Bewertungsadjektiven, Nebensätzen und klarer Empfehlung.
        </p>
      </header>

      <section style={card}>
        <h2 style={title}>Warum ist diese Grammatik für das Thema nützlich?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          In einer Filmkritik beschreibst du Handlung, Schauspiel, Atmosphäre und Produktion. Gleichzeitig musst du deine Meinung begründen. Dafür brauchst du Redemittel wie <strong>Der Film handelt von ...</strong>, Passivformen wie <strong>wurde gedreht</strong>, Bewertungsadjektive und Nebensätze mit <strong>weil</strong>, <strong>dass</strong>, <strong>obwohl</strong> und <strong>während</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={title}>Lernziele</h2>
        <ul style={list}>
          <li>Eine Filmkritik mit Einleitung, Inhalt, Bewertung und Empfehlung aufbauen.</li>
          <li>Handlung, Schauspiel, Atmosphäre und Regie klar beschreiben.</li>
          <li>Passivformen für Produktion und Veröffentlichung verwenden.</li>
          <li>Eine Meinung mit <strong>weil</strong>, <strong>dass</strong>, <strong>obwohl</strong> und <strong>während</strong> begründen.</li>
          <li>Vorteile und Nachteile spannender Filme in einem B1-Aufsatz abwägen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>1. Filmhandlung beschreiben</h2>
        <div style={box}>
          <strong>Wichtige Strukturen</strong>
          <span>Der Film <strong>handelt von</strong> einem Ermittler. / Es <strong>geht um</strong> einen geheimnisvollen Mord. / Die Geschichte <strong>spielt</strong> in einer kleinen Stadt.</span>
        </div>
        <ul style={list}>
          <li>Der Film handelt von einem Mann, der in die Träume anderer Menschen eindringen kann.</li>
          <li>Die Geschichte spielt in der Zukunft / in einer Großstadt / im Weltall.</li>
          <li>Am Ende gibt es eine überraschende Wendung.</li>
          <li>Der Film basiert auf einer wahren Geschichte.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>2. Passiv für Regie und Produktion</h2>
        <div style={box}>
          <strong>Präteritum-Passiv</strong>
          <span>Der Film <strong>wurde</strong> von Christopher Nolan <strong>gedreht</strong>. / Der Film <strong>wurde</strong> im Jahr 2010 <strong>veröffentlicht</strong>.</span>
        </div>
        <div style={box}>
          <strong>Perfekt-Passiv</strong>
          <span>Der Film <strong>ist</strong> in vielen Ländern <strong>gezeigt worden</strong>. / Er <strong>ist</strong> für mehrere Preise <strong>nominiert worden</strong>.</span>
        </div>
        <div style={good}><strong>Richtig:</strong> Der Film wurde in den USA gedreht und kam 2010 ins Kino.</div>
        <div style={warn}><strong>Falsch:</strong> Der Film hat in den USA gedreht worden.</div>
      </section>

      <section style={card}>
        <h2 style={title}>3. Schauspiel und Atmosphäre bewerten</h2>
        <div style={box}>
          <strong>Bewertungsadjektive</strong>
          <span>überzeugend, emotional, beeindruckend, langweilig, spannend, dramatisch, melancholisch, realistisch, übertrieben, tiefgründig.</span>
        </div>
        <ul style={list}>
          <li>Die schauspielerische Leistung war sehr überzeugend.</li>
          <li>Die Filmmusik hat die Spannung verstärkt.</li>
          <li>Die Dialoge wirkten manchmal künstlich.</li>
          <li>Die Kameraarbeit war beeindruckend, weil sie die Stimmung gut gezeigt hat.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>4. Meinung begründen mit Nebensätzen</h2>
        <ul style={list}>
          <li>Mir hat der Film gefallen, <strong>weil</strong> die Handlung spannend war.</li>
          <li>Ich finde, <strong>dass</strong> die Schauspieler sehr überzeugend gespielt haben.</li>
          <li><strong>Obwohl</strong> einige Dialoge klischeehaft waren, hat mich der Film überzeugt.</li>
          <li><strong>Während</strong> spannende Filme oft fesselnd sind, haben ruhige Filme manchmal tiefere Botschaften.</li>
        </ul>
        <div style={good}><strong>Richtig:</strong> Ich empfehle den Film, weil die Geschichte einzigartig ist.</div>
        <div style={warn}><strong>Falsch:</strong> Ich empfehle den Film, weil ist die Geschichte einzigartig.</div>
      </section>

      <section style={card}>
        <h2 style={title}>5. Empfehlung mit Konjunktiv II</h2>
        <ul style={list}>
          <li>Ich <strong>würde</strong> den Film weiterempfehlen, weil er sehr spannend ist.</li>
          <li>Ich <strong>würde</strong> ihn nicht für Kinder empfehlen, da einige Szenen zu dunkel sind.</li>
          <li>Ich <strong>würde</strong> den Film noch einmal sehen, weil die Handlung komplex ist.</li>
          <li>Für Fans von Thrillern <strong>wäre</strong> der Film sehr geeignet.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>6. Struktur für einen Meinungsaufsatz</h2>
        <ol style={list}>
          <li><strong>Einleitung:</strong> Thema nennen und kurz erklären, warum es wichtig ist.</li>
          <li><strong>Meinung:</strong> Ich bin der Meinung, dass ...</li>
          <li><strong>Vorteile:</strong> Spannende Filme sind fesselnd und erzeugen starke Emotionen.</li>
          <li><strong>Nachteile:</strong> Zu viel Spannung kann stressig sein; ruhige Filme haben oft tiefere Botschaften.</li>
          <li><strong>Fazit:</strong> Zusammenfassend bin ich der Meinung, dass ...</li>
        </ol>
      </section>

      <section style={card}>
        <h2 style={title}>Redemittel für Sprechen und Schreiben</h2>
        <ul style={list}>
          <li>Ich möchte heute über den Film ... sprechen.</li>
          <li>Der Film handelt von ...</li>
          <li>Die Hauptrolle spielt ...</li>
          <li>Besonders gut fand ich, dass ...</li>
          <li>Ein Kritikpunkt ist, dass ...</li>
          <li>In meinem Heimatland sind solche Filme beliebt, weil ...</li>
          <li>Zusammenfassend kann ich sagen, dass ...</li>
          <li>Ich würde den Film weiterempfehlen / nicht weiterempfehlen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Häufige B1-Fehler</h2>
        <ul style={list}>
          <li>Nach <strong>weil/dass/obwohl</strong> das Verb nicht ans Satzende stellen.</li>
          <li><strong>handeln von</strong> falsch benutzen: richtig ist „Der Film handelt von einem Ermittler.“</li>
          <li>Nur die Handlung erzählen, aber keine Bewertung geben.</li>
          <li>Keine klare Empfehlung schreiben: „Ich empfehle den Film, weil ...“</li>
          <li>Im Meinungsaufsatz Vorteile und Nachteile nicht trennen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Mini-Übung: Verbinde und bewerte</h2>
        <ol style={list}>
          <li>Die Handlung war spannend. Ich empfehle den Film. → Verwende <strong>weil</strong>.</li>
          <li>Die Dialoge waren klischeehaft. Der Film hat mich überzeugt. → Verwende <strong>obwohl</strong>.</li>
          <li>Der Film kam 2010 ins Kino. Der Film wurde von Christopher Nolan gedreht. → Verwende das <strong>Passiv</strong>.</li>
          <li>Spannende Filme sind fesselnd. Ruhige Filme haben tiefere Botschaften. → Verwende <strong>während</strong>.</li>
        </ol>
      </section>
    </div>
  );
}
