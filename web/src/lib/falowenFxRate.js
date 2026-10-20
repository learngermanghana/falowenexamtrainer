import { useEffect, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";

let ratePromise = null;
let quoteLoadedAt = 0;
const RATE_CLIENT_TTL_MS = 60 * 60 * 1000;

// One in-memory request per page session/hour; server caches the quote for a day.
export const fetchFalowenUsdGhsRate = () => {
  if (typeof fetch !== "function") return Promise.reject(new Error("FX API unavailable"));
  if (!ratePromise || Date.now() - quoteLoadedAt > RATE_CLIENT_TTL_MS) {
    quoteLoadedAt = Date.now();
    ratePromise = fetch(`${getBackendUrl()}/fx/usd-ghs`)
      .then(async response => {
        if (!response.ok) throw new Error("FX quote unavailable");
        const quote = await response.json();
        if (!Number.isFinite(Number(quote?.usdToGhs)) || Number(quote.usdToGhs) <= 0)
          throw new Error("FX quote invalid");
        return quote;
      }).catch(error => {
        ratePromise = null;
        throw error;
      });
  }
  return ratePromise;
};

export const useFalowenUsdGhsRate = () => {
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    let active = true;
    fetchFalowenUsdGhsRate().then(rate => { if (active) setQuote(rate); }).catch(() => {});
    return () => { active = false; };
  }, []);
  return quote;
};

export const approximateUsd = (ghs, quote) => {
  const value = Number(ghs);
  const rate = Number(quote?.usdToGhs);
  if (!Number.isFinite(value) || value < 0 || !Number.isFinite(rate) || rate <= 0) return null;
  return "$" + (value / rate).toLocaleString("en-US", {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
};
