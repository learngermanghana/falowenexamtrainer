const STANDARD_TITLE = "Suggested answer structure";
const STANDARD_ITEMS = [
  ["Thema vorstellen", "„Heute möchte ich über [Thema] sprechen.“"],
  ["Vorteile", "„Einerseits bietet dieses Thema viele Vorteile. Ein Beispiel dafür ist, dass ...“"],
  ["Nachteile", "„Andererseits gibt es auch einige Nachteile. Ein Beispiel dafür ist, dass ...“"],
  ["Situation in deinem Land", "„In meinem Land ist die Situation so, dass ...“"],
  ["Eigene Meinung", "„Meiner Meinung nach ...“ / „Ich bin der Meinung, dass ...“ / „Ich glaube, dass ...“"],
  ["Schluss", "„Zusammenfassend lässt sich sagen, dass ...“ / „Vielen Dank fürs Zuhören.“"],
];

const SPEAKING_EXAMPLES_BY_DAY = {
  1: {
    "Traumberuf (Dream Job)": "Beispiel: „Mein Traumberuf ist Lehrer, weil ich gern mit Menschen arbeite und Wissen weitergebe.“",
    "Traumreise (Dream Trip)": "Beispiel: „Ich würde gern nach Japan reisen, weil ich die Kultur und das Essen interessant finde.“",
    "Traumhaus (Dream House)": "Beispiel: „Mein Traumhaus liegt am Meer und hat einen kleinen Garten, weil ich Ruhe und Natur mag.“",
    "Zukunftsträume (Future Dreams)": "Beispiel: „In Zukunft möchte ich ein eigenes Unternehmen gründen und gleichzeitig genug Zeit für meine Familie haben.“",
    "Traumhobbys und Freizeit (Dream Hobbies and Leisure Activities)": "Beispiel: „Ich würde gern ein Musikinstrument lernen, weil Musik für mich entspannend ist.“",
  },
  2: {
    "Eigenschaften von Freunden": "Beispiel: „Für mich ist Vertrauen besonders wichtig, weil man mit einem guten Freund offen sprechen können sollte.“",
    "Wie Freundschaften entstehen": "Beispiel: „Viele Freundschaften entstehen in der Schule oder bei gemeinsamen Aktivitäten, weil man dort viel Zeit miteinander verbringt.“",
    "Wichtige Erlebnisse": "Beispiel: „Eine gemeinsame Reise kann eine Freundschaft stärken, weil man viele besondere Erfahrungen miteinander teilt.“",
    "Freundschaft in verschiedenen Kulturen": "Beispiel: „In verschiedenen Kulturen kann Freundschaft unterschiedlich aussehen, aber Respekt und Unterstützung sind überall wichtig.“",
    "Freundschaften im digitalen Zeitalter": "Beispiel: „Soziale Medien erleichtern den Kontakt, aber persönliche Treffen sind für eine enge Freundschaft weiterhin wichtig.“",
  },
  3: {
    "Beruflicher Erfolg": "Beispiel: „Beruflicher Erfolg bedeutet für mich nicht nur ein gutes Gehalt, sondern auch interessante Aufgaben und Entwicklungsmöglichkeiten.“",
    "Persönlicher Erfolg": "Beispiel: „Eine neue Sprache zu lernen ist für mich ein persönlicher Erfolg, weil dafür viel Geduld und Disziplin nötig sind.“",
    "Hindernisse und Herausforderungen": "Beispiel: „Ein großes Hindernis kann Zeitmangel sein, deshalb muss man seine Aufgaben gut planen.“",
    "Erfolgsstrategien": "Beispiel: „Klare Ziele helfen beim Erfolg, weil man dadurch weiß, worauf man Schritt für Schritt hinarbeitet.“",
    "Inspiration und Vorbilder": "Beispiel: „Vorbilder können motivieren, weil ihre Erfahrungen zeigen, wie man Schwierigkeiten überwinden kann.“",
  },
  4: {
    "Wohnungsarten": "Beispiel: „Ich würde lieber in einer Mietwohnung wohnen, weil ich flexibel bleiben möchte.“",
    "Methoden der Wohnungssuche": "Beispiel: „Einerseits sind Online-Portale praktisch, weil man dort viele Angebote vergleichen kann.“",
    "Wichtige Kriterien": "Beispiel: „Für mich ist die Lage besonders wichtig, weil ich schnell zur Arbeit kommen möchte.“",
    "Besichtigung und Vertrag": "Beispiel: „Bei der Besichtigung sollte man nicht nur die Wohnung ansehen, sondern auch nach den Nebenkosten fragen.“",
    "Einzug und Kompromisse": "Beispiel: „Manchmal muss man bei der Wohnungssuche Kompromisse machen, zum Beispiel bei der Größe oder der Lage.“",
  },
  5: {
    "Vor dem Termin": "Beispiel: „Vor dem Termin würde ich die Anzeige noch einmal lesen und meine wichtigsten Fragen vorbereiten.“",
    "Fragen zur Wohnung": "Beispiel: „Ich würde höflich fragen: Könnten Sie mir bitte sagen, wie hoch die Warmmiete ist?“",
    "Wohnung kontrollieren": "Beispiel: „Bei der Besichtigung würde ich besonders auf Fenster, Lärm und mögliche Mängel achten.“",
    "Höfliche Formulierungen": "Beispiel: „Wäre Samstag um 14 Uhr möglich?“ ist höflicher als eine direkte Forderung.",
  },
  6: {
    "Leben in der Stadt": "Beispiel: „Einerseits bietet das Leben in der Stadt viele Vorteile, weil Arbeitsplätze, Geschäfte und öffentliche Verkehrsmittel leicht erreichbar sind.“",
    "Leben auf dem Land": "Beispiel: „Das Leben auf dem Land ist oft ruhiger und näher an der Natur, allerdings sind die Wege zur Arbeit oder zum Einkaufen manchmal länger.“",
  },
  7: {
    "Fast Food": "Beispiel: „Einerseits ist Fast Food schnell und praktisch, andererseits enthält es oft viel Fett, Salz oder Zucker.“",
    "Hausmannskost": "Beispiel: „Hausmannskost kann gesünder sein, weil man frische Zutaten verwenden und selbst entscheiden kann, wie das Essen zubereitet wird.“",
  },
  8: {
    "Gesunde Ernährung": "Beispiel: „Eine ausgewogene Ernährung ist wichtig, weil Obst, Gemüse und ausreichend Wasser den Körper mit wichtigen Nährstoffen versorgen.“",
    "Bewegung und Sport": "Beispiel: „Regelmäßige Bewegung stärkt den Körper und kann gleichzeitig helfen, Stress abzubauen.“",
    "Mentale Gesundheit": "Beispiel: „Für meine mentale Gesundheit versuche ich genug zu schlafen und mir bewusst Zeit für Familie, Freunde und Hobbys zu nehmen.“",
    "Gesundheitsvorsorge": "Beispiel: „Regelmäßige Kontrolluntersuchungen sind sinnvoll, weil gesundheitliche Probleme dadurch früh erkannt werden können.“",
  },
  9: {
    "Definition und Bedeutung": "Beispiel: „Eine gute Work-Life-Balance bedeutet für mich, dass Arbeit wichtig ist, aber trotzdem genug Zeit für Familie, Freunde und Erholung bleibt.“",
    "Herausforderungen und Probleme": "Beispiel: „Ein großes Problem sind Überstunden und ständige Erreichbarkeit, weil man dadurch nach der Arbeit schwer abschalten kann.“",
    "Strategien für eine bessere Balance": "Beispiel: „Eine hilfreiche Strategie ist, klare Arbeitszeiten festzulegen und nach Feierabend berufliche Nachrichten nicht mehr zu beantworten.“",
    "Vorteile einer guten Work-Life-Balance": "Beispiel: „Eine gute Balance kann Stress reduzieren und gleichzeitig Motivation, Gesundheit und Produktivität verbessern.“",
    "Zukunft der Work-Life-Balance": "Beispiel: „Ich glaube, dass flexible Arbeitszeiten und die Vier-Tage-Woche in Zukunft eine größere Rolle spielen werden.“",
  },
  10: {
    "Warum ist eine digitale Auszeit wichtig?": "Beispiel: „Eine digitale Auszeit kann Stress reduzieren, weil man nicht ständig Nachrichten und Benachrichtigungen kontrolliert.“",
    "Selbstfürsorge im Alltag": "Beispiel: „Zur Selbstfürsorge gehört für mich, genug zu schlafen, mich zu bewegen und regelmäßig Zeit ohne Handy zu verbringen.“",
    "Herausforderungen": "Beispiel: „Eine Schwierigkeit ist, dass viele Menschen ihr Smartphone für Arbeit, Studium und soziale Kontakte brauchen.“",
    "Strategien für eine erfolgreiche Auszeit": "Beispiel: „Eine gute Strategie ist, jeden Abend eine feste handyfreie Stunde einzuplanen.“",
    "Gesunder Umgang mit Technik": "Beispiel: „Ein gesunder Umgang mit Technik bedeutet nicht, ganz darauf zu verzichten, sondern Bildschirmzeit bewusst zu begrenzen.“",
  },
};

const WRITING_SUPPORT_BY_DAY = {
  2: {
    title: "Schreibplan für Ihre E-Mail",
    steps: [
      "Anrede: Beginnen Sie freundlich, zum Beispiel mit „Liebe Anna,“.",
      "Einleitung: Schreiben Sie kurz, warum Sie die E-Mail schreiben.",
      "Kennenlernen: Erklären Sie, wo und wie Sie Ihren Freund kennengelernt haben.",
      "Bedeutung: Sagen Sie, warum die Freundschaft besonders ist, und geben Sie einen Grund oder ein Beispiel.",
      "Vorschlag: Machen Sie einen konkreten Vorschlag für ein Treffen.",
      "Schluss: Beenden Sie die E-Mail freundlich mit Gruß und Namen.",
    ],
    phrases: "Nützliche Sätze: „Wir haben uns ... kennengelernt.“ · „Unsere Freundschaft ist besonders, weil ...“ · „Hast du Lust, dass wir ...?“ · „Ich freue mich auf deine Antwort.“",
  },
  3: {
    title: "Schreibplan für Ihre formelle E-Mail",
    steps: [
      "Anrede: Beginnen Sie mit „Sehr geehrte Frau Wolmer,“.",
      "Entschuldigung: Entschuldigen Sie sich höflich dafür, dass Sie nicht teilnehmen können.",
      "Grund: Erklären Sie kurz und klar, warum Sie nicht teilnehmen können.",
      "Abschluss: Bedanken Sie sich für das Verständnis.",
      "Gruß: Schreiben Sie „Mit freundlichen Grüßen“ und Ihren Namen.",
    ],
    phrases: "Nützliche Sätze: „Leider kann ich an der Präsentation nicht teilnehmen.“ · „Der Grund dafür ist, dass ...“ · „Ich bitte um Ihr Verständnis.“ · „Mit freundlichen Grüßen“",
  },
};

const isB1WorkbookRoute = () => {
  const pathname = String(window.location?.pathname || "").toLowerCase();
  return pathname.includes("/campus/course/lesson/b1/") || (pathname.includes("/campus/course/") && pathname.includes("b1"));
};

const getB1Day = () => {
  const pathname = String(window.location?.pathname || "");
  const slugMatch = pathname.match(/b1-day-(\d+)/i);
  if (slugMatch?.[1]) return Number(slugMatch[1]);
  const lessonMatch = pathname.match(/\/lesson\/b1\/(\d+)/i);
  return lessonMatch?.[1] ? Number(lessonMatch[1]) : 0;
};

const headingMatches = (element) =>
  /^suggested answer structure$/i.test(String(element?.textContent || "").trim());

const buildStandardList = (sourceList) => {
  const list = document.createElement(sourceList?.tagName?.toLowerCase() === "ul" ? "ul" : "ol");
  if (sourceList?.getAttribute("style")) list.setAttribute("style", sourceList.getAttribute("style"));
  list.setAttribute("data-b1-standard-speaking-structure-list", "true");

  STANDARD_ITEMS.forEach(([label, example]) => {
    const item = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = `${label}:`;
    item.append(strong, document.createTextNode(` ${example}`));
    list.appendChild(item);
  });
  return list;
};

const buildSpeakingTask = () => {
  const box = document.createElement("div");
  box.setAttribute("data-b1-argument-speaking-task", "true");
  box.style.cssText = "border:1px solid #bfdbfe;border-radius:10px;padding:12px;background:#eff6ff;display:grid;gap:8px;line-height:1.65;";

  const title = document.createElement("strong");
  title.textContent = "Ihre Aufgabe: Vorteile, Nachteile und Meinung";
  box.appendChild(title);

  const intro = document.createElement("p");
  intro.style.margin = "0";
  intro.textContent = "Benutzen Sie das Thema dieser Lektion und sprechen Sie in diesen Schritten:";
  box.appendChild(intro);

  const list = document.createElement("ol");
  list.style.cssText = "margin:0;padding-left:20px;line-height:1.75;";
  [
    "Nennen Sie einen Vorteil.",
    "Geben Sie ein konkretes Beispiel.",
    "Nennen Sie einen Nachteil.",
    "Geben Sie ein konkretes Beispiel.",
    "Sagen und begründen Sie Ihre eigene Meinung.",
  ].forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    list.appendChild(item);
  });
  box.appendChild(list);
  return box;
};

const findSpeakingSection = (heading) => {
  const section = heading.closest("section");
  if (!section) return null;
  const text = String(section.textContent || "");
  return /Sprechen|Speaking|Question of the Day/i.test(text) ? section : null;
};

const findTopAnchor = (section) => {
  const children = Array.from(section.children || []);
  const taskIndex = children.findIndex((child) =>
    /Question of the Day|Speaking|Sprechen/i.test(String(child.textContent || "")) &&
    child.querySelector?.("strong, h2, h3, p"),
  );
  if (taskIndex >= 0) return children[taskIndex];
  return children[0] || null;
};

const addSpeakingIdeaExamples = (root = document) => {
  const examples = SPEAKING_EXAMPLES_BY_DAY[getB1Day()];
  if (!examples) return 0;
  const speakingSection = Array.from(root.querySelectorAll("section")).find((section) =>
    /Teil 1\s*[·-]\s*Sprechen/i.test(String(section.textContent || "")),
  );
  if (!speakingSection) return 0;

  let changed = 0;
  Object.entries(examples).forEach(([title, example]) => {
    const heading = Array.from(speakingSection.querySelectorAll("strong, h3")).find(
      (node) => String(node.textContent || "").trim() === title,
    );
    if (!heading) return;
    const card = heading.parentElement;
    if (!card || card.querySelector('[data-b1-speaking-category-example="true"]')) return;

    const paragraph = document.createElement("p");
    paragraph.setAttribute("data-b1-speaking-category-example", "true");
    paragraph.style.cssText = "margin:6px 0 0;padding:9px 10px;border-radius:9px;background:#eff6ff;color:#1e3a8a;line-height:1.6;font-weight:600;";
    paragraph.textContent = example;
    card.appendChild(paragraph);
    changed += 1;
  });
  return changed;
};

const addWritingSupport = (root = document) => {
  const support = WRITING_SUPPORT_BY_DAY[getB1Day()];
  if (!support) return 0;
  const writingSection = Array.from(root.querySelectorAll("section")).find((section) =>
    /Teil 2\s*[·-]\s*Schreiben/i.test(String(section.textContent || "")),
  );
  if (!writingSection || writingSection.querySelector('[data-b1-writing-plan="true"]')) return 0;

  const box = document.createElement("div");
  box.setAttribute("data-b1-writing-plan", "true");
  box.style.cssText = "border:1px solid #bfdbfe;border-radius:12px;padding:14px;background:#f8fbff;display:grid;gap:10px;line-height:1.7;";

  const title = document.createElement("strong");
  title.textContent = support.title;
  box.appendChild(title);

  const list = document.createElement("ol");
  list.style.cssText = "margin:0;padding-left:22px;line-height:1.7;";
  support.steps.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    list.appendChild(item);
  });
  box.appendChild(list);

  const phrases = document.createElement("p");
  phrases.style.cssText = "margin:0;color:#1e3a8a;font-weight:700;";
  phrases.textContent = support.phrases;
  box.appendChild(phrases);

  const taskCard = Array.from(writingSection.children || []).find((child) =>
    /Your assignment|Writing/i.test(String(child.textContent || "")),
  );
  if (taskCard) taskCard.insertAdjacentElement("afterend", box);
  else writingSection.appendChild(box);
  return 1;
};

export const standardizeB1SpeakingStructures = (root = document) => {
  if (typeof window === "undefined" || !isB1WorkbookRoute()) return 0;
  const headings = Array.from(root.querySelectorAll("h2, h3, h4, strong")).filter(headingMatches);
  let changed = 0;

  headings.forEach((heading) => {
    const section = findSpeakingSection(heading);
    const oldList = heading.nextElementSibling;
    if (!section || !oldList || !["OL", "UL"].includes(oldList.tagName)) return;

    if (heading.dataset.b1StandardSpeakingStructure !== "true") {
      const standardList = buildStandardList(oldList);
      oldList.replaceWith(standardList);
      heading.dataset.b1StandardSpeakingStructure = "true";
      heading.textContent = STANDARD_TITLE;
      changed += 1;
    }

    const list = heading.nextElementSibling;
    const anchor = findTopAnchor(section);
    if (anchor && heading.previousElementSibling !== anchor) {
      anchor.insertAdjacentElement("afterend", heading);
      heading.insertAdjacentElement("afterend", list);
      changed += 1;
    }

    if (!section.querySelector('[data-b1-argument-speaking-task="true"]')) {
      const task = buildSpeakingTask();
      heading.insertAdjacentElement("beforebegin", task);
      changed += 1;
    }
  });

  changed += addSpeakingIdeaExamples(root);
  changed += addWritingSupport(root);
  return changed;
};

let scheduled = false;
const schedule = () => {
  if (scheduled) return;
  scheduled = true;
  window.setTimeout(() => {
    scheduled = false;
    standardizeB1SpeakingStructures(document);
  }, 60);
};

if (process.env.NODE_ENV !== "test" && typeof window !== "undefined" && typeof document !== "undefined") {
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("popstate", schedule);
  [0, 150, 500, 1200].forEach((delay) => window.setTimeout(schedule, delay));
}
