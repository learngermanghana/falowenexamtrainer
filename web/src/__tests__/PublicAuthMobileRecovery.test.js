import "@testing-library/jest-dom";
import { cleanup, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PublicAuthMobileRecovery from "../components/PublicAuthMobileRecovery";

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <PublicAuthMobileRecovery />
    </MemoryRouter>
  );

describe("PublicAuthMobileRecovery", () => {
  const originalCaches = window.caches;
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    window.scrollTo = jest.fn();
    window.requestAnimationFrame = jest.fn((callback) => {
      callback();
      return 1;
    });
    window.cancelAnimationFrame = jest.fn();
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    Object.defineProperty(window, "caches", {
      configurable: true,
      value: originalCaches,
    });
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
    window.scrollTo = originalScrollTo;
  });

  it("resets the viewport and removes cached signup responses", async () => {
    const deleteRequest = jest.fn().mockResolvedValue(true);
    const cache = {
      keys: jest.fn().mockResolvedValue([
        new Request("https://www.falowen.app/signup?program=german"),
        new Request("https://www.falowen.app/logo192.png"),
      ]),
      delete: deleteRequest,
    };

    Object.defineProperty(window, "caches", {
      configurable: true,
      value: {
        keys: jest.fn().mockResolvedValue(["falowen-offline"]),
        open: jest.fn().mockResolvedValue(cache),
      },
    });

    renderAt("/signup?program=german");

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "auto",
    });
    await waitFor(() => expect(deleteRequest).toHaveBeenCalledTimes(1));
    expect(deleteRequest.mock.calls[0][0].url).toContain("/signup?program=german");
  });

  it("does nothing on a non-auth route", () => {
    renderAt("/");

    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });
});
