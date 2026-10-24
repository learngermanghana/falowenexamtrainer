import React, { useEffect, useRef } from "react";
import TuitionStatusCardLegacy from "./TuitionStatusCardLegacy";
import { useAuth } from "../context/AuthContext";
import {
  getPublicFunnelContext,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const PAID_TRACKED_KEY = "falowen:public-funnel-payment-confirmed";

export default function TuitionStatusCard(props) {
  const rootRef = useRef(null);
  const { studentProfile } = useAuth();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const handleClick = (event) => {
      const button = event.target?.closest?.("button");
      if (!button || !root.contains(button)) return;
      const label = String(button.textContent || "").toLowerCase();
      const isPaymentAction =
        label.includes("pay online") ||
        label.includes("pay to finish") ||
        label.includes("zahlung") ||
        label.includes("payer") ||
        label.includes("bezahlen");
      if (!isPaymentAction) return;

      trackPublicFunnelEvent("payment_start_click", {
        level: props.level || studentProfile?.level || "",
        amount: props.checkoutAmountOverride || "",
        balanceDue: props.balanceDue ?? studentProfile?.balanceDue ?? "",
      });
    };

    root.addEventListener("click", handleClick, true);
    return () => root.removeEventListener("click", handleClick, true);
  }, [props.balanceDue, props.checkoutAmountOverride, props.level, studentProfile?.balanceDue, studentProfile?.level]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const context = getPublicFunnelContext();
    if (!context.sessionId && !context.source && !context.video) return;

    const status = String(studentProfile?.paymentStatus || "").toLowerCase();
    const paidAmount = Number(studentProfile?.initialPaymentAmount ?? studentProfile?.paidAmount ?? props.paidAmount ?? 0);
    const balance = Number(studentProfile?.balanceDue ?? props.balanceDue ?? 0);
    const confirmed = status === "paid" || (paidAmount > 0 && balance <= 0);
    if (!confirmed) return;

    const identity = studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.email || "student";
    const key = `${PAID_TRACKED_KEY}:${identity}`;
    if (window.localStorage.getItem(key) === "1") return;
    window.localStorage.setItem(key, "1");
    trackPublicFunnelEvent("payment_confirmed", {
      level: props.level || studentProfile?.level || "",
      paidAmount,
      balanceDue: balance,
    });
  }, [props.balanceDue, props.level, props.paidAmount, studentProfile]);

  return (
    <div ref={rootRef}>
      <TuitionStatusCardLegacy {...props} />
    </div>
  );
}
