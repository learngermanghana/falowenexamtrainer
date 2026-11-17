import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import { MIN_INSTALLMENT_GHS } from "../data/levelFees";
import { isPaymentsEnabled } from "../lib/featureFlags";
import { startTuitionPaystackCheckout, redirectToPaystackCheckout } from "../lib/onboardingPaystackCheckout";

const price = amount => new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(amount);

export default function CourseDiscountPage({ code, user, student, renderSignup, renderLogin, onExit }) {
  const [view, setView] = useState("offer");
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [installment, setInstallment] = useState(false);
  const endpoint = "/api/course-discounts/" + code;
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const token = user ? await user.getIdToken() : "";
        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: token ? { Authorization: "Bearer " + token } : {},
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "This offer is unavailable.");
        if (!controller.signal.aborted) {
          setQuote(body.offer);
          setError("");
        }
      } catch (reason) {
        if (!controller.signal.aborted) setError(reason.message);
      }
    }
    load();
    return () => controller.abort();
  }, [endpoint, user]);

  if (!user && view === "signup" && quote) return renderSignup(quote, () => setView("login"), () => setView("offer"));
  if (!user && view === "login") return renderLogin(() => setView("signup"), () => setView("offer"));

  const studentCode = student?.studentCode || student?.studentcode || student?.id;
  const applied = Boolean(quote?.id && student?.courseDiscount?.id === quote.id);
  const balance = applied ? Number(student.balanceDue) : quote?.total;
  const canInstall = balance > MIN_INSTALLMENT_GHS;
  const payment = canInstall && installment ? MIN_INSTALLMENT_GHS : balance;

  const pay = async () => {
    setBusy(true);
    setError("");
    try {
      const idToken = await user.getIdToken();
      const result = await fetch(endpoint + "/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + idToken },
        body: JSON.stringify({ studentCode }),
      });
      const data = await result.json();
      if (!result.ok) throw new Error(data.error || "Could not apply this offer.");
      if (data.balanceDue < payment) throw new Error("Your balance changed. Review the updated amount and try again.");
      const url = await startTuitionPaystackCheckout({ studentProfile: student, idToken, user, amount: payment });
      redirectToPaystackCheckout(url);
    } catch (reason) {
      setError(reason.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={{ ...styles.container, maxWidth: 620, margin: "24px auto" }}>
      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <h1>Course discount</h1>
        {error && <p role="alert">{error}</p>}
        {!quote && !error && <p role="status">Loading offer…</p>}
        {quote && <>
          <h2>{quote.program === "swahili" ? "Swahili" : "German"} · {quote.level}</h2>
          <p>Original tuition {price(quote.original)} · Discount {price(quote.discount)}</p>
          <p><strong>Discounted tuition {price(quote.total)}</strong></p>
          {user ? <>
            {applied && Number.isFinite(balance) && <p>Remaining tuition {price(balance)}</p>}
            {canInstall && <label><input type="checkbox" checked={installment}
              onChange={event => setInstallment(event.target.checked)} disabled={busy} /> Pay {price(MIN_INSTALLMENT_GHS)} as an installment</label>}
            <p>Paystack adds the usual processing fee share at checkout.</p>
            <button style={styles.primaryButton} type="button" onClick={pay}
              disabled={busy || !studentCode || !(payment > 0) || !isPaymentsEnabled()}>
              {busy ? "Opening checkout…" : payment > 0 ? `Pay ${price(payment)}` : "Tuition paid"}
            </button>
            {!studentCode && <p role="status">Waiting for your student profile…</p>}
            {!isPaymentsEnabled() && <p>Online payments are temporarily unavailable.</p>}
          </> : <>
            <button style={styles.primaryButton} type="button" onClick={() => setView("signup")}>Create account with this offer</button>
            <button style={styles.secondaryButton} type="button" onClick={() => setView("login")}>Sign in to use this offer</button>
          </>}
        </>}
        <button style={styles.secondaryButton} type="button" disabled={busy} onClick={onExit}>{applied ? "Continue to Falowen" : "Continue without this offer"}</button>
      </section>
    </main>
  );
}
