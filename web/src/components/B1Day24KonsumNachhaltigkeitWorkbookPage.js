import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";

const config = {
  day: 24,
  chapter: "8.24",
  assignmentKey: "B1-8.24",
  workbookId: "B1Day24KonsumNachhaltigkeit",
  title: "Konsum und Nachhaltigkeit",
  heroImage: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Sustainable shopping and consumption choices",
  speaking: {
    question: "Wie wichtig ist dir Nachhaltigkeit beim Konsum, und welche Maßnahmen ergreifst du, um umweltbewusster zu leben?",
    instructions: "Beschreibe verschiedene Möglichkeiten für nachhaltigen Konsum, nenne Vor- und Nachteile und erkläre eine Maßnahme, die dir besonders wichtig ist.",
    image: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Sustainable products and shopping choices",
    ideaTitle: "Brain Map: Konsum und Nachhaltigkeit",
    ideaGroups: [
      { title: "Konsumverhalten", items: ["Bewusster Konsum", "Konsumgewohnheiten bei Lebensmitteln, Kleidung und Elektronik", "Online-Shopping oder stationärer Handel", "Minimalismus", "Kulturelle Unterschiede"] },
      { title: "Nachhaltigkeit im Alltag", items: ["Recycling und Müllvermeidung", "Bio- und Fair-Trade-Produkte", "Regionale Produkte", "Secondhand kaufen", "Papier statt Plastik"] },
      { title: "Umweltschutz und Klimawandel", items: ["CO₂-Emissionen reduzieren", "Erneuerbare Energien", "Mülltrennung und Kompostierung", "Klimaschutzinitiativen", "Folgen des Klimawandels"] },
      { title: "Wirtschaft und Verantwortung", items: ["Nachhaltige Unternehmen", "Kreislaufwirtschaft", "Grüne Technologien", "Fairer Handel", "Bio- und Fair-Trade-Siegel"] },
      { title: "Verantwortung des Einzelnen", items: ["Weniger Fleisch essen", "Umweltfreundlich reisen", "Überkonsum vermeiden", "Familie und Gemeinschaft informieren", "Politisch mitwirken"] },
      { title: "Herausforderungen und Lösungen", items: ["Hohe Preise", "Begrenzte Verfügbarkeit", "Alte Gewohnheiten", "Aufklärung", "Gesetze und innovative Produkte"] },
    ],
    discussionQuestions: [
      "Welche nachhaltigen Produkte kaufst du bereits?",
      "Sind nachhaltige Produkte in deinem Heimatland leicht verfügbar?",
      "Sollten Unternehmen oder Verbraucher mehr Verantwortung tragen?",
      "Kann nachhaltiger Konsum auch günstig sein?",
    ],
    answerStructure: [
      "Das Thema Nachhaltigkeit beim Konsum vorstellen.",
      "Mehrere nachhaltige Möglichkeiten beschreiben.",
      "Vor- und Nachteile wie Preis, Qualität und Verfügbarkeit nennen.",
      "Die Situation im Heimatland oder ein persönliches Beispiel erklären.",
      "Eine besonders wichtige Maßnahme auswählen und begründen.",
    ],
    usefulPhrases: ["Ich denke, dass Nachhaltigkeit wichtig ist, weil …", "Ein Beispiel für nachhaltigen Konsum ist …", "Meiner Meinung nach sollten wir mehr auf … achten.", "Einerseits ist … teuer, andererseits …", "In Zukunft wird … immer wichtiger."]
  },
  writing: {
    title: "Ist es wichtig, beim Konsum auf Nachhaltigkeit zu achten?",
    instructions: "Reagieren Sie auf Pauls Meinung. Begründen Sie Ihren Standpunkt und nennen Sie konkrete Beispiele für nachhaltigen Konsum.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Writing an opinion about sustainable consumption",
    sourceTitle: "Meinung von Paul",
    sourceText: "In der heutigen Zeit ist es immer wichtiger, nachhaltig zu konsumieren. Ich stimme dem zu, denn durch bewusstes Einkaufen können wir die Umwelt schützen und Ressourcen sparen. Viele Produkte, die wir kaufen, haben einen großen Einfluss auf die Natur, zum Beispiel durch Verpackungen oder den CO₂-Ausstoß bei der Herstellung. Dennoch ist es manchmal schwierig, nachhaltige Alternativen zu finden, vor allem bei den Preisen. Ich finde, dass jeder von uns kleine Schritte machen kann, wie weniger Plastik zu verwenden oder Secondhand zu kaufen. Was denken Sie darüber?",
    taskPoints: [
      "Sagen Sie, ob Sie Paul zustimmen.",
      "Erklären Sie, warum nachhaltiger Konsum wichtig oder schwierig ist.",
      "Nennen Sie mindestens zwei konkrete Maßnahmen.",
      "Geben Sie ein Beispiel aus Ihrem Alltag oder Heimatland.",
      "Formulieren Sie einen klaren Schluss.",
    ],
    supportStructure: ["Einleitung", "Reaktion auf Paul", "Argumente für oder gegen nachhaltigen Konsum", "Konkretes Beispiel", "Eigene Meinung", "Schluss"],
    vocabulary: ["Ressourcen sparen", "Verpackung vermeiden", "Secondhand kaufen", "regionale Produkte", "umweltfreundliche Alternative", "bewusst konsumieren"],
  },
  reading: {
    title: "Lesen Sie den Text und entscheiden Sie bei allen sieben Aussagen: richtig oder falsch.",
    instructions: "Read Eleni's complete text first. Then choose A) Richtig or B) Falsch for every statement.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Reading about environmental awareness and recycling",
    text: {
      title: "Eleni schreibt über Umweltschutz",
      paragraphs: [
        "Hallo liebe Umweltfreunde! Durch meine Nachbarin Heike habe ich über eine Bürgerinitiative in unserem Viertel erfahren, die sich für den Umweltschutz und für die Umwelterziehung einsetzt. Ich finde es wichtig, dass man sich in der eigenen Stadt für die Umwelt einsetzt und den Kindern beibringt, wie wir umweltbewusst leben können. Meine Tochter ist zwar erst vier Jahre alt, aber ich denke, sie sollte schon früh mitbekommen, dass wir nicht so weitermachen können wie bisher.",
        "In Griechenland ist das Umweltbewusstsein leider nicht so hoch. Das finde ich an Deutschland viel besser! In Griechenland ist auch die Sperrmüllabholung nicht so gut organisiert wie hier. Wir schmeißen einfach alles auf die Straße, aber es wird nicht wirklich abgeholt, zumindest nicht regelmäßig. Manchmal liegen bei uns wirklich alte Möbel monatelang am Straßenrand herum.",
        "In Deutschland stellen die Leute ihre alten Möbel gut geordnet am Abend vor der Abholung vor die Tür. Manche Sachen sind auch noch brauchbar. Ich habe auch schon Stühle und einen Tisch aus dem Sperrmüll geholt und benutze sie jetzt bei mir zu Hause. Man gibt Sachen eine zweite Chance! Hier wird man nicht blöd angeschaut, wenn man das macht.",
        "Ich finde es super, dass man auch Kleidung, die man vielleicht nicht mehr mag, die aber noch tragbar ist, in Altkleidercontainern sammelt und bedürftigen Menschen zukommen lässt. Die Container stehen überall in der Stadt und man kann die Sachen da reingeben. Auch dass es die Möglichkeit gibt, Einwegglas zu sammeln, und dass man daraus wieder neues Glas herstellt, ist genial.",
        "In Deutschland habe ich zum ersten Mal einen Wertstoffhof und ein Schadstoffmobil kennengelernt. Es ist richtig, dass giftige und umweltschädliche Sachen nicht einfach in den Müll geworfen werden und dass man Teile von alten Elektrogeräten wiederverwendet. Das sind wir unseren Kindern schuldig! Eure Eleni",
      ],
      questionTitle: "Aussagen: Richtig oder Falsch",
      questions: [
        { stem: "Eleni hat mit ihrer Nachbarin eine Bürgerinitiative gegründet.", options: ["A) Richtig", "B) Falsch"] },
        { stem: "Sie findet, dass Kinder früh etwas über Umweltschutz lernen sollten.", options: ["A) Richtig", "B) Falsch"] },
        { stem: "In Griechenland sind alle Menschen sehr umweltbewusst.", options: ["A) Richtig", "B) Falsch"] },
        { stem: "Eleni meint, dass es in Deutschland zu viele unnötige Sammelstellen für Müll gibt.", options: ["A) Richtig", "B) Falsch"] },
        { stem: "Altkleidersammlungen findet sie sinnvoll.", options: ["A) Richtig", "B) Falsch"] },
        { stem: "Das Recyceln von Wertstoffen ist ihrer Meinung nach nutzlos.", options: ["A) Richtig", "B) Falsch"] },
        { stem: "Sie mag es, wenn Sachen eine zweite Chance bekommen.", options: ["A) Richtig", "B) Falsch"] },
      ],
    },
  },
  listening: {
    title: "Bearbeiten Sie den Goethe-standard Hören-Test und kontrollieren Sie Ihre Antworten selbst.",
    instructions: "Listen without looking at the solutions first. Check your answers only after completing the full task.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones for listening comprehension",
    videoId: "zzPpGxzvJCY",
    externalUrl: "https://youtu.be/zzPpGxzvJCY",
    selfCheckText: "The answers are provided in the YouTube video. Mark your own result. Only Lesen and Schreiben are officially submitted for evaluation.",
  },
  submitWritingDescription: "Paste your final 80–100 word opinion text.",
  submitReadingDescription: "Paste your seven Richtig/Falsch answer letters.",
};

export default function B1Day24KonsumNachhaltigkeitWorkbookPage() {
  return <B1StandardWorkbookPage config={config} />;
}
