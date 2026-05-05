import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};
const phraseGridStyle = { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" };
const videoPreviewStyle = { width: "100%", minHeight: 315, border: 0, borderRadius: 10 };

const lesenQuestions = [
  { stem: "Warum ist Telefonieren mit ausländischen SIM-Karten oft schwierig?", options: ["A) Sie sind oft defekt.", "B) Sie sind oft sehr teuer oder funktionieren nicht.", "C) Sie sind zu alt.", "D) Sie sind zu groß."] },
  { stem: "Was braucht man für einen Handyvertrag?", options: ["A) Nur eine SIM-Karte.", "B) Einen Reisepass und Flugticket.", "C) Ein deutsches Bankkonto und einen Ausweis.", "D) Nur ein Handy."] },
  { stem: "Wie lange läuft ein Handyvertrag normalerweise?", options: ["A) 1 bis 2 Wochen", "B) 1 bis 2 Monate", "C) 1 bis 2 Jahre", "D) Unbegrenzt"] },
  { stem: "Wann muss man einen Vertrag kündigen, wenn man wechseln möchte?", options: ["A) Sofort nach dem Abschluss", "B) Einen Monat vorher", "C) Drei Monate vor Vertragsende", "D) Nach der Kündigungsfrist"] },
  { stem: "Wo kann man Prepaid-SIM-Karten kaufen?", options: ["A) Nur im Internet", "B) Nur im Rathaus", "C) In Supermärkten, Tankstellen oder Kiosken", "D) Nur im Ausland"] },
  { stem: "Was braucht man zur Aktivierung einer Prepaid-SIM-Karte?", options: ["A) Nur das Handy", "B) Name, Adresse, Geburtsdatum und ein Ausweisdokument", "C) Nur einen Reisepass", "D) Einen Wohnsitznachweis"] },
  { stem: "Wie kann man kostenlos im Internet surfen?", options: ["A) Mit Auslandstarif", "B) Mit Guthaben-Karten", "C) Mit Video-Ident", "D) Mit öffentlichem WLAN"] },
];

const hoerenQuestions = [
  { stem: "Was hat Miriam gestern verloren?", options: ["A) Ihren Laptop", "B) Ihr Handy", "C) Ihre Tasche", "D) Ihren Ausweis"] },
  { stem: "Wo möchte Miriam ein neues Handy bestellen?", options: ["A) Im Supermarkt", "B) Auf www.jumiagh.com", "C) Im Rathaus", "D) In der Bibliothek"] },
  { stem: "Was fragt sie beim Kundenservice?", options: ["A) Nur nach der Farbe", "B) Nach Modell-Empfehlung sowie Bestellung und Lieferung", "C) Nur nach Rabatten", "D) Nach einem Auslandstarif"] },
  { stem: "Was ist ihr wichtig beim neuen Handy?", options: ["A) Gute Kamera und lange Akkulaufzeit", "B) Sehr großes Gewicht", "C) Nur Spiele", "D) Keine Internetfunktion"] },
];

function TabButton({ active, onClick, children }) {
  return <button onClick={onClick} style={{ ...styles.secondaryButton, borderColor: active ? "#2563eb" : "#d1d5db", background: active ? "#eff6ff" : "#fff", color: active ? "#1d4ed8" : "#111827" }}>{children}</button>;
}

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

export default function A2Day27DigitaleKommunikationWorkbookPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [teacherMode, setTeacherMode] = useState(false);
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>Back to Course</button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 27 Workbook · Digitale Kommunikation</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>4-part workbook: group speaking, writing, reading and listening practice.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tabs.map((tab) => <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>{tab.label}</TabButton>)}</div>
        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
      </div>

      {activeTab === "sprechen" && <div style={card}>
        <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1600&q=80" alt="People using smartphones and laptops for digital communication" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
        <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Zentrales Thema: <strong>Digitale Kommunikation im Alltag</strong>.</p>
        <ul style={listSpacing}><li><strong>Kommunikationsmittel:</strong> E-Mail, Telefonieren, Chatten, soziale Netzwerke, Online-Meetings.</li><li><strong>Soziale Medien:</strong> Plattformen, Aktivitäten, Zeitvertreib, Gefahren.</li><li><strong>Vorteile/Nachteile:</strong> schnell/einfach vs. Ablenkung/zu viel Zeit.</li><li><strong>Sicherheit:</strong> starke Passwörter, Datenschutz, 2FA, Updates.</li><li><strong>Alltag/Beruf:</strong> privat, beruflich, Schule/Uni, Herausforderungen.</li></ul>
        <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Wenn du antwortest, sprich in 4 klaren Schritten. So klingt dein Beitrag strukturiert und sicher:</p>
        <ol style={listSpacing}>
          <li><strong>Einleitung:</strong> Nenne kurz das Thema und deine Hauptidee.</li>
          <li><strong>Hauptteil mit Verbindungswörtern:</strong> Erkläre 2–3 Punkte und verbinde sie logisch.</li>
          <li><strong>Beispiel:</strong> Gib ein konkretes Beispiel aus deinem Alltag.</li>
          <li><strong>Schluss:</strong> Fasse zusammen oder gib eine kurze Empfehlung.</li>
        </ol>
        <div style={phraseGridStyle}>
          <div style={questionCardStyle}>
            <strong>Gute Einleitungen</strong>
            <span>„Ich möchte kurz über digitale Kommunikation sprechen.“</span>
            <span>„Für mich ist das Thema wichtig, weil …“</span>
            <span>„Im Alltag nutze ich vor allem …“</span>
          </div>
          <div style={questionCardStyle}>
            <strong>Verbindungswörter / Connectors</strong>
            <span>zuerst, dann, danach</span>
            <span>außerdem, auch, zusätzlich</span>
            <span>aber, trotzdem, deshalb</span>
          </div>
          <div style={questionCardStyle}>
            <strong>Eigene Meinung ausdrücken</strong>
            <span>„Ich finde, dass …“</span>
            <span>„Meiner Meinung nach …“</span>
            <span>„Ich denke, digitale Medien sind …, weil …“</span>
          </div>
          <div style={questionCardStyle}>
            <strong>Gute Schlüsse</strong>
            <span>„Zusammenfassend kann ich sagen, dass …“</span>
            <span>„Am Ende ist für mich wichtig, dass …“</span>
            <span>„Deshalb versuche ich, bewusst online zu kommunizieren.“</span>
          </div>
        </div>
        <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
          <strong>Kurzbeispiel (ca. 30–45 Sekunden)</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ich möchte kurz über digitale Kommunikation in meinem Alltag sprechen. Ich benutze am meisten WhatsApp und E-Mail.
            Zuerst schreibe ich meinen Freunden über das Handy, weil es schnell und praktisch ist. Außerdem nutze ich E-Mails
            für die Arbeit, denn dort kann ich Informationen besser organisieren. Ein Beispiel: Letzte Woche habe ich mit meinem
            Team ein Online-Meeting gemacht, und danach haben wir alles per Chat geklärt. Meiner Meinung nach sind digitale Medien
            sehr hilfreich, aber man muss auch Pausen machen. Zusammenfassend ist digitale Kommunikation für mich wichtig, wenn
            ich sie bewusst nutze.
          </p>
        </div>
        <h3 style={sectionTitle}>Diskussionsfrage</h3>
        <p style={{ margin: 0 }}>Welche digitalen Kommunikationsmittel benutzt du am meisten? Warum? Wie oft? Handy oder Computer?</p>
        <div style={{ ...questionCardStyle, background: "#f8fafc" }}><strong>Speaking self-practice confidence check</strong><p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p><a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">Open speaking self-practice</a></div>
        <SpeakingPracticeTimerCard />
        <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>
        <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
      </div>}

      {activeTab === "schreiben" && <div style={card}>
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80" alt="Customer writing an email to support on a laptop" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
        <h2 style={sectionTitle}>Teil 2 · Schreiben</h2>
        <p style={{ margin: 0 }}><strong>Situation:</strong> Sie haben Ihr Handy verloren und möchten ein neues auf www.jumiagh.com bestellen.</p>
        <p style={{ margin: 0 }}><strong>Aufgabe:</strong> Schreiben Sie eine E-Mail an den Kundenservice.</p>
        <ol style={listSpacing}><li>Erklären Sie, warum Sie ein neues Handy bestellen möchten.</li><li>Fragen Sie nach Empfehlungen für ein passendes Modell.</li><li>Bitten Sie um Informationen zur Bestellung und Lieferung.</li></ol>
        <p style={{ margin: 0, color: "#4b5563" }}>Submit your final writing in the assignment submission area (not directly on this page).</p>
        <p style={{ margin: 0 }}>Practice your draft before submission on the writing page: <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">Open Writing Practice</a> (you can use the Ideas Generator there for support).</p>
        <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
      </div>}

      {activeTab === "lesen" && <div style={card}>
        <img src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1600&q=80" alt="Reading exercise text about mobile communication in Germany" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
        <h2 style={sectionTitle}>Teil 3 · Lesen</h2>
        <p style={{ margin: 0 }}><strong>Do not answer directly on this page.</strong> Use the submission area to send your final answers.</p>
        <h3 style={sectionTitle}>Telefonieren und Internet in Deutschland</h3>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Wer in Deutschland mit seiner SIM-Karte aus der Heimat telefonieren will, hat oft Probleme. Denn viele Karten funktionieren in Deutschland nicht und Telefonieren mit ausländischen SIM-Karten ist sehr teuer. Es gibt mehrere Möglichkeiten, um in Deutschland mobil zu telefonieren: Handyvertrag, Prepaid-SIM-Karte, Datentarife und WLAN.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Ein Handyvertrag braucht ein deutsches Bankkonto und einen Ausweis. Die Laufzeit ist meistens ein bis zwei Jahre. Kündigen muss man oft drei Monate vor Vertragsende, sonst verlängert sich der Vertrag automatisch.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Prepaid-SIM-Karten kann man in Supermärkten, Tankstellen oder Kiosken kaufen. Zur Aktivierung braucht man Name, Adresse, Geburtsdatum und ein Ausweisdokument mit Foto. Nach der Aktivierung lädt man Guthaben auf.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>Kostenloses Internet gibt es oft über öffentliche WLAN-Netze in Cafés, Bibliotheken oder anderen öffentlichen Gebäuden.</p>
        <h3 style={sectionTitle}>Fragen zum Text</h3>
        {lesenQuestions.map((question, index) => <div key={question.stem} style={questionCardStyle}><strong>{index + 1}. {question.stem}</strong>{question.options.map((option) => <span key={option}>{option}</span>)}</div>)}
        <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
      </div>}

      {activeTab === "hoeren" && <div style={card}>
        <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80" alt="Listening practice with headphones and digital devices" loading="lazy" style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }} />
        <h2 style={sectionTitle}>Teil 4 · Hören</h2>
        <p style={{ margin: 0 }}>Listen, then submit answers in the assignment area (not on this page).</p>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}><input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />Teacher mode (show transcript)</label>
        {teacherMode && <div style={{ ...questionCardStyle, background: "#fefce8" }}><strong>Transcript (teacher support)</strong><p style={{ margin: 0, lineHeight: 1.6 }}>Miriam hat ihr Handy verloren und möchte ein neues auf www.jumiagh.com bestellen. Sie schreibt dem Kundenservice und bittet um Empfehlungen für ein Modell mit guter Kamera und langer Akkulaufzeit. Außerdem fragt sie nach dem Bestellablauf und der Lieferzeit nach Hause.</p></div>}
        <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
        {hoerenQuestions.map((question, index) => <div key={question.stem} style={questionCardStyle}><strong>{index + 1}. {question.stem}</strong>{question.options.map((option) => <span key={option}>{option}</span>)}</div>)}
        <p style={{ margin: 0 }}>Recommended video: <a href="https://youtu.be/JEJZypJfrD8?list=PLZ6nUCSTx9pKcy_IKo10vFQIlAhwFpEr5" target="_blank" rel="noreferrer">Digitale Kommunikation (A2)</a></p>
        <iframe style={videoPreviewStyle} src="https://www.youtube.com/embed/JEJZypJfrD8" title="Digitale Kommunikation (A2)" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
      </div>}
    </div>
  );
}
