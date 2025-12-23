import React, { useEffect, useMemo, useState } from "react";
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
import PasswordGuidance from "./PasswordGuidance";

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
  const [accountIntent, setAccountIntent] = useState("pay-now");
  const [selectedContractTerm, setSelectedContractTerm] = useState("");
  const [showConsentDetails, setShowConsentDetails] = useState(false);

  const consentHighlights = [
    "We collect your contact details to create and support your account, share class updates, and send payment reminders.",
    "You can switch contract terms or cancel future renewals by contacting support before the next billing date.",
    "Payments are processed securely; tuition balances must be cleared to keep full access to live classes and materials.",
    "We never sell your data and only share it with partners that help us deliver the service (like payments and messaging).",
  ];

  const overviewSections = [
    {
      title: "What you get",
      items: [
        "Daily Plan, mock exams, and speaking/writing rooms in one account.",
        "Progress saved across web and mobile with reminders.",
        "Tuition tracker with secure Paystack checkout when payments are enabled.",
      ],
    },
    {
      title: "What happens now",
      items: [
        "Choose to pay now to reserve your class or start with a trial.",
        "Pick your level so we can match you to the right materials.",
        "Create a password and confirm your consent to our terms and privacy policy.",
      ],
    },
    {
      title: "Finish later",
      items: [
        "For trials: complete tuition and pick a class inside Account & Billing when you're ready.",
        "For pay-now: you can reopen your checkout link anytime if you close it accidentally.",
        "Need help? Use the contact links in the terms to reach support.",
      ],
    },
  ];

  const isPayNow = accountIntent === "pay-now";
  const isTrial = accountIntent === "trial";

  const classOptions = useMemo(
    () =>
      Object.keys(classCatalog).map((className) => ({
        value: className,
        label: formatClassLabel(className),
      })),
    []
  );

  const tuitionFeeForLevel = useMemo(
    () => computeTuitionStatus({ level: selectedLevel, paidAmount: 0 }).tuitionFee,
    [selectedLevel]
  );

  const inputStyle = { ...styles.textArea, minHeight: "auto", height: 46 };

  const handleInitialPaymentChange = (event) => {
    const numericOnlyValue = event.target.value.replace(/[^0-9]/g, "");
    if (numericOnlyValue === "") {
      setInitialPaymentAmount("");
      return;
    }

    const sanitizedValue = Math.max(Number(numericOnlyValue), 0);
    const cappedValue = Math.min(sanitizedValue, tuitionFeeForLevel || sanitizedValue);
    setInitialPaymentAmount(`${cappedValue}`);
  };

  useEffect(() => {
    if (isTrial) {
      setInitialPaymentAmount("0");
      setSelectedContractTerm("");
      setSelectedClass("");
    } else {
      setInitialPaymentAmount((prev) => (Number(prev) > 0 ? prev : `${MIN_INITIAL_PAYMENT}`));
    }
  }, [isTrial]);

  useEffect(() => {
    if (!isPayNow || initialPaymentAmount === "") return;

    const numericAmount = Number(initialPaymentAmount);
    if (Number.isNaN(numericAmount)) return;

    const cappedAmount = Math.min(Math.max(numericAmount, 0), tuitionFeeForLevel || numericAmount);
    if (`${cappedAmount}` !== `${initialPaymentAmount}`) {
      setInitialPaymentAmount(`${cappedAmount}`);
    }
  }, [initialPaymentAmount, isPayNow, tuitionFeeForLevel]);

  const tuitionSummary = computeTuitionStatus({
    level: selectedLevel,
    paidAmount: isPayNow ? Number(initialPaymentAmount) || 0 : 0,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setMessage("");

    const numericInitialPayment = isPayNow ? Number(initialPaymentAmount) : 0;

    if (isPayNow && (initialPaymentAmount === "" || Number.isNaN(numericInitialPayment))) {
      const paymentError = "Enter a numeric initial payment amount.";
      setAuthError(paymentError);
      showToast(paymentError, "error");
      return;
    }

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

    if (isPayNow) {
      if (numericInitialPayment < 0) {
        const paymentError = "Initial payment amount cannot be negative.";
        setAuthError(paymentError);
        showToast(paymentError, "error");
        return;
      }

      if (!numericInitialPayment || numericInitialPayment < MIN_INITIAL_PAYMENT) {
        const paymentError = `Initial payment amount must be at least GH₵${MIN_INITIAL_PAYMENT}.`;
        setAuthError(paymentError);
        showToast(paymentError, "error");
        return;
      }

      if (!selectedClass) {
        const classError = "Please pick a class to reserve your seat.";
        setAuthError(classError);
        showToast(classError, "error");
        return;
      }

      if (!selectedContractTerm) {
        const contractError = "Please choose a contract term to continue.";
        setAuthError(contractError);
        showToast(contractError, "error");
        return;
      }
    }

    setLoading(true);
    try {
      const tuitionFee = tuitionSummary.tuitionFee;
      const paidAmount = tuitionSummary.paidAmount;
      const contractStart = new Date();
      const contractMonths = isPayNow
        ? Number(selectedContractTerm) || (tuitionSummary.statusLabel === "Paid" ? 6 : 1)
        : 0;
      const contractEnd = contractMonths
        ? (() => {
            const endDate = new Date(contractStart);
            endDate.setMonth(endDate.getMonth() + contractMonths);
            return endDate;
          })()
        : null;
      const balanceDue = tuitionSummary.balanceDue;
      const paymentStatus = isTrial
        ? "trial"
        : tuitionSummary.statusLabel.toLowerCase();
      const paystackLink = isPayNow
        ? buildPaystackCheckoutLink({
            baseLink: tuitionSummary.paystackLink,
            amount: numericInitialPayment,
            redirectUrl: `${window.location.origin}/payment-complete`,
          })
        : tuitionSummary.paystackLink;

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
        status: isTrial ? "Trial" : "Active",
        contractStart: contractStart.toISOString(),
        contractEnd: contractEnd ? contractEnd.toISOString() : "",
        contractTermMonths: contractMonths || null,
      });
      savePreferredLevel(selectedLevel);
      savePreferredClass(selectedClass);
      rememberStudentCodeForEmail(email, studentCode);
      const contractLabel = isTrial
        ? "Trial access started"
        : paymentStatus === "paid"
        ? `${contractMonths}-month contract activated`
        : `${contractMonths}-month starter contract set with reminder`;
      const balanceText = balanceDue > 0 ? ` Balance due: GH₵${balanceDue}.` : "";
      const paymentInstruction = isTrial
        ? " We'll prompt you inside the app to finish your tuition and pick a class before live sessions start."
        : paymentsEnabled
        ? ` Pay online using your secure link: ${paystackLink}.`
        : " Payments are handled on the web app only. Please sign in online to complete your tuition.";
      const paymentRedirectNote = isTrial
        ? " You can explore the app now—finish payment from Account & Billing when you're ready."
        : paystackLink && paymentsEnabled
        ? " Complete your tuition before logging in—we'll open your checkout now."
        : " Complete your tuition before logging in. You can open your checkout link from the app when you're ready.";
      const successMessage =
        `Account created! Your student code is ${studentCode}. ${contractLabel}.${paymentInstruction}${paymentRedirectNote}${balanceText}`;
      setMessage(successMessage);
      showToast(
        `${successMessage} Check your email for a Falowen verification link before logging in.`,
        "success"
      );

      if (paystackLink && paymentsEnabled && isPayNow) {
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
      <div
        style={{
          ...styles.card,
          width: "100%",
          maxWidth: 660,
          position: "relative",
          padding: 20,
          gap: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 4 }}>Create account</h2>
          {onBack && (
            <button style={{ ...styles.secondaryButton, padding: "6px 12px" }} onClick={onBack}>
              Back to overview
            </button>
          )}
        </div>
        <div
          style={{
            ...styles.uploadCard,
            background: "#f8fafc",
            marginBottom: 12,
            display: "grid",
            gap: 12,
          }}
        >
          <p style={{ ...styles.helperText, marginBottom: 2 }}>
            Get oriented quickly—open the sections below to skim what matters.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            {overviewSections.map((section) => (
              <div
                key={section.title}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <strong style={{ display: "block", marginBottom: 6, color: "#0f172a" }}>{section.title}</strong>
                <ul style={{ margin: 0, paddingLeft: 16, display: "grid", gap: 6 }}>
                  {section.items.map((item) => (
                    <li key={item} style={{ color: styles.helperText.color, fontSize: 13, lineHeight: 1.5 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <details style={{ background: "#eef2ff", padding: 12, borderRadius: 10, border: "1px solid #c7d2fe" }}>
            <summary style={{ cursor: "pointer", fontWeight: 700, color: "#312e81", marginBottom: 6 }}>
              Need the full explanation?
            </summary>
            <div style={{ display: "grid", gap: 8, color: styles.helperText.color, fontSize: 13, lineHeight: 1.6 }}>
              <p style={{ margin: 0 }}>
                Signing up saves your profile to the Falowen cloud so you can reuse the same login on web and mobile.
              </p>
              <p style={{ margin: 0 }}>
                Returning Falowen student from our old system? Go to Login and reuse that email to set a new password. We'll
                migrate your profile automatically.
              </p>
              <p style={{ margin: 0 }}>
                Want reminders? Enable push notifications after login to get weekly goals and practice nudges.
              </p>
            </div>
          </details>
        </div>

        <div style={{ ...styles.uploadCard, background: "#eef2ff", marginBottom: 12 }}>
          <label style={{ ...styles.label, marginBottom: 8 }}>How do you want to start?</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button
              type="button"
              onClick={() => setAccountIntent("pay-now")}
              style={{
                ...styles.secondaryButton,
                padding: "10px 12px",
                borderColor: isPayNow ? "#4f46e5" : styles.secondaryButton.borderColor,
                color: isPayNow ? "#111827" : styles.secondaryButton.color,
                background: isPayNow ? "#e0e7ff" : styles.secondaryButton.background,
              }}
            >
              Pay tuition now
            </button>
            <button
              type="button"
              onClick={() => setAccountIntent("trial")}
              style={{
                ...styles.secondaryButton,
                padding: "10px 12px",
                borderColor: isTrial ? "#4f46e5" : styles.secondaryButton.borderColor,
                color: isTrial ? "#111827" : styles.secondaryButton.color,
                background: isTrial ? "#e0e7ff" : styles.secondaryButton.background,
              }}
            >
              Skip payment for now
            </button>
          </div>
          <p style={{ ...styles.helperText, marginTop: 8, marginBottom: 0 }}>
            Paying now reserves your class and activates your contract. Skipping payment gives you a trial account so you can
            explore the app before committing to a schedule—we'll keep reminding you inside the app to finish tuition.
          </p>
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="At least 8 characters with letters and numbers"
          />

          <PasswordGuidance password={password} />

          <label style={styles.label}>Confirm password</label>
          <input
            type="password"
            required
            minLength={8}
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
            max={tuitionFeeForLevel}
            step="100"
            pattern="[0-9]*"
            inputMode="numeric"
            value={initialPaymentAmount}
            onChange={handleInitialPaymentChange}
            style={{ ...inputStyle, background: isTrial ? "#f3f4f6" : inputStyle.background }}
            placeholder={`At least GH₵${MIN_INITIAL_PAYMENT}`}
            disabled={isTrial}
          />
          <p style={{ ...styles.helperText, marginTop: -2 }}>
            Enter between GH₵{MIN_INITIAL_PAYMENT} and GH₵{tuitionFeeForLevel} for {selectedLevel}. A1: GH₵2800 · A2:
            GH₵3000 · B1: GH₵3000 · B2: GH₵3000. You must pay at least GH₵{MIN_INITIAL_PAYMENT} to start a paid account.
            Choose "Skip payment for now" to explore without paying yet.
          </p>

          <TuitionStatusCard
            level={selectedLevel}
            paidAmount={Number(initialPaymentAmount) || 0}
            balanceDue={tuitionSummary.balanceDue}
            tuitionFee={tuitionSummary.tuitionFee}
            paystackLink={tuitionSummary.paystackLink}
            title="Tuition summary"
            description={
              isTrial
                ? `For ${selectedLevel} we charge GH₵${tuitionSummary.tuitionFee}. Your account will stay in trial mode until you complete tuition in the app.`
                : `For ${selectedLevel} we charge GH₵${tuitionSummary.tuitionFee}. We'll mark your account as ${tuitionSummary.statusLabel.toLowerCase()} until the full balance is received.`
            }
          />

          <label style={styles.label}>Which live class are you joining? {isPayNow ? "(required)" : "(optional)"}</label>
          <select
            value={selectedClass}
            onChange={(event) => setSelectedClass(event.target.value)}
            style={styles.select}
            required={isPayNow}
          >
            <option value="">Decide later (we'll ask again after signup)</option>
            {classOptions.map((classOption) => (
              <option key={classOption.value} value={classOption.value}>
                {classOption.label}
              </option>
            ))}
          </select>
          <p style={{ ...styles.helperText, marginTop: -2 }}>
            {isPayNow
              ? "Picking a class is required when you pay now so we can reserve your spot."
              : "You can skip this for now and add your class after you log in."}
          </p>

          <label style={styles.label}>Contract term</label>
          <select
            value={selectedContractTerm}
            onChange={(event) => setSelectedContractTerm(event.target.value)}
            style={styles.select}
            required={isPayNow}
          >
            <option value="">Select a contract term</option>
            <option value="1">1-month starter (partial tuition)</option>
            <option value="6">6-month standard (full tuition)</option>
          </select>
          <p style={{ ...styles.helperText, marginTop: -2 }}>
            Contract selection is required when paying now. Trial accounts can pick a contract later inside Account & Billing.
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
          <div style={{ marginLeft: 26, marginTop: 6, color: "#4b5563", fontSize: 13 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <strong style={{ fontWeight: 600 }}>Key points:</strong>
              <button
                type="button"
                onClick={() => setShowConsentDetails(true)}
                style={{
                  ...styles.secondaryButton,
                  padding: "4px 10px",
                  fontSize: 12,
                  height: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                View summary
              </button>
            </div>
            <ul style={{ marginTop: 6, paddingLeft: 18, lineHeight: 1.5 }}>
              {consentHighlights.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p style={{ marginTop: 4 }}>
              Want the full details? Open the summary or the links above without leaving the form.
            </p>
          </div>

          <button style={styles.primaryButton} type="submit" disabled={loading}>
            {loading ? "Creating ..." : "Sign up now"}
          </button>
        </form>

        {showConsentDetails && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 20,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Terms and privacy highlights"
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                maxWidth: 520,
                width: "100%",
                boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
                padding: 20,
                color: "#111827",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Terms and privacy highlights</h3>
                <button
                  type="button"
                  onClick={() => setShowConsentDetails(false)}
                  style={{ ...styles.secondaryButton, padding: "6px 12px", fontSize: 12 }}
                >
                  Close
                </button>
              </div>
              <p style={{ marginTop: 12, marginBottom: 10 }}>
                Here is a quick summary of what you are agreeing to when you continue.
              </p>
              <ul style={{ marginTop: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                {consentHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p style={{ marginTop: 10, color: "#4b5563" }}>
                Read the full
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
                {" "}
                at any time without losing your progress.
              </p>
            </div>
          </div>
        )}

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
