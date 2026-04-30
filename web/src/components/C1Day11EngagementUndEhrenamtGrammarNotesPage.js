import React from "react";
import { styles } from "../styles";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80";

const cardStyle = {
  ...styles.card,
  marginBottom: 0,
  display: "grid",
  gap: 10,
};

const C1Day11EngagementUndEhrenamtGrammarNotesPage = () => (
  <div style={{ display: "grid", gap: 16 }}>
    <section style={cardStyle}>
      <img src={HERO_IMAGE} alt="Volunteers working together in a community initiative" loading="lazy" style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }} />
      <span style={styles.levelPill}>C1 · Day 11 Grammar Notes</span>
      <h1 style={{ ...styles.title, margin: 0 }}>Engagement und Ehrenamt</h1>
      <p style={{ ...styles.helperText, margin: 0 }}><strong>Textverknüpfung mit Konnektoren</strong></p>
    </section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Einführung</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Konnektoren sind sprachliche Verknüpfungsmittel, die Sätze, Teilsätze und ganze Abschnitte logisch verbinden. Auf C1-Niveau sind sie zentral, weil sie Argumente klar strukturieren und Aussagen präzise einordnen. Mit passenden Konnektoren kannst du Gründe, Gegensätze, Beispiele, Folgen und Schlussfolgerungen nachvollziehbar darstellen – sowohl beim Schreiben als auch beim Sprechen.</p></section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Hauptfunktion von Konnektoren</h2><ul style={styles.checklist}><li>Ideen klar strukturieren</li><li>Sätze und Absätze logisch verbinden</li><li>Beziehungen zwischen Gedanken sichtbar machen</li><li>Kohärenz und Lesefluss verbessern</li><li>Formelle Texte präziser und überzeugender machen</li></ul></section>

    <section style={cardStyle}>
      <h2 style={{ margin: 0 }}>Kategorien und typische Konnektoren</h2>
      <ul style={styles.checklist}>
        <li><strong>Addition:</strong> außerdem, darüber hinaus, zudem, nicht nur ..., sondern auch<br />Beispiel: Viele Menschen helfen im Verein. <strong>Darüber hinaus</strong> unterstützen sie lokale Bildungsprojekte.</li>
        <li><strong>Gegensatz / Konzession:</strong> allerdings, jedoch, dennoch, obwohl, zwar ..., aber<br />Beispiel: <strong>Obwohl</strong> viele Ehrenamtliche wenig Zeit haben, engagieren sie sich regelmäßig.</li>
        <li><strong>Ursache / Grund:</strong> weil, da, aufgrund, denn<br />Beispiel: Viele Jugendliche machen mit, <strong>weil</strong> sie gesellschaftliche Verantwortung übernehmen möchten.</li>
        <li><strong>Folge:</strong> deshalb, deswegen, daher, sodass<br />Beispiel: Es fehlen Helferinnen und Helfer, <strong>sodass</strong> einige Projekte verkürzt werden müssen.</li>
        <li><strong>Beispiel / Präzisierung:</strong> zum Beispiel, beispielsweise, genauer gesagt, das heißt<br />Beispiel: Lokale Initiativen stärken das Miteinander, <strong>beispielsweise</strong> durch Nachhilfe- und Sprachcafés.</li>
        <li><strong>Bedingung:</strong> wenn, falls, sofern<br />Beispiel: <strong>Falls</strong> Kommunen Räume bereitstellen, können mehr Jugendprojekte entstehen.</li>
        <li><strong>Ziel:</strong> damit, um ... zu<br />Beispiel: Vereine werben in Schulen, <strong>damit</strong> sich mehr junge Menschen engagieren.</li>
        <li><strong>Schluss / Zusammenfassung:</strong> abschließend, zusammenfassend, insgesamt, folglich<br />Beispiel: <strong>Insgesamt</strong> zeigt sich, dass Ehrenamt den sozialen Zusammenhalt langfristig stärkt.</li>
      </ul>
    </section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Position und Satzstruktur</h2><p style={{ margin: 0, lineHeight: 1.7 }}><strong>Konjunktionen</strong> wie <em>denn, aber, und</em> verbinden Hauptsätze; das Verb bleibt auf Position 2. <strong>Subjunktionen</strong> wie <em>weil, obwohl, damit</em> leiten Nebensätze ein; das Verb steht am Satzende. <strong>Adverbiale Konnektoren</strong> wie <em>deshalb, dennoch, außerdem</em> stehen oft im Vorfeld; danach folgt das finite Verb.</p><ul style={styles.checklist}><li>Viele Menschen engagieren sich ehrenamtlich, <strong>weil</strong> sie etwas verändern möchten.</li><li>Ehrenamt ist wichtig. <strong>Deshalb</strong> sollte es stärker unterstützt werden.</li><li><strong>Zwar</strong> kostet freiwilliges Engagement Zeit, <strong>aber</strong> es stärkt den gesellschaftlichen Zusammenhalt.</li><li>Viele Vereine brauchen Unterstützung. <strong>Außerdem</strong> fehlen oft junge Mitglieder.</li></ul></section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>C1-Beispiele zum Thema Engagement und Ehrenamt</h2><ul style={styles.checklist}><li>Viele Menschen übernehmen soziale Verantwortung, <strong>da</strong> sie konkrete Probleme in ihrer Nachbarschaft sehen.</li><li>Jugendprojekte sind wichtig; <strong>dennoch</strong> fehlt es häufig an langfristiger Finanzierung.</li><li>Freiwillige unterstützen ältere Menschen, <strong>damit</strong> diese länger selbstständig leben können.</li><li><strong>Aufgrund</strong> beruflicher Belastung ziehen sich einige Engagierte zeitweise zurück.</li><li>Lokale Initiativen vernetzen Schulen und Vereine, <strong>sodass</strong> neue Formen der Zusammenarbeit entstehen.</li></ul></section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Vergleich: schwacher vs. guter Textfluss</h2><p style={{ margin: 0 }}><strong>Ohne Konnektoren:</strong> Viele Menschen engagieren sich ehrenamtlich. Es gibt Probleme. Vereine brauchen Hilfe.</p><p style={{ margin: 0 }}><strong>Mit Konnektoren:</strong> Viele Menschen engagieren sich ehrenamtlich. <strong>Dennoch</strong> gibt es zahlreiche Probleme, <strong>denn</strong> viele Vereine brauchen dringend Unterstützung.</p></section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Häufige Fehler</h2><ul style={styles.checklist}><li>Derselbe Konnektor wird zu oft wiederholt.</li><li>Falsche Wortstellung nach Konnektoren.</li><li>Der Konnektor passt nicht zur beabsichtigten Aussage.</li><li>Einfache Verbindungen wie und/aber/weil werden überstrapaziert.</li><li>Konnektoren werden mechanisch eingesetzt, ohne echte logische Beziehung.</li></ul></section>

    <section id="knowledge-test" style={cardStyle}><h2 style={{ margin: 0 }}>Mini-Übung / Reflexion</h2><ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}><li>Verbinde: „Viele möchten helfen. Sie haben wenig Zeit.“ mit einem passenden Konnektor.</li><li>Wähle den besten Konnektor: „Es gibt kaum Ehrenamtliche, ___ einige Vereine Projekte schließen müssen.“</li><li>Verbessere einen kurzen Absatz, indem du abwechslungsreiche Konnektoren ergänzt.</li></ol></section>

    <section style={cardStyle}><h2 style={{ margin: 0 }}>Takeaway</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Gute Konnektoren machen Texte kohärent, flüssig und sprachlich fortgeschritten. Besonders in C1-Aufgaben wie Diskussionen, Berichten, Stellungnahmen und formeller Argumentation sind sie entscheidend für Klarheit und Überzeugungskraft.</p></section>
  </div>
);

export default C1Day11EngagementUndEhrenamtGrammarNotesPage;
