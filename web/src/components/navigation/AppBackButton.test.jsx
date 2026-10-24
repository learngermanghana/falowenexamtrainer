import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import AppBackButton from "./AppBackButton";

const Location = () => {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
};

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

  test("returns a dynamic B1 workbook URL directly to its lesson hub", () => {
    window.history.replaceState({ idx: 0 }, "");
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/lesson/B1/7?view=workbook&assignmentKey=B1-3.7&assignmentId=B1-3.7&level=B1&radio=done",
        ]}
      >
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <Location />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Back to Course Book" }));
    expect(screen.getByTestId("location")).toHaveTextContent("/campus/course/lesson/B1/7");
    expect(screen.getByTestId("location")).not.toHaveTextContent("view=workbook");
  });

  test("preserves chapter context when leaving a dynamic workbook view", () => {
    window.history.replaceState({ idx: 0 }, "");
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/lesson/C1/12?chapter=3.2&view=workbook&assignmentKey=C1-3.2",
        ]}
      >
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <Location />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Back to Course Book" }));
    expect(screen.getByTestId("location")).toHaveTextContent(
      "/campus/course/lesson/C1/12?chapter=3.2"
    );
    expect(screen.getByTestId("location")).not.toHaveTextContent("view=workbook");
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
