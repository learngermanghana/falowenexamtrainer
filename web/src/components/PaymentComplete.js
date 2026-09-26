import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";

const PaymentComplete = () => {
  const { refreshUser, refreshStudentProfile, user } = useAuth();
  const [message, setMessage] = useState("Checking for Paystack confirmation...");

  useEffect(() => {
    let timeoutId;
    const refresh = async () => {
      try {
        if (user) {
          await refreshUser();
          await refreshStudentProfile?.();
        }
        setMessage("Your payment was submitted. Falowen will show it as paid only after Paystack confirmation.");
      } catch (error) {
        console.error("Failed to refresh after payment", error);
        setMessage("Your payment was submitted. Confirmation may still be processing; check Account & Billing for the latest status.");
      } finally {
        timeoutId = setTimeout(() => {
          window.location.replace("/campus/account?tab=billing&payment=return");
        }, 1200);
      }
    };

    refresh();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [refreshStudentProfile, refreshUser, user]);

  return (
    <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
      <div style={{ ...styles.card, maxWidth: 520, width: "100%" }}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: 8 }}>Payment submitted</h2>
        <p style={{ ...styles.helperText, marginBottom: 16 }}>{message}</p>
        <AppBackButton label="Open Account & Billing" fallbackPath="/campus/account?tab=billing" />
      </div>
    </div>
  );
};

export default PaymentComplete;
