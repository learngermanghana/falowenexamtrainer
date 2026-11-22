// Static ISO 3166-1 alpha-2 country/territory codes.
// No remote API, paid country database or runtime request is needed.
const COUNTRY_CODES = `
AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW
`.trim().split(/\s+/);

export const isValidCountryCode = (value) =>
  COUNTRY_CODES.includes(String(value || "").trim().toUpperCase());

export const getCountryName = (code, locale = "en") => {
  const normalized = String(code || "").trim().toUpperCase();
  if (!isValidCountryCode(normalized)) return "";
  try {
    const display = new Intl.DisplayNames([locale, "en"], { type: "region" });
    return display.of(normalized) || normalized;
  } catch {
    return normalized;
  }
};

export const getCountryOptions = (locale = "en") => {
  const collator = new Intl.Collator(locale, { sensitivity: "base" });
  const values = COUNTRY_CODES.map(code => ({ code, label: getCountryName(code, locale) }));
  // Country of residence is a deliberate choice; Ghana is simply easy to find.
  return [
    { code: "GH", label: getCountryName("GH", locale) },
    ...values.filter(item => item.code !== "GH").sort((a, b) => collator.compare(a.label, b.label)),
  ];
};
