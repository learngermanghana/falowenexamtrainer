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

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 14, background, color, lineHeight: 1.7 }}>{children}</div>;
};
const ExampleBox = ({ children }) => <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff", lineHeight: 1.75 }}>{children}</div>;
const Table = ({ children }) => <div style={{ width: "100%", overflowX: "auto" }}><table style={tableStyle}>{children}</table></div>;
const Mistake = ({ wrong, correct }) => (
  <div style={{ display: "grid", gap: 5, border: "1px solid #fecaca", background: "#fff7f7", borderRadius: 12, padding: 12, lineHeight: 1.65 }}>
    <span><strong>✗ Nicht korrekt:</strong> {wrong}</span>
    <span><strong>✓ Korrekt:</strong> {correct}</span>
  </div>
);
const CheckAnswer = ({ question, children }) => (
  <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
    <summary style={{ cursor: "pointer", fontWeight: 800 }}>{question}</summary>
    <div style={{ marginTop: 10, lineHeight: 1.7 }}>{children}</div>
  </details>
);

const lessons = {
  2: {
    title: "Konjunktiv II: höflich und hypothetisch sprechen",
    subtitle: "Bitten, Kritik, Ratschläge und mögliche Beziehungssituationen diplomatisch formulieren",
    why: "Auf B2 solltest du Konflikte nicht mit Befehlen oder sehr direkten Aussagen lösen. Der Konjunktiv II schafft sprachlichen Abstand, macht Bitten höflicher und hilft dir, mögliche Folgen einer anderen Handlung zu beschreiben.",
    goals: [
      "höfliche Bitten mit könnte und würde formulieren",
      "Ratschläge mit sollte, könnte und würde geben",
      "hypothetische wenn-Sätze bilden",
      "eine höfliche Lösung begründen und ihren Vorteil erklären",
    ],
    sections: [
      {
        title: "1. Höfliche Bitten statt Befehle",
        text: "Direkte Aufforderungen können in einem Konflikt hart wirken. Mit könnte oder würde klingt dieselbe Bitte respektvoller.",
        rows: [
          ["direkt", "Hör mir zu!"],
          ["höflich mit könnte", "Könntest du mir bitte kurz zuhören?"],
          ["höflich mit würde", "Würdest du mir erklären, was dich gestört hat?"],
          ["indirekte Bitte", "Es wäre hilfreich, wenn du deine Meinung ruhig erklären würdest."],
        ],
        note: "Bitte, vielleicht und kurz können eine Bitte zusätzlich freundlicher machen, ersetzen aber nicht die richtige Satzstruktur.",
      },
      {
        title: "2. Eigene Formen oder würde + Infinitiv?",
        text: "Bei sein, haben und Modalverben benutzt man häufig die eigene Konjunktiv-II-Form. Bei vielen anderen Verben ist würde + Infinitiv natürlich und klar.",
        rows: [
          ["sein", "wäre"],
          ["haben", "hätte"],
          ["können / sollen / müssen", "könnte / sollte / müsste"],
          ["andere Verben", "würde zuhören · würde erklären · würde reagieren"],
        ],
        mistakes: [["Ich würde können dir helfen.", "Ich könnte dir helfen."]],
      },
      {
        title: "3. Hypothetische wenn-Sätze",
        text: "Der wenn-Satz beschreibt eine nicht sichere oder nur vorgestellte Situation. Das konjugierte Verb steht am Ende. Der Hauptsatz nennt die mögliche Folge.",
        rows: [
          ["Bedingung", "Wenn beide Seiten ruhiger wären, …"],
          ["mögliche Folge", "… könnten sie schneller eine Lösung finden."],
          ["würde-Form", "Wenn wir früher darüber sprechen würden, gäbe es weniger Missverständnisse."],
          ["Satzreihenfolge", "Es gäbe weniger Missverständnisse, wenn wir offener sprechen würden."],
        ],
        mistakes: [["Wenn wir würden offener sprechen, …", "Wenn wir offener sprechen würden, …"]],
      },
      {
        title: "4. Ratschlag, Grund und Vorteil verbinden",
        text: "Eine starke B2-Antwort besteht nicht nur aus einem Ratschlag. Sie erklärt auch, warum er sinnvoll ist und welchen Vorteil er hätte.",
        examples: [
          "Man sollte das Problem persönlich ansprechen, weil Nachrichten leicht falsch verstanden werden können.",
          "Ich würde zuerst Verständnis zeigen. Dadurch würde sich die andere Person weniger angegriffen fühlen.",
          "Eine andere Möglichkeit wäre, eine neutrale Person um Hilfe zu bitten.",
          "Der Vorteil dieser Lösung besteht darin, dass beide Seiten in Ruhe gehört werden.",
        ],
      },
    ],
    model: "Gute Kommunikation bedeutet für mich, dass beide Seiten respektvoll und ehrlich sprechen. Wenn ein Missverständnis entstehen würde, würde ich das Problem nicht sofort per Nachricht klären. Ich würde lieber ein persönliches Gespräch suchen. Dabei könnte ich sagen: Könntest du mir bitte erklären, wie du die Situation erlebt hast? Es wäre außerdem hilfreich, wenn beide Seiten einander ausreden lassen würden. Dadurch könnten Vorwürfe vermieden werden. Man sollte Kritik konkret formulieren, weil allgemeine Aussagen schnell verletzend wirken. Der Vorteil einer ruhigen Kommunikation besteht darin, dass Vertrauen erhalten bleibt.",
    common: ["Befehl statt höflicher Bitte verwenden", "würde mit einem Modalverb unnötig kombinieren", "würde im wenn-Satz an die falsche Stelle setzen", "nur einen Vorschlag nennen, aber keinen Grund", "hypothetische und reale Situation nicht unterscheiden"],
    practice: ["Formuliere drei Befehle als höfliche Bitten.", "Bilde Sätze mit wäre, hätte, könnte und sollte.", "Schreibe zwei wenn-Sätze mit einer möglichen Folge.", "Ergänze zu einem Ratschlag einen Grund und einen Vorteil.", "Verfasse 80–100 Wörter über die Lösung eines Missverständnisses."],
    checks: [
      ["Hör mir jetzt zu! – höflich", "Könntest du mir bitte kurz zuhören?"],
      ["Wenn beide ruhiger ___, ___ sie eine Lösung finden.", "wären, könnten"],
      ["Welche Form ist richtig: Ich würde helfen können / Ich könnte helfen?", "Ich könnte helfen. Modalverben haben meist eine eigene Konjunktiv-II-Form."],
    ],
  },
  3: {
    title: "Kontrast und Konzession",
    subtitle: "Öffentliches und privates Leben vergleichen, Einschränkungen nennen und Positionen abwägen",
    why: "Ein B2-Text sollte nicht nur eine Seite darstellen. Kontraststrukturen zeigen Unterschiede; konzessive Strukturen zeigen, dass eine Aussage trotz eines Gegenarguments gilt.",
    goals: [
      "Kontrast und Konzession nach Bedeutung unterscheiden",
      "während, wohingegen, obwohl und auch wenn korrekt verwenden",
      "trotz mit einer Nominalgruppe bilden",
      "zwar … aber und einerseits … andererseits zur Abwägung einsetzen",
    ],
    sections: [
      {
        title: "1. Unterschiede mit während und wohingegen",
        text: "Beide Konnektoren stellen zwei Situationen gegenüber. Sie leiten Nebensätze ein, deshalb steht das konjugierte Verb am Ende.",
        rows: [
          ["während", "Während manche Menschen viele private Fotos teilen, veröffentlichen andere nur berufliche Informationen."],
          ["wohingegen", "Soziale Medien bieten große Reichweite, wohingegen persönliche Gespräche oft mehr Vertrauen schaffen."],
          ["Position zuerst", "Während private Daten geschützt bleiben sollten, können berufliche Informationen öffentlich sein."],
          ["Position danach", "Berufliche Informationen können öffentlich sein, während private Daten geschützt bleiben sollten."],
        ],
        mistakes: [["Während manche Menschen teilen alles, …", "Während manche Menschen alles teilen, …"]],
      },
      {
        title: "2. Gegenargumente mit obwohl und auch wenn",
        text: "Obwohl und auch wenn zeigen, dass etwas trotz eines Hindernisses oder Gegenarguments gilt. Das Verb steht am Ende.",
        rows: [
          ["obwohl", "Obwohl ein öffentliches Profil berufliche Chancen bietet, sollte man sensible Daten schützen."],
          ["auch wenn", "Auch wenn eine Person bekannt ist, hat sie ein Recht auf Privatsphäre."],
          ["Hauptsatz zuerst", "Private Daten können missbraucht werden, obwohl ein Beitrag harmlos wirkt."],
          ["mit Modalverb", "Auch wenn Offenheit Nähe schaffen kann, muss jeder selbst Grenzen setzen dürfen."],
        ],
        note: "Auch wenn klingt häufig etwas alltagssprachlicher; obwohl ist in schriftlichen Argumentationen sehr üblich.",
      },
      {
        title: "3. Trotz + Nomen",
        text: "Trotz verbindet keinen vollständigen Nebensatz, sondern eine Nominalgruppe. Im formellen Standard steht häufig der Genitiv.",
        rows: [
          ["Genitiv Singular", "trotz der großen Reichweite"],
          ["Genitiv Plural", "trotz der möglichen Risiken"],
          ["Satz", "Trotz der Vorteile sollte man persönliche Informationen sorgfältig auswählen."],
          ["Umformung", "Obwohl es Risiken gibt → trotz der Risiken"],
        ],
        mistakes: [["Trotz die Risiken teilen viele Menschen Fotos.", "Trotz der Risiken teilen viele Menschen Fotos."]],
      },
      {
        title: "4. Zwei Seiten ausgewogen darstellen",
        text: "Zwar … aber verbindet einen anerkannten Punkt mit einer Einschränkung. Einerseits … andererseits stellt zwei ähnlich wichtige Perspektiven gegenüber.",
        examples: [
          "Zwar kann öffentliche Sichtbarkeit berufliche Chancen bieten, aber sie kann auch sozialen Druck erzeugen.",
          "Einerseits wirkt Offenheit authentisch, andererseits können veröffentlichte Inhalte später kaum kontrolliert werden.",
          "Zwar interessieren sich viele Menschen für Prominente, aber auch bekannte Personen haben persönliche Grenzen.",
        ],
        mistakes: [["Einerseits ist Offenheit wichtig, aber Privatsphäre auch.", "Einerseits ist Offenheit wichtig, andererseits muss die Privatsphäre geschützt werden."]],
      },
    ],
    model: "Die Grenze zwischen öffentlichem und privatem Leben ist heute weniger eindeutig. Während berufliche Qualifikationen öffentlich sichtbar sein können, sollten Gesundheitsdaten und familiäre Probleme privat bleiben. Zwar schafft eine offene Selbstdarstellung Nähe, aber veröffentlichte Inhalte lassen sich später oft nur schwer kontrollieren. Obwohl ein einzelnes Foto harmlos wirken kann, kann es langfristige Folgen haben. Trotz der Vorteile sozialer Medien sollte deshalb jeder bewusst entscheiden, welche Informationen er teilt. Einerseits gehört öffentliche Kommunikation zum modernen Alltag, andererseits muss das Recht auf persönliche Grenzen respektiert werden.",
    common: ["Kontrast und Ursache verwechseln", "Verb im Nebensatz nicht ans Ende stellen", "trotz mit einem vollständigen Satz verwenden", "zwar ohne aber beginnen", "einerseits mit aber statt andererseits verbinden"],
    practice: ["Vergleiche zwei Arten der Mediennutzung mit während.", "Schreibe einen Satz mit obwohl und einen mit auch wenn.", "Forme einen obwohl-Satz mit trotz um.", "Stelle zwei Seiten mit zwar … aber und einerseits … andererseits dar.", "Verfasse 90–110 Wörter über Privatsphäre in sozialen Medien."],
    checks: [
      ["___ soziale Medien Vorteile haben, können Daten missbraucht werden.", "Obwohl"],
      ["Obwohl es Risiken gibt → Nominalform", "Trotz der Risiken"],
      ["Zwar kann Sichtbarkeit helfen, ___ sie kann auch Druck erzeugen.", "aber"],
    ],
  },
  4: {
    title: "Finalsätze mit um … zu und damit",
    subtitle: "Lernziele, Maßnahmen und gewünschte Ergebnisse klar begründen",
    why: "Finalsätze beantworten die Frage Wozu? Sie helfen dir, nicht nur eine Lernmethode zu nennen, sondern auch zu erklären, welches Ziel du damit erreichen möchtest.",
    goals: [
      "um … zu bei gleichem Subjekt verwenden",
      "damit bei unterschiedlichen Subjekten verwenden",
      "die richtige Wortstellung bilden",
      "trennbare und reflexive Infinitive korrekt schreiben",
    ],
    sections: [
      {
        title: "1. Gleiche Person: um … zu",
        text: "Wenn dieselbe Person beide Handlungen ausführt, ist um … zu normalerweise die passende Struktur.",
        rows: [
          ["gleiche Person", "Ich lerne täglich. Ich möchte die Prüfung bestehen."],
          ["Finalsatz", "Ich lerne täglich, um die Prüfung zu bestehen."],
          ["weiteres Beispiel", "Ich höre Podcasts, um mein Hörverstehen zu verbessern."],
          ["Modalverb", "Ich wiederhole regelmäßig, um sicherer sprechen zu können."],
        ],
        note: "Im um-zu-Satz wird das Subjekt normalerweise nicht wiederholt.",
      },
      {
        title: "2. Unterschiedliche Personen: damit",
        text: "Wenn im Hauptsatz und im Zielsatz unterschiedliche Personen handeln, verwendest du damit. Das konjugierte Verb steht am Ende.",
        rows: [
          ["Lehrerin → Lernende", "Die Lehrerin erklärt die Regel, damit die Lernenden sie verstehen."],
          ["Schule → Lernende", "Die Schule stellt Videos bereit, damit die Lernenden zu Hause üben können."],
          ["Eltern → Kind", "Die Eltern schaffen einen ruhigen Platz, damit ihr Kind konzentriert lernen kann."],
          ["Hauptsatz danach", "Damit alle teilnehmen können, bietet die Schule Online-Unterricht an."],
        ],
        mistakes: [["Die Lehrerin erklärt langsam, damit alle verstehen die Regel.", "Die Lehrerin erklärt langsam, damit alle die Regel verstehen."]],
      },
      {
        title: "3. Infinitiv mit zu richtig bilden",
        text: "Bei einfachen Verben steht zu vor dem Infinitiv. Bei trennbaren Verben steht zu zwischen Vorsilbe und Verbstamm.",
        rows: [
          ["lernen", "zu lernen"],
          ["verbessern", "zu verbessern"],
          ["vorbereiten", "vorzubereiten"],
          ["teilnehmen", "teilzunehmen"],
          ["sich konzentrieren", "sich besser zu konzentrieren"],
        ],
        mistakes: [["um sich auf die Prüfung zu vorbereiten", "um sich auf die Prüfung vorzubereiten"]],
      },
      {
        title: "4. Eine Lernstrategie vollständig erklären",
        text: "Eine gute B2-Antwort nennt die Methode, das Ziel und möglichst auch einen Vorteil oder eine Bedingung.",
        examples: [
          "Ich nutze Karteikarten, um neue Wörter regelmäßig zu wiederholen. Dadurch kann ich sie länger behalten.",
          "Die Lehrkraft gibt individuelles Feedback, damit Lernende ihre Fehler gezielt verbessern können.",
          "Online-Phasen sollten mit Präsenztreffen verbunden werden, damit Flexibilität und persönliche Unterstützung zusammenkommen.",
          "Ich plane feste Pausen ein, um mich über einen längeren Zeitraum konzentrieren zu können.",
        ],
      },
    ],
    model: "Meiner Meinung nach ist eine Kombination aus Online-Lernen und Präsenzunterricht besonders wirksam. Ich nutze digitale Übungen, um neue Wörter flexibel zu wiederholen. Zusätzlich nehme ich an Präsenzstunden teil, um direkte Fragen stellen zu können. Die Lehrkraft gibt konkrete Rückmeldungen, damit ich meine Fehler gezielt verbessere. Online-Materialien sollten übersichtlich aufgebaut sein, damit Lernende selbstständig arbeiten können. Regelmäßige Lerngruppen sind ebenfalls hilfreich, um sich gegenseitig zu motivieren. Durch diese Kombination bleiben Lernende flexibel und erhalten trotzdem persönliche Unterstützung.",
    common: ["um … zu trotz unterschiedlicher Subjekte verwenden", "Subjekt im um-zu-Satz unnötig wiederholen", "Verb im damit-Satz auf Position zwei setzen", "zu bei trennbaren Verben falsch platzieren", "Ziel und Ursache miteinander verwechseln"],
    practice: ["Verbinde drei Satzpaare mit um … zu.", "Verbinde drei Satzpaare mit damit.", "Bilde die Infinitive mit zu von vorbereiten, teilnehmen und sich konzentrieren.", "Erkläre eine Lernstrategie mit Methode, Ziel und Vorteil.", "Verfasse 80–100 Wörter über die Verbindung von Online- und Präsenzlernen."],
    checks: [
      ["Ich lerne täglich, ___ die Prüfung zu bestehen.", "um"],
      ["Die Lehrerin erklärt die Aufgabe, ___ alle sie verstehen.", "damit"],
      ["Infinitiv mit zu: sich vorbereiten", "sich vorzubereiten"],
    ],
  },
};

export default function B2Day2To4GrammarNotes({ day, checked = false, onCheckedChange }) {
  const lesson = lessons[Number(day)];
  if (!lesson) return null;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B2 · Day {day} · Grammar Notes</span>
        <h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>{lesson.title}</h2>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>{lesson.subtitle}</p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Warum brauchst du diese Grammatik auf B2?</h2>
        <p style={{ margin: 0, lineHeight: 1.75 }}>{lesson.why}</p>
        <NoteBox>
          <strong>Nach dieser Lektion kannst du:</strong>
          <ul style={{ ...listStyle, marginTop: 8 }}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
        </NoteBox>
      </section>

      {lesson.sections.map((section) => (
        <section key={section.title} style={card}>
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{section.title}</h2>
          <p style={{ margin: 0, lineHeight: 1.75 }}>{section.text}</p>
          {section.rows ? (
            <Table>
              <thead><tr><th style={cellStyle}>Struktur / Bedeutung</th><th style={cellStyle}>Form / Beispiel</th></tr></thead>
              <tbody>{section.rows.map(([left, right]) => <tr key={`${left}-${right}`}><td style={cellStyle}><strong>{left}</strong></td><td style={cellStyle}>{right}</td></tr>)}</tbody>
            </Table>
          ) : null}
          {section.examples ? <ExampleBox>{section.examples.map((example) => <div key={example}>• {example}</div>)}</ExampleBox> : null}
          {section.note ? <NoteBox tone="amber"><strong>Merke:</strong> {section.note}</NoteBox> : null}
          {(section.mistakes || []).map(([wrong, correct]) => <Mistake key={wrong} wrong={wrong} correct={correct} />)}
        </section>
      ))}

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>B2-Modellabsatz</h2>
        <NoteBox tone="green">{lesson.model}</NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Typische Fehler</h2>
        <ul style={listStyle}>{lesson.common.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Schrittweise Mini-Übung</h2>
        <ol style={listStyle}>{lesson.practice.map((item) => <li key={item}>{item}</li>)}</ol>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Selbstkontrolle</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Löse die Aufgabe zuerst selbst und öffne danach die Antwort.</p>
        {lesson.checks.map(([question, answer], index) => (
          <CheckAnswer key={question} question={`${index + 1}. ${question}`}><strong>Lösung:</strong> {answer}</CheckAnswer>
        ))}
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
