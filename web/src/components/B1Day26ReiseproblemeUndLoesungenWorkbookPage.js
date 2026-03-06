import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

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

const tabImageStyle = {
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

const lesenQuestions = [
  {
    stem: "Welches Bundesland ist bekannt für seine Strände an der Ostsee?",
    options: [
      "A) Bayern",
      "B) Mecklenburg-Vorpommern",
      "C) Baden-Württemberg",
      "D) Hessen",
    ],
  },
  {
    stem: "Was ist ein bekanntes Ziel in Bayern für Wanderer und Wintersportler?",
    options: [
      "A) Die Zugspitze",
      "B) Der Bodensee",
      "C) Der Watzmann",
      "D) Das Brandenburger Tor",
    ],
  },
  {
    stem: "Welche Inseln gehören zur Ostsee in Mecklenburg-Vorpommern?",
    options: [
      "A) Rügen und Usedom",
      "B) Sylt und Föhr",
      "C) Mallorca und Ibiza",
      "D) Borkum und Norderney",
    ],
  },
  {
    stem: "Was zieht internationale Touristen nach Deutschland?",
    options: [
      "A) Nur die Hauptstadt Berlin",
      "B) Städte wie Berlin, Hamburg, Köln und München",
      "C) Nur die Berge in Bayern",
      "D) Nur kleine Dörfer auf dem Land",
    ],
  },
  {
    stem: "Welches große Ereignis in München zieht Besucher aus aller Welt an?",
    options: [
      "A) Die Berlinale",
      "B) Das Oktoberfest",
      "C) Der Weihnachtsmarkt",
      "D) Die Kieler Woche",
    ],
  },
  {
    stem: "Welche Sehenswürdigkeiten sind im Süden von Deutschland besonders bekannt?",
    options: [
      "A) Neuschwanstein, Herrenchiemsee und Linderhof",
      "B) Der Schwarzwald und der Bodensee",
      "C) Das Miniatur Wunderland in Hamburg",
      "D) Das Völkerschlachtdenkmal in Leipzig",
    ],
  },
  {
    stem: "Warum buchen viele Deutsche kurzfristig Reisen ins Ausland?",
    options: [
      "A) Wegen des perfekten Sommerwetters",
      "B) Wegen der hohen Temperaturen im Sommer",
      "C) Weil das Wetter in Deutschland nicht immer sonnig und warm ist",
      "D) Weil es in Deutschland keine Urlaubsorte gibt",
    ],
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

const B1Day26ReiseproblemeUndLoesungenWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Chapter 9.26 Workbook · Reiseprobleme und Lösungen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: group speaking, writing, reading and listening practice.
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
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
            alt="Airport departures board showing delays"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Zentrales Thema: Reiseprobleme und Lösungen</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Typische Reiseprobleme</strong>
              <ul style={listSpacing}>
                <li>❌ Verspätung: Flug/Zug/Bus kommt zu spät</li>
                <li>❌ Gepäck verloren: Koffer kommt nicht an</li>
                <li>❌ Reservierung vergessen: Kein Hotelzimmer verfügbar</li>
                <li>❌ Dokumente fehlen: Reisepass, Ticket, Visa vergessen</li>
                <li>❌ Krankheit auf Reisen: Fieber, Unfall, Durchfall</li>
                <li>❌ Sprache: Verständigungsprobleme im Ausland</li>
                <li>❌ Streik: Flughafen oder Bahnpersonal streikt</li>
              </ul>
            </li>
            <li>
              <strong>Lösungen und Reaktionen</strong>
              <ul style={listSpacing}>
                <li>✅ Umbuchung vornehmen: Anderen Flug/Zug buchen</li>
                <li>✅ Reklamation machen: Beschweren, Ersatz verlangen</li>
                <li>✅ Versicherung kontaktieren: Reiseversicherung nutzen</li>
                <li>✅ Hotel wechseln oder neu buchen</li>
                <li>✅ Apotheke oder Arzt aufsuchen</li>
                <li>✅ Online-Übersetzer nutzen</li>
                <li>✅ Hotline oder Reiseleitung anrufen</li>
              </ul>
            </li>
            <li>
              <strong>Wichtige Redemittel</strong>
              <ul style={listSpacing}>
                <li>„Mein Flug hat Verspätung.“</li>
                <li>„Mein Gepäck ist nicht angekommen.“</li>
                <li>„Ich habe eine Reservierung auf den Namen ...“</li>
                <li>„Ich brauche Hilfe. Ich bin krank.“</li>
                <li>„Können Sie mir bitte weiterhelfen?“</li>
                <li>„Wo ist das nächste Krankenhaus?“</li>
                <li>„Ich möchte mein Geld zurück.“</li>
              </ul>
            </li>
            <li>
              <strong>Tipps zur Vorbereitung</strong>
              <ul style={listSpacing}>
                <li>Reiseunterlagen vorher kontrollieren</li>
                <li>Notrufnummern speichern</li>
                <li>Medikamente mitnehmen</li>
                <li>Reiseversicherung abschließen</li>
                <li>Übersetzungs-App herunterladen</li>
                <li>Wichtige Adressen und Kontakte notieren</li>
                <li>Pufferzeit einplanen</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Gemeinsam etwas planen: Reiseprobleme und Lösungen</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Eure Aufgabe: Plant gemeinsam eine Reise und besprecht mögliche Probleme, die unterwegs passieren können, und wie ihr darauf reagieren würdet.
          </p>
          <p style={{ margin: 0 }}>Sprecht dabei über:</p>
          <ul style={listSpacing}>
            <li>Wohin wollt ihr reisen? (z. B. Stadt, Land, Region)</li>
            <li>Wie wollt ihr reisen? (z. B. mit dem Flugzeug, Bus, Auto, Zug)</li>
            <li>Was könnte schiefgehen? (z. B. Verspätung, verlorenes Gepäck, falsches Hotel)</li>
            <li>Was macht ihr dann? (z. B. umbuchen, reklamieren, Hilfe holen)</li>
          </ul>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a
              href="https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec"
              target="_blank"
              rel="noreferrer"
            >
              Open speaking self-practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2, Teil 3, and Teil 4.
          </p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing a letter in a notebook"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben)</h2>
          <h3 style={sectionTitle}>Schreibaufgabe: Informeller Brief – Reiseprobleme und Lösungen</h3>
          <p style={{ margin: 0 }}>
            Aufgabe: Du hast eine Reise gemacht, aber es gab ein paar Probleme. Schreibe deinem Freund Max / deiner Freundin Lisa einen Brief und erzähle:
          </p>
          <ol style={listSpacing}>
            <li>Wohin du gefahren bist und wie du gereist bist (z. B. mit dem Zug oder Flugzeug)</li>
            <li>Was genau passiert ist (z. B. Verspätung, Hotel geschlossen, Gepäck verloren)</li>
            <li>Was du gemacht hast, um das Problem zu lösen (z. B. umgebucht, Kundenservice kontaktiert)</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <p style={{ margin: 0 }}>
            Practice your draft before submission on the writing page:{" "}
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
            src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=1600&q=80"
            alt="Open travel magazine and reading glasses on a table"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at the bottom of the lesson to send your answers.
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Die Auswahl an Attraktionen erscheint fast unbegrenzt, was Deutschland auch bei den eigenen Einwohnern zum populären Urlaubsland macht. Die Deutschen verreisen gerne – und das auch innerhalb ihres Landes, zum Beispiel in das Bundesland Mecklenburg-Vorpommern: Im Sommer wünschen sich viele einen Strandurlaub, und dazu bieten die Ostsee und ihre bekannten Inseln Rügen und Usedom eine wunderschöne Gelegenheit.
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Die Mecklenburgische Seenplatte mit ihren mehr als 1.000 Seen lockt Wassersportler und Wanderfans – was die Deutschen sehr häufig sind. Das Bundesland Bayern, ebenfalls ein beliebtes Reiseziel, hat zwar keine Meeresküste, aber zahlreiche andere Attraktionen: Die Alpen beispielsweise begeistern Wanderer, Biker, Wintersportler und andere Aktivurlauber. Die Zugspitze, höchster Berg der Republik, der Watzmann am Königssee und die weltbekannten Schlösser des „Märchenkönigs“ Ludwig II., wie Neuschwanstein, Herrenchiemsee oder Linderhof – das sind nur einige Beispiele für die Angebotsvielfalt im deutschen Süden.
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Eine Entwicklung, über die sich die deutsche Tourismusbranche besonders freut: Auch internationale Touristen wählen Deutschland immer öfter als Ziel für eine Reise. Häufig kommt der Besuch aus europäischen Nachbarländern, aber auch aus den USA, Asien und den arabischen Golfstaaten. Für die ausländischen Gäste gehört zum Deutschland-Trip natürlich oft ein Besuch in der Hauptstadt Berlin. Auch Hamburg, Köln und Dresden sind sehr beliebt – oder München, das allein mit dem weltberühmten Oktoberfest im Herbst Besucher aus aller Welt anzieht.
          </p>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Als weitere Sightseeing-Klassiker unter den Urlaubszielen gelten bei den ausländischen Touristen etwa auch der Schwarzwald, der Bodensee und der Vergnügungspark Rust in Baden-Württemberg. Urlaubsland Deutschland – da gäbe es noch viel zu erzählen. Wer perfektes Sommerwetter ohne Ausnahme als sonnig und warm definiert, wird hier allerdings nicht immer glücklich, weshalb auch viele Deutsche – oft kurzfristig – doch noch eine Reise ins Ausland buchen.
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
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
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones for listening comprehension practice"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Please note that this is a Goethe-standard Hörverstehen (listening comprehension) test, and the answers are provided in the YouTube video. You are responsible for checking your own answers. The only parts that will be officially evaluated by the school are Lesen (reading) and Schreiben (writing). You must mark your own Hörverstehen results. This process will require a lot of motivation and self-discipline on your part to be effective. Thank you, and good luck!
          </p>
          <p style={{ margin: 0 }}>
            Video link: <a href="https://youtu.be/0sZVT9XAEBc" target="_blank" rel="noreferrer">https://youtu.be/0sZVT9XAEBc</a>
          </p>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final answers in the assignment submission area, not directly on this page.
          </p>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#fefce8" }}>
              <strong>Transcript (teacher support)</strong>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                This lesson uses a Goethe-standard listening task. The video includes the listening content and answer key for self-checking. In class, teachers can guide learners through the structure, pause strategically, and support answer validation.
              </p>
            </div>
          )}

          <p style={{ margin: 0 }}>
            Recommended video: <a href="https://youtu.be/0sZVT9XAEBc" target="_blank" rel="noreferrer">Goethe Hörverstehen – Reiseprobleme und Lösungen</a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/0sZVT9XAEBc"
            title="Goethe Hörverstehen – Reiseprobleme und Lösungen"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default B1Day26ReiseproblemeUndLoesungenWorkbookPage;
