export const formatNumber = (value, { locale } = {}) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "";
  return new Intl.NumberFormat(locale).format(numeric);
};

export const formatCurrency = (
  value,
  {
    locale,
    currency = "GHS",
    currencyDisplay = "narrowSymbol",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = {}
) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "–";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numeric);
};

export const formatPercent = (value, { locale, maximumFractionDigits = 0 } = {}) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "";
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits,
  }).format(numeric);
};
