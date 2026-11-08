// Hand-curated, short English glosses for difficult words and phrases in A2/B1 Lesen.
// This is a reading aid, not an answer key or a machine translation of the exercise.
// Entries are matched against the passage as written; missing terms stay unmarked.
const A2 = {
  1: [["Mittagspause", "lunch break"], ["Feierabend", "end of the working day"], ["eingeladen", "invited"]],
  2: [["zuverlässig", "reliable"], ["Krankenpfleger", "male nurse"], ["wandern", "to go hiking"]],
  3: [["höchstens", "at most"], ["entfernt", "away / at a distance"], ["Unterricht", "lessons / classes"]],
  4: [["regnen", "to rain"], ["reserviere", "reserve / book"], ["U-Bahn-Station", "underground station"]],
  5: [["Teilnahme", "participation"], ["Anmeldung", "registration"], ["geeignet", "suitable"]],
  6: [["WG", "shared flat"], ["Teppich", "carpet / rug"], ["zwischen", "between"]],
  7: [["möbliert", "furnished"], ["Lage", "location"], ["Balkon", "balcony"]],
  8: [["reserviert", "reserved / booked"], ["Kellner", "waiter"], ["alleine", "alone"]],
  9: [["Buchung", "booking"], ["Einzelzimmer", "single room"], ["pro Nacht", "per night"]],
  10: [["Touristeninformation", "tourist information office"], ["Stadtplan", "city map"], ["entdecken", "to discover"]],
  11: [["Verkehrsmittel", "means of transport"], ["Stau", "traffic jam"], ["allerdings", "however"]],
  12: [["Teilzeit", "part-time"], ["Erfahrung", "experience"], ["gesucht", "wanted / sought"]],
  13: [["Bewerbung", "job application"], ["Vorstellungsgespräch", "job interview"], ["einladen", "to invite"]],
  14: [["mindestens", "at least"], ["Arbeitszeit", "working hours"], ["informiert", "informs / notifies"]],
  15: [["Teilnahme", "participation"], ["Treffpunkt", "meeting point"], ["kostenlos", "free of charge"]],
  16: [["Anfänger", "beginners"], ["Übungen", "exercises"], ["Rückenkurs", "back-care exercise class"]],
  17: [["Rabatt", "discount"], ["Erkältungen", "colds"], ["Sonnenschutzmittel", "sun protection products"]],
  18: [["Kontoeröffnung", "opening a bank account"], ["Filiale", "branch office"], ["Reisepass", "passport"]],
  19: [["Kartenzahlung", "card payment"], ["Ständen", "stalls / stands"], ["Region", "region / local area"]],
  20: [["Wasserkocher", "electric kettle"], ["Gerät", "device / appliance"], ["Filiale", "branch / store"]],
  21: [["ankommen", "to arrive"], ["zuerst", "first of all"], ["danach", "afterwards"]],
  22: [["Hafenrundfahrt", "harbour boat tour"], ["Touristeninformation", "tourist information office"], ["am besten", "best / preferably"]],
  23: [["Innenstadt", "city centre"], ["ziemlich", "quite / fairly"], ["umsteigen", "to change transport"]],
  24: [["tauchen", "to dive"], ["Unterkunft", "accommodation"], ["günstig", "affordable / inexpensive"]],
  25: [["Gästekarte", "visitor card / guest pass"], ["Touristeninformation", "tourist information office"], ["unbegrenzt", "unlimited"]],
  26: [["begeistert", "delighted / enthusiastic"], ["einstündige", "lasting one hour"], ["schlägt", "suggests / proposes"]],
  27: [["unbegrenzt", "unlimited"], ["Rabatt", "discount"], ["Mitteilungen", "messages / notifications"]],
  28: [["angekommen", "arrived"], ["Pläne", "plans"], ["Hafen", "harbour"]],
};

const B1 = {
  1: [["Traumberuf", "dream job"], ["Beruf", "profession / occupation"], ["Ziel", "goal"]],
  2: [["Erwartungen", "expectations"], ["Freizeit", "free time"], ["entscheiden", "to decide"]],
  3: [["Entscheidung", "decision"], ["Verantwortung", "responsibility"], ["Herausforderung", "challenge"]],
  4: [["Gewohnheiten", "habits"], ["Alltag", "daily life"], ["Vorteile", "advantages"]],
  5: [["Besichtigungstermin", "property viewing appointment"], ["Wohnung", "apartment"], ["Mietvertrag", "rental agreement"]],
  6: [["Lebensqualität", "quality of life"], ["Nachbarschaft", "neighbourhood"], ["Landleben", "life in the countryside"]],
  7: [["Anzeigen", "advertisements"], ["Erfahrung", "experience"], ["Voraussetzungen", "requirements"]],
  8: [["Krankenhaus", "hospital"], ["Patienten", "patients"], ["behandeln", "to treat"]],
  9: [["Auswirkungen", "effects / consequences"], ["Zeitdruck", "time pressure"], ["bewältigt", "managed / coped with"]],
  10: [["verpassen", "to miss (something)"], ["Benachrichtigungen", "notifications"], ["bewussterer Umgang", "more mindful use"]],
  11: [["ausgleichen", "to balance / compensate for"], ["Freizeit", "free time"], ["Stress", "stress"]],
  12: [["Nervenkitzel", "thrill / excitement"], ["Alltagstrott", "daily routine / rut"], ["Risiken", "risks"]],
  13: [["Ermittler", "investigator / detective"], ["Wendung", "twist / turn of events"], ["Enthüllung", "revelation"]],
  14: [["lebenslanges Lernen", "lifelong learning"], ["Anforderungen", "requirements / demands"], ["Weiterbildung", "further training"]],
  15: [["Vernetzung", "interconnectedness / networking"], ["Technologien", "technologies"], ["Entwicklung", "development"]],
  16: [["Bildungssystem", "education system"], ["Prüfungen", "examinations"], ["Leistungen", "achievements / performance"]],
  17: [["Lernstoff", "material to study"], ["Zusammenfassungen", "summaries"], ["Überblick", "overview"]],
  18: [["Berufswahl", "choice of career"], ["Entscheidungen", "decisions"], ["Jugendliche", "young people / teenagers"]],
  19: [["Vorstellungsgespräch", "job interview"], ["Bewerbung", "application"], ["Erfahrung", "experience"]],
  20: [["Reiseleiter", "tour guide"], ["Ausbildung", "training / vocational education"], ["Reisende", "travellers"]],
  21: [["Lebensformen", "living arrangements"], ["Wohngemeinschaft", "shared household"], ["Wohnraum", "living space"]],
  22: [["Beziehung", "relationship"], ["Vertrauen", "trust"], ["gemeinsam", "together"]],
  23: [["Partnersuche", "search for a partner"], ["entspannten", "relaxed"], ["neutralen", "neutral"]],
  24: [["Nachhaltigkeit", "sustainability"], ["Konsum", "consumption"], ["Ressourcen", "resources"]],
  25: [["Gewährleistung", "legal warranty"], ["Widerrufsrecht", "right to withdraw / cancel"], ["Rückerstattung", "refund"]],
  26: [["Zwischenmiete", "short-term sublet"], ["Gepäcktransfer", "luggage transfer"], ["gebrauchtes", "second-hand / used"]],
  27: [["umweltfreundlicher", "more environmentally friendly"], ["vermeiden", "to avoid"], ["nachhaltig", "sustainable"]],
  28: [["umweltfreundlicher", "more environmentally friendly"], ["vermeiden", "to avoid"], ["nachhaltig", "sustainable"]],
};

// Fallbacks cover older B1 lessons and extra source cards where the authored
// day-specific phrases may not appear. Only a few matched words are exposed.
const COMMON = [
  ["trotzdem", "nevertheless / despite that"],
  ["allerdings", "however"],
  ["außerdem", "in addition / furthermore"],
  ["während", "while / during"],
  ["deshalb", "therefore / for that reason"],
  ["dennoch", "nevertheless"],
  ["ungefähr", "approximately"],
  ["mindestens", "at least"],
  ["höchstens", "at most"],
  ["pünktlich", "on time"],
  ["zuverlässig", "reliable"],
  ["Verantwortung", "responsibility"],
  ["Erfahrungen", "experiences"],
  ["Bewerbung", "application"],
  ["Vorstellungsgespräch", "job interview"],
  ["Berufserfahrung", "professional experience"],
  ["Herausforderungen", "challenges"],
  ["Möglichkeiten", "possibilities / opportunities"],
  ["Voraussetzungen", "requirements / prerequisites"],
  ["Lebensqualität", "quality of life"],
  ["Nachhaltigkeit", "sustainability"],
  ["vermeiden", "to avoid"],
  ["begeistert", "enthusiastic / delighted"],
  ["umweltfreundlich", "environmentally friendly"],
  ["Auswirkungen", "effects / consequences"],
  ["Besichtigung", "viewing / inspection"],
  ["Gewährleistung", "legal warranty"],
  ["Rückgabe", "return (of an item)"],
  ["gefördert", "supported / funded"],
  ["Anmeldung", "registration"],
  ["Teilnahme", "participation"],
  ["Unterkunft", "accommodation"],
  ["Angebot", "offer"],
];

const matchesWholePhrase = (text, phrase) => {
  const haystack = String(text || "");
  const escaped = String(phrase || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(escaped, "giu");
  for (const match of haystack.matchAll(re)) {
    const before = haystack[match.index - 1] || "";
    const after = haystack[match.index + match[0].length] || "";
    if (!/[\p{L}\p{N}]/u.test(before) && !/[\p{L}\p{N}]/u.test(after)) return true;
  }
  return false;
};

export function getReadingGlosses(level, day, text = "") {
  const bank = String(level || "").toUpperCase() === "B1" ? B1 : A2;
  const chosen = bank[Number(day)] || [];
  const found = chosen.filter(([phrase]) => matchesWholePhrase(text, phrase));
  const seen = new Set(found.map(([phrase]) => phrase.toLocaleLowerCase("de")));
  for (const [phrase, meaning] of COMMON) {
    if (found.length >= 5) break;
    if (seen.has(phrase.toLocaleLowerCase("de")) || !matchesWholePhrase(text, phrase)) continue;
    found.push([phrase, meaning]);
    seen.add(phrase.toLocaleLowerCase("de"));
  }
  return found;
}

export function splitReadingGlossaryText(text = "", level = "", day = 0) {
  const value = String(text || "");
  const entries = getReadingGlosses(level, day, value);
  if (!entries.length) return [{ text: value }];
  const sorted = [...entries].sort((a, b) => b[0].length - a[0].length);
  const escaped = sorted.map(([phrase]) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(escaped.join("|"), "giu");
  const pieces = [];
  let last = 0;
  for (const match of value.matchAll(re)) {
    const start = match.index;
    const end = start + match[0].length;
    if (/[\p{L}\p{N}]/u.test(value[start - 1] || "") || /[\p{L}\p{N}]/u.test(value[end] || "")) continue;
    if (start > last) pieces.push({ text: value.slice(last, start) });
    const entry = sorted.find(([phrase]) => phrase.toLocaleLowerCase("de") === match[0].toLocaleLowerCase("de"));
    pieces.push({ text: match[0], meaning: entry?.[1] || "" });
    last = end;
  }
  if (last < value.length) pieces.push({ text: value.slice(last) });
  return pieces.length ? pieces : [{ text: value }];
}
