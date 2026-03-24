import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

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

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "1. Was ist ein typisches deutsches Frühstück?",
    options: ["a) Eier und Speck", "b) Brot, Brötchen, Aufschnitt, Käse und Marmelade", "c) Müsli und Joghurt", "d) Nur Kaffee"],
  },
  {
    stem: "2. Was versteht man unter \"Brotzeit\"?",
    options: ["a) Ein warmes Mittagessen", "b) Ein kaltes Abendessen", "c) Ein Snack zwischendurch", "d) Ein Dessert"],
  },
  {
    stem: "3. Welche Gerichte sind typisch für Norddeutschland?",
    options: ["a) Fischgerichte", "b) Schweinshaxe und Knödel", "c) Spätzle", "d) Quiche"],
  },
  {
    stem: "4. Welches Fest ist weltweit bekannt und zieht jedes Jahr Millionen von Besuchern an?",
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

const A2Day8RezepteUndEssenWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [teacherMode, setTeacherMode] = useState(false);
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
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 8 Workbook · Rezepte und Essen (Exercise) 3.8</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: group speaking, writing, reading, and listening practice focused on recipes and food culture.
        </p>

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

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80"
            alt="Fresh ingredients arranged for cooking practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Instructions</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Central Topic:</strong> Write <strong>"Rezepte und Essen"</strong> in the center of your brain map.
            </li>
            <li>
              <strong>Main Branches:</strong> Create five main branches from the central topic:
              <ul style={listSpacing}>
                <li>Zutaten (Ingredients)</li>
                <li>Kochmethoden (Cooking Methods)</li>
                <li>Küchengeräte (Kitchen Tools)</li>
                <li>Mahlzeiten (Meals)</li>
                <li>Typische Gerichte (Typical Dishes)</li>
              </ul>
            </li>
            <li>
              <strong>Sub-Branches:</strong> Expand each branch with examples and phrases.
            </li>
          </ol>

          <h3 style={sectionTitle}>Example Ideas for Your Brain Map</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Zutaten (Ingredients)</strong>
              <ul style={listSpacing}>
                <li>Obst: Äpfel, Bananen, Orangen</li>
                <li>Gemüse: Karotten, Tomaten, Kartoffeln</li>
                <li>Gewürze: Salz, Pfeffer, Paprika</li>
                <li>Milchprodukte: Milch, Käse, Butter</li>
                <li>Fleisch und Fisch: Hähnchen, Rindfleisch, Lachs</li>
                <li>Kohlenhydrate: Reis, Nudeln, Brot</li>
              </ul>
            </li>
            <li>
              <strong>Kochmethoden (Cooking Methods)</strong>
              <ul style={listSpacing}>
                <li>Kochen (Boiling)</li>
                <li>Backen (Baking)</li>
                <li>Braten (Frying)</li>
                <li>Grillen (Grilling)</li>
                <li>Dünsten (Steaming)</li>
                <li>Mischen (Mixing)</li>
              </ul>
            </li>
            <li>
              <strong>Küchengeräte (Kitchen Tools)</strong>
              <ul style={listSpacing}>
                <li>Messer (Knife)</li>
                <li>Topf (Pot)</li>
                <li>Pfanne (Pan)</li>
                <li>Schüssel (Bowl)</li>
                <li>Küchenwaage (Kitchen scale)</li>
                <li>Backofen (Oven)</li>
              </ul>
            </li>
            <li>
              <strong>Mahlzeiten (Meals)</strong>
              <ul style={listSpacing}>
                <li>Frühstück: Brot, Marmelade, Kaffee</li>
                <li>Mittagessen: Suppe, Hauptgericht, Dessert</li>
                <li>Abendessen: Salat, Sandwiches, Tee</li>
                <li>Zwischenmahlzeit: Obst, Joghurt, Kekse</li>
              </ul>
            </li>
            <li>
              <strong>Typische Gerichte (Typical Dishes)</strong>
              <ul style={listSpacing}>
                <li>Deutschland: Bratwurst, Sauerkraut, Brezel</li>
                <li>Italien: Pizza, Pasta</li>
                <li>Frankreich: Quiche, Croissant</li>
                <li>Internationale Küche: Sushi, Curry, Tacos</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Final Task</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Create a Recipe:</strong> Write a simple recipe using your brain map. Include dish name, ingredients, and
              cooking steps.
            </li>
            <li>
              <strong>Short Dialogue:</strong> Imagine you are in a restaurant. Write a dialogue between you and the waiter using
              phrases like: <em>Was empfehlen Sie?</em>, <em>Ich hätte gern ...</em>, <em>Ist das Gericht vegetarisch?</em>, and <em>Die Rechnung bitte.</em>
            </li>
          </ol>

          <h3 style={sectionTitle}>Group Discussion Questions</h3>
          <p style={{ margin: 0 }}>Was isst du gern und wie bereitest du es zu?</p>
          <ul style={listSpacing}>
            <li>Zutaten</li>
            <li>Kochen</li>
            <li>Restaurant</li>
            <li>Mahlzeit</li>
          </ul>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Open speaking self-practice
            </a>
          </div>
          <SpeakingPracticeTimerCard />

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner preparing a formal restaurant reservation email"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Writing Task: Formal Letter to a Restaurant (A2)</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>Situation: Sie möchten einen Tisch in einem Restaurant reservieren.</p>
          <p style={{ margin: 0 }}>Schreiben Sie eine E-Mail an das Restaurant:</p>
          <ol style={listSpacing}>
            <li>Fragen Sie nach einem freien Tisch.</li>
            <li>Geben Sie an, was für Sie wichtig ist (z. B. Datum, Uhrzeit, Anzahl der Personen).</li>
            <li>Fragen Sie nach dem Menü und den Preisen.</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <p style={{ margin: 0 }}>
            Practice your draft before submission on the writing page: {" "}
            <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
              Open Writing Practice
            </a>{" "}
            (you can use the Ideas Generator there for support).
          </p>
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
            alt="Traditional German dishes on a dining table"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at
            the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Die Vielfalt der Deutschen Küche</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Die deutsche Küche ist vielfältig und regional unterschiedlich. In Norddeutschland sind Fischgerichte sehr beliebt,
            während im Süden Deutschlands eher deftige Speisen wie Schweinshaxe und Knödel auf den Tisch kommen. Ein
            typisches deutsches Frühstück besteht aus Brot, Brötchen, Aufschnitt, Käse und Marmelade. Zum Mittagessen gibt es
            oft eine warme Mahlzeit, und am Abend wird häufig kalt gegessen – Brotzeit nennt man das.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Zu den bekanntesten deutschen Gerichten zählen Sauerkraut, Bratwurst und Spätzle. Auch regionale Spezialitäten wie
            der Schwarzwälder Schinken oder der Bayerische Leberkäse sind sehr beliebt. In den letzten Jahren hat die
            internationale Küche auch in Deutschland an Bedeutung gewonnen, und man findet Restaurants aus aller Welt.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ein weiterer wichtiger Bestandteil der deutschen Esskultur sind die vielen Feste und Märkte, bei denen Essen und
            Trinken eine zentrale Rolle spielen. Das Oktoberfest in München ist weltweit bekannt und zieht jedes Jahr Millionen
            von Besuchern an. Auch Weihnachtsmärkte mit ihren zahlreichen kulinarischen Angeboten sind sehr beliebt.
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {lesenQuestions.map((question) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
            alt="People enjoying food and conversation in a restaurant"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Listen carefully and answer the questions in your assignment submission area, not directly on this page.
          </p>

          <p style={{ margin: 0 }}>
            <strong>Audio Link:</strong>{" "}
            <a
              href="https://drive.google.com/file/d/1oPqOjmHtocxUZFRfuhi-pUZKgFZy-kyQ/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Open listening audio
            </a>
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {hoerenQuestions.map((question) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Transcript (Teacher Mode)</strong>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Anna und Paul besuchen am Samstag den Wochenmarkt. Anna kauft Obst und Gemüse. Paul hat unter anderem
                Mozzarella gekauft, weil er einen Caprese-Salat zubereiten möchte. Nach dem Einkaufen gehen sie in ein Café und
                sprechen über ihre Lieblingsgerichte. Anna erzählt, dass sie Gemüselasagne am liebsten mag.
              </p>
            </div>
          )}

          <h3 style={sectionTitle}>Recommended Video</h3>
          <ul style={listSpacing}>
            <li>
              Deutschlandlabor - Folge 15: Bio: {" "}
              <a href="https://www.youtube.com/watch?v=IyMgjkY0LgU" target="_blank" rel="noreferrer">
                https://www.youtube.com/watch?v=IyMgjkY0LgU
              </a>
            </li>
            <li>
              Das Deutschlandlabor – Folge 19: Wurst: {" "}
              <a href="https://www.youtube.com/watch?v=eATxA-wj66A" target="_blank" rel="noreferrer">
                https://www.youtube.com/watch?v=eATxA-wj66A
              </a>
            </li>
            <li>
              Deutschlandlabor - Folge 20: Bier: {" "}
              <a href="https://www.youtube.com/watch?v=95cup2iq9E0" target="_blank" rel="noreferrer">
                https://www.youtube.com/watch?v=95cup2iq9E0
              </a>
            </li>
          </ul>
          <iframe
            title="Deutschlandlabor Folge 15: Bio"
            src="https://www.youtube.com/embed/IyMgjkY0LgU"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={videoPreviewStyle}
          />

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day8RezepteUndEssenWorkbookPage;
