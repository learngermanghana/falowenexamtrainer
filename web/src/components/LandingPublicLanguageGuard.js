import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LANDING_LANGUAGE_KEY = "falowen:landing-interface-language";
const SUPPORTED_LANGUAGES = new Set(["en", "de", "fr"]);

const normalizeLanguage = (value) => {
  const normalized = String(value || "").trim().toLowerCase().slice(0, 2);
  return SUPPORTED_LANGUAGES.has(normalized) ? normalized : "";
};

const readLandingLanguage = () => {
  try {
    return normalizeLanguage(window.localStorage.getItem(LANDING_LANGUAGE_KEY));
  } catch (_error) {
    return "";
  }
};

const writeLandingLanguage = (language) => {
  try {
    const normalized = normalizeLanguage(language) || "en";
    window.localStorage.setItem(LANDING_LANGUAGE_KEY, normalized);
  } catch (_error) {}
};

const detectLanguageButton = (text = "") => {
  const normalized = String(text || "").toLowerCase();
  if (normalized.includes("english") || normalized.includes("englisch")) return "en";
  if (normalized.includes("deutsch") || normalized.includes("german")) return "de";
  if (normalized.includes("français") || normalized.includes("francais") || normalized.includes("french") || normalized.includes("französisch")) return "fr";
  return "";
};

const STATIC_TEXT = {
  de: {
    "View upcoming classes": "Kommende Kurse ansehen",
    "Free placement test": "Kostenloser Einstufungstest",
    "Take free placement test": "Kostenlosen Einstufungstest machen",
    "Choose a class": "Kurs auswählen",
    "Open class brochure": "Kursbroschüre öffnen",
    "Take placement test": "Einstufungstest machen",
    "Talk to us": "Mit uns sprechen",
    "Today in Falowen": "Heute in Falowen",
    "A1 German practice": "A1 Deutsch üben",
    "Live": "Live",
    "Course lesson": "Kurslektion",
    "Watch, practise, and submit your workbook task.": "Video ansehen, üben und die Workbook-Aufgabe einreichen.",
    "Exam warm-up": "Prüfungsvorbereitung",
    "Short speaking and writing tasks with tutor feedback.": "Kurze Sprech- und Schreibaufgaben mit Tutorfeedback.",
    "Progress tracking": "Fortschritt verfolgen",
    "Scores, attendance, and exam readiness in one place.": "Ergebnisse, Anwesenheit und Prüfungsbereitschaft an einem Ort.",
    "Your Falowen path": "Dein Falowen-Weg",
    "Simple journey": "Einfacher Ablauf",
    "Check your level": "Niveau prüfen",
    "Use the free placement test if you are not sure.": "Nutze den kostenlosen Einstufungstest, wenn du unsicher bist.",
    "Choose your class": "Kurs auswählen",
    "Pick a cohort from the class brochure.": "Wähle eine Klasse aus der Kursbroschüre.",
    "Start learning": "Mit dem Lernen beginnen",
    "Use Course Book, live class links, and assignments.": "Nutze Kursbuch, Live-Kurslinks und Aufgaben.",
    "Get feedback": "Feedback erhalten",
    "Tutor comments and progress tracking guide you.": "Tutor-Kommentare und Fortschritt helfen dir weiter.",
    "Free level check": "Kostenloser Niveaucheck",
    "Don’t know your level yet?": "Du kennst dein Niveau noch nicht?",
    "Try our free placement test first. After you finish, use your suggested level to choose the right class from the Falowen class brochure.": "Mache zuerst unseren kostenlosen Einstufungstest. Danach kannst du mit dem empfohlenen Niveau den passenden Kurs aus der Falowen-Broschüre wählen.",
    "Upcoming classes": "Kommende Kurse",
    "Join the next Falowen German class": "Nimm am nächsten Falowen-Deutschkurs teil",
    "Send students one clean brochure with the start date, meeting times, generated schedule, and payment link. This is better for enquiries than sending many separate messages.": "Schicke Interessenten eine klare Broschüre mit Startdatum, Kurszeiten, Stundenplan und Zahlungslink. Das ist einfacher als viele einzelne Nachrichten.",
    "Starts:": "Start:",
    "Meeting:": "Kurszeit:",
    "Self-learning": "Selbstlernen",
    "Live or online access, Falowen app support, assignments, and class records in one place.": "Live- oder Online-Zugang, Falowen-App, Aufgaben und Kursdaten an einem Ort."
  },
  fr: {
    "View upcoming classes": "Voir les prochains cours",
    "Free placement test": "Test de niveau gratuit",
    "Take free placement test": "Faire le test de niveau gratuit",
    "Choose a class": "Choisir une classe",
    "Open class brochure": "Ouvrir la brochure des cours",
    "Take placement test": "Faire le test de niveau",
    "Talk to us": "Nous contacter",
    "Today in Falowen": "Aujourd’hui sur Falowen",
    "A1 German practice": "Pratique d’allemand A1",
    "Live": "En direct",
    "Course lesson": "Leçon du cours",
    "Watch, practise, and submit your workbook task.": "Regarde, pratique et envoie ton exercice du workbook.",
    "Exam warm-up": "Préparation à l’examen",
    "Short speaking and writing tasks with tutor feedback.": "Courtes tâches d’expression orale et écrite avec retour du tuteur.",
    "Progress tracking": "Suivi des progrès",
    "Scores, attendance, and exam readiness in one place.": "Notes, présence et préparation à l’examen au même endroit.",
    "Your Falowen path": "Ton parcours Falowen",
    "Simple journey": "Parcours simple",
    "Check your level": "Vérifie ton niveau",
    "Use the free placement test if you are not sure.": "Utilise le test de niveau gratuit si tu n’es pas sûr.",
    "Choose your class": "Choisis ta classe",
    "Pick a cohort from the class brochure.": "Choisis un groupe dans la brochure des cours.",
    "Start learning": "Commence à apprendre",
    "Use Course Book, live class links, and assignments.": "Utilise le livre de cours, les liens de cours en direct et les devoirs.",
    "Get feedback": "Reçois un feedback",
    "Tutor comments and progress tracking guide you.": "Les commentaires du tuteur et le suivi des progrès te guident.",
    "Free level check": "Vérification gratuite du niveau",
    "Don’t know your level yet?": "Tu ne connais pas encore ton niveau ?",
    "Try our free placement test first. After you finish, use your suggested level to choose the right class from the Falowen class brochure.": "Fais d’abord notre test de niveau gratuit. Ensuite, utilise le niveau proposé pour choisir la bonne classe dans la brochure Falowen.",
    "Upcoming classes": "Prochains cours",
    "Join the next Falowen German class": "Rejoins le prochain cours d’allemand Falowen",
    "Send students one clean brochure with the start date, meeting times, generated schedule, and payment link. This is better for enquiries than sending many separate messages.": "Envoie aux étudiants une brochure claire avec la date de début, les horaires, le programme et le lien de paiement. C’est plus simple que plusieurs messages séparés.",
    "Starts:": "Début :",
    "Meeting:": "Cours :",
    "Self-learning": "Auto-apprentissage",
    "Live or online access, Falowen app support, assignments, and class records in one place.": "Accès en direct ou en ligne, application Falowen, devoirs et suivi des cours au même endroit."
  },
};

const translateStaticTextNodes = (language) => {
  const dictionary = STATIC_TEXT[language];
  if (!dictionary || typeof document === "undefined") return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const current = String(node.nodeValue || "").replace(/\s+/g, " ").trim();
    const translated = dictionary[current];
    if (translated) node.nodeValue = String(node.nodeValue || "").replace(current, translated);
  });
};

const LandingPublicLanguageGuard = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const savedLandingLanguage = readLandingLanguage();
    const targetLanguage = savedLandingLanguage || "en";
    if (normalizeLanguage(i18n.resolvedLanguage || i18n.language) !== targetLanguage) {
      i18n.changeLanguage(targetLanguage);
    }

    const handleClick = (event) => {
      const button = event.target?.closest?.("button");
      if (!button) return;
      const selectedLanguage = detectLanguageButton(button.textContent || button.getAttribute("aria-label") || "");
      if (selectedLanguage) writeLandingLanguage(selectedLanguage);
    };

    const handleLanguageChanged = (language) => {
      window.setTimeout(() => translateStaticTextNodes(normalizeLanguage(language)), 80);
    };

    const observer = new MutationObserver(() => translateStaticTextNodes(normalizeLanguage(i18n.resolvedLanguage || i18n.language)));
    document.addEventListener("click", handleClick, true);
    i18n.on("languageChanged", handleLanguageChanged);
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => translateStaticTextNodes(targetLanguage), 100);

    return () => {
      document.removeEventListener("click", handleClick, true);
      i18n.off("languageChanged", handleLanguageChanged);
      observer.disconnect();
    };
  }, [i18n]);

  return null;
};

export default LandingPublicLanguageGuard;
