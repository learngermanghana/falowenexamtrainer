import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getA1RadioResource } from "../data/a1RadioResources";
import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";
import { buildA1WorkbookVideoModel } from "./A1WorkbookVideoHeader";
import A1Day14ModalVerbsWorkbookPage, { isSharedA2Day17Context } from "./A1Day14ModalVerbsWorkbookPage";

const route = "/campus/course/modal-verbs-day-14-3-6";
const workbookRoute = `${route}?radio=done&materials=done`;

describe("A1 Day 14 modal verbs with separable verbs workbook", () => {
  test("opens the workbook directly after Falowen Radio and keeps the canonical lesson resources", () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`${route}?radio=done`]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    expect(container.querySelector('[data-self-learning-materials-selector="true"]')).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Modal Verbs with Separable Verbs/i })).toBeVisible();

    expect(getA1TeacherVideoResources(14)).toEqual([
      expect.objectContaining({
        chapter: "3.6",
        url: "https://youtu.be/0zps4OYwShg",
      }),
    ]);

    expect(buildA1WorkbookVideoModel({ pathname: route })).toEqual(
      expect.objectContaining({
        lessonId: "A1-3.6",
        assessmentLabel: "Self-practice",
        youtubeId: "Wkj1-TnNUxY",
      }),
    );
  });

  test("maps the Day 14 chapter to the requested Falowen Radio-first flow", () => {
    expect(getA1RadioResource(14, "3.6")).toEqual(
      expect.objectContaining({
        key: "a1-day14-modal-verbs-separable-verbs-falowen-radio",
        chapter: "3.6",
        youtubeId: "GeHygJE7Hww",
      }),
    );
    expect(resolveA1RadioFirstWorkbookRoute(route, "")).toEqual({ day: 14, chapter: "3.6" });
  });

  test("explains normal and separable main verbs and keeps train resources visible", () => {
    render(
      <MemoryRouter initialEntries={[workbookRoute]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Modal Verbs with Separable Verbs/i })).toBeVisible();
    expect(screen.getByRole("combobox", { name: /Choose modal verb to review/i })).toBeVisible();
    fireEvent.change(screen.getByRole("combobox", { name: /Choose modal verb to review/i }), { target: { value: "müssen" } });
    expect(screen.getByText("musst")).toBeVisible();
    fireEvent.click(screen.getByText("Show complete conjugation table (optional)"));
    expect(screen.getByRole("table", { name: /Modal verb conjugation table/i })).toBeVisible();
    expect(document.body).toHaveTextContent("Subject + conjugated modal verb + details + main verb in the infinitive form");
    expect(document.body).toHaveTextContent("Normal main verb: kaufen · to buy");
    expect(document.body).toHaveTextContent("Separable main verb: ab|fahren · to depart");
    expect(document.body).toHaveTextContent("Ich möchte eine Fahrkarte kaufen.");
    expect(document.body).toHaveTextContent("Der Zug muss um 14:20 Uhr abfahren.");
    expect(document.body).toHaveTextContent("The train has to depart at 2:20 p.m.");
    expect(document.body).toHaveTextContent("We would like to travel back on Sunday.");
    expect(screen.queryByRole("heading", { name: /Practical application · Eine Fahrkarte buchen/i })).not.toBeInTheDocument();

    const departureSummary = screen.getByText("Departure board · Die Abfahrtstafel");
    const ticketSummary = screen.getByText("Ticket · Die Fahrkarte");
    const vocabularySummary = screen.getByText("Vocabulary · Wortschatz");

    expect(departureSummary.closest("details")).not.toHaveAttribute("open");
    expect(ticketSummary.closest("details")).not.toHaveAttribute("open");
    expect(vocabularySummary.closest("details")).not.toHaveAttribute("open");
    fireEvent.click(departureSummary);
    fireEvent.click(ticketSummary);
    expect(screen.getByLabelText("German train departure board")).toBeVisible();
    expect(screen.getByLabelText("Example German train ticket")).toBeVisible();
  });

  test("bypasses A1 materials and opens A2 Day 17 immediately in its shared query context", () => {
    const sharedRoute = `${route}?level=A2&day=17&radio=done`;
    expect(isSharedA2Day17Context("?level=A2&day=17&radio=done")).toBe(true);

    const { container } = render(
      <MemoryRouter initialEntries={[sharedRoute]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    expect(container.querySelector('[data-self-learning-materials-selector="true"]')).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /A2 Day 17 · In die Apotheke gehen/i })).toBeVisible();
    expect(screen.queryByRole("heading", { name: /A1 · Day 14 Workbook/i })).not.toBeInTheDocument();
  });


  test("requires all ten knowledge answers, reports grammar and reading scores, and resets", () => {
    const { container } = render(
      <MemoryRouter initialEntries={[workbookRoute]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    const check = screen.getByRole("button", { name: /Check knowledge test/i });
    expect(check).toBeDisabled();
    const section = check.closest("section");
    const questions = section.querySelectorAll("fieldset");
    expect(questions).toHaveLength(10);
    fireEvent.click(screen.getByLabelText("ab-"));
    expect(section).toHaveTextContent("1 of 10 questions answered");
    expect(check).toBeDisabled();
    questions.forEach((fieldset) => {
      const first = fieldset.querySelector('input[type="radio"]');
      if (first && !first.checked) fireEvent.click(first);
    });
    expect(check).toBeEnabled();
    fireEvent.click(check);
    expect(section).toHaveTextContent("Score: 8 / 10");
    expect(section).toHaveTextContent("Grammar: 8 / 8");
    expect(section).toHaveTextContent("Reading: 0 / 2");

    fireEvent.click(screen.getByRole("button", { name: /Reset test/i }));
    expect(check).toBeDisabled();
    expect(section).toHaveTextContent("0 of 10 questions answered");
  });

  test("guides students, checks independent sentences and handles punctuation", () => {
    render(
      <MemoryRouter initialEntries={[workbookRoute]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );
    const guided = screen.getByRole("group", { name: /Step 1:/ });
    fireEvent.click(within(guided).getByRole("button", { name: "müssen" }));
    expect(within(guided).getByText(/Correct!/)).toBeVisible();

    const check = screen.getByRole("button", { name: /Check my sentences/i });
    expect(check).toBeDisabled();
    const values = [
      "der zug muss um 14:20 uhr abfahren",
      "Wir müssen in Hannover umsteigen.",
      "Die Fahrgäste dürfen jetzt einsteigen.",
      "Ich muss am Hauptbahnhof aussteigen.",
      "Wir möchten am Sonntag zurückfahren.",
    ];
    values.forEach((value, index) => {
      fireEvent.change(screen.getByRole("textbox", { name: "Rewrite sentence " + (index + 1) }), { target: { value } });
    });
    expect(check).toBeEnabled();
    fireEvent.click(check);
    expect(screen.getByText(/5 of 5 example answers matched/)).toBeVisible();
    fireEvent.change(screen.getByRole("textbox", { name: "Rewrite sentence 3" }), { target: { value: "Die Fahrgäste darf einsteigen" } });
    expect(screen.queryByText(/5 of 5 example answers matched/)).not.toBeInTheDocument();
  });

  test("checks realistic train-reading answers and compares an exit check locally", () => {
    render(
      <MemoryRouter initialEntries={[workbookRoute]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );
    const readingCheck = screen.getByRole("button", { name: /Check reading answers/i });
    expect(readingCheck).toBeDisabled();
    ["Gleis 12", "14:45 Uhr", "Wagen 6, Sitz 42", "Nein, die Verbindung ist direkt."].forEach((answer) => {
      fireEvent.click(screen.getByLabelText(answer));
    });
    fireEvent.click(readingCheck);
    expect(screen.getByText(/Reading practice: 4 \/ 4/)).toBeVisible();

    const exitCheck = screen.getByRole("button", { name: /Compare my exit check/i });
    expect(exitCheck).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/1\. Der Zug fährt um 14:20 Uhr ab. Rewrite with müssen/i), {
      target: { value: "Der Zug muss um 14:20 Uhr abfahren." },
    });
    fireEvent.change(screen.getByLabelText(/2\. Ich steige am Hauptbahnhof aus. Rewrite with müssen/i), {
      target: { value: "Ich muss am Hauptbahnhof aussteigen." },
    });
    fireEvent.change(screen.getByLabelText(/3\. Explain: What happens to the separable prefix/i), {
      target: { value: "The whole infinitive stays together at the end." },
    });
    expect(exitCheck).toBeEnabled();
    fireEvent.click(exitCheck);
    expect(screen.getByText(/Sentence examples matched: 2 \/ 2/)).toBeVisible();
  });

});
