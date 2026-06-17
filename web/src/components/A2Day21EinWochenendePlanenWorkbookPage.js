import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "5. Ref" },
];

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

const phraseGridStyle = { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" };

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

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.secondaryButton,
        borderColor: active ? "#2563eb" : "#d1d5db",
        background: active ? "#eff6ff" : "#fff",
        color: active ? "#1d4ed8" : "#111827",
      }}
    >
      {children}
    </button>
  );
}

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const A2Day21EinWochenendePlanenWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 21 Workbook · Ein Wochenende planen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>4-part workbook: group speaking, writing, reading and listening practice.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}
        </p>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (
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
              <li>Sport treiben: joggen, schwimmen, Fußball spielen (doing sports: jogging, swimming, playing football/soccer)</li>
              <li>Kreativ sein: malen, basteln, ein Instrument spielen (being creative: painting, crafting, playing an instrument)</li>
              <li>Entspannen: ein Buch lesen, Musik hören, Netflix schauen (relaxing: reading a book, listening to music, watching Netflix)</li>
              <li>Computer- oder Videospiele spielen (playing computer or video games)</li>
            </ul>
          </div>

          <div style={questionBoxStyle}>
            <strong>Hauptzweig 2: Reise oder Ausflug</strong>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>Tagesausflug: in die Berge, an den See, in den Freizeitpark (day trip: to the mountains, to the lake, to an amusement park)</li>
              <li>Städtetrip: nach Berlin, Köln oder in eine andere Stadt (city trip: to Berlin, Cologne, or another city)</li>
              <li>Wandern oder Radfahren: im Wald, am Fluss (hiking or cycling: in the forest, by the river)</li>
              <li>Kulturelle Unternehmungen: Museum, Theater, Konzert (cultural activities: museum, theater, concert)</li>
            </ul>
          </div>

          <div style={questionBoxStyle}>
            <strong>Hauptzweig 3: Haushalt und Erledigungen</strong>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>Hausputz: Staubsaugen, Bad putzen, Wäsche waschen (house cleaning: vacuuming, cleaning the bathroom, doing laundry)</li>
              <li>Einkaufen: Lebensmittel einkaufen, Kleidung shoppen (shopping: buying groceries, shopping for clothes)</li>
              <li>Reparaturen: etwas im Haus oder Garten reparieren (repairs: fixing something in the house or garden)</li>
              <li>Post und Bank: Briefe abschicken, Bankgeschäfte erledigen (post and bank: sending letters, doing banking tasks)</li>
            </ul>
          </div>

          <div style={questionBoxStyle}>
            <strong>Hauptzweig 4: Freunde und Familie</strong>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>Treffen mit Freunden: gemeinsam kochen, ins Kino gehen, Spieleabend (meeting friends: cooking together, going to the cinema, game night)</li>
              <li>Familienzeit: Eltern oder Großeltern besuchen, Familienessen (family time: visiting parents or grandparents, family meal)</li>
              <li>Gemeinsame Aktivitäten: Grillen, Picknick, Ausflüge (shared activities: barbecuing, picnic, outings)</li>
              <li>Feiern: Geburtstag, Jubiläum, andere Feste (celebrations: birthday, anniversary, other parties/festivals)</li>
            </ul>
          </div>

          <div style={questionBoxStyle}>
            <strong>Hauptzweig 5: Ausdrücke und Fragen</strong>
            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>Was machst du am Wochenende? (What are you doing at the weekend?)</li>
              <li>Hast du schon Pläne? (Do you already have plans?)</li>
              <li>Ich freue mich auf ... (I am looking forward to ...)</li>
              <li>Ich habe leider keine Zeit. (Unfortunately, I do not have time.)</li>
              <li>Ich möchte mich erholen. (I want to rest/recover.)</li>
              <li>Wollen wir etwas zusammen unternehmen? (Shall we do something together?)</li>
            </ul>
          </div>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Zusatz:</strong> Nutzt die Stichwörter <em>Freizeit</em>, <em>Treffen</em>, <em>Samstag</em> und <em>Sonntag</em>.
            Erzählt danach von eurem Wochenendprogramm.
          </p>

          <h3 style={{ margin: 0 }}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nutze diese einfache Struktur: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
            So wird aus kurzen Wörtern eine klare Antwort mit guten Sätzen.
          </p>
          <div style={{ ...questionBoxStyle, background: "#ecfeff" }}>
            <strong>Schnelle Struktur für 30–45 Sekunden</strong>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li><strong>Einleitung:</strong> Thema nennen und einen ersten Satz sagen.</li>
              <li><strong>Hauptteil:</strong> zwei oder drei Punkte mit einfachen Connectors verbinden.</li>
              <li><strong>Beispiel:</strong> ein kurzes Beispiel aus deinem Leben geben.</li>
              <li><strong>Schluss:</strong> deine Meinung kurz zusammenfassen.</li>
            </ol>
          </div>
          <div style={phraseGridStyle}>
            <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
              <strong>Gute Einleitungen</strong>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                <li>„Heute spreche ich über …“</li>
                <li>„Ich möchte kurz etwas über … sagen.“</li>
                <li>„Mein Thema ist …“</li>
              </ul>
            </div>
            <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
              <strong>Verbindungswörter / Connectors</strong>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                <li><strong>und</strong> · „Ich lerne Deutsch und ich übe jeden Tag.“</li>
                <li><strong>oder</strong> · „Ich mache Sport oder ich treffe Freunde.“</li>
                <li><strong>weil</strong> · „Das ist gut, weil es einfach ist.“</li>
                <li><strong>deshalb</strong> · „Ich habe wenig Zeit, deshalb plane ich gut.“</li>
              </ul>
            </div>
            <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
              <strong>Eigene Meinung ausdrücken</strong>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                <li>„Ich finde … gut, weil …“</li>
                <li>„Für mich ist … wichtig.“</li>
                <li>„Meiner Meinung nach ist … praktisch.“</li>
              </ul>
            </div>
            <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
              <strong>Gute Schlüsse</strong>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                <li>„Zum Schluss kann ich sagen: …“</li>
                <li>„Deshalb finde ich … gut.“</li>
                <li>„Das ist meine Meinung. Danke fürs Zuhören.“</li>
              </ul>
            </div>
          </div>

          <SpeakingPracticeTimerCard storageKey="a2-day21-sprechen-group-practice" />

          <div style={{ ...questionBoxStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute spreche ich über meine Wochenendplanung. Am Samstag möchte ich ausschlafen und einkaufen gehen, weil ich unter der Woche wenig Zeit habe. Dann treffe ich Freunde oder mache Sport. Am Sonntag bleibe ich gern zu Hause und lerne Deutsch. Zum Beispiel wiederhole ich neue Wörter und schreibe eine kurze E-Mail. Zum Schluss finde ich: Ein gutes Wochenende hat Ruhe, Freunde und ein bisschen Vorbereitung für Montag.“
            </p>
          </div>
          <CourseInlinePracticePanel
            type="speaking"
          />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
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

          <CourseInlinePracticePanel
            type="writing"
          />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
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

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
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

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}

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

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="A2" lesson={{ title: "A2Day21EinWochenendePlanen", level: "A2", workbookId: "A2Day21EinWochenendePlanen" }} workbookId="A2Day21EinWochenendePlanen" />
      )}

    </div>
  );
};

export default A2Day21EinWochenendePlanenWorkbookPage;
