export const B2_READING = Object.freeze({
  teil1: {
    title: "Teil 1",
    time: "18 Minuten",
    intro:
      "Sie lesen in einem Forum, wie Menschen über Minimalismus im täglichen Leben denken. Auf welche der vier Personen (A, B, C oder D) treffen die einzelnen Aussagen zu? Die Personen können mehrmals gewählt werden.",
    forumTitle: "Minimalismus – Befreiung oder moderner Luxus?",
    people: [
      {
        id: "A",
        name: "Sandra",
        meta: "34, Grafikdesignerin",
        text:
          "Vor zwei Jahren habe ich angefangen, mein Leben radikal auszumisten. Ich besaß viel zu viele Dinge, die mich gedanklich belastet haben. Beim Entrümpeln habe ich bestimmt die Hälfte meiner Kleidung und Möbel verschenkt oder verkauft. Seitdem fühle ich mich deutlich freier und habe viel weniger Stress im Alltag. Wenn ich heute etwas kaufe, achte ich extrem auf hohe Qualität und Langlebigkeit, anstatt mir billige Massenware anzuschaffen. Für mich bedeutet Minimalismus vor allem, sich auf das Wesentliche zu konzentrieren und nicht ständig dem neuesten Konsumtrend hinterherzulaufen.",
      },
      {
        id: "B",
        name: "Michael",
        meta: "41, Ingenieur",
        text:
          "Ich sehe diesen ganzen Hype um den Minimalismus eher kritisch. Ehrlich gesagt ist das für mich ein Phänomen von wohlhabenden Menschen, die es sich leisten können, Dinge wegzuwerfen – weil sie im Notfall einfach alles neu kaufen können. Als Vater von zwei Kindern ist ein minimalistischer Haushalt für mich völlig unpraktisch. Wir brauchen Werkzeuge, alte Kleidung zum Wechseln und Vorräte. Man weiß nie, wann man etwas noch einmal gebrauchen kann. Warum sollte ich gut funktionierende Gegenstände entsorgen, nur um einem Modetrend zu folgen?",
      },
      {
        id: "C",
        name: "Elena",
        meta: "28, Studentin",
        text:
          "Für mich steht beim Minimalismus der ökologische Aspekt im Vordergrund. Wenn wir weniger konsumieren, schützen wir die Umwelt und reduzieren Müll. Ich lebe auf engem Raum in einer WG und besitze kaum physische Gegenstände – Bücher, Musik und Dokumente habe ich komplett digitalisiert. Das spart enorm viel Platz. Außerdem gebe ich mein Geld lieber für Erlebnisse wie Reisen oder Konzertbesuche aus als für materielle Dinge. Dieser Lebensstil schont nicht nur meinen Geldbeutel, sondern macht mich auch viel flexibler.",
      },
      {
        id: "D",
        name: "Florian",
        meta: "52, Lehrer",
        text:
          "Ich bin durch eine berufliche Krise zum Minimalismus gekommen. Ich habe gemerkt, dass mich mein Vollzeitjob und der ständige Leistungsdruck krank gemacht haben. Deshalb habe ich meine Arbeitszeit reduziert. Ich verdiene zwar jetzt weniger Geld, habe aber viel mehr wertvolle Freizeit gewonnen. Für mich bedeutet Minimalismus nicht nur, weniger Dinge zu besitzen, sondern auch gedanklich auszumisten: weniger Zeit in sozialen Medien zu verbringen und öfter mal unerreichbar zu sein. Diese mentale Ruhe ist mir wichtiger als jeder materielle Wohlstand.",
      },
    ],
    example: {
      number: 0,
      statement: "hat durch das Entrümpeln der Wohnung mehr Leichtigkeit im Alltag gewonnen.",
      answer: "A",
    },
    questions: [
      { number: 1, statement: "meint, dass Minimalismus ein Trend für finanzielle Besserverdiener ist.", answer: "B" },
      { number: 2, statement: "legt beim Einkaufen großen Wert auf gute Verarbeitung und Haltbarkeit.", answer: "A" },
      { number: 3, statement: "nutzt digitale Medien, um Wohnraum zu sparen.", answer: "C" },
      { number: 4, statement: "verringerte die Arbeitszeit, um mehr Lebensqualität und Zeit zu haben.", answer: "D" },
      { number: 5, statement: "verzichtet bewusst auf die ständige Nutzung digitaler Netzwerke.", answer: "D" },
      { number: 6, statement: "hält es für sinnvoll, Gegenstände für eine spätere Nutzung aufzubewahren.", answer: "B" },
      { number: 7, statement: "investiert verfügbares Geld bevorzugt in Aktivitäten statt in Eigentum.", answer: "C" },
      { number: 8, statement: "sieht im verringerten Konsum vor allem einen Beitrag zum Umweltschutz.", answer: "C" },
      { number: 9, statement: "findet einen minimalistischen Lebensstil mit einer Familie schwer umsetzbar.", answer: "B" },
    ],
  },
});

export const B2_FINAL_MOCK_STORAGE_KEY = "falowen:b2-final-mock:b2-mock-01";
