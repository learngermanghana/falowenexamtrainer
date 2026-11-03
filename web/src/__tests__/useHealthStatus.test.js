import { act, renderHook, waitFor } from "@testing-library/react";
import { useHealthStatus, __resetHealthCacheForTests } from "../hooks/useHealthStatus";

describe("useHealthStatus", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    __resetHealthCacheForTests();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    __resetHealthCacheForTests();
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
  it("reuses a recent successful probe when the student header remounts", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ timestamp: "2026-11-03T18:00:00.000Z" }),
    });
    const options = { pollIntervalMs: 0, reuseSuccessMs: 15 * 60 * 1000 };
    const first = renderHook(() => useHealthStatus(options));
    await waitFor(() => expect(first.result.current.status).toBe("ok"));
    first.unmount();

    const second = renderHook(() => useHealthStatus(options));
    await waitFor(() => expect(second.result.current.status).toBe("ok"));
    expect(second.result.current.lastChecked).toBe("2026-11-03T18:00:00.000Z");
    expect(global.fetch).toHaveBeenCalledTimes(1);
    second.unmount();
  });

});
