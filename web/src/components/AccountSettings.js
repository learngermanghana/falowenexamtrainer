import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import { correctBiography } from "../services/profileService";
import TuitionStatusCard from "./TuitionStatusCard";
import { isPaymentsEnabled } from "../lib/featureFlags";

const formatDate = (value) => {
  if (!value) return "–";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "–";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const AccountSettings = () => {
  const { user, studentProfile, idToken, saveStudentProfile } = useAuth();
  const paymentsEnabled = isPaymentsEnabled();

  const [profile, setProfile] = useState({ biography: "" });
  const [statusMsg, setStatusMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCorrectingBio, setIsCorrectingBio] = useState(false);

  useEffect(() => {
    setProfile((prev) => ({ ...prev, biography: studentProfile?.biography || "" }));
  }, [studentProfile]);

  const billing = useMemo(() => {
    const termMonths = toNumber(studentProfile?.contractTermMonths, 1);

    const contractStart = studentProfile?.contractStart;
    const contractEnd = studentProfile?.contractEnd;

    const now = new Date();
    const endDate = contractEnd ? new Date(contractEnd) : null;
    const contractActive = !!endDate && !Number.isNaN(endDate.getTime()) && endDate > now;

    const tuitionFee = toNumber(studentProfile?.tuitionFee, 0);
    const paidAmount = toNumber(studentProfile?.initialPaymentAmount, 0);

    // If balanceDue isn’t trustworthy, fall back to derived.
    const derivedBalance = Math.max(tuitionFee - paidAmount, 0);
    const balanceDue =
      studentProfile?.balanceDue === undefined || studentProfile?.balanceDue === null
        ? derivedBalance
        : toNumber(studentProfile.balanceDue, derivedBalance);

    const paymentLabel =
      paidAmount <= 0
        ? "pending"
        : balanceDue <= 0
          ? "paid"
          : "partial";

    return {
      plan: `${termMonths}-month contract`,
      contractStart,
      contractEnd,
      contractActive,
      subscriptionStatus: contractActive ? "Active" : "Pending",
      paymentLabel,
      tuitionFee,
      paidAmount,
      balanceDue,
      invoiceEmail: studentProfile?.email || user?.email || "",
      paystackLink: studentProfile?.paystackLink || "",
      checkoutAmountOverride:
        paidAmount > 0 ? undefined : toNumber(studentProfile?.paymentIntentAmount, undefined),
    };
  }, [
    studentProfile?.contractTermMonths,
    studentProfile?.contractStart,
    studentProfile?.contractEnd,
    studentProfile?.tuitionFee,
    studentProfile?.initialPaymentAmount,
    studentProfile?.balanceDue,
    studentProfile?.paymentIntentAmount,
    studentProfile?.paystackLink,
    studentProfile?.email,
    user?.email,
  ]);

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
    setStatusMsg("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = { biography: (profile.biography || "").trim() };

    setIsSaving(true);
    setStatusMsg("");

    saveStudentProfile(payload)
      .then(() => setStatusMsg("Profile saved. Your classmates can now read your bio."))
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Could not save profile.";
        setStatusMsg(message);
      })
      .finally(() => setIsSaving(false));
  };

  const handleCorrectBiography = async () => {
    const draft = profile.biography || "";
    if (!draft.trim()) {
      setStatusMsg("Please add a short bio before asking the AI to correct it.");
      return;
    }

    setIsCorrectingBio(true);
    setStatusMsg("");

    try {
      const { corrected } = await correctBiography({
        text: draft,
        level: studentProfile?.level,
        idToken,
      });

      if (corrected) {
        setProfile((prev) => ({ ...prev, biography: corrected }));
        setStatusMsg("AI suggestions applied to your bio.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not correct your biography.";
      setStatusMsg(message);
    } finally {
      setIsCorrectingBio(false);
    }
  };

  if (!studentProfile) {
    return (
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Account &amp; Billing</h2>
          <span style={styles.badge}>No profile data</span>
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          We couldn't find any account data for this login. Once your campus profile syncs, we'll show contracts,
          payments, and billing details here.
        </p>
        <p style={{ ...styles.helperText, margin: 0 }}>Please contact your instructor or try again later.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {/* 1) Account */}
      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Account</h2>
          <span style={styles.levelPill}>{studentProfile.className || "No course"}</span>
        </div>
        <p style={styles.helperText}>Your core account information.</p>

        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
            <div style={styles.metaRow}>
              <span>Student code</span>
              <span style={styles.badge}>{studentProfile.status || "–"}</span>
            </div>
            <strong style={{ fontSize: 20 }}>{studentProfile.studentCode || "–"}</strong>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
            <div style={styles.metaRow}>
              <span>Name</span>
              <span style={styles.badge}>read-only</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile.name || user?.displayName || "Unknown"}</strong>
            <div style={{ ...styles.metaRow, marginTop: 8 }}>
              <span>Email</span>
              <span style={styles.badge}>managed</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile.email || user?.email || "(no email)"}</strong>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
            <div style={styles.metaRow}>
              <span>Contact</span>
              <span style={styles.badge}>current</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile.phone || "(no number)"}</strong>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>{studentProfile.location || "(location unknown)"}</p>
          </div>
        </div>
      </section>

      {/* 2) Bio (only editable item) */}
      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Bio</h2>
          <span style={styles.badge}>Editable</span>
        </div>
        <p style={styles.helperText}>This is shown to classmates on the members page.</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="biography">
              Class biography
            </label>
            <textarea
              id="biography"
              style={styles.textArea}
              value={profile.biography}
              onChange={handleChange("biography")}
              placeholder="Write 2–4 sentences about your goals, work, or hobbies."
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6, flexWrap: "wrap" }}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={handleCorrectBiography}
                disabled={isCorrectingBio}
              >
                {isCorrectingBio ? "AI is polishing ..." : "Correct with AI"}
              </button>
              <button type="submit" style={styles.primaryButton} disabled={isSaving}>
                {isSaving ? "Saving ..." : "Save"}
              </button>
            </div>
          </div>

          {statusMsg && (
            <div style={{ ...styles.errorBox, background: "#ecfdf3", color: "#065f46", borderColor: "#34d399" }}>
              {statusMsg}
            </div>
          )}
        </form>
      </section>

      {/* 3) Billing (single source of truth view) */}
      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Billing</h2>
          <span style={styles.levelPill}>{billing.subscriptionStatus}</span>
        </div>
        <p style={styles.helperText}>Contract + tuition in one place.</p>

        <div style={{ ...styles.gridTwo, gap: 10 }}>
          <div style={{ ...styles.card, margin: 0 }}>
            <div style={styles.metaRow}>
              <h3 style={{ margin: 0 }}>{billing.plan}</h3>
              <span style={styles.badge}>Seat: 1</span>
            </div>

            <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
              <div style={styles.metaRow}>
                <span>Contract</span>
                <strong>
                  {formatDate(billing.contractStart)} → {formatDate(billing.contractEnd)}
                </strong>
              </div>
              <div style={styles.metaRow}>
                <span>Next renewal</span>
                <strong>{formatDate(billing.contractEnd)}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Payment status</span>
                <strong>{billing.paymentLabel}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Billing email</span>
                <strong>{billing.invoiceEmail || "–"}</strong>
              </div>
            </div>

            {!paymentsEnabled && (
              <div
                style={{
                  ...styles.errorBox,
                  background: "#f1f5f9",
                  borderColor: "#cbd5e1",
                  color: "#0f172a",
                  marginTop: 12,
                }}
              >
                <strong>Payments are only available on the web app.</strong>
                <p style={{ ...styles.helperText, margin: "4px 0 0" }}>
                  Use the website to view/pay tuition through the secure payment portal.
                </p>
              </div>
            )}
          </div>

          <TuitionStatusCard
            level={studentProfile.level}
            paidAmount={billing.paidAmount}
            balanceDue={billing.balanceDue}
            tuitionFee={billing.tuitionFee}
            paystackLink={billing.paystackLink}
            checkoutAmountOverride={billing.checkoutAmountOverride}
            title="Tuition"
            description={`Billing email: ${billing.invoiceEmail || "add an email"}`}
          />
        </div>
      </section>
    </div>
  );
};

export default AccountSettings;
