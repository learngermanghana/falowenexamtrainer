import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";

const config = {
  day: 23,
  chapter: "7.23",
  assignmentKey: "B1-7.23",
  workbookId: "B1Day23ErstesDate",
  title: "Erstes Date – Typische Situationen",
  heroImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Two people meeting and talking",
  speaking: {
    question: "Was sind typische Situationen bei einem ersten Date, und wie verhält man sich am besten?",
    instructions: "Beschreibe verschiedene Möglichkeiten für ein erstes Treffen, nenne Vor- und Nachteile und erkläre, was für ein gutes erstes Date wichtig ist.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Two people meeting for a first date",
    ideaTitle: "Brain Map: Erstes Date",
    ideaGroups: [
      { title: "Vorbereitung", items: ["Kleidung auswählen", "Pünktlich sein", "Nervosität oder Vorfreude", "Kleines Geschenk mitbringen"] },
      { title: "Ort des Treffens", items: ["Café oder Restaurant", "Spaziergang im Park", "Kino oder Museum", "Öffentlicher Ort für Sicherheit"] },
      { title: "Gesprächsthemen", items: ["Hobbys und Interessen", "Familie und Freunde", "Beruf oder Studium", "Reisen und Zukunftspläne"] },
      { title: "Gefühle und Eindrücke", items: ["Aufregung", "Neugier", "Unsicherheit", "Sympathie", "Positive oder negative Überraschung"] },
      { title: "Verhalten und Höflichkeit", items: ["Zuhören", "Fragen stellen", "Freundlich und respektvoll sein", "Handy weglegen", "Nicht zu privat werden"] },
      { title: "Möglicher Verlauf", items: ["Wiedersehen verabreden", "Höflich kein Interesse zeigen", "Gemeinsame Interessen entdecken", "Missverständnisse lösen"] },
    ],
    activityTitle: "Vergleicht verschiedene Date-Ideen",
    activityPoints: [
      "Restaurant oder Spaziergang: Welche Möglichkeit ist entspannter?",
      "Welche Gesprächsthemen passen gut zu einem ersten Treffen?",
      "Wie sollte man reagieren, wenn das Date nicht gut läuft?",
      "Welche Regeln für Sicherheit und Respekt sind wichtig?",
    ],
    answerStructure: [
      "Das Thema und eine passende Date-Idee vorstellen.",
      "Ort, Vorbereitung und mögliche Gesprächsthemen beschreiben.",
      "Vor- und Nachteile dieser Möglichkeit nennen.",
      "Erklären, welches Verhalten wichtig ist.",
      "Die eigene Wahl begründen und zusammenfassen.",
    ],
    usefulPhrases: ["Für ein erstes Date würde ich … wählen.", "Ein Vorteil davon ist, dass …", "Man sollte höflich sein und …", "Falls es ein Problem gibt, kann man …", "Ich finde diese Möglichkeit gut, weil …"],
  },
  writing: {
    title: "Ist das erste Date wirklich wichtig für eine Beziehung?",
    instructions: "Reagieren Sie auf Sophies Meinung. Erklären Sie die Bedeutung des ersten Eindrucks und begründen Sie Ihre eigene Meinung.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Writing an opinion text about first dates",
    sourceTitle: "Meinung von Sophie",
    sourceText: "Viele Menschen glauben, dass das erste Date entscheidet, ob man zusammenpasst. Ich stimme dem teilweise zu, denn der erste Eindruck kann viel bedeuten. Man merkt oft schnell, ob man sich sympathisch ist. Trotzdem finde ich, dass man nicht zu viel erwarten sollte. Manche Menschen sind beim ersten Treffen nervös und zeigen sich nicht so, wie sie wirklich sind. Ich denke, wichtiger ist, wie sich die Beziehung danach entwickelt. Was denken Sie darüber?",
    taskPoints: [
      "Sagen Sie, ob Sie Sophie zustimmen.",
      "Erklären Sie, warum der erste Eindruck wichtig sein kann.",
      "Nennen Sie einen Grund, warum ein erstes Date auch täuschen kann.",
      "Geben Sie ein Beispiel.",
      "Formulieren Sie einen klaren Schluss.",
    ],
    supportStructure: ["Einleitung", "Reaktion auf Sophie", "Argument für die Bedeutung des ersten Dates", "Gegenargument und Beispiel", "Eigene Meinung", "Schluss"],
    vocabulary: ["der erste Eindruck", "nervös sein", "sich sympathisch finden", "Erwartungen haben", "sich besser kennenlernen", "eine Beziehung entwickeln"],
  },
  reading: {
    title: "Lesen Sie den Text und beantworten Sie alle sieben Fragen.",
    instructions: "Read the complete text first. Then choose one answer, A–D, for every question.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Reading practice with books and notes",
    text: {
      title: "Die Frau, die Monopoly erfand",
      paragraphs: [
        "Elizabeth Magie Phillips ist nicht sehr bekannt – ihre Erfindung aber schon: das Brettspiel Monopoly. Doch diese Idee wurde ihr gestohlen. Und das Spiel, das sie eigentlich im Sinn hatte, wurde vergessen.",
        "Straßen kaufen, Mieten einnehmen, Hotels bauen – und mit etwas Würfelglück gehört einem am Ende das ganze Geld, während die Mitspieler bankrott sind. Millionen Menschen haben Monopoly gespielt. Bis vor Kurzem wusste allerdings kaum jemand, wer die Idee zu dem Spieleklassiker hatte und dass das Spiel ursprünglich ganz anders konzipiert war. Die US-amerikanische Autorin und Journalistin Mary Pilon hat die Geschichte in einem Buch aufgeschrieben.",
        "Monopoly stammt von der US-Amerikanerin Elizabeth Magie Phillips, und sie nannte es zuerst „The Landlord’s Game“. Phillips wurde 1866 geboren und lebte in der Zeit der Industrialisierung. Täglich sah sie Ungleichheit, Armut und Elend. Ihr Spiel sollte diese Zustände kritisieren. Sie entwickelte zwei Regelwerke: eines, in dem Monopole aufgebrochen wurden, und eines, das zeigen sollte, wie schädlich Monopole sind.",
        "1903 meldete Phillips ein Patent auf ihr Spiel an. Es war zunächst unter Studenten beliebt und bekam schließlich den Namen Monopoly. In den 1930er-Jahren kopierte der Verkäufer Charles Darrow das Spiel, übernahm aber nur das heute bekannte zweite Regelwerk. Er gab das Spiel als seine eigene Idee aus, verkaufte die Rechte an Parker Brothers und wurde Millionär.",
        "Phillips selbst sah fast nichts von dem vielen Geld. Als sie von Darrows Erfolg erfuhr, machte sie die Presse auf ihre Geschichte aufmerksam. Der Spieleverlag bot ihr später an, zwei andere Spiele zu veröffentlichen, doch daraus wurde anscheinend nichts. Ihren späten Ruhm verdankt sie Mary Pilon, die fünf Jahre lang für ihr Buch recherchiert hat.",
      ],
      questions: [
        { stem: "Wer hat das Spiel Monopoly ursprünglich erfunden?", options: ["A) Charles Darrow", "B) Mary Pilon", "C) Elizabeth Magie Phillips", "D) Parker Brothers"] },
        { stem: "Wie hieß das Spiel zuerst?", options: ["A) Monopoly", "B) The Landlord’s Game", "C) Real Estate Race", "D) Monopoly Classic"] },
        { stem: "Was wollte Elizabeth Magie Phillips mit dem Spiel zeigen?", options: ["A) Wie man Hotels kauft", "B) Wie unfair Monopole sind", "C) Wie man schnell Geld verdient", "D) Wie man mit Freunden spielt"] },
        { stem: "Was tat Charles Darrow mit dem Spiel?", options: ["A) Er spielte es nur mit Freunden.", "B) Er veröffentlichte es gemeinsam mit Phillips.", "C) Er gab es als seine eigene Idee aus.", "D) Er verschenkte es an Studenten."] },
        { stem: "Was bekam Elizabeth Magie Phillips für ihre Idee?", options: ["A) Einen großen Geldpreis", "B) Ruhm und Erfolg zu Lebzeiten", "C) Eine Auszeichnung", "D) So gut wie nichts"] },
        { stem: "Wie wurde das Spiel weltweit bekannt?", options: ["A) Durch Werbung in Zeitungen", "B) Weil Parker Brothers es verkaufte", "C) Weil Phillips es im Fernsehen präsentierte", "D) Durch ein berühmtes Turnier"] },
        { stem: "Wer schrieb ein Buch über die wahre Geschichte von Monopoly?", options: ["A) Charles Darrow", "B) Mary Pilon", "C) Parker Brothers", "D) Elizabeth Magie Phillips"] },
      ],
    },
  },
  listening: {
    status: "planned",
    title: "Hören material for Day 23 will be added here.",
    instructions: "The listening section is already prepared structurally. Add the video, instructions and self-check questions when the audio material is available.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones reserved for future listening content",
  },
  submitWritingDescription: "Paste your final 80–100 word opinion text.",
  submitReadingDescription: "Paste your seven reading answer letters.",
};

export default function B1Day23ErstesDateWorkbookPage() {
  return <B1StandardWorkbookPage config={config} />;
}
