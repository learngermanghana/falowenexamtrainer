import {
  REMOVED_A1_DAY13_NUMBER_PROMPTS,
  hideRemovedA1Day13NumberPrompts,
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

describe("A1 Day 13 revision number cleanup", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
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
});
