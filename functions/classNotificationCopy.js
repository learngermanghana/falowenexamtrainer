"use strict";

// Notification language follows a student's explicit app-language setting,
// never the language of the course or the sender's browser.
const languageForStudent = (value) => {
  const normalized = String(value || "").trim().toLowerCase().slice(0, 2);
  return ["en", "de", "fr", "sw"].includes(normalized) ? normalized : "en";
};

const messages = {
  en: {
    tomorrow: ["Class tomorrow", "Open Falowen to see the class details."],
    "one-hour": ["Class starts in 1 hour", "Get ready for class."],
    "fifteen-minutes": ["Class starts in 15 minutes", "Open the class details now."],
    "checkin-open": ["Check-in is open", "Open attendance now."],
    cancelled: ["Class cancelled", "has been cancelled. Previous reminders were removed."],
    rescheduled: ["Class rescheduled", "has a new date or time. Open the updated class details."],
    open: "Open class", checkin: "Check in",
  },
  de: {
    tomorrow: ["Unterricht morgen", "Öffne Falowen für die Unterrichtsdetails."],
    "one-hour": ["Unterricht beginnt in 1 Stunde", "Bereite dich auf den Unterricht vor."],
    "fifteen-minutes": ["Unterricht beginnt in 15 Minuten", "Öffne jetzt die Unterrichtsdetails."],
    "checkin-open": ["Anwesenheitskontrolle geöffnet", "Öffne jetzt die Anwesenheitserfassung."],
    cancelled: ["Unterricht abgesagt", "wurde abgesagt. Frühere Erinnerungen wurden entfernt."],
    rescheduled: ["Unterricht verschoben", "hat einen neuen Termin. Öffne die aktualisierten Unterrichtsdetails."],
    open: "Unterricht öffnen", checkin: "Anwesenheit bestätigen",
  },
  fr: {
    tomorrow: ["Cours demain", "Ouvrez Falowen pour consulter les détails du cours."],
    "one-hour": ["Le cours commence dans 1 heure", "Préparez-vous pour le cours."],
    "fifteen-minutes": ["Le cours commence dans 15 minutes", "Consultez les détails du cours."],
    "checkin-open": ["Présence ouverte", "Confirmez votre présence maintenant."],
    cancelled: ["Cours annulé", "a été annulé. Les rappels précédents ont été supprimés."],
    rescheduled: ["Cours reporté", "a une nouvelle date ou heure. Consultez les informations mises à jour."],
    open: "Ouvrir le cours", checkin: "Confirmer ma présence",
  },
  sw: {
    tomorrow: ["Darasa kesho", "Fungua Falowen ili kuona maelezo ya darasa."],
    "one-hour": ["Darasa linaanza baada ya saa 1", "Jiandae kwa darasa."],
    "fifteen-minutes": ["Darasa linaanza baada ya dakika 15", "Fungua maelezo ya darasa sasa."],
    "checkin-open": ["Usajili wa mahudhurio umefunguliwa", "Thibitisha mahudhurio yako sasa."],
    cancelled: ["Darasa limefutwa", "limefutwa. Vikumbusho vya awali vimeondolewa."],
    rescheduled: ["Ratiba ya darasa imebadilika", "lina tarehe au saa mpya. Angalia taarifa mpya za darasa."],
    open: "Fungua darasa", checkin: "Thibitisha mahudhurio",
  },
};

const classCopy = ({ kind, sessionLabel = "Class", className = "", language = "en" } = {}) => {
  const code = languageForStudent(language);
  const localized = messages[code];
  const item = localized[kind];
  if (!Array.isArray(item)) return null;
  const subject = [String(sessionLabel || "Class").trim(), String(className || "").trim()].filter(Boolean).join(" · ");
  const punctuation = kind === "cancelled" || kind === "rescheduled" ? " " : ". ";
  return { title: item[0], body: `${subject}${punctuation}${item[1]}` };
};

const classActionLabel = (type, language) => {
  const code = languageForStudent(language);
  return type === "class_checkin_open" ? messages[code].checkin : messages[code].open;
};

module.exports = { languageForStudent, classCopy, classActionLabel };
