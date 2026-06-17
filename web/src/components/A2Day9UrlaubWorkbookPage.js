import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "5. Ref" },
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

const calloutStyle = {
  ...questionCardStyle,
  background: "#f8fafc",
};

const lesenQuestions = [
  {
    stem: "1. Was kann man in Bibliotheken machen?",
    options: [
      "a) Nur Bücher kaufen",
      "b) Musik hören, Bücher lesen, Filme sehen oder ausleihen",
      "c) Nur CDs anhören",
      "d) Nur Filme anschauen",
    ],
  },
  {
    stem: "2. Wo kann man Sprach- oder Tanzkurse machen?",
    options: ["a) Im Supermarkt", "b) In der Stadtverwaltung", "c) An der Volkshochschule", "d) Im Museum"],
  },
  {
    stem: "3. Was machen Menschen in Vereinen?",
    options: [
      "a) Sie wohnen zusammen.",
      "b) Sie arbeiten dort.",
      "c) Sie treffen sich, weil sie gemeinsame Interessen haben.",
      "d) Sie lernen Deutsch.",
    ],
  },
  {
    stem: "4. Wo kann man besondere Pflanzen sehen?",
    options: ["a) Im Kino", "b) Im Zoo", "c) Im botanischen Garten", "d) Im Supermarkt"],
  },
  {
    stem: "5. Was ist normalerweise kostenlos?",
    options: [
      "a) Der Eintritt in Zoos",
      "b) Der Besuch von Parks und Spielplätzen",
      "c) Der Fernseher zu Hause",
      "d) Die Internetverbindung",
    ],
  },
  {
    stem: "6. Wie viel kostet die monatliche Gebühr für Fernsehen und Radio?",
    options: ["a) 7,98 Euro", "b) 10,50 Euro", "c) 17,98 Euro", "d) Es ist immer kostenlos"],
  },
  {
    stem: "7. Wo findet man Informationen zum Grillen auf dem Balkon?",
    options: ["a) In der Schule", "b) In der Zeitung", "c) In der Hausordnung", "d) Im Fernseher"],
  },
];

const hoerenQuestions = [
  {
    stem: "1. Wohin ist Anna im letzten Sommerurlaub gereist?",
    options: ["a) Italien", "b) Griechenland", "c) Spanien"],
  },
  {
    stem: "2. Wie lange blieb Anna auf Kreta?",
    options: ["a) Eine Woche", "b) Zwei Wochen", "c) Drei Tage"],
  },
  {
    stem: "3. Was hat Anna besonders gut gefallen?",
    options: ["a) Die Altstadt von Chania", "b) Der Strand von Elafonissi", "c) Die Berge"],
  },
  {
    stem: "4. Was haben Anna und ihre Freunde am letzten Tag gemacht?",
    options: ["a) Eine Wanderung", "b) Eine Bootstour", "c) Einen Museumsbesuch"],
  },
  {
    stem: "5. Was hofft Anna bald wieder zu tun?",
    options: ["a) Nach Kreta zu reisen", "b) Nach Italien zu reisen", "c) Nach Spanien zu reisen"],
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

const A2Day9UrlaubWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 9 Workbook · Urlaub 4.9</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: group speaking, writing, reading, and listening practice focused on vacation planning,
          travel choices, and holiday experiences.
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
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
            alt="Sunny beach destination for vacation speaking practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <SpeakingMindMap config={getA2SpeakingMindMap(9)} />
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing these travel and vacation topics. Use the
            idea map below to organize vocabulary, compare options, and prepare for speaking in class.
          </p>

          <div style={calloutStyle}>
            <h3 style={{ ...sectionTitle, fontSize: "1rem" }}>Sprechen wie bei einer Mini-Präsentation</h3>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Sprich in 4 klaren Schritten: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
            </p>
            <ol style={listSpacing}>
              <li>
                <strong>Einleitung:</strong> Sage kurz, worüber du sprichst.
              </li>
              <li>
                <strong>Hauptteil:</strong> Nenne dein Reiseziel, Verkehrsmittel, Unterkunft und Aktivitäten. Verbinde
                die Sätze mit einfachen Wörtern wie <em>und, oder, weil, deshalb</em>.
              </li>
              <li>
                <strong>Beispiel:</strong> Gib ein konkretes Beispiel aus einem Urlaub oder deinem Plan.
              </li>
              <li>
                <strong>Schluss:</strong> Beende deinen Beitrag mit einem klaren letzten Satz.
              </li>
            </ol>
          </div>

          <h3 style={sectionTitle}>Phrase-Bank für Teil 1</h3>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div style={questionCardStyle}>
              <strong>Gute Einleitungen</strong>
              <span>Heute spreche ich über meinen Urlaub.</span>
              <span>Ich möchte kurz von meinem Reiseziel erzählen.</span>
              <span>Ich erzähle, wohin ich reisen möchte.</span>
            </div>
            <div style={questionCardStyle}>
              <strong>Verbindungswörter / Connectors</strong>
              <span>und</span>
              <span>oder</span>
              <span>weil</span>
              <span>deshalb</span>
            </div>
            <div style={questionCardStyle}>
              <strong>Eigene Meinung ausdrücken</strong>
              <span>Ich finde ... sehr interessant.</span>
              <span>Meiner Meinung nach ist ... besser.</span>
              <span>Ich mag ... , weil ...</span>
            </div>
            <div style={questionCardStyle}>
              <strong>Gute Schlüsse</strong>
              <span>Zum Schluss kann ich sagen: Das ist mein Traumurlaub.</span>
              <span>Deshalb möchte ich diese Reise machen.</span>
              <span>Danke fürs Zuhören.</span>
            </div>
          </div>

          <SpeakingPracticeTimerCard />

          <div style={calloutStyle}>
            <strong>Kurzes Modell (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Heute spreche ich über meinen Traumurlaub. Ich möchte nach Spanien reisen und ich fahre mit dem Flugzeug.
              Dort möchte ich in einem kleinen Hotel am Strand wohnen. Ich mache eine Stadtbesichtigung oder ich gehe
              schwimmen. Ich mag Spanien, weil das Wetter warm ist und das Essen sehr gut ist. Letztes Jahr war ich in
              Valencia, deshalb möchte ich wieder dorthin fahren. Zum Schluss kann ich sagen: Das ist für mich der
              perfekte Urlaub.
            </p>
          </div>

          <h3 style={sectionTitle}>1. Reiseziele (Travel Destinations)</h3>
          <ul style={listSpacing}>
            <li>
              <strong>Städte (Cities):</strong> Berlin, München, Wien, Accra, Johannesburg, Nairobi, Cairo
            </li>
            <li>
              <strong>Natur (Nature):</strong>
              <ul style={listSpacing}>
                <li>Berge (Mountains): Alpen, Kilimandscharo, Atlasgebirge</li>
                <li>See (Lakes): Bodensee, Victoriasee, Malawisee</li>
                <li>Strand (Beaches): Côte d&apos;Azur, Sansibar, Kapstadt</li>
              </ul>
            </li>
            <li>
              <strong>Länder (Countries):</strong> Italien, Spanien, Frankreich, Ghana, Südafrika, Kenia, Ägypten,
              Marokko
            </li>
            <li>
              <strong>Besondere Orte (Special Places):</strong>
              <ul style={listSpacing}>
                <li>Nationalparks: Serengeti (Tansania), Krüger-Nationalpark (Südafrika), Mole-Nationalpark (Ghana)</li>
                <li>
                  Sehenswürdigkeiten: Pyramiden von Gizeh (Ägypten), Tafelberg (Südafrika), Cape Coast Castle (Ghana)
                </li>
                <li>Museen: Louvre (Frankreich), Apartheid Museum (Südafrika), National Museum of Ghana (Ghana)</li>
              </ul>
            </li>
          </ul>

          <h3 style={sectionTitle}>2. Transportmittel (Means of Transport)</h3>
          <ul style={listSpacing}>
            <li>Auto (Car)</li>
            <li>Zug (Train)</li>
            <li>Flugzeug (Airplane)</li>
            <li>Bus (Bus)</li>
            <li>Fahrrad (Bicycle)</li>
            <li>Boot (Boat)</li>
          </ul>

          <h3 style={sectionTitle}>3. Unterkunft (Accommodation)</h3>
          <ul style={listSpacing}>
            <li>Hotel</li>
            <li>Jugendherberge (Hostel)</li>
            <li>Ferienwohnung (Holiday apartment)</li>
            <li>Campingplatz (Campground)</li>
            <li>Pension (Guesthouse)</li>
          </ul>

          <h3 style={sectionTitle}>4. Aktivitäten (Activities)</h3>
          <ul style={listSpacing}>
            <li>Besichtigungen machen (Sightseeing)</li>
            <li>Am Strand liegen (Relaxing on the beach)</li>
            <li>Wandern (Hiking)</li>
            <li>Lokale Spezialitäten essen (Eating local specialties)</li>
            <li>Safari machen (Going on a safari)</li>
            <li>Tauchen oder Schnorcheln (Diving or snorkeling)</li>
          </ul>

          <h3 style={sectionTitle}>5. Reisevorbereitung (Travel Preparation)</h3>
          <ul style={listSpacing}>
            <li>Koffer packen (Packing luggage)</li>
            <li>Reisepass und Visum (Passport and visa)</li>
            <li>Flugtickets buchen (Booking flight tickets)</li>
            <li>Reiseversicherung abschließen (Getting travel insurance)</li>
            <li>Reiseführer kaufen (Buying a travel guide)</li>
            <li>Impfungen (Vaccinations)</li>
          </ul>

          <h3 style={sectionTitle}>Final Tasks</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Plan Your Ideal Vacation:</strong> Write about your dream vacation using the brain map categories.
              Include the destination, activities, and accommodation.
              <div style={{ marginTop: 8 }}>
                <em>
                  Beispiel: Ich möchte nach Ghana reisen. Ich besuche den Mole-Nationalpark und mache eine Safari. Ich
                  bleibe in einem Hotel in Accra und esse lokale Spezialitäten wie Jollof-Reis.
                </em>
              </div>
            </li>
            <li>
              <strong>Role-Playing Dialogue:</strong> Imagine booking a vacation. Use phrases like: <em>Ich möchte nach
              ... reisen.</em>, <em>Gibt es Angebote für ...?</em>, <em>Ich möchte eine Safari machen.</em>, and <em>Wie
              viel kostet das?</em>
            </li>
          </ol>

          <h3 style={sectionTitle}>Group Speaking Prompt</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Wohin reist du gern und warum?</strong>
          </p>
          <p style={{ margin: 0 }}>Use these guiding ideas in your discussion: Urlaub · Reiseziel · Verkehrsmittel · Erlebnis</p>

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
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
            alt="Traveler planning a hotel booking email before vacation"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Formal Letter Writing Task: Urlaub</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie planen einen Urlaub und möchten eine Unterkunft reservieren. Schreiben Sie eine E-Mail an ein Hotel:
          </p>
          <ol style={listSpacing}>
            <li>Fragen Sie nach einem freien Zimmer.</li>
            <li>Geben Sie an, was für Sie wichtig ist (z. B. Datum, Anzahl der Personen, Art des Zimmers).</li>
            <li>Fragen Sie nach den Preisen und den zusätzlichen Leistungen (z. B. Frühstück, Internetzugang).</li>
          </ol>

          <div style={calloutStyle}>
            <strong>Writing practice guidance</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Draft your message first, check that your request is polite and complete, and then submit your final answer
              in the assignment submission area below the lesson — not directly on this page.
            </p>
          </div>

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
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1600&q=80"
            alt="Traveler reading cultural information while planning leisure activities"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text carefully and complete your answers in the submission area, <strong>not directly on this page.</strong>
          </p>

          <h3 style={sectionTitle}>Kultur und Freizeit in Deutschland</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Kultur</strong>
            <br />
            Sie mögen Kultur? In den meisten Städten gibt es Museen, Kinos, Theater und Konzertveranstaltungen. Immer
            mehr Kinos zeigen internationale Filme in der Originalversion (OV). In den Bibliotheken oder
            Stadtbüchereien können Sie kostenlos oder für wenig Geld Bücher lesen, Musik hören und Filme sehen. Sie
            können die Bücher, Filme und CDs auch ausleihen: Sie nehmen sie mit nach Hause und bringen sie später
            wieder zurück.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Volkshochschulen, Vereine und Clubs</strong>
            <br />
            An vielen Orten gibt es Volkshochschulen. Dort finden Sie vor allem Kurse für Erwachsene, zum Beispiel
            Tanzkurse oder Sprachkurse. Sie machen gern Sport? Auch dazu gibt es Kurse an den Volkshochschulen. Aber
            Sie können auch in ein Schwimmbad oder in einen Sportverein gehen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Eine andere Möglichkeit sind Vereine und Clubs. In einem Verein sind Menschen mit den gleichen Interessen
            und Zielen zusammen. Es gibt zum Beispiel Musikvereine, Sportvereine, Kochclubs oder Computerclubs. Es
            gibt Vereine für Erwachsene und für Jugendliche. Für Eltern und Kinder gibt es oft kostenlose Angebote. Für
            kleine Kinder finden Sie zum Beispiel an manchen Orten Spielgruppen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Parks und Natur</strong>
            <br />
            Sie sind gerne draußen? In jeder Stadt gibt es Parks. Für Kinder gibt es viele Spielplätze. Der Besuch ist
            meistens kostenlos. In botanischen Gärten können Sie besondere Pflanzen sehen. Tiere aus aller Welt kann
            man im Zoo besuchen. Botanische Gärten und Zoos kosten normalerweise etwas. Außerdem gibt es in vielen
            Regionen Seen, Wälder oder Berge, vielleicht wohnen Sie sogar in der Nähe vom Meer.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Im eigenen Zuhause</strong>
            <br />
            Zu Hause sehen die meisten Leute gern fern oder hören Radio. Jeder Haushalt in Deutschland muss sein Radio
            und seinen Fernseher anmelden und dafür eine monatliche Gebühr bezahlen. Im Moment sind das 17,98 Euro im
            Monat. Wenn man sehr wenig Geld hat, muss man nichts zahlen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Vielleicht gibt es in Ihrem Haus einen Hof oder einen Balkon. Dort darf man nicht immer alles machen. Zum
            Beispiel darf man nicht in allen Häusern auf dem Balkon grillen. In der Hausordnung finden Sie alle
            Informationen dazu. Informationen über die Freizeitmöglichkeiten finden Sie auch auf der Internetseite Ihrer
            Stadt/ Ihres Wohnorts.
          </p>

          <h3 style={sectionTitle}>Fragen zum Text</h3>
          {lesenQuestions.map((question) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
            alt="Traveler listening to vacation audio practice while planning a trip"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Listen carefully and submit your answers in the assignment submission area, not directly on this page.
          </p>

          <CoursebookAudioPlayer
            url="https://drive.google.com/file/d/1vRaCrQl4QtmYwT8K04JM_A2srofY_d84/view?usp=sharing"
            linkLabel="Open listening audio"
          />

          <h3 style={sectionTitle}>Fragen</h3>
          {hoerenQuestions.map((question) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="A2" lesson={{ title: "A2Day9Urlaub", level: "A2", workbookId: "A2Day9Urlaub" }} workbookId="A2Day9Urlaub" />
      )}

    </div>
  );
};

export default A2Day9UrlaubWorkbookPage;
