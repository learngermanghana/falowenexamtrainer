import {
  REMOVED_A1_DAY13_NUMBER_PROMPTS,
  addA1Day13AnswerChecks,
  hideRemovedA1Day13NumberPrompts,
  normalizeA1Day13Answer,
  removeA1Day13AnswerChecks,
  restoreRemovedA1Day13NumberPrompts,
} from "./A1Day13RevisionNumberCleanup";

const addNumberCard = (value) => {
  const card = document.createElement("div");
  const prompt = document.createElement("strong");
  const input = document.createElement("input");

  card.dataset.numberCard = value;
  prompt.textContent = value;
  card.append(prompt, input);
  document.body.appendChild(card);

  return card;
};

const addPracticeSection = (title, prompts) => {
  const section = document.createElement("section");
  const heading = document.createElement("h2");
  heading.textContent = title;
  section.appendChild(heading);

  const cards = prompts.map((promptText) => {
    const card = document.createElement("div");
    const prompt = document.createElement("strong");
    const input = document.createElement("input");
    prompt.textContent = promptText;
    card.append(prompt, input);
    section.appendChild(card);
    return { card, input };
  });

  document.body.appendChild(section);
  return cards;
};

const clickCheck = (card) => {
  card.querySelector('button[type="button"]').click();
  return card.querySelector('[aria-live="polite"]');
};

describe("A1 Day 13 revision number cleanup and answer checks", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    removeA1Day13AnswerChecks();
  });

  test("removes only 6,789, 7,890 and 9,999 while keeping 5,678", () => {
    const keptCard = addNumberCard("5,678");
    const removedCards = REMOVED_A1_DAY13_NUMBER_PROMPTS.map(addNumberCard);

    expect(hideRemovedA1Day13NumberPrompts()).toHaveLength(3);
    expect(keptCard.hidden).toBe(false);
    removedCards.forEach((card) => expect(card.hidden).toBe(true));
  });

  test("restores hidden cards when leaving the workbook route", () => {
    const card = addNumberCard("6,789");

    hideRemovedA1Day13NumberPrompts();
    expect(card.hidden).toBe(true);

    restoreRemovedA1Day13NumberPrompts();
    expect(card.hidden).toBe(false);
  });

  test("normalizes spaces, punctuation and number-word hyphens", () => {
    expect(normalizeA1Day13Answer(" Es ist halb acht. ")).toBe("es ist halb acht");
    expect(normalizeA1Day13Answer("fünf-tausend sechshundertachtundsiebzig", { compact: true }))
      .toBe("fünftausendsechshundertachtundsiebzig");
  });

  test("adds check buttons to numbers, time, years and typed price answers", () => {
    addPracticeSection("Practice: Numbers from 1 to 10,000", ["56"]);
    addPracticeSection("Time Practice", ["2:15"]);
    addPracticeSection("Year Practice", ["2025"]);
    addPracticeSection("Price Question and Answer Practice", ["Wie viel kostet das Buch?"]);

    expect(addA1Day13AnswerChecks()).toHaveLength(4);
    expect(document.querySelectorAll('[data-a1-day13-answer-check="true"]')).toHaveLength(4);
    expect(document.querySelectorAll("button")).toHaveLength(4);
  });

  test("marks a correct typed number and clears feedback after editing", () => {
    const [{ card, input }] = addPracticeSection("Practice: Numbers from 1 to 10,000", ["56"]);
    addA1Day13AnswerChecks();

    input.value = "sechsundfünfzig";
    const feedback = clickCheck(card);
    expect(feedback.dataset.result).toBe("correct");
    expect(feedback).toHaveTextContent("Correct");

    input.value = "sechsundfünfzigx";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(feedback.hidden).toBe(true);
    expect(feedback.textContent).toBe("");
  });

  test("shows the model answer for an incorrect time response", () => {
    const [{ card, input }] = addPracticeSection("Time Practice", ["2:15"]);
    addA1Day13AnswerChecks();

    input.value = "Es ist zwei Uhr fünfzehn.";
    const feedback = clickCheck(card);
    expect(feedback.dataset.result).toBe("incorrect");
    expect(feedback).toHaveTextContent("Es ist Viertel nach zwei.");
  });

  test("checks the requested year answers and accepts a full-number variant", () => {
    const [year2025, year1453] = addPracticeSection("Year Practice", ["2025", "1453"]);
    addA1Day13AnswerChecks();

    year2025.input.value = "zweitausendfünfundzwanzig";
    expect(clickCheck(year2025.card).dataset.result).toBe("correct");

    year1453.input.value = "eintausendvierhundertdreiundfünfzig";
    expect(clickCheck(year1453.card).dataset.result).toBe("correct");
  });

  test("shows the approved model year after an incorrect response", () => {
    const [{ card, input }] = addPracticeSection("Year Practice", ["2030"]);
    addA1Day13AnswerChecks();

    input.value = "zweitausenddreizehn";
    const feedback = clickCheck(card);
    expect(feedback.dataset.result).toBe("incorrect");
    expect(feedback).toHaveTextContent("zweitausenddreißig");
  });

  test("accepts a correct kostet answer written with a numeric price", () => {
    const [{ card, input }] = addPracticeSection(
      "Price Question and Answer Practice",
      ["Wie viel kostet die Zeitung?"],
    );
    addA1Day13AnswerChecks();

    input.value = "Sie kostet 2,50 Euro.";
    const feedback = clickCheck(card);
    expect(feedback.dataset.result).toBe("correct");
  });

  test("asks the learner to type before checking", () => {
    const [{ card }] = addPracticeSection("Time Practice", ["7:30"]);
    addA1Day13AnswerChecks();

    const feedback = clickCheck(card);
    expect(feedback.dataset.result).toBe("empty");
    expect(feedback).toHaveTextContent("Type an answer first");
  });

  test("removes injected answer controls when leaving the route", () => {
    const [{ input }] = addPracticeSection("Time Practice", ["8:20"]);
    addA1Day13AnswerChecks();
    expect(document.querySelectorAll('[data-a1-day13-answer-check="true"]')).toHaveLength(1);

    removeA1Day13AnswerChecks();
    expect(document.querySelectorAll('[data-a1-day13-answer-check="true"]')).toHaveLength(0);
    expect(input.hasAttribute("data-a1-day13-answer-input")).toBe(false);
  });
});
