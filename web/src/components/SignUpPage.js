import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { ALLOWED_LEVELS } from "../context/ExamContext";
import { savePreferredLevel } from "../services/levelStorage";
import { rememberStudentCodeForEmail } from "../services/submissionService";
import { generateStudentCode } from "../services/studentCode";
import { classCatalog } from "../data/classCatalog";
import { computeTuitionStatus } from "../data/levelFees";
import { loadPreferredClass, savePreferredClass } from "../services/classSelectionStorage";
import TuitionStatusCard from "./TuitionStatusCard";
import { isPaymentsEnabled } from "../lib/featureFlags";
import { useToast } from "../context/ToastContext";

const SignUpPage = ({ onLogin, onBack }) => {
  const { signup, authError, setAuthError } = useAuth();
  const { showToast } = useToast();
  const paymentsEnabled = isPaymentsEnabled();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("B1");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [manualPaymentAmount, setManualPaymentAmount] = useState("");
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [accountStatus, setAccountStatus] = useState("Pending activation");
  const [selectedClass, setSelectedClass] = useState(
    loadPreferredClass() || Object.keys(classCatalog)[0]
  );
  const [hasConsented, setHasConsented] = useState(false);
  const [geoStatus, setGeoStatus] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    const withoutZero = digits.startsWith("0") ? digits.slice(1) : digits;
    const normalized = withoutZero.startsWith("49") ? withoutZero.slice(2) : withoutZero;
    const parts = [];
    if (normalized.length > 0) parts.push(normalized.slice(0, 3));
    if (normalized.length > 3) parts.push(normalized.slice(3, 7));
    if (normalized.length > 7) parts.push(normalized.slice(7, 11));

    return `+49 ${parts.filter(Boolean).join(" ")}`.trim();
  };

  const inputStyle = { ...styles.textArea, minHeight: "auto", height: 46 };
  const inlineErrorStyle = { color: "#b91c1c", fontSize: 12, marginTop: -6 };

  const handlePhoneInput = (value, setter) => {
    const formatted = formatPhoneNumber(value);
    setter(formatted);
  };

  const paidAmount = showPaymentDetails ? Number(manualPaymentAmount) || 0 : 0;

  useEffect(() => {
    if (!showPaymentDetails) {
      setManualPaymentAmount("");
      setAccountStatus("Pending activation");
    }
  }, [showPaymentDetails]);

  const tuitionSummary = computeTuitionStatus({
    level: selectedLevel,
    paidAmount,
  });

  const emailIsValid = /\S+@\S+\.\S+/.test(email);
  const passwordIsValid = password.length >= 6;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const cleanedPhone = phone.replace(/\D/g, "");
  const phoneIsValid = cleanedPhone.length >= 10;
  const locationIsValid = location.trim().length >= 3;
  const nameIsValid = name.trim().length > 1;
  const consentValid = hasConsented;

  const emailError = email && !emailIsValid ? "Enter a valid email address." : "";
  const passwordError = password && !passwordIsValid ? "Password must be at least 6 characters." : "";
  const confirmError = confirmPassword && !passwordsMatch ? "Passwords must match." : "";
  const phoneError = phone && !phoneIsValid ? "Enter a full phone number so we can reach you." : "";
  const locationError = location && !locationIsValid ? "Add your city and neighbourhood for emergencies." : "";

  const criticalValid =
    nameIsValid &&
    emailIsValid &&
    passwordIsValid &&
    passwordsMatch &&
    phoneIsValid &&
    locationIsValid &&
    consentValid;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setMessage("");

    if (!criticalValid) {
      const errorMessage =
        "Please fix the highlighted fields so we can reach you and keep your account secure.";
      setAuthError(errorMessage);
      showToast(errorMessage, "error");
      return;
    }

    setLoading(true);
    try {
      const tuitionFee = tuitionSummary.tuitionFee;
      const paidAmount = tuitionSummary.paidAmount;
      const contractStart = new Date();
      const contractMonths = tuitionSummary.statusLabel === "Paid" ? 6 : 1;
      const contractEnd = new Date(contractStart);
      contractEnd.setMonth(contractEnd.getMonth() + contractMonths);
      const balanceDue = tuitionSummary.balanceDue;
      const paymentStatus = tuitionSummary.statusLabel.toLowerCase();
      const paystackLink = tuitionSummary.paystackLink;

      const studentCode = generateStudentCode({ name });
      await signup(email, password, {
        name,
        level: selectedLevel,
        studentCode,
        className: selectedClass,
        phone,
        location,
        emergencyContactPhone,
        initialPaymentAmount: paidAmount,
        tuitionFee,
        balanceDue,
        paymentStatus,
        paystackLink,
        status: accountStatus,
        contractStart: contractStart.toISOString(),
        contractEnd: contractEnd.toISOString(),
        contractTermMonths: contractMonths,
      });
      savePreferredLevel(selectedLevel);
      savePreferredClass(selectedClass);
      rememberStudentCodeForEmail(email, studentCode);
      const contractLabel =
        paymentStatus === "paid"
          ? "6-month contract activated"
          : "1-month starter contract set with reminder";
      const balanceText = balanceDue > 0 ? ` Balance due: GH₵${balanceDue}.` : "";
      const paymentInstruction = paymentsEnabled
        ? ` Pay via Paystack: ${paystackLink}.`
        : " Payments are handled on the web app only. Please sign in online to complete your tuition.";
      const successMessage =
        `Account created! Your student code is ${studentCode}. ${contractLabel}.${paymentInstruction}${balanceText}`;
      setMessage(successMessage);
      showToast(
        `${successMessage} Check your email for a Falowen verification link before logging in.`,
        "success"
      );
    } catch (error) {
      console.error(error);
      const errorMessage = error?.message || "Sign up failed.";
      setAuthError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setGeoStatus("");
    if (!navigator.geolocation) {
      setGeoStatus("Geolocation is blocked or unsupported. Please type your city manually.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const approx = `Lat ${coords.latitude.toFixed(4)}, Lng ${coords.longitude.toFixed(4)}`;
        setLocation(approx);
        setGeoStatus("We added your approximate location. Update it if you want a city name instead.");
        setLocationLoading(false);
      },
      () => {
        setGeoStatus("Unable to fetch your location. Please enter your city and nearest landmark.");
        setLocationLoading(false);
      },
      { timeout: 7000 }
    );
  };

  return (
    <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
      <div style={{ ...styles.card, width: "100%", maxWidth: 520, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 4 }}>Create account</h2>
          {onBack && (
            <button style={{ ...styles.secondaryButton, padding: "6px 12px" }} onClick={onBack}>
              Back to overview
            </button>
          )}
        </div>
        <p style={styles.helperText}>
          Get access to the Daily Plan, exam simulations, and push reminders. Your progress is saved in the cloud.
        </p>

        <div style={{ ...styles.uploadCard, background: "#f8fafc", marginBottom: 12 }}>
          <p style={{ ...styles.helperText, marginBottom: 6 }}>
            Signing up saves your profile to the Falowen cloud so you can use the same login for web and mobile.
          </p>
          <p style={{ ...styles.helperText, marginBottom: 6 }}>
            Returning Falowen student from our old system? Go to Login and reuse that email to set a new password. We'll migrate your profile automatically.
          </p>
          <ul style={{ ...styles.checklist, margin: 0 }}>
            <li>Enable push reminders and weekly goals.</li>
            <li>Store your level checks and mock tests.</li>
            <li>Direct access to speaking and writing sessions.</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            placeholder="Abigail"
          />
          {!nameIsValid && name && <div style={inlineErrorStyle}>Please enter your full name.</div>}

          <label style={styles.label}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="you@example.com"
          />
          {emailError && <div style={inlineErrorStyle}>{emailError}</div>}

          <label style={styles.label}>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="At least 6 characters"
          />
          {passwordError && <div style={inlineErrorStyle}>{passwordError}</div>}

          <label style={styles.label}>Confirm password</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            placeholder="Enter password again"
          />
          {confirmError && <div style={inlineErrorStyle}>{confirmError}</div>}

          <label style={styles.label}>Your current level</label>
          <select
            required
            value={selectedLevel}
            onChange={(event) => setSelectedLevel(event.target.value)}
            style={styles.select}
          >
            {ALLOWED_LEVELS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p style={{ ...styles.helperText, marginTop: -2 }}>
            Wir laden Sprechen- und Schreiben-Aufgaben aus dem passenden Niveau-Sheet.
          </p>

          <label style={styles.label}>Phone number</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => handlePhoneInput(e.target.value, setPhone)}
            style={inputStyle}
            placeholder="0176 12345678"
          />
          <div style={{ ...styles.helperText, marginTop: -4 }}>
            We'll format numbers for Germany automatically. Use a reachable personal number for lesson reminders.
          </div>
          {phoneError && <div style={inlineErrorStyle}>{phoneError}</div>}

          <label style={styles.label}>Location</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
            placeholder="Berlin"
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              style={{ ...styles.secondaryButton, padding: "10px 12px" }}
              disabled={locationLoading}
            >
              {locationLoading ? "Detecting..." : "Use my GPS location"}
            </button>
            <p style={{ ...styles.helperText, margin: 0 }}>
              (Optional) We'll store a rough location to guide tutors if there's an emergency.
            </p>
          </div>
          {geoStatus && <div style={{ ...styles.helperText, color: "#1d4ed8", marginTop: -6 }}>{geoStatus}</div>}
          {locationError && <div style={inlineErrorStyle}>{locationError}</div>}

          <label style={styles.label}>Emergency contact (phone)</label>
          <input
            type="tel"
            value={emergencyContactPhone}
            onChange={(e) => handlePhoneInput(e.target.value, setEmergencyContactPhone)}
            style={inputStyle}
            placeholder="Optional — 0176 98765432"
          />
          <p style={{ ...styles.helperText, marginTop: -4 }}>
            Optional but recommended. We'll only notify this person in urgent safety situations.
          </p>

          <div style={{ ...styles.card, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <label style={styles.label}>Payment setup (optional)</label>
                <p style={{ ...styles.helperText, marginTop: -6 }}>
                  Tuition is auto-calculated from your chosen level. You can add contract details later in Account Settings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentDetails((prev) => !prev)}
                style={{ ...styles.secondaryButton, padding: "8px 12px" }}
              >
                {showPaymentDetails ? "Hide now" : "Add details now"}
              </button>
            </div>

            {showPaymentDetails ? (
              <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                <label style={styles.label}>Recorded payment amount (GH₵)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={manualPaymentAmount}
                  onChange={(e) => setManualPaymentAmount(e.target.value)}
                  style={inputStyle}
                  placeholder={String(tuitionSummary.tuitionFee)}
                />
                <label style={styles.label}>Account status</label>
                <select
                  value={accountStatus}
                  onChange={(event) => setAccountStatus(event.target.value)}
                  style={styles.select}
                >
                  <option value="Pending activation">Pending activation</option>
                  <option value="Active">Active</option>
                  <option value="On hold">On hold</option>
                </select>
              </div>
            ) : null}
          </div>

          <TuitionStatusCard
            level={selectedLevel}
            paidAmount={tuitionSummary.paidAmount}
            balanceDue={tuitionSummary.balanceDue}
            tuitionFee={tuitionSummary.tuitionFee}
            paystackLink={tuitionSummary.paystackLink}
            title="Tuition summary"
            description={`For ${selectedLevel} we charge GH₵${tuitionSummary.tuitionFee}. We'll mark your account as ${tuitionSummary.statusLabel.toLowerCase()} until the full balance is received.`}
          />

          <label style={styles.label}>Which live class are you joining?</label>
          <select
            required
            value={selectedClass}
            onChange={(event) => setSelectedClass(event.target.value)}
            style={styles.select}
          >
            {Object.keys(classCatalog).map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
          <p style={{ ...styles.helperText, marginTop: -2 }}>
            Wir hinterlegen deinen Kurs im Profil und erstellen den Kalender-Export mit Zoom-Link.
          </p>

          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#111827" }}>
            <input
              type="checkbox"
              checked={hasConsented}
              onChange={(event) => setHasConsented(event.target.checked)}
              required
              style={{ width: 18, height: 18 }}
            />
            <span>
              I agree to the
              {" "}
              <a
                href="https://register.falowen.app/#terms-of-service"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#1d4ed8", fontWeight: 600 }}
              >
                terms
              </a>
              {" "}
              and
              {" "}
              <a
                href="https://register.falowen.app/#privacy-policy"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#1d4ed8", fontWeight: 600 }}
              >
                privacy policy
              </a>
              .
            </span>
          </label>

          <button style={styles.primaryButton} type="submit" disabled={loading || !criticalValid}>
            {loading ? "Creating ..." : "Sign up now"}
          </button>
        </form>

        {authError && <div style={styles.errorBox}>{authError}</div>}
        {message && (
          <div style={{ ...styles.errorBox, background: "#ecfdf3", color: "#166534", borderColor: "#22c55e" }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 13, color: "#4b5563" }}>
          Already registered?{" "}
          <button
            type="button"
            onClick={onLogin}
            style={{ ...styles.secondaryButton, padding: "6px 12px" }}
          >
            Go to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
