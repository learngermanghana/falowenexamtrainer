import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import AppBackButton from "./AppBackButton";

const Location = () => <div data-testid="location">{useLocation().pathname}</div>;

describe("AppBackButton", () => {
  test("uses the fallback path when router history cannot go back", () => {
    window.history.replaceState({ idx: 0 }, "");
    render(
      <MemoryRouter initialEntries={["/lesson"]}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <Location />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Back to Course Book" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/campus/course");
  });

  test("calls an explicit onBack handler", () => {
    const onBack = jest.fn();
    render(
      <MemoryRouter>
        <AppBackButton onBack={onBack} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
