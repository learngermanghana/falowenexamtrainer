import React, { useEffect, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";

const PaymentComplete = () => {
  const { refreshUser, user } = useAuth();
  const [message, setMessage] = useState("Refreshing your payment status...");

  useEffect(() => {
    let timeoutId;
    const refresh = async () => {
      try {
        if (user) {
          await refreshUser();
        }
        setMessage("Thanks! Your payment is syncing. Taking you back to the app...");
      } catch (error) {
        console.error("Failed to refresh after payment", error);
        setMessage("Thanks! Your payment is processing. We'll keep checking in the app.");
      } finally {
        timeoutId = setTimeout(() => {
          window.location.replace("/");
        }, 1200);
      }
    };

    refresh();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [refreshUser, user]);

  return (
    <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
      <div style={{ ...styles.card, maxWidth: 520, width: "100%" }}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: 8 }}>Payment received</h2>
        <p style={{ ...styles.helperText, marginBottom: 16 }}>{message}</p>
        <AppBackButton label="Back to dashboard" fallbackPath="/" />
      </div>
    </div>
  );
};

export default PaymentComplete;
