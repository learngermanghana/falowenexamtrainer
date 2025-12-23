import React, { useMemo, useState } from "react";
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
import { buildPaystackCheckoutLink } from "../lib/paystack";

const MIN_INITIAL_PAYMENT = 1000;

const formatClassLabel = (className) => {
  const details = classCatalog[className];
  if (!details) return className;

  const startLabel = details.startDate
    ? new Date(details.startDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Schedule";

  const timeLabel = Array.isArray(details.schedule)
    ? details.schedule
        .map(({ day, startTime, endTime }) =>
          [day, startTime && ` ${startTime}`, endTime && `-${endTime}`]
            .filter(Boolean)
            .join("")
        )
        .join(" · ")
    : "";

  return timeLabel
    ? `${className} — starts ${startLabel} — ${timeLabel}`
    : `${className} — starts ${startLabel}`;
};

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
  const [initialPaymentAmount, setInitialPaymentAmount] = useState(
    `${MIN_INITIAL_PAYMENT}`
  );
  const [selectedClass, setSelectedClass] = useState(loadPreferredClass() || "");
  const [hasConsented, setHasConsented] = useState(false);

  const classOptions = useMemo(
    () =>
      Object.keys(classCatalog).map((className) => ({
        value: className,
        label: formatClassLabel(className),
      })),
    []
  );

  const inputStyle = { ...styles.textArea, minHeight: "auto", height: 46 };

  const tuitionSummary = computeTuitionStatus({
    level: selectedLevel,
    paidAmount: Number(initialPaymentAmount) || 0,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setMessage("");

    const numericInitialPayment = Number(initialPaymentAmount);

    if (password !== confirmPassword) {
      const passwordError = "Passwords do not match.";
      setAuthError(passwordError);
      showToast(passwordError, "error");
      return;
    }

    if (!hasConsented) {
      const consentMessage = "Please agree to the terms and privacy policy to continue.";
      setAuthError(consentMessage);
      showToast(consentMessage, "error");
      return;
    }

    if (!numericInitialPayment || numericInitialPayment < MIN_INITIAL_PAYMENT) {
      const paymentError = `Initial payment amount must be at least GH₵${MIN_INITIAL_PAYMENT}.`;
      setAuthError(paymentError);
      showToast(paymentError, "error");
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
      const paystackLink = buildPaystackCheckoutLink({
        baseLink: tuitionSummary.paystackLink,
        amount: numericInitialPayment,
        redirectUrl: `${window.location.origin}/payment-complete`,
      });

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
        status: "Active",
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
        ? ` Pay online using your secure link: ${paystackLink}.`
        : " Payments are handled on the web app only. Please sign in online to complete your tuition.";
      const paymentRedirectNote =
        paystackLink && paymentsEnabled
          ? " Complete your tuition before logging in—we'll open your checkout now."
          : " Complete your tuition before logging in. You can open your checkout link from the app when you're ready.";
      const successMessage =
        `Account created! Your student code is ${studentCode}. ${contractLabel}.${paymentInstruction}${paymentRedirectNote}${balanceText}`;
      setMessage(successMessage);
      showToast(
        `${successMessage} Check your email for a Falowen verification link before logging in.`,
        "success"
      );

      if (paystackLink && paymentsEnabled) {
        setTimeout(() => {
          window.open(paystackLink, "_blank", "noopener,noreferrer");
        }, 900);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error?.message || "Sign up failed.";
      setAuthError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
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

          <label style={styles.label}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="you@example.com"
          />

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
            We load speaking and writing tasks from the sheet that matches your level.
          </p>

          <label style={styles.label}>Phone number (optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
            placeholder="0176 12345678"
          />

          <p style={{ ...styles.helperText, marginTop: -4 }}>
            We keep your phone number on file to contact you directly when necessary. Your emergency contact is only
            notified in urgent safety situations.
          </p>

          <label style={styles.label}>Location (optional)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
            placeholder="Berlin"
          />

          <label style={styles.label}>Emergency contact (phone, optional)</label>
          <input
            type="tel"
            value={emergencyContactPhone}
            onChange={(e) => setEmergencyContactPhone(e.target.value)}
            style={inputStyle}
            placeholder="0176 98765432"
          />

          <label style={styles.label}>Initial payment amount (GH₵)</label>
          <input
            type="number"
            min={MIN_INITIAL_PAYMENT}
            step="100"
            value={initialPaymentAmount}
            onChange={(e) => setInitialPaymentAmount(e.target.value)}
            style={inputStyle}
            placeholder={`At least GH₵${MIN_INITIAL_PAYMENT}`}
          />
          <p style={{ ...styles.helperText, marginTop: -2 }}>
            A1: GH₵2800 · A2: GH₵3000 · B1: GH₵3000 · B2: GH₵3000. Full payment activates a 6-month contract; partial payment sets a 1-month starter contract with reminders.
          </p>

          <TuitionStatusCard
            level={selectedLevel}
            paidAmount={Number(initialPaymentAmount) || 0}
            balanceDue={tuitionSummary.balanceDue}
            tuitionFee={tuitionSummary.tuitionFee}
            paystackLink={tuitionSummary.paystackLink}
            title="Tuition summary"
            description={`For ${selectedLevel} we charge GH₵${tuitionSummary.tuitionFee}. We'll mark your account as ${tuitionSummary.statusLabel.toLowerCase()} until the full balance is received.`}
          />

          <label style={styles.label}>Which live class are you joining? (optional)</label>
          <select
            value={selectedClass}
            onChange={(event) => setSelectedClass(event.target.value)}
            style={styles.select}
          >
            <option value="">Decide later (we'll ask again after signup)</option>
            {classOptions.map((classOption) => (
              <option key={classOption.value} value={classOption.value}>
                {classOption.label}
              </option>
            ))}
          </select>
          <p style={{ ...styles.helperText, marginTop: -2 }}>
            You can skip this for now and add your class after you log in.
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

          <button style={styles.primaryButton} type="submit" disabled={loading}>
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
