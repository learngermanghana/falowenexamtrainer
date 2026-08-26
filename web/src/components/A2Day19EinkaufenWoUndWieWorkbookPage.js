import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const sectionStyle = { display: "grid", gap: 12 };
const branchStyle = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 14,
  background: "#f8fafc",
  display: "grid",
  gap: 8,
};

const sprechenContent = (
  <div style={sectionStyle}>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      In this chapter, we&apos;ll engage in group exercises discussing these topics.
    </p>

    <h3 style={{ margin: 0 }}>Instructions</h3>
    <ol style={listStyle}>
      <li>
        <strong>Central Topic:</strong> Write <strong>„Konsumverhalten“</strong> in the center of your brain map.
      </li>
      <li>
        <strong>Main Branches:</strong> Create five main branches from the central topic:
        <ul style={listStyle}>
          <li>Einkaufsmöglichkeiten (Shopping Options)</li>
          <li>Einkaufsgewohnheiten (Shopping Habits)</li>
          <li>Nachhaltigkeit und Konsum (Sustainability and Consumption)</li>
          <li>Bezahlen und Rabatte (Payments and Discounts)</li>
          <li>Produkte und Dienstleistungen (Products and Services)</li>
        </ul>
      </li>
      <li>
        <strong>Sub-Branches:</strong> Expand each branch with examples and phrases.
      </li>
    </ol>

    <h3 style={{ margin: 0 }}>Example Brain Map</h3>

    <div style={branchStyle}>
      <strong>1. Einkaufsmöglichkeiten (Shopping Options)</strong>
      <ul style={listStyle}>
        <li>Supermärkte (Supermarkets): Lidl, Aldi, Edeka</li>
        <li>Einkaufszentren (Shopping malls): Mall of Berlin, Skyline Plaza</li>
        <li>Online-Shopping: Amazon, Zalando</li>
        <li>Wochenmärkte (Weekly markets): Gemüse, Obst, Brot</li>
        <li>Second-Hand-Läden (Second-hand stores): Kleidung, Bücher</li>
      </ul>
    </div>

    <div style={branchStyle}>
      <strong>2. Einkaufsgewohnheiten (Shopping Habits)</strong>
      <ul style={listStyle}>
        <li>Geplantes Einkaufen (Planned shopping): Einkaufszettel (Shopping list)</li>
        <li>Spontane Käufe (Spontaneous purchases)</li>
        <li>Großeinkauf (Bulk buying): einmal pro Woche</li>
        <li>Tagesbedarf kaufen (Buying daily needs): Brot, Milch</li>
      </ul>
    </div>

    <div style={branchStyle}>
      <strong>3. Nachhaltigkeit und Konsum (Sustainability and Consumption)</strong>
      <ul style={listStyle}>
        <li>Wiederverwendbare Taschen (Reusable bags)</li>
        <li>Plastik vermeiden (Avoiding plastic)</li>
        <li>Regionale Produkte kaufen (Buying local products)</li>
        <li>Weniger kaufen, mehr reparieren (Buying less, repairing more)</li>
        <li>Fair-Trade-Produkte (Fair trade products)</li>
      </ul>
    </div>

    <div style={branchStyle}>
      <strong>4. Bezahlen und Rabatte (Payments and Discounts)</strong>
      <ul style={listStyle}>
        <li>Bar bezahlen (Paying cash)</li>
        <li>Mit Karte bezahlen (Paying by card)</li>
        <li>Online-Bezahlung (Online payment)</li>
        <li>Rabattaktionen (Discount campaigns): Black Friday, Sommerschlussverkauf</li>
        <li>Kundenkarten (Loyalty cards)</li>
      </ul>
    </div>

    <div style={branchStyle}>
      <strong>5. Produkte und Dienstleistungen (Products and Services)</strong>
      <ul style={listStyle}>
        <li>Lebensmittel (Groceries): Brot, Milch, Gemüse</li>
        <li>Kleidung (Clothing): Hosen, T-Shirts, Jacken</li>
        <li>Elektronik (Electronics): Smartphones, Fernseher</li>
        <li>Dienstleistungen (Services): Friseur, Autoreparatur</li>
      </ul>
    </div>

    <div style={{ ...branchStyle, background: "#eff6ff" }}>
      <strong>Sprechaufgabe</strong>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Wie kaufst du ein und worauf achtest du beim Einkaufen? Verwende die Wörter <strong>Einkaufen</strong>, <strong>Geld</strong>,{" "}
        <strong>Supermarkt</strong> und <strong>Angebot</strong>.
      </p>
    </div>
  </div>
);

const schreibenContent = (
  <div style={sectionStyle}>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      <strong>Writing Task: Einladung zum Einkaufen</strong>
    </p>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Sie möchten einen Freund oder eine Freundin zum Einkaufen einladen, weil Sie gemeinsam Möbel für Ihre neue Wohnung
      auswählen möchten. Schreiben Sie eine E-Mail an Ihren Freund oder Ihre Freundin.
    </p>
    <ol style={listStyle}>
      <li>Laden Sie ihn oder sie zum Einkaufen ein und erklären Sie den Grund.</li>
      <li>Schlagen Sie vor, wann und wo Sie sich treffen können.</li>
      <li>Bitten Sie um seine oder ihre Meinung zu Ihrer Idee.</li>
    </ol>
  </div>
);

const lesenText = `Essay: Konsumverhalten in der modernen Gesellschaft

Konsumverhalten hat sich in den letzten Jahrzehnten stark verändert. Mit der Zunahme von Online-Shopping und Werbung sind die Menschen mehr als je zuvor dazu verleitet, Dinge zu kaufen, die sie nicht wirklich brauchen. Ein Grund dafür ist die ständige Verfügbarkeit von Produkten und die einfache Bestellung über das Internet.

Nachhaltiger Konsum wird jedoch immer wichtiger. Viele Verbraucher achten darauf, weniger Plastik zu verwenden, lokale Produkte zu kaufen und auf faire Handelsbedingungen zu achten. Diese Veränderungen sind notwendig, um die Umwelt zu schützen und soziale Gerechtigkeit zu fördern.

Dennoch gibt es immer noch viele Herausforderungen. Die Produktion von Konsumgütern verursacht oft Umweltverschmutzung, und die Arbeitsbedingungen in einigen Fabriken sind schlecht. Es ist daher wichtig, dass Verbraucher gut informiert sind und bewusste Entscheidungen treffen.

Insgesamt ist das Konsumverhalten ein komplexes Thema, das sowohl positive als auch negative Auswirkungen hat. Es liegt an jedem Einzelnen, wie er oder sie mit Konsum umgeht und welche Prioritäten gesetzt werden.`;

const lesenQuestions = [
  {
    stem: "Was hat das Konsumverhalten in den letzten Jahrzehnten stark verändert?",
    options: [
      "A) Der Anstieg von lokalen Märkten",
      "B) Die Zunahme von Online-Shopping und Werbung",
      "C) Die Reduzierung von Plastikverbrauch",
    ],
  },
  {
    stem: "Warum kaufen viele Menschen Dinge, die sie nicht brauchen?",
    options: [
      "A) Weil sie gut informiert sind",
      "B) Wegen der ständigen Verfügbarkeit und einfachen Bestellung",
      "C) Weil sie auf faire Handelsbedingungen achten",
    ],
  },
  {
    stem: "Was wird immer wichtiger für Verbraucher?",
    options: ["A) Mehr Plastik zu verwenden", "B) Nachhaltiger Konsum", "C) Mehr Dinge online zu kaufen"],
  },
  {
    stem: "Welche Veränderungen sind notwendig, um die Umwelt zu schützen?",
    options: [
      "A) Mehr Plastik verwenden",
      "B) Weniger Plastik verwenden und lokale Produkte kaufen",
      "C) Mehr Produkte aus dem Ausland kaufen",
    ],
  },
  {
    stem: "Welche Herausforderungen gibt es beim Konsumverhalten?",
    options: [
      "A) Gute Arbeitsbedingungen in allen Fabriken",
      "B) Umweltverschmutzung und schlechte Arbeitsbedingungen",
      "C) Hohe Preise für Konsumgüter",
    ],
  },
  {
    stem: "Was sollen Verbraucher tun, um bewusste Entscheidungen zu treffen?",
    options: ["A) Sich gut informieren", "B) Nur online einkaufen", "C) So viel wie möglich kaufen"],
  },
  {
    stem: "Wie wird das Konsumverhalten im Text beschrieben?",
    options: [
      "A) Als einfaches Thema",
      "B) Als komplexes Thema mit positiven und negativen Auswirkungen",
      "C) Als völlig negatives Thema",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Was bietet Online-Shopping den Verbrauchern?",
    options: [
      "A) Hohe Preise",
      "B) Bequeme Möglichkeit, Produkte nach Hause zu bestellen",
      "C) Weniger Auswahl",
    ],
  },
  {
    stem: "Was ist ein Nachteil des Online-Shoppings?",
    options: [
      "A) Geringe Anzahl von Rücksendungen",
      "B) Hohe Anzahl von Rücksendungen und Umweltbelastung",
      "C) Niedrige Preise",
    ],
  },
  {
    stem: "Worauf müssen Verbraucher beim Online-Kauf achten?",
    options: [
      "A) Auf vertrauenswürdige Websites und Schutz persönlicher Daten",
      "B) Auf hohe Preise",
      "C) Auf schnelle Lieferung",
    ],
  },
  {
    stem: "Wo sollten die Produkte, die online gekauft werden, herkommen?",
    options: [
      "A) Aus nachhaltigen Quellen und fairen Bedingungen",
      "B) Aus dem Ausland",
      "C) Aus teuren Geschäften",
    ],
  },
  {
    stem: "Wie hat das Internet den Konsum verändert?",
    options: [
      "A) Es hat den Konsum eingeschränkt",
      "B) Es hat den Konsum revolutioniert und neue Möglichkeiten geschaffen",
      "C) Es hat keine großen Veränderungen gebracht",
    ],
  },
];

export default function A2Day19EinkaufenWoUndWieWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={19}
      title="Einkaufen? Wo und wie?"
      chapter="7.19"
      workbookId="A2Day19EinkaufenWoUndWie"
      topicPrompt="Wie kaufst du ein und worauf achtest du beim Einkaufen?"
      sprechenContent={sprechenContent}
      schreibenTask="Einladung zum Einkaufen"
      schreibenContent={schreibenContent}
      schreibenPlaceholder="Liebe/r ...,\n\nich möchte dich zum Einkaufen einladen, weil ..."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Hören Sie den Text ‚Online Shopping und Konsumverhalten‘ und wählen Sie jeweils die richtige Antwort."
      hoerenAudioUrl="https://drive.google.com/file/d/1OsT5j6Y7a-rMdB0HlRJJ98gTgSvxm_LB/view?usp=sharing"
      hoerenQuestions={hoerenQuestions}
      showWorkbookGuidance={false}
    />
  );
}
