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

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "1. Warum ist die Wohnungssuche in Großstädten schwierig?",
    options: [
      "A) Wegen der vielen Neubauten",
      "B) Wegen des Mangels an bezahlbarem Wohnraum",
      "C) Wegen der hohen Gehälter",
      "D) Wegen der niedrigen Nachfrage",
    ],
  },
  {
    stem: "2. Was führt zu einer geringeren Chance auf eine Zusage?",
    options: ["A) Hohe Nachfrage nach Wohnungen", "B) Geringe Anzahl von Vermietern", "C) Zentrale Lage", "D) Kurze Bewerbungen"],
  },
  {
    stem: "3. Warum kaufen Investoren Wohnungen auf?",
    options: [
      "A) Um sie zu renovieren",
      "B) Um sie als Ferienwohnungen oder Luxusapartments zu nutzen",
      "C) Um sie günstig zu vermieten",
      "D) Um sie ungenutzt zu lassen",
    ],
  },
  {
    stem: "4. Welche Maßnahmen ergreift die Politik?",
    options: [
      "A) Erhöhung der Mieten",
      "B) Einführung der Mietpreisbremse und Neubauprogramme",
      "C) Schließung von Altbauwohnungen",
      "D) Verbot von Umzügen",
    ],
  },
  {
    stem: "5. Warum bevorzugen Familien mit Kindern bestimmte Wohnungen?",
    options: [
      "A) Wegen der Nähe zu Schulen und Kindergärten",
      "B) Wegen der größeren Wohnungsgröße",
      "C) Wegen der besseren Verkehrsanbindung",
      "D) Wegen kürzerer Mietverträge",
    ],
  },
  {
    stem: "6. Welche Eigenschaft ist laut dem Text bei der Wohnungssuche wichtig?",
    options: ["A) Geduld und Flexibilität", "B) Hohes Einkommen", "C) Zentralität der Wohnung", "D) Viele Möbel"],
  },
  {
    stem: "7. Was lässt sich zusammenfassend über die Wohnungssuche sagen?",
    options: ["A) Sie ist einfach und schnell erledigt.", "B) Sie erfordert Zeit und Geduld.", "C) Sie ist nur für Investoren interessant.", "D) Sie ist ohne Kompromisse möglich."],
  },
];

const hoerenQuestions = [
  {
    stem: "1. Wie hoch ist die Miete?",
    options: ["A) 850 Euro", "B) 950 Euro", "C) 1050 Euro", "D) 750 Euro"],
  },
  {
    stem: "2. Was kosten die Nebenkosten?",
    options: ["A) 100 Euro", "B) 150 Euro", "C) 200 Euro", "D) 250 Euro"],
  },
  {
    stem: "3. Ist die Wohnung möbliert?",
    options: ["A) Ja", "B) Nein", "C) Teilweise", "D) Nur die Küche"],
  },
  {
    stem: "4. Welche Haustiere sind erlaubt?",
    options: ["A) Hunde", "B) Kleine Haustiere", "C) Keine Haustiere", "D) Nur Katzen"],
  },
  {
    stem: "5. Was sagt der Vermieter über die Verkehrsanbindung?",
    options: [
      "A) Es gibt keine öffentlichen Verkehrsmittel in der Nähe.",
      "B) Es gibt eine U-Bahn-Station und mehrere Bushaltestellen in der Nähe.",
      "C) Es gibt nur eine Bushaltestelle in der Nähe.",
      "D) Es gibt nur einen Bahnhof in der Nähe.",
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

const B1Day4WohnungSuchenWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 4 Workbook · Wohnung suchen (Übung) 2.4</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: speaking, writing, reading, and listening practice focused on apartment search in German.
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
            src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80"
            alt="People discussing apartment options together"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Central Topic</h3>
          <p style={{ margin: 0 }}>
            <strong>Wohnung suchen</strong> (Searching for an Apartment)
          </p>

          <h3 style={sectionTitle}>Main Branches &amp; Sub-Branches</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Wohnungsarten (Types of Apartments)</strong>
              <ul style={listSpacing}>
                <li>Mietwohnung (Rental apartment)</li>
                <li>Eigentumswohnung (Owned apartment)</li>
                <li>WG (Wohngemeinschaft – Shared apartment)</li>
                <li>Einzimmerwohnung (One-room apartment/studio)</li>
                <li>Mehrfamilienhaus (Multi-family house)</li>
              </ul>
            </li>
            <li>
              <strong>Wohnungssuche (Apartment Search)</strong>
              <ul style={listSpacing}>
                <li>Online-Portale (Online portals: Immobilienscout24, eBay Kleinanzeigen)</li>
                <li>Zeitungsanzeigen (Newspaper ads)</li>
                <li>Immobilienmakler (Real estate agents)</li>
                <li>Mundpropaganda (Word of mouth)</li>
                <li>Aushänge in Supermärkten (Notices in supermarkets)</li>
              </ul>
            </li>
            <li>
              <strong>Kriterien &amp; Anforderungen (Criteria &amp; Requirements)</strong>
              <ul style={listSpacing}>
                <li>Mietpreis (Rent price)</li>
                <li>Kaution (Deposit)</li>
                <li>Nebenkosten (Additional costs)</li>
                <li>Lage (Location)</li>
                <li>Verkehrsanbindung (Transport connections)</li>
                <li>Einkaufsmöglichkeiten (Shopping facilities)</li>
                <li>Haustiere erlaubt? (Pets allowed?)</li>
              </ul>
            </li>
            <li>
              <strong>Besichtigung &amp; Vertrag (Viewing &amp; Contract)</strong>
              <ul style={listSpacing}>
                <li>Besichtigungstermin vereinbaren (Schedule a viewing)</li>
                <li>Fragen stellen (Ask questions)</li>
                <li>Mietvertrag prüfen (Check rental contract)</li>
                <li>Kündigungsfrist (Notice period)</li>
                <li>Mieterschutz (Tenant protection)</li>
              </ul>
            </li>
            <li>
              <strong>Einzug &amp; Einrichtung (Moving In &amp; Furnishing)</strong>
              <ul style={listSpacing}>
                <li>Umzugsplanung (Moving plan)</li>
                <li>Möbel kaufen (Buying furniture)</li>
                <li>Nachbarn kennenlernen (Getting to know neighbors)</li>
                <li>Anmeldung beim Einwohnermeldeamt (Registering at the residents&apos; office)</li>
                <li>Internet und Strom anmelden (Setting up internet and electricity)</li>
              </ul>
            </li>
          </ol>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Frage des Tages:</strong> Was sind die wichtigsten Punkte, wenn man eine Wohnung sucht?
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Aufgabenstellung:</strong> Schreibe einen kurzen Text oder bereite eine mündliche Antwort vor. Nutze diese
            Struktur: 1) Einleitung, 2) Vorteile, 3) Nachteile, 4) Deine Meinung.
          </p>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Open speaking self-practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group practice and has no assignment submission.
          </p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Student writing a reflective response"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Thema: <strong>Wohnung suchen und persönliche Kontakte</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie haben im Fernsehen eine Diskussionssendung zum Thema „Wohnung suchen und persönliche Kontakte“ gesehen.
            Im Online-Gästebuch der Sendung finden Sie folgende Meinung:
          </p>
          <div style={questionCardStyle}>
            <strong>Tanja:</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Ich finde es wichtig, dass man beim Wohnungssuchen persönliche Kontakte nutzt. Aber heute suchen viele
              online, und oft haben sie keinen direkten Kontakt mit Vermietern oder Mitbewohnern. Meiner Meinung nach
              kann das die Wohnungssuche schwieriger machen, weil persönliche Empfehlungen oft hilfreicher sind als
              anonyme Online-Anzeigen.“
            </p>
          </div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Schreiben Sie nun Ihre Meinung zum Thema (circa 80 Wörter).
          </p>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Writing practice before submission</strong>
            <p style={{ margin: 0 }}>
              Before submitting your final answer, practise your ideas and structure in the writing lab. You can use the
              Ideas Generator for support.
            </p>
            <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
              Open writing practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing response in the assignment submission area, not directly on this page.
          </p>

          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Reading practice materials on a desk"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen) · Exercise</h2>
          <h3 style={sectionTitle}>Die Herausforderungen der Wohnungssuche in Großstädten</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In vielen Großstädten Deutschlands wird die Wohnungssuche zu einer echten Herausforderung. Es gibt viele
            Gründe dafür, warum es schwierig ist, eine passende Wohnung zu finden. Einer der Hauptgründe ist der Mangel
            an bezahlbarem Wohnraum. Besonders in beliebten Vierteln sind die Mieten in den letzten Jahren stark
            gestiegen. Viele Menschen müssen sich daher mit kleineren Wohnungen oder einer Wohnung in weniger zentralen
            Lagen zufriedengeben.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ein weiteres Problem ist die hohe Nachfrage nach Wohnungen. In Städten wie Berlin, München oder Hamburg gibt
            es mehr Wohnungssuchende als verfügbare Wohnungen. Dies führt dazu, dass viele Interessenten sich um eine
            Wohnung bewerben, was die Chancen auf eine Zusage reduziert. Oftmals entscheiden Vermieter sich für Bewerber
            mit höherem Einkommen oder sicherem Arbeitsplatz.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ein weiterer Punkt ist der Konkurrenzdruck durch Investoren. Viele Wohnungen werden von Investoren aufgekauft
            und als Ferienwohnungen oder Luxusapartments genutzt, was den Markt für normale Mieter weiter verknappt. Die
            Politik versucht, durch verschiedene Maßnahmen wie Mietpreisbremse und Neubauprogramme gegenzusteuern, aber
            die Wirkung dieser Maßnahmen ist umstritten.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Neben diesen äußeren Faktoren spielen auch persönliche Umstände eine Rolle. Wer zum Beispiel auf eine
            bestimmte Wohnungsgröße oder -ausstattung angewiesen ist, hat es oft schwerer, etwas Passendes zu finden.
            Familien mit Kindern bevorzugen oft Wohnungen in der Nähe von Schulen und Kindergärten, während junge
            Berufstätige oft eine Wohnung in der Nähe ihres Arbeitsplatzes suchen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Zusammenfassend lässt sich sagen, dass die Wohnungssuche in Großstädten eine komplexe Aufgabe ist, die viel
            Zeit und Geduld erfordert. Es ist wichtig, flexibel zu bleiben und gegebenenfalls Kompromisse einzugehen, um
            eine passende Wohnung zu finden.
          </p>

          <h3 style={sectionTitle}>Multiple-Choice Questions</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {lesenQuestions.map((question) => (
              <div key={question.stem} style={questionCardStyle}>
                <strong>{question.stem}</strong>
                {question.options.map((option) => (
                  <span key={option}>{option}</span>
                ))}
              </div>
            ))}
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your selected answers in the assignment submission area, not directly on this page.
          </p>

          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Learner listening with headphones"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Exercise</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Recommended video: {" "}
            <a href="https://youtu.be/kR8SmSY99c8" target="_blank" rel="noreferrer">
              Wohnung suchen – Video
            </a>
          </p>

          <iframe
            title="Wohnung suchen video preview"
            src="https://www.youtube.com/embed/kR8SmSY99c8"
            style={videoPreviewStyle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Audio source for this exercise: {" "}
            <a
              href="https://drive.google.com/file/d/1zErUZFGcTIUw_I3aasDXM2VlAoPfKsBP/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Open listening audio
            </a>
          </p>

          <h3 style={sectionTitle}>Multiple-Choice Questions</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {hoerenQuestions.map((question) => (
              <div key={question.stem} style={questionCardStyle}>
                <strong>{question.stem}</strong>
                {question.options.map((option) => (
                  <span key={option}>{option}</span>
                ))}
              </div>
            ))}
          </div>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Transcript support (Teacher mode)</strong>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Transcript hint: The dialogue is a rental inquiry covering monthly rent, utility costs, furnishing status,
                pet policy, and nearby transport options.
              </p>
            </div>
          )}

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your listening answers in the assignment submission area, not directly on this page.
          </p>

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default B1Day4WohnungSuchenWorkbookPage;
