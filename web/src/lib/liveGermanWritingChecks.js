const COMMON_GERMAN_NOUNS = new Set([
  "abend", "adresse", "antwort", "arbeit", "arzt", "bahnhof", "brief",
  "bruder", "buch", "bus", "deutsch", "eltern", "essen", "familie",
  "film", "frage", "freund", "freundin", "geburtstag", "geld", "haus",
  "hotel", "information", "jahr", "kind", "kurs", "lehrer", "lehrerin",
  "mann", "morgen", "mutter", "name", "nummer", "problem", "reise",
  "schule", "schwester", "sonntag", "sprache", "stadt", "tag", "termin",
  "uhr", "vater", "wetter", "wohnung", "woche", "zeit",
]);

const COMMON_ADJECTIVE_STEMS = new Set([
  "alt", "billig", "freundlich", "groß", "gut", "interessant", "klein",
  "lang", "modern", "neu", "nett", "ruhig", "schlecht", "schön", "teuer",
  "wichtig",
]);

const DEFINITE_ADJECTIVE_ENDINGS = {
  der: "e",
  die: "e",
  das: "e",
  den: "en",
  dem: "en",
  des: "en",
  eine: "e",
  einen: "en",
  einem: "en",
  einer: "en",
  eines: "en",
};

const WORD_PATTERN = /[A-Za-zÄÖÜäöüß]+/gu;

const isCompletedToken = (text, end) => end < text.length || /[^A-Za-zÄÖÜäöüß]$/u.test(text);

const makeIssue = (type, start, end, word, message, suggestion = "") => ({
  id: `${type}-${start}-${end}`,
  type,
  start,
  end,
  word,
  message,
  suggestion,
});

/**
 * Fast, deliberately conservative checks for the two most common German
 * drafting problems. These hints are not intended to replace full AI marking.
 */
export const findLiveGermanWritingIssues = (text = "") => {
  const source = String(text);
  if (!source.trim()) return [];

  const issues = [];
  const occupied = new Set();
  const words = Array.from(source.matchAll(WORD_PATTERN));

  words.forEach((match, index) => {
    const word = match[0];
    const start = match.index;
    const end = start + word.length;
    if (!isCompletedToken(source, end)) return;

    const before = source.slice(0, start);
    const beginsSentence = index === 0 || /[.!?]\s*$/u.test(before);
    if (beginsSentence && /^[a-zäöü]/u.test(word)) {
      issues.push(makeIssue(
        "capitalization",
        start,
        end,
        word,
        "A German sentence starts with a capital letter.",
        `${word.charAt(0).toUpperCase()}${word.slice(1)}`,
      ));
      occupied.add(start);
      return;
    }

    if (COMMON_GERMAN_NOUNS.has(word.toLocaleLowerCase("de-DE")) && /^[a-zäöü]/u.test(word)) {
      issues.push(makeIssue(
        "capitalization",
        start,
        end,
        word,
        "German nouns are capitalized.",
        `${word.charAt(0).toUpperCase()}${word.slice(1)}`,
      ));
      occupied.add(start);
    }
  });

  for (let index = 0; index < words.length - 1; index += 1) {
    const article = words[index][0].toLocaleLowerCase("de-DE");
    const adjectiveMatch = words[index + 1];
    const adjective = adjectiveMatch[0];
    const adjectiveStart = adjectiveMatch.index;
    const adjectiveEnd = adjectiveStart + adjective.length;
    const ending = DEFINITE_ADJECTIVE_ENDINGS[article];

    if (!ending || occupied.has(adjectiveStart)) continue;
    if (!COMMON_ADJECTIVE_STEMS.has(adjective.toLocaleLowerCase("de-DE"))) continue;
    if (!isCompletedToken(source, adjectiveEnd)) continue;

    issues.push(makeIssue(
      "adjective-ending",
      adjectiveStart,
      adjectiveEnd,
      adjective,
      `After “${words[index][0]}”, this adjective needs the ending -${ending}.`,
      `${adjective}${ending}`,
    ));
  }

  return issues.sort((left, right) => left.start - right.start);
};

export const applyLiveWritingSuggestion = (text, issue) =>
  `${text.slice(0, issue.start)}${issue.suggestion}${text.slice(issue.end)}`;

