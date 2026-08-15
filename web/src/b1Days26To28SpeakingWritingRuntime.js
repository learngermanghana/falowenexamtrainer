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

const DAY26_WRITING_SUPPORT = {
  title: "Schreibplan für Ihren informellen Brief",
  steps: [
    "Anrede: Beginnen Sie mit „Lieber Max,“ oder „Liebe Lisa,“.",
    "Einleitung: Schreiben Sie kurz, wohin Sie gereist sind und wie Sie gereist sind.",
    "Problem: Beschreiben Sie genau, was passiert ist, zum Beispiel eine Verspätung oder verlorenes Gepäck.",
    "Reaktion: Erklären Sie, was Sie getan haben, um das Problem zu lösen.",
    "Ergebnis: Sagen Sie, wie die Situation ausgegangen ist und wie Sie sich gefühlt haben.",
    "Schluss: Beenden Sie den Brief freundlich und bitten Sie um eine Antwort.",
  ],
  phrases: "Nützliche Sätze: „Auf meiner Reise ist leider etwas passiert.“ · „Das Problem war, dass ...“ · „Deshalb habe ich ...“ · „Zum Glück konnte ich ...“ · „Am Ende war ich erleichtert, weil ...“ · „Schreib mir bald!“",
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

const addDay26WritingSupport = (root, day) => {
  if (day !== 26) return 0;
  const section = findSection(root, /Teil 2[\s\S]{0,80}Schreiben/i);
  if (!section || section.querySelector('[data-b1-day26-writing-support="true"]')) return 0;

  const box = document.createElement("div");
  box.setAttribute("data-b1-day26-writing-support", "true");
  box.style.cssText = "border:1px solid #bfdbfe;border-radius:12px;padding:14px;background:#f8fbff;display:grid;gap:10px;line-height:1.7;";

  const title = document.createElement("strong");
  title.textContent = DAY26_WRITING_SUPPORT.title;
  box.appendChild(title);

  const list = document.createElement("ol");
  list.style.cssText = "margin:0;padding-left:22px;line-height:1.7;";
  DAY26_WRITING_SUPPORT.steps.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    list.appendChild(item);
  });
  box.appendChild(list);

  const phrases = document.createElement("p");
  phrases.style.cssText = "margin:0;color:#1e3a8a;font-weight:700;";
  phrases.textContent = DAY26_WRITING_SUPPORT.phrases;
  box.appendChild(phrases);

  const practice = section.querySelector('[data-course-inline-practice="writing"]');
  if (practice) section.insertBefore(box, practice);
  else section.appendChild(box);
  return 1;
};

export const enhanceB1Days26To28 = (root = document) => {
  if (typeof window === "undefined" || !isB1Workbook()) return 0;
  const day = getDay();
  if (day < 26 || day > 28) return 0;
  return addSpeakingExamples(root, day) + addDay26WritingSupport(root, day);
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
