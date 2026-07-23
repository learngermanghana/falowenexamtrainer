import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import A1RadioFirstWorkbookRoutes from "./A1RadioFirstWorkbookRoutes";

const LocationProbe = () => {
  const location = useLocation();
  return <output data-testid="location-search">{location.search}</output>;
};

describe("A1 native self-learning materials route gate", () => {
  test("Day 5 radio completion opens the standard materials page before the workbook", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook?radio=done",
        ]}
      >
        <A1RadioFirstWorkbookRoutes />
        <LocationProbe />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: /Choose your learning material/i })).toBeVisible();
    expect(screen.getByText(/Introducing Yourself and Articles · Kapitel 1.3/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /Open self-learning workbook/i })).toBeVisible();
    expect(document.querySelector('[data-a1-self-learning-materials-route="true"]')).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Open self-learning workbook/i }));

    await waitFor(() => {
      expect(screen.getByTestId("location-search")).toHaveTextContent("materials=done");
    });
    expect(screen.queryByRole("heading", { name: /Choose your learning material/i })).not.toBeInTheDocument();
  });

  test("materials=done bypasses the materials page", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook?radio=done&materials=done",
        ]}
      >
        <A1RadioFirstWorkbookRoutes />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("heading", { name: /Choose your learning material/i })).not.toBeInTheDocument();
    expect(document.querySelector('[data-a1-self-learning-materials-route="true"]')).not.toBeInTheDocument();
  });
});
