import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
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

const imageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const phraseGridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const lesenQuestions = [
  {
    stem: "1. Was ist ein typisches deutsches Frühstück?",
    options: ["a) Eier und Speck", "b) Brot, Brötchen, Aufschnitt, Käse und Marmelade", "c) Müsli und Joghurt", "d) Nur Kaffee"],
  },
  {
    stem: "2. Was versteht man unter Brotzeit?",
    options: ["a) Ein warmes Mittagessen", "b) Ein kaltes Abendessen", "c) Ein Snack zwischendurch", "d) Ein Dessert"],
  },
  {
    stem: "3. Welche Gerichte sind typisch für Norddeutschland?",
    options: ["a) Fischgerichte", "b) Schweinshaxe und Knödel", "c) Spätzle", "d) Quiche"],
  },
  {
    stem: "4. Welches Fest ist weltweit bekannt?",
    options: ["a) Weihnachtsmarkt", "b) Oktoberfest", "c) Karneval", "d) Erntedankfest"],
  },
  {
    stem: "5. Welche internationalen Einflüsse findet man in der deutschen Küche?",
    options: ["a) Nur traditionelle deutsche Gerichte", "b) Gerichte aus aller Welt", "c) Nur europäische Gerichte", "d) Nur asiatische Gerichte"],
  },
  {
    stem: "6. Was sind zwei bekannte deutsche Gerichte?",
    options: ["a) Pizza und Pasta", "b) Sushi und Ramen", "c) Sauerkraut und Bratwurst", "d) Tacos und Burritos"],
  },
  {
    stem: "7. Welche Rolle spielen Feste und Märkte in der deutschen Esskultur?",
    options: ["a) Eine zentrale Rolle", "b) Keine Rolle", "c) Eine kleine Rolle", "d) Nur im Sommer"],
  },
];

const hoerenQuestions = [
  {
    stem: "1. An welchem Tag besuchen Anna und Paul den Wochenmarkt?",
    options: ["a) Montag", "b) Samstag", "c) Sonntag", "d) Freitag"],
  },
  {
    stem: "2. Was kauft Anna auf dem Markt?",
    options: ["a) Käse", "b) Obst und Gemüse", "c) Brot", "d) Fisch"],
  },
  {
    stem: "3. Welche Zutat hat Paul gekauft, um einen Caprese-Salat zu machen?",
    options: ["a) Tomaten", "b) Mozzarella", "c) Zucchini", "d) Rucola"],
  },
  {
    stem: "4. Was machen Anna und Paul nach dem Einkaufen?",
    options: ["a) Sie gehen nach Hause.", "b) Sie gehen in ein Café.", "c) Sie kochen sofort das Essen.", "d) Sie besuchen Freunde."],
  },
  {
    stem: "5. Was ist das Lieblingsessen von Anna?",
    options: ["a) Gemüselasagne", "b) Caprese-Salat", "c) Pizza", "d) Kartoffelsalat"],
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

const A2Day8RezepteUndEssenWorkbookPage = () => {
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
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 8 Workbook · Rezepte und Essen (Exercise) 3.8</h1>
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
            ariaLabel="A2 Day 8 workbook sections"
          />
        </div>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80"
            alt="Fresh ingredients arranged for cooking practice"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <SpeakingMindMap config={getA2SpeakingMindMap(8)} />
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Practise speaking about recipes, food, ingredients, meals, restaurants and cooking steps.
          </p>

          <h3 style={sectionTitle}>Useful ideas for your mind map</h3>
          <ul style={listSpacing}>
            <li><strong>Zutaten:</strong> Obst, Gemüse, Gewürze, Fleisch, Fisch, Reis, Nudeln.</li>
            <li><strong>Kochmethoden:</strong> kochen, backen, braten, grillen, mischen, schneiden.</li>
            <li><strong>Küchengeräte:</strong> Messer, Topf, Pfanne, Schüssel, Backofen.</li>
            <li><strong>Mahlzeiten:</strong> Frühstück, Mittagessen, Abendessen, Zwischenmahlzeit.</li>
            <li><strong>Typische Gerichte:</strong> Bratwurst, Sauerkraut, Pizza, Pasta, Curry, Jollof-Reis.</li>
          </ul>

          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <div style={phraseGridStyle}>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Einleitungen</strong>
              <ul style={listSpacing}>
                <li>„Heute spreche ich über mein Lieblingsessen.“</li>
                <li>„In meiner Präsentation geht es um …“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Connectors</strong>
              <ul style={listSpacing}>
                <li>zuerst · dann · am Ende</li>
                <li>und · oder · weil · deshalb</li>
              </ul>
            </div>
          </div>

          <SpeakingPracticeTimerCard />
          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner preparing a restaurant reservation email"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Situation:</strong> Sie möchten einen Tisch in einem Restaurant reservieren. Schreiben Sie eine E-Mail an das Restaurant.
          </p>
          <ol style={listSpacing}>
            <li>Fragen Sie nach einem freien Tisch.</li>
            <li>Geben Sie Datum, Uhrzeit und Anzahl der Personen an.</li>
            <li>Fragen Sie nach dem Menü und den Preisen.</li>
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
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
            alt="Traditional German dishes on a dining table"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 · Lesen</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Submit answers through the Submit tab.
          </p>
          <h3 style={sectionTitle}>Die Vielfalt der deutschen Küche</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Die deutsche Küche ist vielfältig und regional unterschiedlich. In Norddeutschland sind Fischgerichte sehr beliebt, während im Süden Deutschlands deftige Speisen wie Schweinshaxe und Knödel auf den Tisch kommen. Ein typisches deutsches Frühstück besteht aus Brot, Brötchen, Aufschnitt, Käse und Marmelade. Zu den bekanntesten Gerichten zählen Sauerkraut, Bratwurst und Spätzle. Internationale Küche findet man heute auch in vielen deutschen Städten.
          </p>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
            alt="People enjoying food and conversation in a restaurant"
            loading="lazy"
            style={imageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 · Hören</h2>
          <p style={{ margin: 0 }}>
            Listen carefully and submit your final answer letters through the Submit tab if required by your tutor.
          </p>
          <iframe
            title="Teil 4 Hören: Rezepte und Essen"
            src="https://www.youtube.com/embed/Y6G1TTSQyKA"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={videoPreviewStyle}
          />
          <QuestionList questions={hoerenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{ title: "A2Day8RezepteUndEssen", level: "A2", day: 8, workbookId: "A2Day8RezepteUndEssen" }}
          workbookId="A2Day8RezepteUndEssen"
        />
      )}

      {activeTab === "submit" && (
        <div style={card}>
          <h2 style={sectionTitle}>Submit Workbook</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Submit your required answers for A2 Day 8 here. Include your writing text and your reading/listening answer letters if required by your tutor.
          </p>
          <WorkbookSubmissionReminder />
          <div className="a2-day8-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.a2-day8-submission-page > div > section:first-child { display: none !important; }
            .a2-day8-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day: 8,
                assignmentKey: "A2-3.8",
                canonicalAssignmentKey: "A2-3.8",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default A2Day8RezepteUndEssenWorkbookPage;
