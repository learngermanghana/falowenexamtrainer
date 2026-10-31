import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SpeakingExamIntroPage from "./SpeakingExamIntroPage";

jest.mock("./navigation/AppBackButton", () => () => <span>Back to Course Book</span>);

describe("A1 Teil 3 object-card lesson", () => {
  test("uses everyday-object verbs instead of generic classroom-only prompts", () => {
    render(<SpeakingExamIntroPage />);
    expect(screen.getByRole("heading", { name: "Picture-card verbs you really need" })).toBeInTheDocument();

    [
      "Können Sie bitte die Flasche öffnen?",
      "Können Sie bitte die Tür schließen?",
      "Können Sie mir bitte den Bleistift geben?",
      "Können Sie mir bitte ein Glas Wasser bringen?",
      "Können Sie mir bitte den Stadtplan zeigen?",
      "Können Sie mir bitte einen Bleistift leihen?",
      "Können Sie bitte das Radio anmachen?",
      "Können Sie bitte das Radio ausmachen?",
      "Können Sie bitte einen Stuhl holen?",
      "Können Sie bitte das Formular unterschreiben?",
    ].forEach((request) => {
      expect(screen.getAllByText(request).length).toBeGreaterThan(0);
    });

    expect(screen.queryByText("Können Sie bitte langsamer sprechen?")).not.toBeInTheDocument();
    expect(screen.queryByText("Warten Sie bitte.")).not.toBeInTheDocument();
  });

  test("retains formal imperative examples and short reaction practice", () => {
    render(<SpeakingExamIntroPage />);
    expect(screen.getByText("Öffnen Sie bitte die Flasche.")).toBeInTheDocument();
    expect(screen.getByText("Machen Sie bitte das Radio aus.")).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Ask someone to open it/));
    expect(screen.getAllByText("Ja, gern.").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: /Five picture cards/ })).toBeInTheDocument();
  });
});
