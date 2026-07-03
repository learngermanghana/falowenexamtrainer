export const PREPOSITION_CASES = {
  accusative: ["durch", "für", "gegen", "ohne", "um"],
  dative: ["aus", "außer", "bei", "mit", "nach", "seit", "von", "zu", "gegenüber"],
  genitive: ["anstatt", "statt", "außerhalb", "innerhalb", "trotz", "während", "wegen"],
  twoWay: ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"],
};

const SUPPORTED_LEVELS = new Set(["B2", "C1"]);
const TOKEN_PATTERN = /[\p{L}]+(?:[-’'][\p{L}]+)*/gu;
const UPPERCASE_PATTERN = /^\p{Lu}/u;
const LOWERCASE_PATTERN = /^\p{Ll}/u;

const CASE_BY_PREPOSITION = Object.entries(PREPOSITION_CASES).reduce((map, [caseName, items]) => {
  items.forEach((item) => map.set(item, caseName));
  return map;
}, new Map());

const determinerForms = new Map();

const addDeterminer = (form, candidate) => {
  const key = form.toLocaleLowerCase("de-DE");
  const candidates = determinerForms.get(key) || [];
  candidates.push(candidate);
  determinerForms.set(key, candidates);
};

const addFormSet = (forms, declensionType) => {
  Object.entries(forms).forEach(([form, candidates]) => {
    candidates.forEach((candidate) => addDeterminer(form, { ...candidate, declensionType }));
  });
};

addFormSet(
  {
    der: [
      { case: "nominative", gender: "masculine", number: "singular" },
      { case: "dative", gender: "feminine", number: "singular" },
      { case: "genitive", gender: "feminine", number: "singular" },
      { case: "genitive", gender: "plural", number: "plural" },
    ],
    die: [
      { case: "nominative", gender: "feminine", number: "singular" },
      { case: "accusative", gender: "feminine", number: "singular" },
      { case: "nominative", gender: "plural", number: "plural" },
      { case: "accusative", gender: "plural", number: "plural" },
    ],
    das: [
      { case: "nominative", gender: "neuter", number: "singular" },
      { case: "accusative", gender: "neuter", number: "singular" },
    ],
    den: [
      { case: "accusative", gender: "masculine", number: "singular" },
      { case: "dative", gender: "plural", number: "plural" },
    ],
    dem: [
      { case: "dative", gender: "masculine", number: "singular" },
      { case: "dative", gender: "neuter", number: "singular" },
    ],
    des: [
      { case: "genitive", gender: "masculine", number: "singular" },
      { case: "genitive", gender: "neuter", number: "singular" },
    ],
  },
  "weak",
);

const DER_WORD_CANDIDATES = {
  er: [{ case: "nominative", gender: "masculine", number: "singular" }],
  e: [
    { case: "nominative", gender: "feminine", number: "singular" },
    { case: "accusative", gender: "feminine", number: "singular" },
    { case: "nominative", gender: "plural", number: "plural" },
    { case: "accusative", gender: "plural", number: "plural" },
  ],
  es: [
    { case: "nominative", gender: "neuter", number: "singular" },
    { case: "accusative", gender: "neuter", number: "singular" },
    { case: "genitive", gender: "masculine", number: "singular" },
    { case: "genitive", gender: "neuter", number: "singular" },
  ],
  en: [
    { case: "accusative", gender: "masculine", number: "singular" },
    { case: "dative", gender: "plural", number: "plural" },
  ],
  em: [
    { case: "dative", gender: "masculine", number: "singular" },
    { case: "dative", gender: "neuter", number: "singular" },
  ],
  erDatGen: [
    { case: "dative", gender: "feminine", number: "singular" },
    { case: "genitive", gender: "feminine", number: "singular" },
    { case: "genitive", gender: "plural", number: "plural" },
  ],
};

["dies", "jed", "welch", "solch"].forEach((stem) => {
  addFormSet(
    {
      [`${stem}er`]: DER_WORD_CANDIDATES.er,
      [`${stem}e`]: DER_WORD_CANDIDATES.e,
      [`${stem}es`]: DER_WORD_CANDIDATES.es,
      [`${stem}en`]: DER_WORD_CANDIDATES.en,
      [`${stem}em`]: DER_WORD_CANDIDATES.em,
    },
    "weak",
  );
  DER_WORD_CANDIDATES.erDatGen.forEach((candidate) =>
    addDeterminer(`${stem}er`, { ...candidate, declensionType: "weak" }),
  );
});

addFormSet(
  {
    ein: [
      { case: "nominative", gender: "masculine", number: "singular" },
      { case: "nominative", gender: "neuter", number: "singular" },
      { case: "accusative", gender: "neuter", number: "singular" },
    ],
    eine: [
      { case: "nominative", gender: "feminine", number: "singular" },
      { case: "accusative", gender: "feminine", number: "singular" },
    ],
    einen: [{ case: "accusative", gender: "masculine", number: "singular" }],
    einem: [
      { case: "dative", gender: "masculine", number: "singular" },
      { case: "dative", gender: "neuter", number: "singular" },
    ],
    einer: [
      { case: "dative", gender: "feminine", number: "singular" },
      { case: "genitive", gender: "feminine", number: "singular" },
    ],
    eines: [
      { case: "genitive", gender: "masculine", number: "singular" },
      { case: "genitive", gender: "neuter", number: "singular" },
    ],
  },
  "mixed",
);

const EIN_WORD_CANDIDATES = {
  "": [
    { case: "nominative", gender: "masculine", number: "singular" },
    { case: "nominative", gender: "neuter", number: "singular" },
    { case: "accusative", gender: "neuter", number: "singular" },
  ],
  e: [
    { case: "nominative", gender: "feminine", number: "singular" },
    { case: "accusative", gender: "feminine", number: "singular" },
    { case: "nominative", gender: "plural", number: "plural" },
    { case: "accusative", gender: "plural", number: "plural" },
  ],
  en: [
    { case: "accusative", gender: "masculine", number: "singular" },
    { case: "dative", gender: "plural", number: "plural" },
  ],
  em: [
    { case: "dative", gender: "masculine", number: "singular" },
    { case: "dative", gender: "neuter", number: "singular" },
  ],
  er: [
    { case: "dative", gender: "feminine", number: "singular" },
    { case: "genitive", gender: "feminine", number: "singular" },
    { case: "genitive", gender: "plural", number: "plural" },
  ],
  es: [
    { case: "genitive", gender: "masculine", number: "singular" },
    { case: "genitive", gender: "neuter", number: "singular" },
  ],
};

["kein", "mein", "dein", "sein", "ihr", "unser", "euer"].forEach((stem) => {
  const declinedStem = stem === "euer" ? "eur" : stem;
  Object.entries(EIN_WORD_CANDIDATES).forEach(([ending, candidates]) => {
    const form = ending ? `${declinedStem}${ending}` : stem;
    candidates.forEach((candidate) =>
      addDeterminer(form, { ...candidate, declensionType: "mixed" }),
    );
  });
});

const WEAK_ENDINGS = {
  nominative: { masculine: "e", feminine: "e", neuter: "e", plural: "en" },
  accusative: { masculine: "en", feminine: "e", neuter: "e", plural: "en" },
  dative: { masculine: "en", feminine: "en", neuter: "en", plural: "en" },
  genitive: { masculine: "en", feminine: "en", neuter: "en", plural: "en" },
};

const MIXED_ENDINGS = {
  nominative: { masculine: "er", feminine: "e", neuter: "es", plural: "en" },
  accusative: { masculine: "en", feminine: "e", neuter: "es", plural: "en" },
  dative: { masculine: "en", feminine: "en", neuter: "en", plural: "en" },
  genitive: { masculine: "en", feminine: "en", neuter: "en", plural: "en" },
};

const BASE_FORM_ER_EXCEPTIONS = new Set([
  "besser",
  "bitter",
  "clever",
  "finster",
  "heiter",
  "locker",
  "mager",
  "sauber",
  "sauer",
  "schwer",
  "sicher",
  "teuer",
]);

const tokenize = (text) => {
  const tokens = [];
  for (const match of String(text || "").matchAll(TOKEN_PATTERN)) {
    tokens.push({
      value: match[0],
      normalized: match[0].toLocaleLowerCase("de-DE"),
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return tokens;
};

const onlyWhitespaceBetween = (text, left, right) => /^\s+$/u.test(text.slice(left.end, right.start));

const getExpectedEnding = (candidate) => {
  const genderKey = candidate.number === "plural" ? "plural" : candidate.gender;
  const table = candidate.declensionType === "weak" ? WEAK_ENDINGS : MIXED_ENDINGS;
  return table[candidate.case]?.[genderKey] || null;
};

const resolveDeterminer = (form, prepositionCase) => {
  const allCandidates = determinerForms.get(form.toLocaleLowerCase("de-DE")) || [];
  const candidates = prepositionCase === "twoWay"
    ? allCandidates.filter((candidate) => ["accusative", "dative"].includes(candidate.case))
    : allCandidates.filter((candidate) => candidate.case === prepositionCase);

  if (!candidates.length) return null;
  const endings = [...new Set(candidates.map(getExpectedEnding).filter(Boolean))];
  if (endings.length !== 1) return null;

  return {
    ...candidates[0],
    candidates,
    expectedEnding: endings[0],
  };
};

const adjectiveHasEnding = (adjective, expectedEnding) =>
  adjective.toLocaleLowerCase("de-DE").endsWith(expectedEnding);

const getAdjectiveStem = (adjective) => {
  const lower = adjective.toLocaleLowerCase("de-DE");
  if (BASE_FORM_ER_EXCEPTIONS.has(lower)) return adjective;
  if (/(em|en|es)$/u.test(lower)) return adjective.slice(0, -2);
  if (/e$/u.test(lower)) return adjective.slice(0, -1);
  if (/er$/u.test(lower)) return adjective.slice(0, -2);
  return adjective;
};

const makeStableId = (signature, occurrence) => {
  let hash = 2166136261;
  for (let index = 0; index < signature.length; index += 1) {
    hash ^= signature.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `preposition-case-${(hash >>> 0).toString(36)}-${occurrence}`;
};

/**
 * @typedef {Object} PrepositionCaseIssue
 * @property {string} id Stable while the relevant phrase remains unchanged.
 * @property {number} start Start offset of the determiner.
 * @property {number} end End offset of the noun.
 * @property {string} phrase Original determiner + adjective + noun phrase.
 * @property {string} fullPhrase Original preposition + phrase.
 * @property {string} correction Suggested phrase without automatic replacement.
 */

/**
 * Analyse visible German prepositional adjective phrases locally.
 *
 * @param {string} text
 * @param {{ level?: string }} options
 * @returns {PrepositionCaseIssue[]}
 */
export const analyzePrepositionCaseCoach = (text, { level = "" } = {}) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  if (!SUPPORTED_LEVELS.has(normalizedLevel)) return [];

  const source = String(text || "");
  if (source.trim().length < 8) return [];

  const tokens = tokenize(source);
  const issues = [];
  const signatureCounts = new Map();

  for (let index = 0; index <= tokens.length - 4; index += 1) {
    const [prepositionToken, determinerToken, adjectiveToken, nounToken] = tokens.slice(index, index + 4);
    const prepositionCase = CASE_BY_PREPOSITION.get(prepositionToken.normalized);
    if (!prepositionCase) continue;
    if (
      !onlyWhitespaceBetween(source, prepositionToken, determinerToken) ||
      !onlyWhitespaceBetween(source, determinerToken, adjectiveToken) ||
      !onlyWhitespaceBetween(source, adjectiveToken, nounToken)
    ) {
      continue;
    }
    if (!LOWERCASE_PATTERN.test(adjectiveToken.value) || adjectiveToken.value.length < 3) continue;
    if (!UPPERCASE_PATTERN.test(nounToken.value)) continue;

    const resolution = resolveDeterminer(determinerToken.value, prepositionCase);
    if (!resolution) continue;
    if (adjectiveHasEnding(adjectiveToken.value, resolution.expectedEnding)) continue;

    const stem = getAdjectiveStem(adjectiveToken.value);
    if (!stem || stem.length < 2) continue;
    const correctedAdjective = `${stem}${resolution.expectedEnding}`;
    const phrase = source.slice(determinerToken.start, nounToken.end);
    const fullPhrase = source.slice(prepositionToken.start, nounToken.end);
    const signature = [
      prepositionToken.normalized,
      determinerToken.normalized,
      adjectiveToken.normalized,
      nounToken.value,
    ].join("|");
    const occurrence = signatureCounts.get(signature) || 0;
    signatureCounts.set(signature, occurrence + 1);
    const inferredCase = resolution.case;
    const caseLead = prepositionCase === "twoWay"
      ? `With “${prepositionToken.value} ${determinerToken.value}”, the determiner shows ${inferredCase}.`
      : `“${prepositionToken.value}” requires ${inferredCase}.`;

    issues.push({
      id: makeStableId(signature, occurrence),
      start: determinerToken.start,
      end: nounToken.end,
      phrase,
      fullPhrase,
      preposition: prepositionToken.value,
      determiner: determinerToken.value,
      adjective: adjectiveToken.value,
      noun: nounToken.value,
      expectedEnding: resolution.expectedEnding,
      correction: `${determinerToken.value} ${correctedAdjective} ${nounToken.value}`,
      fullCorrection: `${prepositionToken.value} ${determinerToken.value} ${correctedAdjective} ${nounToken.value}`,
      hint: `${caseLead} After “${determinerToken.value}”, the adjective normally ends in -${resolution.expectedEnding}.`,
      case: inferredCase,
      confidence: 1,
      declensionType: resolution.declensionType,
    });
  }

  return issues;
};

export const isPrepositionCaseCoachLevel = (level) =>
  SUPPORTED_LEVELS.has(String(level || "").trim().toUpperCase());

export const tokenizeGermanText = tokenize;
