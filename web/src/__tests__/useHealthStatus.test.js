import { act, renderHook, waitFor } from "@testing-library/react";
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

  it("does not call the backend when passive checks are disabled; explicit refresh still works", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ timestamp: "2024-01-01T00:00:00.000Z" }) });
    const { result } = renderHook(() => useHealthStatus({ autoCheck: false }));
    expect(result.current.status).toBe("idle");
    await act(async () => { jest.advanceTimersByTime(60000); });
    expect(global.fetch).not.toHaveBeenCalled();
    await act(async () => { await result.current.refresh(); });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("ok");
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

  it("retries a transient failure and recovers without continuous polling", async () => {
    global.fetch
      .mockRejectedValueOnce(new Error("Temporary network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "ok", timestamp: "2024-01-01T00:00:03.000Z" }),
      });

    const { result } = renderHook(() => useHealthStatus({ pollIntervalMs: null }));

    await waitFor(() => expect(result.current.status).toBe("retrying"));
    expect(global.fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(3000);
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.status).toBe("ok"));
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result.current.lastChecked).toBe("2024-01-01T00:00:03.000Z");
  });

  it("reports offline only after the short retry window is exhausted", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useHealthStatus({ pollIntervalMs: null }));

    await waitFor(() => expect(result.current.status).toBe("retrying"));

    await act(async () => {
      jest.advanceTimersByTime(3000);
      await Promise.resolve();
    });

    await act(async () => {
      jest.advanceTimersByTime(10000);
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.status).toBe("offline"));
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
