import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
} from "./StandardWorkbookComponents";

const tabs = STANDARD_WORKBOOK_TABS;

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listSpacing = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const calloutStyle = {
  ...questionCardStyle,
  background: "#f8fafc",
};

const imageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const lesenQuestions = [
  {
    stem: "1. Was kann man in Bibliotheken machen?",
    options: [
      "a) Nur Bücher kaufen",
      "b) Musik hören, Bücher lesen, Filme sehen oder ausleihen",
      "c) Nur CDs anhören",
      "d) Nur Filme anschauen",
    ],
  },
  {
    stem: "2. Wo kann man Sprach- oder Tanzkurse machen?",
    options: ["a) Im Supermarkt", "b) In der Stadtverwaltung", "c) An der Volkshochschule", "d) Im Museum"],
  },
  {
    stem: "3. Was machen Menschen in Vereinen?",
    options: ["a) Sie wohnen zusammen.", "b) Sie arbeiten dort.", "c) Sie treffen sich, weil sie gemeinsame Interessen haben.", "d) Sie lernen Deutsch."],
  },
  {
    stem: "4. Wo kann man besondere Pflanzen sehen?",
    options: ["a) Im Kino", "b) Im Zoo", "c) Im botanischen Garten", "d) Im Supermarkt"],
  },
  {
    stem: "5. Was ist normalerweise kostenlos?",
    options: ["a) Der Eintritt in Zoos", "b) Der Besuch von Parks und Spielplätzen", "c) Der Fernseher zu Hause", "d) Die Internetverbindung"],
  },
  {
    stem: "6. Wie viel kostet die monatliche Gebühr für Fernsehen und Radio?",
    options: ["a) 7,98 Euro", "b) 10,50 Euro", "c) 17,98 Euro", "d) Es ist immer kostenlos"],
  },
  {
    stem: "7. Wo findet man Informationen zum Grillen auf dem Balkon?",
    options: ["a) In der Schule", "b) In der Zeitung", "c) In der Hausordnung", "d) Im Fernseher"],
  },
];

const hoerenQuestions = [
  {
    stem: "1. Wohin ist Anna im letzten Sommerurlaub gereist?",
    options: ["a) Italien", "b) Griechenland", "c) Spanien"],
  },
  {
    stem: "2. Wie lange blieb Anna auf Kreta?",
    options: ["a) Eine Woche", "b) Zwei Wochen", "c) Drei Tage"],
  },
  {
    stem: "3. Was hat Anna besonders gut gefallen?",
    options: ["a) Die Altstadt von Chania", "b) Der Strand von Elafonissi", "c) Die Berge"],
  },
  {
    stem: "4. Was haben Anna und ihre Freunde am letzten Tag gemacht?",
    options: ["a) Eine Wanderung", "b) Eine Bootstour", "c) Einen Museumsbesuch"],
  },
  {
    stem: "5. Was hofft Anna bald wieder zu tun?",
    options: ["a) Nach Kreta zu reisen", "b) Nach Italien zu reisen", "c) Nach Spanien zu reisen"],
  },
];

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question) => (
      <div key={question.stem} style={questionCardStyle}>
        <strong>{question.stem}</strong>
        {question.options.map((option) => (
          <span key={option}>{option}</span>
        ))}
      </div>
    ))}
  </div>
);

const A2Day9UrlaubWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 9 Workbook · Urlaub 4.9</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4, Ref or Submit below. The tabs stay visible at the top of the workbook.
        </p>
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            padding: 10,
            margin: "0 -4px",
            border: "1px solid #bfdbfe",
            borderRadius: 14,
            background: "rgba(255,255,255,0.98)",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
          }}
        >
          <WorkbookTabNav
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={tabs}
            ariaLabel="A2 Day 9 workbook sections"
          />
        </div>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
            alt="Sunny beach destination for vacation speaking practice"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <SpeakingMindMap config={getA2SpeakingMindMap(9)} />
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Practise speaking about vacation plans, travel destinations, transport, accommodation and activities.
          </p>

          <div style={calloutStyle}>
            <strong>Sprechen wie bei einer Mini-Präsentation</strong>
            <ol style={listSpacing}>
              <li><strong>Einleitung:</strong> Sage kurz, worüber du sprichst.</li>
              <li><strong>Hauptteil:</strong> Nenne Reiseziel, Verkehrsmittel, Unterkunft und Aktivitäten.</li>
              <li><strong>Beispiel:</strong> Gib ein Beispiel aus einem Urlaub oder deinem Plan.</li>
              <li><strong>Schluss:</strong> Beende deinen Beitrag mit einem klaren letzten Satz.</li>
            </ol>
          </div>

          <h3 style={sectionTitle}>Useful vocabulary</h3>
          <ul style={listSpacing}>
            <li><strong>Reiseziele:</strong> Stadt, Strand, Berge, See, Land, Nationalpark.</li>
            <li><strong>Transportmittel:</strong> Auto, Zug, Flugzeug, Bus, Boot.</li>
            <li><strong>Unterkunft:</strong> Hotel, Ferienwohnung, Jugendherberge, Campingplatz.</li>
            <li><strong>Aktivitäten:</strong> wandern, schwimmen, besichtigen, lokale Spezialitäten essen.</li>
          </ul>

          <SpeakingPracticeTimerCard />
          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
            alt="Traveler planning a hotel booking email before vacation"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Situation:</strong> Sie planen einen Urlaub und möchten eine Unterkunft reservieren. Schreiben Sie eine E-Mail an ein Hotel.
          </p>
          <ol style={listSpacing}>
            <li>Fragen Sie nach einem freien Zimmer.</li>
            <li>Geben Sie Datum, Anzahl der Personen und Art des Zimmers an.</li>
            <li>Fragen Sie nach Preisen und zusätzlichen Leistungen wie Frühstück oder Internetzugang.</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>Submit your final writing through the Submit tab on this workbook.</p>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1600&q=80"
            alt="Traveler reading cultural information while planning leisure activities"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 · Lesen</h2>
          <p style={{ margin: 0 }}>
            Read the text carefully. <strong>Do not answer directly on this page.</strong> Submit answers through the Submit tab.
          </p>
          <h3 style={sectionTitle}>Kultur und Freizeit in Deutschland</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In den meisten Städten gibt es Museen, Kinos, Theater und Konzertveranstaltungen. In Bibliotheken kann man Bücher lesen, Musik hören, Filme sehen oder ausleihen. An Volkshochschulen gibt es Kurse für Erwachsene, zum Beispiel Sprachkurse, Tanzkurse oder Sportkurse. In Parks und botanischen Gärten kann man draußen Zeit verbringen. Zu Hause sehen viele Leute fern oder hören Radio. Informationen zu Regeln wie Grillen auf dem Balkon findet man oft in der Hausordnung.
          </p>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
            alt="Traveler listening to vacation audio practice while planning a trip"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 · Hören</h2>
          <p style={{ margin: 0 }}>
            Listen carefully and submit your final answer letters through the Submit tab if required by your tutor.
          </p>
          <CoursebookAudioPlayer
            url="https://drive.google.com/file/d/1vRaCrQl4QtmYwT8K04JM_A2srofY_d84/view?usp=sharing"
            linkLabel="Open listening audio"
          />
          <QuestionList questions={hoerenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{ title: "A2Day9Urlaub", level: "A2", day: 9, workbookId: "A2Day9Urlaub" }}
          workbookId="A2Day9Urlaub"
        />
      )}

      {activeTab === "submit" && (
        <div style={card}>
          <h2 style={sectionTitle}>Submit Workbook</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Submit your required answers for A2 Day 9 here. Include your writing text and your reading/listening answer letters if required by your tutor.
          </p>
          <WorkbookSubmissionReminder />
          <div className="a2-day9-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.a2-day9-submission-page > div > section:first-child { display: none !important; }
            .a2-day9-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day: 9,
                assignmentKey: "A2-4.9",
                canonicalAssignmentKey: "A2-4.9",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default A2Day9UrlaubWorkbookPage;
