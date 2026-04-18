import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const imageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 280,
  objectFit: "cover",
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 8,
  background: "#fff",
};

const readingQuestions = [
  {
    stem: '1. Die Gäste im "Bremer Lokal" ...',
    options: ["a) finden immer einen Tisch.", "b) müssen anrufen und Essen bestellen.", "c) sollen Plätze reservieren."],
  },
  {
    stem: "2. Stefan Berger möchte ...",
    options: ["a) ein neues Restaurant eröffnen.", "b) mit seinem Restaurant mehr Geld verdienen.", "c) nur ein Restaurant haben."],
  },
  {
    stem: "3. Sofort nach der Ausbildung ...",
    options: ["a) arbeitete er in einem großen Hotel.", "b) kaufte er ein Restaurant.", "c) machte er eine lange Reise."],
  },
  {
    stem: "4. Stefan Berger ist bekannt durch ...",
    options: ["a) eine Fernsehsendung.", "b) Lieder und Filme.", "c) sein Restaurant."],
  },
  {
    stem: "5. Dieser Text informiert über ...",
    options: ["a) den Berufsweg eines Kochs.", "b) einen Koch in einem Hotel.", "c) eine neue Berufsausbildung."],
  },
];

const A2Day21EinWochenendePlanenWorkbookPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 21 Workbook · Ein Wochenende planen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 8.21</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete all parts on this page, then submit your final answers in the submission area, not directly on this
          page.
        </p>
      </div>

      <section style={sectionStyle}>
        <img
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80"
          alt="Friends planning weekend activities together using notes and a calendar"
          loading="lazy"
          style={imageStyle}
        />
        <h2 style={{ margin: 0 }}>Teil 1 (Sprechen) · Group Practice</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Ein Wochenende planen</strong></p>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Instructions</strong></p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>Schreibt „Wochenende“ in die Mitte eurer Brain-Map.</li>
          <li>Erstellt fünf Hauptzweige und ergänzt passende Unterzweige mit Beispielen und Redemitteln.</li>
        </ol>

        <div style={questionBoxStyle}>
          <strong>Hauptzweig 1: Freizeitaktivitäten</strong>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Sport treiben: joggen, schwimmen, Fußball spielen</li>
            <li>Kreativ sein: malen, basteln, ein Instrument spielen</li>
            <li>Entspannen: ein Buch lesen, Musik hören, Netflix schauen</li>
            <li>Computer- oder Videospiele spielen</li>
          </ul>
        </div>

        <div style={questionBoxStyle}>
          <strong>Hauptzweig 2: Reise oder Ausflug</strong>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Tagesausflug: in die Berge, an den See, in den Freizeitpark</li>
            <li>Städtetrip: nach Berlin, Köln oder in eine andere Stadt</li>
            <li>Wandern oder Radfahren: im Wald, am Fluss</li>
            <li>Kulturelle Unternehmungen: Museum, Theater, Konzert</li>
          </ul>
        </div>

        <div style={questionBoxStyle}>
          <strong>Hauptzweig 3: Haushalt und Erledigungen</strong>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Hausputz: Staubsaugen, Bad putzen, Wäsche waschen</li>
            <li>Einkaufen: Lebensmittel einkaufen, Kleidung shoppen</li>
            <li>Reparaturen: etwas im Haus oder Garten reparieren</li>
            <li>Post und Bank: Briefe abschicken, Bankgeschäfte erledigen</li>
          </ul>
        </div>

        <div style={questionBoxStyle}>
          <strong>Hauptzweig 4: Freunde und Familie</strong>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Treffen mit Freunden: gemeinsam kochen, ins Kino gehen, Spieleabend</li>
            <li>Familienzeit: Eltern oder Großeltern besuchen, Familienessen</li>
            <li>Gemeinsame Aktivitäten: Grillen, Picknick, Ausflüge</li>
            <li>Feiern: Geburtstag, Jubiläum, andere Feste</li>
          </ul>
        </div>

        <div style={questionBoxStyle}>
          <strong>Hauptzweig 5: Ausdrücke und Fragen</strong>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Was machst du am Wochenende?</li>
            <li>Hast du schon Pläne?</li>
            <li>Ich freue mich auf ...</li>
            <li>Ich habe leider keine Zeit.</li>
            <li>Ich möchte mich erholen.</li>
            <li>Wollen wir etwas zusammen unternehmen?</li>
          </ul>
        </div>

        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Zusatz:</strong> Nutzt die Stichwörter <em>Freizeit</em>, <em>Treffen</em>, <em>Samstag</em> und <em>Sonntag</em>.
          Erzählt danach von eurem Wochenendprogramm.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 (Schreiben)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Schreiben Sie einen Brief an einen Freund oder eine Freundin, in dem Sie ihn oder sie zu einem gemeinsamen
          Wochenende einladen.
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>
            Beschreiben Sie Ihre Wochenendpläne und erklären Sie, warum sie besonders sind (z. B. was Sie vorhaben und
            worauf Sie sich freuen).
          </li>
          <li>
            Laden Sie die Person ein, mit Ihnen zu kommen, und nennen Sie wichtige Details (Datum, Ort, Treffpunkt,
            Dauer).
          </li>
          <li>
            Erklären Sie, was die Person mitbringen sollte oder was sie erwarten kann (Kleidung, Essen, Ausrüstung,
            Aktivitäten).
          </li>
        </ol>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 (Lesen)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          <strong>Der TV-Koch Stefan Berger</strong><br />
          „Ich versuche immer wieder etwas Neues.“
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Bei Stefan Berger gibt es Gerichte, von denen man vorher noch nie gehört hat. Er hat dauernd neue Ideen. Den
          Gästen gefällt das. Man muss unbedingt vorher anrufen und einen der wenigen Tische bestellen, wenn man in
          seinem Restaurant „Bremer Lokal“ essen möchte. Er hat viele Gäste, will aber kein zweites Lokal aufmachen.
          „Klar, ich könnte vielleicht reich damit werden, aber ich habe mich bewusst dagegen entschieden. Ich mag es
          einfach, wie wir hier arbeiten.“
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Stefan Berger wurde 1968 im Rheinland geboren, war auf der Realschule und lernte dann in einem großen Hotel
          kochen. Nach der Berufsausbildung brauchte er erstmal eine zweijährige Pause. Er fuhr durch die Welt, hatte
          verschiedene Jobs und lernte viel Neues kennen. Wegen einer Frau kam er dann nach Bremen. Das „Bremer Lokal“
          in seiner Nachbarschaft suchte einen Koch, Berger nahm die Stelle an, und drei Jahre später kaufte er das
          Restaurant.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Die meisten kennen ihn aber erst durch seine Fernsehshow „Berger kocht“. In der beliebten Sendung besuchen
          ihn Sänger und Schauspieler und kochen mit ihm ihre Lieblingsrezepte.
        </p>

        <h3 style={{ margin: 0 }}>Leseverstehen – Multiple-Choice (Einfachauswahl)</h3>
        {readingQuestions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Teil 4 (Hören)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Please note that this is a Goethe-standard Hören test and the answers are already provided in the YouTube
          video. You are responsible for checking your own answers.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          The only parts that will be officially evaluated by the school are Lesen and Schreiben. You must mark your own
          Hören results. This process will require motivation and self-discipline to be effective.
        </p>
        <a
          href="https://youtu.be/Qg0tQFveI0M"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Open Hören Video
        </a>
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          Finished the workbook? Submit all final answers in the submission area.
        </p>
        <a
          href="https://www.falowen.app/campus/submit"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
        >
          Submit Workbook Answers
        </a>
      </div>
    </div>
  );
};

export default A2Day21EinWochenendePlanenWorkbookPage;
