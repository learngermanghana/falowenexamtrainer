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

  it("keeps the German signup URL clean", async () => {
    renderAt("/signup?program=german");

    await waitFor(() => expect(screen.getByTestId("route")).toHaveTextContent(/^\/signup$/));
    expect(window.localStorage.getItem("falowen:signup-program")).toBe("german");
  });

  it("treats a direct signup URL as German even after a saved French choice", async () => {
    window.localStorage.setItem("falowen:signup-program", "french");
    renderAt("/signup");

    await waitFor(() => expect(screen.getByTestId("route")).toHaveTextContent(/^\/signup$/));
    expect(window.localStorage.getItem("falowen:signup-program")).toBe("german");
  });

  it("keeps French as the only programme query parameter", async () => {
    renderAt("/signup?program=french");

    await waitFor(() =>
      expect(screen.getByTestId("route")).toHaveTextContent("/signup?program=french")
    );
    expect(window.localStorage.getItem("falowen:signup-program")).toBe("french");
  });

  it("preserves other signup parameters while removing program=german", async () => {
    renderAt("/signup?program=german&class=berlin");

    await waitFor(() =>
      expect(screen.getByTestId("route")).toHaveTextContent("/signup?class=berlin")
    );
  });

  it("moves from login to the clean German signup route", async () => {
    window.localStorage.setItem("falowen:signup-program", "german");
    renderAt("/login", <button type="button">Create account</button>);

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(screen.getByTestId("route")).toHaveTextContent(/^\/signup$/));
  });

  it("opens the clean German route from the landing signup button", async () => {
    window.localStorage.setItem("falowen:signup-program", "german");
    renderAt(
      "/",
      <button type="button" className="falowen-home-primary">Start German</button>
    );

    fireEvent.click(screen.getByRole("button", { name: "Start German" }));

    await waitFor(() => expect(screen.getByTestId("route")).toHaveTextContent(/^\/signup$/));
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
