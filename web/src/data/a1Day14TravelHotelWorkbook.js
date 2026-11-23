// A1 Day 14 / Kapitel 3.6: the learner workbook mirrors the 12-slide lesson.
// Self-practice only. None of these exercises create a tutor-marked submission.
export const A1_DAY14_WORKBOOK_LEVEL = "A1";
export const A1_DAY14_WORKBOOK_DAY = 14;
export const A1_DAY14_WORKBOOK_CHAPTER = "3.6";
export const A1_DAY14_WORKBOOK_ROUTE = "/campus/course/modal-verbs-day-14-3-6";

export const DAY14_MODALS = Object.freeze([
  { verb: "können", translation: "can / be able to", function: "ability",
    sample: "Ich kann morgen mit dem Zug fahren.", picture: "🚆" },
  { verb: "möchten", translation: "would like to", function: "polite wish",
    sample: "Ich möchte ein Einzelzimmer buchen.", picture: "🛏️" },
  { verb: "wollen", translation: "want / intend to", function: "plan",
    sample: "Wir wollen in Berlin übernachten.", picture: "🧳" },
  { verb: "müssen", translation: "must / have to", function: "necessity",
    sample: "Ich muss in Hamburg umsteigen.", picture: "🔁" },
]);

export const DAY14_MODAL_FORMS = Object.freeze([
  { subject: "ich", können: "kann", möchten: "möchte", wollen: "will", müssen: "muss" },
  { subject: "du", können: "kannst", möchten: "möchtest", wollen: "willst", müssen: "musst" },
  { subject: "er / sie", können: "kann", möchten: "möchte", wollen: "will", müssen: "muss" },
  { subject: "wir", können: "können", möchten: "möchten", wollen: "wollen", müssen: "müssen" },
  { subject: "Sie", können: "können", möchten: "möchten", wollen: "wollen", müssen: "müssen" },
]);

export const DAY14_TRAIN_WORDS = Object.freeze([
  { word: "einsteigen", en: "get on / board", icon: "🚆", example: "Ich steige in den Zug ein." },
  { word: "aussteigen", en: "get off", icon: "🚉", example: "Ich steige in Berlin aus." },
  { word: "umsteigen", en: "change trains", icon: "🔁", example: "Ich steige in Hamburg um." },
  { word: "der Zug", en: "train", icon: "🚂", example: "Der Zug kommt um neun Uhr." },
  { word: "der Bahnhof", en: "train station", icon: "🏛️", example: "Ich bin am Bahnhof." },
  { word: "das Gleis", en: "platform / track", icon: "🔢", example: "Der Zug fährt von Gleis sieben ab." },
  { word: "die Fahrkarte", en: "ticket", icon: "🎟️", example: "Ich kaufe eine Fahrkarte." },
]);

export const DAY14_HOTEL_WORDS = Object.freeze([
  { word: "übernachten", en: "stay overnight", icon: "🌙", example: "Ich möchte im Hotel übernachten." },
  { word: "reservieren", en: "reserve", icon: "📞", example: "Ich möchte ein Zimmer reservieren." },
  { word: "buchen", en: "book", icon: "🗓️", example: "Wir möchten zwei Nächte buchen." },
  { word: "das Zimmer", en: "room", icon: "🔑", example: "Haben Sie ein Zimmer frei?" },
  { word: "das Einzelzimmer", en: "single room", icon: "🛌", example: "Ich möchte ein Einzelzimmer buchen." },
  { word: "das Doppelzimmer", en: "double room", icon: "🛏️", example: "Wir möchten ein Doppelzimmer." },
  { word: "die Nacht", en: "night", icon: "🌃", example: "Wir bleiben zwei Nächte." },
]);

// Model solutions are kept separately from inputs and never displayed before checking.
export const DAY14_GUIDED_CHECKS = Object.freeze([
  {
    id: "wish",
    prompt: "Ich ___ ein Einzelzimmer buchen.",
    options: ["möchte", "möchten", "muss"],
    answer: "möchte",
    note: "ich möchte expresses a polite wish. The infinitive buchen stays at the end.",
  },
  {
    id: "must-change",
    prompt: "Wir ___ in Hamburg umsteigen.",
    options: ["muss", "müssen", "musst"],
    answer: "müssen",
    note: "wir müssen: the modal is conjugated for wir; umsteigen remains one infinitive.",
  },
  {
    id: "get-off",
    prompt: "Du kannst in Berlin ___.",
    options: ["steigst aus", "aussteigen", "aus steigst"],
    answer: "aussteigen",
    note: "After kannst, use the complete infinitive aussteigen, not a split verb.",
  },
  {
    id: "time-first",
    prompt: "Morgen ___ ich nach Berlin fahren.",
    options: ["will", "ich will", "wollen"],
    answer: "will",
    note: "When Morgen comes first, the conjugated modal will still stands second.",
  },
]);

export const DAY14_WRITTEN_TASKS = Object.freeze([
  {
    id: "train-board",
    instruction: "Rewrite with möchten.",
    prompt: "Ich steige in den Zug ein.",
    answer: "Ich möchte in den Zug einsteigen.",
    hint: "Do not split einsteigen after a modal.",
  },
  {
    id: "train-change",
    instruction: "Rewrite with müssen.",
    prompt: "Ich steige in Hamburg um.",
    answer: "Ich muss in Hamburg umsteigen.",
    hint: "The conjugated modal is muss; the infinitive is umsteigen.",
  },
  {
    id: "hotel-request",
    instruction: "Rewrite politely with möchten.",
    prompt: "Ich reserviere ein Einzelzimmer.",
    answer: "Ich möchte ein Einzelzimmer reservieren.",
    hint: "Use möchte and put reservieren at the end.",
  },
  {
    id: "time-fronting",
    instruction: "Start the sentence with Morgen.",
    prompt: "Ich will morgen nach Berlin fahren.",
    answer: "Morgen will ich nach Berlin fahren.",
    hint: "The modal will must remain in position two.",
  },
  {
    id: "question",
    instruction: "Make a yes/no question.",
    prompt: "Du kannst morgen fahren.",
    answer: "Kannst du morgen fahren?",
    hint: "For a yes/no question, put Kannst at the start.",
  },
]);

export const DAY14_DEPARTURES = Object.freeze([
  { train: "ICE 593", to: "Hamburg Hbf", time: "14:20", platform: "7", status: "pünktlich" },
  { train: "RE 4", to: "Potsdam Hbf", time: "14:35", platform: "3", status: "+10 Min." },
  { train: "ICE 847", to: "München Hbf", time: "14:48", platform: "12", status: "Gleiswechsel" },
]);

// Fictional reference information, never a live booking or ticket.
export const DAY14_HOTEL_CONFIRMATION = Object.freeze({
  guest: "Alex",
  room: "Einzelzimmer",
  arrival: "18. Juli",
  departure: "20. Juli",
  nights: "zwei Nächte",
});

export const DAY14_HOTEL_DIALOGUE = Object.freeze([
  { speaker: "Gast", text: "Guten Tag. Ich möchte ein Einzelzimmer buchen." },
  { speaker: "Rezeption", text: "Für wie viele Nächte?" },
  { speaker: "Gast", text: "Für zwei Nächte, bitte." },
  { speaker: "Rezeption", text: "Ja, wir haben ein Zimmer frei." },
  { speaker: "Gast", text: "Vielen Dank!" },
]);

export const DAY14_KNOWLEDGE_QUESTIONS = Object.freeze([
  {
    id: "prior-verb-order",
    category: "Grammar",
    prompt: "Which is a correct time-first German statement?",
    options: [
      "Morgen ich fahre nach Berlin.",
      "Morgen fahre ich nach Berlin.",
      "Morgen ich nach Berlin fahre.",
    ],
    answer: "Morgen fahre ich nach Berlin.",
    explanation: "The conjugated verb comes second, even when Morgen is first.",
  },
  {
    id: "separable-before",
    category: "Grammar",
    prompt: "Which sentence correctly uses the separable verb einsteigen without a modal?",
    options: [
      "Ich steige in den Zug ein.",
      "Ich einsteige in den Zug.",
      "Ich steige ein in den Zug ein.",
    ],
    answer: "Ich steige in den Zug ein.",
    explanation: "Without a modal, steige is conjugated and ein moves to the end.",
  },
  {
    id: "infinitive-modal",
    category: "Grammar",
    prompt: "Ich muss in Hamburg ___.",
    options: ["steige um", "umsteigen", "umsteige"],
    answer: "umsteigen",
    explanation: "After muss, use the complete infinitive umsteigen.",
  },
  {
    id: "hotel-modal",
    category: "Grammar",
    prompt: "Choose the correct polite hotel request.",
    options: [
      "Ich will ein Zimmer buche.",
      "Ich möchte buchen ein Zimmer.",
      "Ich möchte ein Zimmer buchen.",
    ],
    answer: "Ich möchte ein Zimmer buchen.",
    explanation: "möchte + object + final infinitive buchen is the useful polite pattern.",
  },
  {
    id: "question",
    category: "Grammar",
    prompt: "Change Du kannst morgen fahren into a yes/no question.",
    options: [
      "Kannst du morgen fahren?",
      "Du kannst morgen fahren?",
      "Kannst morgen du fahren?",
    ],
    answer: "Kannst du morgen fahren?",
    explanation: "The conjugated modal comes first in a yes/no question.",
  },
  {
    id: "time-first-modal",
    category: "Grammar",
    prompt: "Which sentence has correct modal-verb word order?",
    options: [
      "Heute ich will nach Berlin fahren.",
      "Heute will ich nach Berlin fahren.",
      "Heute will nach Berlin fahren ich.",
    ],
    answer: "Heute will ich nach Berlin fahren.",
    explanation: "Heute takes the first position, will is still position two, fahren is last.",
  },
  {
    id: "train-reading",
    category: "Reading",
    prompt: "Abfahrtstafel: Auf welchem Gleis fährt ICE 593 ab?",
    options: ["Gleis 3", "Gleis 7", "Gleis 12"],
    answer: "Gleis 7",
    explanation: "The ICE 593 is shown on Gleis 7 in the departure board.",
  },
  {
    id: "hotel-reading",
    category: "Reading",
    prompt: "Hotelreservierung: Für wie viele Nächte hat Alex reserviert?",
    options: ["Für eine Nacht", "Für drei Nächte", "Für zwei Nächte"],
    answer: "Für zwei Nächte",
    explanation: "The confirmation says 18.–20. Juli, that is two nights.",
  },
]);

export const DAY14_FINAL_TASKS = Object.freeze([
  { id: "ability", label: "1 · können", prompt: "Say what you can do on a train journey.", model: "Ich kann morgen mit dem Zug fahren." },
  { id: "wish", label: "2 · möchten", prompt: "Say which hotel room you would like to book.", model: "Ich möchte ein Einzelzimmer buchen." },
  { id: "intention", label: "3 · wollen", prompt: "Say which city you want to visit.", model: "Ich will nach Berlin fahren." },
  { id: "necessity", label: "4 · müssen", prompt: "Say where you have to change trains.", model: "Ich muss in Hamburg umsteigen." },
  { id: "separable", label: "5 · Trennbares Verb", prompt: "Say where or when you get on or off a train without a modal.", model: "Ich steige am Hauptbahnhof aus." },
]);

export const normalizeDay14Sentence = (value) =>
  String(value || "")
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("de-DE")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ");
