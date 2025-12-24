import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";

const PaymentComplete = () => {
  const navigate = useNavigate();
  const { refreshUser, user, studentProfile } = useAuth();
  const [message, setMessage] = useState("Refreshing your payment status...");

  useEffect(() => {
    let intervalId;
    let timeoutId;

    const isPaidEnough = (profile) => {
      const paid = Number(profile?.initialPaymentAmount || 0);
      const balance = Number(profile?.balanceDue ?? 0);
      // “Paid” if any deposit recorded, or balance is 0.
      return paid > 0 || balance <= 0;
    };

    const startPolling = async () => {
      // First attempt immediately
      try {
        if (user) await refreshUser();
      } catch (_) {}

      // Poll every 3s
      intervalId = setInterval(async () => {
        try {
          if (user) await refreshUser();
        } catch (_) {}
      }, 3000);

      // Stop after 45s
      timeoutId = setTimeout(() => {
        if (intervalId) clearInterval(intervalId);
        setMessage("Payment is still syncing. Please check Billing in a moment.");
        setTimeout(() => window.location.replace("/"), 1200);
      }, 45000);
    };

    startPolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [refreshUser, user]);

  // React to Firestore updates (when refreshUser pulls new profile)
  useEffect(() => {
    const paid = Number(studentProfile?.initialPaymentAmount || 0);
    const balance = Number(studentProfile?.balanceDue ?? 0);
    const done = paid > 0 || balance <= 0;

    if (done) {
      setMessage("Payment confirmed ✅ Taking you back to the app...");
      setTimeout(() => window.location.replace("/"), 1200);
    }
  }, [studentProfile?.initialPaymentAmount, studentProfile?.balanceDue]);

  return (
    <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
      <div style={{ ...styles.card, maxWidth: 520, width: "100%" }}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: 8 }}>Payment received</h2>
        <p style={{ ...styles.helperText, marginBottom: 16 }}>{message}</p>
        <button type="button" style={styles.primaryButton} onClick={() => navigate("/")}>
          Back to dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentComplete;
