import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";

const config = {
  day: 26,
  chapter: "9.26",
  assignmentKey: "B1-9.26",
  workbookId: "B1Day26ReiseproblemeUndLoesungen",
  title: "Reiseprobleme und Lösungen",
  heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Airport departures board and travel planning",
  speaking: {
    question: "Welche Reiseprobleme können passieren, und wie kann man sie lösen?",
    instructions: "Beschreibe typische Probleme auf Reisen, erkläre passende Lösungen und plane mit deiner Gruppe, wie ihr in einer schwierigen Situation reagieren würdet.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Airport scene representing travel problems",
    ideaTitle: "Brain Map: Reiseprobleme und Lösungen",
    ideaGroups: [
      { title: "Typische Reiseprobleme", items: ["Flug, Zug oder Bus hat Verspätung", "Gepäck geht verloren", "Kein Hotelzimmer verfügbar", "Reisepass, Ticket oder Visum fehlt", "Krankheit oder Unfall", "Verständigungsprobleme", "Streik"] },
      { title: "Lösungen und Reaktionen", items: ["Umbuchung vornehmen", "Reklamation machen", "Reiseversicherung kontaktieren", "Neues Hotel buchen", "Arzt oder Apotheke aufsuchen", "Übersetzungs-App nutzen", "Hotline oder Reiseleitung anrufen"] },
      { title: "Wichtige Vorbereitung", items: ["Reiseunterlagen kontrollieren", "Notrufnummern speichern", "Medikamente mitnehmen", "Versicherung abschließen", "Wichtige Kontakte notieren", "Pufferzeit einplanen"] },
      { title: "Höfliche Redemittel", items: ["Können Sie mir bitte weiterhelfen?", "Mein Gepäck ist nicht angekommen.", "Ich habe eine Reservierung auf den Namen …", "Wo ist das nächste Krankenhaus?", "Ich möchte eine Umbuchung.", "Ich möchte mein Geld zurück."] },
    ],
    activityTitle: "Gemeinsam eine Reise mit Notfallplan planen",
    activityIntro: "Plant eine Reise und besprecht mögliche Probleme:",
    activityPoints: [
      "Wohin möchtet ihr reisen?",
      "Welches Verkehrsmittel benutzt ihr?",
      "Welche Probleme könnten auftreten?",
      "Welche Dokumente und Kontakte braucht ihr?",
      "Wie reagiert ihr bei Verspätung, verlorenem Gepäck oder Krankheit?",
    ],
    answerStructure: [
      "Reiseziel und Verkehrsmittel vorstellen.",
      "Ein oder zwei mögliche Reiseprobleme beschreiben.",
      "Die Folgen des Problems erklären.",
      "Konkrete Lösungen und hilfreiche Kontakte nennen.",
      "Sagen, wie man sich besser vorbereiten kann.",
    ],
    usefulPhrases: ["Mein Flug hat Verspätung.", "Mein Gepäck ist nicht angekommen.", "Können Sie mir bitte weiterhelfen?", "Ich würde zuerst …", "Falls das passiert, kann man …"],
  },
  writing: {
    title: "Schreiben Sie einen informellen Brief über eine Reise mit Problemen.",
    instructions: "Sie haben eine Reise gemacht, aber es gab mehrere Probleme. Schreiben Sie Ihrem Freund Max oder Ihrer Freundin Lisa und erzählen Sie, was passiert ist.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Writing an informal letter about a journey",
    taskPoints: [
      "Wohin Sie gefahren sind und wie Sie gereist sind",
      "Was genau passiert ist",
      "Wie Sie sich in dieser Situation gefühlt haben",
      "Was Sie gemacht haben, um das Problem zu lösen",
      "Wie die Reise am Ende weiterging",
    ],
    supportStructure: ["Begrüßung", "Reiseziel und Verkehrsmittel", "Problem beschreiben", "Lösung erklären", "Ergebnis und Gefühl", "Gruß"],
    template: "Hallo Max / Hallo Lisa,\n\nwie geht es dir? Ich möchte dir von meiner Reise nach [Ort] erzählen. Ich bin mit [Verkehrsmittel] gefahren.\n\nLeider … Danach habe ich …\n\nAm Ende …\n\nLiebe Grüße\n[Name]",
    vocabulary: ["Verspätung haben", "das Gepäck verlieren", "eine Reservierung bestätigen", "umbuchen", "den Kundenservice kontaktieren", "eine Lösung finden"],
  },
  reading: {
    title: "Lesen Sie den Text und beantworten Sie alle sieben Fragen.",
    instructions: "Read the complete text about tourism in Germany. Then choose one answer, A–D, for every question.",
    image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Open travel magazine for reading comprehension",
    text: {
      title: "Urlaubsland Deutschland",
      paragraphs: [
        "Die Auswahl an Attraktionen erscheint fast unbegrenzt, was Deutschland auch bei den eigenen Einwohnern zum populären Urlaubsland macht. Die Deutschen verreisen gerne – und das auch innerhalb ihres Landes, zum Beispiel in das Bundesland Mecklenburg-Vorpommern. Im Sommer wünschen sich viele einen Strandurlaub, und dazu bieten die Ostsee und ihre bekannten Inseln Rügen und Usedom eine wunderschöne Gelegenheit.",
        "Die Mecklenburgische Seenplatte mit ihren mehr als 1.000 Seen lockt Wassersportler und Wanderfans. Das Bundesland Bayern, ebenfalls ein beliebtes Reiseziel, hat zwar keine Meeresküste, aber zahlreiche andere Attraktionen. Die Alpen begeistern Wanderer, Biker und Wintersportler. Die Zugspitze, der Watzmann am Königssee und die weltbekannten Schlösser Ludwigs II. wie Neuschwanstein, Herrenchiemsee oder Linderhof sind nur einige Beispiele für die Vielfalt im deutschen Süden.",
        "Auch internationale Touristen wählen Deutschland immer öfter als Reiseziel. Häufig kommen Besucher aus europäischen Nachbarländern, aber auch aus den USA, Asien und den arabischen Golfstaaten. Für ausländische Gäste gehört oft ein Besuch in Berlin dazu. Auch Hamburg, Köln, Dresden und München sind sehr beliebt. München zieht mit dem weltberühmten Oktoberfest Besucher aus aller Welt an.",
        "Weitere bekannte Ziele sind der Schwarzwald, der Bodensee und der Vergnügungspark Rust in Baden-Württemberg. Wer perfektes Sommerwetter immer sonnig und warm erwartet, wird in Deutschland allerdings nicht immer glücklich. Deshalb buchen viele Deutsche oft kurzfristig doch noch eine Reise ins Ausland.",
      ],
      questions: [
        { stem: "Welches Bundesland ist bekannt für seine Strände an der Ostsee?", options: ["A) Bayern", "B) Mecklenburg-Vorpommern", "C) Baden-Württemberg", "D) Hessen"] },
        { stem: "Was ist ein bekanntes Ziel in Bayern für Wanderer und Wintersportler?", options: ["A) Die Zugspitze", "B) Der Bodensee", "C) Das Brandenburger Tor", "D) Rügen"] },
        { stem: "Welche Inseln gehören zur Ostsee in Mecklenburg-Vorpommern?", options: ["A) Rügen und Usedom", "B) Sylt und Föhr", "C) Mallorca und Ibiza", "D) Borkum und Norderney"] },
        { stem: "Was zieht internationale Touristen nach Deutschland?", options: ["A) Nur Berlin", "B) Städte wie Berlin, Hamburg, Köln und München", "C) Nur die Berge in Bayern", "D) Nur kleine Dörfer"] },
        { stem: "Welches große Ereignis in München zieht Besucher aus aller Welt an?", options: ["A) Die Berlinale", "B) Das Oktoberfest", "C) Die Kieler Woche", "D) Der Karneval in Köln"] },
        { stem: "Welche Sehenswürdigkeiten sind im Süden von Deutschland besonders bekannt?", options: ["A) Neuschwanstein, Herrenchiemsee und Linderhof", "B) Rügen und Usedom", "C) Das Brandenburger Tor", "D) Die Weltzeituhr"] },
        { stem: "Warum buchen viele Deutsche kurzfristig Reisen ins Ausland?", options: ["A) Weil Deutschland keine Urlaubsorte hat", "B) Weil das Wetter nicht immer sonnig und warm ist", "C) Weil alle Hotels geschlossen sind", "D) Weil Reisen im Inland verboten sind"] },
      ],
    },
  },
  listening: {
    title: "Bearbeiten Sie den Goethe-standard Hören-Test und kontrollieren Sie Ihre Antworten selbst.",
    instructions: "Listen carefully for places, times, reasons, problems and decisions. Check the solutions only after completing the task.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones for travel listening comprehension",
    videoId: "0sZVT9XAEBc",
    externalUrl: "https://youtu.be/0sZVT9XAEBc",
    selfCheckText: "The solutions are provided in the video. Mark your own Hören result. Only Lesen and Schreiben are submitted for tutor evaluation.",
  },
  submitWritingDescription: "Paste your final informal travel letter.",
  submitReadingDescription: "Paste your seven reading answer letters.",
};

export default function B1Day26ReiseproblemeUndLoesungenWorkbookPage() {
  return <B1StandardWorkbookPage config={config} />;
}
