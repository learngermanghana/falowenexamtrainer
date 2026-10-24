const { registerPublicFxRoutes, validRate, normalizeRate, DAY_MS } = require("../publicFxRates");

describe("Falowen display-only currency rates", () => {
  test("rejects unusable quotes and normalizes valid cached rates", () => {
    expect(validRate(-1)).toBeNull();
    expect(validRate(0)).toBeNull();
    expect(validRate("NaN")).toBeNull();
    expect(validRate(11.7)).toBe(11.7);
    const normalized = normalizeRate({ usdToGhs: 11.7, fetchedAtMs: 1720000000000 });
    expect(normalized.ghsToUsd).toBeCloseTo(1/11.7);
    expect(normalized.refreshCadence).toBe("daily");
  });

  const makeRoute = (initial) => {
    let state = { ...initial };
    let calls = 0;
    const ref = {
      get: async () => ({ data: () => state }),
      set: async (update) => { state = { ...state, ...update }; },
    };
    const db = {
      doc: () => ref,
      runTransaction: async (fn) => fn({
        get: async () => ({ data: () => state }),
        set: (_ref, update) => { state = { ...state, ...update }; },
      }),
    };
    const registered = {};
    registerPublicFxRoutes({ get: (route, handler) => { registered[route] = handler; } },
      { admin: { firestore: Object.assign(() => db, { FieldValue: { serverTimestamp: () => "timestamp" } }) } });
    const call = async () => {
      const result = { status:200, headers:{} };
      await registered["/fx/usd-ghs"]({}, {
        set: (key, value) => { result.headers[key] = value; },
        status: (n) => { result.status = n; return { json:(json) => { result.json = json; } }; },
        json: (json) => { result.json = json; },
      });
      return result;
    };
    return { call, getState:()=>state, calls:()=>calls };
  };

  test("serves cached quote without contacting upstream", async () => {
    const cached = makeRoute({ usdToGhs: 12, fetchedAtMs: Date.now()-DAY_MS/2 });
    const result = await cached.call();
    expect(result.json).toMatchObject({ usdToGhs:12, stale:false, displayOnly:true });
    expect(result.json.ghsToUsd).toBeCloseTo(1/12);
    expect(result.json).not.toHaveProperty("fetchedAtMs");
  });
  test("keeps old rate if refresh already in progress", async () => {
    const cached = makeRoute({ usdToGhs: 12, fetchedAtMs: Date.now()-2*DAY_MS, refreshLeaseUntil:Date.now()+30000 });
    const result = await cached.call();
    expect(result.status).toBe(200);
    expect(result.json).toMatchObject({ usdToGhs:12, stale:true });
  });
  test("without a quote and during refresh, returns 503 rather than inventing USD", async () => {
    const cached = makeRoute({ refreshLeaseUntil:Date.now()+30000 });
    const result = await cached.call();
    expect(result.status).toBe(503);
    expect(result.json.error).toMatch(/USD estimate/);
  });
});
