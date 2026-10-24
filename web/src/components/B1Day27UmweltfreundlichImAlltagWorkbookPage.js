import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";

const listeningQuestions = [
  { stem: "Worum geht es im Hörtext hauptsächlich?", options: ["A) Tipps für umweltfreundliches Verhalten im Alltag", "B) Eine Reiseplanung durch Europa", "C) Einen Einkaufsführer für Technik", "D) Ein Gespräch über Sportvereine"] },
  { stem: "Welche Maßnahme wird für den Alltag empfohlen?", options: ["A) Mehr Einwegprodukte nutzen", "B) LED-Lampen verwenden", "C) Längere Duschen", "D) Mehr Verpackung kaufen"] },
  { stem: "Was ist eine umweltfreundliche Option für unterwegs?", options: ["A) Allein mit dem Auto fahren", "B) Taxi statt Bus", "C) Öffentliche Verkehrsmittel", "D) Kürzere Wege vermeiden"] },
  { stem: "Welche Einkaufsgewohnheit ist nachhaltig?", options: ["A) Plastiktüten sammeln", "B) Saisonale Produkte kaufen", "C) Einwegbecher bevorzugen", "D) Mehr verpackte Ware kaufen"] },
  { stem: "Was wird als wichtiger Schlussgedanke betont?", options: ["A) Nur große Maßnahmen helfen", "B) Umweltschutz ist nur Aufgabe von Unternehmen", "C) Kleine Veränderungen vieler Menschen machen einen Unterschied", "D) Umweltschutz ist im Alltag nicht möglich"] },
];

const config = {
  day: 27,
  chapter: "10.27",
  assignmentKey: "B1-10.27",
  workbookId: "B1Day27UmweltfreundlichImAlltag",
  title: "Umweltfreundlich im Alltag",
  heroImage: "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "People discussing environmentally friendly daily habits",
  speaking: {
    question: "Wie kann man den Alltag umweltfreundlicher gestalten?",
    instructions: "Sprich über Maßnahmen zu Hause, unterwegs, beim Einkaufen und bei der Arbeit oder in der Schule. Erkläre auch, was leicht oder schwierig umzusetzen ist.",
    image: "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Sustainable habits in daily life",
    ideaTitle: "Brain Map: Umweltfreundlich im Alltag",
    ideaGroups: [
      { title: "Zu Hause", items: ["LED-Lampen benutzen", "Geräte ganz ausschalten", "Richtig heizen und lüften", "Kurz duschen", "Wasserhahn zudrehen", "Müll trennen"] },
      { title: "Unterwegs", items: ["Zu Fuß gehen", "Fahrrad fahren", "Öffentliche Verkehrsmittel nutzen", "Fahrgemeinschaften bilden", "Weniger Auto fahren"] },
      { title: "Einkaufen", items: ["Stofftaschen statt Plastiktüten", "Regionale und saisonale Produkte", "Weniger Verpackung", "Keine Einwegprodukte", "Nachfüllpackungen"] },
      { title: "Arbeit und Schule", items: ["Weniger Papier drucken", "Digital arbeiten", "Papier beidseitig nutzen", "Wiederverwendbare Flaschen und Becher"] },
      { title: "Bewusstsein und Information", items: ["Dokumentationen und Bücher", "Mit anderen über Umweltschutz sprechen", "Kindern Vorbild sein", "Umweltprojekte unterstützen"] },
    ],
    activityTitle: "Gemeinsam einen umweltfreundlichen Wochenplan erstellen",
    activityPoints: [
      "Was kann man zu Hause verändern?",
      "Wie kann man umweltfreundlicher einkaufen?",
      "Welche Verkehrsmittel kann man häufiger nutzen?",
      "Was fällt euch schwer, und was klappt schon gut?",
      "Welche drei Maßnahmen wollt ihr diese Woche ausprobieren?",
    ],
    answerStructure: [
      "Das Thema umweltfreundlicher Alltag vorstellen.",
      "Maßnahmen aus mindestens drei Lebensbereichen beschreiben.",
      "Erklären, welche Maßnahmen leicht oder schwierig sind.",
      "Ein persönliches Beispiel oder die Situation im Heimatland nennen.",
      "Die wichtigste Maßnahme auswählen und begründen.",
    ],
    usefulPhrases: ["Im Alltag kann man …", "Eine einfache Maßnahme ist …", "Das ist schwierig, weil …", "In meinem Heimatland …", "Wenn viele Menschen kleine Dinge ändern, …"],
  },
  writing: {
    title: "Kann jeder Mensch umweltfreundlich leben?",
    instructions: "Reagieren Sie auf Ahmeds Meinung. Begründen Sie Ihren Standpunkt und nennen Sie konkrete, realistische Beispiele.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Learner writing an opinion about environmental habits",
    sourceTitle: "Meinung von Ahmed",
    sourceText: "Ich denke, dass jeder Mensch umweltfreundlich leben kann, aber es ist manchmal nicht so einfach. Manche Menschen leben in Städten, wo sie kein Auto brauchen, andere auf dem Land, wo es keine Busse gibt. Ich finde, man kann auch kleine Dinge tun: zum Beispiel Stofftaschen benutzen oder das Licht ausschalten, wenn man den Raum verlässt. Das kostet nichts und hilft trotzdem der Umwelt. Außerdem ist es wichtig, dass man in der Schule oder in den Medien über Umweltschutz spricht. So lernen mehr Menschen, warum es wichtig ist. Was meinen Sie dazu?",
    taskPoints: [
      "Sagen Sie, ob Sie Ahmed zustimmen.",
      "Erklären Sie, welche Hindernisse es geben kann.",
      "Nennen Sie mindestens zwei einfache Maßnahmen.",
      "Geben Sie ein Beispiel aus Ihrem Alltag oder Heimatland.",
      "Formulieren Sie einen klaren Schluss.",
    ],
    supportStructure: ["Einleitung", "Reaktion auf Ahmed", "Hindernisse", "Realistische Maßnahmen", "Beispiel", "Schluss"],
    vocabulary: ["umweltfreundlich handeln", "Energie sparen", "öffentliche Verkehrsmittel", "Verpackung vermeiden", "Bewusstsein schaffen", "kleine Veränderungen"],
  },
  reading: {
    title: "Lesen Sie den Text und beantworten Sie alle sieben Fragen.",
    instructions: "Read the complete essay first. Then choose one answer, A–D, for every question.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Open book for environmental reading comprehension",
    text: {
      title: "Die Umwelt schützen: Was können wir tun?",
      paragraphs: [
        "Die Umwelt zu schützen ist eine der größten Herausforderungen unserer Zeit. Es gibt viele Maßnahmen, die wir ergreifen können, um unseren Planeten zu schützen. Eine der effektivsten Methoden ist das Recycling. Durch das Wiederverwerten von Materialien wie Papier, Glas und Plastik können wir die Menge an Abfall reduzieren, der auf Deponien landet. Das spart nicht nur Platz, sondern auch Ressourcen.",
        "Ein weiterer wichtiger Aspekt ist der Energieverbrauch. Indem wir energieeffiziente Geräte nutzen und bewusster mit Energie umgehen, können wir unseren CO₂-Fußabdruck verringern. Dies schließt auch den Einsatz erneuerbarer Energien wie Solar- oder Windkraft ein.",
        "Der Transport ist ein weiterer Bereich, in dem wir viel bewirken können. Wenn wir öfter das Fahrrad nutzen oder öffentliche Verkehrsmittel nehmen, reduzieren wir die Emissionen, die durch Autos verursacht werden. Auch Carsharing kann eine umweltfreundliche Alternative sein.",
        "Nicht zuletzt spielt der Konsum eine große Rolle. Wir sollten bewusster einkaufen und Produkte bevorzugen, die umweltfreundlich hergestellt wurden. Dazu gehört auch, weniger Fleisch zu konsumieren, da die Fleischproduktion sehr ressourcenintensiv ist. Jeder Einzelne kann seinen Beitrag leisten. Wenn wir alle kleine Änderungen in unserem Alltag vornehmen, können wir gemeinsam große Erfolge erzielen. Der Schutz der Umwelt beginnt bei jedem von uns.",
      ],
      questions: [
        { stem: "Welche Materialien können recycelt werden?", options: ["A) Nur Plastik", "B) Nur Glas", "C) Papier, Glas und Plastik", "D) Nur Papier"] },
        { stem: "Wie können wir unseren CO₂-Fußabdruck verringern?", options: ["A) Durch energieeffiziente Geräte", "B) Durch den Verzicht auf Recycling", "C) Durch häufigeres Autofahren", "D) Durch mehr Kohleenergie"] },
        { stem: "Welche Energiequellen sind erneuerbar?", options: ["A) Kohle und Öl", "B) Solar- und Windkraft", "C) Gas und Atomenergie", "D) Torf und Öl"] },
        { stem: "Welche Verkehrsmittel helfen, Emissionen zu reduzieren?", options: ["A) Fahrräder und öffentliche Verkehrsmittel", "B) Autos und Motorräder", "C) Flugzeuge und Schiffe", "D) Nur Lastwagen"] },
        { stem: "Warum sollten wir weniger Fleisch konsumieren?", options: ["A) Weil es immer ungesund ist", "B) Weil die Fleischproduktion ressourcenintensiv ist", "C) Weil es schwer zu kochen ist", "D) Weil es keine Tiere gibt"] },
        { stem: "Was können wir tun, um die Umwelt zu schützen?", options: ["A) Recycling vernachlässigen", "B) Energie verschwenden", "C) Umweltfreundlich einkaufen", "D) Mehr Einwegprodukte kaufen"] },
        { stem: "Wo beginnt der Schutz der Umwelt?", options: ["A) Nur bei Politikern", "B) Bei jedem Einzelnen", "C) Nur in Fabriken", "D) Nur bei Unternehmen"] },
      ],
    },
  },
  listening: {
    title: "Hören Sie den Beitrag und kontrollieren Sie Ihre Antworten selbst.",
    instructions: "Read the questions first, listen carefully and check your answers only after completing the task.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones and laptop for listening exercise",
    videoId: "jzm-MnWC7I0",
    externalUrl: "https://youtu.be/jzm-MnWC7I0",
    questions: listeningQuestions,
    selfCheckText: "Use the questions as listening support, then check and mark your own answers. Do not submit Teil 4; only Lesen and Schreiben are evaluated.",
  },
  submitWritingDescription: "Paste your final 80–100 word opinion text.",
  submitReadingDescription: "Paste your seven reading answer letters.",
};

export default function B1Day27UmweltfreundlichImAlltagWorkbookPage() {
  return <B1StandardWorkbookPage config={config} />;
}
