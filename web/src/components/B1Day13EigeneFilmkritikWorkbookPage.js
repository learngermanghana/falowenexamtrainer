import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";

export const B1_DAY13_EIGENE_FILMKRITIK_WORKBOOK_CONFIG = {
  day: 13,
  chapter: "4.13",
  assignmentKey: "B1-4.13",
  workbookId: "B1Day13EigeneFilmkritik",
  title: "Eigene Filmkritik schreiben",
  subtitle: "Schreibe und bespreche eine eigene Filmkritik. Teil 1 ist Gruppenpraxis; Teil 2, Teil 3 und Teil 4 bereitest du für die Abgabe vor.",
  heroImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Kinosaal und Filmkritik Thema",
  speaking: {
    question: "Erzähle von einem Film, den du gesehen hast. Worum geht es, wie fandest du ihn und würdest du ihn empfehlen?",
    instructions: "Bereite eine kurze B1-Präsentation über einen Film vor. Beschreibe Handlung, Schauspiel, Atmosphäre, Regie und deine Empfehlung.",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Kino und Filmplakate",
    ideaTitle: "Zentrales Thema: Meine Filmkritik",
    ideaIntro: "In this chapter, we'll engage in group exercises discussing film reviews, movie plots, acting, atmosphere, production and recommendations.",
    ideaGroups: [
      {
        title: "1. Handlung",
        items: [
          "Worum geht es im Film? Der Film handelt von ...",
          "Genre und Zeit: Komödie, Drama, Action, Thriller, Science-Fiction, Historienfilm.",
          "Wo spielt die Geschichte? In der Zukunft, in einer Großstadt, in einem kleinen Dorf, im Weltall.",
          "Gibt es eine überraschende Wendung? Eine unerwartete Wendung ist ...",
          "Ist der Film auf einer wahren Geschichte basiert? Ja / Nein.",
        ],
      },
      {
        title: "2. Schauspiel",
        items: [
          "Wer spielt die Hauptrolle? Die Hauptrolle spielt ...",
          "Wie ist die Leistung? überzeugend, emotional, langweilig, beeindruckend.",
          "Welche Nebenrollen gibt es? Eine wichtige Nebenrolle ist ...",
          "Gibt es bekannte Schauspieler? Ja / Nein.",
        ],
      },
      {
        title: "3. Atmosphäre",
        items: [
          "Musik und Sound: spannend, dramatisch, melancholisch, fröhlich.",
          "Kamera und Farben: dunkel, hell, bunt, schwarz-weiß.",
          "Ort und Stimmung: mysteriös, aufregend, romantisch, traurig.",
          "Spezialeffekte: realistisch, fantastisch, übertrieben.",
          "Dialoge und Sprache: natürlich, künstlich, lustig, tiefgründig.",
        ],
      },
      {
        title: "4. Regie und Produktion",
        items: [
          "Wer ist der Regisseur? Der Film wurde von ... gedreht.",
          "Wann wurde der Film veröffentlicht? Der Film kam ... ins Kino.",
          "Wo wurde der Film gedreht? In den USA, in Deutschland, in Afrika.",
          "Hat der Film Preise gewonnen? Der Film hat den Oscar für ... gewonnen.",
        ],
      },
      {
        title: "5. Empfehlung",
        items: [
          "Hat dir der Film gefallen? Mir hat der Film gefallen, weil ...",
          "Was hat dir nicht gefallen? Ich fand ... nicht so gut.",
          "Für wen ist der Film geeignet? Kinder, Jugendliche, Erwachsene, Fans von ...",
          "Würdest du den Film empfehlen? Ja, ich empfehle ihn, weil ... / Nein, ich würde ihn nicht empfehlen, weil ...",
          "Würdest du den Film nochmal sehen? Ja, ich würde ihn nochmal sehen, weil ...",
        ],
      },
    ],
    exampleTitle: "Beispielantwort",
    exampleSteps: [
      "Ich habe kürzlich den Film Inception gesehen.",
      "Der Film handelt von einem Mann, der in die Träume anderer Menschen eindringen kann.",
      "Die Hauptrolle spielt Leonardo DiCaprio, und seine schauspielerische Leistung ist sehr überzeugend.",
      "Die Atmosphäre ist spannend und geheimnisvoll, mit großartigen Spezialeffekten und epischer Musik.",
      "Der Regisseur Christopher Nolan hat den Film im Jahr 2010 veröffentlicht, und er wurde ein großer Erfolg.",
      "Mir hat der Film sehr gefallen, weil die Geschichte einzigartig ist und das Schauspiel hervorragend.",
      "Ich empfehle den Film für alle, die spannende Thriller und Science-Fiction mögen.",
    ],
    activityTitle: "Schlüsselwörter für deine Präsentation",
    activityPoints: [
      "Begrüßung und Vorstellung des Themas: Ich möchte heute über einen Film sprechen, den ich gesehen habe.",
      "Inhalt und Struktur: Der Film handelt von ... Die Hauptfiguren sind ...",
      "Persönliche Erfahrung: Mir hat der Film gefallen / nicht gefallen, weil ...",
      "Situation in deinem Heimatland: In meinem Heimatland sind solche Filme beliebt / unbekannt, weil ...",
      "Vor- und Nachteile: Ein Vorteil ist ... Ein Nachteil ist ...",
      "Schluss und Dank: Zusammenfassend kann ich sagen ... Danke fürs Zuhören!",
    ],
    activityOrdered: true,
    answerStructure: [
      "Begrüße dein Publikum und nenne den Film.",
      "Beschreibe Genre, Handlung, Ort und Hauptfiguren.",
      "Bewerte Schauspiel, Musik, Kamera und Atmosphäre.",
      "Nenne eine Stärke und eine Schwäche des Films.",
      "Vergleiche kurz mit Filmen in deinem Heimatland.",
      "Gib eine klare Empfehlung und beende deine Präsentation.",
    ],
    usefulPhrases: [
      "Der Film handelt von ...",
      "Die Hauptrolle spielt ...",
      "Die Atmosphäre ist spannend / traurig / mysteriös.",
      "Besonders gut fand ich, dass ...",
      "Nicht so gut fand ich, dass ...",
      "Ich würde den Film empfehlen, weil ...",
      "Für Fans von ... ist der Film sehr geeignet.",
    ],
  },
  writing: getB1WritingTask(13),
  reading: getB1ReadingTask(13),
  listening: {
    title: "Hören Sie den Vortrag über Spannung im Film und beantworten Sie die fünf Fragen.",
    instructions: "Hören Sie aufmerksam zu. Notieren Sie die richtigen Antwortbuchstaben und reichen Sie sie im Submit-Tab ein.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Filmproduktion und Hören",
    embedUrl: "https://www.youtube.com/embed/gFDy1atY9K4",
    externalUrl: "https://youtu.be/gFDy1atY9K4",
    videoTitle: "B1 Day 13 Eigene Filmkritik Hören",
    submitRequired: true,
    selfCheckText: "Hören ist Teil dieser Übung. Reichen Sie Ihre fünf Antwortbuchstaben im Submit-Tab ein.",
    questions: [
      { stem: "Was ist laut dem Sprecher ein wichtiges Element vieler erfolgreicher Filme?", options: ["a) Humor", "b) Spannung", "c) Liebesgeschichten", "d) Spezialeffekte"] },
      { stem: "Was kann laut dem Sprecher Spannung in einem Thriller erzeugen?", options: ["a) Laute Musik", "b) Ein leises, schleichendes Geräusch", "c) Helle Farben", "d) Romantische Dialoge"] },
      { stem: "Wie trägt die Kameraarbeit zur Spannung bei?", options: ["a) Durch ruhige, lange Szenen", "b) Durch schnelle Schnitte und Nahaufnahmen", "c) Durch weite Landschaftsaufnahmen", "d) Durch die Verwendung von Schwarz-Weiß-Filtern"] },
      { stem: "Was hält die Zuschauer laut dem Sprecher in Atem?", options: ["a) Das Vorhersehbare", "b) Die schauspielerische Leistung", "c) Die Ungewissheit über den Verlauf der Handlung", "d) Die Länge des Films"] },
      { stem: "Warum schätzen viele Menschen Filme mit Spannung?", options: ["a) Weil sie romantische Geschichten lieben", "b) Weil sie gerne Spezialeffekte sehen", "c) Weil sie Abenteuer ohne echte Gefahr erleben wollen", "d) Weil sie Humor bevorzugen"] },
    ],
    steps: [
      "Hören Sie den Vortrag einmal komplett.",
      "Lesen Sie die Fragen und Antwortmöglichkeiten.",
      "Hören Sie wichtige Stellen ein zweites Mal.",
      "Schreiben Sie Ihre fünf Antwortbuchstaben in den Submit-Tab.",
    ],
  },
  submitListening: true,
  submitWritingDescription: "Paste your opinion essay about spannende Filme und ruhige Filme.",
  submitReadingDescription: "Paste your seven reading answer letters.",
  submitListeningDescription: "Paste your five listening answer letters.",
};

export default function B1Day13EigeneFilmkritikWorkbookPage() {
  return <B1StandardWorkbookPage config={B1_DAY13_EIGENE_FILMKRITIK_WORKBOOK_CONFIG} />;
}
