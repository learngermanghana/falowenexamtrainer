import {
  PREPOSITION_CASES,
  analyzePrepositionCaseCoach as analyzeBasePrepositionCaseCoach,
  isPrepositionCaseCoachLevel,
  tokenizeGermanText,
} from "./prepositionCaseCoach";

const CASE_BY_PREPOSITION = Object.entries(PREPOSITION_CASES).reduce(
  (map, [caseName, prepositions]) => {
    prepositions.forEach((preposition) => map.set(preposition, caseName));
    return map;
  },
  new Map(),
);

const STRONG_ADJECTIVE_ENDINGS = {
  nominative: { masculine: "er", feminine: "e", neuter: "es", plural: "e" },
  accusative: { masculine: "en", feminine: "e", neuter: "es", plural: "e" },
  dative: { masculine: "em", feminine: "er", neuter: "em", plural: "en" },
  genitive: { masculine: "en", feminine: "er", neuter: "en", plural: "er" },
};

// Keep only nouns whose number can be inferred safely from the written form.
// Verkehrsmittel is deliberately excluded because singular and plural are
// identical outside dative plural, so forcing one number would change meaning.
const ARTICLELESS_NOUNS = new Map();

const onlyWhitespaceBetween = (text, left, right) =>
  /^\s+$/u.test(text.slice(left.end, right.start));

const BASE_FORM_ER_EXCEPTIONS = new Set([
  "besser", "bitter", "clever", "finster", "heiter", "locker", "mager",
  "sauber", "schwer", "sicher", "wunderbar",
]);

const BASE_FORM_EN_EXCEPTIONS = new Set([
  "bescheiden", "eigen", "offen", "trocken", "verschieden", "zufrieden",
]);

const IRREGULAR_STEMS = new Map([
  ["hoch", "hoh"], ["hohe", "hoh"], ["hoher", "hoh"], ["hohes", "hoh"], ["hohem", "hoh"], ["hohen", "hoh"],
  ["nah", "nah"], ["nahe", "nah"], ["naher", "nah"], ["nahes", "nah"], ["nahem", "nah"], ["nahen", "nah"],
  ["dunkel", "dunkl"], ["dunkle", "dunkl"], ["dunkler", "dunkl"], ["dunkles", "dunkl"], ["dunklem", "dunkl"], ["dunklen", "dunkl"],
  ["edel", "edl"], ["edle", "edl"], ["edler", "edl"], ["edles", "edl"], ["edlem", "edl"], ["edlen", "edl"],
  ["teuer", "teur"], ["teure", "teur"], ["teurer", "teur"], ["teures", "teur"], ["teurem", "teur"], ["teuren", "teur"],
  ["sauer", "saur"], ["saure", "saur"], ["saurer", "saur"], ["saures", "saur"], ["saurem", "saur"], ["sauren", "saur"],
]);

const adjectiveStem = (word) => {
  const lower = String(word || "").toLocaleLowerCase("de-DE");
  const irregular = IRREGULAR_STEMS.get(lower);
  if (irregular) return irregular;
  if (BASE_FORM_ER_EXCEPTIONS.has(lower) || BASE_FORM_EN_EXCEPTIONS.has(lower)) return lower;
  if (/(em|en|es)$/u.test(lower)) return lower.slice(0, -2);
  if (/e$/u.test(lower)) return lower.slice(0, -1);
  if (/er$/u.test(lower)) return lower.slice(0, -2);
  return lower;
};

const preserveInitialCase = (source, replacement) =>
  /^\p{Lu}/u.test(source)
    ? `${replacement.charAt(0).toLocaleUpperCase("de-DE")}${replacement.slice(1)}`
    : replacement;

const stableId = (signature, occurrence) => {
  let hash = 2166136261;
  for (let index = 0; index < signature.length; index += 1) {
    hash ^= signature.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `preposition-case-articleless-${(hash >>> 0).toString(36)}-${occurrence}`;
};

const analyzeArticlelessKnownNouns = (text) => {
  const source = String(text || "");
  const tokens = tokenizeGermanText(source);
  const issues = [];
  const signatureCounts = new Map();

  for (let index = 0; index < tokens.length - 2; index += 1) {
    const preposition = tokens[index];
    const adjective = tokens[index + 1];
    const noun = tokens[index + 2];
    const grammaticalCase = CASE_BY_PREPOSITION.get(preposition.normalized);
    if (!grammaticalCase || grammaticalCase === "twoWay") continue;
    if (!onlyWhitespaceBetween(source, preposition, adjective)) continue;
    if (!onlyWhitespaceBetween(source, adjective, noun)) continue;
    if (!/^\p{Ll}/u.test(adjective.value) || !/^\p{Lu}/u.test(noun.value)) continue;

    const nounInfo = ARTICLELESS_NOUNS.get(noun.normalized);
    if (!nounInfo) continue;

    const numberKey = nounInfo.number === "plural" ? "plural" : nounInfo.gender;
    const expectedEnding = STRONG_ADJECTIVE_ENDINGS[grammaticalCase]?.[numberKey];
    const correctedNoun = nounInfo.forms[grammaticalCase] || nounInfo.display;
    if (!expectedEnding) continue;

    const correctedAdjective = preserveInitialCase(
      adjective.value,
      `${adjectiveStem(adjective.value)}${expectedEnding}`,
    );
    const adjectiveCorrect =
      correctedAdjective.toLocaleLowerCase("de-DE") === adjective.normalized;
    const nounCorrect = correctedNoun === noun.value;
    if (adjectiveCorrect && nounCorrect) continue;

    const fullPhrase = source.slice(preposition.start, noun.end);
    const fullCorrection = `${preposition.value} ${correctedAdjective} ${correctedNoun}`;
    const signature = `${preposition.normalized}|${adjective.normalized}|${noun.normalized}|${grammaticalCase}`;
    const occurrence = signatureCounts.get(signature) || 0;
    signatureCounts.set(signature, occurrence + 1);

    issues.push({
      id: stableId(signature, occurrence),
      start: adjective.start,
      fullStart: preposition.start,
      end: noun.end,
      phrase: `${adjective.value} ${noun.value}`,
      fullPhrase,
      preposition: preposition.value,
      writtenPreposition: preposition.value,
      determiner: null,
      writtenDeterminer: null,
      adjective: adjective.value,
      adjectives: [adjective.value],
      incorrectAdjectives: adjectiveCorrect ? [] : [adjective.value],
      noun: noun.value,
      expectedEnding,
      correction: `${correctedAdjective} ${correctedNoun}`,
      fullCorrection,
      hint: `“${preposition.value}” requires ${grammaticalCase}. Without an article, the adjective and the known noun form must mark that case.`,
      explanation: `After “${preposition.value}”, use ${grammaticalCase}: “${fullCorrection}”.`,
      case: grammaticalCase,
      confidence: 1,
      declensionType: "strong",
      contracted: false,
      issueType: "articleless-case",
    });
  }

  return issues;
};

export const analyzePrepositionCaseCoach = (
  text,
  { level = "", allowAllLevels = false } = {},
) => {
  if (!isPrepositionCaseCoachLevel(level, { allowAllLevels })) return [];

  const baseIssues = analyzeBasePrepositionCaseCoach(text, {
    level,
    allowAllLevels,
  });
  const supplementalIssues = analyzeArticlelessKnownNouns(text);
  const seen = new Set(baseIssues.map((issue) => `${issue.fullStart}:${issue.end}`));

  return [...baseIssues, ...supplementalIssues.filter((issue) => {
    const key = `${issue.fullStart}:${issue.end}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })].sort((left, right) => left.fullStart - right.fullStart);
};

export default analyzePrepositionCaseCoach;
