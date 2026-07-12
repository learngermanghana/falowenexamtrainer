import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const paragraph = {
  margin: 0,
  lineHeight: 1.75,
};

const list = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.75,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 12,
};

const practiceCard = {
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  padding: 14,
  background: "#f8fbff",
  display: "grid",
  gap: 8,
};

const heading = {
  margin: 0,
  color: "#1e3a8a",
  fontSize: "1rem",
};

const speakingContent = (
  <>
    <WorkbookTaskCard eyebrow="Group practice" title="Dinge und Personen vergleichen" practiceOnly>
      <p style={paragraph}>
        Zentrales Thema: Dinge und Personen vergleichen. Übt die Strukturen gemeinsam und beantwortet danach die Fragen.
      </p>
    </WorkbookTaskCard>

    <div style={grid}>
      <section style={practiceCard}>
        <h3 style={heading}>1. Wichtige Strukturen</h3>
        <ul style={list}>
          <li><strong>Komparativ + als:</strong> größer als, schneller als</li>
          <li><strong>Superlativ:</strong> am schönsten, der schnellste</li>
          <li><strong>Genauso ... wie:</strong> genauso groß wie</li>
          <li><strong>Nicht so ... wie:</strong> nicht so teuer wie</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>2. Vergleichsadjektive</h3>
        <p style={paragraph}>Vergleichsadjektive vergleichen zwei Dinge, Handlungen oder Zustände.</p>
        <ul style={list}>
          <li>schnell → schneller</li>
          <li>groß → größer</li>
          <li>interessant → interessanter</li>
          <li>teuer → teurer</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>3. Vergleichsformen</h3>
        <ul style={list}>
          <li><strong>Gleichheit:</strong> Mein Bruder ist so alt wie ich.</li>
          <li><strong>Ungleichheit:</strong> Sie ist größer als ihr Freund.</li>
          <li><strong>Superlativ:</strong> Er läuft am schnellsten.</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>4. Nützliche Ausdrücke</h3>
        <ul style={list}>
          <li>... ist besser als ...</li>
          <li>... ist genauso ... wie ...</li>
          <li>... ist viel ... als ...</li>
          <li>Ich finde ... interessanter als ...</li>
          <li>Das ist der beste ...</li>
          <li>... ist weniger ... als ...</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>5. Häufige Fehler</h3>
        <ul style={list}>
          <li><strong>Adjektivendungen:</strong> ein schnellerer Wagen</li>
          <li><strong>Wortstellung:</strong> Mein Hund ist größer als dein Hund.</li>
          <li>Benutze <strong>als</strong> bei einem Unterschied und <strong>wie</strong> bei Gleichheit.</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>6. Vergleiche von Dingen</h3>
        <p style={paragraph}>Handys, Autos, Städte und Verkehrsmittel.</p>
        <ul style={list}>
          <li>Ein Tesla ist teurer als ein BMW.</li>
          <li>München ist kleiner als Berlin.</li>
          <li>Mein Handy ist genauso neu wie dein Handy.</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>7. Vergleiche von Personen</h3>
        <p style={paragraph}>Alter, Größe, Intelligenz und Stärke.</p>
        <ul style={list}>
          <li>Mein Bruder ist älter als ich.</li>
          <li>Lisa ist genauso fleißig wie Tom.</li>
          <li>Peter ist nicht so sportlich wie Anna.</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>8. Vergleiche im Alltag</h3>
        <p style={paragraph}>Lebensstil, Ernährung und Schulsysteme.</p>
        <ul style={list}>
          <li>Das Leben in der Stadt ist hektischer als auf dem Land.</li>
          <li>Hausmannskost ist gesünder als Fast Food.</li>
          <li>Ein Fahrrad ist umweltfreundlicher als ein Auto.</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>9. Nützliche Wörter</h3>
        <ul style={list}>
          <li><strong>Kleine Unterschiede:</strong> ein bisschen, etwas, leicht</li>
          <li><strong>Große Unterschiede:</strong> viel, deutlich, extrem</li>
          <li><strong>Gleichheit:</strong> genauso, ebenso, ähnlich</li>
        </ul>
      </section>
    </div>

    <WorkbookTaskCard eyebrow="Practice questions" title="Fragen zum Üben" practiceOnly>
      <ol style={list}>
        <li>Was ist größer: ein Elefant oder ein Löwe?</li>
        <li>Welches Verkehrsmittel ist umweltfreundlicher: Fahrrad oder Auto?</li>
        <li>Ist Pizza leckerer als Gemüse?</li>
        <li>Wer ist berühmter: Ronaldo oder Messi?</li>
      </ol>
    </WorkbookTaskCard>
  </>
);

const readingText = `Anna ist 25 Jahre alt und wohnt in Berlin, einer lebendigen Großstadt in Deutschland. Sie hat lange, blonde Haare, blaue Augen und ein strahlendes Lächeln. Anna arbeitet als Krankenschwester in einem Krankenhaus, wo sie sich um ihre Patienten kümmert. Sie liebt ihren Beruf, weil sie gerne anderen Menschen hilft. Ihre Kollegen schätzen sie sehr, weil sie immer freundlich und hilfsbereit ist.

In ihrer Freizeit liest Anna gerne Romane, vor allem Liebesgeschichten, und geht oft im Park spazieren. Außerdem trifft sie sich regelmäßig mit ihrer besten Freundin Lisa, um Kaffee zu trinken oder ins Kino zu gehen. Anna mag auch Tiere und hat einen kleinen Hund namens Bruno, den sie oft mit in den Park nimmt.

Max ist Annas Freund. Er ist 27 Jahre alt und wohnt auch in Berlin. Er hat kurze, braune Haare, grüne Augen und trägt eine Brille. Max ist Lehrer für Mathematik an einer Schule und unterrichtet dort Schüler zwischen 12 und 16 Jahren. Seine Schüler mögen ihn, weil er geduldig ist und schwierige Themen gut erklären kann.

In seiner Freizeit spielt Max gerne Fußball mit seinen Freunden im Park. Er liebt es auch, neue Rezepte auszuprobieren und gemeinsam mit Anna oder Freunden zu kochen. Max ist ein humorvoller und kreativer Mensch, der immer neue Ideen hat, wie man den Alltag spannender gestalten kann. Am Wochenende unternehmen Anna und Max oft etwas zusammen, zum Beispiel Ausflüge in die Natur oder Museumsbesuche in der Stadt.`;

const readingQuestions = [
  {
    stem: "Wie alt ist Anna?",
    options: ["a) 20 Jahre", "b) 25 Jahre", "c) 30 Jahre", "d) 27 Jahre"],
  },
  {
    stem: "Was macht Anna in ihrer Freizeit?",
    options: [
      "a) Fußball spielen und kochen",
      "b) Bücher lesen und spazieren gehen",
      "c) Tanzen und malen",
      "d) Reisen und Musik hören",
    ],
  },
  {
    stem: "Wo arbeitet Anna?",
    options: ["a) In einer Schule", "b) In einer Tierklinik", "c) In einem Krankenhaus", "d) In einem Café"],
  },
  {
    stem: "Welches Tier hat Anna?",
    options: ["a) Eine Katze", "b) Einen Vogel", "c) Einen Hund", "d) Kein Tier"],
  },
  {
    stem: "Was unterrichtet Max?",
    options: ["a) Deutsch", "b) Mathematik", "c) Geschichte", "d) Englisch"],
  },
  {
    stem: "Was macht Max oft mit seinen Freunden?",
    options: ["a) Fußball spielen", "b) Spazieren gehen", "c) Kino besuchen", "d) Tanzen"],
  },
  {
    stem: "Was unternehmen Anna und Max am Wochenende?",
    options: [
      "a) Sie gehen ins Fitnessstudio",
      "b) Sie machen Ausflüge oder gehen ins Museum",
      "c) Sie bleiben zu Hause",
      "d) Sie besuchen Freunde in Hamburg",
    ],
  },
];

const listeningQuestions = [
  {
    stem: "Wie alt ist Julia?",
    options: ["a) 24 Jahre", "b) 26 Jahre", "c) 28 Jahre", "d) 30 Jahre"],
  },
  {
    stem: "Was macht Julia beruflich?",
    options: ["a) Köchin", "b) Lehrerin", "c) Architektin", "d) Musikerin"],
  },
  {
    stem: "Wo lebt Tobias?",
    options: ["a) In München", "b) In Frankfurt", "c) In Hamburg", "d) In Berlin"],
  },
  {
    stem: "Was möchte Tobias in Zukunft machen?",
    options: [
      "a) Ein eigenes Restaurant eröffnen",
      "b) Musiker werden",
      "c) Eine Weltreise machen",
      "d) Lehrer werden",
    ],
  },
  {
    stem: "Was machen Julia und Tobias oft am Wochenende?",
    options: [
      "a) Sie spielen Gitarre.",
      "b) Sie kochen gemeinsam mit Sophie.",
      "c) Sie reisen in die Berge.",
      "d) Sie gehen ins Kino.",
    ],
  },
];

export default function A2Day3ComparisonsWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={3}
      title="Dinge und Personen vergleichen"
      chapter="1.3"
      workbookId="A2Day3DingeUndPersonenVergleichen"
      topicPrompt="Vergleiche zwei Personen, Dinge oder Orte mit Komparativ und Superlativ."
      sprechenContent={speakingContent}
      schreibenTask={`Schreibe einen Brief an deinen Freund Felix. Beschreibe und vergleiche deine Mutter und deinen Vater.

Bearbeite diese drei Punkte:
1. Erkläre, warum du Felix schreibst, und stelle deine Mutter und deinen Vater kurz vor.
2. Beschreibe ihr Aussehen und ihren Charakter. Vergleiche beide mit so ... wie und dem Komparativ, zum Beispiel größer als, ruhiger als oder genauso freundlich wie.
3. Sage, was an deiner Mutter oder deinem Vater am besten oder am wichtigsten ist. Frage Felix am Ende nach seinen Eltern.`}
      schreibenPlaceholder={"Lieber Felix,\n\nwie geht es dir? Ich schreibe dir, weil ...\n\nMeine Mutter ist ... Mein Vater ist ...\n\nMeine Mutter ist ... als mein Vater, aber mein Vater ist genauso ... wie ...\n\nAm ... ist ...\n\nWie sind deine Eltern?\n\nViele Grüße\n[Dein Name]"}
      lesenText={readingText}
      lesenQuestions={readingQuestions}
      hoerenTask="Sieh dir das eingebettete Video an und beantworte danach die fünf Hörverstehen-Fragen."
      hoerenAudioUrl="https://youtu.be/Ml50uHYxBx8"
      hoerenQuestions={listeningQuestions}
    />
  );
}
