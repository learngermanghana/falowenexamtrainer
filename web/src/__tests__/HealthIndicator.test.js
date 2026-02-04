import { render, screen, waitFor } from "@testing-library/react";
import HealthIndicator from "../components/HealthIndicator";

const originalEnv = process.env.REACT_APP_BACKEND_URL;

describe("HealthIndicator", () => {
  beforeEach(() => {
    process.env.REACT_APP_BACKEND_URL = "https://api-awc2au65xa-ew.a.run.app";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env.REACT_APP_BACKEND_URL = originalEnv;
    delete global.fetch;
  });

  it("renders the online state when the API responds", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: "ok" }),
    });

    render(<HealthIndicator />);

    await waitFor(() => expect(screen.getByText(/API online/i)).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api-awc2au65xa-ew.a.run.app/health"
    );
  });

  it("shows offline when the request fails", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    render(<HealthIndicator />);

    await waitFor(() => expect(screen.getByText(/API offline/i)).toBeInTheDocument());
  });
});
