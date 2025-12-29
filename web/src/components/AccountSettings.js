import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import { correctBiography } from "../services/profileService";
import TuitionStatusCard from "./TuitionStatusCard";
import { isPaymentsEnabled } from "../lib/featureFlags";

const formatDate = (value) => {
  if (!value) return "–";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "–";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatMoney = (value) => {
  const amount = Number(value) || 0;
  return `GH₵${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const AccountSettings = () => {
  const { user, studentProfile, idToken, saveStudentProfile } = useAuth();
  const paymentsEnabled = isPaymentsEnabled();
  const [profile, setProfile] = useState({
    biography: "",
  });
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCorrectingBio, setIsCorrectingBio] = useState(false);

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      biography: studentProfile?.biography || "",
    }));
  }, [studentProfile, user]);

  const subscription = useMemo(() => {
    const contractEnd = studentProfile?.contractEnd ? new Date(studentProfile.contractEnd) : null;
    const isActive = contractEnd && !Number.isNaN(contractEnd.getTime()) && contractEnd.getTime() > Date.now();
    const contractMonths = Number(studentProfile?.contractTermMonths) || null;
    const paymentStatus = (studentProfile?.paymentStatus || "pending").toLowerCase();

    const plan =
      contractMonths === 6
        ? "6-month contract"
        : contractMonths === 1
        ? "1-month access"
        : paymentStatus === "paid"
        ? "6-month contract"
        : paymentStatus === "partial"
        ? "1-month access"
        : "Payment required";

    return {
      plan,
      renewalDate: formatDate(studentProfile?.contractEnd),
      status: isActive ? "Active" : "Pending",
      seats: 1,
      paymentMethod: paymentsEnabled ? "Paystack" : "Web portal",
      invoiceEmail: studentProfile?.email || user?.email || "",
    };
  }, [paymentsEnabled, studentProfile?.contractEnd, studentProfile?.contractTermMonths, studentProfile?.paymentStatus, studentProfile?.email, user?.email]);

  const paymentAlert = useMemo(() => {
    const balanceDue = Math.max(Number(studentProfile?.balanceDue) || 0, 0);
    if (balanceDue <= 0) return null;
    if (!studentProfile?.contractEnd) return null;
    const contractEndMs = Date.parse(studentProfile.contractEnd);
    if (!Number.isFinite(contractEndMs)) return null;
    const dayMs = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((contractEndMs - Date.now()) / dayMs);
    if (daysLeft < 0 || daysLeft > 15) return null;

    return {
      balanceDue,
      daysLeft,
      message:
        daysLeft === 0
          ? `Your access ends today and you still owe ${formatMoney(balanceDue)}. Please make a payment to keep access.`
          : `You still owe ${formatMoney(balanceDue)} and have ${daysLeft} day${daysLeft === 1 ? "" : "s"} left. Please make a payment to keep access.`,
    };
  }, [studentProfile?.balanceDue, studentProfile?.contractEnd]);

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
    setStatus("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      biography: profile.biography.trim(),
    };

    setIsSaving(true);
    setStatus("");

    saveStudentProfile(payload)
      .then(() => {
        setStatus("Profile saved. Your classmates can now read your bio.");
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Could not save profile.";
        setStatus(message);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleCorrectBiography = async () => {
    const draft = profile.biography || "";
    if (!draft.trim()) {
      setStatus("Please add a short bio before asking the AI to correct it.");
      return;
    }

    setIsCorrectingBio(true);
    setStatus("");

    try {
      const { corrected } = await correctBiography({ text: draft, level: studentProfile?.level, idToken });
      if (corrected) {
        setProfile((prev) => ({ ...prev, biography: corrected }));
        setStatus("AI suggestions applied to your bio.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not correct your biography.";
      setStatus(message);
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
        <p style={{ ...styles.helperText, margin: 0 }}>
          Please contact your instructor or try again later.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Account overview</h2>
          <span style={styles.levelPill}>{studentProfile.className || "No course"}</span>
        </div>
        <p style={styles.helperText}>Quick view of your key info.</p>

        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
            <div style={styles.metaRow}>
              <span>Student code</span>
              <span style={styles.badge}>{studentProfile.status || "–"}</span>
            </div>
            <strong style={{ fontSize: 20 }}>{studentProfile.studentCode}</strong>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#f8fafc" }}>
            <div style={styles.metaRow}>
              <span>Course</span>
              <span style={styles.badge}>{studentProfile.level || "–"}</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile.className || "(no class selected)"}</strong>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Next renewal: <strong>{subscription.renewalDate}</strong>
            </p>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#ecfdf3", border: "1px solid #34d399" }}>
            <div style={styles.metaRow}>
              <span>Contact</span>
              <span style={styles.badge}>current</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile.phone || "(no number)"}</strong>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              {studentProfile.location || "(location unknown)"}
            </p>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Account settings</h2>
          <span style={styles.badge}>Profile &amp; communication</span>
        </div>
        <p style={styles.helperText}>
          Your name and login email are managed by Falowen to keep linked apps in sync. Contact support to update them.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <div style={{
            ...styles.card,
            margin: 0,
            padding: 12,
            background: "#f8fafc",
            borderColor: "#e2e8f0",
          }}>
            <div style={styles.metaRow}>
              <span>Display name</span>
              <span style={styles.badge}>read-only</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile?.name || user?.displayName || "Unknown"}</strong>
            <div style={{ ...styles.metaRow, marginTop: 8 }}>
              <span>Login email</span>
              <span style={styles.badge}>managed by admin</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile?.email || user?.email || "(no email)"}</strong>
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="biography">
              Class biography
            </label>
            <textarea
              id="biography"
              style={styles.textArea}
              value={profile.biography}
              onChange={handleChange("biography")}
              placeholder="Write 2-4 sentences about your work, goals, or hobbies. Classmates will see this on the member page."
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
                {isSaving ? "Saving ..." : "Save changes"}
              </button>
            </div>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Your bio is read-only on the member page. Edit it here anytime.
            </p>
          </div>
          {status && (
            <div style={{ ...styles.errorBox, background: "#ecfdf3", color: "#065f46", borderColor: "#34d399" }}>
              {status}
            </div>
          )}
        </form>
      </section>

      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Subscription &amp; billing</h2>
          <span style={styles.levelPill}>{subscription.status}</span>
        </div>
        <p style={styles.helperText}>Essential billing info at a glance.</p>
        {paymentAlert ? <div style={styles.errorBox}>{paymentAlert.message}</div> : null}

        <div style={{ ...styles.gridTwo, gap: 10 }}>
          <div style={{ ...styles.card, margin: 0 }}>
            <div style={styles.metaRow}>
              <h3 style={{ margin: 0 }}>{subscription.plan}</h3>
              <span style={styles.badge}>Seat: {subscription.seats}</span>
            </div>
            <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
              <div style={styles.metaRow}>
                <span>Next renewal</span>
                <strong>{subscription.renewalDate}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Payment</span>
                <strong>{studentProfile.paymentStatus || "pending"}</strong>
              </div>
            </div>
          </div>

          <TuitionStatusCard
            level={studentProfile.level}
            paidAmount={studentProfile.initialPaymentAmount}
            balanceDue={studentProfile.balanceDue}
            tuitionFee={studentProfile.tuitionFee}
            checkoutAmountOverride={
              Number(studentProfile?.initialPaymentAmount || 0) > 0
                ? undefined
                : studentProfile?.paymentIntentAmount
            }
            title="Balance & tuition"
            description={`Billing email: ${subscription.invoiceEmail || "add an email"}`}
          />
        </div>
      </section>
    </div>
  );
};

export default AccountSettings;
