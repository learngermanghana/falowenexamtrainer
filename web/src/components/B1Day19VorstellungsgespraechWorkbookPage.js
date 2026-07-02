import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { STANDARD_WORKBOOK_TABS, WorkbookTabNav, WorkbookTaskCard } from "./StandardWorkbookComponents";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const title = { margin: 0, fontSize: "1.15rem" };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 13, background: "#fff", display: "grid", gap: 7 };
const highlight = { ...box, background: "#eff6ff", borderColor: "#bfdbfe" };

const Prepared = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
    <input type="checkbox" checked={checked} onChange={onChange} /> I prepared this part.
  </label>
);

const QuestionList = ({ items }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {items.map((item) => (
      <article key={item.number} style={box}>
        <strong>{item.number}. {item.stem}</strong>
        {item.options.map((option) => <span key={option}>{option}</span>)}
      </article>
    ))}
  </div>
);

const energyQuestions = [
  { number: 1, stem: "In diesem Text geht es um ...", options: ["a) die neue Technologie von Eckhard Meier.", "b) die umweltfreundliche Stromproduktion in Feldheim.", "c) einen Studiengang an der Universität Göttingen."] },
  { number: 2, stem: "Die Wissenschaftler wollten zeigen, dass ...", options: ["a) ein ganzes Dorf von modernen Energien leben kann.", "b) eine Bio-Gasanlage mehr Strom produziert, als ein Dorf braucht.", "c) man größere Mengen Strom sparen kann."] },
  { number: 3, stem: "Damit die Idee auch in anderen Dörfern funktioniert, ...", options: ["a) benötigt man viel Geld.", "b) braucht man genug Platz für die Technik.", "c) muss die Bevölkerung dafür sein."] },
];

const murtenQuestions = [
  { number: 4, stem: "In diesem Text geht es darum, dass ...", options: ["a) die Geschichte von Murten neu erzählt wird.", "b) es ein neues Tourismus-Angebot gibt.", "c) man in Murten neue Velo-Wege bauen will."] },
  { number: 5, stem: "Für die Rundfahrt ...", options: ["a) braucht man ein eigenes Velo.", "b) muss man nicht sportlich sein.", "c) sollte man mit der Bahn anreisen."] },
  { number: 6, stem: "Der Geschäftsführer von Murten Tourismus will, dass ...", options: ["a) es in Murten mehr Stadtführungen für Gruppen gibt.", "b) die Leute normale Velos statt Elektro-Velos benutzen.", "c) mehr Velo-Touristen in die Region kommen."] },
];

export default function B1Day19VorstellungsgespraechWorkbookPage() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const mark = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 19 · Kapitel 6.19</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Das Vorstellungsgespräch</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Select Teil 1–4, Ref or Submit. Teil 1 prepares you for class; submit only Teil 2, Teil 3 and Teil 4.</p>
        <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab} tabs={STANDARD_WORKBOOK_TABS} ariaLabel="B1 Day 19 workbook sections" />
      </header>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={title}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard eyebrow="Question of the Day · Speaking" title="Wie bereitest du dich auf ein Vorstellungsgespräch vor?" practiceOnly submissionNote="Speak for 1–2 minutes. Teil 1 is class preparation and is not submitted.">
            <p style={{ margin: 0 }}>Erklären Sie, wie Sie sich auf ein Vorstellungsgespräch vorbereiten. Sprechen Sie über persönliche Informationen, Ausbildung, Berufserfahrung, Stärken, Motivation und Tipps. Nutzen Sie höfliche Redemittel, Konjunktiv II und klare Begründungen.</p>
          </WorkbookTaskCard>
          <p style={{ margin: 0, color: "#475569" }}>The notes below are supporting ideas. They are not separate questions that you must answer one by one.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            <article style={box}><strong>Persönliche Informationen</strong><ul style={list}><li>Name, Wohnort, Geburtsdatum</li><li>Telefonnummer und E-Mail</li><li>kurze, professionelle Selbstvorstellung</li></ul></article>
            <article style={box}><strong>Ausbildung und Qualifikationen</strong><ul style={list}><li>Schulabschluss, Studium oder Ausbildung</li><li>Zertifikate und Sprachkenntnisse</li><li>Computerkenntnisse oder technisches Wissen</li></ul></article>
            <article style={box}><strong>Berufserfahrung</strong><ul style={list}><li>frühere Jobs und Praktika</li><li>Aufgaben und Tätigkeiten</li><li>Erfolge: Was haben Sie gelernt?</li></ul></article>
            <article style={box}><strong>Stärken und Motivation</strong><ul style={list}><li>Teamfähigkeit, Kommunikation, Flexibilität</li><li>Warum möchten Sie hier arbeiten?</li><li>Welche Ziele haben Sie für die Zukunft?</li></ul></article>
          </div>
          <div style={highlight}><strong>Suggested speaking structure</strong><ol style={list}><li>Begrüßung und Vorstellung des Themas</li><li>Inhalt und Struktur Ihrer Vorbereitung</li><li>Persönliche Erfahrung</li><li>Situation in Ihrem Heimatland</li><li>Vor- und Nachteile von Vorstellungsgesprächen</li></ol></div>
          <div style={box}><strong>Useful phrases</strong><ul style={list}><li>Ich würde mich zuerst über die Firma informieren.</li><li>Meine größte Stärke ist ..., weil ...</li><li>In meinem Heimatland ist es üblich, dass ...</li><li>Ein Vorteil ist ..., ein Nachteil ist jedoch ...</li></ul></div>
          <div style={highlight}><strong>Beispielantwort</strong><p style={{ margin: 0 }}>„Ich heiße Anna Müller, bin 25 Jahre alt und wohne in Berlin. Ich habe eine Ausbildung als Bürokauffrau gemacht und arbeite seit zwei Jahren in einem großen Unternehmen. Meine Stärken sind Organisation und Kommunikation. Ich möchte in Ihrem Unternehmen arbeiten, weil ich gerne mit Menschen zusammenarbeite und neue Herausforderungen suche.“</p></div>
          <CourseInlinePracticePanel type="speaking" />
          <Prepared checked={prepared.sprechen} onChange={mark("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={title}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Writing" title="Sind Vorstellungsgespräche schwierig? Schreiben Sie Ihre Meinung." submissionNote="Write about 80 words and submit your final text in the Submit tab.">
            <p style={{ margin: 0 }}>Situation: Emma findet, dass ein Vorstellungsgespräch stressig sein kann. Reagieren Sie auf ihre Meinung. Schreiben Sie, ob Sie zustimmen, warum Vorstellungsgespräche schwierig sein können, wie man sich vorbereiten kann und was für Erfolg wichtig ist.</p>
          </WorkbookTaskCard>
          <div style={highlight}><strong>Emma</strong><p style={{ margin: 0 }}>Ein Vorstellungsgespräch kann stressig sein. Ich stimme dem zu, denn man muss viele Fragen beantworten und einen guten Eindruck machen. Dennoch kann man sich gut vorbereiten, zum Beispiel mit Übungsgesprächen. Ich finde, dass Selbstbewusstsein und eine gute Vorbereitung helfen, erfolgreich zu sein. Was denken Sie darüber?</p></div>
          <div style={box}><strong>Structure</strong><ol style={list}><li>Einleitung: Thema nennen</li><li>Emmas Meinung kurz aufgreifen</li><li>Eigene Meinung mit Gründen</li><li>Vorbereitung und Tipps</li><li>Kurzer Schluss</li></ol></div>
          <div style={box}><strong>Redemittel</strong><ul style={list}><li>Ich stimme Emma zu, denn ...</li><li>Meiner Meinung nach sind Vorstellungsgespräche schwierig, weil ...</li><li>Man sollte sich gut vorbereiten, indem man ...</li><li>Außerdem würde ich ...</li></ul></div>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.schreiben} onChange={mark("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={title}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Reading" title="Lesen Sie den Text und beantworten Sie 3 Fragen." submissionNote="Submit only answer letters, for example: 1B, 2A, 3C.">
            <p style={{ margin: 0 }}>Read the complete text „Ein Dorf für grüne Energie“. Choose one answer, a–c, for each question.</p>
          </WorkbookTaskCard>
          <article style={box}>
            <h3 style={{ margin: 0 }}>Ein Dorf für grüne Energie</h3>
            <p>Das Dorf Feldheim in Brandenburg macht sich unabhängig von Öl und Kohle. Seit Kurzem deckt das Dorf seinen kompletten Strombedarf und drei Viertel des Wärmebedarfs durch moderne Energien.</p>
            <p>„Das funktioniert mithilfe einer modernen Anlage für Bio-Gas“, erklärt der Diplom-Physiker Eckhard Meier. „Da kommen Abfall von den Tieren, Getreide und Holz rein und werden erwärmt. Ein Motor verbrennt das Gas und erzeugt dabei Wärme. Der Motor treibt dann einen Generator an, der Strom produziert.“</p>
            <p>Entstanden ist die Idee des „Bio-Energiedorfs“ an der Universität Göttingen. Ziel der Wissenschaftler war es zu zeigen, dass es möglich ist, ein Dorf komplett mit erneuerbaren Energien zu versorgen und damit einen Beitrag zum Klimaschutz zu leisten.</p>
            <p>Tatsächlich: Die Bio-Gasanlage erzeugt jährlich doppelt so viel Strom wie die Gemeinde verbraucht. Der Rest wird in das Stromnetz abgegeben und kostenlos anderen Dörfern zur Verfügung gestellt.</p>
            <p>Passt das Konzept auch für andere Dörfer? „Im Prinzip schon“, meint Eckhard Meier. Die technischen Anlagen könnten an anderen Orten genauso aufgebaut werden – der Raumbedarf ist gering. Man benötigt allerdings vor allem eines: aktive und begeisterte Einwohner!</p>
            <p style={{ margin: 0 }}>(aus einer deutschen Zeitung)</p>
          </article>
          <div style={highlight}><strong>Beispiel 0 – Die Bio-Gasanlage ...</strong><span>a) gehört Eckhard Meier.</span><span>b) gibt es seit einem Dreivierteljahr.</span><span>c) produziert Strom und Wärme. ✅ (Lösung)</span></div>
          <QuestionList items={energyQuestions} />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.lesen} onChange={mark("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={title}>Teil 4 · Hören (Assignment)</h2>
          <WorkbookTaskCard eyebrow="Your assignment · Listening" title="Kein Hören-Medium wurde geliefert: Bearbeiten Sie den zweiten Lesetext als Teil 4." submissionNote="Submit only answer letters, for example: 4B, 5B, 6C.">
            <p style={{ margin: 0 }}>Read the complete text „Tour durch Murtens Geschichte“ and answer 3 questions. Listen for no audio; this chapter uses reading content for Teil 4 because no Hören URL was supplied.</p>
          </WorkbookTaskCard>
          <article style={box}>
            <h3 style={{ margin: 0 }}>Tour durch Murtens Geschichte</h3>
            <p>Mit der Rundfahrt “Zeitreise per Velo” können Touristen das Städtchen Murten und seine Geschichte sportlich neu entdecken.</p>
            <p>Die Tour startet am Bahnhof von Murten, wo die sportlichen Teilnehmer auf das eigene oder ein gemietetes Velo steigen. Die weniger sportlichen und jene, die es schon immer ausprobieren wollten, steigen aufs Elektro-Velo. Dieses kann ebenfalls am Bahnhof gemietet werden.</p>
            <p>Vom Bahnhof führt der Weg auf den historischen Hügel, wo Karl der Kühne sein Hauptquartier aufbaute, bevor sein Heer im Jahr 1476 besiegt wurde. Die Sportlichen kommen bei der Fahrt auf den Hügel ins Schwitzen, während die E-Biker ganz einfach den Elektromotor nutzen.</p>
            <p>Oben angekommen kann man die wunderbare Aussicht auf den Murtensee genießen. Nach einer kurzen Pause geht es weiter nach Merlach. Dort steht ein Denkmal für Soldaten, die in der Schlacht bei Murten 1476 umgekommen sind.</p>
            <p>Danach geht die Fahrt zum Hafen und in die Altstadt. Unterwegs erfahren die Velofahrer vieles über die Region.</p>
            <p style={{ margin: 0 }}>“Mit der Velorundfahrt für Gruppen wollen wir unser Angebot für aktive Radfahrer erweitern”, sagt der Geschäftsführer von Murten Tourismus. Damit soll sowohl das Gebiet für Velo-Touristen interessant gemacht als auch der Trend zum E-Bike unterstützt werden.</p>
          </article>
          <QuestionList items={murtenQuestions} />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.hoeren} onChange={mark("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day19Vorstellungsgespraech", level: "B1", day: 19, workbookId: "B1Day19Vorstellungsgespraech" }} workbookId="B1Day19Vorstellungsgespraech" />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={title}>Submit workbook answers</h2>
          <WorkbookTaskCard eyebrow="Final step" title="Submit Teil 2, Teil 3 and Teil 4." submissionNote="Do not submit Teil 1.">
            <p style={{ margin: 0 }}>Paste your writing text from Teil 2, your reading answers from Teil 3 and your Teil 4 answer letters into the form below.</p>
          </WorkbookTaskCard>
          <div className="b1-day19-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day19-submission-page > div > section:first-child { display: none !important; }.b1-day19-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage submissionContext={{ level: "B1", day: 19, assignmentKey: "B1-6.19", canonicalAssignmentKey: "B1-6.19" }} />
          </div>
        </section>
      )}
    </div>
  );
}
