import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
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
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";
import { styles } from "../styles";

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
const phraseGridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question, index) => (
      <div key={question.stem} style={questionCardStyle}>
        <strong>{index + 1}. {question.stem}</strong>
        {question.options.map((option) => <span key={`${question.stem}-${option}`}>{option}</span>)}
      </div>
    ))}
  </div>
);

export default function A2Day27DigitaleKommunikationWorkbookPage() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((previous) => ({ ...previous, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>A2 · Day 27 · Kapitel 10.27</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 Workbook · Digitale Kommunikation</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4, Ref or Submit. Teil 1 is group practice; submit Teil 2, Teil 3 and Teil 4.
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
            tabs={STANDARD_WORKBOOK_TABS}
            ariaLabel="A2 Day 27 workbook sections"
          />
        </div>

        <img
          src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1600&q=80"
          alt="People using smartphones and laptops for digital communication"
          loading="lazy"
          style={imageStyle}
        />
      </header>

      <A2B1WorkbookGuidance level="A2" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Welche digitalen Kommunikationsmittel benutzt du am meisten?"
            practiceOnly
            submissionNote="Teil 1 is for group practice only and is not submitted."
          >
            <p style={{ margin: 0 }}>
              Erkläre, welche Kommunikationsmittel du nutzt, wie oft du sie verwendest und welche Vor- und Nachteile sie haben. Nenne auch ein Beispiel aus Alltag, Beruf oder Schule.
            </p>
          </WorkbookTaskCard>

          <SpeakingMindMap config={getA2SpeakingMindMap(27)} />
          <p style={{ margin: 0, lineHeight: 1.7 }}>Zentrales Thema: <strong>Digitale Kommunikation im Alltag</strong>.</p>
          <ul style={listSpacing}>
            <li><strong>Kommunikationsmittel:</strong> E-Mail, Telefonieren, Chatten, soziale Netzwerke, Online-Meetings.</li>
            <li><strong>Soziale Medien:</strong> Plattformen, Aktivitäten, Zeitvertreib und Gefahren.</li>
            <li><strong>Vorteile und Nachteile:</strong> schnell und einfach, aber auch Ablenkung und hoher Zeitverbrauch.</li>
            <li><strong>Sicherheit:</strong> starke Passwörter, Datenschutz, Zwei-Faktor-Authentifizierung und Updates.</li>
            <li><strong>Alltag und Beruf:</strong> private, berufliche und schulische Kommunikation.</li>
          </ul>

          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <ol style={listSpacing}>
            <li><strong>Einleitung:</strong> Nenne kurz das Thema und deine Hauptidee.</li>
            <li><strong>Hauptteil:</strong> Erkläre zwei oder drei Punkte mit Verbindungswörtern.</li>
            <li><strong>Beispiel:</strong> Gib ein konkretes Beispiel aus deinem Alltag.</li>
            <li><strong>Schluss:</strong> Fasse zusammen oder gib eine Empfehlung.</li>
          </ol>

          <div style={phraseGridStyle}>
            <div style={questionCardStyle}>
              <strong>Gute Einleitungen</strong>
              <span>„Ich möchte kurz über digitale Kommunikation sprechen.“</span>
              <span>„Für mich ist das Thema wichtig, weil …“</span>
              <span>„Im Alltag nutze ich vor allem …“</span>
            </div>
            <div style={questionCardStyle}>
              <strong>Verbindungswörter</strong>
              <span>zuerst, dann, danach</span>
              <span>außerdem, auch, zusätzlich</span>
              <span>aber, trotzdem, deshalb</span>
            </div>
            <div style={questionCardStyle}>
              <strong>Eigene Meinung</strong>
              <span>„Ich finde, dass …“</span>
              <span>„Meiner Meinung nach …“</span>
              <span>„Digitale Medien sind hilfreich, weil …“</span>
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
              Ich möchte kurz über digitale Kommunikation in meinem Alltag sprechen. Ich benutze am meisten WhatsApp und E-Mail. Zuerst schreibe ich meinen Freunden über das Handy, weil es schnell und praktisch ist. Außerdem nutze ich E-Mails für die Arbeit, denn dort kann ich Informationen besser organisieren. Meiner Meinung nach sind digitale Medien sehr hilfreich, aber man muss auch Pausen machen.
            </p>
          </div>

          <SpeakingPracticeTimerCard storageKey="a2-day27-digitale-kommunikation-speaking" />
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Schreiben Sie eine E-Mail an den Kundenservice."
            submissionNote="Submit your finished email through the Submit tab."
          >
            <p style={{ margin: 0 }}>
              Sie haben Ihr Handy verloren und möchten ein neues auf www.jumiagh.com bestellen.
            </p>
            <ol style={listSpacing}>
              <li>Erklären Sie, warum Sie ein neues Handy bestellen möchten.</li>
              <li>Fragen Sie nach Empfehlungen für ein passendes Modell.</li>
              <li>Bitten Sie um Informationen zur Bestellung und Lieferung.</li>
            </ol>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
            alt="Customer writing an email to support on a laptop"
            loading="lazy"
            style={imageStyle}
          />
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lesen Sie den Text und beantworten Sie alle sieben Fragen."
            submissionNote="Submit only the answer letters in this format: 1B, 2C, 3A …"
          >
            <p style={{ margin: 0 }}>Read the complete text first. Then choose one answer, A–D, for each question.</p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1600&q=80"
            alt="Reading exercise about mobile communication in Germany"
            loading="lazy"
            style={imageStyle}
          />

          <h3 style={sectionTitle}>Telefonieren und Internet in Deutschland</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Wer in Deutschland mit seiner SIM-Karte aus der Heimat telefonieren will, hat oft Probleme. Viele Karten funktionieren in Deutschland nicht, und Telefonieren mit ausländischen SIM-Karten ist sehr teuer. Es gibt mehrere Möglichkeiten, um in Deutschland mobil zu telefonieren: Handyvertrag, Prepaid-SIM-Karte, Datentarife und WLAN.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Für einen Handyvertrag braucht man ein deutsches Bankkonto und einen Ausweis. Die Laufzeit beträgt meistens ein bis zwei Jahre. Man muss oft drei Monate vor Vertragsende kündigen, sonst verlängert sich der Vertrag automatisch.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Prepaid-SIM-Karten kann man in Supermärkten, Tankstellen oder Kiosken kaufen. Zur Aktivierung braucht man Name, Adresse, Geburtsdatum und ein Ausweisdokument mit Foto. Danach lädt man Guthaben auf.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Kostenloses Internet gibt es oft über öffentliche WLAN-Netze in Cafés, Bibliotheken oder anderen öffentlichen Gebäuden.
          </p>

          <h3 style={sectionTitle}>Fragen zum Text</h3>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Listening"
            title="Hören Sie den Beitrag und beantworten Sie alle vier Fragen."
            submissionNote="Submit only the answer letters in this format: 1B, 2B, 3A …"
          >
            <p style={{ margin: 0 }}>Read the questions first, listen carefully and select one answer, A–D, for every question.</p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80"
            alt="Listening practice with headphones and digital devices"
            loading="lazy"
            style={imageStyle}
          />

          <QuestionList questions={hoerenQuestions} />
          <p style={{ margin: 0 }}>
            Recommended video: <a href="https://youtu.be/JEJZypJfrD8?list=PLZ6nUCSTx9pKcy_IKo10vFQIlAhwFpEr5" target="_blank" rel="noreferrer">Digitale Kommunikation (A2)</a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube-nocookie.com/embed/JEJZypJfrD8?rel=0&playsinline=1"
            title="Digitale Kommunikation (A2)"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{
            title: "A2Day27DigitaleKommunikation",
            level: "A2",
            day: 27,
            workbookId: "A2Day27DigitaleKommunikation",
          }}
          workbookId="A2Day27DigitaleKommunikation"
        />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={sectionTitle}>Submit Workbook · Day 27 · Kapitel 10.27</h2>
          <WorkbookTaskCard
            eyebrow="Final step"
            title="Submit Teil 2, Teil 3 and Teil 4."
            submissionNote="Do not submit Teil 1."
          >
            <ul style={listSpacing}>
              <li><strong>Teil 2 · Schreiben:</strong> Paste your final customer-service email.</li>
              <li><strong>Teil 3 · Lesen:</strong> Paste your seven reading answer letters.</li>
              <li><strong>Teil 4 · Hören:</strong> Paste your four listening answer letters.</li>
              <li><strong>Teil 1 · Sprechen:</strong> Group practice only.</li>
            </ul>
          </WorkbookTaskCard>

          <div
            className="a2-day27-submission-page"
            style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}
          >
            <style>{`.a2-day27-submission-page > div > section:first-child { display: none !important; }
            .a2-day27-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day: 27,
                assignmentKey: "A2-10.27",
                canonicalAssignmentKey: "A2-10.27",
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
