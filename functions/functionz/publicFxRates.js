"use strict";

// One shared daily USD/GHS quote for Falowen pricing displays.
// GHS prices and Paystack transactions remain authoritative.
const FX_DOC = "systemConfig/falowenPublicUsdGhs";
const FX_SOURCE = "https://open.er-api.com/v6/latest/USD";
const DAY_MS = 24 * 60 * 60 * 1000;
const LOCK_MS = 60 * 1000;
const MAX_FALLBACK_AGE_MS = 30 * DAY_MS;

const validRate = value => {
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 && rate < 10000 ? rate : null;
};
const normalizeRate = data => {
  const usdToGhs = validRate(data?.usdToGhs);
  const fetchedAtMs = Number(data?.fetchedAtMs);
  if (!usdToGhs || !Number.isFinite(fetchedAtMs) || fetchedAtMs <= 0) return null;
  return {
    baseCurrency: "USD",
    quoteCurrency: "GHS",
    usdToGhs,
    ghsToUsd: 1 / usdToGhs,
    fetchedAt: new Date(fetchedAtMs).toISOString(),
    fetchedAtMs,
    provider: "ExchangeRate-API",
    refreshCadence: "daily",
    providerUpdatedAt: data?.providerUpdatedAt || null,
  };
};
const formatPublicRate = (rate, stale) => {
  const { fetchedAtMs, ...publicRate } = rate;
  return { ...publicRate, stale: Boolean(stale), displayOnly: true };
};

function registerPublicFxRoutes(app, { admin }) {
  app.get("/fx/usd-ghs", async (_req, res) => {
    res.set("Cache-Control", "public, s-maxage=3600, max-age=300, stale-while-revalidate=3600");
    const ref = admin.firestore().doc(FX_DOC);
    const now = Date.now();
    try {
      const initial = await ref.get();
      const cached = normalizeRate(initial.data());
      if (cached && now - cached.fetchedAtMs < DAY_MS) {
        return res.json(formatPublicRate(cached, false));
      }

      let acquired = false;
      await admin.firestore().runTransaction(async tx => {
        const snapshot = await tx.get(ref);
        const current = normalizeRate(snapshot.data());
        const leaseUntil = Number(snapshot.data()?.refreshLeaseUntil || 0);
        if (current && now - current.fetchedAtMs < DAY_MS) return;
        if (leaseUntil > now) return;
        tx.set(ref, { refreshLeaseUntil: now + LOCK_MS }, { merge: true });
        acquired = true;
      });

      if (acquired) {
        try {
          const response = await fetch(FX_SOURCE, {
            headers: { Accept: "application/json", "User-Agent": "Falowen/1.0 pricing-rate-cache" },
            signal: AbortSignal.timeout(10000),
          });
          if (!response.ok) throw new Error("FX upstream returned " + response.status);
          const payload = await response.json();
          const usdToGhs = validRate(payload?.rates?.GHS);
          if (payload?.result !== "success" || !usdToGhs) throw new Error("Invalid rate response");
          const fetchedAtMs = Date.now();
          const providerUpdatedAt = Number(payload.time_last_update_unix) > 0
            ? new Date(Number(payload.time_last_update_unix) * 1000).toISOString()
            : null;
          await ref.set({ usdToGhs, fetchedAtMs, providerUpdatedAt, refreshLeaseUntil: 0,
            provider: "ExchangeRate-API", refreshCadence: "daily",
            lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
          const fresh = normalizeRate({ usdToGhs, fetchedAtMs, providerUpdatedAt });
          return res.json(formatPublicRate(fresh, false));
        } catch (error) {
          console.warn("Falowen FX rate update failed; retaining previous quote", String(error?.message || error));
          await ref.set({ refreshLeaseUntil: 0 }, { merge: true }).catch(() => {});
        }
      }

      if (cached && now - cached.fetchedAtMs < MAX_FALLBACK_AGE_MS) {
        res.set("Cache-Control", "public, s-maxage=60, max-age=60");
        return res.json(formatPublicRate(cached, true));
      }
      res.set("Cache-Control", "no-store");
      return res.status(503).json({ error: "USD estimate temporarily unavailable. GHS pricing is unchanged." });
    } catch (error) {
      console.error("Falowen public rate cache unavailable", error);
      return res.status(503).json({ error: "USD estimate temporarily unavailable. GHS pricing is unchanged." });
    }
  });
}
module.exports = { registerPublicFxRoutes, validRate, normalizeRate, FX_DOC, DAY_MS };
