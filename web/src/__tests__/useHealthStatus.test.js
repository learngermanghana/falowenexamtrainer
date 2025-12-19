import { renderHook, waitFor } from "@testing-library/react";
import { useHealthStatus } from "../hooks/useHealthStatus";

describe("useHealthStatus", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    delete global.fetch;
  });

  it("reports ok when the API responds", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: "ok", timestamp: "2024-01-01T00:00:00.000Z" }),
    });

    const { result } = renderHook(() => useHealthStatus({ pollIntervalMs: null }));

    await waitFor(() => expect(result.current.status).toBe("ok"));
    expect(result.current.lastChecked).toBe("2024-01-01T00:00:00.000Z");
  });

  it("falls back to offline when the request fails", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useHealthStatus({ pollIntervalMs: null }));

    await waitFor(() => expect(result.current.status).toBe("offline"));
  });
});
