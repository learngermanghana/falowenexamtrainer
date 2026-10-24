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
        <li><strong>Addition:</strong> außerdem, darüber hinaus, zudem, nicht nur ..., sondern auch<br />Beispiele: Viele Menschen helfen im Verein. <strong>Außerdem</strong> organisieren sie Spendenaktionen. / Viele Menschen helfen im Verein. <strong>Darüber hinaus</strong> unterstützen sie lokale Bildungsprojekte. / Die Initiative arbeitet mit Schulen; <strong>zudem</strong> kooperiert sie mit Seniorenzentren. / Die Freiwilligen begleiten <strong>nicht nur</strong> Kinder bei den Hausaufgaben, <strong>sondern auch</strong> ältere Menschen im Alltag.</li>
        <li><strong>Gegensatz / Konzession:</strong> allerdings, jedoch, dennoch, obwohl, zwar ..., aber<br />Beispiele: Viele möchten helfen, <strong>allerdings</strong> fehlen oft feste Zeitfenster. / Das Interesse an Ehrenamt wächst, <strong>jedoch</strong> brechen manche Projekte wegen Personalmangels ab. / Die Rahmenbedingungen sind schwierig; <strong>dennoch</strong> engagieren sich viele Menschen regelmäßig. / <strong>Obwohl</strong> viele Ehrenamtliche wenig Zeit haben, engagieren sie sich regelmäßig. / <strong>Zwar</strong> kostet freiwillige Arbeit Energie, <strong>aber</strong> sie stärkt den gesellschaftlichen Zusammenhalt.</li>
        <li><strong>Ursache / Grund:</strong> weil, da, aufgrund, denn<br />Beispiele: Viele Jugendliche machen mit, <strong>weil</strong> sie gesellschaftliche Verantwortung übernehmen möchten. / <strong>Da</strong> die Nachfrage nach Lernhilfe steigt, werden zusätzliche Mentorinnen gesucht. / <strong>Aufgrund</strong> der hohen Lebenshaltungskosten können manche Vereine weniger Angebote finanzieren. / Die Aktion war ein Erfolg, <strong>denn</strong> viele Nachbarinnen haben spontan mitgeholfen.</li>
        <li><strong>Folge:</strong> deshalb, deswegen, daher, sodass<br />Beispiele: Es fehlen Helferinnen und Helfer; <strong>deshalb</strong> müssen einige Kurse ausfallen. / Viele Schulen informieren aktiv über Ehrenamt, <strong>deswegen</strong> melden sich mehr Jugendliche an. / Der Bedarf in der Gemeinde ist gestiegen; <strong>daher</strong> plant der Verein neue Projekte. / Es fehlen Helferinnen und Helfer, <strong>sodass</strong> einige Projekte verkürzt werden müssen.</li>
        <li><strong>Beispiel / Präzisierung:</strong> zum Beispiel, beispielsweise, genauer gesagt, das heißt<br />Beispiele: Lokale Initiativen stärken das Miteinander, <strong>zum Beispiel</strong> durch Nachhilfeangebote. / Lokale Initiativen stärken das Miteinander, <strong>beispielsweise</strong> durch Nachhilfe- und Sprachcafés. / Viele Vereine brauchen mehr Unterstützung, <strong>genauer gesagt</strong> langfristige finanzielle Förderung. / Ehrenamt braucht verlässliche Strukturen, <strong>das heißt</strong>, klare Zuständigkeiten und feste Ansprechpartner.</li>
        <li><strong>Bedingung:</strong> wenn, falls, sofern<br />Beispiele: <strong>Wenn</strong> Städte kostenlose Räume anbieten, können mehr Workshops stattfinden. / <strong>Falls</strong> Kommunen Räume bereitstellen, können mehr Jugendprojekte entstehen. / <strong>Sofern</strong> genügend Freiwillige gefunden werden, startet das Mentoring-Programm im Sommer.</li>
        <li><strong>Ziel:</strong> damit, um ... zu<br />Beispiele: Vereine werben in Schulen, <strong>damit</strong> sich mehr junge Menschen engagieren. / Viele Organisationen bieten Schnuppertage an, <strong>um</strong> neue Ehrenamtliche <strong>zu</strong> gewinnen.</li>
        <li><strong>Schluss / Zusammenfassung:</strong> abschließend, zusammenfassend, insgesamt, folglich<br />Beispiele: <strong>Abschließend</strong> lässt sich sagen, dass Ehrenamt Demokratie im Alltag stärkt. / <strong>Zusammenfassend</strong> braucht freiwilliges Engagement mehr Sichtbarkeit und Anerkennung. / <strong>Insgesamt</strong> zeigt sich, dass Ehrenamt den sozialen Zusammenhalt langfristig stärkt. / Die Förderprogramme wurden ausgebaut; <strong>folglich</strong> können mehr Projekte langfristig geplant werden.</li>
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
