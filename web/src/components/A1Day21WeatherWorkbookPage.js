import React from "react";
import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";
import { styles } from "../styles";

const headerImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80";

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const questionBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const adBox = {
  border: "1px solid #d1d5db",
  borderRadius: 12,
  padding: 14,
  background: "#f9fafb",
  display: "grid",
  gap: 6,
};

const highlight = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 12,
  padding: 14,
};

const WeatherWorkbookContent = () => (
  <div style={{ display: "grid", gap: 16 }} data-a1-day21-weather-workbook-content="true">
    <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
      <img
        src={headerImage}
        alt="Sunny travel destination"
        style={{ width: "100%", height: 200, objectFit: "cover" }}
      />
      <div style={{ padding: 16 }}>
        <h2 style={{ margin: 0 }}>Lesen & Schreiben – A1 Practice</h2>
        <p style={{ margin: 0 }}>
          Read carefully, choose the correct answers, and complete the writing task.
        </p>
      </div>
    </div>

    <section style={card}>
      <h2>Teil 1 · Anzeigen</h2>
      <p>
        <b>Instruction:</b> Read each question and choose the correct option.
      </p>

      <div style={card}>
        <h3>Anzeige A</h3>
        <div style={adBox}>
          <b>Sommerurlaub in Spanien</b>
          <div>📍 Costa Brava</div>
          <div>📅 1. Juli – 31. August</div>
          <div>☀️ 25°C – 30°C</div>
          <div>✈️ Flug: Berlin, Hamburg, München</div>
          <div>🏨 Hotel oder Ferienwohnung</div>
          <div>🎡 Strände, Freizeitparks, Märkte</div>
        </div>

        <h3>Anzeige B</h3>
        <div style={adBox}>
          <b>Winterurlaub in Österreich</b>
          <div>📍 Tirol</div>
          <div>📅 1. Dezember – 31. Januar</div>
          <div>❄️ -5°C bis 5°C</div>
          <div>🚆 Zug: Frankfurt, Stuttgart, Wien</div>
          <div>🏔️ Berghütte oder Hotel</div>
          <div>⛷️ Skifahren, Thermen, Weihnachtsmärkte</div>
        </div>
      </div>

      {[
        "Du möchtest im Sommer an den Strand gehen und warmes Wetter genießen.",
        "Du liebst Skifahren und möchtest Winterurlaub machen.",
        "Du suchst ein Hotel in Spanien für deinen Urlaub.",
      ].map((question, index) => (
        <div key={question} style={questionBox}>
          <b>{index + 1}. {question}</b>
          <div>A. Anzeige A</div>
          <div>B. Anzeige B</div>
        </div>
      ))}

      <div style={card}>
        <h3>Anzeige A</h3>
        <div style={adBox}>
          <b>Arbeiten am Meer in Griechenland</b>
          <div>📍 Kreta</div>
          <div>📅 Ganzjährig</div>
          <div>🌊 Direkt am Strand</div>
          <div>💼 Gastronomie, Tourismus, Hotel</div>
          <div>✈️ Flug: Frankfurt, Berlin, Düsseldorf</div>
          <div>🏠 Mitarbeiterwohnung</div>
        </div>

        <h3>Anzeige B</h3>
        <div style={adBox}>
          <b>Berufschancen in Kanada</b>
          <div>📍 Vancouver</div>
          <div>📅 Ganzjährig</div>
          <div>🌊 Pazifikküste</div>
          <div>💻 IT, Gesundheit, Bildung</div>
          <div>🏠 Firmenwohnung oder eigene Unterkunft</div>
        </div>
      </div>

      {[
        "Du möchtest am Meer arbeiten in der Gastronomie.",
        "Du willst im IT-Bereich arbeiten und in einer multikulturellen Stadt leben.",
        "Du möchtest in Kanada arbeiten und nahe der Pazifikküste leben.",
      ].map((question, index) => (
        <div key={question} style={questionBox}>
          <b>{index + 4}. {question}</b>
          <div>A. Anzeige A</div>
          <div>B. Anzeige B</div>
        </div>
      ))}
    </section>

    <section style={card}>
      <h2>Teil 2 · Nachricht</h2>

      <div style={highlight}>
        <p><b>Liebe Freunde,</b></p>
        <p>
          Ich habe tolle Neuigkeiten! Es gibt spannende Jobangebote im Ausland.
        </p>

        <p><b>Jobangebot 1:</b> Mallorca (Spanien)</p>
        <p>
          Jobs: Kellner, Koch, Reinigungskraft • Unterkunft: Hotelzimmer •
          Wetter: sonnig • Sprachkurs: Spanisch
        </p>

        <p><b>Jobangebot 2:</b> Toronto (Kanada)</p>
        <p>
          Jobs: Verkäufer, Büroassistent • Unterkunft: WG/Apartments •
          multikulturell • Englischkurs
        </p>

        <p>Liebe Grüße, Felix</p>
      </div>

      {[
        "Wo kannst du im Sommer als Kellner oder Koch arbeiten?",
        "Welche Stadt bietet Englischkurse und Stadtbesichtigungen?",
        "Welche Unterkunft gibt es in Kanada?",
      ].map((question, index) => (
        <div key={question} style={questionBox}>
          <b>{index + 7}. {question}</b>
          <div>A. Option A</div>
          <div>B. Option B</div>
        </div>
      ))}
    </section>

    <section style={card}>
      <h2>Teil 3 · Schreiben</h2>

      <div style={highlight}>
        <p>
          Schreiben Sie eine E-Mail an Bina. Sie hat Sie zur Hochzeit eingeladen,
          aber Sie können nicht kommen.
        </p>

        <ul>
          <li>Warum schreiben Sie?</li>
          <li>Warum können Sie nicht kommen? (Wetter-Grund)</li>
          <li>Was schlagen Sie vor?</li>
        </ul>

        <p style={{ marginBottom: 6 }}>
          <strong>Introduction tip (canceling an exam appointment):</strong>{" "}
          Always use this reason when canceling an exam appointment: Ich schreibe Ihnen, weil ich den Termin absagen möchte.
        </p>
        <p style={{ marginBottom: 6 }}>
          <strong>Request tip (English):</strong> Use this request: Könnten wir einen anderen Termin vereinbaren?
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Body tip:</strong> Schreiben Sie im Hauptteil über das Wetter
          (z. B. starker Regen, Sturm oder Schnee) als Grund.
        </p>
      </div>
    </section>
  </div>
);

const A1Day21WeatherWorkbookPage = () => (
  <A1TutorMarkedWorkbookShell
    day={21}
    chapter="13"
    fallbackAssignmentKey="A1-13"
    title="A1 · Day 21 Workbook · Weather"
    subtitle="Kapitel 13 · Tutor-marked Lesen & Schreiben assignment"
    assignmentIntro="Complete Teil 1, Teil 2 and Teil 3, then open Submit and send your final answers to your tutor."
    submitTitle="Submit A1 · Day 21 · Kapitel 13"
    submitDescription="This submission is locked to A1-13. Submit your reading answers and final writing task for tutor marking."
  >
    <WeatherWorkbookContent />
  </A1TutorMarkedWorkbookShell>
);

export default A1Day21WeatherWorkbookPage;
