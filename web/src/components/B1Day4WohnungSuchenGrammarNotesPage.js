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
  };
  const selected = tones[tone] || tones.blue;

  return (
    <div
      style={{
        border: `1px solid ${selected.border}`,
        background: selected.background,
        color: selected.color,
        borderRadius: 14,
        padding: 14,
        lineHeight: 1.7,
      }}
    >
      {children}
    </div>
  );
};

const ExampleBox = ({ children }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      background: "#fff",
      borderRadius: 12,
      padding: 12,
      lineHeight: 1.75,
    }}
  >
    {children}
  </div>
);

const B1Day4WohnungSuchenGrammarNotesPage = () => (
  <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

    <header style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>
        B1 · Day 4 · Kapitel 2.4 · Grammar Notes
      </span>
      <h1 style={{ ...styles.title, margin: 0 }}>
        Zweiteilige Konnektoren: Wohnungsmöglichkeiten vergleichen und bewerten
      </h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>
        Grammatik zum Thema <strong>Wohnung suchen</strong>: Alternativen nennen, Vor- und Nachteile abwägen und eine B1-Meinung klar strukturieren.
      </p>
      <img
        src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80"
        alt="Wohnungen in einer deutschen Großstadt"
        loading="lazy"
        style={{ width: "100%", borderRadius: 14, maxHeight: 280, objectFit: "cover" }}
      />
    </header>

    <section style={card}>
      <h2 style={sectionTitle}>Warum passt diese Grammatik zum Thema Wohnungssuche?</h2>
      <p style={{ margin: 0, lineHeight: 1.75 }}>
        Bei der Wohnungssuche musst du häufig mehrere Möglichkeiten vergleichen: Online-Portale oder persönliche Kontakte,
        Innenstadt oder Stadtrand, WG oder eigene Wohnung, günstige Miete oder gute Lage. Auf B1-Niveau solltest du nicht nur
        einzelne Sätze nennen, sondern Zusammenhänge, Gegensätze und Alternativen deutlich machen.
      </p>
      <NoteBox>
        <strong>Merke:</strong> Zweiteilige Konnektoren bestehen aus zwei Teilen. Sie verbinden gleichartige Wörter,
        Satzteile oder ganze Hauptsätze und helfen dir, deine Meinung logisch aufzubauen.
      </NoteBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>Schnellübersicht</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Konnektor</th>
              <th style={cellStyle}>Funktion</th>
              <th style={cellStyle}>Beispiel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}><strong>sowohl … als auch</strong></td>
              <td style={cellStyle}>zwei positive oder gleichwertige Punkte</td>
              <td style={cellStyle}>Sowohl die Lage als auch der Mietpreis sind wichtig.</td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>nicht nur … sondern auch</strong></td>
              <td style={cellStyle}>einen zweiten Punkt verstärken</td>
              <td style={cellStyle}>Persönliche Kontakte sind nicht nur schnell, sondern auch vertrauenswürdig.</td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>zwar … aber</strong></td>
              <td style={cellStyle}>Einschränkung oder Gegensatz</td>
              <td style={cellStyle}>Online-Portale bieten zwar viele Anzeigen, aber die Konkurrenz ist groß.</td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>einerseits … andererseits</strong></td>
              <td style={cellStyle}>Vor- und Nachteile abwägen</td>
              <td style={cellStyle}>Einerseits ist die Innenstadt praktisch, andererseits sind die Mieten hoch.</td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>entweder … oder</strong></td>
              <td style={cellStyle}>zwei Alternativen</td>
              <td style={cellStyle}>Ich suche entweder eine WG oder eine kleine Einzimmerwohnung.</td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>weder … noch</strong></td>
              <td style={cellStyle}>zwei Punkte verneinen</td>
              <td style={cellStyle}>Weder die Lage noch die Nebenkosten passen zu meinem Budget.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>1. sowohl … als auch</h2>
      <p style={{ margin: 0, lineHeight: 1.75 }}>
        Mit <strong>sowohl … als auch</strong> verbindest du zwei gleichwertige positive Informationen. Die beiden Teile sollten grammatisch parallel sein.
      </p>
      <ExampleBox>
        <strong>Nomen:</strong> Sowohl der Balkon als auch der Keller sind wichtig.<br />
        <strong>Adjektive:</strong> Die Wohnung ist sowohl hell als auch ruhig.<br />
        <strong>Handlungen:</strong> Ich möchte sowohl online suchen als auch Freunde fragen.
      </ExampleBox>
      <NoteBox tone="amber">
        Wenn zwei Personen oder Dinge das Subjekt bilden, steht das Verb meistens im Plural: <strong>Sowohl die Lage als auch der Preis sind entscheidend.</strong>
      </NoteBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>2. nicht nur … sondern auch</h2>
      <p style={{ margin: 0, lineHeight: 1.75 }}>
        Mit <strong>nicht nur … sondern auch</strong> nennst du einen Punkt und fügst einen weiteren, oft stärkeren Punkt hinzu.
      </p>
      <ExampleBox>
        Die Wohnung ist <strong>nicht nur</strong> günstig, <strong>sondern auch</strong> gut angebunden.<br />
        Persönliche Kontakte helfen <strong>nicht nur</strong> bei der Suche, <strong>sondern auch</strong> bei der Einschätzung des Vermieters.<br />
        Man sollte <strong>nicht nur</strong> die Kaltmiete prüfen, <strong>sondern auch</strong> die Nebenkosten beachten.
      </ExampleBox>
      <NoteBox tone="amber">
        Nach <strong>sondern</strong> steht normalerweise kein Nebensatz. Das Verb bleibt im Hauptsatz auf Position 2.
      </NoteBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>3. zwar … aber</h2>
      <p style={{ margin: 0, lineHeight: 1.75 }}>
        <strong>Zwar … aber</strong> zeigt, dass eine Aussage richtig ist, aber durch eine zweite Aussage eingeschränkt wird.
      </p>
      <ExampleBox>
        Die Wohnung ist <strong>zwar</strong> klein, <strong>aber</strong> sie liegt sehr zentral.<br />
        Online-Anzeigen sind <strong>zwar</strong> praktisch, <strong>aber</strong> persönliche Empfehlungen sind oft zuverlässiger.<br />
        Die Miete ist <strong>zwar</strong> hoch, <strong>aber</strong> die Nebenkosten sind niedrig.
      </ExampleBox>
      <NoteBox>
        <strong>Wortstellung:</strong> Nach <em>aber</em> folgt ein normaler Hauptsatz: <strong>aber persönliche Kontakte helfen oft</strong> – nicht: <em>aber persönliche Kontakte oft helfen</em>.
      </NoteBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>4. einerseits … andererseits</h2>
      <p style={{ margin: 0, lineHeight: 1.75 }}>
        Diese Verbindung ist besonders nützlich für B1-Diskussionen und Meinungsbeiträge. Du stellst zwei Perspektiven gegenüber.
      </p>
      <ExampleBox>
        <strong>Einerseits</strong> findet man online schnell viele Angebote, <strong>andererseits</strong> bewerben sich dort sehr viele Menschen.<br />
        <strong>Einerseits</strong> bietet eine WG soziale Kontakte, <strong>andererseits</strong> hat man weniger Privatsphäre.<br />
        <strong>Einerseits</strong> ist eine Wohnung außerhalb günstiger, <strong>andererseits</strong> ist der Arbeitsweg länger.
      </ExampleBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>5. entweder … oder / weder … noch</h2>
      <p style={{ margin: 0, lineHeight: 1.75 }}>
        <strong>Entweder … oder</strong> nennt zwei mögliche Alternativen. <strong>Weder … noch</strong> verneint beide Möglichkeiten.
      </p>
      <ExampleBox>
        <strong>Entweder</strong> finde ich eine günstige Wohnung am Stadtrand, <strong>oder</strong> ich ziehe in eine WG im Zentrum.<br />
        Wir vereinbaren den Besichtigungstermin <strong>entweder</strong> telefonisch <strong>oder</strong> per E-Mail.<br /><br />
        <strong>Weder</strong> die Online-Anzeige <strong>noch</strong> die Fotos enthalten genaue Informationen.<br />
        Die Wohnung ist <strong>weder</strong> möbliert <strong>noch</strong> renoviert.
      </ExampleBox>
      <NoteBox tone="amber">
        Bei <strong>weder … noch</strong> brauchst du kein zusätzliches <em>nicht</em>: richtig ist <strong>Weder die Lage noch der Preis passen.</strong>
      </NoteBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>Wortstellung: Der wichtigste B1-Punkt</h2>
      <ul style={listStyle}>
        <li>Die Konnektoren verbinden oft Hauptsätze oder gleichartige Satzteile.</li>
        <li>Sie schicken das Verb nicht automatisch ans Satzende.</li>
        <li>Nach <strong>aber, sondern</strong> und <strong>oder</strong> gilt normale Hauptsatzstellung.</li>
        <li>Bei <strong>einerseits</strong> und <strong>andererseits</strong> steht das konjugierte Verb im jeweiligen Hauptsatz auf Position 2.</li>
      </ul>
      <ExampleBox>
        <strong>Richtig:</strong> Einerseits <u>ist</u> die Wohnung günstig, andererseits <u>liegt</u> sie weit außerhalb.<br />
        <strong>Falsch:</strong> Einerseits die Wohnung günstig ist, andererseits sie weit außerhalb liegt.
      </ExampleBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>So benutzt du die Grammatik in Teil 2 Schreiben</h2>
      <p style={{ margin: 0, lineHeight: 1.75 }}>
        Für den Meinungsbeitrag über persönliche Kontakte und Online-Portale kannst du diese Struktur verwenden:
      </p>
      <ol style={listStyle}>
        <li><strong>Einleitung:</strong> Das Thema Wohnungssuche ist in vielen Städten besonders wichtig.</li>
        <li><strong>Eigene Meinung:</strong> Meiner Meinung nach sollte man sowohl Online-Portale als auch persönliche Kontakte nutzen.</li>
        <li><strong>Vorteil und Einschränkung:</strong> Online-Portale bieten zwar viele Anzeigen, aber die Konkurrenz ist häufig sehr groß.</li>
        <li><strong>Zweiter Vorteil:</strong> Persönliche Empfehlungen sind nicht nur direkter, sondern oft auch vertrauenswürdiger.</li>
        <li><strong>Schluss:</strong> Deshalb ist eine Kombination aus beiden Methoden am sinnvollsten.</li>
      </ol>
      <NoteBox tone="green">
        <strong>B1-Ziel:</strong> Verwende in deinem Text mindestens zwei verschiedene zweiteilige Konnektoren. Achte darauf, dass deine Sätze logisch verbunden und nicht nur aufgezählt sind.
      </NoteBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>Häufige Fehler</h2>
      <div style={{ display: "grid", gap: 10 }}>
        <ExampleBox>
          ❌ Sowohl die Lage ist gut als auch der Preis ist günstig.<br />
          ✅ Sowohl die Lage als auch der Preis sind gut.
        </ExampleBox>
        <ExampleBox>
          ❌ Die Wohnung ist nicht nur günstig, aber auch zentral.<br />
          ✅ Die Wohnung ist nicht nur günstig, sondern auch zentral.
        </ExampleBox>
        <ExampleBox>
          ❌ Zwar die Wohnung ist klein, aber sie ist hell.<br />
          ✅ Die Wohnung ist zwar klein, aber sie ist hell.
        </ExampleBox>
        <ExampleBox>
          ❌ Weder die Lage noch der Preis passen nicht.<br />
          ✅ Weder die Lage noch der Preis passen.
        </ExampleBox>
      </div>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>Mini-Übung</h2>
      <p style={{ margin: 0, lineHeight: 1.75 }}>Verbinde die Informationen mit dem passenden Konnektor.</p>
      <ol style={listStyle}>
        <li>Die Wohnung ist günstig. Sie ist gut angebunden. <em>(nicht nur … sondern auch)</em></li>
        <li>Online-Portale sind praktisch. Dort gibt es viel Konkurrenz. <em>(zwar … aber)</em></li>
        <li>Ich suche eine WG. Ich suche eine Einzimmerwohnung. <em>(entweder … oder)</em></li>
        <li>Die Lage passt nicht. Die Nebenkosten passen nicht. <em>(weder … noch)</em></li>
        <li>Persönliche Kontakte können helfen. Online-Portale können helfen. <em>(sowohl … als auch)</em></li>
      </ol>
      <NoteBox>
        <strong>Mögliche Lösungen:</strong><br />
        1. Die Wohnung ist nicht nur günstig, sondern auch gut angebunden.<br />
        2. Online-Portale sind zwar praktisch, aber dort gibt es viel Konkurrenz.<br />
        3. Ich suche entweder eine WG oder eine Einzimmerwohnung.<br />
        4. Weder die Lage noch die Nebenkosten passen.<br />
        5. Sowohl persönliche Kontakte als auch Online-Portale können helfen.
      </NoteBox>
    </section>

    <section style={card}>
      <h2 style={sectionTitle}>Das musst du können</h2>
      <ul style={listStyle}>
        <li>zwei positive Punkte mit <strong>sowohl … als auch</strong> verbinden</li>
        <li>einen zusätzlichen Punkt mit <strong>nicht nur … sondern auch</strong> hervorheben</li>
        <li>eine Einschränkung mit <strong>zwar … aber</strong> ausdrücken</li>
        <li>Vor- und Nachteile mit <strong>einerseits … andererseits</strong> abwägen</li>
        <li>Alternativen mit <strong>entweder … oder</strong> nennen</li>
        <li>zwei Möglichkeiten mit <strong>weder … noch</strong> verneinen</li>
        <li>die normale Hauptsatzstellung beibehalten</li>
      </ul>
    </section>
  </div>
);

export default B1Day4WohnungSuchenGrammarNotesPage;
