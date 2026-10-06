import React, { useState } from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import { getB1ReadingTask } from "../data/b1ReadingTasks";
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

const WritingSupportVideo = () => (
  <article
    data-b1-day19-writing-video="true"
    style={{
      ...box,
      background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
      borderColor: "#93c5fd",
      gap: 12,
    }}
  >
    <div style={{ display: "grid", gap: 4 }}>
      <span style={{ color: "#1d4ed8", fontSize: ".78rem", fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase" }}>
        Teil 2 · Writing support video
      </span>
      <strong style={{ fontSize: "1.05rem" }}>Watch before writing your opinion</strong>
      <p style={{ color: "#475569", lineHeight: 1.6, margin: 0 }}>
        Use the video to review the writing task, structure and useful expressions. Then write your own answer and submit it in the Submit tab.
      </p>
    </div>
    <div style={{ aspectRatio: "16 / 9", background: "#020617", borderRadius: 14, overflow: "hidden", position: "relative", width: "100%" }}>
      <iframe
        src="https://www.youtube-nocookie.com/embed/clZoeBjLesQ"
        title="B1 Day 19 Teil 2 Schreiben support video"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{ border: 0, height: "100%", inset: 0, position: "absolute", width: "100%" }}
      />
    </div>
    <a
      href="https://youtu.be/clZoeBjLesQ"
      target="_blank"
      rel="noreferrer"
      style={{ ...styles.linkButton, width: "fit-content" }}
    >
      Open writing video on YouTube
    </a>
  </article>
);

const interviewReadingQuestions = [
  { number: 1, stem: "Warum war Felix vor dem Gespräch sehr nervös?", options: ["a) Weil er zu spät zum Termin gekommen ist.", "b) Weil ihm die Stelle bei der Agentur sehr wichtig ist.", "c) Weil er die Personalleiterin bereits kannte."] },
  { number: 2, stem: "Was musste Felix zu Beginn des Gesprächs machen?", options: ["a) Eine Präsentation über die Agentur halten.", "b) Seinen bisherigen Werdegang und seine Erfahrungen beschreiben.", "c) Einen schriftlichen Englischtest ausfüllen."] },
  { number: 3, stem: "Welche unerwartete Situation gab es während des Gesprächs?", options: ["a) Frau Weber stellte ihm plötzlich Fragen auf Englisch.", "b) Der Abteilungsleiter musste den Raum vorzeitig verlassen.", "c) Das Gespräch wurde nach 15 Minuten abgebrochen."] },
  { number: 4, stem: "Worüber sprach Felix beim englischen Teil des Gesprächs?", options: ["a) Über seine Gehaltsvorstellungen.", "b) Über seinen Umgang mit Stress und Zeitdruck.", "c) Über seine Sprachkenntnisse in anderen Sprachen."] },
  { number: 5, stem: "Welche Fragen hat Felix am Ende des Gesprächs gestellt?", options: ["a) Nach den Urlaubstagen und dem Gehalt.", "b) Nach Arbeitszeiten und Fortbildungsangeboten.", "c) Nach den Namen der anderen Bewerber."] },
  { number: 6, stem: "Wann erfährt Felix voraussichtlich das Ergebnis der Bewerbung?", options: ["a) Noch am selben Tag per E-Mail.", "b) Bis Ende nächster Woche.", "c) Erst am 1. des nächsten Monats."] },
  { number: 7, stem: "Wie viele andere Bewerber werden diese Woche noch interviewt?", options: ["a) Keine weiteren Bewerber.", "b) Drei andere Kandidaten.", "c) Fünfzehn Personen."] },
];



const B1Day19PreservedSections = ({ activeTab, prepared, setPreparedFor }) => {
  const reading = getB1ReadingTask(19);
  const writing = getB1WritingTask(19);
  const mark = setPreparedFor;
  return (
    <>
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
          <WorkbookTaskCard eyebrow="Your assignment · Writing" title={writing.title} submissionNote={writing.submissionNote}>
            <p style={{ margin: 0 }}>{writing.instructions}</p>
          </WorkbookTaskCard>
          <WritingSupportVideo />
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
          <WorkbookTaskCard eyebrow="Your assignment · Reading" title={reading.title} submissionNote={reading.submissionNote}>
            <p style={{ margin: 0 }}>{reading.instructions}</p>
          </WorkbookTaskCard>
          <article style={box}>
            <h3 style={{ margin: 0 }}>E-Mail von Felix an seine Freundin Sarah</h3>
            <p style={{ margin: 0 }}><strong>Betreff: Mein Vorstellungsgespräch gestern – wie es gelaufen ist!</strong></p>
            <p style={{ margin: 0 }}><strong>Liebe Sarah,</strong></p>
            <p>wie du weißt, hatte ich gestern Nachmittag endlich mein Vorstellungsgespräch bei der Marketing-Agentur „MediaPlus“ in Frankfurt. Ich war vorher schrecklich nervös, weil ich die Stelle als Junior-Projektmanager unbedingt bekommen möchte.</p>
            <p>Das Gespräch hat um 14:00 Uhr begonnen und dauerte fast eine Stunde. Zuerst haben sich die Personalleiterin, Frau Weber, und der Abteilungsleiter kurz vorgestellt. Danach sollte ich meinen bisherigen Werdegang beschreiben. Zum Glück hatte ich mich gut vorbereitet und konnte flüssig erklären, welche Erfahrungen ich bereits während meines Praktikums gesammelt habe.</p>
            <p>Besonders überrascht war ich, als Frau Weber plötzlich auf Englisch wechselte. Sie wollte wissen, wie ich mit stressigen Situationen und knappen Fristen umgehe. Obwohl ich kurz ins Stocken geriet, konnte ich die Frage verständlich beantworten. Am Ende durfte ich selbst noch Fragen stellen. Ich habe nach den flexiblen Arbeitszeiten und den Weiterbildungsmöglichkeiten im Betrieb gefragt.</p>
            <p>Frau Weber meinte, dass sie diese Woche noch mit drei anderen Kandidaten sprechen werden. Bis Ende nächster Woche wollen sie mir Bescheid geben. Wenn alles klappt, könnte ich schon am 1. des nächsten Monats anfangen. Drück mir die Daumen!</p>
            <p style={{ margin: 0 }}><strong>Liebe Grüße<br />Felix</strong></p>
          </article>
          <QuestionList items={interviewReadingQuestions} />
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
    </>
  );
};

const config = {
  day: 19,
  chapter: "6.19",
  assignmentKey: "B1-6.19",
  workbookId: "B1Day19Vorstellungsgespraech",
  title: "Vorstellungsgespräch",
  subtitle: "Select Grammar, Teil 1–4, Ref or Submit. The existing Day 19 assignments are preserved inside the shared B1 workbook shell.",
  submitListening: true,
  listening: { submitRequired: true },
};

export default function B1Day19VorstellungsgespraechWorkbookPage() {
  return <B1StandardWorkbookPage config={config} renderSections={B1Day19PreservedSections} />;
}
