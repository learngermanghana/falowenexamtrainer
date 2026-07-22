import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getA1RadioResource } from "../data/a1RadioResources";
import { getA1TeacherVideoResources } from "../data/a1TeacherVideoResources";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";
import { buildA1WorkbookVideoModel } from "./A1WorkbookVideoHeader";
import A1Day14ModalVerbsWorkbookPage, { isSharedA2Day17Context } from "./A1Day14ModalVerbsWorkbookPage";

const route = "/campus/course/modal-verbs-day-14-3-6";
const workbookRoute = `${route}?radio=done&materials=done`;

describe("A1 Day 14 modal verbs with separable verbs workbook", () => {
  test("shows the saved teacher lecture and AI lesson in the native materials step", () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`${route}?radio=done`]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    expect(container.querySelector('[data-self-learning-materials-selector="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Choose your learning material/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /Watch teacher video/i })).toHaveAttribute(
      "href",
      "https://youtu.be/GJw1aJehYHU",
    );
    expect(screen.getByRole("link", { name: /Watch AI video/i })).toHaveAttribute(
      "href",
      "https://youtu.be/Wkj1-TnNUxY",
    );
    expect(container.querySelector("iframe")).not.toBeInTheDocument();

    expect(getA1TeacherVideoResources(14)).toEqual([
      expect.objectContaining({
        chapter: "3.6",
        url: "https://youtu.be/GJw1aJehYHU",
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

    expect(departureSummary.closest("details")).toHaveAttribute("open");
    expect(ticketSummary.closest("details")).toHaveAttribute("open");
    expect(vocabularySummary.closest("details")).toHaveAttribute("open");
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
    expect(screen.getByRole("heading", { name: /A2 • 6\.17 In die Apotheke gehen/i })).toBeVisible();
    expect(screen.queryByRole("heading", { name: /A1 · Day 14 Workbook/i })).not.toBeInTheDocument();
  });

  test("scores and resets the separable-verb knowledge test", () => {
    render(
      <MemoryRouter initialEntries={[workbookRoute]}>
        <A1Day14ModalVerbsWorkbookPage />
      </MemoryRouter>,
    );

    const correctAnswer = screen.getByLabelText("ab-");
    fireEvent.click(correctAnswer);
    fireEvent.click(screen.getByRole("button", { name: /Check knowledge test/i }));

    expect(screen.getByRole("status")).toHaveTextContent("Score: 1 / 10");
    expect(screen.getByText(/The separable prefix in abfahren is ab-/i)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Reset test/i }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(correctAnswer).not.toBeChecked();
  });
});
