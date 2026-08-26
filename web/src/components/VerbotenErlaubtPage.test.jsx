import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VerbotenErlaubtPage from "./VerbotenErlaubtPage";

jest.mock("./A1ExamSpeakingPracticePanel", () => () => <div data-testid="a1-speaking-practice" />);

const renderPage = () => render(
  <MemoryRouter>
    <VerbotenErlaubtPage />
  </MemoryRouter>,
);

describe("VerbotenErlaubtPage A1 exam practice", () => {
  test("combines five picture rules with matching questions and exam choices", () => {
    renderPage();

    expect(document.querySelectorAll("[data-combined-rule-question]")).toHaveLength(5);
    expect(screen.getByRole("img", { name: "water is allowed" })).toBeVisible();
    expect(screen.getByRole("img", { name: "food is forbidden" })).toBeVisible();
    expect(screen.getByText("Im Kursraum darfst du nicht essen.")).toBeVisible();
    expect(screen.getByText("Darf Kojo im Kursraum essen?")).toBeVisible();
    expect(screen.getByText("Im Unterricht darfst du nicht telefonieren.")).toBeVisible();
    expect(screen.getByText("Darf Yaw im Unterricht telefonieren?")).toBeVisible();
    expect(screen.getByText("Im Computerraum darfst du Deutsch üben.")).toBeVisible();
    expect(screen.queryAllByLabelText("Erlaubt")).toHaveLength(0);
    expect(screen.queryAllByLabelText("Verboten")).toHaveLength(0);
    expect(screen.getAllByRole("button", { name: "Erlaubt" })).toHaveLength(5);
    expect(screen.getAllByRole("button", { name: "Verboten" })).toHaveLength(5);
  });

  test("teaches both rule patterns and the full dürfen conjugation", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Erlaubt oder verboten?" })).toBeVisible();
    expect(screen.getByText("Rauchen ist verboten.")).toBeVisible();
    expect(screen.getByText(/Man darf hier nicht rauchen/)).toBeVisible();
    expect(screen.getByText("Das Fotografieren ist erlaubt.")).toBeVisible();
    expect(screen.getByText("= Man darf hier fotografieren.")).toBeVisible();
    expect(screen.getByText("Dürfen is a modal verb")).toBeVisible();
    expect(screen.getByText("darfst")).toBeVisible();
    expect(screen.getByText("dürft")).toBeVisible();
    expect(screen.getByText("Wir dürfen hier Deutsch lernen.")).toBeVisible();
    expect(screen.getByText("Sie dürfen hier parken.")).toBeVisible();
    expect(screen.getByText(/Both mean the same thing/)).toBeVisible();
  });

  test("exam mode hides translations, badges and instant explanations", () => {
    renderPage();

    expect(screen.getByText("You may drink water in class.")).toBeVisible();
    expect(screen.getByText(/In the real exam there is no translation/)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Start Exam Mode" }));

    expect(screen.queryByText("You may drink water in class.")).not.toBeInTheDocument();
    expect(screen.queryByText("Im Unterricht darfst du Wasser trinken.")).not.toBeInTheDocument();
    expect(screen.queryAllByLabelText("Erlaubt")).toHaveLength(0);
    expect(screen.getByLabelText("Exam mode timer")).toHaveTextContent("01:00");

    fireEvent.click(screen.getAllByRole("button", { name: "Erlaubt" })[0]);
    expect(screen.queryByText(/Richtig\./)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Finish exam" }));
    expect(screen.getByText(/Richtig\./)).toBeVisible();
    expect(screen.getByText(/Ama darf im Unterricht Wasser trinken/)).toBeVisible();
  });

  test("Teil 2 requires an attempt before revealing the model", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Ask first, then reveal the model" })).toBeVisible();
    expect(screen.getByText("THEMA: Getränke")).toBeVisible();
    expect(screen.getAllByText("KEYWORD")).toHaveLength(4);
    expect(screen.queryByText("Was trinken Sie im Unterricht?")).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Show model question and answer" })[0]);

    expect(screen.getByText("Was trinken Sie im Unterricht?")).toBeVisible();
    expect(screen.getByText("Ich trinke im Unterricht Wasser.")).toBeVisible();
  });

  test("Teil 3 uses picture cards and reveals the request after the attempt", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Use the picture, then reveal the model" })).toBeVisible();
    expect(screen.getByRole("img", { name: "glass of water" })).toBeVisible();
    expect(screen.getByRole("img", { name: "mobile phone" })).toBeVisible();
    expect(screen.getByRole("img", { name: "window" })).toBeVisible();
    expect(screen.getByRole("img", { name: "no smoking sign" })).toBeVisible();
    expect(screen.queryByText("Können Sie mir bitte Wasser geben?")).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Show request and reaction" })[0]);

    expect(screen.getByText("Können Sie mir bitte Wasser geben?")).toBeVisible();
    expect(screen.getByText("Ja, gern.")).toBeVisible();
  });
});
