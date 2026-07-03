export const PREPOSITION_CASES = {
  accusative: ["durch", "für", "gegen", "ohne", "um"],
  dative: ["aus", "außer", "bei", "mit", "nach", "seit", "von", "zu", "gegenüber"],
  genitive: ["anstatt", "statt", "außerhalb", "innerhalb", "trotz", "während", "wegen"],
  twoWay: ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"],
};

export const CONTRACTED_PREPOSITIONS = {
  am: { preposition: "an", determiner: "dem", case: "dative", gender: "neuter", number: "singular" },
  ans: { preposition: "an", determiner: "das", case: "accusative", gender: "neuter", number: "singular" },
  beim: { preposition: "bei", determiner: "dem", case: "dative", gender: "neuter", number: "singular" },
  im: { preposition: "in", determiner: "dem", case: "dative", gender: "neuter", number: "singular" },
  ins: { preposition: "in", determiner: "das", case: "accusative", gender: "neuter", number: "singular" },
  vom: { preposition: "von", determiner: "dem", case: "dative", gender: "neuter", number: "singular" },
  zum: { preposition: "zu", determiner: "dem", case: "dative", gender: "neuter", number: "singular" },
  zur: { preposition: "zu", determiner: "der", case: "dative", gender: "feminine", number: "singular" },
};

const SUPPORTED_LEVELS = new Set(["B2", "C1"]);
const TOKEN_PATTERN = /[\p{L}]+(?:[-’'][\p{L}]+)*/gu;
const UPPERCASE_PATTERN = /^\p{Lu}/u;
const LOWERCASE_PATTERN = /^\p{Ll}/u;
const MAX_ADJECTIVES = 3;

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

const SAFE_MULTI_ADJECTIVES = new Set([
  "aktuell", "alt", "beruflich", "besser", "deutsch", "digital", "dringend",
  "effektiv", "europäisch", "finanziell", "flexibel", "gesellschaftlich",
  "gesund", "global", "groß", "hoch", "individuell", "innovativ", "international",
  "kulturell", "langfristig", "lokal", "modern", "nachhaltig", "national",
  "neu", "öffentlich", "persönlich", "politisch", "positiv", "praktisch",
  "professionell", "regional", "schlecht", "schwer", "sozial", "staatlich",
  "technisch", "teuer", "traditionell", "umweltfreundlich", "wichtig", "wirtschaftlich",
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

  return { ...candidates[0], candidates, expectedEnding: endings[0] };
};

const getAdjectiveStem = (adjective) => {
  const lower = adjective.toLocaleLowerCase("de-DE");
  const irregular = IRREGULAR_STEMS.get(lower);
  if (irregular) return irregular;
  if (BASE_FORM_ER_EXCEPTIONS.has(lower) || BASE_FORM_EN_EXCEPTIONS.has(lower)) return lower;
  if (/(em|en|es)$/u.test(lower)) return lower.slice(0, -2);
  if (/e$/u.test(lower)) return lower.slice(0, -1);
  if (/er$/u.test(lower)) return lower.slice(0, -2);
  return lower;
};

const correctAdjective = (adjective, expectedEnding) =>
  `${getAdjectiveStem(adjective)}${expectedEnding}`;

const isSafeMultiAdjective = (adjective) => {
  const lower = adjective.toLocaleLowerCase("de-DE");
  const stem = getAdjectiveStem(lower);
  return SAFE_MULTI_ADJECTIVES.has(lower) || SAFE_MULTI_ADJECTIVES.has(stem);
};

const collectAdjectiveNounSequence = (source, tokens, firstAdjectiveIndex) => {
  const adjectives = [];
  let previous = tokens[firstAdjectiveIndex - 1];

  for (let index = firstAdjectiveIndex; index < tokens.length && adjectives.length <= MAX_ADJECTIVES; index += 1) {
    const token = tokens[index];
    if (!onlyWhitespaceBetween(source, previous, token)) return null;

    if (UPPERCASE_PATTERN.test(token.value)) {
      if (!adjectives.length || token.value.length < 2) return null;
      if (adjectives.length > 1 && !adjectives.every((item) => isSafeMultiAdjective(item.value))) {
        return null;
      }
      return { adjectives, noun: token };
    }

    if (!LOWERCASE_PATTERN.test(token.value) || token.value.length < 3 || adjectives.length === MAX_ADJECTIVES) {
      return null;
    }

    adjectives.push(token);
    previous = token;
  }

  return null;
};

const makeStableId = (signature, occurrence) => {
  let hash = 2166136261;
  for (let index = 0; index < signature.length; index += 1) {
    hash ^= signature.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `preposition-case-${(hash >>> 0).toString(36)}-${occurrence}`;
};

const buildExplanation = ({ caseName, declensionType, determiner, contractedForm, expanded }) => {
  if (contractedForm) {
    return `“${contractedForm}” is short for “${expanded}”. “${determiner}” marks ${caseName}, so the following adjective uses weak declension.`;
  }
  if (declensionType === "weak") {
    return `“${determiner}” already carries the case marker. That makes this weak adjective declension in ${caseName}.`;
  }
  return `“${determiner}” is an ein-word determiner. The adjective therefore follows mixed declension in ${caseName}.`;
};

const buildIssue = ({
  source,
  prepositionToken,
  determinerToken,
  adjectives,
  noun,
  resolution,
  occurrence,
  contracted,
}) => {
  const correctedAdjectives = adjectives.map((token) => correctAdjective(token.value, resolution.expectedEnding));
  const incorrectAdjectives = adjectives.filter(
    (token, index) => token.normalized !== correctedAdjectives[index].toLocaleLowerCase("de-DE"),
  );
  if (!incorrectAdjectives.length) return null;

  const writtenHead = contracted ? prepositionToken.value : `${prepositionToken.value} ${determinerToken.value}`;
  const fullStart = prepositionToken.start;
  const phraseStart = contracted ? prepositionToken.start : determinerToken.start;
  const fullPhrase = source.slice(fullStart, noun.end);
  const phrase = source.slice(phraseStart, noun.end);
  const adjectiveText = correctedAdjectives.join(" ");
  const correction = contracted
    ? `${prepositionToken.value} ${adjectiveText} ${noun.value}`
    : `${determinerToken.value} ${adjectiveText} ${noun.value}`;
  const fullCorrection = contracted
    ? correction
    : `${prepositionToken.value} ${correction}`;
  const signature = [
    prepositionToken.normalized,
    contracted ? "contracted" : determinerToken.normalized,
    ...adjectives.map((token) => token.normalized),
    noun.value,
  ].join("|");
  const adjectiveLabel = adjectives.length > 1 ? "adjectives normally end" : "adjective normally ends";
  const caseLead = contracted
    ? `“${prepositionToken.value}” contains “${resolution.preposition} ${resolution.determiner}” and shows ${resolution.case}.`
    : resolution.prepositionCase === "twoWay"
      ? `With “${writtenHead}”, the determiner shows ${resolution.case}.`
      : `“${prepositionToken.value}” requires ${resolution.case}.`;

  return {
    id: makeStableId(signature, occurrence),
    start: phraseStart,
    fullStart,
    end: noun.end,
    phrase,
    fullPhrase,
    preposition: contracted ? resolution.preposition : prepositionToken.value,
    writtenPreposition: prepositionToken.value,
    determiner: resolution.determiner || determinerToken.value,
    writtenDeterminer: contracted ? prepositionToken.value : determinerToken.value,
    adjective: incorrectAdjectives[0].value,
    adjectives: adjectives.map((token) => token.value),
    incorrectAdjectives: incorrectAdjectives.map((token) => token.value),
    noun: noun.value,
    expectedEnding: resolution.expectedEnding,
    correction,
    fullCorrection,
    hint: `${caseLead} After “${contracted ? prepositionToken.value : determinerToken.value}”, the ${adjectiveLabel} in -${resolution.expectedEnding}.`,
    explanation: buildExplanation({
      caseName: resolution.case,
      declensionType: resolution.declensionType,
      determiner: resolution.determiner || determinerToken.value,
      contractedForm: contracted ? prepositionToken.value : "",
      expanded: contracted ? `${resolution.preposition} ${resolution.determiner}` : "",
    }),
    case: resolution.case,
    confidence: adjectives.length > 1 ? 0.95 : 1,
    declensionType: resolution.declensionType,
    contracted,
  };
};

/**
 * @typedef {Object} PrepositionCaseIssue
 * @property {string} id Stable while the relevant phrase remains unchanged.
 * @property {number} start Start offset of the visible determiner or contraction.
 * @property {number} fullStart Start offset including the preposition.
 * @property {number} end End offset of the noun.
 * @property {string} fullPhrase Original preposition phrase.
 * @property {string} fullCorrection Teaching correction; never inserted automatically.
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

  for (let index = 0; index < tokens.length; index += 1) {
    const prepositionToken = tokens[index];
    const contraction = CONTRACTED_PREPOSITIONS[prepositionToken.normalized];

    if (contraction) {
      const sequence = collectAdjectiveNounSequence(source, tokens, index + 1);
      if (!sequence) continue;
      const expectedEnding = WEAK_ENDINGS[contraction.case][contraction.gender];
      const signature = [prepositionToken.normalized, ...sequence.adjectives.map((item) => item.normalized), sequence.noun.value].join("|");
      const occurrence = signatureCounts.get(signature) || 0;
      signatureCounts.set(signature, occurrence + 1);
      const issue = buildIssue({
        source,
        prepositionToken,
        determinerToken: prepositionToken,
        adjectives: sequence.adjectives,
        noun: sequence.noun,
        occurrence,
        contracted: true,
        resolution: {
          ...contraction,
          expectedEnding,
          declensionType: "weak",
          prepositionCase: contraction.case,
        },
      });
      if (issue) issues.push(issue);
      continue;
    }

    const prepositionCase = CASE_BY_PREPOSITION.get(prepositionToken.normalized);
    if (!prepositionCase) continue;

    const determinerToken = tokens[index + 1];
    if (!determinerToken || !onlyWhitespaceBetween(source, prepositionToken, determinerToken)) continue;
    const resolution = resolveDeterminer(determinerToken.value, prepositionCase);
    if (!resolution) continue;

    const sequence = collectAdjectiveNounSequence(source, tokens, index + 2);
    if (!sequence) continue;
    const signature = [
      prepositionToken.normalized,
      determinerToken.normalized,
      ...sequence.adjectives.map((item) => item.normalized),
      sequence.noun.value,
    ].join("|");
    const occurrence = signatureCounts.get(signature) || 0;
    signatureCounts.set(signature, occurrence + 1);
    const issue = buildIssue({
      source,
      prepositionToken,
      determinerToken,
      adjectives: sequence.adjectives,
      noun: sequence.noun,
      occurrence,
      contracted: false,
      resolution: {
        ...resolution,
        determiner: determinerToken.value,
        prepositionCase,
      },
    });
    if (issue) issues.push(issue);
  }

  return issues;
};

export const isPrepositionCaseCoachLevel = (level) =>
  SUPPORTED_LEVELS.has(String(level || "").trim().toUpperCase());

export const tokenizeGermanText = tokenize;
