import React from "react";
import { render, screen } from "@testing-library/react";
import A1Day4NumbersForBeginnersWorkbookPage, {
  A1_DAY4_FORM_FIELDS,
  A1_DAY4_NUMBER_WORD_ITEMS,
} from "./A1Day4NumbersForBeginnersWorkbookPage";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { getA1TutorDraftProfile } from "../data/a1TutorDraftProfiles";

jest.mock("./A1TutorMarkedWorkbookShell", () => ({ children }) => <div>{children}</div>);
jest.mock("./A1Day4PhoneNumberSpeakingPractice", () => () => <div data-testid="phone-speaking" />);

test("A1-2 remains Day 4, Chapter 2 with three correctly routed Teile", () => {
  const assignment = getA1Assignment("A1-2");
  expect(assignment.day).toBe(4);
  expect(assignment.chapter).toBe("2");
  expect(assignment.sections.map(section => section.key)).toEqual(["teil-1", "teil-2", "teil-3"]);
});

test("Teil 1 asks five direct form details and Teil 2 asks exactly five number words", () => {
  expect(A1_DAY4_FORM_FIELDS.map(field => field.label)).toEqual([
    "Alter", "Straße und Hausnummer", "Telefonnummer", "Kursdauer", "Kursgebühr",
  ]);
  expect(A1_DAY4_NUMBER_WORD_ITEMS).toEqual([12, 16, 221, 3435, 70]);
  render(<A1Day4NumbersForBeginnersWorkbookPage />);
  expect(screen.getByText("Teil 1 · Lesen und Schreiben: Formular ausfüllen")).toBeTruthy();
  expect(screen.getByText("Teil 2 · Schreiben: Zahlen als Wörter")).toBeTruthy();
  expect(screen.getByTestId("phone-speaking")).toBeTruthy();
  expect(screen.getByText(/0171 33 55 90/)).toBeTruthy();
});

test("saved draft requires five form answers and five number words, not ten old MCQs", () => {
  const profile = getA1TutorDraftProfile("A1-2");
  expect(profile.sections["teil-1"].items).toHaveLength(5);
  expect(profile.sections["teil-2"].items).toHaveLength(5);
  expect(profile.sections["teil-2"].items.every(item => item.type === "short")).toBe(true);
  expect(profile.sections["teil-3"].required).toBe(false);
  expect(profile.sections["teil-3"].readOnly).toBe(true);
});
