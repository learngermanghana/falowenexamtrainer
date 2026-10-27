const SPEAKING_EXAMPLES = {
  26: {
    "1. Typische Reiseprobleme": "Beispiel: „Ein typisches Reiseproblem ist eine Verspätung, weil man dadurch einen Anschluss oder eine Reservierung verpassen kann.“",
    "2. Lösungen und Reaktionen": "Beispiel: „Wenn mein Flug ausfällt, würde ich zuerst den Kundenservice kontaktieren und nach einer Umbuchung fragen.“",
    "3. Wichtige Redemittel": "Beispiel: „Entschuldigung, mein Gepäck ist nicht angekommen. Könnten Sie mir bitte weiterhelfen?“",
    "4. Tipps zur Vorbereitung": "Beispiel: „Vor einer Reise kontrolliere ich meine Dokumente und speichere wichtige Telefonnummern, damit ich bei Problemen schnell reagieren kann.“",
  },
  27: {
    "Zuhause": "Beispiel: „Zu Hause kann man Energie sparen, indem man Geräte ausschaltet und Wasser nicht unnötig laufen lässt.“",
    "Unterwegs": "Beispiel: „Ein Vorteil öffentlicher Verkehrsmittel ist, dass sie weniger Emissionen verursachen können als viele einzelne Autos.“",
    "Einkaufen": "Beispiel: „Beim Einkaufen versuche ich regionale Produkte und Stofftaschen zu nutzen, weil dadurch Verpackungsmüll reduziert werden kann.“",
    "Arbeit / Schule": "Beispiel: „In der Schule oder bei der Arbeit kann man Papier sparen, indem man Dokumente digital nutzt oder beidseitig druckt.“",
    "Bewusstsein und Information": "Beispiel: „Umweltbildung ist wichtig, weil Menschen ihr Verhalten eher ändern, wenn sie die Folgen ihres Konsums verstehen.“",
  },
  28: {
    "1. Energie sparen": "Beispiel: „Energie kann man sparen, indem man das Licht ausschaltet und elektrische Geräte nicht unnötig im Standby-Modus lässt.“",
    "2. Verkehr": "Beispiel: „Einerseits sind Auto und Flugzeug bequem, andererseits sind Fahrrad und öffentliche Verkehrsmittel oft klimafreundlicher.“",
    "3. Konsum": "Beispiel: „Beim Konsum kann man das Klima schützen, indem man regionale Produkte kauft und weniger Plastik verwendet.“",
    "4. Ernährung": "Beispiel: „Weniger Fleisch zu essen kann klimafreundlicher sein, weil die Fleischproduktion viele Ressourcen benötigt.“",
    "5. Recycling und Müll": "Beispiel: „Durch Mülltrennung und wiederverwendbare Produkte können wir Abfall reduzieren und Materialien länger nutzen.“",
    "6. Bewusstsein und Bildung": "Beispiel: „Ich glaube, dass Umweltbildung besonders wichtig ist, weil langfristiger Klimaschutz auch von unseren täglichen Entscheidungen abhängt.“",
  },
};

const getDay = () => {
  const pathname = String(window.location?.pathname || "");
  const slugMatch = pathname.match(/b1-day-(\d+)/i);
  if (slugMatch?.[1]) return Number(slugMatch[1]);
  const lessonMatch = pathname.match(/\/lesson\/b1\/(\d+)/i);
  return lessonMatch?.[1] ? Number(lessonMatch[1]) : 0;
};

const isB1Workbook = () => {
  const pathname = String(window.location?.pathname || "").toLowerCase();
  return pathname.includes("/campus/course/") && pathname.includes("b1");
};

const findSection = (root, pattern) =>
  Array.from(root.querySelectorAll("section")).find((section) =>
    pattern.test(String(section.textContent || "")),
  );

const addSpeakingExamples = (root, day) => {
  const examples = SPEAKING_EXAMPLES[day];
  if (!examples) return 0;
  const section = findSection(root, /Teil 1[\s\S]{0,80}Sprechen/i);
  if (!section) return 0;

  let changed = 0;
  Object.entries(examples).forEach(([title, example]) => {
    const heading = Array.from(section.querySelectorAll("strong, h3, h4")).find(
      (node) => String(node.textContent || "").trim() === title,
    );
    if (!heading) return;
    const card = heading.parentElement;
    if (!card || card.querySelector('[data-b1-days26-28-example="true"]')) return;

    const paragraph = document.createElement("p");
    paragraph.setAttribute("data-b1-days26-28-example", "true");
    paragraph.style.cssText = "margin:6px 0 0;padding:9px 10px;border-radius:9px;background:#eff6ff;color:#1e3a8a;line-height:1.6;font-weight:600;";
    paragraph.textContent = example;
    card.appendChild(paragraph);
    changed += 1;
  });
  return changed;
};

export const enhanceB1Days26To28 = (root = document) => {
  if (typeof window === "undefined" || !isB1Workbook()) return 0;
  const day = getDay();
  if (day < 26 || day > 28) return 0;
  return addSpeakingExamples(root, day);
};

let scheduled = false;
const schedule = () => {
  if (scheduled) return;
  scheduled = true;
  window.setTimeout(() => {
    scheduled = false;
    enhanceB1Days26To28(document);
  }, 70);
};

if (process.env.NODE_ENV !== "test" && typeof window !== "undefined" && typeof document !== "undefined") {
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("popstate", schedule);
  [0, 150, 500, 1200].forEach((delay) => window.setTimeout(schedule, delay));
}
