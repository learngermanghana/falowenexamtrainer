import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ReadingTranslationText from "./ReadingTranslationText";

describe("tap-to-translate reading vocabulary", () => {
  test("opens English meaning on tap and closes with Escape", () => {
    render(<ReadingTranslationText level="A2" day={1} text="In der Mittagspause trinken wir Kaffee." />);
    const trigger = screen.getByRole("button", { name: "English meaning for Mittagspause" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(screen.getByRole("note")).toHaveTextContent("lunch break");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  test("can dismiss the meaning by tapping elsewhere", () => {
    render(<ReadingTranslationText level="B1" day={26} text="Die Wohnung gibt es zur Zwischenmiete." />);
    fireEvent.click(screen.getByRole("button", { name: "English meaning for Zwischenmiete" }));
    expect(screen.getByRole("note")).toHaveTextContent("short-term sublet");
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  test("renders ordinary German text without creating buttons", () => {
    render(<ReadingTranslationText level="A2" day={1} text="Ein einfacher Satz." />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Ein einfacher Satz.")).toBeInTheDocument();
  });
});
