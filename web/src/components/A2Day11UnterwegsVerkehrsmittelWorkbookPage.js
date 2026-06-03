import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";

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

const phraseGridStyle = { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" };

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Wo möchte Julia ein Auto mieten?",
    options: ["A) In Deutschland", "B) In Italien", "C) In Frankreich", "D) In Spanien"],
  },
  {
    stem: "Warum wählt Julia ein kleines Auto?",
    options: [
      "A) Weil es billiger ist",
      "B) Weil sie in der Stadt fahren wird",
      "C) Weil es mehr Platz bietet",
      "D) Weil es schneller ist",
    ],
  },
  {
    stem: "Was ist für Julia wichtig bei der Autovermietung?",
    options: ["A) Eine gute Versicherung", "B) Ein Navigationssystem", "C) Ein großes Auto", "D) Eine rote Farbe"],
  },
  {
    stem: "Welche Dokumente bringt Julia mit?",
    options: [
      "A) Führerschein und Reisepass",
      "B) Führerschein und Personalausweis",
      "C) Personalausweis und Kreditkarte",
      "D) Mietvertrag und Kreditkarte",
    ],
  },
  {
    stem: "Wer erklärt Julia die Vertragsbedingungen?",
    options: ["A) Ein Freund", "B) Der Angestellte der Autovermietung", "C) Ein Reisebüro", "D) Ein Polizist"],
  },
  {
    stem: "Was plant Julia zu tun?",
    options: ["A) Viele Städte zu besuchen", "B) Am Strand zu liegen", "C) In den Bergen zu wandern", "D) Nur im Hotel zu bleiben"],
  },
  {
    stem: "Wie ist Julia mit der Autovermietung zufrieden?",
    options: ["A) Nicht zufrieden", "B) Sehr zufrieden", "C) Etwas zufrieden", "D) Unzufrieden mit dem Service"],
  },
];

const hoerenQuestions = [
  {
    stem: "Wohin möchte Thomas fahren?",
    options: ["A) Zum Strand", "B) In die Berge", "C) In die Stadt", "D) Zum Flughafen"],
  },
  {
    stem: "Welches Auto wählt Thomas?",
    options: ["A) Ein kleines Auto", "B) Ein mittelgroßes Auto", "C) Ein großes Auto", "D) Ein Elektroauto"],
  },
  {
    stem: "Wie viel kostet das Auto pro Tag?",
    options: ["A) 40 Euro", "B) 50 Euro", "C) 60 Euro", "D) 70 Euro"],
  },
  {
    stem: "Welche Dokumente zeigt Thomas dem Mitarbeiter?",
    options: [
      "A) Führerschein und Personalausweis",
      "B) Führerschein und Reisepass",
      "C) Führerschein und Kreditkarte",
      "D) Reisepass und Mietvertrag",
    ],
  },
  {
    stem: "Was überprüft Thomas, bevor er losfährt?",
    options: ["A) Den Benzinstand", "B) Das Auto auf mögliche Schäden", "C) Das Navigationssystem", "D) Die Klimaanlage"],
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

const A2Day11UnterwegsVerkehrsmittelWorkbookPage = () => {
  const navigate = useNavigate();
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
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 11 Workbook · Unterwegs: Verkehrsmittel vergleichen</h1>
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
            src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80"
            alt="People discussing transportation options in a city"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing <strong>Unterwegs: Verkehrsmittel vergleichen</strong>.
          </p>

          <h3 style={sectionTitle}>Zentrales Thema: „Unterwegs: Verkehrsmittel vergleichen“</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Verkehrsmittel (Arten &amp; Beispiele)</strong>
              <ul style={listSpacing}>
                <li>Auto – (Privatwagen, Taxi, Mietwagen, Bolt)</li>
                <li>Bus – (Stadtbus, Reisebus, Trotro)</li>
                <li>Bahn/Zug – (S-Bahn, ICE, Regionalzug)</li>
                <li>Fahrrad – (E-Bike, normales Fahrrad)</li>
                <li>Flugzeug – (Kurz- und Langstreckenflüge)</li>
                <li>Schiff/Fähre – (Kreuzfahrt, Fährverbindung)</li>
                <li>Motorrad &amp; Roller – (Okada, Motorroller)</li>
              </ul>
            </li>
            <li>
              <strong>Wichtige Dokumente (Important Documents)</strong>
              <ul style={listSpacing}>
                <li>Führerschein (Driver&apos;s license) – Für Auto, Motorrad, Mietwagen</li>
                <li>Personalausweis oder Reisepass (ID card or passport) – Notwendig für Reisen ins Ausland</li>
                <li>Kreditkarte (Credit card) – Zum Bezahlen von Tickets, Mietwagen, Hotels</li>
                <li>Mietvertrag (Rental agreement) – Für Mietwagen oder langfristige Aufenthalte</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Vorteile &amp; Nachteile der Verkehrsmittel</h3>
          <ul style={listSpacing}>
            <li><strong>Auto (Privatwagen, Taxi, Bolt):</strong> ✅ Flexibel, bequem, gut für Familien · ❌ Benzinkosten, Staus, Parkplatzsuche</li>
            <li><strong>Bus (Stadtbus, Reisebus, Trotro):</strong> ✅ Günstig, oft verfügbar · ❌ Überfüllt, manchmal unpünktlich</li>
            <li><strong>Zug/Bahn:</strong> ✅ Schnell, bequem, keine Staus · ❌ Teure Tickets, Verspätungen</li>
            <li><strong>Fahrrad:</strong> ✅ Gesund, umweltfreundlich, kostenlos · ❌ Langsam, wetterabhängig</li>
            <li><strong>Flugzeug:</strong> ✅ Schnell für lange Strecken, bequem · ❌ Teuer, umweltschädlich, lange Wartezeiten am Flughafen</li>
            <li><strong>Schiff/Fähre:</strong> ✅ Entspannt, ideal für Inselreisen · ❌ Langsam, teuer</li>
            <li><strong>Okada (Motorradtaxi):</strong> ✅ Sehr schnell im Stadtverkehr, günstig · ❌ Gefährlich, nicht immer sicher</li>
            <li><strong>Trotro (Minibus in Ghana):</strong> ✅ Sehr günstig, oft verfügbar · ❌ Überfüllt, manchmal unbequem</li>
            <li><strong>Bolt (Fahrdienst-App, wie Uber):</strong> ✅ Bequem, einfach mit dem Handy bestellbar · ❌ Teurer als öffentliche Verkehrsmittel</li>
          </ul>

          <h3 style={sectionTitle}>Verkehrsmittel für verschiedene Situationen</h3>
          <ul style={listSpacing}>
            <li>Zur Arbeit oder Schule: Bus, Bahn, Fahrrad, Trotro, Bolt</li>
            <li>Urlaub und lange Reisen: Flugzeug, Zug, Auto</li>
            <li>Einkaufen oder Ausflüge: Auto, Fahrrad, Okada, Bolt</li>
            <li>Insel- oder Meerreisen: Schiff, Fähre</li>
          </ul>

          <h3 style={sectionTitle}>Persönliche Meinung &amp; Erfahrungen</h3>
          <ul style={listSpacing}>
            <li>Welches Verkehrsmittel benutze ich am häufigsten?</li>
            <li>Welches Verkehrsmittel finde ich am besten? Warum?</li>
            <li>Habe ich schon einmal eine lange Zug- oder Flugreise gemacht?</li>
            <li>Wie wichtig sind Umweltaspekte bei der Wahl eines Verkehrsmittels?</li>
          </ul>

          <h3 style={sectionTitle}>Group Discussion Questions</h3>
          <p style={{ margin: 0 }}>Welches Verkehrsmittel benutzt du am liebsten und warum?</p>
          <p style={{ margin: 0, color: "#4b5563" }}>Stichwörter: Auto · Bolt · Trotro · Fahrrad</p>

          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nutze diese einfache Struktur: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
            So wird aus kurzen Wörtern eine klare Antwort mit guten Sätzen.
          </p>
          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Schnelle Struktur für 30–45 Sekunden</strong>
            <ol style={listSpacing}>
              <li><strong>Einleitung:</strong> Thema nennen und einen ersten Satz sagen.</li>
              <li><strong>Hauptteil:</strong> zwei oder drei Punkte mit einfachen Connectors verbinden.</li>
              <li><strong>Beispiel:</strong> ein kurzes Beispiel aus deinem Leben geben.</li>
              <li><strong>Schluss:</strong> deine Meinung kurz zusammenfassen.</li>
            </ol>
          </div>
          <div style={phraseGridStyle}>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Einleitungen</strong>
              <ul style={listSpacing}>
                <li>„Heute spreche ich über …“</li>
                <li>„Ich möchte kurz etwas über … sagen.“</li>
                <li>„Mein Thema ist …“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Verbindungswörter / Connectors</strong>
              <ul style={listSpacing}>
                <li><strong>und</strong> · „Ich fahre Bus und ich gehe zu Fuß.“</li>
                <li><strong>oder</strong> · „Ich nehme den Zug oder den Bus.“</li>
                <li><strong>weil</strong> · „Das ist gut, weil es einfach ist.“</li>
                <li><strong>deshalb</strong> · „Ich habe wenig Zeit, deshalb plane ich gut.“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Eigene Meinung ausdrücken</strong>
              <ul style={listSpacing}>
                <li>„Ich finde … gut, weil …“</li>
                <li>„Für mich ist … wichtig.“</li>
                <li>„Meiner Meinung nach ist … praktisch.“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Schlüsse</strong>
              <ul style={listSpacing}>
                <li>„Zum Schluss kann ich sagen: …“</li>
                <li>„Deshalb finde ich … gut.“</li>
                <li>„Das ist meine Meinung. Danke fürs Zuhören.“</li>
              </ul>
            </div>
          </div>
          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Ich vergleiche heute Bus, Fahrrad und Auto. Ich fahre oft mit dem Bus, weil der Bus günstig ist. Das Fahrrad ist auch gut, weil es gesund ist und kein Benzin braucht. Das Auto ist bequem, aber es ist teuer und es gibt oft Stau. Zum Beispiel nehme ich für die Arbeit den Bus, aber am Wochenende fahre ich manchmal mit dem Auto. Zum Schluss finde ich: Für kurze Wege ist das Fahrrad am besten, und für lange Wege ist der Bus oder der Zug praktisch.“
            </p>
          </div>
          <SpeakingPracticeTimerCard />

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>

          <CourseInlinePracticePanel
            type="speaking"
            title="Practice speaking on this page"
            description="Open the speaking coach here after reading the task. No new tab is needed."
          />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing a formal email assignment"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 · Assignment: Schreiben</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Formelle E-Mail: Auto mieten</strong>
          </p>
          <p style={{ margin: 0 }}>
            Sie sind jetzt in Deutschland und möchten ein Auto mieten. Schreiben Sie eine E-Mail an eine Autovermietung, in
            der Sie:
          </p>
          <ul style={listSpacing}>
            <li>Fragen, ob noch Autos für das Wochenende verfügbar sind.</li>
            <li>Fragen, welche Dokumente für die Anmietung benötigt werden.</li>
            <li>Nach dem Preis für die Miete fragen und ob eine Versicherung im Preis enthalten ist.</li>
          </ul>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <CourseInlinePracticePanel
            type="writing"
            title="Practice writing on this page"
            description="Write and mark your answer here after studying the task. No new tab is needed."
          />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Workbook reading section with text and questions"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 · Lesen</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at
            the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Reading Text</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Julia möchte ein Auto für ihren Urlaub in Italien mieten. Sie sucht online nach verschiedenen Autovermietungen.
            Sie entscheidet sich für eine Firma, die gute Bewertungen hat und günstige Preise bietet. Julia wählt ein kleines
            Auto, weil sie hauptsächlich in der Stadt fahren wird. Sie möchte ein Auto mit Klimaanlage, da es im Sommer sehr
            heiß sein kann. Bevor sie das Auto mietet, prüft sie die Bedingungen sorgfältig. Sie stellt sicher, dass eine
            Versicherung im Preis enthalten ist. Am Tag der Abholung bringt sie ihren Führerschein und ihren Personalausweis
            mit. Der Angestellte der Autovermietung erklärt ihr die Vertragsbedingungen und zeigt ihr das Auto. Julia ist
            zufrieden mit ihrer Wahl und freut sich auf ihren Urlaub. Sie plant, viele Städte zu besuchen und die Landschaft zu
            genießen. Nach einer Woche gibt sie das Auto ohne Probleme zurück. Sie ist sehr zufrieden mit dem Service und der
            Qualität des Autos. Julia empfiehlt diese Autovermietung ihren Freunden weiter.
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>
                {index + 1}. {question.stem}
              </strong>
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
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones used for listening comprehension practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 · Hören</h2>
          <p style={{ margin: 0 }}>
            Listen to the audio, then submit your answers in the assignment area (do not answer directly on this page).
          </p>
          <p style={{ margin: 0 }}>
            Audio link:{" "}
            <a
              href="https://drive.google.com/file/d/1m973krkBWyWPkvdhXEcPzpIoYoKiuqRu/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Open Teil 4 audio
            </a>
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>
                {index + 1}. {question.stem}
              </strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <p style={{ margin: 0 }}>
            Recommended video:{" "}
            <a href="https://youtu.be/RkvfRiPCZI4" target="_blank" rel="noreferrer">
              Verkehrsmittel im Vergleich (A2)
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/RkvfRiPCZI4"
            title="Verkehrsmittel im Vergleich (A2)"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day11UnterwegsVerkehrsmittelWorkbookPage;
