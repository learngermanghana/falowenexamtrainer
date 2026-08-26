import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import SpeakingMindMap from "./SpeakingMindMap";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";

const sectionStyle = {
  display: "grid",
  gap: 10,
};

const phraseGridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 8,
  background: "#fff",
};

const sprechenContent = (
  <div style={sectionStyle}>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      <strong>Ein Wochenende planen</strong>
    </p>

    <div style={{ ...questionBoxStyle, background: "#eff6ff", borderColor: "#93c5fd" }}>
      <strong>Frage für die Diskussion</strong>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Wie planst du dein ideales Wochenende? Was möchtest du am Samstag und Sonntag machen,
        mit wem möchtest du Zeit verbringen und warum?
      </p>
    </div>

    <SpeakingMindMap config={getA2SpeakingMindMap(21)} />

    <p style={{ margin: 0, lineHeight: 1.7 }}>
      <strong>Instructions</strong>
    </p>
    <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
      <li>Schreibt „Wochenende“ in die Mitte eurer Brain-Map.</li>
      <li>
        Erstellt fünf Hauptzweige und ergänzt passende Unterzweige mit Beispielen und Redemitteln.
      </li>
    </ol>

    <div style={questionBoxStyle}>
      <strong>Hauptzweig 1: Freizeitaktivitäten</strong>
      <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
        <li>Sport treiben: joggen, schwimmen, Fußball spielen</li>
        <li>Kreativ sein: malen, basteln, ein Instrument spielen</li>
        <li>Entspannen: ein Buch lesen, Musik hören, Netflix schauen</li>
        <li>Computer- oder Videospiele spielen</li>
      </ul>
    </div>

    <div style={questionBoxStyle}>
      <strong>Hauptzweig 2: Reise oder Ausflug</strong>
      <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
        <li>Tagesausflug: in die Berge, an den See, in den Freizeitpark</li>
        <li>Städtetrip: nach Berlin, Köln oder in eine andere Stadt</li>
        <li>Wandern oder Radfahren: im Wald, am Fluss</li>
        <li>Kulturelle Unternehmungen: Museum, Theater, Konzert</li>
      </ul>
    </div>

    <div style={questionBoxStyle}>
      <strong>Hauptzweig 3: Haushalt und Erledigungen</strong>
      <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
        <li>Hausputz: Staubsaugen, Bad putzen, Wäsche waschen</li>
        <li>Einkaufen: Lebensmittel einkaufen, Kleidung shoppen</li>
        <li>Reparaturen: etwas im Haus oder Garten reparieren</li>
        <li>Post und Bank: Briefe abschicken, Bankgeschäfte erledigen</li>
      </ul>
    </div>

    <div style={questionBoxStyle}>
      <strong>Hauptzweig 4: Freunde und Familie</strong>
      <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
        <li>Treffen mit Freunden: gemeinsam kochen, ins Kino gehen, Spieleabend</li>
        <li>Familienzeit: Eltern oder Großeltern besuchen, Familienessen</li>
        <li>Gemeinsame Aktivitäten: Grillen, Picknick, Ausflüge</li>
        <li>Feiern: Geburtstag, Jubiläum, andere Feste</li>
      </ul>
    </div>

    <div style={questionBoxStyle}>
      <strong>Hauptzweig 5: Ausdrücke und Fragen</strong>
      <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
        <li>Was machst du am Wochenende?</li>
        <li>Hast du schon Pläne?</li>
        <li>Ich freue mich auf ...</li>
        <li>Ich habe leider keine Zeit.</li>
        <li>Ich möchte mich erholen.</li>
        <li>Wollen wir etwas zusammen unternehmen?</li>
      </ul>
    </div>

    <p style={{ margin: 0, lineHeight: 1.7 }}>
      <strong>Zusatz:</strong> Nutzt die Stichwörter <em>Freizeit</em>, <em>Treffen</em>,{" "}
      <em>Samstag</em> und <em>Sonntag</em>. Erzählt danach von eurem Wochenendprogramm.
    </p>

    <h3 style={{ margin: 0 }}>Sprechen wie bei einer Mini-Präsentation</h3>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Nutze diese einfache Struktur:{" "}
      <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
      So wird aus kurzen Wörtern eine klare Antwort mit guten Sätzen.
    </p>

    <div style={{ ...questionBoxStyle, background: "#ecfeff" }}>
      <strong>Schnelle Struktur für 30–45 Sekunden</strong>
      <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
        <li><strong>Einleitung:</strong> Thema nennen und einen ersten Satz sagen.</li>
        <li><strong>Hauptteil:</strong> zwei oder drei Punkte mit einfachen Connectors verbinden.</li>
        <li><strong>Beispiel:</strong> ein kurzes Beispiel aus deinem Leben geben.</li>
        <li><strong>Schluss:</strong> deine Meinung kurz zusammenfassen.</li>
      </ol>
    </div>

    <div style={phraseGridStyle}>
      <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
        <strong>Gute Einleitungen</strong>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>„Heute spreche ich über …“</li>
          <li>„Ich möchte kurz etwas über … sagen.“</li>
          <li>„Mein Thema ist …“</li>
        </ul>
      </div>
      <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
        <strong>Verbindungswörter / Connectors</strong>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li><strong>und</strong> · „Ich lerne Deutsch und ich übe jeden Tag.“</li>
          <li><strong>oder</strong> · „Ich mache Sport oder ich treffe Freunde.“</li>
          <li><strong>weil</strong> · „Das ist gut, weil es einfach ist.“</li>
          <li><strong>deshalb</strong> · „Ich habe wenig Zeit, deshalb plane ich gut.“</li>
        </ul>
      </div>
      <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
        <strong>Eigene Meinung ausdrücken</strong>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>„Ich finde … gut, weil …“</li>
          <li>„Für mich ist … wichtig.“</li>
          <li>„Meiner Meinung nach ist … praktisch.“</li>
        </ul>
      </div>
      <div style={{ ...questionBoxStyle, background: "#f8fafc" }}>
        <strong>Gute Schlüsse</strong>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>„Zum Schluss kann ich sagen: …“</li>
          <li>„Deshalb finde ich … gut.“</li>
          <li>„Das ist meine Meinung. Danke fürs Zuhören.“</li>
        </ul>
      </div>
    </div>

    <div style={{ ...questionBoxStyle, background: "#ecfeff" }}>
      <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        „Heute spreche ich über meine Wochenendplanung. Am Samstag möchte ich ausschlafen und
        einkaufen gehen, weil ich unter der Woche wenig Zeit habe. Dann treffe ich Freunde oder
        mache Sport. Am Sonntag bleibe ich gern zu Hause und lerne Deutsch. Zum Beispiel
        wiederhole ich neue Wörter und schreibe eine kurze E-Mail. Zum Schluss finde ich: Ein
        gutes Wochenende hat Ruhe, Freunde und ein bisschen Vorbereitung für Montag.“
      </p>
    </div>
  </div>
);

const schreibenContent = (
  <div style={sectionStyle}>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Schreiben Sie einen Brief an einen Freund oder eine Freundin, in dem Sie ihn oder sie zu
      einem gemeinsamen Wochenende einladen.
    </p>
    <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
      <li>
        Beschreiben Sie Ihre Wochenendpläne und erklären Sie, warum sie besonders sind (z. B.
        was Sie vorhaben und worauf Sie sich freuen).
      </li>
      <li>
        Laden Sie die Person ein, mit Ihnen zu kommen, und nennen Sie wichtige Details (Datum,
        Ort, Treffpunkt, Dauer).
      </li>
      <li>
        Erklären Sie, was die Person mitbringen sollte oder was sie erwarten kann (Kleidung,
        Essen, Ausrüstung, Aktivitäten).
      </li>
    </ol>
  </div>
);

const lesenText = `Der TV-Koch Stefan Berger
„Ich versuche immer wieder etwas Neues.“

Bei Stefan Berger gibt es Gerichte, von denen man vorher noch nie gehört hat. Er hat dauernd neue Ideen. Den Gästen gefällt das. Man muss unbedingt vorher anrufen und einen der wenigen Tische bestellen, wenn man in seinem Restaurant „Bremer Lokal“ essen möchte. Er hat viele Gäste, will aber kein zweites Lokal aufmachen. „Klar, ich könnte vielleicht reich damit werden, aber ich habe mich bewusst dagegen entschieden. Ich mag es einfach, wie wir hier arbeiten.“

Stefan Berger wurde 1968 im Rheinland geboren, war auf der Realschule und lernte dann in einem großen Hotel kochen. Nach der Berufsausbildung brauchte er erstmal eine zweijährige Pause. Er fuhr durch die Welt, hatte verschiedene Jobs und lernte viel Neues kennen. Wegen einer Frau kam er dann nach Bremen. Das „Bremer Lokal“ in seiner Nachbarschaft suchte einen Koch, Berger nahm die Stelle an, und drei Jahre später kaufte er das Restaurant.

Die meisten kennen ihn aber erst durch seine Fernsehshow „Berger kocht“. In der beliebten Sendung besuchen ihn Sänger und Schauspieler und kochen mit ihm ihre Lieblingsrezepte.`;

const lesenQuestions = [
  {
    stem: 'Die Gäste im "Bremer Lokal" ...',
    options: ["a) finden immer einen Tisch.", "b) müssen anrufen und Essen bestellen.", "c) sollen Plätze reservieren."],
  },
  {
    stem: "Stefan Berger möchte ...",
    options: ["a) ein neues Restaurant eröffnen.", "b) mit seinem Restaurant mehr Geld verdienen.", "c) nur ein Restaurant haben."],
  },
  {
    stem: "Sofort nach der Ausbildung ...",
    options: ["a) arbeitete er in einem großen Hotel.", "b) kaufte er ein Restaurant.", "c) machte er eine lange Reise."],
  },
  {
    stem: "Stefan Berger ist bekannt durch ...",
    options: ["a) eine Fernsehsendung.", "b) Lieder und Filme.", "c) sein Restaurant."],
  },
  {
    stem: "Dieser Text informiert über ...",
    options: ["a) den Berufsweg eines Kochs.", "b) einen Koch in einem Hotel.", "c) eine neue Berufsausbildung."],
  },
];

export default function A2Day21EinWochenendePlanenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={21}
      title="Ein Wochenende planen"
      chapter="8.21"
      workbookId="A2Day21EinWochenendePlanen"
      topicPrompt="Ein Wochenende planen"
      sprechenContent={sprechenContent}
      schreibenTask="Einladung zu einem gemeinsamen Wochenende"
      schreibenContent={schreibenContent}
      schreibenPlaceholder="Liebe/r ...\n\nich möchte dich zu einem gemeinsamen Wochenende einladen ..."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="This is a Goethe-standard Hören test. The answers are provided in the YouTube video, so check and mark your own listening results. The school officially evaluates Lesen and Schreiben for this workbook."
      hoerenAudioUrl="https://youtu.be/Qg0tQFveI0M"
      hoerenQuestions={[]}
      showWorkbookGuidance={false}
    />
  );
}
