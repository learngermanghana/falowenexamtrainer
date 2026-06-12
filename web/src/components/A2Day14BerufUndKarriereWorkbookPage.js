import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
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

const lesenQuestions = [
  {
    stem: "Was lernt man in den ersten Tagen am neuen Arbeitsplatz kennen?",
    options: ["A) Die Feiertage und die Nachbarn", "B) Die Kollegen und die Arbeit", "C) Nur die Hausordnung", "D) Die Deutschprüfung"],
  },
  {
    stem: "Wie spricht man in Deutschland meist mit dem Chef?",
    options: ["A) Mit Vornamen und ‚du‘", "B) Mit Spitznamen", "C) Mit ‚Sie‘", "D) Man spricht nicht mit dem Chef"],
  },
  {
    stem: "Was ist der Betriebsrat?",
    options: ["A) Ein Trainingszentrum", "B) Eine Sicherheitsfirma", "C) Eine Arbeitnehmervertretung", "D) Der Chef"],
  },
  {
    stem: "Was gehört zum Arbeitnehmerschutz?",
    options: ["A) Gratis Urlaub in Spanien", "B) Neue Kleidung jeden Tag", "C) Arbeitskleidung, Pausen und feste Arbeitszeiten", "D) Kostenloses Frühstück"],
  },
  {
    stem: "Was bedeutet Gleitzeit?",
    options: ["A) Man arbeitet immer nachts", "B) Man arbeitet immer am Wochenende", "C) Man kann Arbeitsbeginn und -ende flexibel wählen", "D) Man arbeitet von zu Hause"],
  },
  {
    stem: "Wie viele Stunden arbeitet man in der Regel pro Woche in Vollzeit?",
    options: ["A) 20–25 Stunden", "B) 30–35 Stunden", "C) 38–40 Stunden", "D) Über 50 Stunden"],
  },
  {
    stem: "Was muss man machen, wenn man Urlaub möchte?",
    options: ["A) Einfach zu Hause bleiben", "B) Den Urlaub eintragen und genehmigen lassen", "C) Den Chef anrufen", "D) Eine Reise buchen"],
  },
  {
    stem: "Was bekommt man im Urlaub?",
    options: ["A) Nichts", "B) Halbes Gehalt", "C) Urlaubsgeld vom Staat", "D) Weiter das Gehalt oder den Lohn"],
  },
  {
    stem: "Was macht man bei Krankheit?",
    options: ["A) Nichts", "B) Urlaub nehmen", "C) Sofort den Arbeitgeber informieren und zum Arzt gehen", "D) Einfach zu Hause bleiben"],
  },
  {
    stem: "In welchen Berufen trägt man oft spezielle Kleidung?",
    options: ["A) Im Büro", "B) Als Lehrer", "C) Auf der Baustelle oder am Flughafen", "D) Als Koch zu Hause"],
  },
  {
    stem: "Was muss man bei einer Kündigung beachten?",
    options: ["A) Den Arbeitgeber ignorieren", "B) Die Kündigung mündlich machen", "C) Die Kündigung schriftlich und mit Frist einreichen", "D) Eine WhatsApp schreiben"],
  },
  {
    stem: "Wo kann man sich gut weiterbilden?",
    options: ["A) In der Kneipe", "B) Bei der Polizei", "C) In der Volkshochschule", "D) Im Park"],
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

const A2Day14BerufUndKarriereWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
  });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 14 Workbook · Beruf und Karriere</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          3-part workbook: group speaking, writing and reading practice.
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

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
            alt="Professionals discussing career plans in an office meeting"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing <strong>„Mein Beruf und meine Zukunft“</strong>.
          </p>

          <h3 style={sectionTitle}>A2-Mindmap: „Mein Beruf und meine Zukunft“</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Was ist dein Beruf?</strong>
              <ul style={listSpacing}>
                <li>Beruf: „Ich bin ...“</li>
                <li>Arbeitsplatz: „Ich arbeite in ...“</li>
                <li>Tätigkeiten: „Ich mache ...“</li>
                <li>Teamarbeit oder allein: „Ich arbeite gern im Team/allein.“</li>
              </ul>
            </li>
            <li>
              <strong>Wie bist du zu diesem Job gekommen?</strong>
              <ul style={listSpacing}>
                <li>Ausbildung oder Studium: „Ich habe eine Ausbildung/ein Studium als ... gemacht.“</li>
                <li>Warum dieser Job: „Ich interessiere mich für ...“</li>
                <li>Bewerbung: „Ich habe mich bei ... beworben.“</li>
                <li>Erfahrung oder Praktikum: „Ich habe ein Praktikum bei ... gemacht.“</li>
              </ul>
            </li>
            <li>
              <strong>Was möchtest du in Zukunft machen?</strong>
              <ul style={listSpacing}>
                <li>Karrierepläne: „Ich möchte ... werden.“</li>
                <li>Weiterbildung: „Ich möchte eine Weiterbildung machen.“</li>
                <li>Neuer Job oder neues Land: „Ich möchte in ... arbeiten.“</li>
                <li>Ziele: „In 5 Jahren möchte ich ...“</li>
              </ul>
            </li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f9fafb" }}>
            <strong>Beispielantwort</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Ich bin Krankenschwester und arbeite in einem Krankenhaus. Ich bin zu diesem Job gekommen, weil ich eine
              Ausbildung in der Pflege gemacht habe. In Zukunft möchte ich mich weiterbilden und vielleicht in einer
              anderen Stadt arbeiten.“
            </p>
          </div>

          <h3 style={sectionTitle}>Hauptfrage</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Was ist dein Beruf, wie bist du zu diesem Job gekommen und was möchtest du in Zukunft machen?
          </p>

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

          <SpeakingPracticeTimerCard />

          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute spreche ich über Beruf und Karriere. Für mich ist ein guter Arbeitsplatz wichtig, weil ich dort viel Zeit verbringe. Ich möchte nette Kollegen und klare Aufgaben haben. Außerdem möchte ich weiterlernen, deshalb besuche ich Deutschkurse und übe neue Wörter. Zum Beispiel kann ich später eine Weiterbildung machen oder eine bessere Stelle suchen. Zum Schluss finde ich: Karriere braucht Geduld, Motivation und gute Kommunikation.“
            </p>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>
          <CourseInlinePracticePanel
            type="speaking"
          />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Writing a formal career-related letter"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Schreiben Sie einen formellen Brief an Ihren Kollegen. Er hat Ihnen ein berufliches Seminar vorgeschlagen, das
            Ihre Karriere fördern könnte.
          </p>
          <p style={{ margin: 0 }}><strong>Aufgabenstellung:</strong></p>
          <ol style={listSpacing}>
            <li>Bedanken Sie sich für den Vorschlag.</li>
            <li>Zeigen Sie, dass Sie interessiert sind.</li>
            <li>Fragen Sie nach weiteren Details (Inhalt, Termine, Kosten).</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>

          <CourseInlinePracticePanel
            type="writing"
          />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80"
            alt="Employee reading workplace guidelines and notes"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section
            at the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Lesetext: Arbeiten in Deutschland</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In den ersten Tagen am neuen Arbeitsplatz lernen Sie Ihre Kolleginnen und Kollegen sowie die Arbeitsabläufe
            kennen. Oft kann man den Kolleginnen und Kollegen nach einigen Tagen das „Du“ anbieten. Beim Vorgesetzten,
            also dem Chef oder der Chefin, ist das anders: Zu ihm oder ihr sagt man fast immer „Sie“. Das kann jedoch von
            Firma zu Firma unterschiedlich sein. Um Ihr Deutsch für den Arbeitsplatz zu verbessern, können Sie die Webseite
            des Goethe-Instituts nutzen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In Deutschland gibt es einen umfangreichen Arbeitnehmerschutz. Das bedeutet, dass sich die Firma an bestimmte
            gesetzliche Vorgaben zur Sicherheit und Gesundheit der Arbeitnehmer halten muss. Dazu gehören unter anderem
            das Tragen von spezieller Arbeitskleidung, regelmäßige Pausen und geregelte Arbeitszeiten. In größeren
            Unternehmen gibt es häufig eine Arbeitnehmervertretung, den sogenannten Betriebsrat. Wenn es Probleme gibt,
            können Sie sich an den Betriebsrat wenden.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Die Arbeitszeiten richten sich nach der Art des Berufs. Als Krankenschwester oder Krankenpfleger in einem
            Krankenhaus arbeitet man zum Beispiel im Schichtdienst. In einem Büro hingegen gibt es meist feste Arbeitszeiten.
            Viele Büros bieten auch Gleitzeit an. Die normale Wochenarbeitszeit liegt zwischen 38 und 40 Stunden. Jeder
            Arbeitnehmer hat Anspruch auf Urlaubstage im Jahr. Während des Urlaubs wird das Gehalt weitergezahlt. Wenn Sie
            krank sind, müssen Sie den Arbeitgeber sofort informieren und einen Arzt aufsuchen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In bestimmten Berufen muss man Arbeitskleidung tragen, zum Beispiel auf Baustellen oder am Flughafen. Wenn Sie
            nicht mehr für Ihre Firma arbeiten möchten oder können, müssen Sie schriftlich kündigen und die Kündigungsfrist
            beachten. Für Fort- und Weiterbildung bieten besonders Volkshochschulen viele Kurse an.
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

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}
    </div>
  );
};

export default A2Day14BerufUndKarriereWorkbookPage;
