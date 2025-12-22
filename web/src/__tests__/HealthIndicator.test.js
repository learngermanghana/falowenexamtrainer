import { render, screen, waitFor } from "@testing-library/react";
import HealthIndicator from "../components/HealthIndicator";

const originalEnv = process.env.REACT_APP_API_BASE;

describe("HealthIndicator", () => {
  beforeEach(() => {
    process.env.REACT_APP_API_BASE = "";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env.REACT_APP_API_BASE = originalEnv;
    delete global.fetch;
  });

  it("renders the online state when the API responds", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: "ok" }),
    });

    render(<HealthIndicator />);

    await waitFor(() => expect(screen.getByText(/API online/i)).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith("/api/health");
  });

  it("shows offline when the request fails", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    render(<HealthIndicator />);

    await waitFor(() => expect(screen.getByText(/API offline/i)).toBeInTheDocument());
  });
});
