import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  lineHeight: 1.75,
  background: "#fff",
};

const Note = ({ children, tone = "blue" }) => {
  const colors = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#166534"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
    red: ["#fecaca", "#fef2f2", "#991b1b"],
  }[tone];

  return (
    <div
      style={{
        border: `1px solid ${colors[0]}`,
        background: colors[1],
        color: colors[2],
        borderRadius: 14,
        padding: 14,
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
};

export default function B1Day11TeamspieleGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>
          B1 · Day 11 · Kapitel 4.11 · Grammar Notes
        </span>
        <h1 style={{ ...styles.title, margin: 0 }}>Teamspiele und kooperative Aktivitäten</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatikfokus: reziproke Ausdrücke mit <strong>einander</strong>, <strong>miteinander</strong>, <strong>füreinander</strong>, <strong>voneinander</strong>, <strong>aufeinander</strong> und <strong>gegeneinander</strong>.
        </p>
      </header>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Warum passt diese Grammatik zum Thema?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Bei Teamspielen und kooperativen Aktivitäten handeln mehrere Personen gegenseitig. Sie hören <strong>einander</strong> zu, arbeiten <strong>miteinander</strong>, übernehmen Verantwortung <strong>füreinander</strong>, lernen <strong>voneinander</strong> und müssen sich <strong>aufeinander</strong> verlassen können. Reziproke Ausdrücke helfen dir, diese Beziehungen klar und natürlich auf B1-Niveau zu beschreiben.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Lernziele</h2>
        <ul style={list}>
          <li>Gegenseitige Handlungen mit <strong>einander</strong> ausdrücken.</li>
          <li>Präpositionen mit <strong>-einander</strong> korrekt bilden.</li>
          <li>Zwischen <strong>sich</strong> und <strong>einander</strong> unterscheiden.</li>
          <li>Teamarbeit, Konflikte und Kooperation genauer beschreiben.</li>
          <li>Die Ausdrücke in einer B1-Präsentation und einem Meinungstext verwenden.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1. Was bedeutet „einander“?</h2>
        <div style={box}>
          <strong>einander = each other / one another</strong>
          <br />
          Die Teammitglieder helfen <strong>einander</strong>.
          <br />
          Die Spieler respektieren <strong>einander</strong>.
          <br />
          Wir hören <strong>einander</strong> aufmerksam zu.
        </div>
        <Note>
          <strong>einander</strong> zeigt, dass mindestens zwei Personen dieselbe Handlung gegenseitig ausführen.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2. Präposition + einander</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <div style={box}>
            <strong>miteinander</strong> = with each other
            <br />
            Wir arbeiten gut <strong>miteinander</strong>.
          </div>
          <div style={box}>
            <strong>füreinander</strong> = for each other
            <br />
            Gute Kollegen sind <strong>füreinander</strong> da.
          </div>
          <div style={box}>
            <strong>voneinander</strong> = from each other
            <br />
            Die Spieler lernen <strong>voneinander</strong>.
          </div>
          <div style={box}>
            <strong>aufeinander</strong> = on each other
            <br />
            Im Team muss man sich <strong>aufeinander</strong> verlassen.
          </div>
          <div style={box}>
            <strong>gegeneinander</strong> = against each other
            <br />
            Im Finale spielen zwei Mannschaften <strong>gegeneinander</strong>.
          </div>
          <div style={box}>
            <strong>durcheinander</strong> = mixed up / confused
            <br />
            Bei schlechter Organisation reden alle <strong>durcheinander</strong>.
          </div>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3. sich oder einander?</h2>
        <div style={box}>
          <strong>sich</strong> kann reflexiv oder gegenseitig sein:
          <br />
          Die Spieler waschen <strong>sich</strong>. = Jeder wäscht sich selbst.
          <br />
          Die Spieler begrüßen <strong>sich</strong>. = Sie begrüßen einander.
        </div>
        <div style={box}>
          <strong>einander</strong> macht die gegenseitige Bedeutung eindeutig:
          <br />
          Die Spieler helfen <strong>einander</strong>.
          <br />
          Die Kollegen unterstützen <strong>einander</strong>.
        </div>
        <Note tone="amber">
          Bei vielen Verben ist <strong>sich</strong> möglich, aber <strong>einander</strong> ist oft klarer, wenn du ausdrücklich „gegenseitig“ meinst.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>4. Satzbau</h2>
        <div style={box}>
          <strong>Hauptsatz:</strong> Subjekt + Verb + Ergänzung.
          <br />
          Die Teammitglieder <strong>hören einander zu</strong>.
          <br />
          Wir <strong>arbeiten miteinander</strong>.
        </div>
        <div style={box}>
          <strong>Nebensatz:</strong> Das konjugierte Verb steht am Ende.
          <br />
          Teamarbeit funktioniert gut, weil die Mitglieder <strong>einander respektieren</strong>.
          <br />
          Ein Projekt wird erfolgreicher, wenn alle <strong>miteinander kommunizieren</strong>.
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>5. Typische Verbindungen</h2>
        <ul style={list}>
          <li><strong>einander helfen</strong></li>
          <li><strong>einander zuhören</strong></li>
          <li><strong>einander respektieren</strong></li>
          <li><strong>miteinander sprechen / arbeiten / planen</strong></li>
          <li><strong>füreinander Verantwortung übernehmen</strong></li>
          <li><strong>voneinander lernen</strong></li>
          <li><strong>sich aufeinander verlassen</strong></li>
          <li><strong>gegeneinander spielen</strong></li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>6. Reziproke Ausdrücke für Argumente</h2>
        <div style={box}>
          Teamspiele sind wichtig, <strong>weil</strong> die Teilnehmer <strong>voneinander lernen</strong>.
          <br />
          Die Zusammenarbeit verbessert sich, <strong>wenn</strong> alle <strong>einander zuhören</strong>.
          <br />
          Ein Team ist erfolgreicher, <strong>obwohl</strong> die Mitglieder manchmal unterschiedliche Meinungen haben, wenn sie respektvoll <strong>miteinander</strong> sprechen.
        </div>
        <Note tone="green">
          Verbinde die reziproken Ausdrücke mit <strong>weil</strong>, <strong>wenn</strong>, <strong>obwohl</strong> oder <strong>damit</strong>, um deine Meinung besser zu begründen.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Typische B1-Fehler</h2>
        <Note tone="red">
          ❌ Die Spieler helfen sich gegenseitig miteinander.
          <br />
          ✅ Die Spieler helfen <strong>einander</strong>.
        </Note>
        <Note tone="red">
          ❌ Wir lernen einander.
          <br />
          ✅ Wir lernen <strong>voneinander</strong>.
        </Note>
        <Note tone="red">
          ❌ Das Team kann verlassen aufeinander.
          <br />
          ✅ Das Team kann sich <strong>aufeinander verlassen</strong>.
        </Note>
        <Note tone="red">
          ❌ Weil die Mitglieder miteinander arbeiten gut.
          <br />
          ✅ Weil die Mitglieder gut <strong>miteinander arbeiten</strong>.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Redemittel für Sprechen und Schreiben</h2>
        <ul style={list}>
          <li>Bei Teamspielen lernen die Teilnehmer, miteinander zu arbeiten.</li>
          <li>Ein gutes Team zeichnet sich dadurch aus, dass die Mitglieder einander respektieren.</li>
          <li>Wenn man voneinander lernt, kann man bessere Lösungen finden.</li>
          <li>Die Kollegen sollten füreinander Verantwortung übernehmen.</li>
          <li>Konflikte entstehen oft, wenn die Mitglieder gegeneinander statt miteinander arbeiten.</li>
          <li>Zusammenfassend ist Teamarbeit erfolgreich, wenn man sich aufeinander verlassen kann.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Mini-Übung</h2>
        <ol style={list}>
          <li>Die Spieler helfen ___.</li>
          <li>Wir arbeiten gern ___.</li>
          <li>Die Kollegen lernen viel ___.</li>
          <li>In einem guten Team kann man sich ___ verlassen.</li>
          <li>Im Finale spielen die Mannschaften ___.</li>
          <li>Schreibe einen Satz mit <strong>füreinander</strong>.</li>
        </ol>
        <Note>
          Selbstcheck: Kannst du drei Sätze über Teamarbeit mit <em>einander</em>, <em>miteinander</em> und <em>aufeinander</em> formulieren?
        </Note>
      </section>
    </div>
  );
}
