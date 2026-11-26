import { getBackendUrl } from "../services/backendUrl";

const REVIEW_MESSAGE = "Registration requires verification. It appears you may already have a Falowen account. Free trial access is limited to one trial per learner per language. Please sign in to your existing account or contact info@falowen.app for assistance.";
const UNAVAILABLE_MESSAGE = "We could not verify your details right now. Your account has not been created. Please try again or contact info@falowen.app.";

const registrationError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

export async function checkSignupDuplicate({ name, email, phone, emergencyContactPhone, program, browserId, studentCode }) {
  let response;
  try {
    // The signup endpoint is called directly in production so Cloud Run sees
    // the request network rather than the Vercel server's shared egress IP.
    const base = process.env.NODE_ENV === "production"
      ? "https://europe-west1-falowen-examiner-trainer.cloudfunctions.net/api"
      : getBackendUrl();
    response = await fetch(`${base}/auth/signup-duplicate-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, emergencyContactPhone, program, browserId, studentCode }),
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
  if (program) {
    if (!/^[a-f0-9]{48}$/.test(result.permit || "")) {
      throw registrationError("auth/duplicate-check-unavailable", UNAVAILABLE_MESSAGE);
    }
    return result.permit;
  }
  return true;
}
