import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import PublicAuthRouteBridge from "../components/PublicAuthRouteBridge";

const RouteProbe = () => {
  const location = useLocation();
  return <output data-testid="route">{`${location.pathname}${location.search}`}</output>;
};

const renderAt = (initialEntry, child = null) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <PublicAuthRouteBridge />
      {child}
      <RouteProbe />
    </MemoryRouter>
  );

describe("PublicAuthRouteBridge", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("canonicalizes the standalone login route", async () => {
    renderAt("/login/");

    await waitFor(() => expect(screen.getByTestId("route")).toHaveTextContent("/login"));
  });

  it("adds the saved programme to a direct signup URL", async () => {
    window.localStorage.setItem("falowen:signup-program", "french");
    renderAt("/signup");

    await waitFor(() =>
      expect(screen.getByTestId("route")).toHaveTextContent("/signup?program=french")
    );
  });

  it("moves from login to the standalone signup route", async () => {
    window.localStorage.setItem("falowen:signup-program", "german");
    renderAt("/login", <button type="button">Create account</button>);

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() =>
      expect(screen.getByTestId("route")).toHaveTextContent("/signup?program=german")
    );
  });

  it("moves from signup to the standalone login route", async () => {
    renderAt("/signup?program=french", <button type="button">Go to login</button>);

    fireEvent.click(screen.getByRole("button", { name: "Go to login" }));

    await waitFor(() => expect(screen.getByTestId("route")).toHaveTextContent("/login"));
  });

  it("returns to the homepage from a public auth back button", async () => {
    renderAt("/login", <button type="button">Back to overview</button>);

    fireEvent.click(screen.getByRole("button", { name: "Back to overview" }));

    await waitFor(() => expect(screen.getByTestId("route")).toHaveTextContent(/^\/$/));
  });
});
