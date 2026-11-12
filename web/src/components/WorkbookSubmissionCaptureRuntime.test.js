import React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import WorkbookSubmissionCaptureRuntime, { collectObjectiveGroups, extractWorkbookObjectiveLetter } from "./WorkbookSubmissionCaptureRuntime";
import { saveWorkbookWritingDraft } from "../utils/workbookSubmissionDraft";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "progress-test" } }),
}));

const makeQuestion = (section, number, options) => {
  const card = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = `${number}. Frage`;
  card.appendChild(strong);
  options.forEach((option) => {
    const span = document.createElement("span");
    span.textContent = option;
    card.appendChild(span);
  });
  section.appendChild(card);
};

describe("WorkbookSubmissionCaptureRuntime objective mapping", () => {
  test("recognizes Anzeige letter options", () => {
    expect(extractWorkbookObjectiveLetter("Anzeige F")).toBe("F");
    expect(extractWorkbookObjectiveLetter("C) Antwort")).toBe("C");
  });

  test("renumbers restarted Lesen groups instead of overwriting earlier questions", () => {
    const section = document.createElement("section");

    for (let question = 1; question <= 7; question += 1) {
      makeQuestion(section, question, ["A) Eins", "B) Zwei", "C) Drei"]);
    }
    for (let question = 1; question <= 5; question += 1) {
      makeQuestion(section, question, ["Anzeige A", "Anzeige B", "Anzeige C", "Anzeige D", "Anzeige E", "Anzeige F"]);
    }

    const groups = collectObjectiveGroups(section);
    expect(groups.map((group) => group.questionNumber)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1),
    );
    expect(groups.slice(7).map((group) => extractWorkbookObjectiveLetter(group.options[0].textContent))).toEqual(
      ["A", "A", "A", "A", "A"],
    );
  });
});

test("uses the saved draft for both navigation progress and the existing Submit checklist", () => {
  const context = { level: "A2", day: 4 };
  const progressHost = document.createElement("div");
  document.body.append(progressHost);
  const onChange = jest.fn();
  const canOpenPart = (key) => ["schreiben", "lesen", "hoeren"].includes(key);
  const { rerender, unmount } = render(
    <WorkbookSubmissionCaptureRuntime context={context} activeTab="schreiben" progressHost={progressHost} />
  );

  expect(within(progressHost).getByRole("status")).toHaveTextContent("0 of 3 required parts ready");
  act(() => {
    saveWorkbookWritingDraft({ ...context, studentScope: "progress-test" }, "Wir treffen uns am Bahnhof.");
  });
  expect(within(progressHost).getByRole("status")).toHaveTextContent("1 of 3 required parts ready");

  rerender(
    <WorkbookSubmissionCaptureRuntime context={context} activeTab="submit" onChange={onChange} canOpenPart={canOpenPart} />
  );
  const checklist = screen.getByRole("region", { name: "Required parts" });
  expect(checklist).toHaveTextContent("1 of 3 required parts ready");
  expect(checklist).toHaveTextContent("TEIL 2 · Schreiben · Ready to review");
  expect(checklist).toHaveTextContent("TEIL 3 · Lesen · Still to do");
  fireEvent.click(within(checklist).getByRole("button", { name: "Open TEIL 3" }));
  expect(onChange).toHaveBeenCalledWith("lesen");
  expect(within(checklist).queryByRole("checkbox")).not.toBeInTheDocument();

  unmount();
  progressHost.remove();
  localStorage.clear();
});
