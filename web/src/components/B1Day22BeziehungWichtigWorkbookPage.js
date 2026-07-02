import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";

const config = {
  day: 22,
  chapter: "7.22",
  assignmentKey: "B1-7.22",
  workbookId: "B1Day22BeziehungWichtig",
  title: "Was ist dir in einer Beziehung wichtig?",
  heroImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "People discussing relationships and shared values",
  speaking: {
    question: "Was ist dir in einer Beziehung besonders wichtig und warum?",
    instructions: "Sprich über Kommunikation, Vertrauen, gemeinsame Interessen, Respekt, Unterstützung und Zukunftspläne. Begründe deine Prioritäten mit Beispielen.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Group conversation about relationships and values",
    ideaTitle: "Brain Map: Beziehung und Werte",
    ideaGroups: [
      { title: "Kommunikation", items: ["Offen reden können", "Zuhören", "Probleme gemeinsam lösen", "Regelmäßiger Austausch"] },
      { title: "Vertrauen und Ehrlichkeit", items: ["Treue", "Keine Geheimnisse", "Ehrliche Meinungen teilen", "Verlässlichkeit"] },
      { title: "Gemeinsame Interessen", items: ["Hobbys teilen", "Gemeinsame Unternehmungen", "Gemeinsamer Humor", "Musik, Filme oder Sport"] },
      { title: "Respekt und Unterstützung", items: ["Den anderen akzeptieren", "Unterstützung im Alltag", "Verständnis zeigen", "Keine Kontrolle oder Eifersucht"] },
      { title: "Zukunftspläne", items: ["Zusammenleben", "Familie planen", "Gemeinsame Ziele", "Vertrauen in die gemeinsame Zukunft"] },
    ],
    activityTitle: "Profil- und Partnerübung",
    activityIntro: "Answer as yourself or create a fictional profile for pair and group practice.",
    activityPoints: [
      "Wie heißen Sie, wie alt sind Sie und wo wohnen Sie?",
      "Welche Hobbys und Interessen haben Sie?",
      "Was suchen Sie in einer Beziehung?",
      "Welche Eigenschaften schätzen Sie an einem Partner?",
      "Wie würden Sie Ihre Persönlichkeit in drei Worten beschreiben?",
      "Wie wichtig ist Ihnen Kommunikation und warum?",
      "Welche Aktivitäten machen Sie gern am Wochenende?",
      "Welche Lebensziele oder Zukunftsträume haben Sie?",
    ],
    answerStructure: [
      "Das Thema Beziehung und Werte kurz vorstellen.",
      "Zwei oder drei besonders wichtige Werte nennen.",
      "Erklären, warum diese Werte wichtig sind.",
      "Ein Beispiel aus dem Alltag oder aus einer Beobachtung geben.",
      "Die eigene Meinung zusammenfassen.",
    ],
    usefulPhrases: [
      "In einer Beziehung ist mir … besonders wichtig.",
      "Ich finde Vertrauen wichtig, weil …",
      "Ohne gute Kommunikation kann …",
      "Ein guter Partner sollte …",
      "Meiner Meinung nach gehören … und … zusammen.",
    ],
  },
  writing: {
    title: "Was denken Sie über Partnersuche im Internet?",
    instructions: "Reagieren Sie auf Marias Meinung. Sagen Sie, ob Sie zustimmen, nennen Sie Vorteile und Risiken und begründen Sie Ihre eigene Meinung.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Writing practice about online dating and relationships",
    sourceTitle: "Meinung von Maria",
    sourceText: "Ich finde, dass die Partnersuche heutzutage durch das Internet viel einfacher geworden ist. Man hat die Möglichkeit, viele verschiedene Menschen kennenzulernen und schnell herauszufinden, ob man gemeinsame Interessen hat. Allerdings denke ich, dass es auch schwierig sein kann, weil viele Leute sich online anders präsentieren, als sie wirklich sind. Manchmal vermisse ich die Zeiten, als man sich noch persönlich kennenlernen musste, um eine Beziehung aufzubauen.",
    taskPoints: [
      "Sagen Sie, ob Sie Maria zustimmen.",
      "Nennen Sie Vorteile der Partnersuche im Internet.",
      "Nennen Sie mögliche Risiken oder Nachteile.",
      "Vergleichen Sie Online-Kontakt und persönliches Kennenlernen.",
      "Geben Sie ein Beispiel und formulieren Sie einen Schluss.",
    ],
    supportStructure: ["Einleitung", "Reaktion auf Maria", "Vorteile", "Nachteile oder Risiken", "Eigene Meinung mit Beispiel", "Schluss"],
    vocabulary: ["jemanden kennenlernen", "sich online präsentieren", "gemeinsame Interessen", "Vertrauen aufbauen", "vorsichtig sein", "persönlicher Kontakt"],
  },
  reading: {
    title: "Lesen Sie beide Texte und beantworten Sie alle Fragen.",
    instructions: "Read each text completely before choosing one answer, A–D, for every question.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Berlin city landmarks for reading comprehension",
    text: {
      title: "Text 1: Berlin",
      paragraphs: [
        "Berlin ist nicht nur Weltmetropole und die Hauptstadt Deutschlands, sondern auch meine Heimatstadt. Jeden Morgen auf dem Weg zur Arbeit komme ich an vielen berühmten Sehenswürdigkeiten vorbei. Da ist zunächst der Große Tiergarten, welcher schon über 500 Jahre alt ist. Von hier ist es nicht weit bis zum Brandenburger Tor und der Siegessäule. Hier steige ich in die U-Bahn und fahre einige Stationen bis zum Alexanderplatz, wo sich die Weltzeituhr und das Wahrzeichen der Stadt, der Fernsehturm, befinden.",
        "Von dort sind es nur wenige Minuten Fußweg bis zum Kurfürstendamm, der riesigen Einkaufsstraße mit zahlreichen Restaurants, Geschäften und Hotels.",
        "Hier arbeite ich als Hotelfachfrau und betreue die zahlreichen Gäste des Hotels, welche als Touristen Berlin besichtigen. Als echte Berlinerin kann ich ihnen dabei gute Tipps geben, welche Sehenswürdigkeiten sich wirklich lohnen und wie sie auf dem besten Wege dorthin gelangen. Sehr oft kommt man so mit den Gästen unserer Stadt ins Gespräch und erfährt, aus welchen Ländern sie angereist sind und ob es ihnen in Berlin gefällt. Als besonderen Service bietet unser Hotel auch eigene Stadtrundfahrten an, die immer sehr gern gebucht werden.",
      ],
      questions: [
        { stem: "Wie alt ist der Große Tiergarten?", options: ["A) wenige Minuten", "B) wenige Jahre", "C) Das steht nicht im Text.", "D) 500 Jahre"] },
        { stem: "In der Nähe welches Platzes befinden sich Weltzeituhr und Fernsehturm?", options: ["A) Siegessäule", "B) Alexanderplatz", "C) Brandenburger Tor", "D) Kurfürstendamm"] },
        { stem: "Was ist der Kurfürstendamm?", options: ["A) Ein Restaurant", "B) Ein Hotel", "C) Eine Hauptstadt", "D) Eine Einkaufsstraße"] },
        { stem: "Wo arbeitet die Erzählerin?", options: ["A) in einem Geschäft", "B) in einem Restaurant", "C) am Alexanderplatz", "D) in einem Hotel"] },
        { stem: "Was bietet das Hotel als besonderen Service für seine Gäste?", options: ["A) Fahrkarten für die U-Bahn", "B) eine Weltzeituhr", "C) Stadtrundfahrten", "D) kostenloses Frühstück"] },
      ],
    },
    additionalTexts: [
      {
        title: "Text 2: Bewerbung",
        paragraphs: [
          "Der erste Schritt bei der Jobsuche ist, eine passende Stellenanzeige zu finden. Sehr viele offene Stellen kann man im Internet finden. Es gibt viele Webseiten, die diese Stellen sammeln. Dort kann man sich meistens direkt bewerben. Viele dieser Seiten sind auch für bestimmte Gruppen, zum Beispiel Studierende, Journalisten oder Handwerker. Stellenanzeigen findet man aber auch in Zeitungen. Dort gibt es eigene Seiten mit Stellenanzeigen.",
          "Bei der Bewerbung gibt es einiges zu beachten. Zu Beginn stehen die wichtigsten Daten: Name, Alter, Wohnort, Nationalität und oft auch ein Bewerbungsfoto. Darunter schreibt man die Ausbildung: Welche Schulen hat man besucht, welche Berufsausbildung, welche Universität. Sehr wichtig sind auch die Berufserfahrung oder die eigenen Interessen. Wer besondere Fähigkeiten hat, sollte sie angeben, zum Beispiel Sprachen, Kurse oder Computerkenntnisse. Zu dem Bewerbungsschreiben gehören neben dem Lebenslauf auch ein Anschreiben und Zeugnisse.",
          "Wer Glück hat, bekommt eine Einladung zu einem Vorstellungsgespräch. Dort lernt man den Arbeitgeber kennen, erfährt mehr über die Arbeit und kann sich selbst präsentieren. Wer eine Absage bekommt, versucht es mit der nächsten offenen Stelle.",
        ],
        questions: [
          { stem: "Wo findet man Stellenanzeigen nicht?", options: ["A) auf Webseiten", "B) in Zeitungen", "C) im Internet", "D) im Supermarkt"] },
          { stem: "Was steht zu Beginn einer Bewerbung?", options: ["A) Schule, Ausbildung, Kurse", "B) Name, Alter, Wohnort", "C) Berufserfahrung", "D) Interessen"] },
          { stem: "Was gehört noch zu einer Bewerbung?", options: ["A) Kopie des Reisepasses", "B) Brief der Eltern", "C) Absage der letzten Bewerbung", "D) Zeugnisse und Anschreiben"] },
          { stem: "Was passiert bei einem Bewerbungsgespräch?", options: ["A) Man lernt den Arbeitgeber kennen.", "B) Man muss eine Zeit lang zur Probe arbeiten.", "C) Man lernt nur die Kollegen kennen.", "D) Man bekommt automatisch die Stelle."] },
          { stem: "Was passiert, wenn man eine Absage bekommt?", options: ["A) Man muss eine Stellenanzeige schreiben.", "B) Man muss eine neue Ausbildung machen.", "C) Man kann sich bei der nächsten offenen Stelle bewerben.", "D) Man bekommt ein Zeugnis."] },
        ],
      },
    ],
    submissionNote: "Submit the answer letters for Text 1 and Text 2 through the Submit tab.",
  },
  listening: {
    status: "planned",
    title: "Hören material for Day 22 will be added here.",
    instructions: "The workbook structure is ready. Add the listening video, task instructions and optional self-check questions when the material becomes available.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones reserved for future listening content",
  },
  submitWritingDescription: "Paste your final 80–100 word opinion text about online partner search.",
  submitReadingDescription: "Paste the answer letters for both reading texts.",
};

export default function B1Day22BeziehungWichtigWorkbookPage() {
  return <B1StandardWorkbookPage config={config} />;
}
