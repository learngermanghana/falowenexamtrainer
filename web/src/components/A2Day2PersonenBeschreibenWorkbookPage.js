import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const paragraph = {
  margin: 0,
  lineHeight: 1.7,
};

const list = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.75,
};

const topicGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: 12,
};

const topicCard = {
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  padding: 14,
  background: "#f8fbff",
  display: "grid",
  gap: 8,
};

const topicTitle = {
  margin: 0,
  color: "#1e3a8a",
  fontSize: "1rem",
};

const chipRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const chip = {
  border: "1px solid #93c5fd",
  borderRadius: 999,
  padding: "7px 11px",
  background: "#eff6ff",
  color: "#1e3a8a",
  fontWeight: 800,
};

const descriptionTopics = [
  {
    title: "1. Äußeres Erscheinungsbild",
    groups: [
      {
        label: "Körpergröße",
        items: ["groß (tall)", "klein (short)", "mittelgroß (average height)"],
      },
      {
        label: "Haarfarbe und Frisur",
        items: [
          "blond, braun, schwarz, rot (blonde, brown, black, red)",
          "lang, kurz, lockig, glatt (long, short, curly, straight)",
        ],
      },
      {
        label: "Augenfarbe",
        items: ["blau, grün, braun, grau (blue, green, brown, gray)"],
      },
      {
        label: "Besondere Merkmale",
        items: [
          "Brille, Bart, Sommersprossen (glasses, beard, freckles)",
          "Tätowierungen, Piercings (tattoos, piercings)",
        ],
      },
      {
        label: "Adjektive",
        items: ["schlank, kräftig (slim, strong)", "attraktiv, sportlich (attractive, athletic)"],
      },
    ],
  },
  {
    title: "2. Kleidung",
    groups: [
      { label: "Alltag", items: ["T-Shirt, Jeans, Pullover (t-shirt, jeans, sweater)"] },
      { label: "Formal", items: ["Anzug, Kleid, Rock, Bluse (suit, dress, skirt, blouse)"] },
      { label: "Farben", items: ["rot, blau, grün, schwarz, weiß (red, blue, green, black, white)"] },
      {
        label: "Adjektive",
        items: ["modisch, lässig (stylish, casual)", "elegant, ordentlich (elegant, tidy)"],
      },
    ],
  },
  {
    title: "3. Charakter und Persönlichkeit",
    groups: [
      {
        label: "Positive Eigenschaften",
        items: [
          "freundlich, lustig, kreativ (friendly, funny, creative)",
          "offen, pünktlich, ehrlich (open, punctual, honest)",
          "hilfsbereit, geduldig, optimistisch (helpful, patient, optimistic)",
        ],
      },
      {
        label: "Negative Eigenschaften",
        items: [
          "unfreundlich, unpünktlich (unfriendly, not punctual)",
          "launisch, stur (moody, stubborn)",
          "pessimistisch, unordentlich (pessimistic, untidy)",
        ],
      },
    ],
  },
  {
    title: "4. Alter und Herkunft",
    groups: [
      {
        label: "Alter",
        items: ["jung, mittelalt, alt (young, middle-aged, old)", "Er ist 20 Jahre alt. (He is 20 years old.)"],
      },
      {
        label: "Herkunft",
        items: [
          "Land: Deutschland, Ghana, Frankreich (Germany, Ghana, France)",
          "Stadt: Berlin, Accra, Paris",
        ],
      },
    ],
  },
  {
    title: "5. Hobbys und Interessen",
    groups: [
      {
        label: "Aktivitäten",
        items: [
          "Sport: Fußball, Tennis, Laufen (soccer, tennis, running)",
          "Kunst: Malen, Musik, Tanzen (painting, music, dancing)",
          "Bücher lesen, reisen (reading books, traveling)",
        ],
      },
      {
        label: "Adjektive",
        items: ["aktiv, kreativ (active, creative)", "musikalisch, sportlich (musical, sporty)"],
      },
    ],
  },
  {
    title: "6. Beziehungen",
    groups: [
      {
        label: "Familie",
        items: [
          "verheiratet, ledig, geschieden (married, single, divorced)",
          "Mutter, Vater, Bruder, Schwester (mother, father, brother, sister)",
        ],
      },
      {
        label: "Freundeskreis",
        items: [
          "Sie ist eine gute Freundin. (She is a good friend.)",
          "Wir kennen uns seit zwei Jahren. (We have known each other for two years.)",
        ],
      },
      {
        label: "Adjektive",
        items: [
          "zuverlässig, humorvoll (reliable, humorous)",
          "gesellig, respektvoll (sociable, respectful)",
        ],
      },
    ],
  },
];

const readingQuestions = [
  {
    stem: "Wie lange arbeitet der Erzähler schon im Büro?",
    options: ["A. Zwei Jahre", "B. Ein Jahr", "C. Drei Monate", "D. Fünf Jahre"],
  },
  {
    stem: "Was ist besonders an Herrn Müllers Arbeitsweise?",
    options: [
      "A. Er kommt immer unpünktlich ins Büro",
      "B. Er ist immer gut gelaunt und organisiert",
      "C. Er ist sehr unorganisiert und chaotisch",
      "D. Er ist nie freundlich zu den Mitarbeitern",
    ],
  },
  {
    stem: "Was trägt Herr Müller normalerweise?",
    options: [
      "A. Einen Anzug und eine Krawatte",
      "B. Einen Pullover und Jeans",
      "C. Einen Anzug und eine Brille",
      "D. Eine Uniform",
    ],
  },
  {
    stem: "Was macht Herr Müller, wenn die Mitarbeiter Fragen haben?",
    options: [
      "A. Er ignoriert sie",
      "B. Er geht geduldig auf ihre Anliegen ein",
      "C. Er wird ärgerlich",
      "D. Er sagt, dass sie selbst nach Lösungen suchen sollen",
    ],
  },
  {
    stem: "Warum ist es motivierend, mit Herrn Müller zu arbeiten?",
    options: [
      "A. Weil er selten lobt",
      "B. Weil er seine Mitarbeiter regelmäßig lobt",
      "C. Weil er nie mit den Mitarbeitern spricht",
      "D. Weil er die Arbeit nicht ernst nimmt",
    ],
  },
  {
    stem: "Wann kann Herr Müller streng sein?",
    options: [
      "A. Wenn eine Aufgabe nicht rechtzeitig erledigt wird",
      "B. Wenn er sich langweilt",
      "C. Wenn die Mitarbeiter zu viel reden",
      "D. Wenn jemand zu früh nach Hause geht",
    ],
  },
  {
    stem: "Was schätzt der Erzähler an Herrn Müller besonders?",
    options: [
      "A. Dass er immer mit den Mitarbeitern streitet",
      "B. Dass er fair ist und die Leistungen der Mitarbeiter wertschätzt",
      "C. Dass er nie Zeit für die Mitarbeiter hat",
      "D. Dass er seine Aufgaben an andere weitergibt",
    ],
  },
];

const listeningQuestions = [
  {
    stem: "Warum lernt der Sprecher Deutsch?",
    options: [
      "A. Weil er nach Frankreich ziehen möchte.",
      "B. Weil er in Deutschland arbeiten möchte.",
      "C. Weil er eine deutsche Freundin hat.",
      "D. Weil er Deutsch liebt.",
    ],
  },
  {
    stem: "Welche Methoden benutzt der Sprecher zum Lernen?",
    options: [
      "A. Nur Bücher lesen.",
      "B. Nur Filme schauen.",
      "C. Sprachkurse, Online-Apps und das Üben mit Freunden.",
      "D. Nur Musik hören.",
    ],
  },
  {
    stem: "Wie oft übt der Sprecher Deutsch?",
    options: ["A. Jeden Tag eine Stunde.", "B. Einmal pro Woche.", "C. Einmal im Monat.", "D. Nie."],
  },
];

const speakingContent = (
  <>
    <WorkbookTaskCard eyebrow="Group practice" title="Personen beschreiben" practiceOnly>
      <p style={paragraph}>
        In this chapter, we’ll engage in group exercises discussing these topics. Following this, your tutor will revise the questions and invite you to write a brief essay about yourself.
      </p>
    </WorkbookTaskCard>

    <div style={topicGrid}>
      {descriptionTopics.map((topic) => (
        <section key={topic.title} style={topicCard}>
          <h3 style={topicTitle}>{topic.title}</h3>
          {topic.groups.map((group) => (
            <div key={group.label} style={{ display: "grid", gap: 4 }}>
              <strong>{group.label}</strong>
              <ul style={list}>
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>

    <WorkbookTaskCard eyebrow="Sprachliche Hilfen" title="So kannst du eine Person beschreiben" practiceOnly>
      <div style={topicGrid}>
        <section style={topicCard}>
          <h3 style={topicTitle}>Einleitung</h3>
          <p style={paragraph}>„Ich möchte dir eine Person beschreiben, die ...“</p>
          <p style={paragraph}>„Diese Person ist sehr wichtig für mich, weil ...“</p>
        </section>
        <section style={topicCard}>
          <h3 style={topicTitle}>Hauptteil</h3>
          <p style={paragraph}>„Außerdem hat sie ...“</p>
          <p style={paragraph}>„Zum Beispiel trägt er oft ...“</p>
          <p style={paragraph}>„Er ist genauso freundlich wie meine Mutter.“</p>
          <p style={paragraph}>„Sie ist größer als ich.“</p>
        </section>
        <section style={topicCard}>
          <h3 style={topicTitle}>Schluss</h3>
          <p style={paragraph}>„Zusammenfassend kann man sagen, dass diese Person wirklich besonders ist.“</p>
        </section>
      </div>
    </WorkbookTaskCard>

    <WorkbookTaskCard eyebrow="Deine Beschreibung" title="Kannst du eine Person beschreiben? Wie sieht sie aus und was für ein Mensch ist sie?" practiceOnly>
      <div style={chipRow}>
        {["Aussehen", "Charakter", "Kleidung", "Besondere Merkmale"].map((item) => (
          <span key={item} style={chip}>{item}</span>
        ))}
      </div>
      <p style={paragraph}>Aussehen: groß, klein, Haare, Augenfarbe</p>
      <p style={paragraph}>Charakter: freundlich, lustig, ruhig</p>
      <p style={paragraph}>Besondere Merkmale: Brille, Bart, Schmuck</p>
    </WorkbookTaskCard>
  </>
);

const writingContent = (
  <WorkbookTaskCard eyebrow="Schreibaufgabe" title="Schreibe einen Brief an Felix">
    <p style={paragraph}>Erzähle Felix von deinem Chef oder deiner Chefin.</p>
    <ol style={list}>
      <li>Warum schreibst du?</li>
      <li>Beschreibe deinen Chef oder deine Chefin: Aussehen, Persönlichkeit und Verhalten.</li>
      <li>Was gefällt dir an deinem Chef oder deiner Chefin, und was könnte besser sein?</li>
    </ol>
  </WorkbookTaskCard>
);

const readingText = `Ich arbeite seit einem Jahr in einem kleinen Büro in der Stadtmitte. Mein Chef, Herr Müller, ist etwa 45 Jahre alt. Er ist ein sehr organisierter und motivierter Mensch. Jeden Morgen kommt er immer pünktlich ins Büro und begrüßt alle freundlich. Herr Müller trägt meistens einen Anzug und eine Brille. Er hat kurze, braune Haare und ist immer gut gelaunt. Er ist sehr freundlich, aber auch sehr anspruchsvoll, wenn es um die Arbeit geht.

Besonders gut finde ich, dass er immer Zeit für uns hat, wenn wir Fragen oder Probleme haben. Er geht geduldig auf unsere Anliegen ein und erklärt alles sehr klar. Er möchte, dass wir uns ständig verbessern, aber er ist dabei nie unhöflich oder zu streng. Er lobt uns oft, wenn wir gute Arbeit leisten, was sehr motivierend ist.

Ab und zu kann Herr Müller aber auch sehr streng sein, besonders wenn eine Aufgabe nicht rechtzeitig erledigt wird. Er erwartet von uns, dass wir unsere Aufgaben mit höchster Genauigkeit erledigen, und ist sehr darauf bedacht, dass wir unsere Ziele erreichen. Trotzdem habe ich viel Respekt vor ihm, weil er fair ist und die Leistungen seiner Mitarbeiter wertschätzt.

Ich arbeite gerne mit Herrn Müller zusammen, weil er immer respektvoll mit uns umgeht und viel Wert auf Zusammenarbeit legt. Außerdem sorgt er dafür, dass wir in einem angenehmen Arbeitsumfeld arbeiten, was für mich sehr wichtig ist.`;

export default function A2Day2PersonenBeschreibenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={2}
      title="Personen beschreiben"
      chapter="1.2"
      workbookId="A2Day2PersonenBeschreiben"
      topicPrompt="Personen beschreiben"
      sprechenContent={speakingContent}
      schreibenContent={writingContent}
      schreibenPlaceholder={"Lieber Felix,\n\nwie geht es dir? Ich schreibe dir, weil ...\n\nMein Chef / Meine Chefin ..."}
      lesenText={readingText}
      lesenQuestions={readingQuestions}
      hoerenTask="Sieh dir das eingebettete Video an und beantworte danach die drei Hörverstehen-Fragen."
      hoerenAudioUrl="https://youtu.be/5ttnGcZWo-Q"
      hoerenQuestions={listeningQuestions}
    />
  );
}
