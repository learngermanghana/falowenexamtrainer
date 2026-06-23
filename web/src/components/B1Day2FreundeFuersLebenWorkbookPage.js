import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "5. Ref" },
];

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff", display: "grid", gap: 6 };
const tabImageStyle = { width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" };
const audioPreviewStyle = { width: "100%", minHeight: 220, border: 0, borderRadius: 10 };

const speakingBranches = [
  { title: "Eigenschaften von Freunden (Qualities of Friends)", items: ["Vertrauen (Trust)", "Ehrlichkeit (Honesty)", "Loyalität (Loyalty)", "Humor (Sense of humor)", "Unterstützung (Support)", "Respekt (Respect)", "Gemeinsame Interessen (Shared interests)"] },
  { title: "Wie Freundschaften entstehen (How Friendships Develop)", items: ["In der Schule (In school)", "Auf der Arbeit (At work)", "Im Verein (In a club)", "Online (Online)", "Durch gemeinsame Aktivitäten (Through shared activities)", "Durch schwierige Zeiten (Through difficult times)"] },
  { title: "Wichtige Erlebnisse in Freundschaften (Important Experiences in Friendships)", items: ["Gemeinsame Reisen (Traveling together)", "Unterstützung in schweren Zeiten (Supporting each other in tough times)", "Feiern und Feste (Celebrating and partying)", "Gemeinsame Hobbys und Interessen (Shared hobbies and interests)", "Geheimnisse teilen (Sharing secrets)", "Konflikte lösen (Resolving conflicts)"] },
  { title: "Freundschaft in verschiedenen Kulturen (Friendship in Different Cultures)", items: ["In Deutschland: Freundschaften sind oft direkter und offener; man trifft sich regelmäßig.", "In Ghana: Freundschaften entstehen oft durch Familie; gemeinsame Unterstützung in der Gemeinschaft ist wichtig.", "In anderen Ländern: Es gibt unterschiedliche Erwartungen und Traditionen."] },
  { title: "Freundschaften im digitalen Zeitalter (Friendships in the Digital Age)", items: ["Soziale Medien: Facebook, Instagram, WhatsApp", "Virtuelle Freundschaften (Virtual friendships)", "Online-Gruppen und Foren (Online groups and forums)", "Die Bedeutung von persönlichen Treffen (The importance of face-to-face meetings)", "Einfluss von Technologie auf Kommunikation (Impact of technology on communication)"] },
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

function TabButton({ active, onClick, children }) {
  return <button type="button" onClick={onClick} style={{ ...styles.secondaryButton, borderColor: active ? "#2563eb" : "#d1d5db", background: active ? "#eff6ff" : "#fff", color: active ? "#1d4ed8" : "#111827" }}>{children}</button>;
}

const PreparedCheckbox = ({ checked, onChange }) => <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}><input type="checkbox" checked={checked} onChange={onChange} />I prepared this part.</label>;

const QuestionList = ({ questions }) => <div style={{ display: "grid", gap: 10 }}>{questions.map((question, index) => <div key={question.stem} style={questionCardStyle}><strong>{index + 1}. {question.stem}</strong>{question.options.map((option) => <span key={option}>{option}</span>)}</div>)}</div>;

const B1Day2FreundeFuersLebenWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <div style={card}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 2 Workbook · Freunde fürs Leben</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>4-part workbook: group speaking, writing, reading and listening practice.</p>
      <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80" alt="Friends together for a B1 workbook about lifelong friendship" loading="lazy" style={tabImageStyle} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tabs.map((tab) => <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>{tab.label}</TabButton>)}</div>
      <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
    </div>

    <A2B1WorkbookGuidance />

    {activeTab === "sprechen" && <div style={card}>
      <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80" alt="Group discussion about friendship" loading="lazy" style={tabImageStyle} />
      <h2 style={sectionTitle}>Teil 1 (Group Practice) · Freunde fürs Leben</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>
      <h3 style={sectionTitle}>Brain Map Instructions</h3>
      <ol style={listSpacing}><li><strong>Central Topic:</strong> Write <strong>„Freunde fürs Leben“</strong> in the center of your brain map.</li><li><strong>Main Branches:</strong> Create five main branches from the central topic.</li><li><strong>Sub-Branches:</strong> Expand each branch with examples, vocabulary, and phrases.</li></ol>
      <div style={{ display: "grid", gap: 10 }}>{speakingBranches.map((branch) => <div key={branch.title} style={questionCardStyle}><strong>{branch.title}</strong><ul style={listSpacing}>{branch.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>
      <h3 style={sectionTitle}>Gruppendiskussion: Freunde fürs Leben</h3>
      <p style={{ margin: 0 }}><strong>Frage des Tages:</strong> Was macht eine Freundschaft für dich besonders?</p>
      <ol style={listSpacing}><li><strong>Einleitung:</strong> Stelle das Thema kurz vor.</li><li><strong>Vorteile:</strong> Was ist positiv? Welche Vorteile hat eine besondere Freundschaft?</li><li><strong>Nachteile:</strong> Gibt es auch Nachteile oder schwierige Seiten?</li><li><strong>Deine Meinung:</strong> Was denkst du persönlich? Warum?</li></ol>
      <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is only for group discussion and has no assignment submission.</p>
      <CourseInlinePracticePanel type="speaking" />
      <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
    </div>}

    {activeTab === "schreiben" && <div style={card}>
      <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80" alt="Writing an email about friendship" loading="lazy" style={tabImageStyle} />
      <h2 style={sectionTitle}>Teil 2 (Schreiben) (Assignment)</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Schreiben Sie eine E-Mail (circa <strong>80 Wörter</strong>).</p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Sie haben einen Freund fürs Leben gefunden und möchten einer anderen Freundin darüber berichten. Schreiben Sie über die folgenden Punkte:</p>
      <ul style={listSpacing}><li>Wie haben Sie sich kennengelernt?</li><li>Warum ist diese Freundschaft besonders für Sie? Begründen Sie.</li><li>Machen Sie einen Vorschlag für ein Treffen.</li></ul>
      <CourseInlinePracticePanel type="writing" />
      <WorkbookSubmissionReminder />
      <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
    </div>}

    {activeTab === "lesen" && <div style={card}>
      <img src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1600&q=80" alt="Reading exercise about true friendship" loading="lazy" style={tabImageStyle} />
      <h2 style={sectionTitle}>Teil 3 (Lesen) (Exercise)</h2>
      <p style={{ margin: 0 }}>Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Final answers should be submitted in the submission area.</p>
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
      <h3 style={sectionTitle}>Multiple-Choice Questions</h3>
      <QuestionList questions={lesenQuestions} />
      <WorkbookSubmissionReminder />
      <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
    </div>}

    {activeTab === "hoeren" && <div style={card}>
      <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80" alt="Listening exercise about friendship" loading="lazy" style={tabImageStyle} />
      <h2 style={sectionTitle}>Teil 4 (Hören) (Exercise)</h2>
      <p style={{ margin: 0 }}>Audio – <a href="https://drive.google.com/file/d/1Xfaxwgg2dCZmPGduDl_Amhasi6t8HbxO/view?usp=sharing" target="_blank" rel="noreferrer">Open listening audio</a></p>
      <iframe title="Listening exercise" src="https://drive.google.com/file/d/1Xfaxwgg2dCZmPGduDl_Amhasi6t8HbxO/preview" allow="autoplay" style={audioPreviewStyle} />
      <h3 style={sectionTitle}>Multiple-Choice Questions</h3>
      <QuestionList questions={hoerenQuestions} />
      <WorkbookSubmissionReminder />
      <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
    </div>}

    {activeTab === "references" && <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day2FreundeFuersLeben", level: "B1", workbookId: "B1Day2FreundeFuersLeben" }} workbookId="B1Day2FreundeFuersLeben" />}
  </div>;
};

export default B1Day2FreundeFuersLebenWorkbookPage;
