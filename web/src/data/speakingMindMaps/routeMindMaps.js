const branchSets = {
  B1: [
    ["meinung", "Meinung", "Wie ist deine persönliche Position?", "Meiner Meinung nach ..."],
    ["grund", "Grund", "Warum ist das Thema wichtig?", "Ein wichtiger Grund ist, dass ..."],
    ["beispiel", "Beispiel", "Welches Beispiel macht deine Antwort konkret?", "Zum Beispiel ..."],
    ["vorteil", "Vorteil", "Welche positive Seite gibt es?", "Ein Vorteil ist, dass ..."],
    ["nachteil", "Nachteil", "Welche Schwierigkeit oder Grenze gibt es?", "Ein Nachteil ist, dass ..."],
    ["fazit", "Fazit", "Wie beendest du deine Antwort klar?", "Zusammenfassend würde ich sagen, dass ..."],
  ],
  B2: [
    ["position", "Position", "Welche differenzierte Position vertrittst du?", "Ich vertrete die Position, dass ..."],
    ["argument", "Argument", "Welches Hauptargument stützt deine Position?", "Dafür spricht vor allem, dass ..."],
    ["beleg", "Beleg", "Welche Beobachtung oder Erfahrung belegt das?", "Das zeigt sich beispielsweise daran, dass ..."],
    ["beispiel", "Beispiel", "Welches konkrete Beispiel passt?", "Ein konkretes Beispiel dafür ist ..."],
    ["gegenargument", "Gegenargument", "Welche Gegenposition muss man berücksichtigen?", "Man könnte allerdings einwenden, dass ..."],
    ["fazit", "Fazit", "Welche Schlussfolgerung ziehst du?", "Daraus ergibt sich für mich, dass ..."],
  ],
  C1: [
    ["these", "These", "Welche anspruchsvolle Hauptthese formulierst du?", "Meine zentrale These lautet, dass ..."],
    ["kontext", "Kontext", "In welchen größeren Zusammenhang stellst du das Thema?", "Vor dem Hintergrund von ... gewinnt das Thema an Bedeutung, weil ..."],
    ["evidenz", "Evidenz", "Welche Evidenz oder Beobachtung stützt deine These?", "Dafür spricht die Beobachtung, dass ..."],
    ["bewertung", "Bewertung", "Wie bewertest du den Befund kritisch?", "Diese Entwicklung ist ambivalent, denn ..."],
    ["einwand", "Einwand", "Welchen Einwand musst du einbeziehen?", "Ein gewichtiger Einwand lautet, dass ..."],
    ["schluss", "Schluss", "Welche prägnante Schlussfolgerung ziehst du?", "Daraus folgt für mich, dass ..."],
  ],
};

const titleFromSlug = (slug = "") => slug
  .replace(/-workbook$/, "")
  .replace(/^(b1|b2|c1)-day-\d+-/i, "")
  .split("-")
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ") || "Sprechen";

const makeBranch = ([id, label, guidingQuestion, sentenceStarter], title) => ({
  id,
  label,
  keywords: [label, title, "Beispiel"],
  guidingQuestion,
  sentenceStarter,
  modelSentence: `${sentenceStarter.replace(/\.\.\.$/, "")} ${title.toLowerCase()} eine klare Rolle spielt.`,
});

export const buildSpeakingMindMapForRoute = ({ level, day, slug, title }) => {
  const normalizedLevel = String(level || "").toUpperCase();
  const branchSet = branchSets[normalizedLevel];
  if (!branchSet) return null;
  const resolvedTitle = title || titleFromSlug(slug);
  const branches = branchSet.map((branch) => makeBranch(branch, resolvedTitle));
  return {
    level: normalizedLevel,
    day: Number(day) || 1,
    lessonId: `${normalizedLevel.toLowerCase()}-day-${Number(day) || 1}-${String(slug || resolvedTitle).toLowerCase()}`,
    title: resolvedTitle,
    centralQuestion: `Wie sprichst du strukturiert über ${resolvedTitle}?`,
    targetDurationSeconds: normalizedLevel === "B1" ? 90 : normalizedLevel === "B2" ? 120 : 150,
    branches,
    speakingRoute: branches.map((branch) => branch.id),
  };
};

export const getRouteSpeakingMindMap = (path = "") => {
  const normalizedPath = String(path || "").toLowerCase();
  const match = normalizedPath.match(/\/campus\/course\/((b1|b2|c1)-day-(\d+)-[^/?#]*workbook)/);
  if (!match) return null;
  return buildSpeakingMindMapForRoute({ level: match[2], day: match[3], slug: match[1] });
};
