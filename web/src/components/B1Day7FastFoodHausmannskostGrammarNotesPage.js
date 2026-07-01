import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const sectionTitle = { margin: 0, fontSize: "1.15rem" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  lineHeight: 1.75,
  background: "#fff",
  display: "grid",
  gap: 8,
};
const tableWrap = { overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 12 };
const table = { width: "100%", borderCollapse: "collapse", minWidth: 650 };
const th = { textAlign: "left", padding: 11, background: "#eff6ff", borderBottom: "1px solid #bfdbfe" };
const td = { padding: 11, borderBottom: "1px solid #e5e7eb", verticalAlign: "top" };

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

const Formula = ({ children }) => (
  <div style={{ ...box, background: "#f8fafc", fontWeight: 700, textAlign: "center" }}>{children}</div>
);

export default function B1Day7FastFoodHausmannskostGrammarNotesPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 7 · Kapitel 3.7 · Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Fast Food vs. Hausmannskost</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatikfokus: Den Genitiv als einen der vier deutschen Fälle verstehen und mit <strong>wegen</strong> und <strong>trotz</strong> korrekte B1-Sätze bilden.
        </p>
        <img
          src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80"
          alt="Frische Zutaten und Essen"
          loading="lazy"
          style={{ width: "100%", borderRadius: 14, maxHeight: 290, objectFit: "cover" }}
        />
      </header>

      <section style={card}>
        <h2 style={sectionTitle}>Warum brauchst du diese Grammatik?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Beim Thema Ernährung möchtest du Gründe, Gegensätze, Besitz und Zusammenhänge ausdrücken. Dafür brauchst du den Genitiv:
        </p>
        <ul style={listStyle}>
          <li><strong>Besitz/Zugehörigkeit:</strong> die Vorteile <strong>der Hausmannskost</strong></li>
          <li><strong>Grund:</strong> <strong>Wegen des hohen Zuckeranteils</strong> trinke ich wenig Cola.</li>
          <li><strong>Gegengrund:</strong> <strong>Trotz des Zeitaufwands</strong> koche ich jeden Abend.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Lernziele</h2>
        <ul style={listStyle}>
          <li>verstehen, was ein deutscher Fall ist,</li>
          <li>den Genitiv von Nominativ, Akkusativ und Dativ unterscheiden,</li>
          <li>bestimmte und unbestimmte Artikel im Genitiv richtig verändern,</li>
          <li>bei maskulinen und neutralen Nomen die Endung <strong>-s/-es</strong> bilden,</li>
          <li>Sätze mit <strong>wegen + Genitiv</strong> und <strong>trotz + Genitiv</strong> aufbauen.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>1. Was bedeutet „Fall“ im Deutschen?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Ein Fall zeigt, welche Aufgabe ein Nomen im Satz hat. Der Artikel verändert sich je nach Aufgabe.
        </p>

        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Fall</th>
                <th style={th}>Frage</th>
                <th style={th}>Aufgabe</th>
                <th style={th}>Beispiel</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={td}><strong>Nominativ</strong></td><td style={td}>Wer? Was?</td><td style={td}>Subjekt</td><td style={td}><strong>Das Essen</strong> ist gesund.</td></tr>
              <tr><td style={td}><strong>Akkusativ</strong></td><td style={td}>Wen? Was?</td><td style={td}>direktes Objekt</td><td style={td}>Ich esse <strong>das Essen</strong>.</td></tr>
              <tr><td style={td}><strong>Dativ</strong></td><td style={td}>Wem?</td><td style={td}>indirektes Objekt</td><td style={td}>Ich gebe <strong>dem Kind</strong> das Essen.</td></tr>
              <tr><td style={td}><strong>Genitiv</strong></td><td style={td}>Wessen?</td><td style={td}>Besitz/Zugehörigkeit; nach bestimmten Präpositionen</td><td style={td}>Die Qualität <strong>des Essens</strong> ist gut.</td></tr>
            </tbody>
          </table>
        </div>

        <NoteBox tone="blue">
          <strong>Merke:</strong> Beim Genitiv fragst du oft <strong>Wessen?</strong><br />
          Wessen Qualität? → die Qualität <strong>des Essens</strong>.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>2. So verändern sich die Artikel im Genitiv</h2>

        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Genus</th>
                <th style={th}>Nominativ</th>
                <th style={th}>Bestimmter Artikel</th>
                <th style={th}>Unbestimmter Artikel</th>
                <th style={th}>Beispiel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}><strong>Maskulin</strong></td>
                <td style={td}>der Zucker</td>
                <td style={td}><strong>des</strong></td>
                <td style={td}><strong>eines</strong></td>
                <td style={td}>wegen <strong>des Zuckers</strong></td>
              </tr>
              <tr>
                <td style={td}><strong>Neutrum</strong></td>
                <td style={td}>das Essen</td>
                <td style={td}><strong>des</strong></td>
                <td style={td}><strong>eines</strong></td>
                <td style={td}>der Geschmack <strong>des Essens</strong></td>
              </tr>
              <tr>
                <td style={td}><strong>Feminin</strong></td>
                <td style={td}>die Ernährung</td>
                <td style={td}><strong>der</strong></td>
                <td style={td}><strong>einer</strong></td>
                <td style={td}>wegen <strong>der Ernährung</strong></td>
              </tr>
              <tr>
                <td style={td}><strong>Plural</strong></td>
                <td style={td}>die Zutaten</td>
                <td style={td}><strong>der</strong></td>
                <td style={td}>keine Form von „ein“</td>
                <td style={td}>die Qualität <strong>der Zutaten</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <Formula>
          Maskulin/Neutrum: <strong>des/eines</strong> + Nomen mit <strong>-s oder -es</strong><br />
          Feminin/Plural: <strong>der/einer</strong> + Nomen ohne zusätzliche Genitivendung
        </Formula>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>3. Wann bekommt das Nomen -s oder -es?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Nur maskuline und neutrale Nomen im Singular bekommen normalerweise eine Genitivendung.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          <div style={box}>
            <strong>Oft -s</strong>
            <span>mehrsilbige Nomen:</span>
            <span>das Getränk → des Getränk<strong>s</strong></span>
            <span>der Zuckeranteil → des Zuckeranteil<strong>s</strong></span>
            <span>das Fast Food → des Fast Food<strong>s</strong></span>
          </div>
          <div style={box}>
            <strong>Oft -es</strong>
            <span>kurze/einsilbige Nomen oder Wörter auf s, ß, x, z:</span>
            <span>der Saft → des Saft<strong>es</strong></span>
            <span>das Salz → des Salz<strong>es</strong></span>
            <span>der Reis → des Reis<strong>es</strong></span>
          </div>
        </div>
        <NoteBox tone="amber">
          Für B1 genügt diese sichere Regel: <strong>des/eines + maskulines oder neutrales Nomen = meist -s oder -es.</strong>
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>4. Adjektive im Genitiv</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Nach einem Genitivartikel endet das Adjektiv normalerweise auf <strong>-en</strong>.
        </p>
        <Formula>
          wegen + des + hohen + Zuckeranteils<br />
          trotz + der + langen + Zubereitungszeit<br />
          die Vorteile + eines + frisch<strong>en</strong> Essens
        </Formula>
        <ul style={listStyle}>
          <li>der hohe Zuckeranteil → wegen <strong>des hohen Zuckeranteils</strong></li>
          <li>die lange Zubereitungszeit → trotz <strong>der langen Zubereitungszeit</strong></li>
          <li>das frische Essen → der Geschmack <strong>des frischen Essens</strong></li>
          <li>die frischen Zutaten → die Qualität <strong>der frischen Zutaten</strong></li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>5. Wegen + Genitiv: einen Grund nennen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          <strong>wegen</strong> bedeutet „because of“. Danach steht im Standarddeutsch der Genitiv.
        </p>

        <Formula>wegen + Genitivgruppe + Hauptsatz</Formula>

        <div style={box}>
          <strong>Schritt für Schritt</strong>
          <ol style={listStyle}>
            <li>Grund wählen: <em>der hohe Zuckeranteil</em></li>
            <li>Genus erkennen: <em>der Zuckeranteil</em> = maskulin</li>
            <li>Artikel ändern: <em>der → des</em></li>
            <li>Adjektiv ändern: <em>hohe → hohen</em></li>
            <li>Nomen ergänzen: <em>Zuckeranteil → Zuckeranteils</em></li>
            <li>Satz bauen: <strong>Wegen des hohen Zuckeranteils trinke ich wenig Cola.</strong></li>
          </ol>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <NoteBox tone="green">✅ Wegen <strong>des hohen Fettanteils</strong> esse ich Fast Food selten.</NoteBox>
          <NoteBox tone="green">✅ Ich esse Fast Food wegen <strong>des hohen Fettanteils</strong> selten.</NoteBox>
        </div>

        <NoteBox tone="amber">
          <strong>Wortstellung:</strong> Steht die wegen-Gruppe am Satzanfang, bleibt das Verb auf Position 2:<br />
          <strong>Wegen des Zuckers</strong> <u>trinke</u> ich weniger Cola.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>6. Trotz + Genitiv: ein unerwartetes Ergebnis ausdrücken</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          <strong>trotz</strong> bedeutet „despite/in spite of“. Etwas passiert, obwohl ein Hindernis existiert.
        </p>

        <Formula>trotz + Genitivgruppe + Hauptsatz</Formula>

        <div style={box}>
          <strong>Schritt für Schritt</strong>
          <ol style={listStyle}>
            <li>Hindernis wählen: <em>die lange Zubereitungszeit</em></li>
            <li>Genus erkennen: <em>die Zubereitungszeit</em> = feminin</li>
            <li>Artikel ändern: <em>die → der</em></li>
            <li>Adjektiv ändern: <em>lange → langen</em></li>
            <li>Satz bauen: <strong>Trotz der langen Zubereitungszeit koche ich selbst.</strong></li>
          </ol>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <NoteBox tone="green">✅ Trotz <strong>des günstigen Preises</strong> kaufe ich nicht oft Fast Food.</NoteBox>
          <NoteBox tone="green">✅ Ich koche trotz <strong>der langen Zubereitungszeit</strong> gern selbst.</NoteBox>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>7. Wegen oder weil? Trotz oder obwohl?</h2>
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr><th style={th}>Struktur</th><th style={th}>Danach kommt</th><th style={th}>Beispiel</th></tr>
            </thead>
            <tbody>
              <tr><td style={td}><strong>wegen</strong></td><td style={td}>Nomen im Genitiv</td><td style={td}>Wegen <strong>des hohen Preises</strong> kaufe ich es nicht.</td></tr>
              <tr><td style={td}><strong>weil</strong></td><td style={td}>Nebensatz + Verb am Ende</td><td style={td}>Ich kaufe es nicht, weil <strong>der Preis hoch ist</strong>.</td></tr>
              <tr><td style={td}><strong>trotz</strong></td><td style={td}>Nomen im Genitiv</td><td style={td}>Trotz <strong>des hohen Preises</strong> kaufe ich es.</td></tr>
              <tr><td style={td}><strong>obwohl</strong></td><td style={td}>Nebensatz + Verb am Ende</td><td style={td}>Ich kaufe es, obwohl <strong>der Preis hoch ist</strong>.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>8. Häufige Fehler</h2>
        <div style={{ display: "grid", gap: 10 }}>
          <NoteBox tone="red">❌ wegen der hohe Zuckeranteil</NoteBox>
          <NoteBox tone="green">✅ wegen <strong>des hohen Zuckeranteils</strong></NoteBox>
          <NoteBox tone="red">❌ trotz die lange Zubereitungszeit</NoteBox>
          <NoteBox tone="green">✅ trotz <strong>der langen Zubereitungszeit</strong></NoteBox>
          <NoteBox tone="red">❌ wegen des Zucker</NoteBox>
          <NoteBox tone="green">✅ wegen <strong>des Zuckers</strong></NoteBox>
          <NoteBox tone="red">❌ Wegen des Zuckers ich trinke wenig Cola.</NoteBox>
          <NoteBox tone="green">✅ Wegen des Zuckers <strong>trinke ich</strong> wenig Cola.</NoteBox>
        </div>
        <NoteBox tone="blue">
          In der gesprochenen Alltagssprache hört man manchmal <em>wegen + Dativ</em>. Für B1-Prüfungen und formelles Schreiben solltest du jedoch <strong>wegen/trotz + Genitiv</strong> verwenden.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Redemittel für das Thema Ernährung</h2>
        <ul style={listStyle}>
          <li>Wegen des hohen Fett- und Zuckeranteils esse ich Fast Food nur selten.</li>
          <li>Trotz des günstigen Preises ist Fast Food nicht immer die beste Wahl.</li>
          <li>Ein Vorteil der Hausmannskost ist die Qualität der Zutaten.</li>
          <li>Ein Nachteil der Fertiggerichte ist der große Anteil an Zusatzstoffen.</li>
          <li>Trotz der längeren Zubereitungszeit lohnt sich frisches Kochen.</li>
          <li>Wegen meiner Gesundheit achte ich stärker auf meine Ernährung.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Mini-Übung A: Artikel und Endungen</h2>
        <ol style={listStyle}>
          <li>Wegen ___ hoh___ Zuckeranteil___ trinke ich weniger Cola. (der)</li>
          <li>Trotz ___ lang___ Zubereitungszeit koche ich gern selbst. (die)</li>
          <li>Die Qualität ___ frisch___ Zutat___ ist wichtig. (die, Plural)</li>
          <li>Der Geschmack ___ frisch___ Essen___ ist besser. (das)</li>
          <li>Wegen ___ günstig___ Preis___ kaufen viele Menschen Fast Food. (der)</li>
        </ol>
        <details>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>Lösungen anzeigen</summary>
          <ol style={listStyle}>
            <li>wegen <strong>des hohen Zuckeranteils</strong></li>
            <li>trotz <strong>der langen Zubereitungszeit</strong></li>
            <li>die Qualität <strong>der frischen Zutaten</strong></li>
            <li>der Geschmack <strong>des frischen Essens</strong></li>
            <li>wegen <strong>des günstigen Preises</strong></li>
          </ol>
        </details>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Mini-Übung B: Sätze bauen</h2>
        <ol style={listStyle}>
          <li>Bilde einen Satz mit <strong>wegen + der hohe Fettanteil</strong>.</li>
          <li>Bilde einen Satz mit <strong>trotz + die lange Kochzeit</strong>.</li>
          <li>Formuliere denselben Grund einmal mit <strong>wegen</strong> und einmal mit <strong>weil</strong>.</li>
          <li>Formuliere denselben Gegensatz einmal mit <strong>trotz</strong> und einmal mit <strong>obwohl</strong>.</li>
        </ol>
        <NoteBox tone="blue">
          <strong>Selbstcheck:</strong> Kannst du erklären, warum <em>der Zucker</em> nach <em>wegen</em> zu <em>des Zuckers</em> wird?
        </NoteBox>
      </section>
    </div>
  );
}
