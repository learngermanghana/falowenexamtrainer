import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { registerOfflineServiceWorker } from "../serviceWorkerRegistration";
import RouteScopedBackgroundServices from "./RouteScopedBackgroundServices";

jest.mock("../serviceWorkerRegistration", () => ({
  registerOfflineServiceWorker: jest.fn(),
}));

const renderAt = (pathname) =>
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <RouteScopedBackgroundServices />
    </MemoryRouter>
  );

describe("RouteScopedBackgroundServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(["/signup", "/signup/", "/login", "/login/"])(
    "does not start the service worker on %s",
    async (pathname) => {
      renderAt(pathname);

      await waitFor(() =>
        expect(registerOfflineServiceWorker).not.toHaveBeenCalled()
      );
    }
  );

  it("starts the service worker after leaving public authentication", async () => {
    renderAt("/campus/course");

    await waitFor(() =>
      expect(registerOfflineServiceWorker).toHaveBeenCalledTimes(1)
    );
  });
});
