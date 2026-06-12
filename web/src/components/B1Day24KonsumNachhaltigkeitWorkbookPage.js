import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

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

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const tabImageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
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
  "Eleni hat mit ihrer Nachbarin eine Bürgerinitiative gegründet.",
  "Sie findet, dass Kinder früh etwas über Umweltschutz lernen sollten.",
  "In Griechenland sind alle Menschen sehr umweltbewusst.",
  "Eleni meint, dass es in Deutschland zu viele unnötige Sammelstellen für Müll gibt.",
  "Altkleidersammlungen findet sie sinnvoll.",
  "Das Recyceln von Wertstoffen ist ihrer Meinung nach nutzlos.",
  "Sie mag es, wenn Sachen eine zweite Chance bekommen.",
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

const B1Day24KonsumNachhaltigkeitWorkbookPage = () => {
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
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 24 Workbook · Konsum und Nachhaltigkeit 8.24</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Chapter: 8.2 Teil 1 (Sprechen) (Group Practice)
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
            src="https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1600&q=80"
            alt="Sustainable shopping choices in a grocery store"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Zentrales Thema: Konsum und Nachhaltigkeit (B1)</h3>
          <ol style={listStyle}>
            <li>
              <strong>Konsumverhalten</strong>
              <ul style={listStyle}>
                <li>Bewusster Konsum</li>
                <li>Kulturelle Unterschiede im Konsum (z. B. in Deutschland vs. Ghana)</li>
                <li>Konsumgewohnheiten (z. B. Lebensmittel, Kleidung, Elektronik)</li>
                <li>Online-Shopping vs. stationärer Handel</li>
                <li>Trends: Minimalismus, Slow Living</li>
              </ul>
            </li>
            <li>
              <strong>Nachhaltigkeit im Alltag</strong>
              <ul style={listStyle}>
                <li>Recycling und Müllvermeidung</li>
                <li>Nachhaltige Produkte (z. B. Bioprodukte, Fair Trade)</li>
                <li>Strom- und Wassersparen</li>
                <li>Regionale Produkte kaufen</li>
                <li>Secondhand kaufen (Kleidung, Möbel)</li>
                <li>Ökologische Verpackungen (Papier statt Plastik)</li>
              </ul>
            </li>
            <li>
              <strong>Umweltschutz und Klimawandel</strong>
              <ul style={listStyle}>
                <li>Ursachen und Folgen des Klimawandels</li>
                <li>CO2-Emissionen und deren Reduzierung</li>
                <li>Erneuerbare Energien (Solar, Wind, Wasser)</li>
                <li>Mülltrennung und Kompostierung</li>
                <li>Klimaschutzorganisationen und -initiativen (z. B. Fridays for Future)</li>
              </ul>
            </li>
            <li>
              <strong>Wirtschaft und Nachhaltigkeit</strong>
              <ul style={listStyle}>
                <li>Nachhaltige Unternehmen und ihre Verantwortung</li>
                <li>Die Bedeutung der Kreislaufwirtschaft</li>
                <li>Grüne Technologien und Innovationen</li>
                <li>Fairer Handel und soziale Verantwortung</li>
                <li>Zertifikate und Siegel für nachhaltige Produkte (z. B. Bio, Fair Trade)</li>
              </ul>
            </li>
            <li>
              <strong>Verantwortung des Einzelnen</strong>
              <ul style={listStyle}>
                <li>Persönliche Entscheidungen treffen (z. B. weniger Fleisch essen, umweltfreundlich reisen)</li>
                <li>Bewusster Konsum und Vermeidung von Überkonsum</li>
                <li>Verantwortung für die Umwelt in der Familie und Gemeinschaft</li>
                <li>Bildung und Aufklärung über Nachhaltigkeit</li>
                <li>Politische Beteiligung und Einfluss auf nachhaltige Gesetze</li>
              </ul>
            </li>
            <li>
              <strong>Redemittel (für Diskussion oder Schreiben)</strong>
              <ul style={listStyle}>
                <li>Ich denke, dass Nachhaltigkeit eine wichtige Rolle spielt, weil ...</li>
                <li>Es ist notwendig, dass wir unser Konsumverhalten ändern, um ...</li>
                <li>Ein Beispiel für nachhaltigen Konsum ist ...</li>
                <li>Meiner Meinung nach sollten wir mehr auf ... achten.</li>
                <li>In Zukunft wird nachhaltiger Konsum immer wichtiger sein, weil ...</li>
              </ul>
            </li>
            <li>
              <strong>Herausforderungen und Lösungen</strong>
              <ul style={listStyle}>
                <li>Herausforderungen bei der Umsetzung von Nachhaltigkeit (Kosten, Verfügbarkeit, Gewohnheiten)</li>
                <li>Lösungsansätze (z. B. Umweltschutzgesetze, Aufklärung, innovative Produkte)</li>
                <li>Nachhaltigkeit und Wirtschaftswachstum: Konflikt oder Chance?</li>
              </ul>
            </li>
          </ol>

          <p style={{ margin: 0 }}>
            <strong>Hauptfrage:</strong> Wie wichtig ist dir Nachhaltigkeit beim Konsum, und welche Maßnahmen ergreifst du, um
            umweltbewusster zu leben?
          </p>

          <p style={{ margin: 0 }}>
            <strong>Anweisung:</strong>
          </p>
          <ul style={listStyle}>
            <li>Beschreiben Sie verschiedene Möglichkeiten, wie man nachhaltiger konsumieren kann.</li>
            <li>Nennen Sie Vor- und Nachteile und bewerten Sie diese.</li>
            <li>Beschreiben Sie eine Maßnahme zur Förderung der Nachhaltigkeit, die für Sie besonders wichtig ist.</li>
          </ul>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2 and Teil 3.
          </p>

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
            alt="Writing an opinion text about sustainability"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 - Assignment: Schreiben</h2>
          <p style={{ margin: 0 }}>
            <strong>„Ist es wichtig, beim Konsum auf Nachhaltigkeit zu achten? Schreiben Sie Ihre Meinung.“</strong>
          </p>
          <p style={{ margin: 0 }}><strong>Paul</strong></p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In der heutigen Zeit ist es immer wichtiger, nachhaltig zu konsumieren. Ich stimme dem zu, denn durch
            bewusstes Einkaufen können wir die Umwelt schützen und Ressourcen sparen. Viele Produkte, die wir kaufen,
            haben einen großen Einfluss auf die Natur, zum Beispiel durch Verpackungen oder den CO2-Ausstoß bei der
            Herstellung. Dennoch ist es manchmal schwierig, nachhaltige Alternativen zu finden, vor allem bei den
            Preisen. Ich finde, dass jeder von uns kleine Schritte machen kann, wie weniger Plastik zu verwenden oder
            Secondhand zu kaufen. Was denken Sie darüber?
          </p>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area, not directly on this page.
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
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Reading passage for environmental awareness practice"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 – Lesen</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Hallo liebe Umweltfreunde! Durch meine Nachbarin Heike habe ich über eine Bürgerinitiative in unserem Viertel
            erfahren, die sich für den Umweltschutz und für die Umwelterziehung einsetzt. Ich finde es wichtig, dass man
            sich in der eigenen Stadt für die Umwelt einsetzt und den Kindern beibringt, wie wir umweltbewusst leben
            können. Meine Tochter ist zwar erst vier Jahre alt, aber ich denke, sie sollte schon früh mitbekommen, dass wir
            nicht so weitermachen können wie bisher.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In Griechenland ist das Umweltbewusstsein leider nicht so hoch. Das finde ich an Deutschland viel besser! In
            Griechenland ist auch die Sperrmüllabholung nicht so gut organisiert wie hier. Wir schmeißen einfach alles auf
            die Straße, aber es wird nicht wirklich abgeholt, zumindest nicht regelmäßig. Manchmal liegen bei uns wirklich
            alte Möbel monatelang am Straßenrand herum.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In Deutschland stellen die Leute ihre alten Möbel gut geordnet am Abend vor der Abholung vor die Tür. Manche
            Sachen sind auch noch brauchbar. Ich habe auch schon Stühle und einen Tisch aus dem Sperrmüll geholt und
            benutze sie jetzt bei mir zu Hause. Man gibt Sachen eine zweite Chance! Hier wird man nicht blöd angeschaut,
            wenn man das macht.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ich finde es super, dass man auch Kleidung, die man vielleicht nicht mehr mag, die aber noch tragbar ist, in
            Altkleidercontainern sammelt und bedürftigen Menschen zukommen lässt. Die Container stehen überall in der Stadt
            und man kann die Sachen da reingeben. Auch dass es die Möglichkeit gibt, Einwegglas zu sammeln, und dass man
            daraus wieder neues Glas herstellt, ist genial.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In Deutschland habe ich zum ersten Mal einen Wertstoffhof und ein Schadstoffmobil kennengelernt. Es ist richtig,
            dass giftige und umweltschädliche Sachen nicht einfach in den Müll geworfen werden und dass man Teile von alten
            Elektrogeräten wiederverwendet. Das sind wir unseren Kindern schuldig! Eure Eleni
          </p>

          <h3 style={sectionTitle}>Aussagen: True oder False</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question} style={questionCardStyle}>
              <strong>{index + 1}. {question}</strong>
              <span>A) True</span>
              <span>B) False</span>
            </div>
          ))}

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final reading answers in the assignment submission area, not directly on this page.
          </p>

          <WorkbookSubmissionReminder />
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
          <h2 style={sectionTitle}>Teil 4 (Horen) (Exercise)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Please note that this is a Goethe-standard Hörverstehen (listening comprehension) test, and the answers are
            provided in the YouTube video. You are responsible for checking your own answers. The only parts that will be
            officially evaluated by the school are Lesen (reading) and Schreiben (writing). You must mark your own
            Hörverstehen results. This process will require a lot of motivation and self-discipline on your part to be
            effective. Thank you, and good luck!
          </p>
          <p style={{ margin: 0 }}>
            Link:{" "}
            <a href="https://youtu.be/zzPpGxzvJCY" target="_blank" rel="noreferrer">
              https://youtu.be/zzPpGxzvJCY
            </a>
          </p>

          <p style={{ margin: 0 }}>
            Recommended video: <a href="https://youtu.be/zzPpGxzvJCY" target="_blank" rel="noreferrer">https://youtu.be/zzPpGxzvJCY</a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/zzPpGxzvJCY"
            title="B1 Hörverstehen Konsum und Nachhaltigkeit"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <p style={{ margin: 0, color: "#4b5563" }}>
            Do not submit answers directly on this page. Use the assignment submission area.
          </p>

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default B1Day24KonsumNachhaltigkeitWorkbookPage;
