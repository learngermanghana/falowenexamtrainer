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

export default function B1Day10DigitaleAuszeitGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>
          B1 · Day 10 · Kapitel 4.10 · Grammar Notes
        </span>
        <h1 style={{ ...styles.title, margin: 0 }}>
          Digitale Auszeit und Selbstfürsorge
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatikfokus: Gewohnheiten, Strategien und Wirkungen mit <strong>Komparativ</strong>, <strong>Superlativ</strong>, <strong>so … wie</strong>, <strong>als</strong> und <strong>je … desto</strong> vergleichen.
        </p>
      </header>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Warum passt diese Grammatik zum Thema?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Beim Thema digitale Auszeit vergleichst du verschiedene Gewohnheiten und Strategien. Du erklärst zum Beispiel, dass ein Spaziergang <strong>entspannender als</strong> ständiges Scrollen ist, dass eine Stunde ohne Handy <strong>besser als</strong> gar keine Pause sein kann und dass regelmäßiger Schlaf <strong>am wichtigsten</strong> für die Erholung ist. Mit Vergleichen kannst du deine Meinung klarer begründen und Empfehlungen genauer formulieren.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Lernziele</h2>
        <ul style={list}>
          <li>Unterschiede mit dem <strong>Komparativ + als</strong> ausdrücken.</li>
          <li>Gleichheit mit <strong>so … wie</strong> und <strong>genauso … wie</strong> beschreiben.</li>
          <li>Höchststufen mit <strong>am + -sten/-esten</strong> und attributiven Superlativen formulieren.</li>
          <li>Unregelmäßige Formen wie <strong>besser</strong>, <strong>mehr</strong> und <strong>am liebsten</strong> sicher verwenden.</li>
          <li>Zusammenhänge mit <strong>je … desto/umso</strong> erklären.</li>
          <li>Eine überzeugende B1-Meinung über digitale Gewohnheiten schreiben und sprechen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1. Unterschiede vergleichen: Komparativ + als</h2>
        <div style={box}>
          <strong>Bildung:</strong> Adjektiv + <strong>-er</strong>
          <br />
          ruhig → ruhiger · gesund → gesünder · wichtig → wichtiger
          <br /><br />
          <strong>Struktur:</strong> A ist + Komparativ + <strong>als</strong> + B.
          <br />
          Ein Spaziergang ist <strong>entspannender als</strong> eine Stunde in sozialen Medien.
          <br />
          Ohne Handy schlafe ich <strong>besser als</strong> mit dem Handy im Bett.
        </div>
        <Note tone="amber">
          <strong>Merke:</strong> Für Unterschiede benutzt du <strong>als</strong>, nicht <em>wie</em>.
          <br />
          ❌ Eine digitale Pause ist gesünder wie ständiges Scrollen.
          <br />
          ✅ Eine digitale Pause ist gesünder <strong>als</strong> ständiges Scrollen.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2. Gleichheit ausdrücken: so … wie</h2>
        <div style={box}>
          <strong>Struktur:</strong> A ist <strong>so</strong> + Adjektiv + <strong>wie</strong> + B.
          <br />
          Ein ruhiger Abend ist <strong>so wichtig wie</strong> genug Schlaf.
          <br />
          Persönliche Gespräche sind <strong>genauso wertvoll wie</strong> digitale Kontakte.
        </div>
        <Note>
          <strong>Unterschied auf einen Blick:</strong>
          <br />
          Unterschied: Ein Buch ist entspannender <strong>als</strong> soziale Medien.
          <br />
          Gleichheit: Musik ist <strong>so entspannend wie</strong> ein Spaziergang.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3. Die höchste Stufe: Superlativ</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          <div style={box}>
            <strong>Prädikativ: am + -sten/-esten</strong>
            <br />
            Für mich ist Schlaf <strong>am wichtigsten</strong>.
            <br />
            Am Wochenende erhole ich mich <strong>am besten</strong> in der Natur.
          </div>
          <div style={box}>
            <strong>Vor einem Nomen: der/die/das + -ste</strong>
            <br />
            Das ist <strong>die wichtigste Regel</strong> meiner digitalen Auszeit.
            <br />
            Der Sonntag ist <strong>der ruhigste Tag</strong> der Woche.
          </div>
        </div>
        <Note tone="green">
          Viele Adjektive mit <em>-d, -t, -s, -ß, -sch, -x, -z</em> bekommen oft <strong>-esten</strong>: wichtig → am wichtigsten, bewusst → am bewusstesten.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>4. Wichtige unregelmäßige Formen</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
            <thead>
              <tr>
                {['Grundform', 'Komparativ', 'Superlativ', 'Beispiel'].map((heading) => (
                  <th key={heading} style={{ textAlign: "left", padding: 10, borderBottom: "2px solid #cbd5e1" }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['gut', 'besser', 'am besten', 'Ohne Handy schlafe ich besser.'],
                ['viel', 'mehr', 'am meisten', 'Am Wochenende habe ich am meisten Zeit für mich.'],
                ['gern', 'lieber', 'am liebsten', 'Ich lese lieber, als lange zu scrollen.'],
                ['hoch', 'höher', 'am höchsten', 'Bei ständigem Stress ist der Druck höher.'],
                ['nah', 'näher', 'am nächsten', 'Im persönlichen Gespräch fühle ich mich anderen näher.'],
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
        <h2 style={{ margin: 0 }}>5. Mehr und weniger vergleichen</h2>
        <div style={box}>
          <strong>mehr/weniger + Nomen:</strong>
          <br />
          Eine digitale Auszeit gibt mir <strong>mehr Ruhe</strong> und <strong>weniger Stress</strong>.
          <br /><br />
          <strong>mehr/weniger + Adjektiv:</strong>
          <br />
          Nach einer Pause bin ich <strong>weniger nervös</strong> und <strong>mehr konzentriert</strong>.
        </div>
        <Note tone="amber">
          Bei vielen Adjektiven klingt die normale Komparativform natürlicher: <em>konzentrierter</em> statt <em>mehr konzentriert</em>. Bei längeren Ausdrücken ist <em>mehr/weniger</em> oft hilfreich.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>6. Zusammenhang ausdrücken: je … desto/umso</h2>
        <div style={box}>
          <strong>Struktur:</strong> Je + Komparativ + Nebensatz, desto/umso + Komparativ + Hauptsatz.
          <br />
          <strong>Je weniger</strong> Benachrichtigungen ich bekomme, <strong>desto ruhiger</strong> kann ich arbeiten.
          <br />
          <strong>Je länger</strong> ich vor dem Bildschirm sitze, <strong>umso müder</strong> werden meine Augen.
          <br />
          <strong>Je bewusster</strong> man Technik nutzt, <strong>desto besser</strong> kann man sich erholen.
        </div>
        <Note>
          Im <strong>je-Satz</strong> steht das konjugierte Verb am Ende. Im <strong>desto-/umso-Satz</strong> steht das Verb direkt nach dem Vergleichsausdruck.
        </Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>7. Vergleiche für Argumente nutzen</h2>
        <div style={box}>
          Ein gutes B1-Argument verbindet Vergleich und Begründung:
          <br />
          Eine handyfreie Stunde ist <strong>realistischer als</strong> ein ganzes Wochenende ohne Technik, <strong>weil</strong> viele Menschen ihr Smartphone für Arbeit und Familie brauchen.
          <br />
          Benachrichtigungen auszuschalten ist für mich <strong>die einfachste Strategie</strong>, <strong>denn</strong> dadurch werde ich weniger abgelenkt.
        </div>
        <ul style={list}>
          <li>Im Vergleich zu … ist …</li>
          <li>Während …, ist … deutlich ruhiger/gesünder/praktischer.</li>
          <li>Die bessere Lösung ist …, weil …</li>
          <li>Am wichtigsten finde ich …, denn …</li>
          <li>Je …, desto …</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Typische B1-Fehler</h2>
        <Note tone="red">❌ Ohne Handy schlafe ich besser wie vorher.<br />✅ Ohne Handy schlafe ich besser <strong>als</strong> vorher.</Note>
        <Note tone="red">❌ Ein Spaziergang ist so entspannender wie Musik.<br />✅ Ein Spaziergang ist <strong>so entspannend wie</strong> Musik.</Note>
        <Note tone="red">❌ Das ist die am wichtigste Regel.<br />✅ Das ist <strong>die wichtigste Regel</strong>.</Note>
        <Note tone="red">❌ Je weniger ich nutze mein Handy, desto ruhiger bin ich.<br />✅ Je weniger ich mein Handy <strong>nutze</strong>, desto ruhiger bin ich.</Note>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Redemittel für Sprechen und Schreiben</h2>
        <ul style={list}>
          <li>Im Vergleich zu früher verbringe ich heute …</li>
          <li>Eine digitale Pause ist sinnvoller als …</li>
          <li>Für mich ist … genauso wichtig wie …</li>
          <li>Am wichtigsten ist, dass …</li>
          <li>Je weniger Zeit ich am Bildschirm verbringe, desto …</li>
          <li>Die beste Strategie ist meiner Meinung nach …</li>
          <li>Zusammenfassend ist ein bewusster Umgang mit Technik besser als …</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>Mini-Übung</h2>
        <ol style={list}>
          <li>Ein Spaziergang ist entspannend. Soziale Medien sind weniger entspannend. Verbinde mit <strong>als</strong>.</li>
          <li>Schlaf und Bewegung sind gleich wichtig. Formuliere mit <strong>so … wie</strong>.</li>
          <li>Für mich ist Meditation die gute Strategie. Setze den richtigen Superlativ ein.</li>
          <li>Ich bekomme weniger Benachrichtigungen. Ich bin ruhiger. Verbinde mit <strong>je … desto</strong>.</li>
          <li>Schreibe einen Satz mit <strong>lieber … als</strong> zum Thema Freizeit.</li>
          <li>Schreibe einen Satz mit <strong>am wichtigsten</strong> zum Thema Selbstfürsorge.</li>
        </ol>
        <Note tone="green">
          <strong>Selbstcheck:</strong> Formuliere drei eigene Vergleiche über deinen Alltag: einen mit <em>als</em>, einen mit <em>so … wie</em> und einen mit <em>je … desto</em>.
        </Note>
      </section>
    </div>
  );
}
