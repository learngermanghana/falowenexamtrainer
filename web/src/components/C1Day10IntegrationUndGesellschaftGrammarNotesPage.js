import React from "react";
import { styles } from "../styles";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1600&q=80";

const cardStyle = {
  ...styles.card,
  marginBottom: 0,
  display: "grid",
  gap: 10,
};

const C1Day10IntegrationUndGesellschaftGrammarNotesPage = () => {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={cardStyle}>
        <img
          src={HERO_IMAGE}
          alt="People in public discussion about integration and society"
          loading="lazy"
          style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }}
        />
        <span style={styles.levelPill}>C1 · Day 10 Grammar Notes</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Integration und Gesellschaft</h1>
        <p style={{ ...styles.helperText, margin: 0 }}><strong>Konjunktiv I in Bericht und Kommentar</strong></p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Einführung</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Der Konjunktiv I ist die typische Form für indirekte Rede im Deutschen. Er ist besonders wichtig in journalistischen, institutionellen und formellen Texten, weil Aussagen von anderen Personen oder Quellen wiedergegeben werden können, ohne sie als absolute Tatsache zu übernehmen.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Hauptfunktion von Konjunktiv I</h2>
        <ul style={styles.checklist}>
          <li><strong>Indirekte Rede:</strong> Aussagen werden berichtet, nicht direkt zitiert.</li>
          <li><strong>Neutrales Berichten:</strong> Der Ton bleibt sachlich und quellenbasiert.</li>
          <li><strong>Distanz zu Behauptungen:</strong> Der/die Schreibende markiert, dass es eine fremde Aussage ist.</li>
          <li><strong>Typische Kontexte:</strong> Medienberichte, Stellungnahmen, Kommentare, amtliche Kommunikation.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Formüberblick (Präsensformen)</h2>
        <p style={{ margin: 0 }}>Konjunktiv I wird aus dem Verbstamm + Endungen (-e, -est, -e, -en, -et, -en) gebildet.</p>
        <ul style={styles.checklist}>
          <li><strong>sein:</strong> ich sei, du seiest, er/sie/es sei, wir seien, ihr seiet, sie seien</li>
          <li><strong>haben:</strong> ich habe, du habest, er/sie/es habe, wir haben, ihr habet, sie haben</li>
          <li><strong>werden:</strong> ich werde, du werdest, er/sie/es werde, wir werden, ihr werdet, sie werden</li>
          <li><strong>sagen:</strong> er sage · <strong>meinen:</strong> er meine · <strong>betonen:</strong> er betone</li>
          <li><strong>erklären:</strong> er erkläre · <strong>fordern:</strong> er fordere</li>
        </ul>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Wenn Konjunktiv I und Indikativ gleich aussehen (z. B. „wir haben“), wird oft Konjunktiv II oder die würde-Form genutzt, um Mehrdeutigkeit zu vermeiden.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Typische Satzmuster</h2>
        <ul style={styles.checklist}>
          <li>Der Minister sagt, die Maßnahme <strong>sei</strong> notwendig.</li>
          <li>Experten betonen, Integration <strong>gelinge</strong> nur mit gleichen Chancen.</li>
          <li>Die Autorin schreibt, viele Menschen <strong>hätten</strong> keinen einfachen Zugang zum Arbeitsmarkt.</li>
          <li>Im Bericht heißt es, die Gesellschaft <strong>brauche</strong> mehr Offenheit.</li>
          <li>Laut der Studie <strong>gebe</strong> es weiterhin strukturelle Hindernisse.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Bericht vs. Kommentar</h2>
        <p style={{ margin: 0 }}><strong>Bericht:</strong> neutral, quellenbasiert, sachlich; Konjunktiv I für fremde Aussagen.</p>
        <p style={{ margin: 0 }}><strong>Kommentar:</strong> wertend, argumentativ, mit eigener Haltung; Konjunktiv I bleibt sinnvoll für fremde Positionen.</p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Häufige Signalsignale und Verben</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>sagen, erklären, berichten, behaupten, betonen, fordern, kritisieren, hinweisen auf, schreiben, mitteilen, angeben · plus Marker wie <em>laut</em>, <em>zufolge</em>, <em>wie X betont</em>.</p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>C1-Beispiele: Integration und Gesellschaft</h2>
        <ul style={styles.checklist}>
          <li>Die Ministerin erklärt, Migration <strong>erfordere</strong> langfristige Bildungsstrategien.</li>
          <li>Ein Verband berichtet, viele Jugendliche <strong>fänden</strong> nur schwer Ausbildungsplätze.</li>
          <li>In der Debatte heißt es, Diskriminierung <strong>gefährde</strong> soziale Teilhabe.</li>
          <li>Die Zeitung schreibt, der Arbeitsmarkt <strong>profitiere</strong> von mehr Chancengleichheit.</li>
          <li>Kommentatoren meinen, Medien <strong>sollten</strong> differenzierter über Integration sprechen.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Vergleich: direkt, Indikativ, Konjunktiv I</h2>
        <ul style={styles.checklist}>
          <li><strong>Direkte Rede:</strong> „Integration braucht gleiche Chancen.“</li>
          <li><strong>Indikativ:</strong> Der Experte sagt, Integration braucht gleiche Chancen.</li>
          <li><strong>Konjunktiv I:</strong> Der Experte sagt, Integration brauche gleiche Chancen.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Häufige Fehler</h2>
        <ul style={styles.checklist}>
          <li>Indikativ statt Konjunktiv I in formellen Berichten.</li>
          <li>Konjunktiv I und II verwechseln.</li>
          <li>würde-Form zu oft verwenden.</li>
          <li>Quellenmarker vergessen (laut, zufolge, wie X betont).</li>
        </ul>
      </section>

      <section id="knowledge-test" style={cardStyle}>
        <h2 style={{ margin: 0 }}>Mini-Übung / Reflexion</h2>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>Forme um: „Wir brauchen faire Bildungschancen.“ → indirekte Rede mit Konjunktiv I.</li>
          <li>Entscheide: Ist der Satzstil eher Bericht oder Kommentar?</li>
          <li>Markiere in einem Pressetext: neutral berichtet oder persönlich kommentiert?</li>
        </ol>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Takeaway</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Konjunktiv I hilft dir, auf C1-Niveau formell, präzise und professionell zu schreiben. Für Berichte, Kommentare und mediennahe Aufgaben ist er zentral, weil du Aussagen korrekt einordnen und differenziert wiedergeben kannst.
        </p>
      </section>
    </div>
  );
};

export default C1Day10IntegrationUndGesellschaftGrammarNotesPage;
