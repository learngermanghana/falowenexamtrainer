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
  14: {
    title: "Relativsätze für Beziehungen und Freundschaft",
    subtitle: "Menschen, Eigenschaften und soziale Erwartungen genauer beschreiben",
    why: "Bei Freundschaft und sozialen Beziehungen reicht es auf B2 nicht, nur Personen zu nennen. Du musst erklären, welche Eigenschaften wichtig sind, wem du vertraust und welche Beziehungen schwierig oder stabil sind. Relativsätze helfen dir, diese Informationen präzise in einen Satz einzubauen.",
    goals: [
      "Relativsätze mit der, die, das und die bilden",
      "Relativpronomen im Akkusativ und Dativ verwenden",
      "Beziehungen mit Präpositionen + Relativpronomen beschreiben",
      "Eigenschaften und Erwartungen in längeren B2-Sätzen erklären",
    ],
    sections: [
      {
        title: "1. Relativsatz nach einem Nomen",
        text: "Ein Relativsatz beschreibt ein Nomen genauer. Das konjugierte Verb steht im Relativsatz am Ende.",
        rows: [
          ["Person", "Ein guter Freund ist jemand, der ehrlich ist."],
          ["Sache / Verhalten", "Vertrauen ist etwas, das langsam wächst."],
          ["Plural", "Freundschaften, die lange halten, brauchen Geduld."],
          ["Verb am Ende", "Ich mag Menschen, die auch in schwierigen Situationen ruhig bleiben."],
        ],
        mistakes: [["Ich mag Menschen, die bleiben ruhig.", "Ich mag Menschen, die ruhig bleiben."]],
      },
      {
        title: "2. Akkusativ und Dativ im Relativsatz",
        text: "Das Relativpronomen richtet sich nach seiner Funktion im Relativsatz. Frage: Ist die Person Subjekt, Objekt oder Dativ-Ergänzung?",
        rows: [
          ["Nominativ", "Ein Freund, der zuhört, ist wertvoll."],
          ["Akkusativ", "Ein Freund, den ich respektiere, muss ehrlich sein."],
          ["Dativ", "Eine Person, der ich vertraue, sollte zuverlässig sein."],
          ["Plural Dativ", "Menschen, denen man vertrauen kann, findet man nicht immer leicht."],
        ],
        note: "Dativformen sind: dem, der, dem, denen.",
      },
      {
        title: "3. Präposition + Relativpronomen",
        text: "Wenn ein Verb oder Ausdruck eine Präposition braucht, steht diese Präposition vor dem Relativpronomen.",
        rows: [
          ["sich verlassen auf", "Das ist eine Freundin, auf die ich mich verlassen kann."],
          ["sprechen mit", "Ich brauche Menschen, mit denen ich offen sprechen kann."],
          ["denken an", "Das sind Werte, an die ich in einer Beziehung glaube."],
          ["achten auf", "Ein guter Freund achtet auf Dinge, die mir wichtig sind."],
        ],
        mistakes: [["eine Freundin, die ich mich verlassen kann", "eine Freundin, auf die ich mich verlassen kann"]],
      },
      {
        title: "4. Meinung mit Relativsatz erweitern",
        text: "Nutze Relativsätze, um deine Meinung konkreter und reifer klingen zu lassen.",
        examples: [
          "Für mich ist ein echter Freund jemand, dem ich auch schlechte Nachrichten ehrlich sagen kann.",
          "Soziale Medien schaffen oft Kontakte, die schnell entstehen, aber nicht immer tief sind.",
          "In einer guten Beziehung brauche ich eine Person, mit der ich Konflikte ruhig lösen kann.",
        ],
      },
    ],
    model: "Freundschaft bedeutet für mich, dass man Menschen hat, auf die man sich verlassen kann. Ein echter Freund ist jemand, der ehrlich spricht, aber trotzdem respektvoll bleibt. Besonders wichtig ist mir eine Person, der ich vertrauen kann und mit der ich auch über Probleme rede. In sozialen Medien entstehen viele Kontakte, die interessant sein können, aber nicht immer tief sind. Deshalb finde ich persönliche Gespräche wichtig. Beziehungen, die lange halten, brauchen Geduld, Offenheit und klare Grenzen.",
    common: ["Verb im Relativsatz nicht ans Ende stellen", "Nominativ und Akkusativ verwechseln", "Dativformen wie dem/der/denen vermeiden", "Präposition vor dem Relativpronomen vergessen", "zu viele kurze Sätze statt eines präzisen B2-Satzes schreiben"],
    practice: ["Beschreibe drei Eigenschaften mit Relativsätzen.", "Bilde je einen Satz mit der, den, der und denen.", "Schreibe zwei Sätze mit mit denen und auf die.", "Erkläre, was dir in einer Freundschaft wichtig ist.", "Verfasse 90–110 Wörter über echte Freundschaft."],
    checks: [
      ["Ein Freund, ___ ich vertraue, ist sehr wichtig.", "dem"],
      ["Das ist eine Person, ___ ich respektiere.", "die"],
      ["Ich brauche Freunde, ___ ich offen sprechen kann.", "mit denen"],
    ],
  },
  15: {
    title: "Konzessive und alternative Strukturen beim Konsum",
    subtitle: "Ernährung, Konsumverhalten und Entscheidungen differenziert erklären",
    why: "Beim Thema Ernährung und Konsum musst du auf B2 zeigen, dass Entscheidungen nicht immer einfach sind. Du brauchst Strukturen, mit denen du Einschränkungen, Alternativen und bewusste Entscheidungen ausdrücken kannst.",
    goals: [
      "obwohl, auch wenn und trotzdem korrekt verwenden",
      "ohne dass und ohne … zu unterscheiden",
      "anstatt dass und anstatt … zu für Alternativen verwenden",
      "Konsumentscheidungen mit Grund, Einschränkung und Folge formulieren",
    ],
    sections: [
      {
        title: "1. Einschränkung mit obwohl und auch wenn",
        text: "Obwohl und auch wenn leiten Nebensätze ein. Das Verb steht am Ende. Danach kannst du zeigen, dass die Hauptaussage trotzdem gilt.",
        rows: [
          ["obwohl", "Obwohl Bio-Produkte teurer sind, kaufen viele Menschen sie bewusst."],
          ["auch wenn", "Auch wenn Fast Food praktisch ist, sollte man es nicht täglich essen."],
          ["Hauptsatz zuerst", "Viele Menschen achten auf Preise, obwohl sie gesünder essen möchten."],
          ["trotzdem", "Bio-Produkte sind teuer. Trotzdem entscheiden sich manche Menschen dafür."],
        ],
        mistakes: [["Obwohl Bio-Produkte sind teuer, kaufen viele sie.", "Obwohl Bio-Produkte teuer sind, kaufen viele sie."]],
      },
      {
        title: "2. Ohne dass und ohne … zu",
        text: "Wenn das Subjekt gleich ist, kannst du ohne … zu verwenden. Bei unterschiedlichen Subjekten brauchst du ohne dass.",
        rows: [
          ["gleiches Subjekt", "Viele kaufen Snacks, ohne über die Folgen nachzudenken."],
          ["unterschiedliches Subjekt", "Die Werbung beeinflusst Kinder, ohne dass sie es merken."],
          ["mit Modalverb", "Man kann bewusster einkaufen, ohne viel mehr Geld ausgeben zu müssen."],
          ["Achtung", "ohne dass + Verb am Ende"],
        ],
        note: "Ohne … zu hat kein eigenes Subjekt. Ohne dass hat ein eigenes Subjekt und ein konjugiertes Verb am Ende.",
      },
      {
        title: "3. Alternative mit anstatt … zu und anstatt dass",
        text: "Mit anstatt zeigst du, dass eine Person eine Alternative wählt oder wählen sollte.",
        rows: [
          ["gleiches Subjekt", "Anstatt jeden Tag Fleisch zu essen, kann man öfter Gemüse kochen."],
          ["unterschiedliches Subjekt", "Anstatt dass Supermärkte nur billige Produkte anbieten, könnten sie regionale Waren stärker fördern."],
          ["Alternative Handlung", "Man sollte eine Einkaufsliste schreiben, anstatt spontan alles zu kaufen."],
          ["formeller", "Statt ständig neue Produkte zu kaufen, kann man bewusster konsumieren."],
        ],
        mistakes: [["Anstatt dass jeden Tag Fleisch essen", "Anstatt jeden Tag Fleisch zu essen"]],
      },
      {
        title: "4. B2-Argument vollständig machen",
        text: "Ein gutes Argument nennt nicht nur eine Meinung, sondern auch Einschränkung, Alternative und Folge.",
        examples: [
          "Obwohl gesunde Lebensmittel manchmal teurer sind, lohnt sich bewusste Ernährung langfristig.",
          "Anstatt nur auf den Preis zu achten, sollten Verbraucher auch Qualität und Herkunft prüfen.",
          "Viele kaufen stark verarbeitete Produkte, ohne zu merken, wie viel Zucker sie enthalten.",
        ],
      },
    ],
    model: "Meiner Meinung nach sollte man beim Einkaufen nicht nur auf den Preis achten. Obwohl gesunde Lebensmittel manchmal teurer sind, können sie langfristig Vorteile für die Gesundheit haben. Viele Menschen kaufen Fertigprodukte, ohne genau zu prüfen, wie viel Zucker oder Fett sie enthalten. Anstatt jeden Tag Fast Food zu essen, könnte man einfache Gerichte zu Hause vorbereiten. Auch wenn nicht jeder viel Geld hat, kann man bewusster planen und weniger verschwenden. Dadurch wird Konsum nicht perfekt, aber verantwortungsvoller.",
    common: ["obwohl mit Hauptsatz-Wortstellung verwenden", "ohne dass und ohne zu verwechseln", "bei anstatt zu das zu vergessen", "trotzdem ohne Punkt oder Komma falsch anschließen", "nur Vorteile nennen, aber keine Einschränkung"],
    practice: ["Schreibe drei Sätze mit obwohl oder auch wenn.", "Bilde zwei Sätze mit ohne … zu und einen mit ohne dass.", "Formuliere zwei Alternativen mit anstatt … zu.", "Erkläre eine Konsumentscheidung mit Grund und Folge.", "Verfasse 90–110 Wörter über bewusstes Einkaufen."],
    checks: [
      ["___ Fast Food praktisch ist, sollte man es nicht täglich essen.", "Obwohl / Auch wenn"],
      ["Viele kaufen Snacks, ohne ___ die Zutaten zu prüfen.", "die Zutaten zu prüfen"],
      ["Alternative: jeden Tag Fleisch essen → öfter Gemüse kochen", "Anstatt jeden Tag Fleisch zu essen, kann man öfter Gemüse kochen."],
    ],
  },
  16: {
    title: "Passiv und Nominalisierung in der digitalen Welt",
    subtitle: "Digitale Prozesse, Datenschutz und Technikfolgen sachlich beschreiben",
    why: "Beim Thema Digitalisierung musst du häufig Prozesse erklären, ohne immer die handelnde Person zu nennen: Daten werden gespeichert, Apps werden genutzt, Regeln werden eingeführt. Das Passiv und einfache Nominalisierungen machen deine Sprache sachlicher und B2-näher.",
    goals: [
      "Vorgangspassiv mit werden + Partizip II bilden",
      "Zustandspassiv mit sein + Partizip II erkennen",
      "Akteure mit von oder durch ergänzen",
      "Verben in einfache Nominalisierungen umformen",
    ],
    sections: [
      {
        title: "1. Vorgangspassiv: werden + Partizip II",
        text: "Das Vorgangspassiv beschreibt einen Prozess oder eine Handlung. Wer handelt, ist oft weniger wichtig.",
        rows: [
          ["Aktiv", "Viele Menschen nutzen digitale Dienste."],
          ["Passiv", "Digitale Dienste werden von vielen Menschen genutzt."],
          ["Datenschutz", "Persönliche Daten werden gespeichert und verarbeitet."],
          ["Regeln", "Neue Sicherheitsregeln werden eingeführt."],
        ],
        mistakes: [["Daten sind gespeichert von Apps.", "Daten werden von Apps gespeichert."]],
      },
      {
        title: "2. Zustandspassiv: sein + Partizip II",
        text: "Das Zustandspassiv beschreibt das Ergebnis einer Handlung, nicht den Prozess.",
        rows: [
          ["Prozess", "Die Datei wird gespeichert."],
          ["Zustand", "Die Datei ist gespeichert."],
          ["Prozess", "Das Konto wird gesperrt."],
          ["Zustand", "Das Konto ist gesperrt."],
        ],
        note: "werden + Partizip II = Handlung/Prozess; sein + Partizip II = Ergebnis/Zustand.",
      },
      {
        title: "3. Von oder durch?",
        text: "Wenn du den Handelnden nennen willst, verwendest du oft von. Wenn du das Mittel oder die Ursache betonst, passt häufig durch.",
        rows: [
          ["Person / Institution", "Die Regeln werden von der Schule erklärt."],
          ["Firma", "Die Daten werden von der Plattform verarbeitet."],
          ["Mittel / Ursache", "Die Kommunikation wird durch Apps schneller."],
          ["Maßnahme", "Die Sicherheit wird durch klare Passwörter verbessert."],
        ],
      },
      {
        title: "4. Nominalisierung für sachliche Sprache",
        text: "Nominalisierungen machen Aussagen formeller. Sie sind besonders nützlich für Argumentationen über Technik und Gesellschaft.",
        rows: [
          ["Daten speichern", "die Speicherung von Daten"],
          ["Informationen nutzen", "die Nutzung von Informationen"],
          ["Regeln einführen", "die Einführung von Regeln"],
          ["Menschen überwachen", "die Überwachung von Menschen"],
        ],
        examples: [
          "Die Speicherung persönlicher Daten sollte transparent sein.",
          "Durch die Nutzung digitaler Werkzeuge kann Arbeit flexibler werden.",
          "Die Einführung klarer Regeln schützt Nutzerinnen und Nutzer.",
        ],
      },
    ],
    model: "Die Digitalisierung verändert den Alltag stark. Viele Informationen werden heute online gespeichert und durch Apps schneller geteilt. Dadurch wird Kommunikation einfacher, aber persönliche Daten müssen besser geschützt werden. Wenn ein Konto gesperrt ist, braucht man klare Hilfe und verständliche Regeln. Meiner Meinung nach sollte die Nutzung digitaler Dienste transparenter sein. Die Speicherung von Daten darf nicht ohne klare Erklärung passieren. Gleichzeitig können digitale Werkzeuge den Alltag erleichtern, wenn sie verantwortungsvoll eingesetzt werden.",
    common: ["sein und werden im Passiv verwechseln", "Partizip II vergessen", "von und durch ohne Bedeutung unterscheiden", "Nominalisierung ohne Artikel schreiben", "nur Technikvorteile nennen und Datenschutz ignorieren"],
    practice: ["Forme drei Aktivsätze ins Passiv um.", "Unterscheide Prozess und Zustand in vier Beispielen.", "Bilde Sätze mit von und durch.", "Forme fünf Verben in Nominalisierungen um.", "Verfasse 90–110 Wörter über Chancen und Risiken digitaler Dienste."],
    checks: [
      ["Passiv: Apps speichern Daten.", "Daten werden von Apps gespeichert."],
      ["Zustand: Die Datei ___ gespeichert.", "ist"],
      ["Nominalisierung: Daten speichern", "die Speicherung von Daten"],
    ],
  },
};

export default function B2Day14To16GrammarNotes({ day, checked = false, onCheckedChange }) {
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
