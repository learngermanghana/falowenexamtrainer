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
  17: {
    title: "Vergleiche und lokale Präpositionen bei Mobilität und Stadtleben",
    subtitle: "Verkehr, Stadtplanung und Lebensqualität klar vergleichen",
    why: "Beim Thema Mobilität und Stadtleben musst du Orte, Wege und Unterschiede beschreiben. Du erklärst, wo Probleme entstehen, welche Verkehrsmittel besser funktionieren und wie Stadtplanung die Lebensqualität beeinflusst.",
    goals: ["Stadt- und Verkehrssituationen mit lokalen Präpositionen beschreiben", "Verkehrsmittel mit während, wohingegen und im Vergleich zu vergleichen", "Veränderungen mit je … desto erklären", "Lebensqualität mit Ursache und Folge begründen"],
    rows: [
      ["lokal: in / auf / an", "In der Innenstadt gibt es viele Staus. An großen Straßen ist es oft laut."],
      ["im Vergleich zu + Dativ", "Im Vergleich zum Auto ist das Fahrrad in der Stadt oft schneller."],
      ["während / wohingegen", "Während Busse viele Menschen transportieren, brauchen Autos viel Platz."],
      ["je … desto", "Je besser der öffentliche Verkehr ist, desto weniger Menschen brauchen ein Auto."],
    ],
    model: "Mobilität beeinflusst die Lebensqualität in einer Stadt stark. In der Innenstadt gibt es oft Staus, während Radwege den Verkehr entlasten können. Im Vergleich zum Auto ist die Straßenbahn klimafreundlicher und braucht weniger Platz. Je sicherer Radwege sind, desto häufiger nutzen Menschen das Fahrrad. Trotzdem müssen Städte auch an ältere Menschen und Familien denken, damit Mobilität für alle praktisch bleibt.",
    checks: [["Im Vergleich ___ Auto ist die Straßenbahn platzsparender.", "zum"], ["___ besser der Nahverkehr ist, desto weniger Autos fahren in die Innenstadt.", "Je"], ["Während Autos flexibel sind, ___ Busse mehr Menschen transportieren.", "wohingegen"]],
  },
  18: {
    title: "Konditionale und konsekutive Sätze bei Natur, Klima und Verantwortung",
    subtitle: "Bedingungen, Folgen und Verantwortung beim Klimaschutz erklären",
    why: "Klimaschutz braucht klare Argumentation: Wenn Menschen ihr Verhalten ändern, hat das Folgen. Auf B2 solltest du Bedingungen, Konsequenzen und Verantwortlichkeiten logisch verbinden können.",
    goals: ["Bedingungen mit wenn und falls ausdrücken", "Folgen mit sodass, deshalb und dadurch formulieren", "Verantwortung mit müssen, sollen und dürfen differenzieren", "Klimaschutzmaßnahmen mit Wirkung erklären"],
    rows: [
      ["wenn / falls", "Wenn weniger Energie verbraucht wird, sinken die Kosten und Emissionen."],
      ["sodass", "Viele Städte pflanzen Bäume, sodass die Luft besser wird."],
      ["dadurch", "Menschen sparen Strom. Dadurch wird weniger Energie verschwendet."],
      ["Modalverben", "Politik muss Regeln schaffen, aber Bürger sollten auch ihren Alltag verändern."],
    ],
    model: "Wenn Menschen weniger Energie verbrauchen, können Kosten und Emissionen sinken. Viele Städte schützen Grünflächen, sodass die Luft sauberer bleibt und Menschen sich erholen können. Klimaschutz darf aber nicht nur Aufgabe einzelner Personen sein. Die Politik muss klare Regeln schaffen, während Unternehmen nachhaltiger produzieren sollten. Dadurch wird Verantwortung gerechter verteilt.",
    checks: [["___ mehr Bäume gepflanzt werden, verbessert sich das Klima in der Stadt.", "Wenn / Falls"], ["Die Stadt baut Parks, ___ Menschen sich erholen können.", "sodass / damit"], ["Menschen sparen Strom. ___ wird weniger Energie verschwendet.", "Dadurch / Deshalb"]],
  },
  19: {
    title: "Finale und kausale Strukturen bei Freiwilligenarbeit und Engagement",
    subtitle: "Ehrenamt, Motivation und gesellschaftliche Hilfe begründen",
    why: "Beim Thema Engagement musst du erklären, warum Menschen helfen und wozu ein Projekt dient. Dafür brauchst du Gründe, Ziele und Folgen in klarer B2-Struktur.",
    goals: ["Gründe mit weil, da und aus diesem Grund nennen", "Ziele mit um … zu und damit formulieren", "Folgen mit dadurch und deshalb verbinden", "Motivation und gesellschaftlichen Nutzen erklären"],
    rows: [
      ["weil / da", "Viele engagieren sich, weil sie anderen Menschen helfen möchten."],
      ["um … zu", "Jugendliche helfen im Verein, um praktische Erfahrungen zu sammeln."],
      ["damit", "Organisationen bieten Projekte an, damit Menschen leichter teilnehmen können."],
      ["dadurch", "Ehrenamt stärkt Kontakte. Dadurch entsteht mehr Zusammenhalt."],
    ],
    model: "Freiwilligenarbeit ist wichtig, weil sie Menschen zusammenbringt und konkrete Hilfe leistet. Viele engagieren sich in Vereinen, um anderen zu helfen oder neue Erfahrungen zu sammeln. Organisationen sollten einfache Informationen anbieten, damit mehr Menschen mitmachen können. Dadurch entstehen Kontakte und Vertrauen in der Gesellschaft. Ehrenamt ersetzt nicht die Arbeit des Staates, aber es kann den Zusammenhalt deutlich stärken.",
    checks: [["Viele helfen, ___ sie Verantwortung übernehmen möchten.", "weil / da"], ["Sie arbeitet freiwillig, ___ Erfahrungen zu sammeln.", "um"], ["Vereine informieren online, ___ mehr Menschen teilnehmen können.", "damit"]],
  },
  20: {
    title: "Passiv mit Modalverben und Zukunftsformen bei Technologie und Arbeit",
    subtitle: "Automatisierung, neue Berufe und Kompetenzen sachlich bewerten",
    why: "Bei Technologie und Arbeit der Zukunft beschreibst du Veränderungen, Prozesse und mögliche Entwicklungen. Das Passiv mit Modalverben und Zukunftsformen hilft dir, sachlich über Chancen, Risiken und Regeln zu sprechen.",
    goals: ["Passiv mit Modalverben bilden", "Zukunft mit werden + Infinitiv ausdrücken", "Prozesse ohne handelnde Person beschreiben", "Chancen und Risiken ausgewogen bewerten"],
    rows: [
      ["Passiv mit Modalverb", "Digitale Kompetenzen müssen in vielen Berufen gelernt werden."],
      ["können + Passiv", "Einfache Aufgaben können automatisiert werden."],
      ["Zukunft: werden + Infinitiv", "Viele Berufe werden sich durch KI verändern."],
      ["abwägen", "Einerseits entstehen neue Chancen, andererseits können manche Arbeitsplätze verschwinden."],
    ],
    model: "Technologie wird die Arbeitswelt weiter verändern. Einfache Aufgaben können automatisiert werden, während kreative und soziale Kompetenzen wichtiger werden. Digitale Fähigkeiten müssen deshalb in Ausbildung und Weiterbildung stärker trainiert werden. Einerseits kann KI Arbeit erleichtern, andererseits können manche Menschen Angst vor Arbeitsplatzverlust haben. Deshalb sollten Unternehmen neue Technologien verantwortungsvoll einführen und Mitarbeitende unterstützen.",
    checks: [["Passiv mit Modalverb: Man muss digitale Kompetenzen lernen.", "Digitale Kompetenzen müssen gelernt werden."], ["Viele Berufe ___ sich verändern.", "werden"], ["Einfache Aufgaben können ___ werden.", "automatisiert"]],
  },
};

export default function B2Day17To20GrammarNotes({ day, checked = false, onCheckedChange }) {
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
