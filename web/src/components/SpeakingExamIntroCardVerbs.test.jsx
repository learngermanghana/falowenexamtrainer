import React from "react";
import { render, screen } from "@testing-library/react";
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

  test("removes repetitive practice blocks but keeps reaction models and compact object pictures", () => {
    render(<SpeakingExamIntroPage />);

    expect(screen.getByText("Öffnen Sie bitte die Flasche.")).toBeInTheDocument();
    expect(screen.getByText("Machen Sie bitte das Radio aus.")).toBeInTheDocument();
    expect(screen.getAllByText("Ja, gern.").length).toBeGreaterThan(0);

    expect(screen.queryByRole("heading", { name: "Look at the object, make the request, react" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Five picture cards — no models" })).not.toBeInTheDocument();

    const pictures = screen.getAllByRole("img", { name: /picture$/ });
    expect(pictures).toHaveLength(10);
    expect(screen.getByRole("img", { name: "Flasche picture" })).toHaveAttribute("width", "50");
    expect(screen.getAllByRole("img", { name: "Radio picture" })).toHaveLength(2);

    expect(screen.getByRole("heading", { name: "Introduction to the speaking exam" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open official Goethe A1 speaking practice" })).toBeInTheDocument();
  });
});
