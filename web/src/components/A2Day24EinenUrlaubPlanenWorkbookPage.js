import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
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

const phraseGridStyle = { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" };

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Aufgabe 1: Sarah heiratet bald und möchte mit vielen Gästen in einem Lokal feiern.",
    options: ["A) a", "B) b", "C) c", "D) f"],
  },
  {
    stem: "Aufgabe 2: Petra will mit Geschäftspartnern in der Stadt essen gehen und über die Arbeit sprechen.",
    options: ["A) a", "B) c", "C) d", "D) f"],
  },
  {
    stem: "Aufgabe 3: Jens feiert seinen Geburtstag zu Hause und möchte guten Wein anbieten.",
    options: ["A) b", "B) c", "C) d", "D) X"],
  },
  {
    stem: "Aufgabe 4: Karsten lädt am Abend Gäste zu sich nach Hause ein, möchte aber nicht kochen.",
    options: ["A) a", "B) b", "C) e", "D) f"],
  },
  {
    stem: "Aufgabe 5: Gabriele und ihre Tochter feiern Kindergeburtstag und möchten Kuchen essen gehen.",
    options: ["A) a", "B) d", "C) e", "D) f"],
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

const A2Day24EinenUrlaubPlanenWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 24 Workbook · Einen Urlaub planen 9.24</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: speaking, writing, reading, and listening practice focused on planning a vacation.
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
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
            alt="Travelers planning vacation destinations with maps"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <SpeakingMindMap config={getA2SpeakingMindMap(24)} />
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing these topics. There is no sprechen
            assignment submission for this part.
          </p>

          <h3 style={sectionTitle}>Central Topic</h3>
          <ul style={listSpacing}>
            <li>Write <strong>"Urlaub planen"</strong> in the center of your brain map.</li>
          </ul>

          <h3 style={sectionTitle}>Main Branches &amp; Sub-Branches</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Reiseziel und Zeitraum (Destination &amp; Timeframe)</strong>
              <ul style={listSpacing}>
                <li>Land oder Stadt: Spanien, Italien, Hamburg, Wien (country or city: Spain, Italy, Hamburg, Vienna)</li>
                <li>Art des Reiseziels: Strand, Berge, Stadturlaub (type of destination: beach, mountains, city trip)</li>
                <li>Dauer: ein Wochenende, eine Woche, zwei Wochen (duration: a weekend, one week, two weeks)</li>
                <li>Beste Reisezeit: Sommer, Winter, Ferien, Feiertage (best travel time: summer, winter, holidays, public holidays)</li>
              </ul>
            </li>
            <li>
              <strong>Budget (Budget)</strong>
              <ul style={listSpacing}>
                <li>Gesamtkosten planen: 500 €, 1000 € usw. (plan total costs: €500, €1000, etc.)</li>
                <li>Transportkosten: Flugtickets, Zugtickets, Benzin (transport costs: flight tickets, train tickets, petrol/gas)</li>
                <li>Unterkunftskosten: Hotel pro Nacht, Airbnb, Hostel (accommodation costs: hotel per night, Airbnb, hostel)</li>
                <li>Essen und Aktivitäten: Restaurantbesuche, Eintrittskarten (food and activities: restaurant visits, entrance tickets)</li>
              </ul>
            </li>
            <li>
              <strong>Transportmittel (Means of Transport)</strong>
              <ul style={listSpacing}>
                <li>Flugzeug, Zug, Bus, Auto (plane, train, bus, car)</li>
                <li>Fahrrad – für kurze Strecken oder Ausflüge vor Ort (bicycle — for short distances or local trips)</li>
              </ul>
            </li>
            <li>
              <strong>Unterkunft (Accommodation)</strong>
              <ul style={listSpacing}>
                <li>Hotel (mit Frühstück?), Hostel oder Jugendherberge (hotel with breakfast?, hostel or youth hostel)</li>
                <li>Campingplatz, Ferienwohnung, Pension (campsite, vacation apartment, guesthouse)</li>
              </ul>
            </li>
            <li>
              <strong>Aktivitäten (Activities)</strong>
              <ul style={listSpacing}>
                <li>Sightseeing: Museen, historische Gebäude, Stadttouren (sightseeing: museums, historic buildings, city tours)</li>
                <li>Sport und Freizeit: Wandern, Schwimmen, Radfahren (sports and free time: hiking, swimming, cycling)</li>
                <li>Entspannung: Am Strand liegen, Wellness, Spa (relaxation: lying on the beach, wellness, spa)</li>
                <li>Kultur erleben: Konzerte, Theater, lokale Feste (experiencing culture: concerts, theater, local festivals)</li>
                <li>Lokale Spezialitäten probieren: Restaurants, Märkte (trying local specialties: restaurants, markets)</li>
              </ul>
            </li>
            <li>
              <strong>Gepäck &amp; Vorbereitung (Luggage &amp; Preparation)</strong>
              <ul style={listSpacing}>
                <li>Dokumente: Reisepass/Personalausweis, Tickets, Versicherung (documents: passport/ID card, tickets, insurance)</li>
                <li>Kleidung: Wetter prüfen, passende Outfits (clothing: check the weather, suitable outfits)</li>
                <li>Geld wechseln / Kreditkarte vorbereiten (exchange money / prepare a credit card)</li>
                <li>Reiseapotheke: Medikamente, Pflaster (travel first-aid kit: medicine, plasters/bandages)</li>
                <li>Reiseversicherung abschließen (take out travel insurance)</li>
              </ul>
            </li>
          </ol>

          <div style={calloutStyle}>
            <strong>Group speaking prompt</strong>
            <p style={{ margin: 0 }}>
              <em>Wohin möchtest du reisen und wie planst du deinen Urlaub?</em>
            </p>
            <p style={{ margin: 0 }}>Keywords: Reiseziel · Transportmittel · Unterkunft · Aktivitäten</p>
          </div>

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
                <li><strong>und</strong> · „Ich lerne Deutsch und ich übe jeden Tag.“</li>
                <li><strong>oder</strong> · „Ich mache Sport oder ich treffe Freunde.“</li>
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
              „Heute spreche ich über einen Urlaub. Ich möchte ans Meer fahren, weil ich Sonne und Ruhe mag. Zuerst buche ich ein Hotel und dann kaufe ich ein Ticket. Außerdem plane ich Ausflüge, deshalb ist der Urlaub nicht stressig. Zum Beispiel möchte ich am Strand spazieren gehen und lokale Spezialitäten essen. Zum Schluss finde ich: Gute Planung ist wichtig, aber man braucht auch freie Zeit.“
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
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing an email to plan a vacation"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie möchten zusammen mit Sandra einen Urlaub planen. Schreiben Sie ihr eine E-Mail:
          </p>
          <ol style={listSpacing}>
            <li>Laden Sie Sandra ein, gemeinsam eine Reise zu planen, und erklären Sie den Grund.</li>
            <li>Schlagen Sie vor, wann und wo Sie sich treffen können, um die Planung zu besprechen.</li>
            <li>Bitten Sie Sandra um ihre Meinung zu Ihrer Idee.</li>
          </ol>

          <div style={calloutStyle}>
            <strong>Writing practice guidance</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Plan your email first (opening, key details, closing), then submit your final answer in the assignment
              submission area — not directly on this page.
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
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80"
            alt="Reading local restaurant advertisements for matching exercise"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Internet-Anzeigen: Sechs Personen suchen im Internet nach Lokalen. Lesen Sie die Aufgaben und die Anzeigen
            a bis f. Welche Anzeige passt zu welcher Person? Für eine Aufgabe gibt es keine Lösung: Schreiben Sie X.
            Beispiel 0: d.
          </p>

          <h3 style={sectionTitle}>Anzeigen (a–f)</h3>
          <ul style={listSpacing}>
            <li><strong>a:</strong> Park-Café mit Torten, Kuchen, italienischem Eis, Sonnenterrasse und Spielplatz.</li>
            <li><strong>b:</strong> Catering für Hochzeiten/private Feiern; Essen, Möbel, Deko, Service, Kinderbetreuung.</li>
            <li><strong>c:</strong> Weinhaus mit internationalen Spezialitäten, 3-Gänge-Menü, ruhigem Garten, Raum für kleine Feiern.</li>
            <li><strong>d:</strong> Café am Fluss, großes Frühstück am Wochenende, samstags Live-Musik am Abend.</li>
            <li><strong>e:</strong> Towabu Indoor-Spiel + Spaß; Kindergeburtstagspartys mit Programm.</li>
            <li><strong>f:</strong> Ausflugsrestaurant am See; norddeutsche Küche; Räume bis 150 Personen für Feiern.</li>
          </ul>

          <h3 style={sectionTitle}>Aufgaben</h3>
          {lesenQuestions.map((question) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your selected letters in the submission area (not on this page).
          </p>

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=1600&q=80"
            alt="Student listening to German practice video with headphones"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Please be aware that this is a Goethe-standard Hörverstehen test, and the answers are already provided in
            the YouTube video. You are responsible for checking your own answers.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            The only parts that will be officially evaluated by the school are Lesen (reading) and Schreiben (writing).
            You must mark your own Hören (listening) results.
          </p>

          <iframe
            title="A2 Day 24 Hören video"
            src="https://www.youtube.com/embed/iPScKV6JWaA"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={videoPreviewStyle}
          />

          <a href="https://youtu.be/iPScKV6JWaA" target="_blank" rel="noreferrer">
            Open Teil 4 Hören video in YouTube
          </a>

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      <div style={{ ...card, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
        <h2 style={{ ...sectionTitle, color: "#1e3a8a" }}>Final submission</h2>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#1e3a8a" }}>
          Submit your final answers in the submission area. Do not submit answers directly on this workbook page.
        </p>
        <a href="/campus/course?submitWork=1" target="_blank" rel="noreferrer">
          Go to submission area
        </a>
      </div>

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="A2" lesson={{ title: "A2Day24EinenUrlaubPlanen", level: "A2", workbookId: "A2Day24EinenUrlaubPlanen" }} workbookId="A2Day24EinenUrlaubPlanen" />
      )}

    </div>
  );
};

export default A2Day24EinenUrlaubPlanenWorkbookPage;
