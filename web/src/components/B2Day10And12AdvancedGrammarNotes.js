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
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: ".94rem" };
const cellStyle = {
  border: "1px solid #e5e7eb",
  padding: "10px 12px",
  textAlign: "left",
  verticalAlign: "top",
  lineHeight: 1.65,
};

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
    red: ["#fecaca", "#fef2f2", "#991b1b"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 14, background, color, lineHeight: 1.72 }}>
      {children}
    </div>
  );
};

const Section = ({ title, children }) => (
  <section style={card}>
    <h2 style={{ margin: 0, fontSize: "1.22rem" }}>{title}</h2>
    {children}
  </section>
);

const FourColumnTable = ({ headers, rows }) => (
  <div style={{ width: "100%", overflowX: "auto" }}>
    <table style={tableStyle}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} style={{ ...cellStyle, background: "#f8fafc" }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join("-")}>
            {row.map((cell, index) => (
              <td key={`${cell}-${index}`} style={cellStyle}>{index === 0 ? <strong>{cell}</strong> : cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ErrorCard = ({ wrong, correct, reason }) => (
  <article style={{ border: "1px solid #fecaca", borderRadius: 14, padding: 13, background: "#fff", display: "grid", gap: 7 }}>
    <div style={{ color: "#991b1b" }}><strong>✗ Nicht so:</strong> {wrong}</div>
    <div style={{ color: "#166534" }}><strong>✓ Besser:</strong> {correct}</div>
    <div style={{ color: "#475569", lineHeight: 1.65 }}><strong>Warum?</strong> {reason}</div>
  </article>
);

const CheckAnswer = ({ number, question, answer, explanation }) => (
  <details style={{ border: "1px solid #dbeafe", borderRadius: 13, padding: 12, background: "#fff" }}>
    <summary style={{ cursor: "pointer", fontWeight: 800 }}>{number}. {question}</summary>
    <div style={{ marginTop: 10, lineHeight: 1.72 }}>
      <strong>Lösung:</strong> {answer}
      {explanation ? <div style={{ marginTop: 5, color: "#475569" }}>{explanation}</div> : null}
    </div>
  </details>
);

const lessons = {
  10: {
    chapter: "2.5",
    title: "Zweiteilige Konnektoren bei Konsum und Geld",
    subtitle: "Argumente parallel aufbauen, Gegensätze abwägen und Kaufentscheidungen differenziert begründen",
    introduction:
      "Auf B2 reicht es nicht, einzelne Vorteile und Nachteile aufzuzählen. Du musst zeigen, wie zwei Informationen logisch zusammengehören: Sie können sich ergänzen, widersprechen oder gemeinsam verneint werden. Zweiteilige Konnektoren machen diese Beziehung sichtbar und helfen dir, eine Stellungnahme klar zu strukturieren.",
    goals: [
      "gleichartige Satzteile und Aussagen parallel verbinden",
      "einerseits … andererseits für eine echte Abwägung verwenden",
      "sowohl … als auch und nicht nur … sondern auch korrekt positionieren",
      "weder … noch ohne zusätzliche Verneinung bilden",
      "zwar … aber als B2-Erweiterung für Einräumung und Einschränkung nutzen",
      "eine strukturierte B2-Antwort über Konsum, Budget und Werbung schreiben oder sprechen",
    ],
    structures: [
      ["einerseits … andererseits", "zwei Perspektiven abwägen", "meist zwei Hauptsätze oder Satzteile", "Einerseits spart Online-Shopping Zeit, andererseits fördert es spontane Käufe."],
      ["sowohl … als auch", "zwei positive oder neutrale Aspekte verbinden", "verbindet grammatisch gleichartige Elemente", "Beim Kauf sind sowohl der Preis als auch die Lebensdauer wichtig."],
      ["weder … noch", "zwei Elemente gemeinsam verneinen", "kein zusätzliches nicht verwenden", "Die Werbung informiert weder objektiv noch vollständig."],
      ["nicht nur … sondern auch", "einen zweiten Aspekt verstärkend ergänzen", "beide Teile müssen parallel gebaut sein", "Impulskäufe belasten nicht nur das Budget, sondern verursachen auch unnötigen Müll."],
      ["zwar … aber", "etwas einräumen und danach einschränken", "zwar steht beim ersten Aspekt; aber leitet den Gegensatz ein", "Das Angebot ist zwar günstig, aber ich brauche das Produkt nicht."],
    ],
    rules: [
      {
        title: "1. Verbinde gleichartige Elemente",
        text: "Nach beiden Teilen des Konnektors sollte dieselbe grammatische Form stehen: Nomen mit Nomen, Adjektiv mit Adjektiv, Infinitivgruppe mit Infinitivgruppe oder Hauptsatz mit Hauptsatz.",
        examples: [
          "Nomen: sowohl der Preis als auch die Qualität",
          "Adjektive: weder günstig noch nachhaltig",
          "Infinitivgruppen: nicht nur Preise vergleichen, sondern auch Bewertungen prüfen",
          "Hauptsätze: Einerseits möchte ich sparen, andererseits will ich fair konsumieren.",
        ],
      },
      {
        title: "2. Beachte die Verbposition",
        text: "Einerseits, andererseits und zwar können wie Adverbien im Vorfeld stehen. Dann folgt das konjugierte Verb direkt danach. Sowohl, als auch, weder, noch, nicht nur und sondern auch stehen dagegen meist unmittelbar vor den Elementen, die sie verbinden.",
        examples: [
          "Andererseits sollte man die Folgekosten berücksichtigen.",
          "Nicht nur der Kaufpreis, sondern auch die Reparaturkosten spielen eine Rolle.",
        ],
      },
      {
        title: "3. Formuliere eine echte Abwägung",
        text: "Die beiden Seiten dürfen nicht nur Wiederholungen sein. Nenne unterschiedliche Kriterien, zum Beispiel Preis versus Qualität, Bequemlichkeit versus Datenschutz oder persönlicher Wunsch versus langfristiges Budget.",
        examples: [
          "Einerseits machen personalisierte Angebote die Suche einfacher, andererseits werden dafür persönliche Daten ausgewertet.",
        ],
      },
    ],
    errors: [
      {
        wrong: "Sowohl der Preis und auch die Qualität sind wichtig.",
        correct: "Sowohl der Preis als auch die Qualität sind wichtig.",
        reason: "Die feste Verbindung lautet sowohl … als auch.",
      },
      {
        wrong: "Man sollte weder nicht impulsiv kaufen noch Schulden machen.",
        correct: "Man sollte weder impulsiv kaufen noch Schulden machen.",
        reason: "Weder … noch enthält bereits die Verneinung. Ein zusätzliches nicht ist falsch.",
      },
      {
        wrong: "Das Produkt ist nicht nur günstig, sondern auch es hält lange.",
        correct: "Das Produkt ist nicht nur günstig, sondern auch langlebig.",
        reason: "Beide verbundenen Elemente müssen parallel sein: hier Adjektiv + Adjektiv.",
      },
      {
        wrong: "Einerseits Werbung informiert, andererseits sie manipuliert.",
        correct: "Einerseits informiert Werbung, andererseits kann sie manipulieren.",
        reason: "Steht der Konnektor im Vorfeld, folgt das konjugierte Verb an Position zwei.",
      },
    ],
    examPlan: [
      "Position: Erkläre zuerst, welches Konsumproblem du bewerten möchtest.",
      "Erste Seite: Nutze einerseits oder zwar, um einen Vorteil anzuerkennen.",
      "Gegenseite: Nutze andererseits oder aber und erkläre eine konkrete Folge.",
      "Erweiterung: Ergänze zwei Kriterien mit sowohl … als auch oder nicht nur … sondern auch.",
      "Urteil: Formuliere eine Bedingung oder Empfehlung, statt nur gut oder schlecht zu sagen.",
    ],
    model:
      "Personalisierte Werbung kann Kaufentscheidungen deutlich beeinflussen. Einerseits erhalten Verbraucherinnen und Verbraucher Angebote, die zu ihren Interessen passen, andererseits werden dafür persönliche Daten gesammelt und ausgewertet. Beim bewussten Konsum sollten deshalb sowohl der unmittelbare Preis als auch die langfristigen Kosten berücksichtigt werden. Ein sehr günstiges Gerät kann beispielsweise schnell kaputtgehen und dadurch nicht nur zusätzliche Ausgaben verursachen, sondern auch die Umwelt belasten. Werbung zeigt jedoch häufig weder die Nachteile eines Produkts noch seine tatsächliche Lebensdauer. Das bedeutet nicht, dass man auf jede Werbung verzichten muss. Ein Angebot kann zwar nützlich sein, aber die Entscheidung sollte nicht unter Zeitdruck getroffen werden. Meiner Ansicht nach ist ein Kauf dann sinnvoll, wenn das Produkt wirklich gebraucht wird, das Budget nicht überschritten wird und die Qualität nachvollziehbar ist. Auf diese Weise kann man Geld sparen, ohne nur nach dem niedrigsten Preis zu entscheiden.",
    modelAnalysis: [
      "Der Absatz beginnt mit einer klaren, aber nicht extremen Aussage.",
      "Einerseits … andererseits eröffnet eine ausgewogene Diskussion.",
      "Sowohl … als auch verbindet zwei gleichwertige Prüfkriterien.",
      "Nicht nur … sondern auch erweitert die Folge von finanziellen zu ökologischen Auswirkungen.",
      "Zwar … aber führt zu einem differenzierten Schluss statt zu einem absoluten Verbot.",
    ],
    checks: [
      ["Verbinde: Der Preis ist wichtig. Die Qualität ist wichtig.", "Sowohl der Preis als auch die Qualität sind wichtig.", "Nomen werden parallel verbunden."],
      ["Korrigiere: Man sollte weder nicht unnötig kaufen noch sein Budget ignorieren.", "Man sollte weder unnötig kaufen noch sein Budget ignorieren.", "Weder … noch braucht kein zusätzliches nicht."],
      ["Ergänze: Das Produkt ist ___ günstig, ___ langlebig.", "Das Produkt ist nicht nur günstig, sondern auch langlebig.", "Zwei Adjektive werden parallel verbunden."],
      ["Formuliere eine Abwägung zu Online-Shopping.", "Einerseits ist Online-Shopping bequem, andererseits entstehen leichter spontane und unnötige Käufe.", "Die beiden Seiten beziehen sich auf unterschiedliche Kriterien."],
      ["Ergänze eine Einräumung: Das Angebot ist günstig. Ich brauche es nicht.", "Das Angebot ist zwar günstig, aber ich brauche es nicht.", "Zwar erkennt den Vorteil an; aber begrenzt seine Bedeutung."],
    ],
  },
  12: {
    chapter: "3.2",
    title: "Temporale Nebensätze bei Kultur und Freizeit",
    subtitle: "Gewohnheiten, einmalige Erlebnisse, gleichzeitige Handlungen und zeitliche Reihenfolgen präzise ausdrücken",
    introduction:
      "Temporale Konnektoren zeigen nicht nur, wann etwas passiert. Sie erklären auch, ob eine Handlung regelmäßig, einmalig, gleichzeitig, früher oder später stattfindet. Auf B2 solltest du deshalb den passenden Konnektor und das passende Zeitverhältnis wählen, statt alle Situationen nur mit wenn zu beschreiben.",
    goals: [
      "wenn und als nach Bedeutung und Zeitform sicher unterscheiden",
      "gleichzeitige Handlungen mit während verbinden",
      "eine Reihenfolge mit bevor, nachdem, sobald und bis darstellen",
      "seitdem für eine Entwicklung vom früheren Zeitpunkt bis heute verwenden",
      "Verbendstellung und Inversion im Hauptsatz korrekt bilden",
      "kulturelle Erfahrungen und Freizeitgewohnheiten zusammenhängend erzählen",
    ],
    structures: [
      ["wenn", "wiederholte Handlung; Gegenwart; Zukunft; Bedingung", "Wenn ich frei habe, besuche ich Ausstellungen."],
      ["als", "einmalige Situation in der Vergangenheit", "Als ich zum ersten Mal ein Stadtfest besuchte, kannte ich dort niemanden."],
      ["während", "zwei Handlungen laufen gleichzeitig", "Während meine Freunde das Konzert hörten, machte ich Fotos."],
      ["bevor / ehe", "Handlung im Nebensatz passiert später als die Handlung im Hauptsatz", "Ich informiere mich über die Preise, bevor ich die Tickets kaufe."],
      ["nachdem", "Handlung im Nebensatz passiert zuerst", "Nachdem wir die Ausstellung besucht hatten, diskutierten wir im Café darüber."],
      ["sobald", "die zweite Handlung beginnt unmittelbar danach", "Sobald der Vorverkauf beginnt, bestelle ich die Karten."],
      ["seitdem", "Beginn in der Vergangenheit; Wirkung bis heute", "Seitdem ich im Verein bin, habe ich viele Kontakte geknüpft."],
      ["bis", "Endpunkt einer Handlung oder eines Zustands", "Wir blieben auf dem Fest, bis die letzte Band gespielt hatte."],
    ],
    rules: [
      {
        title: "1. Wenn oder als?",
        text: "Verwende als nur für ein einmaliges Ereignis in der Vergangenheit. Verwende wenn für Wiederholungen, Gegenwart, Zukunft und Bedingungen.",
        examples: [
          "Als ich 2025 nach Berlin reiste, besuchte ich die Museumsinsel. (einmalig)",
          "Wenn ich nach Berlin reise, besuche ich meistens ein Museum. (wiederholt)",
          "Wenn ich morgen Zeit habe, gehe ich ins Kino. (Zukunft/Bedingung)",
        ],
      },
      {
        title: "2. Zeitverhältnis mit bevor und nachdem",
        text: "Bei bevor passiert die Handlung im Hauptsatz zuerst. Bei nachdem passiert die Handlung im Nebensatz zuerst. In einer vergangenen Erzählung wird die frühere Handlung häufig mit Plusquamperfekt markiert.",
        examples: [
          "Bevor das Konzert begann, suchten wir unsere Plätze.",
          "Nachdem wir unsere Plätze gefunden hatten, begann das Konzert.",
          "Nachdem ich die Tickets gekauft habe, trage ich den Termin in meinen Kalender ein.",
        ],
      },
      {
        title: "3. Nebensatz zuerst: Inversion beachten",
        text: "Steht der Nebensatz am Anfang, folgt im Hauptsatz sofort das konjugierte Verb. Der ganze Nebensatz besetzt Position eins.",
        examples: [
          "Wenn ich Zeit habe, besuche ich eine Veranstaltung.",
          "Nachdem der Film zu Ende war, diskutierten wir über seine Botschaft.",
        ],
      },
    ],
    errors: [
      {
        wrong: "Als ich jedes Wochenende frei habe, gehe ich ins Theater.",
        correct: "Wenn ich am Wochenende frei habe, gehe ich ins Theater.",
        reason: "Es handelt sich um eine wiederholte Gewohnheit, nicht um ein einmaliges Ereignis in der Vergangenheit.",
      },
      {
        wrong: "Nachdem ich kaufte die Tickets, rief ich meine Freundin an.",
        correct: "Nachdem ich die Tickets gekauft hatte, rief ich meine Freundin an.",
        reason: "Im Nebensatz steht das konjugierte Verb am Ende; die frühere vergangene Handlung kann im Plusquamperfekt stehen.",
      },
      {
        wrong: "Wenn der Kurs endet, ich treffe mich mit Freunden.",
        correct: "Wenn der Kurs endet, treffe ich mich mit Freunden.",
        reason: "Nach einem vorangestellten Nebensatz steht das Verb des Hauptsatzes direkt an erster Stelle des Hauptsatzes.",
      },
      {
        wrong: "Bevor ich das Museum verlassen hatte, kaufte ich die Eintrittskarte.",
        correct: "Bevor ich das Museum betrat, kaufte ich die Eintrittskarte.",
        reason: "Bevor muss eine logische Reihenfolge ausdrücken. Die Eintrittskarte wird normalerweise vor dem Betreten gekauft.",
      },
    ],
    examPlan: [
      "Einleitung: Nenne die Freizeitaktivität oder kulturelle Erfahrung.",
      "Gewohnheit: Beschreibe mit wenn, was du regelmäßig machst.",
      "Konkretes Erlebnis: Erzähle mit als von einem einmaligen Moment in der Vergangenheit.",
      "Reihenfolge: Verbinde Vorbereitung und Erlebnis mit bevor oder nachdem.",
      "Entwicklung: Zeige mit seitdem, wie sich deine Kontakte, Interessen oder Fähigkeiten verändert haben.",
      "Bewertung: Erkläre abschließend, warum die Aktivität persönlich oder gesellschaftlich wichtig ist.",
    ],
    model:
      "Freizeitangebote sind für mich besonders wichtig, weil sie Erholung und soziale Kontakte verbinden. Wenn ich am Wochenende Zeit habe, besuche ich gern Konzerte, Ausstellungen oder Stadtfeste. Als ich vor zwei Jahren zum ersten Mal an einem Kulturfestival teilnahm, kannte ich dort zunächst niemanden. Bevor das Programm begann, nahm ich jedoch an einem kleinen Workshop teil und kam mit anderen Besucherinnen und Besuchern ins Gespräch. Nachdem wir gemeinsam eine Ausstellung gesehen hatten, diskutierten wir lange über die gezeigten Werke. Seitdem interessiere ich mich stärker für lokale Kulturangebote und informiere mich regelmäßig über neue Veranstaltungen. Sobald ein interessantes Programm veröffentlicht wird, trage ich den Termin in meinen Kalender ein. Natürlich kann Kultur Geld und Zeit kosten. Trotzdem halte ich solche Angebote für wertvoll, weil Menschen dabei neue Perspektiven kennenlernen. Während digitale Unterhaltung oft allein konsumiert wird, schaffen Vereine und Veranstaltungen direkte Begegnungen. Deshalb sollten Städte kulturelle Angebote unterstützen, damit möglichst viele Menschen daran teilnehmen können.",
    modelAnalysis: [
      "Wenn beschreibt eine regelmäßige Freizeitgewohnheit.",
      "Als leitet ein einmaliges Erlebnis in der Vergangenheit ein.",
      "Bevor und nachdem ordnen Vorbereitung und Erlebnis logisch.",
      "Seitdem verbindet ein vergangenes Ereignis mit einer Entwicklung bis heute.",
      "Sobald zeigt, dass die nächste Handlung unmittelbar nach der Veröffentlichung beginnt.",
      "Während stellt am Ende zwei unterschiedliche Formen der Freizeitgestaltung gegenüber.",
    ],
    checks: [
      ["Wähle wenn oder als: ___ ich 2024 zum ersten Mal in Köln war, besuchte ich den Karneval.", "Als ich 2024 zum ersten Mal in Köln war, besuchte ich den Karneval.", "Ein einmaliges Ereignis in der Vergangenheit verlangt als."],
      ["Wähle wenn oder als: ___ ich frei habe, gehe ich meistens schwimmen.", "Wenn ich frei habe, gehe ich meistens schwimmen.", "Die Handlung wiederholt sich."],
      ["Verbinde: Wir kauften die Tickets. Danach gingen wir ins Theater.", "Nachdem wir die Tickets gekauft hatten, gingen wir ins Theater.", "Die frühere Handlung steht im Nebensatz; in der Vergangenheit ist Plusquamperfekt möglich."],
      ["Korrigiere: Wenn der Film endet, wir sprechen über das Ende.", "Wenn der Film endet, sprechen wir über das Ende.", "Der Nebensatz besetzt Position eins; danach folgt das Verb des Hauptsatzes."],
      ["Ergänze mit seitdem: Ich bin im Sportverein. Jetzt habe ich mehr Kontakte.", "Seitdem ich im Sportverein bin, habe ich mehr Kontakte.", "Seitdem verbindet den Beginn in der Vergangenheit mit einer bis heute gültigen Folge."],
    ],
  },
};

export const getAdvancedB2GrammarLesson = (day) => lessons[Number(day)] || null;

export default function B2Day10And12AdvancedGrammarNotes({ day, checked = false, onCheckedChange }) {
  const lesson = getAdvancedB2GrammarLesson(day);
  if (!lesson) return null;

  return (
    <div style={{ display: "grid", gap: 16 }} data-b2-advanced-grammar-day={day}>
      <section style={card}>
        <span style={{ ...styles.badge, width: "fit-content" }}>B2 · Day {day} · Chapter {lesson.chapter} · Advanced Grammar Notes</span>
        <h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.75rem,4vw,2.55rem)" }}>{lesson.title}</h2>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.72 }}>{lesson.subtitle}</p>
      </section>

      <Section title="Warum ist diese Grammatik auf B2 wichtig?">
        <p style={{ margin: 0, lineHeight: 1.78 }}>{lesson.introduction}</p>
        <NoteBox>
          <strong>Nach dieser Lektion kannst du:</strong>
          <ul style={{ ...listStyle, marginTop: 8 }}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
        </NoteBox>
      </Section>

      <Section title="Kernstrukturen und Bedeutung">
        <FourColumnTable
          headers={Number(day) === 10 ? ["Konnektor", "Funktion", "Satzbau", "Beispiel"] : ["Konnektor", "Zeitverhältnis", "Beispiel"]}
          rows={lesson.structures}
        />
      </Section>

      <Section title="Satzbau Schritt für Schritt">
        <div style={{ display: "grid", gap: 12 }}>
          {lesson.rules.map((rule) => (
            <article key={rule.title} style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 14, background: "#f8fbff", display: "grid", gap: 8 }}>
              <strong>{rule.title}</strong>
              <p style={{ margin: 0, color: "#334155", lineHeight: 1.72 }}>{rule.text}</p>
              <ul style={listStyle}>{rule.examples.map((example) => <li key={example}>{example}</li>)}</ul>
            </article>
          ))}
        </div>
      </Section>

      <Section title="Typische Fehler und Korrekturen">
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          {lesson.errors.map((error) => <ErrorCard key={error.wrong} {...error} />)}
        </div>
      </Section>

      <Section title="Transfer zu Goethe B2 Sprechen und Schreiben">
        <NoteBox tone="amber">
          <strong>Baue deine Antwort in sechs Schritten auf:</strong>
          <ol style={{ ...listStyle, marginTop: 8 }}>{lesson.examPlan.map((step) => <li key={step}>{step}</li>)}</ol>
        </NoteBox>
      </Section>

      <Section title="Ausführlicher B2-Modelltext">
        <NoteBox tone="green">{lesson.model}</NoteBox>
        <div style={{ border: "1px solid #bbf7d0", borderRadius: 14, padding: 13, background: "#fff", display: "grid", gap: 7 }}>
          <strong>Warum ist der Text auf B2-Niveau?</strong>
          <ul style={listStyle}>{lesson.modelAnalysis.map((point) => <li key={point}>{point}</li>)}</ul>
        </div>
      </Section>

      <Section title="Kontrollierte Übung">
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>Formuliere die Antwort zuerst selbst. Öffne danach die Lösung und vergleiche Satzbau und Bedeutung.</p>
        {lesson.checks.map(([question, answer, explanation], index) => (
          <CheckAnswer key={question} number={index + 1} question={question} answer={answer} explanation={explanation} />
        ))}
      </Section>

      <Section title="Lernkontrolle">
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.65 }}>
          <input
            type="checkbox"
            checked={Boolean(checked)}
            onChange={(event) => onCheckedChange?.(event.target.checked)}
            style={{ marginTop: 4 }}
          />
          <span>Ich habe die erweiterten Grammatiknotizen gelesen, die Fehlerkorrekturen verstanden und mindestens drei Übungssätze selbst formuliert.</span>
        </label>
      </Section>
    </div>
  );
}
