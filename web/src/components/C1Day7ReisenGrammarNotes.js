import React from "react";
import { styles } from "../styles";

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(15,23,42,.06)",
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.2rem",
};

const listStyle = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.75,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.95rem",
};

const cellStyle = {
  border: "1px solid #e5e7eb",
  padding: "10px 12px",
  textAlign: "left",
  verticalAlign: "top",
  lineHeight: 1.6,
};

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${border}`, background, color, borderRadius: 14, padding: 14, lineHeight: 1.7 }}>
      {children}
    </div>
  );
};

const ExampleBox = ({ children }) => (
  <div style={{ border: "1px solid #e5e7eb", background: "#ffffff", borderRadius: 12, padding: 12, lineHeight: 1.75 }}>
    {children}
  </div>
);

const Table = ({ children }) => (
  <div style={{ width: "100%", overflowX: "auto" }}>
    <table style={tableStyle}>{children}</table>
  </div>
);

const Mistake = ({ wrong, correct }) => (
  <div style={{ display: "grid", gap: 5, border: "1px solid #fecaca", background: "#fff7f7", borderRadius: 12, padding: 12, lineHeight: 1.65 }}>
    <span><strong>✗ Nicht korrekt:</strong> {wrong}</span>
    <span><strong>✓ Korrekt:</strong> {correct}</span>
  </div>
);

const CheckAnswer = ({ question, children }) => (
  <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#ffffff" }}>
    <summary style={{ cursor: "pointer", fontWeight: 800 }}>{question}</summary>
    <div style={{ marginTop: 10, lineHeight: 1.7 }}>{children}</div>
  </details>
);

export default function C1Day7ReisenGrammarNotes({ checked = false, onCheckedChange }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>C1 · Day 7 · Grammar Notes</span>
        <h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem, 4vw, 2.5rem)" }}>
          Erweiterte Vergleichsformen und abwägende Argumentation
        </h2>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Grammatik zum Thema <strong>Reisen und Nachhaltigkeit</strong>: Reiseformen präzise vergleichen, Unterschiede erklären und Vor- und Nachteile ausgewogen bewerten.
        </p>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Warum brauchst du diese Strukturen auf C1?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Auf C1 reicht es nicht, nur zu sagen, dass eine Reiseform besser oder schlechter ist. Du musst mehrere Kriterien vergleichen, Zusammenhänge zeigen, Einwände berücksichtigen und zu einem differenzierten Urteil kommen.
        </p>
        <NoteBox>
          <strong>Nach dieser Lektion kannst du:</strong>
          <ul style={{ ...listStyle, marginTop: 8 }}>
            <li>Reiseformen mit passenden Vergleichsausdrücken gegenüberstellen,</li>
            <li>Gegensätze mit korrekter Wortstellung formulieren,</li>
            <li>parallele Entwicklungen mit <strong>je … desto/umso</strong> beschreiben,</li>
            <li>Vergleiche sprachlich verstärken und</li>
            <li>Argumente mit <strong>einerseits … andererseits</strong> oder <strong>zwar … aber</strong> abwägen.</li>
          </ul>
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>1. Direkte Vergleiche</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Mit <strong>im Vergleich zu</strong>, <strong>gegenüber</strong> und <strong>verglichen mit</strong> stellst du zwei Reiseformen oder Situationen sachlich gegenüber.
        </p>
        <Table>
          <thead>
            <tr>
              <th style={cellStyle}>Struktur</th>
              <th style={cellStyle}>Grammatik</th>
              <th style={cellStyle}>Beispiel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}><strong>im Vergleich zu</strong></td>
              <td style={cellStyle}>+ Dativ</td>
              <td style={cellStyle}>Im Vergleich zum Flugzeug ist die Bahn weitaus klimafreundlicher.</td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>gegenüber</strong></td>
              <td style={cellStyle}>+ Dativ</td>
              <td style={cellStyle}>Gegenüber einer Fernreise verursacht ein Urlaub in der Region meist weniger Emissionen.</td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>verglichen mit</strong></td>
              <td style={cellStyle}>+ Dativ</td>
              <td style={cellStyle}>Verglichen mit einer Pauschalreise bietet eine individuelle Reise häufig mehr Flexibilität.</td>
            </tr>
          </tbody>
        </Table>
        <NoteBox tone="amber">
          <strong>Merke:</strong> zu dem → <strong>zum</strong>, zu der → <strong>zur</strong>. Sage zum Beispiel: <em>im Vergleich zum Auto</em> und <em>im Vergleich zur Flugreise</em>.
        </NoteBox>
        <Mistake wrong="Im Vergleich mit dem Flugzeug ist die Bahn günstiger." correct="Im Vergleich zum Flugzeug ist die Bahn günstiger." />
        <ExampleBox>
          <strong>Kurze Übung:</strong> Vergleiche Bahn und Flugzeug hinsichtlich Umweltwirkung, Zeit und Kosten. Verwende mindestens zwei der drei Vergleichsausdrücke.
        </ExampleBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>2. Unterschiede und Gegensätze ausdrücken</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Die Konnektoren haben eine ähnliche Bedeutung, aber nicht dieselbe Satzstruktur. Entscheidend ist, ob du einen Nebensatz oder einen Hauptsatz bildest.
        </p>
        <Table>
          <thead>
            <tr>
              <th style={cellStyle}>Konnektor</th>
              <th style={cellStyle}>Satzart</th>
              <th style={cellStyle}>Wortstellung</th>
              <th style={cellStyle}>Beispiel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}><strong>während</strong></td>
              <td style={cellStyle}>Nebensatz</td>
              <td style={cellStyle}>Verb am Ende</td>
              <td style={cellStyle}>Während Flugreisen viel Zeit sparen, verursachen sie häufig höhere Emissionen.</td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>wohingegen</strong></td>
              <td style={cellStyle}>Nebensatz</td>
              <td style={cellStyle}>Verb am Ende</td>
              <td style={cellStyle}>Pauschalreisen sind leicht zu organisieren, wohingegen individuelle Reisen mehr Flexibilität bieten.</td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>hingegen</strong></td>
              <td style={cellStyle}>Hauptsatz</td>
              <td style={cellStyle}>Verb auf Position zwei</td>
              <td style={cellStyle}>Eine Flugreise ist schneller. Die Bahn hingegen verursacht meist weniger Emissionen.</td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>demgegenüber</strong></td>
              <td style={cellStyle}>Hauptsatz</td>
              <td style={cellStyle}>Verb auf Position zwei</td>
              <td style={cellStyle}>Viele Fernreisen sind teuer. Demgegenüber können regionale Reisen deutlich günstiger sein.</td>
            </tr>
          </tbody>
        </Table>
        <Mistake wrong="Während das Flugzeug ist schneller, verursacht es mehr Emissionen." correct="Während das Flugzeug schneller ist, verursacht es mehr Emissionen." />
        <Mistake wrong="Demgegenüber regionale Reisen deutlich günstiger sein können." correct="Demgegenüber können regionale Reisen deutlich günstiger sein." />
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>3. Parallele Entwicklungen: je … desto / je … umso</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Diese Struktur zeigt, dass sich zwei Entwicklungen gleichzeitig verändern. Wenn sich der erste Faktor verstärkt oder verringert, verändert sich auch der zweite.
        </p>
        <NoteBox>
          <strong>Formel:</strong><br />
          Je + Komparativ + Subjekt + Verb am Ende, desto/umso + Komparativ + Verb + Subjekt.
        </NoteBox>
        <ExampleBox>
          Je weiter ein Reiseziel entfernt <strong>ist</strong>, desto höher <strong>sind</strong> häufig die Emissionen.<br />
          Je länger Reisende an einem Ort <strong>bleiben</strong>, umso geringer <strong>kann</strong> die Umweltbelastung pro Reisetag sein.
        </ExampleBox>
        <NoteBox tone="amber">
          <strong>Wortstellung:</strong> Im <em>je-Satz</em> steht das konjugierte Verb am Ende. Im <em>desto-/umso-Satz</em> steht es auf Position zwei.
        </NoteBox>
        <Mistake wrong="Je weiter ist das Ziel, desto höher die Emissionen sind." correct="Je weiter das Ziel entfernt ist, desto höher sind die Emissionen." />
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>4. Vergleiche präziser machen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Auf C1 solltest du nicht jeden Unterschied einfach mit <em>sehr</em> beschreiben. Mit den folgenden Wörtern kannst du die Stärke eines Vergleichs genauer ausdrücken.
        </p>
        <Table>
          <thead>
            <tr>
              <th style={cellStyle}>Ausdruck</th>
              <th style={cellStyle}>Bedeutung</th>
              <th style={cellStyle}>Beispiel</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={cellStyle}><strong>weitaus</strong></td><td style={cellStyle}>sehr viel</td><td style={cellStyle}>Die Bahn ist weitaus klimafreundlicher.</td></tr>
            <tr><td style={cellStyle}><strong>erheblich</strong></td><td style={cellStyle}>in großem Maß</td><td style={cellStyle}>Ein Direktflug verursacht erheblich mehr Emissionen.</td></tr>
            <tr><td style={cellStyle}><strong>deutlich</strong></td><td style={cellStyle}>klar erkennbar</td><td style={cellStyle}>Regionale Reisen sind deutlich günstiger.</td></tr>
            <tr><td style={cellStyle}><strong>wesentlich</strong></td><td style={cellStyle}>beträchtlich</td><td style={cellStyle}>Die Aufenthaltsdauer ist wesentlich länger.</td></tr>
            <tr><td style={cellStyle}><strong>vergleichsweise</strong></td><td style={cellStyle}>relativ betrachtet</td><td style={cellStyle}>Der Fernbus ist vergleichsweise preiswert.</td></tr>
            <tr><td style={cellStyle}><strong>kaum</strong></td><td style={cellStyle}>fast nicht</td><td style={cellStyle}>Die beiden Angebote unterscheiden sich preislich kaum.</td></tr>
          </tbody>
        </Table>
        <NoteBox tone="green">
          Diese Wörter stehen normalerweise direkt vor dem Komparativ: <strong>deutlich günstiger</strong>, <strong>weitaus nachhaltiger</strong>, <strong>erheblich teurer</strong>.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>5. Argumente ausgewogen darstellen</h2>
        <h3 style={{ margin: 0 }}>Einerseits … andererseits</h3>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Damit präsentierst du zwei unterschiedliche Perspektiven mit ähnlichem Gewicht.
        </p>
        <ExampleBox>
          Einerseits schafft der Tourismus Arbeitsplätze, andererseits kann er Wohnraum verteuern und natürliche Ressourcen belasten.
        </ExampleBox>

        <h3 style={{ margin: 0 }}>Zwar … aber</h3>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Damit erkennst du zunächst einen Punkt an und schränkst ihn anschließend ein oder stellst einen Einwand gegenüber.
        </p>
        <ExampleBox>
          Eine Tourismusabgabe könnte zwar den Naturschutz finanzieren, sie würde Reisen aber zugleich verteuern.
        </ExampleBox>

        <Table>
          <thead>
            <tr><th style={cellStyle}>Struktur</th><th style={cellStyle}>Hauptfunktion</th></tr>
          </thead>
          <tbody>
            <tr><td style={cellStyle}><strong>einerseits … andererseits</strong></td><td style={cellStyle}>Zwei relevante Seiten werden mit ähnlichem Gewicht dargestellt.</td></tr>
            <tr><td style={cellStyle}><strong>zwar … aber</strong></td><td style={cellStyle}>Ein Punkt wird anerkannt und danach eingeschränkt oder relativiert.</td></tr>
          </tbody>
        </Table>
        <Mistake wrong="Einerseits ist die Bahn klimafreundlich, aber kann die Fahrt länger dauern." correct="Einerseits ist die Bahn klimafreundlich, andererseits kann die Fahrt länger dauern." />
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>6. Alles miteinander verbinden</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Ein guter C1-Absatz kombiniert mehrere Strukturen, ohne überladen zu wirken.
        </p>
        <NoteBox tone="green">
          Im Vergleich zu Kurzstreckenflügen ist eine Bahnfahrt häufig weitaus klimafreundlicher. Während das Flugzeug vor allem durch seine Schnelligkeit überzeugt, bietet die Bahn Vorteile hinsichtlich Komfort und Umweltwirkung. Je besser das europäische Bahnnetz ausgebaut wird, desto attraktiver wird diese Reiseform. Einerseits sollten klimafreundliche Verkehrsmittel stärker gefördert werden, andererseits müssen Mobilität und soziale Teilhabe bezahlbar bleiben. Höhere Flugabgaben könnten zwar ökologische Anreize schaffen, sie dürften aber Menschen mit geringem Einkommen nicht unverhältnismäßig belasten.
        </NoteBox>
        <ul style={listStyle}>
          <li><strong>Direkter Vergleich:</strong> im Vergleich zu</li>
          <li><strong>Gegensatz:</strong> während</li>
          <li><strong>Parallele Entwicklung:</strong> je … desto</li>
          <li><strong>Verstärkung:</strong> weitaus</li>
          <li><strong>Abwägung:</strong> einerseits … andererseits und zwar … aber</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Typische Fehler</h2>
        <ul style={listStyle}>
          <li>Nach <strong>während</strong> oder <strong>wohingegen</strong> steht das Verb nicht auf Position zwei, sondern am Ende.</li>
          <li>Nach <strong>hingegen</strong> oder <strong>demgegenüber</strong> bleibt die Hauptsatzstellung erhalten.</li>
          <li>Nach <strong>je</strong> brauchst du normalerweise einen Komparativ und ein Verb am Satzende.</li>
          <li>Verwende <strong>im Vergleich zu</strong>, nicht <em>im Vergleich mit</em>.</li>
          <li>Mische nicht <strong>einerseits</strong> mit <strong>aber</strong>, wenn du die feste Paarform <strong>einerseits … andererseits</strong> übst.</li>
          <li>Ein Verstärkungswort braucht einen passenden Vergleich: <strong>deutlich günstiger</strong>, nicht nur <em>deutlich günstig</em>.</li>
        </ul>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Schrittweise Mini-Übung</h2>
        <ol style={listStyle}>
          <li>Vergleiche Bahn und Flugzeug mit <strong>im Vergleich zu</strong>.</li>
          <li>Korrigiere die Wortstellung: <em>Während eine Flugreise ist schneller, verursacht sie mehr Emissionen.</em></li>
          <li>Ergänze: <em>Je länger die Entfernung ist, ______ höher sind häufig die Emissionen.</em></li>
          <li>Verstärke den Satz mit <strong>weitaus</strong>: <em>Die Bahn ist klimafreundlicher.</em></li>
          <li>Verbinde Nutzen und Kosten einer Tourismusabgabe mit <strong>zwar … aber</strong>.</li>
          <li>Schreibe einen Absatz mit 80–100 Wörtern und verwende einen direkten Vergleich, einen Gegensatz, <strong>je … desto</strong>, ein Verstärkungswort und eine abwägende Struktur.</li>
        </ol>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Selbstkontrolle</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Beantworte zuerst jede Frage selbst und öffne danach die Lösung.</p>
        <CheckAnswer question="1. Welche Formulierung stellt zwei Reiseformen sachlich gegenüber?">
          <strong>Lösung:</strong> Im Vergleich zum Flugzeug ist die Bahn emissionsärmer. <em>Im Vergleich zu</em> leitet einen direkten Vergleich ein und verlangt den Dativ.
        </CheckAnswer>
        <CheckAnswer question="2. Welche Wortstellung ist korrekt?">
          <strong>Lösung:</strong> Je weiter das Ziel entfernt ist, desto höher sind meist die Emissionen. Im je-Satz steht das Verb am Ende; im desto-Satz steht es auf Position zwei.
        </CheckAnswer>
        <CheckAnswer question="3. Welches Wort verstärkt einen Komparativ?">
          <strong>Lösung:</strong> <em>weitaus</em>, zum Beispiel: <em>weitaus günstiger</em> oder <em>weitaus nachhaltiger</em>.
        </CheckAnswer>
        <CheckAnswer question="4. Welche Struktur eignet sich für eine ausgewogene Bewertung?">
          <strong>Lösung:</strong> <em>einerseits … andererseits</em>. Damit stellst du zwei relevante Perspektiven gegenüber.
        </CheckAnswer>
      </section>

      <section style={card}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}>
          <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onCheckedChange?.(event.target.checked)} style={{ marginTop: 4 }} />
          <span>Ich habe die vollständigen Grammatiknotizen gelesen und die Beispiele verstanden.</span>
        </label>
      </section>
    </div>
  );
}
