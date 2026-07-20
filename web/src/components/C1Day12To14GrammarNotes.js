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

const Table = ({ rows, headers = ["Struktur", "C1-Beispiel"] }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={tableStyle}>
      <thead><tr>{headers.map((header) => <th key={header} style={cellStyle}>{header}</th>)}</tr></thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.join("-")}>
            {row.map((value, index) => <td key={`${value}-${index}`} style={cellStyle}>{index === 0 ? <strong>{value}</strong> : value}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CheckAnswer = ({ question, answer }) => (
  <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
    <summary style={{ cursor: "pointer", fontWeight: 800 }}>{question}</summary>
    <div style={{ marginTop: 10, lineHeight: 1.7 }}><strong>Lösung:</strong> {answer}</div>
  </details>
);

const Mistake = ({ wrong, correct, reason }) => (
  <div style={{ display: "grid", gap: 5, border: "1px solid #fecaca", background: "#fff7f7", borderRadius: 12, padding: 12, lineHeight: 1.65 }}>
    <span><strong>✗ Nicht passend:</strong> {wrong}</span>
    <span><strong>✓ C1-gerecht:</strong> {correct}</span>
    {reason ? <span style={{ color: "#7f1d1d" }}><strong>Warum?</strong> {reason}</span> : null}
  </div>
);

const lessons = {
  12: {
    title: "Erweiterte Vergleichs- und Bewertungsstrukturen bei Freizeit und Kultur",
    subtitle: "kulturelle Angebote, Teilhabe und Lebensqualität differenziert beurteilen",
    why: "Freizeit und Kultur sind auf C1 nicht nur persönliche Vorlieben. Du bewertest Zugang, gesellschaftliche Bedeutung, soziale Teilhabe und kulturelle Vielfalt. Dafür brauchst du präzise Vergleichs- und Bewertungsstrukturen.",
    goals: ["kulturelle Angebote differenziert vergleichen", "Bewertungen mit insofern, einerseits … andererseits und im Hinblick auf formulieren", "soziale Teilhabe und Lebensqualität erklären", "eine ausgewogene Stellungnahme schreiben"],
    rows: [["im Hinblick auf + Akkusativ", "Im Hinblick auf gesellschaftliche Teilhabe sind günstige Kulturangebote besonders wichtig."], ["insofern", "Kultur ist insofern relevant, als sie Begegnung und Perspektivwechsel ermöglicht."], ["einerseits … andererseits", "Einerseits fördern Festivals Gemeinschaft, andererseits können sie Lärm und Kosten verursachen."], ["je … desto", "Je leichter kulturelle Angebote zugänglich sind, desto stärker profitieren unterschiedliche Gruppen."]],
    model: "Kulturelle Angebote tragen wesentlich zur Lebensqualität bei, insofern sie Begegnung, Bildung und gesellschaftliche Teilhabe ermöglichen. Im Hinblick auf soziale Gerechtigkeit sollten Museen, Theater und Konzerte nicht nur für wohlhabende Gruppen zugänglich sein. Einerseits benötigen kulturelle Einrichtungen ausreichende Finanzierung, andererseits müssen Eintrittspreise bezahlbar bleiben. Je vielfältiger und niedrigschwelliger das Angebot ist, desto eher wird Kultur zu einem verbindenden Element des öffentlichen Lebens.",
    checks: [["Kultur ist relevant, ___ sie Begegnung ermöglicht.", "insofern, als"], ["Im Hinblick ___ Teilhabe", "auf gesellschaftliche"], ["Je zugänglicher Kultur ist, ___ mehr Menschen profitieren.", "desto / umso"]],
  },
  13: {
    title: "Indirekte Rede und Distanzierung bei Mehrsprachigkeit",
    subtitle: "Studien, politische Positionen und Erfahrungen präzise wiedergeben und kritisch bewerten",
    why: "Beim Thema Mehrsprachigkeit begegnen dir Aussagen aus Studien, Bildungsinstitutionen, Politik, Medien und persönlichen Sprachbiografien. Auf C1 musst du deutlich zeigen, wer etwas behauptet, wie sicher die Aussage ist und wo deine eigene Bewertung beginnt. Dafür brauchst du Konjunktiv I, passende Ersatzformen, Quellenmarker und sprachliche Distanzierung.",
    goals: [
      "fremde Positionen mit Konjunktiv I neutral wiedergeben",
      "Konjunktiv II als Ersatzform gezielt verwenden",
      "Quellen, Unsicherheit und Reichweite einer Aussage sprachlich markieren",
      "Zeit- und Ortsangaben an die Berichtssituation anpassen",
      "eine fremde Position kritisch einordnen, ohne sie mit der eigenen Meinung zu vermischen",
      "einen C1-Absatz über Mehrsprachigkeit mit Quelle, Bewertung und Schlussfolgerung formulieren",
    ],
    overview: [
      "Direkte Rede gibt die Originalaussage wieder: Die Forscherin sagt: ‚Mehrsprachigkeit fördert flexible Denkprozesse.‘",
      "Indirekte Rede berichtet die Aussage aus einer neuen Perspektive: Die Forscherin erklärt, Mehrsprachigkeit fördere flexible Denkprozesse.",
      "Distanzierung zeigt, dass die Aussage nicht automatisch als gesicherte Tatsache übernommen wird: Der Studie zufolge lasse sich ein positiver Effekt erkennen; seine langfristige Stärke sei jedoch noch nicht eindeutig belegt.",
    ],
    rows: [
      ["Konjunktiv I", "Die Expertin betont, frühe Sprachförderung erleichtere den Bildungszugang."],
      ["Quellenmarker + Konjunktiv I", "Dem Ministerium zufolge sei Mehrsprachigkeit ein wichtiger Standortvorteil."],
      ["Ersatzform Konjunktiv II", "Kritiker erklärten, zusätzliche Programme wären ohne mehr Personal kaum umsetzbar."],
      ["Unpersönliche Wiedergabe", "In der Debatte wird darauf hingewiesen, dass mehrsprachige Angebote regional sehr unterschiedlich ausgebaut seien."],
      ["Quelle + eigene Bewertung", "Die Studie kommt zu dem Schluss, bilingualer Unterricht verbessere bestimmte Lernprozesse. Diese Aussage überzeugt nur teilweise, da die untersuchten Gruppen sehr klein waren."],
    ],
    konjunktivRows: [
      ["sein", "sei / seien", "Die Autorin erklärt, Sprache sei ein zentraler Teil der Identität."],
      ["haben", "habe / hätten als Ersatzform", "Die Schule berichtet, sie habe neue Sprachprogramme eingeführt."],
      ["werden", "werde / würden als Ersatzform", "Der Verband erwartet, Mehrsprachigkeit werde im Berufsleben wichtiger."],
      ["können", "könne / könnten als Ersatzform", "Die Studie legt nahe, frühe Förderung könne Bildungschancen verbessern."],
      ["müssen", "müsse / müssten als Ersatzform", "Lehrkräfte betonen, Unterrichtsmaterial müsse differenzierter gestaltet werden."],
      ["regelmäßiges Verb", "fördere, erleichtere, verbessere", "Die Forscherin behauptet, Mehrsprachigkeit fördere die kognitive Flexibilität."],
    ],
    sourceRows: [
      ["neutral", "laut der Studie · dem Bericht zufolge · nach Angaben des Instituts", "Laut der Studie seien mehrsprachige Kompetenzen im internationalen Arbeitsmarkt zunehmend gefragt."],
      ["vorsichtig", "offenbar · vermutlich · möglicherweise · es deutet darauf hin", "Die Ergebnisse deuteten darauf hin, dass regelmäßiger Sprachkontakt die Lernmotivation erhöhen könne."],
      ["kritisch-distanziert", "behaupten · angeben · angeblich · lasse sich nur teilweise belegen", "Der behauptete Zusammenhang lasse sich anhand der vorliegenden Daten nur teilweise belegen."],
      ["einschränkend", "unter der Voraussetzung · nur für bestimmte Gruppen · nicht ohne Weiteres", "Der Nutzen bilingualer Modelle sei nicht ohne Weiteres auf alle Schulformen übertragbar."],
    ],
    perspectiveRows: [
      ["heute", "an diesem Tag", "Die Lehrerin sagte, an diesem Tag finde ein mehrsprachiger Projekttag statt."],
      ["gestern", "am Vortag", "Sie erklärte, die Klasse habe am Vortag Sprachbiografien verglichen."],
      ["morgen", "am folgenden Tag", "Der Schulleiter kündigte an, am folgenden Tag werde ein neues Förderprogramm vorgestellt."],
      ["hier", "dort / an diesem Ort", "Die Teilnehmerin berichtete, dort würden mehrere Sprachen im Alltag verwendet."],
      ["nächste Woche", "in der folgenden Woche", "Der Verband teilte mit, in der folgenden Woche beginne eine neue Fortbildung."],
    ],
    mistakes: [
      ["Die Studie sagt, Mehrsprachigkeit ist immer positiv.", "Die Studie behauptet, Mehrsprachigkeit sei unter bestimmten Bedingungen vorteilhaft.", "Die zweite Form markiert Quelle, Distanz und begrenzt die Reichweite der Aussage."],
      ["Laut der Studie Mehrsprachigkeit fördert die Karriere.", "Laut der Studie fördere Mehrsprachigkeit in bestimmten Berufsfeldern die Karrierechancen.", "Nach dem Quellenmarker brauchst du einen vollständigen Satz; Konjunktiv I markiert die berichtete Aussage."],
      ["Die Lehrerin erklärte, wir haben gestern diskutiert.", "Die Lehrerin erklärte, die Klasse habe am Vortag diskutiert.", "Pronomen und Zeitangabe werden an die neue Berichtsperspektive angepasst."],
      ["Kritiker sagen, Programme sind teuer. Ich finde das auch.", "Kritiker wenden ein, zusätzliche Programme seien kostenintensiv. Dieser Einwand ist nachvollziehbar; dennoch greift er zu kurz, wenn langfristige Bildungswirkungen unberücksichtigt bleiben.", "Eine C1-Antwort trennt fremde Position, Einordnung und eigene Bewertung."],
    ],
    model: "Mehrsprachigkeit wird häufig als Bildungs- und Standortvorteil dargestellt. Einer aktuellen Untersuchung zufolge könne der regelmäßige Umgang mit mehreren Sprachen flexible Kommunikationsstrategien fördern. Die Autorinnen räumen allerdings ein, der beobachtete Effekt sei nicht in allen Altersgruppen gleich stark und lasse sich ohne langfristige Vergleichsdaten nur eingeschränkt verallgemeinern. Kritiker wenden zudem ein, mehrsprachige Schulprogramme wären ohne zusätzlich qualifizierte Lehrkräfte kaum flächendeckend umsetzbar. Dieser Einwand ist berechtigt, darf jedoch nicht zu einer Defizitperspektive führen. Meines Erachtens sollte Mehrsprachigkeit systematisch gefördert werden, sofern Unterrichtsqualität, individuelle Sprachstände und ausreichende Ressourcen berücksichtigt werden. Dadurch könnten sprachliche Kompetenzen anerkannt werden, ohne den sicheren Erwerb der Bildungssprache zu vernachlässigen.",
    practice: [
      "Forme vier direkte Aussagen über Mehrsprachigkeit in indirekte Rede um.",
      "Verwende dabei mindestens einmal sei, habe, könne und eine Konjunktiv-II-Ersatzform.",
      "Baue zwei unterschiedliche Quellenmarker ein: beispielsweise laut der Studie und dem Verband zufolge.",
      "Passe mindestens zwei Zeitangaben an: gestern, heute, morgen oder nächste Woche.",
      "Schreibe anschließend einen Absatz mit fremder Position, Einschränkung, eigener Bewertung und konkretem Vorschlag.",
    ],
    checks: [
      ["Direkte Rede: Die Forscherin sagt: ‚Mehrsprachigkeit verbessert die Berufschancen.‘", "Die Forscherin erklärt, Mehrsprachigkeit verbessere die Berufschancen."],
      ["Die Lehrerin erklärte: ‚Wir haben gestern lange diskutiert.‘", "Die Lehrerin erklärte, die Klasse habe am Vortag lange diskutiert."],
      ["Quelle + Distanz: Der Effekt ist nicht vollständig belegt.", "Dem Bericht zufolge lasse sich der Effekt bislang nur teilweise belegen."],
      ["Ersatzform: Die Schulen brauchen mehr Personal.", "Der Verband erklärte, die Schulen bräuchten mehr Personal."],
      ["Quelle und eigene Bewertung trennen", "Die Studie behauptet, das Modell sei wirksam. Meines Erachtens fehlen jedoch Langzeitdaten, sodass die Aussage nur eingeschränkt überzeugt."],
    ],
  },
  14: {
    title: "Zukunftsformen, Modalpassiv und Hypothesen bei Innovation und Zukunft",
    subtitle: "technologischen Wandel, Chancen und Risiken differenziert prognostizieren",
    why: "Innovation und Zukunft erfordern Sprache für Prognosen, Möglichkeiten und notwendige Maßnahmen. Auf C1 solltest du nicht nur sagen, was passieren wird, sondern auch unter welchen Bedingungen Entwicklungen sinnvoll oder problematisch werden.",
    goals: ["Zukunft mit werden + Infinitiv und dürfte/könnte ausdrücken", "Modalpassiv für notwendige Maßnahmen nutzen", "Hypothesen mit falls, sofern und vorausgesetzt dass formulieren", "Chancen und Risiken neuer Technologien abwägen"],
    rows: [["Zukunft", "Künstliche Intelligenz wird viele Arbeitsprozesse verändern."], ["vorsichtige Prognose", "Einige Berufsbilder dürften sich grundlegend wandeln."], ["Modalpassiv", "Datenschutz und Transparenz müssen stärker berücksichtigt werden."], ["Bedingung", "Innovation kann gesellschaftlich nützen, sofern ethische Grenzen beachtet werden."]],
    model: "Technologische Innovationen werden die Gesellschaft in den kommenden Jahren erheblich verändern. Viele Arbeitsprozesse dürften automatisiert werden, während kreative und soziale Kompetenzen an Bedeutung gewinnen. Gleichzeitig müssen Datenschutz, Transparenz und Zugangsgerechtigkeit stärker berücksichtigt werden. Innovation kann nur dann langfristig nützen, sofern sie nicht allein wirtschaftlichen Interessen folgt, sondern auch ethische und soziale Folgen einbezieht.",
    checks: [["Vorsichtige Prognose mit dürfte", "Einige Berufe dürften sich verändern."], ["Man muss Datenschutz beachten. → Modalpassiv", "Datenschutz muss beachtet werden."], ["Innovation nützt, ___ ethische Grenzen beachtet werden.", "sofern / vorausgesetzt dass"]],
  },
};

export default function C1Day12To14GrammarNotes({ day, checked = false, onCheckedChange }) {
  const lesson = lessons[Number(day)];
  if (!lesson) return null;

  return <div style={{ display: "grid", gap: 16 }}>
    <section style={card}>
      <span style={{ ...styles.badge, width: "fit-content" }}>C1 · Day {day} · Grammar Notes</span>
      <h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>{lesson.title}</h2>
      <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>{lesson.subtitle}</p>
    </section>

    <section style={card}>
      <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Warum brauchst du diese Grammatik auf C1?</h2>
      <p style={{ margin: 0, lineHeight: 1.75 }}>{lesson.why}</p>
      <NoteBox><strong>Nach dieser Lektion kannst du:</strong><ul style={{ ...listStyle, marginTop: 8 }}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></NoteBox>
    </section>

    {lesson.overview ? <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Direkte Rede, indirekte Rede und Distanzierung</h2><ul style={listStyle}>{lesson.overview.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}

    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Kernstrukturen</h2><Table rows={lesson.rows} /></section>

    {lesson.konjunktivRows ? <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Wichtige Formen des Konjunktivs I</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Verwende die eindeutige Konjunktiv-I-Form. Sieht sie genauso aus wie der Indikativ, nutze eine klare Ersatzform im Konjunktiv II.</p><Table headers={["Verb", "Form", "Beispiel"]} rows={lesson.konjunktivRows} /></section> : null}

    {lesson.sourceRows ? <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Quellenmarker und Stärke der Distanzierung</h2><Table headers={["Funktion", "Typische Mittel", "Beispiel"]} rows={lesson.sourceRows} /><NoteBox tone="amber"><strong>C1-Tipp:</strong> Eine Quellenangabe allein reicht nicht. Zeige zusätzlich, ob die Aussage gesichert, vorläufig, umstritten oder nur auf bestimmte Gruppen übertragbar ist.</NoteBox></section> : null}

    {lesson.perspectiveRows ? <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Zeit- und Ortsangaben anpassen</h2><Table headers={["Original", "Berichtsperspektive", "Beispiel"]} rows={lesson.perspectiveRows} /></section> : null}

    {lesson.mistakes ? <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Häufige Fehler und bessere C1-Formulierungen</h2>{lesson.mistakes.map(([wrong, correct, reason]) => <Mistake key={wrong} wrong={wrong} correct={correct} reason={reason} />)}</section> : null}

    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>C1-Modellabsatz</h2><NoteBox tone="green">{lesson.model}</NoteBox></section>

    {lesson.practice ? <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Anwendungsaufgabe</h2><ol style={listStyle}>{lesson.practice.map((item) => <li key={item}>{item}</li>)}</ol></section> : null}

    <section style={card}>
      <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Selbstkontrolle</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Löse die Aufgabe zuerst selbst und öffne danach die Antwort.</p>
      {lesson.checks.map(([question, answer], index) => <CheckAnswer key={question} question={`${index + 1}. ${question}`} answer={answer} />)}
    </section>

    {onCheckedChange ? <section style={card}><label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}><input type="checkbox" checked={Boolean(checked)} onChange={(event) => onCheckedChange(event.target.checked)} style={{ marginTop: 4 }} /><span>Ich habe die vollständigen Grammatiknotizen gelesen und die Beispiele verstanden.</span></label></section> : null}
  </div>;
}