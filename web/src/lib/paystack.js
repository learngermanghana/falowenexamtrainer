const PESWAS_PER_CEDI = 100;

const normalizeAmount = (amount) => {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;

  return Math.round(numeric * PESWAS_PER_CEDI);
};

/**
 * Build a Paystack checkout link with dynamic amount and redirect.
 *
 * @param {Object} options
 * @param {string} options.baseLink - The base Paystack payment link.
 * @param {number|string} [options.amount] - Amount in Ghana cedis the user intends to pay.
 * @param {string} [options.redirectUrl] - URL to return to after payment.
 * @returns {string} A URL string with optional query params, or the base link when invalid.
 */
export const buildPaystackCheckoutLink = ({ baseLink, amount, redirectUrl } = {}) => {
  if (!baseLink) return "";

  try {
    const url = new URL(baseLink);
    const pesewasAmount = normalizeAmount(amount);

    if (pesewasAmount) {
      url.searchParams.set("amount", String(pesewasAmount));
    }

    if (redirectUrl) {
      url.searchParams.set("redirect_url", redirectUrl);
    }

    return url.toString();
  } catch (error) {
    console.error("Could not build Paystack link", error);
    return baseLink;
  }
};
