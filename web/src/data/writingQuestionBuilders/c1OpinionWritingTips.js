export const C1_OPINION_WRITING_TIPS = {
  introduction: "Heutzutage wird das Thema ______ stark diskutiert. Meiner Meinung nach ist dieses Thema von großer Bedeutung, da es das Leben vieler Menschen beeinflusst und zugleich eine wichtige Rolle in der Gesellschaft spielt. Im Folgenden werde ich zunächst erläutern, welche Bedeutung ______ hat. Anschließend werde ich meine Argumentation anhand eines konkreten Beispiels verdeutlichen, mögliche Einwände darstellen und schließlich eine alternative Sichtweise erläutern.",
  explanation: "Zunächst lässt sich sagen, dass ______ eine wichtige Rolle spielt. Es beeinflusst, wie Menschen denken, handeln und Entscheidungen treffen. Außerdem wirkt sich ______ nicht nur auf den Einzelnen, sondern auch auf das Zusammenleben in der Gesellschaft aus.",
  example: "Ein konkretes Beispiel dafür ist ______.",
  objection: "Allerdings gibt es auch Einwände gegen eine zu einseitige Betrachtung dieses Themas. Kritiker könnten argumentieren, dass ______.",
  alternative: "Eine sinnvollere Alternative besteht darin, ______ differenzierter und flexibler zu betrachten. Statt ______ nur aus einer festen Perspektive zu bewerten, sollte man berücksichtigen, dass verschiedene Faktoren zusammenwirken.",
  conclusion: "Zusammenfassend lässt sich sagen, dass ______ eine zentrale Rolle spielt und viele Bereiche des Lebens beeinflusst. Dennoch sollte man das Thema nicht zu starr oder einseitig betrachten. Meiner Meinung nach ist es wichtig, sowohl die Bedeutung von ______ anzuerkennen als auch mögliche Grenzen und alternative Sichtweisen zu berücksichtigen.",
};

export const normalizeC1OpinionWritingTipId = (id = "") => {
  const normalizedId = String(id).trim().toLowerCase();
  if (normalizedId === "role") return "explanation";
  if (normalizedId === "counterargument") return "objection";
  return normalizedId;
};

export const isC1OpinionWriting = ({ level, taskType } = {}) =>
  String(level).toUpperCase() === "C1"
  && /opinion essay|stellungnahme|erörterung/i.test(String(taskType || ""));

export const getC1OpinionWritingTip = ({ id, level, taskType } = {}) => {
  if (!isC1OpinionWriting({ level, taskType })) return undefined;
  return C1_OPINION_WRITING_TIPS[normalizeC1OpinionWritingTipId(id)];
};

