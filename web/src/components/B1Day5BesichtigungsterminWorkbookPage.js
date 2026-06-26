import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { styles } from "../styles";

const tabs = [
  { key: "sprechen", label: "Teil 1" },
  { key: "schreiben", label: "Teil 2" },
  { key: "lesen", label: "Teil 3" },
  { key: "hoeren", label: "Teil 4" },
  { key: "references", label: "5. Ref" },
  { key: "submit", label: "6. Submit" },
];

const card = { ...styles.card, display: "grid", gap: 14 };
const sectionTitle = { margin: 0, fontSize: "1.15rem" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const questionCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 13,
  background: "#fff",
  display: "grid",
  gap: 7,
};

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: { border: "#bfdbfe", background: "#eff6ff", color: "#1e3a8a" },
    green: { border: "#bbf7d0", background: "#f0fdf4", color: "#166534" },
    amber: { border: "#fde68a", background: "#fffbeb", color: "#92400e" },
  };
  const selected = tones[tone] || tones.blue;
  return (
    <div style={{ border: `1px solid ${selected.border}`, background: selected.background, color: selected.color, borderRadius: 13, padding: 13, lineHeight: 1.7 }}>
      {children}
    </div>
  );
};

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const speakingBranches = [
  {
    title: "1. Sehenswürdigkeiten",
    items: [
      "Historische Gebäude",
      "Museen und Galerien",
      "Natur- und Nationalparks",
      "Denkmäler und Wahrzeichen",
      "Schlösser und Burgen",
      "Moderne Architektur",
    ],
  },
  {
    title: "2. Vorbereitung der Besichtigung",
    items: [
      "Informationen recherchieren",
      "Tickets buchen",
      "Beste Reisezeit wählen",
      "Führung oder allein besichtigen?",
      "Wetter prüfen",
      "Notwendige Dinge mitnehmen",
    ],
  },
  {
    title: "3. Erfahrungen während der Besichtigung",
    items: [
      "Audioguides und Führungen",
      "Interessante Fakten lernen",
      "Fotos machen",
      "Menschenmengen und Wartezeiten",
      "Essen und Souvenirs",
      "Kulturelle Unterschiede entdecken",
    ],
  },
  {
    title: "4. Herausforderungen und Probleme",
    items: [
      "Sprachbarrieren",
      "Orientierungsschwierigkeiten",
      "Hohe Eintrittspreise",
      "Überfüllte Sehenswürdigkeiten",
      "Zeitmanagement",
      "Wetterprobleme",
    ],
  },
  {
    title: "5. Reflexion und Empfehlung",
    items: [
      "Was hat mir gefallen?",
      "Würde ich es weiterempfehlen?",
      "Was habe ich gelernt?",
      "Was würde ich anders machen?",
      "Tipps für andere Besucher",
      "Vergleich mit anderen Besichtigungen",
    ],
  },
];

const readingQuestions = [
  {
    stem: "1. Wann fand der Besichtigungstermin statt?",
    options: ["a) Am Freitag um 14:00 Uhr", "b) Am Samstag um 14:00 Uhr", "c) Am Sonntag um 15:00 Uhr", "d) Am Samstag um 16:00 Uhr"],
  },
  {
    stem: "2. Wie wurde die Wohnung beschrieben?",
    options: ["a) Klein und dunkel", "b) Hell und geräumig", "c) Alt und renovierungsbedürftig", "d) Eng und dunkel"],
  },
  {
    stem: "3. Was gefiel Anna besonders an der Wohnung?",
    options: ["a) Die Lage", "b) Die Badewanne", "c) Der Boden", "d) Die Fenster"],
  },
  {
    stem: "4. Wie hoch war die verlangte Kaution?",
    options: ["a) Eine Monatsmiete", "b) Zwei Monatsmieten", "c) Drei Monatsmieten", "d) Vier Monatsmieten"],
  },
  {
    stem: "5. Wann wäre die Wohnung verfügbar?",
    options: ["a) Ab dem ersten des nächsten Monats", "b) Sofort", "c) In zwei Monaten", "d) Ab dem nächsten Jahr"],
  },
  {
    stem: "6. Welche Vertragsdauer wurde besprochen?",
    options: ["a) Sechs Monate", "b) Ein Jahr", "c) Zwei Jahre", "d) Drei Jahre"],
  },
  {
    stem: "7. Wie reagierte Anna am nächsten Tag?",
    options: [
      "a) Sie entschied sich, die Wohnung nicht zu nehmen.",
      "b) Sie wollte mehr Zeit zum Überlegen.",
      "c) Sie entschied sich, die Wohnung zu mieten.",
      "d) Sie konnte den Vermieter nicht erreichen.",
    ],
  },
];

const listeningQuestions = [
  {
    stem: "1. Wann beginnen die Besichtigungstermine oft?",
    options: ["a) Am frühen Morgen", "b) Am späten Abend", "c) Am Nachmittag", "d) Mittags"],
  },
  {
    stem: "2. Was ist ein Vorteil von Gruppenbesichtigungen?",
    options: [
      "a) Man kann die Wohnung in Ruhe besichtigen.",
      "b) Der Vermieter spart Zeit.",
      "c) Man hat weniger Konkurrenz.",
      "d) Man sieht weniger von der Wohnung.",
    ],
  },
  {
    stem: "3. Worauf achten viele Interessenten während der Besichtigung?",
    options: [
      "a) Nur auf die Inneneinrichtung",
      "b) Auf das Umfeld und die Nachbarschaft",
      "c) Nur auf den Preis",
      "d) Auf die Farbe der Wände",
    ],
  },
  {
    stem: "4. Warum sollten Interessenten schnell entscheiden, ob sie die Wohnung nehmen wollen?",
    options: [
      "a) Weil die Besichtigung anstrengend ist.",
      "b) Weil sie sonst die nächste Besichtigung verpassen.",
      "c) Weil die Wohnung schnell vergeben sein könnte.",
      "d) Weil der Vermieter keine Zeit hat.",
    ],
  },
  {
    stem: "5. Welche Unterlagen sollten Interessenten zur Besichtigung mitbringen?",
    options: [
      "a) Mietvertrag",
      "b) Gehaltsnachweise und Mieterselbstauskunft",
      "c) Ausweis und Passfoto",
      "d) Möbelkatalog",
    ],
  },
];

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question) => (
      <div key={question.stem} style={questionCard}>
        <strong>{question.stem}</strong>
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

export default function B1Day5BesichtigungsterminWorkbookPage() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 5 · Kapitel 2.5</span>
        <h1 style={{ ...styles.title, margin: 0 }}>Der Besichtigungstermin – Workbook</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Sprich über Besichtigungen, vereinbare einen Termin höflich, lies über eine Wohnungsbesichtigung und trainiere das Hörverstehen.
        </p>
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80"
          alt="Wohnungsbesichtigung und Terminplanung"
          loading="lazy"
          style={{ width: "100%", borderRadius: 14, maxHeight: 290, objectFit: "cover" }}
        />
        <NoteBox>
          <strong>Grammar focus:</strong> höfliche Terminvereinbarung mit <em>könnte, würde, wäre</em> und indirekten Fragen mit <em>ob, wann, wo</em> und <em>wie</em>.
        </NoteBox>

        <div
          role="tablist"
          aria-label="B1 Day 5 workbook sections"
          style={{ display: "flex", gap: 8, overflowX: "auto", padding: 8, position: "sticky", top: 8, zIndex: 20, border: "1px solid #bfdbfe", borderRadius: 12, background: "#eff6ff" }}
        >
          {tabs.map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.key)}
                style={{ ...styles.secondaryButton, background: selected ? "#2563eb" : "#fff", borderColor: selected ? "#2563eb" : "#93c5fd", color: selected ? "#fff" : "#1d4ed8", fontWeight: 800, flex: "0 0 auto", minWidth: 82 }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In diesem Kapitel diskutiert ihr in der Gruppe verschiedene Arten von Besichtigungen, die Vorbereitung, Erfahrungen, Probleme und Empfehlungen.
          </p>

          <NoteBox tone="amber">
            <strong>Zentrales Thema:</strong> Besichtigung
          </NoteBox>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            {speakingBranches.map((branch) => (
              <article key={branch.title} style={{ ...questionCard, background: "#f8fafc" }}>
                <strong>{branch.title}</strong>
                <ul style={listStyle}>{branch.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>

          <div style={{ ...questionCard, background: "#eef2ff", borderColor: "#c7d2fe" }}>
            <strong>Thema: Eine Besichtigung erleben</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Du hast nur <strong>30 €</strong> und einen Tag Zeit. Wohin machst du einen Ausflug: in die Natur oder in die Stadt?
              Begründe deine Entscheidung mit zwei Argumenten und passenden Beispielen.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            <div style={questionCard}>
              <strong>Antwortstruktur</strong>
              <ol style={listStyle}>
                <li>Einleitung und Entscheidung</li>
                <li>Erstes Argument mit Beispiel</li>
                <li>Zweites Argument mit Beispiel</li>
                <li>Kurzer Vergleich</li>
                <li>Schluss und Empfehlung</li>
              </ol>
            </div>
            <div style={questionCard}>
              <strong>Nützliche Redemittel</strong>
              <ul style={listStyle}>
                <li>Ich würde lieber … besuchen, weil …</li>
                <li>Ein wichtiger Grund ist, dass …</li>
                <li>Zum Beispiel könnte man …</li>
                <li>Im Vergleich dazu …</li>
                <li>Deshalb würde ich … empfehlen.</li>
              </ul>
            </div>
          </div>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      ) : null}

      {activeTab === "schreiben" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben</h2>
          <div style={{ ...questionCard, background: "#eff6ff", borderColor: "#bfdbfe" }}>
            <strong>Aufgabe: E-Mail – Besichtigungstermin in Accra vereinbaren</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Schreiben Sie eine höfliche E-Mail an den Vermieter. Schreiben Sie ungefähr <strong>80–100 Wörter</strong>.
            </p>
            <strong>Bearbeiten Sie diese Punkte:</strong>
            <ol style={listStyle}>
              <li><strong>Grund:</strong> Sie interessieren sich für die Wohnung und möchten einen Besichtigungstermin vereinbaren.</li>
              <li><strong>Terminvorschlag:</strong> Fragen Sie nach einem möglichen Termin oder schlagen Sie selbst einen Termin vor.</li>
              <li><strong>Kontakt:</strong> Bitten Sie um eine Bestätigung und erklären Sie, wie der Vermieter Sie erreichen kann.</li>
            </ol>
          </div>

          <div style={{ ...questionCard, background: "#f8fafc" }}>
            <strong>Empfohlene E-Mail-Struktur</strong>
            <ol style={listStyle}>
              <li>Betreff</li>
              <li>Höfliche Anrede</li>
              <li>Interesse an der Wohnung</li>
              <li>Höfliche Terminanfrage oder Terminvorschlag</li>
              <li>Bitte um Bestätigung und Kontaktdaten</li>
              <li>Höflicher Schluss</li>
            </ol>
          </div>

          <NoteBox tone="green">
            <strong>Sprachziel:</strong> Verwenden Sie mindestens zwei höfliche Strukturen, zum Beispiel:
            „Könnten Sie mir einen Termin anbieten?“ und „Wäre Samstag um 14 Uhr möglich?“
          </NoteBox>

          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </section>
      ) : null}

      {activeTab === "lesen" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 3 · Lesen (Exercise)</h2>
          <h3 style={{ margin: 0 }}>Eine Wohnungsbesichtigung in der Innenstadt</h3>

          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Anna hatte schon lange nach einer passenden Wohnung in der Innenstadt gesucht. Als sie endlich eine Anzeige für eine
            vielversprechende Wohnung fand, zögerte sie nicht und rief sofort den Vermieter an, um einen Besichtigungstermin zu
            vereinbaren. Der Vermieter war sehr freundlich und vereinbarte mit Anna einen Termin für den kommenden Samstag um 14:00 Uhr.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Am Tag der Besichtigung machte sich Anna früh auf den Weg, um sicherzustellen, dass sie pünktlich ankommt. Die Wohnung
            befand sich in einem alten, aber gut erhaltenen Gebäude im Herzen der Stadt. Die Lage war perfekt – in der Nähe gab es
            viele Geschäfte, Restaurants und öffentliche Verkehrsmittel. Anna war beeindruckt.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Als sie das Gebäude betrat, wurde sie von einem leichten Duft von frischen Blumen im Treppenhaus begrüßt. Der Vermieter
            wartete bereits auf sie und führte sie in die Wohnung. Die Wohnung war hell und geräumig. Die großen Fenster ließen viel
            Licht herein, und die hohen Decken gaben dem Raum ein luftiges Gefühl. Anna konnte sich sofort vorstellen, hier zu wohnen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Der Vermieter erklärte ihr, dass die Wohnung kürzlich renoviert worden war. Die Küche war modern und gut ausgestattet,
            und das Badezimmer hatte eine große Badewanne, was Anna besonders gefiel. Die Wände waren frisch gestrichen, und der Boden
            war aus hochwertigem Holz. Es gab auch einen kleinen Balkon, von dem aus man einen schönen Blick auf die Stadt hatte.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Nachdem Anna die Wohnung besichtigt hatte, setzte sie sich mit dem Vermieter zusammen, um die Mietkonditionen zu besprechen.
            Die Miete war fair, und der Vermieter verlangte eine Kaution in Höhe von zwei Monatsmieten. Anna fragte auch nach den
            Nebenkosten, die ebenfalls in einem vernünftigen Rahmen lagen. Der Vermieter erklärte, dass die Wohnung ab dem ersten des
            nächsten Monats verfügbar sei und dass sie eine Mietvertragsdauer von mindestens einem Jahr vereinbaren müssten.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Anna war begeistert von der Wohnung und wollte sie unbedingt mieten. Der Vermieter bat sie, eine Entscheidung bis zum
            nächsten Tag zu treffen, da es auch andere Interessenten gab. Anna bedankte sich für die ausführliche Besichtigung und das
            Gespräch. Sie ging mit gemischten Gefühlen nach Hause, da sie die Wohnung wirklich wollte, aber sich auch der Verpflichtung
            bewusst war, die ein Mietvertrag mit sich bringt.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Am nächsten Tag rief Anna den Vermieter an und sagte ihm, dass sie die Wohnung nehmen würde. Sie vereinbarten einen weiteren
            Termin, um den Mietvertrag zu unterschreiben und die Kaution zu übergeben. Anna konnte es kaum erwarten, in ihr neues Zuhause
            einzuziehen und ihr Leben in der Innenstadt zu genießen.
          </p>

          <h3 style={sectionTitle}>Multiple-Choice-Fragen</h3>
          <QuestionList questions={readingQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      ) : null}

      {activeTab === "hoeren" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Exercise)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Hören Sie den Beitrag zweimal. Lesen Sie zuerst die Fragen und achten Sie auf Uhrzeit, Gruppenbesichtigung,
            Nachbarschaft, schnelle Entscheidungen und notwendige Unterlagen.
          </p>

          <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", background: "#111827" }}>
            <iframe
              src="https://drive.google.com/file/d/1BhpLaVrqLIgLkD9OVwsHhedjBwLTPet9/preview"
              title="B1 Day 5 Besichtigungstermin Hören"
              allow="autoplay"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          </div>
          <a
            href="https://drive.google.com/file/d/1BhpLaVrqLIgLkD9OVwsHhedjBwLTPet9/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.linkButton, width: "fit-content" }}
          >
            Open audio in Google Drive
          </a>

          <h3 style={sectionTitle}>Multiple-Choice-Fragen</h3>
          <QuestionList questions={listeningQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      ) : null}

      {activeTab === "references" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Reference answers</h2>
          <NoteBox tone="amber">
            Nutze die Referenz erst, nachdem du die Aufgaben selbst bearbeitet hast.
          </NoteBox>

          <div style={questionCard}>
            <strong>Teil 2 · Beispiel-E-Mail</strong>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              <strong>Betreff: Besichtigungstermin für die Wohnung in Accra</strong><br /><br />
              Sehr geehrter Herr Mensah,<br /><br />
              ich interessiere mich sehr für Ihre Wohnung in Accra und würde sie gern besichtigen. Könnten Sie mir bitte
              mitteilen, wann ein Termin möglich wäre? Für mich wäre Samstag um 14 Uhr besonders passend. Alternativ könnte
              ich auch am Montagabend kommen. Bitte bestätigen Sie mir den Termin per E-Mail. Sie erreichen mich außerdem
              telefonisch unter 024 000 0000.<br /><br />
              Mit freundlichen Grüßen<br />
              Ama Boateng
            </p>
          </div>

          <div style={questionCard}>
            <strong>Teil 3 · Lesen</strong>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              1. b · 2. b · 3. b · 4. b · 5. a · 6. b · 7. c
            </p>
          </div>

          <div style={questionCard}>
            <strong>Teil 4 · Hören</strong>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              Höre den Originalbeitrag erneut und kontrolliere deine Auswahl anhand der Aussagen im Audio. Für diesen
              Hörtext wurde noch kein bestätigter Lösungsschlüssel bereitgestellt.
            </p>
          </div>
        </section>
      ) : null}

      {activeTab === "submit" ? (
        <section style={card}>
          <h2 style={sectionTitle}>Submit workbook answers</h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
            Submit your final Schreiben, Lesen and Hören answers for B1 Day 5.
          </p>
          <div className="b1-day5-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day5-submission-page > div > section:first-child { display: none !important; }
            .b1-day5-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "B1",
                day: 5,
                assignmentKey: "B1-2.5",
                canonicalAssignmentKey: "B1-2.5",
              }}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
