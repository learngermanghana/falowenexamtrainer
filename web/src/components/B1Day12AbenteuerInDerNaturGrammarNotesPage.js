import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, background: "#fff", lineHeight: 1.75, display: "grid", gap: 8 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const title = { margin: 0, fontSize: "1.15rem" };
const good = { ...box, background: "#f0fdf4", borderColor: "#bbf7d0" };
const warn = { ...box, background: "#fef2f2", borderColor: "#fecaca" };

export default function B1Day12AbenteuerInDerNaturGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 12 · Kapitel 4.12 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Abenteuer in der Natur</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatikfokus: Ein Natur-Abenteuer lebendig erzählen mit Zeitangaben, Perfekt/Präteritum, Adjektiven und Nebensätzen.
        </p>
      </header>

      <section style={card}>
        <h2 style={title}>Warum ist diese Grammatik für das Thema nützlich?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Bei einem Abenteuer erzählst du nicht nur Fakten. Du beschreibst Ort, Wetter, Gefühle, Reihenfolge der Ereignisse und Herausforderungen. Dafür brauchst du klare Zeitwörter, passende Vergangenheitsformen und Verbindungen wie <strong>weil</strong>, <strong>obwohl</strong>, <strong>als</strong> und <strong>nachdem</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={title}>Lernziele</h2>
        <ul style={list}>
          <li>Ein Natur-Abenteuer in einer klaren Reihenfolge erzählen.</li>
          <li>Perfekt und Präteritum passend verwenden.</li>
          <li>Mit <strong>als</strong>, <strong>wenn</strong>, <strong>nachdem</strong>, <strong>bevor</strong> und <strong>während</strong> Zeitbeziehungen ausdrücken.</li>
          <li>Herausforderungen mit <strong>weil</strong>, <strong>obwohl</strong>, <strong>deshalb</strong> und <strong>trotzdem</strong> erklären.</li>
          <li>Natur und Erlebnisse mit treffenden Adjektiven beschreiben.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>1. Ein Erlebnis in der Vergangenheit erzählen</h2>
        <div style={box}>
          <strong>Perfekt für persönliche Erlebnisse</strong>
          <span>Ich <strong>bin</strong> in die Berge <strong>gefahren</strong>. Wir <strong>haben</strong> draußen <strong>gekocht</strong>. Ich <strong>habe</strong> einen Adler <strong>gesehen</strong>.</span>
        </div>
        <div style={box}>
          <strong>Präteritum für Hintergrund und Zustände</strong>
          <span>Das Wetter <strong>war</strong> kalt. Die Aussicht <strong>war</strong> atemberaubend. Wir <strong>hatten</strong> wenig Wasser.</span>
        </div>
        <div style={good}><strong>Natürlich:</strong> Letztes Jahr bin ich in den Wald gefahren. Es war sehr ruhig und ich habe viele Vögel gesehen.</div>
        <div style={warn}><strong>Unnatürlich:</strong> Letztes Jahr war ich in den Wald gefahren und sehe viele Vögel.</div>
      </section>

      <section style={card}>
        <h2 style={title}>2. Zeitliche Reihenfolge mit Konnektoren</h2>
        <ul style={list}>
          <li><strong>Als</strong> ich im Nationalpark ankam, war das Wetter noch sonnig.</li>
          <li><strong>Nachdem</strong> wir das Zelt aufgebaut hatten, haben wir draußen gekocht.</li>
          <li><strong>Bevor</strong> wir weitergewandert sind, haben wir die Karte kontrolliert.</li>
          <li><strong>Während</strong> wir durch den Wald gegangen sind, haben wir viele Tiere gehört.</li>
          <li><strong>Wenn</strong> ich in der Natur bin, fühle ich mich frei und ruhig.</li>
        </ul>
        <div style={box}>
          <strong>Achtung: Verb am Ende im Nebensatz</strong>
          <span>Nachdem wir das Zelt <strong>aufgebaut hatten</strong>, haben wir gegessen.</span>
        </div>
      </section>

      <section style={card}>
        <h2 style={title}>3. Herausforderungen erklären: weil, obwohl, deshalb, trotzdem</h2>
        <ul style={list}>
          <li>Wir mussten langsamer gehen, <strong>weil es stark geregnet hat</strong>.</li>
          <li><strong>Obwohl</strong> es sehr kalt war, sind wir weitergewandert.</li>
          <li>Ich hatte keine Internetverbindung. <strong>Deshalb</strong> habe ich eine Papierkarte benutzt.</li>
          <li>Der Weg war schwierig. <strong>Trotzdem</strong> bin ich ruhig geblieben.</li>
        </ul>
        <div style={good}><strong>Richtig:</strong> Ich habe mich verlaufen, weil ich den falschen Weg genommen habe.</div>
        <div style={warn}><strong>Falsch:</strong> Ich habe mich verlaufen, weil ich habe den falschen Weg genommen.</div>
      </section>

      <section style={card}>
        <h2 style={title}>4. Natur lebendig beschreiben</h2>
        <div style={box}>
          <strong>Adjektive für Natur und Gefühle</strong>
          <span>atemberaubend, ruhig, wild, gefährlich, steil, einsam, beeindruckend, unvergesslich, friedlich, anstrengend.</span>
        </div>
        <ul style={list}>
          <li>Die Aussicht war <strong>atemberaubend</strong>.</li>
          <li>Der Weg war <strong>steil und anstrengend</strong>.</li>
          <li>Der Wald war <strong>ruhig und friedlich</strong>.</li>
          <li>Das Erlebnis war <strong>unvergesslich</strong>, weil ich meine Grenzen kennengelernt habe.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>5. Redemittel für eine B1-Präsentation</h2>
        <ul style={list}>
          <li>Heute spreche ich über mein beeindruckendstes Natur-Abenteuer.</li>
          <li>Zuerst erzähle ich, wo ich war und mit wem ich unterwegs war.</li>
          <li>Danach beschreibe ich, was ich erlebt habe.</li>
          <li>Eine besondere Herausforderung war, dass …</li>
          <li>In meinem Heimatland kann man Naturabenteuer zum Beispiel … erleben.</li>
          <li>Ein Vorteil ist, dass man die Natur besser kennenlernt.</li>
          <li>Ein Nachteil ist, dass solche Abenteuer gefährlich oder teuer sein können.</li>
          <li>Zusammenfassend kann ich sagen, dass …</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Häufige B1-Fehler</h2>
        <ul style={list}>
          <li>Nach <strong>weil/obwohl/als/nachdem</strong> das Verb nicht ans Satzende stellen.</li>
          <li><strong>als</strong> und <strong>wenn</strong> verwechseln: Für ein einmaliges Erlebnis in der Vergangenheit benutzt man meistens <strong>als</strong>.</li>
          <li>Nur einzelne Wörter aufzählen, aber keine Geschichte mit Reihenfolge erzählen.</li>
          <li>Zu wenig konkrete Details nennen: Ort, Wetter, Dauer, Personen, Problem und Lösung fehlen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={title}>Mini-Übung: Verbinde die Ideen</h2>
        <ol style={list}>
          <li>Wir kamen im Park an. Es begann zu regnen. → Verwende <strong>als</strong>.</li>
          <li>Wir bauten das Zelt auf. Wir kochten draußen. → Verwende <strong>nachdem</strong>.</li>
          <li>Der Weg war sehr steil. Wir gingen weiter. → Verwende <strong>obwohl</strong>.</li>
          <li>Ich hatte keine Internetverbindung. Ich benutzte eine Karte. → Verwende <strong>deshalb</strong>.</li>
        </ol>
      </section>
    </div>
  );
}
