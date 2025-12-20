import React, { useState } from "react";
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

const SignUpPage = ({ onLogin, onBack }) => {
  const { signup, authError, setAuthError } = useAuth();
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
  const [initialPaymentAmount, setInitialPaymentAmount] = useState("");
  const [accountStatus, setAccountStatus] = useState("Active");
  const [selectedClass, setSelectedClass] = useState(
    loadPreferredClass() || Object.keys(classCatalog)[0]
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

    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
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
      setMessage(
        `Account created! Your student code is ${studentCode}. ${contractLabel}. Pay via Paystack: ${paystackLink}.${balanceText}`
      );
    } catch (error) {
      console.error(error);
      setAuthError(error?.message || "Sign up failed.");
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
            Signing up links your profile to Firebase (hosted on Vercel). You can use the same login for web and mobile.
          </p>
          <p style={{ ...styles.helperText, marginBottom: 6 }}>
            Already have an email in our old Firebase student list? Please go to Login and reuse that email to set a new password. We'll migrate your profile.
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
            Wir laden Sprechen- und Schreiben-Aufgaben aus dem passenden Niveau-Sheet.
          </p>

          <label style={styles.label}>Phone number</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
            placeholder="0176 12345678"
          />

          <label style={styles.label}>Location</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
            placeholder="Berlin"
          />

          <label style={styles.label}>Emergency contact (phone)</label>
          <input
            type="tel"
            required
            value={emergencyContactPhone}
            onChange={(e) => setEmergencyContactPhone(e.target.value)}
            style={inputStyle}
            placeholder="0176 98765432"
          />

          <label style={styles.label}>Status</label>
          <input
            type="text"
            required
            value={accountStatus}
            onChange={(e) => setAccountStatus(e.target.value)}
            style={inputStyle}
            placeholder="Active"
          />

          <label style={styles.label}>Initial payment amount (GH₵)</label>
          <input
            type="number"
            min="0"
            step="100"
            value={initialPaymentAmount}
            onChange={(e) => setInitialPaymentAmount(e.target.value)}
            style={inputStyle}
            placeholder="0"
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
