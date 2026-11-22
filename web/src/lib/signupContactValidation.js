import { phoneToE164 } from "../data/phoneCountries";

// Compare the *actual* dialable numbers, not raw text. A local number and
// its +country-code or 00-prefixed equivalent must count as the same person.
// Keep this check free of API calls; the backend also validates before signup.
export const areSameContactNumber = (primary, emergency, countryCode) => {
  const primaryE164 = phoneToE164(primary, countryCode);
  const emergencyE164 = phoneToE164(emergency, countryCode);
  return Boolean(primaryE164 && emergencyE164 && primaryE164 === emergencyE164);
};
