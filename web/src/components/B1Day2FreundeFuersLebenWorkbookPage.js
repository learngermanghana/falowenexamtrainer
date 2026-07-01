import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff", display: "grid", gap: 6 };
const tabImageStyle = { width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" };
const audioPreviewStyle = { width: "100%", minHeight: 220, border: 0, borderRadius: 10 };

const speakingBranches = [
  { title: "Eigenschaften von Freunden", items: ["Vertrauen", "Ehrlichkeit", "Loyalität", "Humor", "Unterstützung", "Respekt", "Gemeinsame Interessen"] },
  { title: "Wie Freundschaften entstehen", items: ["In der Schule", "Auf der Arbeit", "Im Verein", "Online", "Durch gemeinsame Aktivitäten", "Durch schwierige Zeiten"] },
  { title: "Wichtige Erlebnisse", items: ["Gemeinsame Reisen", "Unterstützung in schweren Zeiten", "Feiern und Feste", "Gemeinsame Hobbys", "Geheimnisse teilen", "Konflikte lösen"] },
  { title: "Freundschaft in verschiedenen Kulturen", items: ["Direkte und offene Kommunikation", "Unterstützung in der Gemeinschaft", "Unterschiedliche Erwartungen und Traditionen"] },
  { title: "Freundschaften im digitalen Zeitalter", items: ["Soziale Medien", "Virtuelle Freundschaften", "Online-Gruppen", "Persönliche Treffen", "Technologie und Kommunikation"] },
];

const lesenQuestions = [
  { stem: "Was ist laut dem Essay ein wesentlicher Aspekt einer wahren Freundschaft?", options: ["a) Gemeinsame Interessen", "b) Vertrauen", "c) Abenteuerlust"] },
  { stem: "Wie unterstützt ein wahrer Freund den anderen in schwierigen Zeiten?", options: ["a) Durch Ignorieren", "b) Emotional, finanziell oder praktisch", "c) Durch Kritik"] },
  { stem: "Warum sind gemeinsame Interessen wichtig?", options: ["a) Sie schaffen gemeinsame Erlebnisse und Erinnerungen", "b) Sie verhindern Konflikte", "c) Sie ermöglichen Streitigkeiten"] },
  { stem: "Warum ist Ehrlichkeit in einer Freundschaft wichtig?", options: ["a) Sie hilft, Missverständnisse zu vermeiden", "b) Sie schafft Konflikte", "c) Sie ist unwichtig"] },
  { stem: "Was sollte man tun, wenn ein Freund einen Fehler macht?", options: ["a) Den Fehler ignorieren", "b) Den Fehler vergeben und hinter sich lassen", "c) Den Freund verlassen"] },
  { stem: "Welche Rolle spielt Respekt in einer Freundschaft?", options: ["a) Er ist unwichtig", "b) Er stärkt die individuelle Freiheit", "c) Er verhindert Kommunikation"] },
  { stem: "Was ist die Grundlage für eine stabile Freundschaft laut dem Essay?", options: ["a) Abenteuer und Spaß", "b) Vertrauen, Unterstützung, Ehrlichkeit, gemeinsame Interessen und Vergebung", "c) Gleiche Karriereziele"] },
];

const hoerenQuestions = [
  { stem: "Was tut ein guter Freund, wenn man Probleme hat?", options: ["a) Hört zu und gibt Ratschläge", "b) Ignoriert die Probleme", "c) Verurteilt den Freund"] },
  { stem: "Welche Aktivitäten stärken die Bindung zwischen Freunden?", options: ["a) Gemeinsame Erlebnisse und Erinnerungen", "b) Individuelle Interessen", "c) Keine gemeinsamen Aktivitäten"] },
  { stem: "Warum ist Ehrlichkeit wichtig in einer Freundschaft?", options: ["a) Sie vermeidet Missverständnisse", "b) Sie schafft Konflikte", "c) Sie ist unwichtig"] },
  { stem: "Wie sollte ein Freund auf die Erfolge des anderen reagieren?", options: ["a) Mit Eifersucht", "b) Mit Freude", "c) Mit Gleichgültigkeit"] },
  { stem: "Was ist entscheidend bei Konflikten oder Missverständnissen?", options: ["a) Fehler zu ignorieren", "b) Fehler zu vergeben", "c) Freundschaft zu beenden"] },
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
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const B1Day2FreundeFuersLebenWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 2 · Kapitel 1.2</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Freunde fürs Leben – Workbook</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4 below. Each section begins with the exact question or assignment you must complete.
        </p>
        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80" alt="Friends together for a B1 workbook about lifelong friendship" loading="lazy" style={tabImageStyle} />
        <WorkbookTabNav activeTab={activeTab} onChange={setActiveTab} tabs={STANDARD_WORKBOOK_TABS} ariaLabel="B1 Day 2 workbook sections" />
      </div>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Was macht eine Freundschaft für dich besonders?"
            practiceOnly
            submissionNote="Prepare a 60–90 second answer for class. Teil 1 is not submitted."
          >
            <p style={{ margin: 0 }}>
              Nenne mindestens <strong>drei wichtige Eigenschaften</strong> einer guten Freundschaft, gib ein persönliches Beispiel und erkläre, wie man Konflikte lösen kann.
            </p>
          </WorkbookTaskCard>
          <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80" alt="Group discussion about friendship" loading="lazy" style={tabImageStyle} />
          <p style={{ margin: 0, color: "#475569" }}>Use the idea cards below as support. You do not need to answer every item separately.</p>
          <div style={{ display: "grid", gap: 10 }}>
            {speakingBranches.map((branch) => (
              <div key={branch.title} style={questionCardStyle}>
                <strong>{branch.title}</strong>
                <ul style={listSpacing}>{branch.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
          <h3 style={sectionTitle}>Suggested answer structure</h3>
          <ol style={listSpacing}>
            <li>Stelle das Thema kurz vor.</li>
            <li>Nenne drei wichtige Eigenschaften.</li>
            <li>Gib ein persönliches Beispiel.</li>
            <li>Erkläre, wie Freunde Konflikte lösen können.</li>
            <li>Formuliere einen kurzen Schluss.</li>
          </ol>
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Schreiben Sie eine E-Mail über einen Freund fürs Leben."
            submissionNote="Write approximately 80 words and submit your final email through the Submit tab."
          >
            <p style={{ margin: 0 }}>Sie haben einen Freund fürs Leben gefunden und möchten einer anderen Freundin darüber berichten.</p>
            <ul style={listSpacing}>
              <li>Wie haben Sie sich kennengelernt?</li>
              <li>Warum ist diese Freundschaft besonders für Sie? Begründen Sie.</li>
              <li>Machen Sie einen Vorschlag für ein Treffen.</li>
            </ul>
          </WorkbookTaskCard>
          <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80" alt="Writing an email about friendship" loading="lazy" style={tabImageStyle} />
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
            title="Lesen Sie den Essay und beantworten Sie alle sieben Fragen."
            submissionNote="Submit only the answer letters in this format: 1B, 2A, 3C ..."
          >
            <p style={{ margin: 0 }}>Read the complete text first. Then select one answer, A–C, for each question.</p>
          </WorkbookTaskCard>
          <img src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1600&q=80" alt="Reading exercise about true friendship" loading="lazy" style={tabImageStyle} />
          <h3 style={sectionTitle}>Essay: Was bedeutet es, ein wahrer Freund zu sein?</h3>
          {[
            "Freundschaft ist eine der wichtigsten Beziehungen im Leben eines Menschen. Ein wahrer Freund ist jemand, auf den man sich verlassen kann, der in guten und schlechten Zeiten für einen da ist. Aber was bedeutet es wirklich, ein wahrer Freund zu sein?",
            "Ein wesentlicher Aspekt einer wahren Freundschaft ist das Vertrauen. Ohne Vertrauen kann keine Freundschaft bestehen. Vertrauen bedeutet, dass man sicher sein kann, dass der Freund ehrlich ist und Geheimnisse bewahrt. Es bedeutet auch, dass man sich auf den Freund verlassen kann, wenn man ihn braucht.",
            "Ein weiterer wichtiger Punkt ist die Unterstützung. Ein wahrer Freund unterstützt einen in schwierigen Zeiten und freut sich über die Erfolge des anderen. Diese Unterstützung kann in verschiedenen Formen kommen, sei es emotional, finanziell oder praktisch.",
            "Gemeinsame Interessen und Aktivitäten stärken die Freundschaft ebenfalls. Sie schaffen gemeinsame Erlebnisse und Erinnerungen, die die Freundschaft festigen. Allerdings müssen Freunde nicht immer alles gemeinsam machen. Respekt vor den individuellen Interessen und Freiheiten ist ebenso wichtig.",
            "Ehrlichkeit und Kommunikation sind ebenfalls entscheidend. Ein wahrer Freund sagt die Wahrheit, auch wenn es schwierig ist. Ehrliche Kommunikation hilft, Missverständnisse zu vermeiden und die Beziehung zu stärken.",
            "Schließlich ist Vergebung ein wesentlicher Bestandteil einer wahren Freundschaft. Jeder macht Fehler, und es ist wichtig, diese Fehler zu vergeben und hinter sich zu lassen. Eine Freundschaft, die auf Vergebung basiert, wird mit der Zeit stärker.",
            "Insgesamt bedeutet es, ein wahrer Freund zu sein, sich gegenseitig zu vertrauen, zu unterstützen, gemeinsame Interessen zu pflegen, ehrlich zu kommunizieren und zu vergeben. Diese Elemente bilden die Grundlage für eine stabile und erfüllende Freundschaft.",
          ].map((paragraph) => <p key={paragraph} style={{ margin: 0, lineHeight: 1.7 }}>{paragraph}</p>)}
          <h3 style={sectionTitle}>Questions</h3>
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
            title="Hören Sie den Beitrag zweimal und beantworten Sie alle fünf Fragen."
            submissionNote="Submit only the answer letters in this format: 1A, 2B, 3C ..."
          >
            <p style={{ margin: 0 }}>Read the questions before listening. Pay attention to support, shared experiences, honesty, success and forgiveness.</p>
          </WorkbookTaskCard>
          <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80" alt="Listening exercise about friendship" loading="lazy" style={tabImageStyle} />
          <p style={{ margin: 0 }}>Audio – <a href="https://drive.google.com/file/d/1Xfaxwgg2dCZmPGduDl_Amhasi6t8HbxO/view?usp=sharing" target="_blank" rel="noreferrer">Open listening audio</a></p>
          <iframe title="Listening exercise" src="https://drive.google.com/file/d/1Xfaxwgg2dCZmPGduDl_Amhasi6t8HbxO/preview" allow="autoplay" style={audioPreviewStyle} />
          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={hoerenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day2FreundeFuersLeben", level: "B1", day: 2, workbookId: "B1Day2FreundeFuersLeben" }} workbookId="B1Day2FreundeFuersLeben" />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={sectionTitle}>Submit workbook answers</h2>
          <WorkbookTaskCard eyebrow="Final step" title="Submit Teil 2, Teil 3 and Teil 4." submissionNote="Do not submit Teil 1.">
            <p style={{ margin: 0 }}>Paste your final email, seven reading answer letters and five listening answer letters into the form below.</p>
          </WorkbookTaskCard>
          <div className="b1-day2-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day2-submission-page > div > section:first-child { display: none !important; }
            .b1-day2-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage submissionContext={{ level: "B1", day: 2, assignmentKey: "B1-1.2", canonicalAssignmentKey: "B1-1.2" }} />
          </div>
        </section>
      )}
    </div>
  );
};

export default B1Day2FreundeFuersLebenWorkbookPage;
