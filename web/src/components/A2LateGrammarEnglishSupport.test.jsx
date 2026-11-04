import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import fs from "fs";
import path from "path";

jest.mock("./navigation/AppBackButton", () => () => null);

// Check rendered content: text inside a non-essential mini block is not visible.
const cases = [
  [15, "action started in the past"],
  [16, "German needs this pronoun even when English does not"],
  [17, "For a yes/no question, start with the modal"],
  [18, "A yes/no question begins with the conjugated verb"],
  [19, "Oder does not send a verb to the end"],
  [20, "Both mean “because”"],
  [21, "English uses if in both cases"],
  [22, "the conjugated verb follows immediately"],
  [23, "zu dem becomes zum"],
  [24, "what the purpose of an action is"],
  [25, "the conjugated verb remains in position 2"],
  [26, "Don't omit the reflexive pronoun"],
  [27, "With a modal verb, the modal verb is at the end"],
  [28, "du wirst"],
];

afterEach(cleanup);

test.each(cases)("Day %i renders its English grammar explanation", (day, explanation) => {
  const file = fs.readdirSync(__dirname).find((name) => name.startsWith(`A2Day${day}`) && name.endsWith("GrammarPage.js"));
  const Page = require(path.join(__dirname, file)).default;
  render(<Page embedded />);
  expect(screen.getAllByText((_, element) => element?.textContent.includes(explanation) && !Array.from(element.children).some((child) => child.textContent.includes(explanation))).length).toBeGreaterThan(0);
});
