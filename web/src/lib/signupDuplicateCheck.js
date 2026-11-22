import { getBackendUrl } from "../services/backendUrl";

const REVIEW_MESSAGE = "Falowen needs to verify these details before creating another account. Please log in or reset your password if you already have an account. If you are a different student who shares a family phone number, contact info@falowen.app for help.";
const UNAVAILABLE_MESSAGE = "We could not verify your details right now. Your account has not been created. Please try again or contact info@falowen.app.";

const registrationError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

export async function checkSignupDuplicate({ name, email, phone, emergencyContactPhone }) {
  let response;
  try {
    response = await fetch(`${getBackendUrl()}/auth/signup-duplicate-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, emergencyContactPhone }),
      cache: "no-store",
    });
  } catch {
    throw registrationError("auth/duplicate-check-unavailable", UNAVAILABLE_MESSAGE);
  }

  if (response.status === 409) {
    throw registrationError("auth/duplicate-review-required", REVIEW_MESSAGE);
  }
  if (response.status !== 200) {
    const message = response.status === 422
      ? "Please check your full name, email, and provide two valid, different contact numbers."
      : UNAVAILABLE_MESSAGE;
    throw registrationError("auth/duplicate-check-unavailable", message);
  }
  const result = await response.json().catch(() => null);
  if (result?.code !== "CLEAR") {
    throw registrationError("auth/duplicate-check-unavailable", UNAVAILABLE_MESSAGE);
  }
  return true;
}
