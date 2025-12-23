const PESWAS_PER_CEDI = 100;

const normalizeAmount = (amount) => {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;

  return Math.round(numeric * PESWAS_PER_CEDI);
};

const DEFAULT_PAYSTACK_HOSTS = ["paystack.com", "paystack.shop"];

const defaultRedirectOrigins = (() => {
  const fromEnv = process.env.REACT_APP_ALLOWED_REDIRECT_ORIGINS;
  if (fromEnv) return fromEnv.split(",").map((origin) => origin.trim()).filter(Boolean);

  if (typeof window !== "undefined" && window.location?.origin) {
    return [window.location.origin];
  }

  return [];
})();

const normalizeList = (values = []) => values.filter(Boolean).map((value) => value.toLowerCase());

const isAllowedHost = (hostname, allowedHosts = DEFAULT_PAYSTACK_HOSTS) => {
  const normalizedAllowedHosts = normalizeList(allowedHosts);
  const normalizedHostname = hostname.toLowerCase();

  return normalizedAllowedHosts.includes(normalizedHostname);
};

const isAllowedRedirect = (redirectUrl, allowedOrigins = defaultRedirectOrigins) => {
  if (!redirectUrl) return false;

  try {
    const { origin } = new URL(redirectUrl);
    const normalizedAllowedOrigins = normalizeList(allowedOrigins);

    return normalizedAllowedOrigins.includes(origin.toLowerCase());
  } catch (error) {
    console.error("Invalid redirect URL provided", error);
    return false;
  }
};

/**
 * Build a Paystack checkout link with dynamic amount and redirect.
 *
 * @param {Object} options
 * @param {string} options.baseLink - The base Paystack payment link.
 * @param {number|string} [options.amount] - Amount in Ghana cedis the user intends to pay.
 * @param {string} [options.redirectUrl] - URL to return to after payment.
 * @param {string[]} [options.allowedBaseHosts] - Allowed Paystack hostnames.
 * @param {string[]} [options.allowedRedirectOrigins] - Allowed origins for redirect URLs.
 * @returns {string} A URL string with optional query params, or an empty string when invalid.
 */
export const buildPaystackCheckoutLink = ({
  baseLink,
  amount,
  redirectUrl,
  allowedBaseHosts,
  allowedRedirectOrigins,
} = {}) => {
  if (!baseLink) return "";

  const baseHostAllowlist = allowedBaseHosts || DEFAULT_PAYSTACK_HOSTS;
  const redirectOriginAllowlist = allowedRedirectOrigins || defaultRedirectOrigins;

  try {
    const url = new URL(baseLink);
    const pesewasAmount = normalizeAmount(amount);

    if (!isAllowedHost(url.hostname, baseHostAllowlist)) {
      return "";
    }

    if (pesewasAmount) {
      url.searchParams.set("amount", String(pesewasAmount));
    }

    if (isAllowedRedirect(redirectUrl, redirectOriginAllowlist)) {
      url.searchParams.set("redirect_url", redirectUrl);
    }

    return url.toString();
  } catch (error) {
    console.error("Could not build Paystack link", error);
    return "";
  }
};
