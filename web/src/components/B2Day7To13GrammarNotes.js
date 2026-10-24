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
const Table = ({ rows }) => (
  <div style={{ width: "100%", overflowX: "auto" }}>
    <table style={tableStyle}>
      <thead><tr><th style={cellStyle}>Struktur / Funktion</th><th style={cellStyle}>Beispiel</th></tr></thead>
      <tbody>{rows.map(([left, right]) => <tr key={`${left}-${right}`}><td style={cellStyle}><strong>{left}</strong></td><td style={cellStyle}>{right}</td></tr>)}</tbody>
    </table>
  </div>
);
const CheckAnswer = ({ question, answer }) => (
  <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}>
    <summary style={{ cursor: "pointer", fontWeight: 800 }}>{question}</summary>
    <div style={{ marginTop: 10, lineHeight: 1.7 }}><strong>Lösung:</strong> {answer}</div>
  </details>
);

const lessons = {
  7: {
    title: "Ursache, Folge und Zweck bei Umwelt und Nachhaltigkeit",
    subtitle: "Klimaschutz, Konsum und Alltagshandeln logisch verbinden",
    why: "Beim Thema Umwelt musst du erklären, warum ein Problem entsteht, welche Folge es hat und wozu eine Maßnahme dient. Dadurch klingt deine B2-Meinung klar und argumentativ.",
    goals: ["Gründe mit weil und da nennen", "Folgen mit deshalb, daher und aus diesem Grund ausdrücken", "Ziele mit um … zu und damit formulieren", "eine Umweltmaßnahme mit Problem, Lösung und Vorteil erklären"],
    rows: [
      ["Grund: weil / da", "Viele Menschen fahren mit dem Auto, weil der öffentliche Verkehr nicht überall praktisch ist."],
      ["Folge: deshalb / daher", "Plastik verursacht viel Müll. Deshalb sollten Verpackungen reduziert werden."],
      ["Zweck: um … zu", "Viele nutzen Stofftaschen, um weniger Plastik zu verbrauchen."],
      ["Zweck: damit", "Städte bauen Radwege, damit mehr Menschen sicher Fahrrad fahren können."],
    ],
    model: "Nachhaltigkeit ist wichtig, weil unser Alltag viele Ressourcen verbraucht. In Deutschland wird Müll getrennt, damit Wertstoffe wiederverwendet werden können. Viele Menschen kaufen regionale Produkte, um Transportwege zu verkürzen. Trotzdem ist nachhaltiges Leben nicht immer einfach, da Bio-Produkte oft teurer sind. Deshalb sollte man mit kleinen Schritten beginnen, zum Beispiel weniger Plastik verwenden und öfter öffentliche Verkehrsmittel nutzen.",
    checks: [["Ich trenne Müll, ___ Ressourcen gespart werden.", "damit"], ["Viele fahren Rad, ___ sie CO₂ sparen wollen.", "weil / da"], ["Plastik ist ein Problem. ___ sollte man Verpackungen reduzieren.", "Deshalb / Daher"]],
  },
  8: {
    title: "Vergleiche und Abwägung bei Reisen und Mobilität",
    subtitle: "Verkehrsmittel, Urlaub und nachhaltige Entscheidungen vergleichen",
    why: "Bei Reisen und Mobilität musst du Alternativen vergleichen: Auto, Bahn, Flugzeug oder Fahrrad. Auf B2 sollst du nicht nur sagen, was besser ist, sondern Kriterien nennen und abwägen.",
    goals: ["Vergleiche mit im Vergleich zu und verglichen mit bilden", "Gegensätze mit während und wohingegen ausdrücken", "Entwicklungen mit je … desto erklären", "Vorteile und Nachteile ausgewogen formulieren"],
    rows: [
      ["im Vergleich zu + Dativ", "Im Vergleich zum Auto ist die Bahn oft klimafreundlicher."],
      ["während / wohingegen", "Während das Flugzeug schnell ist, verursacht es viele Emissionen."],
      ["je … desto", "Je günstiger der öffentliche Verkehr ist, desto häufiger nutzen Menschen ihn."],
      ["einerseits … andererseits", "Einerseits ist Reisen wichtig, andererseits sollte man Umweltfolgen beachten."],
    ],
    model: "Im Vergleich zum Auto ist die Bahn in Deutschland oft entspannter und umweltfreundlicher. Während man mit dem Auto flexibler ist, kann man im Zug lesen oder arbeiten. Je besser die Verbindung ist, desto eher verzichten Menschen auf das Auto. Trotzdem bleibt das Auto auf dem Land wichtig, weil nicht jeder Ort gut angebunden ist. Deshalb sollte Mobilität praktisch und zugleich nachhaltiger werden.",
    checks: [["___ besser die Verbindung ist, desto attraktiver ist die Bahn.", "Je"], ["Im Vergleich ___ Auto ist die Bahn klimafreundlicher.", "zum"], ["Während das Auto flexibel ist, ___ die Bahn oft entspannter ist.", "wohingegen"]],
  },
  9: {
    title: "Höfliche Beschwerden und indirekte Fragen beim Wohnen",
    subtitle: "Mietprobleme, Nachbarschaft und Wohnformen respektvoll besprechen",
    why: "Beim Wohnen in Deutschland sind formelle Nachrichten, Hausordnung, Nachbarschaft und Vermieterkommunikation wichtig. Du brauchst höfliche Strukturen, um Probleme klar, aber respektvoll zu formulieren.",
    goals: ["indirekte Fragen mit ob und W-Fragen bilden", "höfliche Bitten mit könnten und würden formulieren", "Beschwerden sachlich begründen", "eine Lösung vorschlagen"],
    rows: [
      ["indirekte Ja/Nein-Frage", "Könnten Sie mir sagen, ob die Heizung repariert wird?"],
      ["indirekte W-Frage", "Ich möchte wissen, wann der Handwerker kommt."],
      ["höfliche Bitte", "Würden Sie bitte die Nachbarn über die Ruhezeiten informieren?"],
      ["sachliche Beschwerde", "Seit drei Tagen funktioniert die Heizung nicht, deshalb bitte ich um eine schnelle Lösung."],
    ],
    model: "Wenn es in einer Wohnung ein Problem gibt, sollte man sachlich und höflich schreiben. Man kann zum Beispiel fragen, ob ein Reparaturtermin möglich ist. In Deutschland sind klare Absprachen mit Vermietern und Nachbarn sehr wichtig, weil viele Menschen eng zusammen wohnen. Eine gute Beschwerde nennt das Problem, erklärt die Folge und bittet um eine konkrete Lösung. So bleibt die Kommunikation respektvoll.",
    checks: [["Direkt: Wann kommt der Handwerker? → Indirekt", "Ich möchte wissen, wann der Handwerker kommt."], ["Bitte höflich: Reparieren Sie die Heizung!", "Könnten Sie bitte die Heizung reparieren?"], ["Ich frage, ___ die Miete Nebenkosten enthält.", "ob"]],
  },
  10: {
    title: "Zweiteilige Konnektoren bei Konsum und Geld",
    subtitle: "Kaufentscheidungen, Budget und Werbung ausgewogen bewerten",
    why: "Bei Konsum und Geld musst du oft zwei Seiten nennen: Preis und Qualität, Wunsch und Budget, Werbung und Realität. Zweiteilige Konnektoren helfen dir, strukturierter zu argumentieren.",
    goals: ["einerseits … andererseits zur Abwägung nutzen", "sowohl … als auch korrekt verwenden", "weder … noch für doppelte Verneinung bilden", "nicht nur … sondern auch für Erweiterungen verwenden"],
    rows: [
      ["einerseits … andererseits", "Einerseits ist ein günstiger Preis wichtig, andererseits sollte die Qualität stimmen."],
      ["sowohl … als auch", "Beim Einkaufen zählen sowohl der Preis als auch die Herkunft."],
      ["weder … noch", "Man sollte weder unnötig Schulden machen noch impulsiv kaufen."],
      ["nicht nur … sondern auch", "Werbung beeinflusst nicht nur Kinder, sondern auch Erwachsene."],
    ],
    model: "Beim Konsum achte ich sowohl auf den Preis als auch auf die Qualität. Einerseits möchte man Geld sparen, andererseits können sehr billige Produkte schneller kaputtgehen. Werbung beeinflusst nicht nur unsere Wünsche, sondern auch unsere Vorstellung davon, was normal ist. Deshalb sollte man vor dem Kauf überlegen, ob man ein Produkt wirklich braucht. Ein gutes Budget hilft, weder zu viel auszugeben noch wichtige Kosten zu vergessen.",
    checks: [["Einerseits ist der Preis wichtig, ___ sollte die Qualität stimmen.", "andererseits"], ["Sowohl der Preis ___ die Qualität zählen.", "als auch"], ["Man sollte ___ unnötig kaufen noch Schulden machen.", "weder"]],
  },
  11: {
    title: "Konjunktiv II für Integration und gesellschaftliche Vorschläge",
    subtitle: "Sprache, Teilhabe und Zusammenleben höflich diskutieren",
    why: "Beim Thema Integration sollst du Vorschläge, Wünsche und Möglichkeiten ausdrücken, ohne zu direkt oder absolut zu klingen. Der Konjunktiv II macht deine Sprache diplomatischer.",
    goals: ["Vorschläge mit sollte, könnte und wäre bilden", "hypothetische wenn-Sätze verwenden", "Wünsche und Verbesserungen formulieren", "gesellschaftliche Lösungen höflich diskutieren"],
    rows: [
      ["sollte", "Man sollte Sprachkurse leichter zugänglich machen."],
      ["könnte", "Vereine könnten neue Mitglieder aktiver einladen."],
      ["wäre", "Es wäre hilfreich, wenn Informationen mehrsprachig wären."],
      ["wenn-Satz", "Wenn mehr Menschen teilnehmen würden, könnten Vorurteile abgebaut werden."],
    ],
    model: "Integration gelingt besser, wenn Menschen echte Möglichkeiten zur Teilhabe bekommen. Man sollte Sprachkurse und Beratungsangebote gut erklären. Es wäre hilfreich, wenn Behörden einfache Sprache verwenden würden. Vereine könnten ebenfalls eine wichtige Rolle spielen, weil man dort Kontakte knüpfen kann. Wenn Einheimische und Zugewanderte mehr miteinander sprechen würden, könnten Missverständnisse schneller abgebaut werden.",
    checks: [["Es ___ hilfreich, wenn Informationen klarer wären.", "wäre"], ["Vereine ___ neue Mitglieder einladen.", "könnten"], ["Wenn mehr Menschen teilnehmen ___, gäbe es mehr Kontakt.", "würden"]],
  },
  12: {
    title: "Temporale Nebensätze bei Kultur und Freizeit",
    subtitle: "Hobbys, Veranstaltungen und persönliche Interessen zeitlich strukturieren",
    why: "Wenn du über Freizeit und Kultur sprichst, erzählst du oft von Gewohnheiten, Erlebnissen und Reihenfolgen. Temporale Konnektoren helfen dir, diese Abläufe klar zu ordnen.",
    goals: ["wenn und als unterscheiden", "während, bevor und nachdem verwenden", "Verbendstellung im Nebensatz beachten", "Freizeitaktivitäten zeitlich zusammenhängend beschreiben"],
    rows: [
      ["wenn", "Wenn ich Freizeit habe, besuche ich gern kulturelle Veranstaltungen."],
      ["als", "Als ich zum ersten Mal in Deutschland war, besuchte ich ein Stadtfest."],
      ["bevor", "Bevor ich ein Konzert besuche, kaufe ich die Tickets online."],
      ["nachdem", "Nachdem der Kurs endet, treffe ich mich mit Freunden."],
    ],
    model: "Kultur und Freizeit sind wichtig, weil sie Menschen zusammenbringen. Wenn ich Zeit habe, besuche ich gern Veranstaltungen oder mache Sport. Als ich in Deutschland war, habe ich gemerkt, dass Vereine eine große Rolle spielen. Bevor man an einem Kurs teilnimmt, sollte man sich über Zeiten und Kosten informieren. Nachdem man regelmäßig mitmacht, entstehen oft neue Kontakte und Freundschaften.",
    checks: [["___ ich Kind war, spielte ich oft draußen.", "Als"], ["___ ich Freizeit habe, gehe ich gern spazieren.", "Wenn"], ["Nachdem der Film ___, diskutieren wir darüber.", "endet / geendet hat"]],
  },
  13: {
    title: "Ursache, Gegensatz und Folge in Familienthemen",
    subtitle: "Familienmodelle, Generationen und Verantwortung differenziert erklären",
    why: "Beim Thema Familie und Generationen gibt es oft verschiedene Meinungen. Du brauchst Konnektoren, um Gründe, Gegensätze und Folgen klar miteinander zu verbinden.",
    goals: ["Gründe mit weil und da nennen", "Gegensätze mit obwohl und während ausdrücken", "Folgen mit deshalb und daher erklären", "Familienkonflikte ausgewogen beschreiben"],
    rows: [
      ["weil / da", "Viele junge Erwachsene wohnen länger zu Hause, weil die Mieten hoch sind."],
      ["obwohl", "Obwohl ältere Menschen Erfahrung haben, fühlen sie sich manchmal ausgeschlossen."],
      ["während", "Während Eltern Sicherheit wichtig finden, wünschen Jugendliche mehr Freiheit."],
      ["deshalb / daher", "Pflege kostet viel Zeit. Deshalb brauchen Familien Unterstützung."],
    ],
    model: "Familie verändert sich, weil Menschen heute unterschiedliche Lebenswege wählen. Während früher oft mehrere Generationen eng zusammenlebten, wohnen heute viele Familien getrennt. Obwohl ältere Menschen viel Erfahrung haben, werden ihre Bedürfnisse manchmal übersehen. Deshalb ist Respekt zwischen den Generationen wichtig. Eine gute Familie gibt Sicherheit, aber sie sollte auch persönliche Freiheit ermöglichen.",
    checks: [["Viele bleiben zu Hause, ___ die Mieten hoch sind.", "weil / da"], ["___ Eltern Sicherheit wollen, wünschen Jugendliche Freiheit.", "Während"], ["Pflege ist anstrengend. ___ brauchen Familien Hilfe.", "Deshalb / Daher"]],
  },
};

export default function B2Day7To13GrammarNotes({ day, checked = false, onCheckedChange }) {
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

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Kernstrukturen</h2>
        <Table rows={lesson.rows} />
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>B2-Modellabsatz</h2>
        <NoteBox tone="green">{lesson.model}</NoteBox>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Selbstkontrolle</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Löse die Aufgabe zuerst selbst und öffne danach die Antwort.</p>
        {lesson.checks.map(([question, answer], index) => <CheckAnswer key={question} question={`${index + 1}. ${question}`} answer={answer} />)}
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
