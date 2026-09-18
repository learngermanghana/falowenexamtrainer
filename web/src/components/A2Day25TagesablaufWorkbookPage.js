import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const lesenText = `Annas Tagesablauf

Ich bin Anna, 16 Jahre alt und Schülerin. Morgens stehe ich kurz vor 7 Uhr auf. Aufwachen kann ich nicht von allein. Ein Wecker klingelt mich aus dem Schlaf. Ich stehe auf und muss als Erstes meistens auf die Toilette gehen. Danach wasche ich mir das Gesicht und dusche – zuerst ganz warm und am Schluss mit kaltem Wasser. So werde ich richtig wach. Zähne putzen muss auch sein, anschließend ziehe ich mich an. Meine Kleider habe ich mir schon am Abend davor zurechtgelegt, damit ich morgens keine Zeit verliere. So kann ich ein bisschen später aufstehen.

Das Frühstück lasse ich nie aus, weil ich am Morgen Hunger habe. Meistens esse ich Müsli oder Toast mit Marmelade. Dazu trinke ich Tee oder Kaffee. Bevor ich in die Schule gehe, muss ich noch mein Bett machen. Das dauert aber selten länger als eine oder zwei Minuten. Dann renne ich schon los, um meinen Schulbus zu erreichen.

Nach der Schule esse ich zu Mittag und komme am Nachmittag nach Hause. Dann muss ich meistens noch Hausaufgaben machen. Vor dem Abendessen habe ich noch Zeit, um zu spielen oder Freunde zu treffen. Dann essen wir gemeinsam zu Abend. Bevor ich ins Bett gehe, schaue ich ein bisschen fern. Danach gehe ich schlafen und schlafe von 22 Uhr bis morgens um 7.`;

const lesenQuestions = [
  { stem: "Wann steht Anna auf?", options: ["a) kurz vor 7 Uhr", "b) nie vor 7 Uhr", "c) immer nach 7 Uhr", "d) kurz nach 7 Uhr"] },
  { stem: "Was isst Anna zum Frühstück?", options: ["a) Cornflakes und Toast mit Butter", "b) nichts", "c) Brot mit Käse oder Wurst", "d) Müsli oder Toast mit Marmelade"] },
  { stem: "Was macht sie nicht morgens, bevor sie zur Schule geht?", options: ["a) zur Toilette gehen", "b) Hausaufgaben", "c) das Bett machen", "d) duschen"] },
  { stem: "Wann kommt sie nach Hause?", options: ["a) am Nachmittag", "b) nachdem sie die Hausaufgaben gemacht hat", "c) nach dem Abendessen", "d) kurz vor dem Abendessen"] },
  { stem: "Was macht sie nach den Hausaufgaben?", options: ["a) schlafen", "b) Freunde treffen", "c) Sport", "d) lernen"] },
];

const teil4Questions = [
  { stem: "Welches Reiseziel wählt Familie Meyer in diesem Jahr?", options: ["a) Österreich", "b) Deutschland", "c) die Schweiz", "d) Italien"] },
  { stem: "Womit fährt Familie Meyer in den Urlaub?", options: ["a) mit dem Taxi", "b) mit dem Bus", "c) mit dem Auto", "d) mit dem Zug"] },
  { stem: "Wo steigen Herr und Frau Meyer aus dem Zug?", options: ["a) an einem kleinen Bahnhof", "b) an einem großen Hotel", "c) am Flughafen", "d) an einer kleinen Raststätte"] },
  { stem: "Was erhalten sie an der Rezeption des Hotels?", options: ["a) einen schönen Blumenstrauß", "b) eine Fahrkarte", "c) einen Brief", "d) einen Zimmerschlüssel"] },
  { stem: "Warum ist Herr Meyer unzufrieden?", options: ["a) es gibt kein freies Zimmer", "b) das Zimmer ist zu klein", "c) das Zimmer ist zu groß", "d) das Hotel ist zu klein"] },
];

const teil4Content = (
  <div style={{ display: "grid", gap: 12 }}>
    <p style={{ margin: 0 }}>Lies den Text und beantworte die fünf Fragen im Submit-Bereich.</p>
    <p style={{ margin: 0, lineHeight: 1.75 }}>
      Herr und Frau Meyer fahren oft in die Berge. Berge gibt es in Deutschland, Österreich, Italien und der Schweiz. Ihr Reiseziel ist in diesem Jahr die Schweiz. Dort kann man viel wandern. In einem Berghotel haben sie ein Zimmer gebucht.
    </p>
    <p style={{ margin: 0, lineHeight: 1.75 }}>
      „Wie wollen wir hinfahren? Mit dem Auto oder mit dem Zug“, fragt Herr Meyer seine Frau. „Ein Flugzeug kommt ja nicht in Frage. Dort ist kein Flughafen.“ „Mit dem Auto ist es sehr bequem“, antwortet Frau Meyer. „Aber es gibt auf der Autobahn sicher einen langen Stau. Dann wird die Anreise sehr anstrengend. Ich denke, wir sollten den Zug nehmen.“
    </p>
    <p style={{ margin: 0, lineHeight: 1.75 }}>
      Eine Woche später steigen Herr und Frau Meyer an einem kleinen Bahnhof in der Schweiz aus dem Zug. Ein Taxi wartet bereits und bringt das Ehepaar zum Berghotel. An der Rezeption werden ihnen die Zimmerschlüssel überreicht. Ein Bediensteter zeigt dem Ehepaar Meyer ihr Zimmer. Darin befindet sich ein Doppelbett und ein Schrank.
    </p>
    <p style={{ margin: 0, lineHeight: 1.75 }}>
      Herr Meyer ist unzufrieden mit dem Hotelzimmer. Es ist viel zu klein. „Wir haben ein großes Zimmer gebucht. Dieser Raum gefällt uns nicht. Wir möchten ein anderes Zimmer haben.“ Durch seine Beschwerde erhält das Ehepaar sofort ein anderes Zimmer. Herr und Frau Meyer freuen sich. Sie haben ein großes Zimmer mit einem schönen Ausblick auf die schneebedeckten Berge.
    </p>
    <div style={{ display: "grid", gap: 10 }}>
      {teil4Questions.map((question, index) => (
        <div key={question.stem} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff", display: "grid", gap: 6 }}>
          <strong>{index + 1}. {question.stem}</strong>
          {question.options.map((option) => <span key={option}>{option}</span>)}
        </div>
      ))}
    </div>
  </div>
);

export default function A2Day25TagesablaufWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={25}
      title="Tagesablauf"
      chapter="9.25"
      workbookId="A2Day25Tagesablauf"
      topicPrompt="Beschreibe deinen Tagesablauf vom Aufstehen bis zum Schlafengehen. Nenne Uhrzeiten, Arbeit oder Schule, Essen, Freizeit und Abendroutine."
      schreibenTask="Schreiben Sie einem Freund oder einer Freundin über Ihren Tagesablauf. Beschreiben Sie Ihren Morgen, Ihren Arbeits- oder Schultag und Ihren Abend. Fragen Sie anschließend nach dem Tagesablauf der anderen Person."
      schreibenPlaceholder="Liebe/r ...,\n\nmein Tag beginnt normalerweise um ..."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      teil4Description="Lesen"
      hoerenContent={teil4Content}
      hoerenQuestions={[]}
      showWorkbookGuidance={false}
    />
  );
}
