const SPEAKING_EXAMPLES = {
  21: {
    "Familie": "Beispiel: „Das Leben in einer Familie bietet viel Nähe und Unterstützung, aber man hat manchmal weniger Privatsphäre.“",
    "Wohngemeinschaft (WG)": "Beispiel: „In einer WG kann man Kosten teilen und gemeinsam Zeit verbringen, allerdings können unterschiedliche Gewohnheiten zu Konflikten führen.“",
    "Singleleben": "Beispiel: „Ein Vorteil des Singlelebens ist die große Unabhängigkeit, andererseits kann man sich manchmal einsam fühlen.“",
    "Neue Lebensformen": "Beispiel: „Neue Lebensformen wie Mehrgenerationenwohnen können praktisch sein, weil verschiedene Generationen einander unterstützen können.“",
  },
  22: {
    "1. Kommunikation": "Beispiel: „Gute Kommunikation ist für mich besonders wichtig, weil man Probleme offen besprechen und Missverständnisse vermeiden kann.“",
    "2. Vertrauen und Ehrlichkeit": "Beispiel: „Eine Beziehung funktioniert besser, wenn beide Partner ehrlich sind und sich aufeinander verlassen können.“",
    "3. Gemeinsame Interessen": "Beispiel: „Gemeinsame Interessen sind ein Vorteil, weil man zusammen Aktivitäten planen und schöne Erfahrungen teilen kann.“",
    "4. Respekt und Unterstützung": "Beispiel: „Respekt bedeutet für mich, dass man den anderen akzeptiert und ihn auch in schwierigen Situationen unterstützt.“",
    "5. Zukunftspläne": "Beispiel: „Gemeinsame Zukunftspläne sind wichtig, weil beide Partner wissen sollten, welche Ziele sie langfristig haben.“",
  },
  23: {
    "1. Vorbereitung": "Beispiel: „Vor einem ersten Date würde ich einen passenden Treffpunkt wählen und pünktlich kommen, damit der erste Eindruck positiv ist.“",
    "2. Ort des Treffens": "Beispiel: „Ein Café ist für ein erstes Date praktisch, weil man sich in Ruhe unterhalten kann und der Ort öffentlich ist.“",
    "3. Gesprächsthemen": "Beispiel: „Beim ersten Treffen würde ich über Hobbys, Reisen und Zukunftspläne sprechen, weil man sich dadurch besser kennenlernen kann.“",
    "4. Gefühle und Eindrücke": "Beispiel: „Nervosität ist beim ersten Date normal, aber nach einem guten Gespräch fühlt man sich oft entspannter.“",
    "5. Verhalten und Höflichkeit": "Beispiel: „Man sollte aufmerksam zuhören, Fragen stellen und das Handy möglichst nicht benutzen.“",
    "6. Möglicher Verlauf": "Beispiel: „Wenn das Treffen gut läuft, kann man am Ende ein zweites Date vorschlagen; wenn nicht, sollte man trotzdem höflich bleiben.“",
  },
  24: {
    "1. Konsumverhalten": "Beispiel: „Bewusster Konsum bedeutet für mich, nur Dinge zu kaufen, die ich wirklich brauche, statt ständig neue Produkte zu kaufen.“",
    "2. Nachhaltigkeit im Alltag": "Beispiel: „Im Alltag kann man nachhaltiger leben, indem man Müll vermeidet, regionale Produkte kauft und Secondhand-Angebote nutzt.“",
    "3. Umweltschutz und Klimawandel": "Beispiel: „Weniger CO₂-Emissionen und mehr erneuerbare Energien können dazu beitragen, die Umwelt langfristig zu schützen.“",
    "4. Wirtschaft und Nachhaltigkeit": "Beispiel: „Unternehmen sollten nachhaltiger produzieren, auch wenn umweltfreundliche Lösungen am Anfang manchmal mehr kosten.“",
    "5. Verantwortung des Einzelnen": "Beispiel: „Jeder Einzelne kann Verantwortung übernehmen, zum Beispiel indem er weniger Plastik verwendet oder öffentliche Verkehrsmittel nutzt.“",
    "6. Redemittel für Diskussion oder Schreiben": "Beispiel: „Meiner Meinung nach sollten wir stärker auf nachhaltige Produkte achten, weil unser Konsum Auswirkungen auf die Umwelt hat.“",
    "7. Herausforderungen und Lösungen": "Beispiel: „Ein Problem ist, dass nachhaltige Produkte oft teurer sind; eine Lösung könnten bessere Angebote und mehr Aufklärung sein.“",
  },
  25: {
    "Gründe für Online-Shopping": "Beispiel: „Online-Shopping ist praktisch, weil man rund um die Uhr einkaufen und Preise schnell vergleichen kann.“",
    "Typische Produkte": "Beispiel: „Ich kaufe online besonders gern Bücher oder Elektronik, weil die Auswahl dort oft größer ist.“",
    "Rechte beim Online-Kauf": "Beispiel: „Beim Online-Kauf ist das Rückgaberecht wichtig, weil ein Produkt anders sein kann als erwartet.“",
    "Risiken und Probleme": "Beispiel: „Ein großes Risiko sind Fake-Shops oder beschädigte Waren, deshalb sollte man vor der Bestellung genau prüfen, wo man kauft.“",
    "Sichere Shops erkennen": "Beispiel: „Einen seriösen Shop erkennt man zum Beispiel an einem Impressum, sicheren Zahlungsmethoden und glaubwürdigen Bewertungen.“",
    "Sicher einkaufen": "Beispiel: „Ich würde die Rückgabebedingungen lesen und meine Zahlungsbestätigung speichern, bevor ich eine größere Bestellung aufgebe.“",
  },
};

const DAY22_WRITING_SUPPORT = {
  title: "Schreibplan für Ihren Meinungsbeitrag",
  steps: [
    "Einleitung: Stellen Sie das Thema Partnersuche im Internet kurz vor.",
    "Reaktion: Sagen Sie, ob Sie Maria zustimmen oder eine andere Meinung haben.",
    "Vorteil: Nennen und begründen Sie einen Vorteil der Online-Partnersuche.",
    "Nachteil: Erklären Sie ein Risiko oder einen Nachteil.",
    "Vergleich und Beispiel: Vergleichen Sie Online-Kontakt mit persönlichem Kennenlernen und geben Sie ein Beispiel.",
    "Schluss: Formulieren Sie Ihre eigene Meinung klar.",
  ],
  phrases: "Nützliche Sätze: „Ich stimme Maria zu / nur teilweise zu, weil ...“ · „Einerseits kann man online viele Menschen kennenlernen, andererseits ...“ · „Ein Beispiel dafür ist, dass ...“ · „Meiner Meinung nach ...“",
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
  const section = findSection(root, /Teil 1[\s\S]{0,80}(Sprechen|Beruf kennen)/i);
  if (!section) return 0;

  let changed = 0;
  Object.entries(examples).forEach(([title, example]) => {
    const heading = Array.from(section.querySelectorAll("strong, h3, h4")).find(
      (node) => String(node.textContent || "").trim() === title,
    );
    if (!heading) return;
    const card = heading.parentElement;
    if (!card || card.querySelector('[data-b1-days21-25-example="true"]')) return;

    const paragraph = document.createElement("p");
    paragraph.setAttribute("data-b1-days21-25-example", "true");
    paragraph.style.cssText = "margin:6px 0 0;padding:9px 10px;border-radius:9px;background:#eff6ff;color:#1e3a8a;line-height:1.6;font-weight:600;";
    paragraph.textContent = example;
    card.appendChild(paragraph);
    changed += 1;
  });
  return changed;
};

const addDay22WritingSupport = (root, day) => {
  if (day !== 22) return 0;
  const section = findSection(root, /Teil 2[\s\S]{0,80}Schreiben/i);
  if (!section || section.querySelector('[data-b1-day22-writing-support="true"]')) return 0;

  const box = document.createElement("div");
  box.setAttribute("data-b1-day22-writing-support", "true");
  box.style.cssText = "border:1px solid #bfdbfe;border-radius:12px;padding:14px;background:#f8fbff;display:grid;gap:10px;line-height:1.7;";

  const title = document.createElement("strong");
  title.textContent = DAY22_WRITING_SUPPORT.title;
  box.appendChild(title);

  const list = document.createElement("ol");
  list.style.cssText = "margin:0;padding-left:22px;line-height:1.7;";
  DAY22_WRITING_SUPPORT.steps.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    list.appendChild(item);
  });
  box.appendChild(list);

  const phrases = document.createElement("p");
  phrases.style.cssText = "margin:0;color:#1e3a8a;font-weight:700;";
  phrases.textContent = DAY22_WRITING_SUPPORT.phrases;
  box.appendChild(phrases);

  const pointsCard = Array.from(section.children || []).find((child) =>
    /Writing points/i.test(String(child.textContent || "")),
  );
  if (pointsCard) pointsCard.insertAdjacentElement("afterend", box);
  else section.appendChild(box);
  return 1;
};

export const enhanceB1Days21To25 = (root = document) => {
  if (typeof window === "undefined" || !isB1Workbook()) return 0;
  const day = getDay();
  if (day < 21 || day > 25) return 0;
  return addSpeakingExamples(root, day) + addDay22WritingSupport(root, day);
};

let scheduled = false;
const schedule = () => {
  if (scheduled) return;
  scheduled = true;
  window.setTimeout(() => {
    scheduled = false;
    enhanceB1Days21To25(document);
  }, 70);
};

if (process.env.NODE_ENV !== "test" && typeof window !== "undefined" && typeof document !== "undefined") {
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("popstate", schedule);
  [0, 150, 500, 1200].forEach((delay) => window.setTimeout(schedule, delay));
}
