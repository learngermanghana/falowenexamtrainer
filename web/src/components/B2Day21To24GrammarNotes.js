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
  21: {
    title: "Temporale und kausale Strukturen bei Migration und neuen Lebenswegen",
    subtitle: "Umzug, Integration und persönliche Chancen als Prozess erklären",
    why: "Migration ist ein Prozess mit vielen Schritten: Vor dem Umzug plant man, nach der Ankunft muss man sich orientieren, und mit der Zeit entstehen neue Chancen. Auf B2 brauchst du temporale und kausale Strukturen, um diesen Weg klar zu beschreiben.",
    goals: ["Abläufe mit bevor, nachdem und seitdem strukturieren", "Gründe mit weil und da erklären", "Folgen mit deshalb und dadurch ausdrücken", "persönliche Veränderungen differenziert beschreiben"],
    rows: [
      ["bevor", "Bevor man nach Deutschland zieht, sollte man sich über Sprache und Arbeit informieren."],
      ["nachdem", "Nachdem man angekommen ist, muss man oft viele Termine erledigen."],
      ["seitdem", "Seitdem sie einen Sprachkurs besucht, fühlt sie sich sicherer."],
      ["dadurch / deshalb", "Sie lernt Deutsch. Dadurch findet sie leichter Kontakte."],
    ],
    model: "Migration ist oft ein langer Prozess. Bevor man in ein neues Land zieht, braucht man Informationen über Sprache, Arbeit und Alltag. Nachdem man angekommen ist, sind Behörden, Wohnungssuche und Kontakte sehr wichtig. Seitdem viele Menschen digitale Angebote nutzen, können sie sich schneller informieren. Trotzdem bleibt Integration schwierig, weil neue Regeln und kulturelle Unterschiede Zeit brauchen. Dadurch entstehen aber auch Chancen für Bildung, Beruf und persönliche Entwicklung.",
    checks: [["___ man umzieht, sollte man Informationen sammeln.", "Bevor"], ["___ sie Deutsch lernt, fühlt sie sich sicherer.", "Seitdem"], ["Sie macht einen Kurs. ___ findet sie leichter Arbeit.", "Dadurch / Deshalb"]],
  },
  22: {
    title: "Meinung und indirekte Rede bei Demokratie und Mitbestimmung",
    subtitle: "Beteiligung, Rechte und Verantwortung sachlich diskutieren",
    why: "Bei Demokratie und Mitbestimmung musst du Meinungen wiedergeben, Argumente einordnen und deine eigene Position klar formulieren. Indirekte Rede und Meinungsausdrücke helfen dir, sachlich und differenziert zu sprechen.",
    goals: ["Meinungen mit meiner Ansicht nach und ich bin der Meinung, dass formulieren", "Aussagen mit indirekter Rede wiedergeben", "Beteiligung mit Modalverben erklären", "Argumente mit zwar … aber abwägen"],
    rows: [
      ["Meinung + dass", "Ich bin der Meinung, dass junge Menschen mehr mitbestimmen sollten."],
      ["meiner Ansicht nach", "Meiner Ansicht nach stärkt Beteiligung das Vertrauen in die Gesellschaft."],
      ["indirekte Rede", "Viele sagen, dass Wahlen wichtig seien."],
      ["zwar … aber", "Wahlen sind zwar wichtig, aber Engagement im Alltag zählt auch."],
    ],
    model: "Meiner Ansicht nach lebt Demokratie nicht nur von Wahlen, sondern auch von Beteiligung im Alltag. Viele sagen, dass junge Menschen mehr Möglichkeiten zur Mitbestimmung brauchen. Das ist sinnvoll, weil Entscheidungen sie direkt betreffen. Bürger sollten ihre Rechte kennen, aber sie müssen auch Verantwortung übernehmen. Zwar ist politische Diskussion manchmal anstrengend, aber sie hilft, unterschiedliche Perspektiven zu verstehen und gemeinsame Lösungen zu finden.",
    checks: [["Ich bin der Meinung, ___ Bürger mehr informiert werden sollten.", "dass"], ["Wahlen sind wichtig, ___ Engagement im Alltag zählt auch.", "aber"], ["Viele sagen, dass Demokratie wichtig ___.", "sei / ist"]],
  },
  23: {
    title: "Konzessive und finale Strukturen bei Work-Life-Balance",
    subtitle: "Arbeit, Freizeit, Erholung und Grenzen ausgewogen erklären",
    why: "Work-Life-Balance ist ein Thema mit Gegensätzen: Arbeit ist wichtig, aber Erholung auch. Auf B2 musst du Einschränkungen und Ziele ausdrücken, damit deine Argumentation realistisch klingt.",
    goals: ["Gegensätze mit obwohl, auch wenn und trotzdem formulieren", "Ziele mit um … zu und damit ausdrücken", "Tipps mit sollte und könnte geben", "Folgen von Stress und Erholung erklären"],
    rows: [
      ["obwohl", "Obwohl Arbeit wichtig ist, braucht jeder Mensch Erholung."],
      ["auch wenn", "Auch wenn man viel zu tun hat, sollte man Pausen einplanen."],
      ["um … zu", "Viele machen Sport, um Stress abzubauen."],
      ["damit", "Arbeitgeber bieten flexible Zeiten an, damit Mitarbeitende Familie und Beruf besser vereinbaren können."],
    ],
    model: "Eine gute Work-Life-Balance ist wichtig, weil dauernder Stress krank machen kann. Obwohl Arbeit ein wichtiger Teil des Lebens ist, braucht man Zeit für Erholung, Familie und Hobbys. Viele Menschen machen Sport, um Stress abzubauen. Arbeitgeber könnten flexiblere Arbeitszeiten anbieten, damit Mitarbeitende produktiv bleiben und weniger überfordert sind. Auch wenn nicht jede Arbeit flexibel ist, sollte man klare Grenzen setzen und regelmäßige Pausen ernst nehmen.",
    checks: [["___ Arbeit wichtig ist, braucht man Erholung.", "Obwohl"], ["Viele machen Sport, ___ Stress abzubauen.", "um"], ["Flexible Zeiten helfen, ___ Familie und Beruf besser zusammenpassen.", "damit"]],
  },
  24: {
    title: "Passiv und Nominalisierung bei Wissenschaft und Forschung",
    subtitle: "Forschung, Medizin, Technik und Nutzen für die Gesellschaft sachlich beschreiben",
    why: "Bei Wissenschaft und Forschung geht es oft um Prozesse: Studien werden durchgeführt, Daten werden ausgewertet, Ergebnisse werden veröffentlicht. Passiv und Nominalisierung machen deine Sprache sachlicher und passen sehr gut zu B2-Argumentationen.",
    goals: ["Vorgangspassiv mit werden + Partizip II verwenden", "Prozesse in Forschung und Medizin sachlich beschreiben", "Nominalisierungen wie die Entwicklung und die Untersuchung bilden", "Nutzen und Risiken wissenschaftlicher Fortschritte abwägen"],
    rows: [
      ["Vorgangspassiv", "Neue Medikamente werden in Studien getestet."],
      ["Passiv + von", "Die Ergebnisse werden von Forschenden ausgewertet."],
      ["Nominalisierung", "forschen → die Forschung; entwickeln → die Entwicklung"],
      ["abwägen", "Einerseits bringt Forschung Fortschritt, andererseits entstehen ethische Fragen."],
    ],
    model: "Wissenschaft und Forschung verändern den Alltag stark. Neue Medikamente werden entwickelt und in Studien getestet, bevor sie genutzt werden können. Die Auswertung von Daten hilft, Krankheiten besser zu verstehen. Gleichzeitig müssen Datenschutz und ethische Fragen beachtet werden. Einerseits bringt Forschung viele Vorteile für Medizin und Technik, andererseits darf Fortschritt nicht ohne klare Regeln passieren. Deshalb sollte Wissenschaft transparent erklärt werden.",
    checks: [["Passiv: Forschende testen neue Medikamente.", "Neue Medikamente werden von Forschenden getestet."], ["Nominalisierung: Daten auswerten", "die Auswertung von Daten"], ["Neue Ergebnisse ___ veröffentlicht.", "werden"]],
  },
};

export default function B2Day21To24GrammarNotes({ day, checked = false, onCheckedChange }) {
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
