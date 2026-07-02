import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 13,
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

export default function B1Day9WorkLifeBalanceGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>
          B1 · Day 9 · Kapitel 3.9 · Grammar Notes
        </span>
        <h1 style={{ ...styles.title, margin: 0 }}>
          Work-Life-Balance im modernen Arbeitsumfeld
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatikfokus: Ziele, Methoden, Alternativen und Gegensätze mit <strong>um … zu</strong>, <strong>damit</strong>, <strong>indem</strong>, <strong>ohne … zu</strong>, <strong>statt … zu</strong>, <strong>obwohl</strong> und <strong>trotzdem</strong> ausdrücken.
        </p>
      </header>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Warum brauchst du diese Grammatik?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Beim Thema Work-Life-Balance erklärst du nicht nur, <em>was</em> Menschen tun, sondern auch <em>warum</em> und <em>wie</em> sie es tun. Du beschreibst Ziele, Maßnahmen, Grenzen und Gegensätze: Menschen planen Pausen ein, <strong>um</strong> gesund <strong>zu bleiben</strong>. Arbeitgeber bieten Gleitzeit an, <strong>damit</strong> Beschäftigte Familie und Beruf besser verbinden können. Man reduziert Stress, <strong>indem</strong> man klare Arbeitszeiten festlegt.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Lernziele</h2>
        <ul style={list}>
          <li>Ziele mit <strong>um … zu</strong> und <strong>damit</strong> formulieren.</li>
          <li>Methoden und Lösungen mit <strong>indem</strong> beschreiben.</li>
          <li>Alternativen und fehlende Handlungen mit <strong>statt … zu</strong> und <strong>ohne … zu</strong> ausdrücken.</li>
          <li>Gegensätze mit <strong>obwohl</strong> und <strong>trotzdem</strong> verbinden.</li>
          <li>Eine strukturierte B1-Meinung über Arbeit, Stress und Freizeit schreiben.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1. Ziel ausdrücken: um … zu</h2>
        <div style={box}>
          <strong>Struktur:</strong> Hauptsatz + Komma + <strong>um</strong> + Ergänzungen + <strong>zu</strong> + Infinitiv.
          <br />
          Viele Menschen machen regelmäßig Pausen, <strong>um konzentriert zu bleiben</strong>.
          <br />
          Ich schalte mein Diensthandy am Abend aus, <strong>um mich besser zu erholen</strong>.
        </div>
        <Note tone="amber">
          <strong>Wichtig:</strong> Benutze <em>um … zu</em>, wenn das Subjekt in beiden Satzteilen gleich ist.
          <br />
          Ich plane meine Freizeit bewusst. Ich möchte Stress reduzieren. → Ich plane meine Freizeit bewusst, <strong>um Stress zu reduzieren</strong>.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2. Ziel mit einem anderen Subjekt: damit</h2>
        <div style={box}>
          <strong>Struktur:</strong> Hauptsatz + Komma + <strong>damit</strong> + Subjekt + Ergänzungen + Verb am Ende.
          <br />
          Der Arbeitgeber führt flexible Arbeitszeiten ein, <strong>damit die Beschäftigten Beruf und Familie besser verbinden können</strong>.
          <br />
          Ich informiere mein Team frühzeitig, <strong>damit niemand am Wochenende arbeiten muss</strong>.
        </div>
        <Note>
          <strong>Merke:</strong> <em>um … zu</em> hat kein eigenes Subjekt. <em>damit</em> leitet einen Nebensatz mit einem eigenen Subjekt ein.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3. Methode erklären: indem</h2>
        <div style={box}>
          <strong>Frage:</strong> Wie erreicht man das Ziel?
          <br />
          Man verbessert seine Work-Life-Balance, <strong>indem man klare Arbeitszeiten festlegt</strong>.
          <br />
          Unternehmen unterstützen ihre Mitarbeitenden, <strong>indem sie Homeoffice und Gleitzeit anbieten</strong>.
        </div>
        <Note tone="green">
          <strong>Unterschied:</strong> <em>damit</em> nennt das Ziel. <em>indem</em> nennt die Methode.
          <br />
          Ich mache Sport, <strong>damit</strong> ich gesund bleibe. Ich bleibe fit, <strong>indem</strong> ich regelmäßig Sport mache.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>4. Alternative oder fehlende Handlung</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
          <div style={box}>
            <strong>statt … zu</strong> = eine bessere Alternative nennen
            <br />
            Statt am Abend E-Mails zu beantworten, verbringe ich Zeit mit meiner Familie.
          </div>
          <div style={box}>
            <strong>ohne … zu</strong> = etwas passiert nicht
            <br />
            Viele Menschen arbeiten weiter, ohne eine richtige Pause zu machen.
          </div>
        </div>
        <Note tone="amber">
          Auch hier ist das Subjekt in beiden Satzteilen normalerweise gleich. Bei verschiedenen Subjekten benutzt du einen vollständigen Nebensatz: <em>anstatt dass</em> oder <em>ohne dass</em>.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>5. Gegensatz: obwohl und trotzdem</h2>
        <div style={box}>
          <strong>obwohl</strong> leitet einen Nebensatz ein. Das Verb steht am Ende.
          <br />
          <strong>Obwohl</strong> Homeoffice flexibel ist, fällt die Trennung von Arbeit und Privatleben manchmal schwer.
        </div>
        <div style={box}>
          <strong>trotzdem</strong> steht im Hauptsatz. Das konjugierte Verb folgt direkt danach.
          <br />
          Homeoffice ist flexibel. <strong>Trotzdem fällt</strong> die Trennung manchmal schwer.
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Satzbau auf einen Blick</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
            <thead>
              <tr>
                {['Struktur', 'Funktion', 'Beispiel'].map((heading) => (
                  <th key={heading} style={{ textAlign: "left", padding: 10, borderBottom: "2px solid #cbd5e1" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['um … zu', 'Ziel, gleiches Subjekt', 'Ich mache Pausen, um produktiv zu bleiben.'],
                ['damit', 'Ziel, eigenes Subjekt', 'Die Firma bietet Gleitzeit an, damit Eltern flexibler arbeiten können.'],
                ['indem', 'Methode', 'Man reduziert Stress, indem man Aufgaben priorisiert.'],
                ['statt … zu', 'Alternative', 'Statt Überstunden zu machen, plane ich realistisch.'],
                ['ohne … zu', 'fehlende Handlung', 'Er arbeitet weiter, ohne sich auszuruhen.'],
                ['obwohl', 'Gegensatz, Nebensatz', 'Obwohl ich viel arbeite, nehme ich mir Zeit für Sport.'],
                ['trotzdem', 'Gegensatz, Hauptsatz', 'Ich habe viel Arbeit. Trotzdem mache ich eine Pause.'],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => <td key={cell} style={{ padding: 10, borderBottom: "1px solid #e5e7eb", verticalAlign: "top" }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Typische B1-Fehler</h2>
        <Note tone="red">❌ Ich mache Pausen, um ich gesund bleibe.<br />✅ Ich mache Pausen, <strong>um gesund zu bleiben</strong>.</Note>
        <Note tone="red">❌ Die Firma bietet Homeoffice, damit die Mitarbeiter haben mehr Freizeit.<br />✅ Die Firma bietet Homeoffice, <strong>damit die Mitarbeiter mehr Freizeit haben</strong>.</Note>
        <Note tone="red">❌ Man reduziert Stress, indem klare Arbeitszeiten.<br />✅ Man reduziert Stress, <strong>indem man klare Arbeitszeiten festlegt</strong>.</Note>
        <Note tone="red">❌ Obwohl ich bin müde, arbeite ich weiter.<br />✅ <strong>Obwohl ich müde bin</strong>, arbeite ich weiter.</Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Redemittel für Sprechen und Schreiben</h2>
        <ul style={list}>
          <li>Eine gute Work-Life-Balance bedeutet für mich, dass …</li>
          <li>Viele Menschen setzen klare Grenzen, um …</li>
          <li>Arbeitgeber können helfen, indem sie …</li>
          <li>Statt ständig erreichbar zu sein, sollte man …</li>
          <li>Obwohl flexible Arbeit viele Vorteile hat, …</li>
          <li>Meiner Meinung nach ist eine gute Balance möglich, wenn …</li>
          <li>Zusammenfassend lässt sich sagen, dass …</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Mini-Übung</h2>
        <ol style={list}>
          <li>Ich plane feste Pausen, ___ mich besser zu konzentrieren.</li>
          <li>Der Arbeitgeber bietet Homeoffice an, ___ Eltern flexibler arbeiten können.</li>
          <li>Man kann Stress reduzieren, ___ man realistische Ziele setzt.</li>
          <li>___ am Wochenende zu arbeiten, treffe ich Freunde.</li>
          <li>Sie beantwortet E-Mails, ___ sich richtig zu erholen.</li>
          <li>___ er müde ist, arbeitet er weiter.</li>
        </ol>
        <Note>
          <strong>Selbstcheck:</strong> Formuliere je einen eigenen Satz mit <em>um … zu</em>, <em>damit</em>, <em>indem</em> und <em>obwohl</em> zum Thema Arbeit und Freizeit.
        </Note>
      </section>
    </div>
  );
}
