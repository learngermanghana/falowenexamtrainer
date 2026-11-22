"use strict";
const { languageForStudent } = require("./classNotificationCopy");

// Interface copy only. Do not translate teacher-authored feedback, assignment
// names, tuition amounts or study content.
const dictionary = {
  en: {
    dueToday: "Payment reminder: contract ends today", dueDays: (n) => `Payment reminder: ${n} day${n === 1 ? "" : "s"} left`,
    paymentToday: (amount) => `Your Falowen contract ends today. Please clear your balance of ${amount}.`,
    paymentDays: (n, amount) => `Your Falowen contract ends in ${n} day${n === 1 ? "" : "s"}. Please clear your balance of ${amount}.`,
    marked: "Your assignment has been marked", passed: (score) => `Score: ${score} · Passed. Open Results to read your feedback.`,
    retry: (score) => `Score: ${score} · Needs improvement. Open Results and resubmit.`,
    classNote: (title) => `New class note: ${title}`, question: (title) => `New class question: ${title}`,
    noteBody: (author, lesson) => `${author} added an update for ${lesson}.`, someone: "Someone", thisLesson: "this lesson",
  },
  de: {
    dueToday: "Zahlungserinnerung: Vertrag endet heute", dueDays: (n) => `Zahlungserinnerung: Noch ${n} Tage`,
    paymentToday: (amount) => `Dein Falowen-Vertrag endet heute. Bitte begleiche den Restbetrag von ${amount}.`,
    paymentDays: (n, amount) => `Dein Falowen-Vertrag endet in ${n} Tagen. Bitte begleiche den Restbetrag von ${amount}.`,
    marked: "Deine Aufgabe wurde bewertet", passed: (score) => `Punkte: ${score} · Bestanden. Öffne Ergebnisse für dein Feedback.`,
    retry: (score) => `Punkte: ${score} · Verbesserung nötig. Öffne Ergebnisse und reiche erneut ein.`,
    classNote: (title) => `Neue Kursnotiz: ${title}`, question: (title) => `Neue Kursfrage: ${title}`,
    noteBody: (author, lesson) => `${author} hat einen Beitrag zu ${lesson} hinzugefügt.`, someone: "Jemand", thisLesson: "dieser Lektion",
  },
  fr: {
    dueToday: "Rappel de paiement : contrat terminé aujourd'hui", dueDays: (n) => `Rappel de paiement : encore ${n} jours`,
    paymentToday: (amount) => `Votre contrat Falowen se termine aujourd'hui. Veuillez régler le solde de ${amount}.`,
    paymentDays: (n, amount) => `Votre contrat Falowen se termine dans ${n} jours. Veuillez régler le solde de ${amount}.`,
    marked: "Votre devoir a été corrigé", passed: (score) => `Note : ${score} · Réussi. Ouvrez Résultats pour voir les commentaires.`,
    retry: (score) => `Note : ${score} · À améliorer. Consultez Résultats et renvoyez le devoir.`,
    classNote: (title) => `Nouvelle note de cours : ${title}`, question: (title) => `Nouvelle question de cours : ${title}`,
    noteBody: (author, lesson) => `${author} a publié une mise à jour concernant ${lesson}.`, someone: "Une personne", thisLesson: "cette leçon",
  },
  sw: {
    dueToday: "Kikumbusho cha malipo: mkataba unaisha leo", dueDays: (n) => `Kikumbusho cha malipo: siku ${n} zimebaki`,
    paymentToday: (amount) => `Mkataba wako wa Falowen unaisha leo. Tafadhali lipa salio la ${amount}.`,
    paymentDays: (n, amount) => `Mkataba wako wa Falowen unaisha baada ya siku ${n}. Tafadhali lipa salio la ${amount}.`,
    marked: "Kazi yako imesahihishwa", passed: (score) => `Alama: ${score} · Umefaulu. Fungua Matokeo ili kuona maoni.`,
    retry: (score) => `Alama: ${score} · Inahitaji maboresho. Fungua Matokeo na uwasilishe tena.`,
    classNote: (title) => `Ujumbe mpya wa darasa: ${title}`, question: (title) => `Swali jipya la darasa: ${title}`,
    noteBody: (author, lesson) => `${author} ameongeza taarifa kuhusu ${lesson}.`, someone: "Mtu", thisLesson: "somo hili",
  },
};

const strings = lang => dictionary[languageForStudent(lang)];
const paymentReminderCopy = ({ daysLeft, amount, language } = {}) => {
  const t = strings(language);
  return {
    title: daysLeft === 0 ? t.dueToday : t.dueDays(daysLeft),
    body: daysLeft === 0 ? t.paymentToday(amount) : t.paymentDays(daysLeft, amount),
  };
};
const markedAssignmentCopy = ({ scoreLabel, passed, language } = {}) => {
  const t = strings(language);
  return { title: t.marked, body: passed ? t.passed(scoreLabel) : t.retry(scoreLabel) };
};
const classNoteCopy = ({ note = {}, isTutorPost, language, truncate } = {}) => {
  const t = strings(language);
  const subject = truncate(note.title || "Class update", 48);
  const title = isTutorPost ? t.classNote(subject) : t.question(subject);
  return { title, body: truncate(note.body || t.noteBody(note.createdBy || t.someone, note.lessonTitle || t.thisLesson), 140) };
};
module.exports = { paymentReminderCopy, markedAssignmentCopy, classNoteCopy };
