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
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: ".95rem" };
const cellStyle = { border: "1px solid #e5e7eb", padding: "10px 12px", textAlign: "left", verticalAlign: "top", lineHeight: 1.6 };
const sectionTitle = { margin: 0, fontSize: "1.2rem" };

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
    red: ["#fecaca", "#fff7f7", "#991b1b"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 14, background, color, lineHeight: 1.7 }}>{children}</div>;
};

const Table = ({ rows, headers = ["Struktur", "C1-Beispiel"] }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={tableStyle}>
      <thead>
        <tr>{headers.map((header) => <th key={header} style={cellStyle}>{header}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join("|")}>{row.map((cell, index) => <td key={`${row.join("|")}-${index}`} style={cellStyle}>{index === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ExampleBox = ({ children }) => (
  <div style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 12, padding: 12, lineHeight: 1.75 }}>
    {children}
  </div>
);

const Mistake = ({ wrong, correct }) => (
  <div style={{ border: "1px solid #fecaca", background: "#fff7f7", color: "#7f1d1d", borderRadius: 12, padding: 12, display: "grid", gap: 5, lineHeight: 1.65 }}>
    <span><strong>✗ Nicht korrekt:</strong> {wrong}</span>
    <span><strong>✓ Besser:</strong> {correct}</span>
  </div>
);

const CheckAnswer = ({ question, answer }) => (
  <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
    <summary style={{ cursor: "pointer", fontWeight: 800 }}>{question}</summary>
    <div style={{ marginTop: 10, lineHeight: 1.7 }}><strong>Lösung:</strong> {answer}</div>
  </details>
);

const lessons = {
  8: {
    title: "Nominalisierung und Präpositionalstil bei Wohnen und Stadtentwicklung",
    subtitle: "Wohnraummangel, Infrastruktur und Lebensqualität sachlich und formell darstellen",
    why:
      "Beim Thema Wohnen und Stadtentwicklung reicht es auf C1 nicht, einzelne Probleme aufzuzählen. Du musst Ursachen, Folgen, Ziele, Maßnahmen und Einschränkungen sachlich verbinden. Nominalisierungen und Präpositionalgruppen helfen dir, eine formelle Eingabe an eine Stadtverwaltung präzise, höflich und lösungsorientiert zu formulieren.",
    goals: [
      "verbale Aussagen in präzise Nominalstrukturen umformen",
      "Ursachen mit aufgrund, infolge und angesichts ausdrücken",
      "Ziele und Maßnahmen mit zur/zum und durch formulieren",
      "Einschränkungen mit trotz und ungeachtet sachlich abwägen",
      "einen formellen Vorschlag an eine kommunale Stelle schreiben",
    ],
    rows: [
      ["Nominalisierung", "Wohnraum fehlt → der Mangel an Wohnraum / Wohnungen werden gebaut → der Bau von Wohnungen"],
      ["Ursache", "Aufgrund des Mangels an bezahlbarem Wohnraum steigen die sozialen Belastungen."],
      ["Folge", "Infolge der steigenden Mietpreise werden einkommensschwache Haushalte zunehmend verdrängt."],
      ["Ziel", "Zur Verbesserung der Lebensqualität sollten zusätzliche Grünflächen geschaffen werden."],
      ["Mittel", "Durch den Ausbau des öffentlichen Nahverkehrs ließe sich der Autoverkehr reduzieren."],
      ["Einschränkung", "Trotz steigender Baukosten bleibt die Schaffung bezahlbarer Wohnungen notwendig."],
    ],
    model:
      "Aufgrund des Mangels an bezahlbarem Wohnraum hat sich die Situation in vielen Stadtteilen deutlich verschärft. Infolge steigender Mieten werden Familien, Studierende und ältere Menschen zunehmend an den Stadtrand verdrängt. Zur Verbesserung der Lebensqualität sollten kommunale Flächen stärker für sozialen Wohnungsbau genutzt werden. Durch den Ausbau des Nahverkehrs und die Schaffung zusätzlicher Grünflächen könnte zudem die Belastung durch Verkehr und Hitze reduziert werden. Trotz der damit verbundenen Kosten erscheint eine schrittweise Umsetzung sinnvoll.",
    checks: [
      ["Formuliere nominal: Weil Wohnraum fehlt, steigen die Mieten.", "Aufgrund des Mangels an Wohnraum steigen die Mieten."],
      ["Formuliere ein Ziel: Die Lebensqualität soll verbessert werden.", "Zur Verbesserung der Lebensqualität ..."],
      ["Formuliere ein Mittel: Der Nahverkehr wird ausgebaut.", "Durch den Ausbau des Nahverkehrs ..."],
      ["Formuliere eine Einschränkung: Obwohl die Kosten steigen, muss gebaut werden.", "Trotz steigender Kosten muss gebaut werden."],
    ],
  },
  9: {
    title: "Konzessive und adversative Strukturen bei Konsum und Werbung",
    subtitle: "Werbung, Kaufverhalten und digitale Beeinflussung differenziert bewerten",
    why:
      "Beim Thema Konsum und Werbung musst du widersprüchliche Positionen abwägen: Werbung informiert, beeinflusst aber auch; personalisierte Empfehlungen können praktisch sein, greifen jedoch in Datenschutz und Entscheidungsfreiheit ein. C1 braucht präzise Gegensätze, Einschränkungen und vorsichtige Empfehlungen.",
    goals: [
      "Gegensätze mit während, wohingegen, dagegen und demgegenüber formulieren",
      "Einschränkungen mit obwohl, obgleich, wenngleich und auch wenn ausdrücken",
      "Argumente mit zwar … jedoch und einerseits … andererseits abwägen",
      "kritische Empfehlungen mit sollte, müsste, könnte und wäre sinnvoll formulieren",
      "eine Stellungnahme zu personalisierter Werbung differenziert schreiben",
    ],
    rows: [
      ["während / wohingegen", "Während Werbung Orientierung bieten kann, erzeugt sie zugleich künstliche Bedürfnisse."],
      ["obgleich / obwohl", "Obgleich viele Nutzer glauben, frei zu entscheiden, werden ihre Wünsche durch Algorithmen gelenkt."],
      ["zwar … jedoch", "Personalisierte Werbung kann zwar nützlich sein, jedoch sollte ihre Datengrundlage transparent gemacht werden."],
      ["dagegen / demgegenüber", "Rabatte wirken rational; dagegen sprechen Impulskäufe eher für emotionale Steuerung."],
      ["Konjunktiv II", "Plattformen müssten verständlichere Datenschutzeinstellungen anbieten."],
    ],
    model:
      "Personalisierte Werbung ist zwar ein wichtiger Bestandteil digitaler Geschäftsmodelle, jedoch beeinflusst sie Kaufentscheidungen oft stärker, als Nutzer wahrhaben möchten. Während passende Produktempfehlungen Zeit sparen können, erzeugen wiederholte Anzeigen, Rabatt-Timer und Influencer-Beiträge zusätzlichen Konsumdruck. Obgleich viele Menschen glauben, frei zu entscheiden, werden ihre Wünsche durch Datenanalyse und emotionale Strategien gelenkt. Daher müssten Plattformen transparenter erklären, warum bestimmte Anzeigen erscheinen. Eine sinnvolle Regulierung sollte Datenschutz, wirtschaftliche Interessen und Medienbildung miteinander verbinden.",
    checks: [
      ["Werbung informiert. Werbung beeinflusst aber auch. → während", "Während Werbung informiert, beeinflusst sie auch."],
      ["Synonym für obwohl auf C1", "obgleich / wenngleich / auch wenn"],
      ["Verbinde: Werbung ist nützlich. Sie braucht Regeln. → zwar … jedoch", "Werbung ist zwar nützlich, jedoch braucht sie klare Regeln."],
      ["Formuliere eine Empfehlung mit müssen im Konjunktiv II", "Plattformen müssten transparenter informieren."],
    ],
  },
  10: {
    title: "Passiv, Modalpassiv und differenzierte Bewertung bei Integration und Gesellschaft",
    subtitle: "Teilhabe, Verantwortung und gesellschaftlichen Zusammenhalt sachlich analysieren",
    why:
      "Integration und Gesellschaft sind C1-Themen, bei denen du nicht nur persönliche Meinungen sammelst, sondern gesellschaftliche Prozesse erklärst. Es geht darum, wer Zugang zu Sprache, Bildung, Arbeit, Wohnraum, politischer Beteiligung und sozialer Anerkennung bekommt. Mit Passiv und Modalpassiv kannst du Maßnahmen sachlich formulieren, ohne immer eine einzelne Person zu nennen. Gleichzeitig musst du Verantwortung klar einordnen: Individuelle Eigeninitiative ist wichtig, aber ohne faire Strukturen, verständliche Informationen, Antidiskriminierung und institutionelle Unterstützung bleibt Teilhabe begrenzt. Eine starke C1-Antwort zeigt deshalb sowohl Chancen als auch Grenzen und verbindet Beispiele mit konkreten Maßnahmen.",
    goals: [
      "Vorgangspassiv und Modalpassiv sicher nutzen",
      "gesellschaftliche Prozesse sachlich und nicht nur emotional beschreiben",
      "Verantwortung zwischen Individuen, Staat, Institutionen, Medien und Zivilgesellschaft differenziert zuordnen",
      "Integration mit Chancen, Grenzen und konkreten Bedingungen bewerten",
      "Maßnahmen nennen, die Sprache, Bildung, Arbeit, Begegnung und Anerkennung verbinden",
    ],
    rows: [
      ["Vorgangspassiv", "Integrationsangebote werden in vielen Kommunen ausgebaut."],
      ["Modalpassiv", "Sprachbarrieren müssen systematisch abgebaut werden."],
      ["von / durch", "Teilhabe wird durch Bildung, Arbeit und Sprache erleichtert."],
      ["Verantwortung", "Diskriminierung muss von Institutionen erkannt und durch klare Verfahren reduziert werden."],
      ["abwägend", "Integration kann nur gelingen, wenn individuelle Anstrengung und institutionelle Unterstützung zusammengedacht werden."],
    ],
    model:
      "Integration darf nicht allein als individuelle Anpassungsleistung verstanden werden. Sprachbarrieren müssen abgebaut, Bildungswege geöffnet und Diskriminierung ernst genommen werden. Gleichzeitig kann Teilhabe nur entstehen, wenn Zugewanderte aktiv Möglichkeiten nutzen und gesellschaftliche Institutionen verlässliche Strukturen bereitstellen. Entscheidend ist daher ein Verständnis von Integration, das Rechte, Pflichten und soziale Anerkennung miteinander verbindet. Besonders wichtig erscheint dabei, dass Maßnahmen nicht nur kurzfristig angeboten, sondern langfristig finanziert, erklärt und regelmäßig überprüft werden.",
    checks: [
      ["Aktiv: Kommunen bauen Angebote aus. → Passiv", "Angebote werden von Kommunen ausgebaut."],
      ["Modalpassiv: Man muss Barrieren abbauen.", "Barrieren müssen abgebaut werden."],
      ["Teilhabe wird ___ Bildung erleichtert.", "durch"],
      ["Nenne eine differenzierte C1-Bewertung.", "Integration braucht sowohl Eigeninitiative als auch faire institutionelle Unterstützung."],
    ],
  },
};

const Day8DeepDive = ({ lesson }) => {
  if (!lesson || Number(lesson.day) !== 8) return null;

  return (
    <>
      <section style={card}>
        <h2 style={sectionTitle}>1. Von verbal zu nominal</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          In formellen Texten klingt es oft professioneller, wenn du nicht jeden Zusammenhang mit einem Nebensatz erklärst. Stattdessen kannst du Verben und Adjektive in Nomen umwandeln.
        </p>
        <Table
          headers={["Verbaler Stil", "Nominalstil", "Wirkung"]}
          rows={[
            ["weil Wohnraum fehlt", "aufgrund des Mangels an Wohnraum", "sachlicher und kompakter"],
            ["damit die Lebensqualität verbessert wird", "zur Verbesserung der Lebensqualität", "zielorientiert"],
            ["indem der Nahverkehr ausgebaut wird", "durch den Ausbau des Nahverkehrs", "maßnahmeorientiert"],
            ["obwohl die Kosten steigen", "trotz steigender Kosten", "abwägend und formell"],
          ]}
        />
        <NoteBox tone="amber">
          <strong>Achtung:</strong> Nominalstil wirkt auf C1 gut, aber nur, wenn der Satz trotzdem verständlich bleibt. Kombiniere Nominalgruppen mit klaren Verben wie <em>führen zu</em>, <em>ermöglichen</em>, <em>verringern</em>, <em>verschärfen</em> oder <em>entlasten</em>.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>2. Präpositionen für formelle Vorschläge</h2>
        <Table
          headers={["Funktion", "Struktur", "Beispiel"]}
          rows={[
            ["Ursache", "aufgrund / infolge / angesichts + Genitiv", "Angesichts steigender Mieten ist kommunales Handeln notwendig."],
            ["Ziel", "zur / zum + Nominalisierung", "Zur Entlastung der Bewohner sollte der Nahverkehr verbessert werden."],
            ["Mittel", "durch + Akkusativ", "Durch die Umgestaltung leerstehender Flächen könnten neue Begegnungsorte entstehen."],
            ["Einschränkung", "trotz / ungeachtet + Genitiv", "Trotz begrenzter Haushaltsmittel sollte eine Pilotphase geprüft werden."],
          ]}
        />
      </section>
    </>
  );
};

const Day9DeepDive = ({ lesson }) => {
  if (!lesson || Number(lesson.day) !== 9) return null;

  return (
    <>
      <section style={card}>
        <h2 style={sectionTitle}>1. Gegensatz oder Einschränkung?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Beim Thema Werbung musst du oft zeigen, dass zwei Aussagen gleichzeitig gelten: Werbung informiert, aber sie beeinflusst auch. Dafür brauchst du klare Gegensätze und Einschränkungen.
        </p>
        <Table
          headers={["Funktion", "Struktur", "Beispiel"]}
          rows={[
            ["Gegensatz", "während / wohingegen", "Während Werbung Orientierung bieten kann, erzeugt sie zugleich künstliche Bedürfnisse."],
            ["Hauptsatz-Gegensatz", "dagegen / demgegenüber", "Personalisierte Empfehlungen wirken praktisch. Demgegenüber steht das Risiko der Datenauswertung."],
            ["Einschränkung", "obwohl / obgleich / wenngleich", "Obgleich viele Nutzer informiert wirken, erkennen sie manipulative Strategien nicht immer."],
            ["Abwägung", "zwar … jedoch", "Personalisierte Werbung ist zwar nützlich, jedoch braucht sie klare Grenzen."],
          ]}
        />
        <Mistake
          wrong="Obwohl Werbung kann nützlich sein, beeinflusst sie stark."
          correct="Obwohl Werbung nützlich sein kann, beeinflusst sie viele Kaufentscheidungen stark."
        />
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>2. Konjunktiv II für vorsichtige Empfehlungen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Auf C1 klingt Kritik stärker, wenn sie sachlich und nicht aggressiv formuliert ist. Mit Konjunktiv II kannst du Empfehlungen und Forderungen höflich, aber klar ausdrücken.
        </p>
        <Table
          headers={["Direkt", "C1 vorsichtiger"]}
          rows={[
            ["Plattformen müssen transparenter sein.", "Plattformen müssten transparenter erklären, warum bestimmte Anzeigen erscheinen."],
            ["Man muss Werbung stärker regulieren.", "Personalisierte Werbung sollte stärker reguliert werden, wenn sensible Daten genutzt werden."],
            ["Nutzer brauchen mehr Kontrolle.", "Nutzer könnten durch verständliche Einstellungen mehr Kontrolle über ihre Daten erhalten."],
          ]}
        />
      </section>
    </>
  );
};

const Day10DeepDive = ({ lesson }) => {
  if (!lesson || Number(lesson.day) !== 10) return null;

  return (
    <>
      <section style={card}>
        <h2 style={sectionTitle}>1. Integration: nicht nur Person, sondern System</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Auf C1 solltest du Integration nicht nur mit dem Satz <em>Menschen müssen Deutsch lernen</em> erklären. Das ist zu einfach. Eine differenzierte Antwort fragt auch: Gibt es bezahlbare Sprachkurse? Werden Abschlüsse anerkannt? Gibt es faire Bewerbungsverfahren? Werden Menschen in Vereinen, Schulen, Behörden und Nachbarschaften tatsächlich einbezogen?
        </p>
        <NoteBox tone="amber">
          <strong>Merke:</strong> Integration ist ein wechselseitiger Prozess. Zugewanderte Menschen brauchen Eigeninitiative, aber Gesellschaft und Institutionen müssen reale Zugänge schaffen.
        </NoteBox>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>2. Passiv und Modalpassiv für sachliche Maßnahmen</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Passiv hilft dir, gesellschaftliche Prozesse sachlich zu beschreiben. Modalpassiv zeigt, was notwendig ist. So formulierst du nicht nur Kritik, sondern konkrete Handlungsfelder.
        </p>
        <Table
          headers={["Funktion", "Struktur", "Beispiel"]}
          rows={[
            ["Problem sachlich nennen", "Passiv", "Menschen mit ausländischen Abschlüssen werden häufig zu spät beraten."],
            ["Notwendigkeit formulieren", "Modalpassiv", "Anerkennungsverfahren müssen vereinfacht werden."],
            ["Verantwortung benennen", "von + Dativ", "Integrationsangebote werden von Kommunen, Schulen und Vereinen getragen."],
            ["Mittel nennen", "durch + Akkusativ", "Teilhabe kann durch Mentoring, Sprachförderung und faire Bewerbungen gestärkt werden."],
          ]}
        />
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>3. Differenziert bewerten statt einseitig urteilen</h2>
        <Table
          headers={["Zu einfach", "C1-differenziert"]}
          rows={[
            ["Integration ist nur Aufgabe der Migranten.", "Integration erfordert sowohl Eigeninitiative als auch verlässliche institutionelle Unterstützung."],
            ["Der Staat muss alles lösen.", "Staatliche Programme können Teilhabe erleichtern, ersetzen aber nicht persönliche Begegnung und zivilgesellschaftliches Engagement."],
            ["Sprache löst alle Probleme.", "Sprachkenntnisse sind zentral, reichen jedoch ohne faire Bildungs- und Arbeitschancen nicht aus."],
          ]}
        />
        <Mistake
          wrong="Integration ist leicht, wenn Menschen einfach Deutsch lernen."
          correct="Sprachkenntnisse sind zwar eine zentrale Voraussetzung für Teilhabe, doch Integration gelingt nur, wenn Bildungswege, Arbeitsmarkt und gesellschaftliche Anerkennung ebenfalls zugänglich sind."
        />
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>4. Mini-Schreibtraining: 80–100 Wörter</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>
          Schreibe einen kurzen C1-Absatz zur Frage, wie gesellschaftlicher Zusammenhalt durch bessere Teilhabe gestärkt werden kann.
        </p>
        <NoteBox tone="blue">
          <strong>Pflichtstrukturen:</strong>
          <ul style={{ ...listStyle, marginTop: 8 }}>
            <li>ein Passivsatz mit <strong>wird/werden</strong>,</li>
            <li>ein Modalpassiv mit <strong>muss/müssen ... werden</strong>,</li>
            <li>ein Mittel mit <strong>durch</strong>,</li>
            <li>eine abwägende Formulierung mit <strong>zwar ... jedoch</strong> oder <strong>nicht nur ... sondern auch</strong>.</li>
          </ul>
        </NoteBox>
        <ExampleBox>
          <strong>Modell für 80–100 Wörter:</strong><br />
          Gesellschaftlicher Zusammenhalt wird gestärkt, wenn Teilhabe nicht nur gefordert, sondern konkret ermöglicht wird. Sprachbarrieren müssen abgebaut werden, doch Sprachkurse allein reichen nicht aus. Durch faire Anerkennungsverfahren, Mentoring und Begegnungsräume können Menschen schneller Zugang zu Bildung, Arbeit und sozialen Netzwerken erhalten. Integration verlangt zwar Eigeninitiative, jedoch müssen Institutionen verständliche Informationen, Schutz vor Diskriminierung und langfristige Unterstützung bereitstellen. Erst wenn beide Seiten Verantwortung übernehmen, kann Zugehörigkeit wachsen.
        </ExampleBox>
      </section>
    </>
  );
};

export default function C1Day8To10GrammarNotes({ day, checked = false, onCheckedChange }) {
  const lesson = lessons[Number(day)];
  if (!lesson) return null;
  const dayNumber = Number(day);
  return <div style={{ display: "grid", gap: 16 }}>
    <section style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>C1 · Day {day} · Grammar Notes</span>
      <h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>{lesson.title}</h2>
      <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>{lesson.subtitle}</p>
    </section>
    <section style={card}>
      <h2 style={sectionTitle}>Warum brauchst du diese Grammatik auf C1?</h2>
      <p style={{ margin: 0, lineHeight: 1.75 }}>{lesson.why}</p>
      <NoteBox>
        <strong>Nach dieser Lektion kannst du:</strong>
        <ul style={{ ...listStyle, marginTop: 8 }}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
      </NoteBox>
    </section>
    <section style={card}>
      <h2 style={sectionTitle}>Kernstrukturen</h2>
      <Table rows={lesson.rows} />
    </section>
    <Day8DeepDive lesson={{ ...lesson, day: dayNumber }} />
    <Day9DeepDive lesson={{ ...lesson, day: dayNumber }} />
    <Day10DeepDive lesson={{ ...lesson, day: dayNumber }} />
    <section style={card}>
      <h2 style={sectionTitle}>C1-Modellabsatz</h2>
      <NoteBox tone="green">{lesson.model}</NoteBox>
    </section>
    <section style={card}>
      <h2 style={sectionTitle}>Selbstkontrolle</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Löse die Aufgabe zuerst selbst und öffne danach die Antwort.</p>
      {lesson.checks.map(([question, answer], index) => <CheckAnswer key={question} question={`${index + 1}. ${question}`} answer={answer} />)}
    </section>
    <section style={card}>
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}>
        <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onCheckedChange?.(event.target.checked)} style={{ marginTop: 4 }} />
        <span>Ich habe die vollständigen Grammatiknotizen gelesen und die Beispiele verstanden.</span>
      </label>
    </section>
  </div>;
}
