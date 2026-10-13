// Keep the original option IDs for autosaved attempts and server grading.
// Only the displayed A/B/C letters and positions change; questions/answers do not.
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

function stableHash(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function arrangeMockChoices(options = [], questionKey = "") {
  if (!Array.isArray(options)) return [];
  const normalized = options.map((option) =>
    Array.isArray(option) ? { id: option[0], label: option[1] } : { ...option });
  if (normalized.length < 3 || normalized.length > 9 || normalized.some((option) =>
    !/^[a-z]$/i.test(String(option.id || "")))) {
    return normalized.map((option) => ({ ...option, displayId: option.id }));
  }

  // A fixed per-question shuffle: never reshuffle when typing, resuming, or
  // switching devices. "correct" is deliberately not part of this algorithm.
  const result = normalized.map((option, index) => ({
    option,
    index,
    score: stableHash(`${questionKey}|${option.id}|${option.label || ""}`),
  })).sort((a, b) => (a.score - b.score) || (a.index - b.index));

  // Avoid leaving all answers in their original a,b,c order by coincidence.
  if (result.every((entry, index) => entry.index === index)) {
    result.push(result.shift());
  }

  return result.map(({ option }, index) => ({
    ...option,
    displayId: (String(option.id) === String(option.id).toUpperCase()
      ? ALPHABET[index].toUpperCase() : ALPHABET[index]),
  }));
}

export function mockDisplayAnswer(options, answer, questionKey) {
  if (!answer || answer === "—") return "—";
  const item = arrangeMockChoices(options, questionKey).find((option) =>
    String(option.id).toLowerCase() === String(answer).toLowerCase());
  return String(item?.displayId || answer).toUpperCase();
}


/**
 * A1 review must display the same letters as the answer controls.
 * section is lesen or hoeren, matching the input name. Picture answer
 * controls additionally prefix their input name with a1-picture-.
 * Original answer IDs and scores remain untouched.
 */
export function mockA1ReviewAnswer(question, answer, section, key) {
  if (!question?.options || question.options.length < 3) return answer || "—";
  const inputName = `${section}-${key}`;
  const usesPictureCards = section === "hoeren" &&
    question.options.some((option) => Boolean(option.picture));
  return mockDisplayAnswer(
    question.options,
    answer,
    usesPictureCards ? `a1-picture-${inputName}` : inputName,
  );
}
