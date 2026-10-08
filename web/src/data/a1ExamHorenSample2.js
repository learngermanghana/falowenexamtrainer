export const A1_EXAM_HOEREN_SAMPLE_2_TEIL1 = Object.freeze({
  id: "a1-hoeren-sample-2-teil-1",
  title: "Teil 1",
  instruction: "Fragen 1 bis 5: Kreuzen Sie die richtige Antwort an.",
  responseInstruction: "Wählen Sie bei jeder Aufgabe a, b oder c.",
  audioObjectKey: "a1/horen-part-2/teil-1.mp3",
  plays: 1,
  questions: [
    {
      number: 1,
      question: "Wann treffen sich Tom und Anna?",
      options: [
        { id: "a", label: "Um drei Uhr.", picture: { type: "clock", value: "15:00" } },
        { id: "b", label: "Um vier Uhr.", picture: { type: "clock", value: "16:00" } },
        { id: "c", label: "Um fünf Uhr.", picture: { type: "clock", value: "17:00" } },
      ],
      answer: "b",
    },
    {
      number: 2,
      question: "Was ist die Durchsage?",
      options: [
        { id: "a", label: "Der Zug kommt früher.", picture: { type: "train", value: "early" } },
        { id: "b", label: "Der Zug hat Verspätung.", picture: { type: "train", value: "delay" } },
        { id: "c", label: "Der Zug fällt aus.", picture: { type: "train", value: "cancelled" } },
      ],
      answer: "b",
    },
    {
      number: 3,
      question: "Was soll die Patientin tun?",
      options: [
        { id: "a", label: "Am Montag kommen.", picture: { type: "action", value: "calendar" } },
        { id: "b", label: "Eine E-Mail schreiben.", picture: { type: "action", value: "email" } },
        { id: "c", label: "In der Praxis anrufen.", picture: { type: "action", value: "phone" } },
      ],
      answer: "c",
    },
    {
      number: 4,
      question: "Was kostet ein Kilo Äpfel?",
      options: [
        { id: "a", label: "Zwei Euro.", picture: { type: "apples", value: "2 €" } },
        { id: "b", label: "Drei Euro.", picture: { type: "apples", value: "3 €" } },
        { id: "c", label: "Vier Euro.", picture: { type: "apples", value: "4 €" } },
      ],
      answer: "a",
    },
    {
      number: 5,
      question: "Was soll Lisa kaufen?",
      options: [
        { id: "a", label: "Brot und Milch.", picture: { type: "shopping", value: "bread-milk" } },
        { id: "b", label: "Käse und Wasser.", picture: { type: "shopping", value: "cheese-water" } },
        { id: "c", label: "Obst und Brot.", picture: { type: "shopping", value: "fruit-bread" } },
      ],
      answer: "a",
    },
  ],
});


export const A1_EXAM_HOEREN_SAMPLE_2_TEIL2 = Object.freeze({
  id: "a1-hoeren-sample-2-teil-2",
  title: "Teil 2",
  instruction: "Fragen 6 bis 10: Kreuzen Sie die richtige Antwort an.",
  responseInstruction: "Wählen Sie bei jeder Aufgabe a, b oder c.",
  audioObjectKey: "a1/horen-part-2/teil-2.mp3",
  plays: 1,
  example: {
    question: "Wohin fährt der Bus Linie 12 heute?",
    options: [
      { id: "a", label: "Zum Flughafen." },
      { id: "b", label: "Zum Bahnhof." },
      { id: "c", label: "Zum Markt." },
    ],
  },
  questions: [
    {
      number: 6,
      question: "Wann ist die Bibliothek heute offen?",
      options: [
        { id: "a", label: "Von neun bis siebzehn Uhr." },
        { id: "b", label: "Von zehn bis achtzehn Uhr." },
        { id: "c", label: "Von zehn bis zwanzig Uhr." },
      ],
      answer: "b",
    },
    {
      number: 7,
      question: "Was gibt es heute mit Rabatt?",
      options: [
        { id: "a", label: "Kleider." },
        { id: "b", label: "Schuhe." },
        { id: "c", label: "Taschen." },
      ],
      answer: "b",
    },
    {
      number: 8,
      question: "Wie ist das Wetter am Nachmittag?",
      options: [
        { id: "a", label: "Es regnet." },
        { id: "b", label: "Es ist windig." },
        { id: "c", label: "Die Sonne scheint." },
      ],
      answer: "c",
    },
    {
      number: 9,
      question: "Wann ist der Friseur wieder offen?",
      options: [
        { id: "a", label: "Am Samstag." },
        { id: "b", label: "Am Montag." },
        { id: "c", label: "Am Dienstag." },
      ],
      answer: "b",
    },
    {
      number: 10,
      question: "Wann schließt das Schwimmbad heute?",
      options: [
        { id: "a", label: "Um sechzehn Uhr." },
        { id: "b", label: "Um siebzehn Uhr." },
        { id: "c", label: "Um achtzehn Uhr." },
      ],
      answer: "c",
    },
  ],
});
