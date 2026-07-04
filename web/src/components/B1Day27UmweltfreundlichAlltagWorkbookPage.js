import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";

export const B1_DAY27_UMWELTFREUNDLICH_ALLTAG_WORKBOOK_CONFIG = {
  day: 27,
  chapter: "10.27",
  assignmentKey: "B1-10.27",
  workbookId: "B1Day27UmweltfreundlichAlltag",
  title: "Umweltfreundlich im Alltag",
  heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Eco-friendly daily choices",
  speaking: {
    question: "Plant zusammen, wie ihr euren Alltag umweltfreundlicher gestalten könnt.",
    instructions: "Sprechen Sie über umweltfreundliche Möglichkeiten zu Hause, beim Einkaufen, unterwegs, in Arbeit oder Schule und im Gespräch mit anderen.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Eco-friendly everyday life",
    ideaTitle: "Umweltfreundlich im Alltag",
    ideaIntro: "In this chapter, we'll engage in group exercises discussing practical ways to live more environmentally friendly every day.",
    ideaGroups: [
      { title: "Zuhause", items: ["Energie sparen: LED-Lampen, Geräte ausschalten und Heizung richtig einstellen", "Wasser sparen: kurz duschen und Wasserhahn beim Zähneputzen zudrehen", "Müll trennen: Papier, Plastik, Biomüll, Restmüll und Glascontainer nutzen", "Umweltfreundliche Produkte kaufen: Bio-Produkte, Recyclingpapier und Nachfüllpackungen"] },
      { title: "Unterwegs", items: ["Zu Fuß gehen oder Fahrrad fahren", "Öffentliche Verkehrsmittel benutzen", "Fahrgemeinschaften bilden", "Weniger Auto fahren"] },
      { title: "Einkaufen", items: ["Stofftaschen statt Plastiktüten benutzen", "Regionale und saisonale Produkte kaufen", "Weniger Verpackung wählen", "Keine Einwegprodukte kaufen"] },
      { title: "Arbeit / Schule", items: ["Weniger Papier drucken", "Digital arbeiten", "Papier beidseitig nutzen", "Wiederverwendbare Flaschen und Becher benutzen"] },
      { title: "Bewusstsein und Information", items: ["Umweltbildung durch Dokumentationen und Bücher", "Mit anderen über Umweltschutz sprechen", "Kindern ein Vorbild sein"] },
    ],
    activityTitle: "Thema: Umweltfreundlich im Alltag – Gemeinsam planen",
    activityIntro: "Plant zusammen, wie ihr euren Alltag umweltfreundlicher gestalten könnt.",
    activityOrdered: true,
    activityPoints: ["Was kann man zu Hause tun?", "Wie kann man umweltfreundlich einkaufen?", "Wie kann man umweltfreundlich unterwegs sein?", "Was fällt euch schwer? Was klappt gut?"],
    answerStructure: ["Das Thema vorstellen.", "Möglichkeiten zu Hause beschreiben.", "Einkaufen und Mobilität erklären.", "Schwierigkeiten und Vorteile vergleichen.", "Eine realistische Lösung formulieren."],
    usefulPhrases: ["Zu Hause kann man umweltfreundlicher leben, indem man ...", "Beim Einkaufen ist es sinnvoll, ...", "Unterwegs könnte man öfter ...", "Für mich ist schwierig, dass ...", "Gut klappt schon, dass ..."],
  },
  writing: {
    title: "Kann jeder Mensch umweltfreundlich leben? Schreiben Sie Ihre Meinung.",
    instructions: "Lesen Sie Ahmeds Meinung. Schreiben Sie danach Ihre eigene Meinung und begründen Sie Ihren Standpunkt.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Writing about eco-friendly living",
    sourceTitle: "Ahmed",
    sourceText: "Ich denke, dass jeder Mensch umweltfreundlich leben kann, aber es ist manchmal nicht so einfach. Manche Menschen leben in Städten, wo sie kein Auto brauchen, andere auf dem Land, wo es keine Busse gibt. Ich finde, man kann auch kleine Dinge tun: zum Beispiel Stofftaschen benutzen oder das Licht ausschalten, wenn man den Raum verlässt. Das kostet nichts und hilft trotzdem der Umwelt. Außerdem ist es wichtig, dass man in der Schule oder in den Medien über Umweltschutz spricht. So lernen mehr Menschen, warum es wichtig ist. Was meinen Sie dazu?",
    taskPoints: ["Sagen Sie, ob Sie Ahmed zustimmen oder nicht.", "Erklären Sie, warum umweltfreundliches Leben wichtig ist.", "Nennen Sie Beispiele aus dem Alltag.", "Beschreiben Sie Schwierigkeiten.", "Formulieren Sie einen klaren Schluss."],
    supportStructure: ["Einleitung", "Reaktion auf Ahmeds Meinung", "Argumente und Beispiele", "Schwierigkeiten oder Gegenargumente", "Eigene Meinung", "Schluss"],
    vocabulary: ["umweltfreundlich leben", "Stofftaschen benutzen", "das Licht ausschalten", "öffentliche Verkehrsmittel", "Umweltschutz", "kleine Schritte machen"],
  },
  reading: {
    title: "Lesen Sie den Text und beantworten Sie alle sieben Fragen.",
    instructions: "Lesen Sie zuerst den vollständigen Essay. Wählen Sie danach bei jeder Frage genau eine Antwort.",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Protecting the environment",
    text: {
      title: "Die Umwelt schützen: Was können wir tun?",
      questionTitle: "Questions",
      paragraphs: [
        "Die Umwelt zu schützen ist eine der größten Herausforderungen unserer Zeit. Es gibt viele Maßnahmen, die wir ergreifen können, um unseren Planeten zu schützen. Eine der effektivsten Methoden ist das Recycling. Durch das Wiederverwerten von Materialien wie Papier, Glas und Plastik können wir die Menge an Abfall reduzieren, der auf Deponien landet. Das spart nicht nur Platz, sondern auch Ressourcen.",
        "Ein weiterer wichtiger Aspekt ist der Energieverbrauch. Indem wir energieeffiziente Geräte nutzen und bewusster mit Energie umgehen, können wir unseren CO2-Fußabdruck verringern. Dies schließt auch den Einsatz erneuerbarer Energien wie Solar- oder Windkraft ein.",
        "Der Transport ist ein weiterer Bereich, in dem wir viel bewirken können. Wenn wir öfter das Fahrrad nutzen oder öffentliche Verkehrsmittel nehmen, reduzieren wir die Emissionen, die durch Autos verursacht werden. Auch das Carsharing kann eine umweltfreundliche Alternative sein.",
        "Nicht zuletzt spielt der Konsum eine große Rolle. Wir sollten bewusster einkaufen und Produkte bevorzugen, die umweltfreundlich hergestellt wurden. Dazu gehört auch, weniger Fleisch zu konsumieren, da die Fleischproduktion sehr ressourcenintensiv ist.",
        "Jeder Einzelne kann seinen Beitrag leisten. Wenn wir alle kleine Änderungen in unserem Alltag vornehmen, können wir gemeinsam große Erfolge erzielen. Der Schutz der Umwelt beginnt bei jedem von uns.",
      ],
      questions: [
        { stem: "Welche Materialien können recycelt werden?", options: ["A) Nur Plastik", "B) Nur Glas", "C) Papier, Glas und Plastik", "D) Nur Papier"] },
        { stem: "Wie können wir unseren CO2-Fußabdruck verringern?", options: ["A) Durch den Einsatz energieeffizienter Geräte", "B) Durch den Verzicht auf Recycling", "C) Durch häufigeres Autofahren", "D) Durch den Einsatz von Kohleenergie"] },
        { stem: "Welche Energiequellen sind erneuerbar?", options: ["A) Kohle und Öl", "B) Solar- und Windkraft", "C) Gas und Atomenergie", "D) Holz und Torf"] },
        { stem: "Welche Verkehrsmittel helfen, Emissionen zu reduzieren?", options: ["A) Fahrräder und öffentliche Verkehrsmittel", "B) Autos und Motorräder", "C) Flugzeuge und Schiffe", "D) Lastwagen und Busse"] },
        { stem: "Warum sollten wir weniger Fleisch konsumieren?", options: ["A) Weil es gesund ist", "B) Weil die Fleischproduktion ressourcenintensiv ist", "C) Weil es teuer ist", "D) Weil es schwer zu kochen ist"] },
        { stem: "Was können wir tun, um die Umwelt zu schützen?", options: ["A) Recycling vernachlässigen", "B) Energie verschwenden", "C) Umweltfreundlich einkaufen", "D) Fleischproduktion fördern"] },
        { stem: "Wo beginnt der Schutz der Umwelt?", options: ["A) Bei den Politikern", "B) Bei jedem Einzelnen", "C) In den Fabriken", "D) Bei den Tieren"] },
      ],
    },
  },
  listening: {
    title: "Bearbeiten Sie den Hörtest und kontrollieren Sie Ihre Antworten selbst.",
    instructions: "Hören Sie zuerst aufmerksam zu. Kontrollieren Sie Ihre Antworten danach mit dem Video.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones for listening practice",
    videoId: "jzm-MnWC7I0",
    externalUrl: "https://youtu.be/jzm-MnWC7I0",
    selfCheckText: "This Hören part is self-check practice. The school officially evaluates Lesen and Schreiben. Mark your own listening result after watching the video.",
  },
  submitWritingDescription: "Paste your final opinion text about eco-friendly living.",
  submitReadingDescription: "Paste your seven reading answer letters.",
};

export default function B1Day27UmweltfreundlichAlltagWorkbookPage() {
  return <B1StandardWorkbookPage config={B1_DAY27_UMWELTFREUNDLICH_ALLTAG_WORKBOOK_CONFIG} />;
}
