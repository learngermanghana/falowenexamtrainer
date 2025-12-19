import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";

const SUBSCRIPTION_FEATURES = [
  "Unlimited exam simulations for speaking & writing",
  "Feedback exports for instructors",
  "From-my-mistakes vocabulary decks",
  "Push reminders for daily drills",
];

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

const AccountSettings = () => {
  const { user, studentProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    goal: "Pass B2",
    timezone: "Europe/Berlin",
    reminder: "push+email",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      name: studentProfile?.name || user?.displayName || "",
      email: studentProfile?.email || user?.email || prev.email,
      goal: studentProfile?.goal || prev.goal,
    }));
  }, [studentProfile, user]);

  const subscription = useMemo(
    () => ({
      plan: studentProfile?.paymentStatus === "paid" ? "6-month contract" : "1-month starter",
      renewalDate: formatDate(studentProfile?.contractEnd),
      status: studentProfile?.paymentStatus === "paid" ? "Active" : "Pending",
      seats: 1,
      paymentMethod: studentProfile?.paystackLink ? "Paystack" : "Unknown",
      invoiceEmail: profile.email || user?.email || "",
    }),
    [profile.email, studentProfile?.contractEnd, studentProfile?.paystackLink, studentProfile?.paymentStatus, user?.email]
  );

  const tuitionFee = studentProfile?.tuitionFee ?? null;
  const balanceDue = studentProfile?.balanceDue ?? null;
  const paidAmount =
    tuitionFee === null || balanceDue === null ? null : Math.max(tuitionFee - balanceDue, 0);

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
    setStatus("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("Changes saved (local only)");
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
        <p style={styles.helperText}>
          Here you can review your basic details, contract status, and the last sync between campus and Exam Coach.
        </p>

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
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>Unique identifier for support & invoices.</p>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#fef3c7", border: "1px solid #f59e0b" }}>
            <div style={styles.metaRow}>
              <span>Level & course</span>
              <span style={styles.badge}>{studentProfile.level || "–"}</span>
            </div>
            <strong style={{ fontSize: 16 }}>
              Plan: {subscription.plan} · Start {formatDate(studentProfile.contractStart)}
            </strong>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Runs until {formatDate(studentProfile.contractEnd)}. Agreement updates will be shown here.
            </p>
          </div>

          <div style={{ ...styles.card, margin: 0, background: "#ecfdf3", border: "1px solid #34d399" }}>
            <div style={styles.metaRow}>
              <span>Contact</span>
              <span style={styles.badge}>current</span>
            </div>
            <strong style={{ fontSize: 16 }}>{studentProfile.phone || "(no number)"}</strong>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Location: {studentProfile.location || "(unknown)"} · Emergency contact: {studentProfile.emergencyContactPhone || "–"}
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
          Update your display name and contact preferences. Changes are currently saved locally only.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="name">
                Display name
              </label>
              <input
                id="name"
                type="text"
                value={profile.name}
                onChange={handleChange("name")}
                style={{ ...styles.select, padding: "10px 12px" }}
                placeholder="e.g., Alex Miller"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="email">
                Login email
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={handleChange("email")}
                style={{ ...styles.select, padding: "10px 12px" }}
                placeholder="name@email.com"
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="goal">
                Learning goal
              </label>
              <input
                id="goal"
                type="text"
                value={profile.goal}
                onChange={handleChange("goal")}
                style={{ ...styles.select, padding: "10px 12px" }}
                placeholder="e.g., pass B1"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="timezone">
                Time zone for reminders
              </label>
              <select
                id="timezone"
                value={profile.timezone}
                onChange={handleChange("timezone")}
                style={styles.select}
              >
                <option value="Europe/Berlin">Europe/Berlin (CET)</option>
                <option value="Europe/Vienna">Europe/Vienna</option>
                <option value="Europe/Zurich">Europe/Zurich</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="reminder">
              Notifications
            </label>
            <select
              id="reminder"
              value={profile.reminder}
              onChange={handleChange("reminder")}
              style={styles.select}
            >
              <option value="push+email">Push &amp; email</option>
              <option value="push">Push only</option>
              <option value="email">Email only</option>
              <option value="none">No reminders</option>
            </select>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Enable push using the button in the top right. Email reminders follow automatically.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="submit" style={styles.primaryButton}>
              Save changes
            </button>
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
        <p style={styles.helperText}>
          Your current level stays active until the next renewal. Invoice emails go to
          {" "}
          <strong>{subscription.invoiceEmail || "your address"}</strong>.
        </p>

        <div style={styles.gridTwo}>
          <div style={{ ...styles.card, margin: 0 }}>
            <div style={styles.metaRow}>
              <h3 style={{ margin: 0 }}>{subscription.plan}</h3>
              <span style={styles.badge}>Seat: {subscription.seats}</span>
            </div>
            <ul style={styles.checklist}>
              {SUBSCRIPTION_FEATURES.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button style={styles.secondaryButton} type="button">
                Change plan
              </button>
              <a
                href={studentProfile.paystackLink || "https://paystack.com/pay/falowen"}
                style={{ ...styles.secondaryButton, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                Open Paystack
              </a>
            </div>
          </div>

          <div style={{ ...styles.card, margin: 0 }}>
            <h3 style={{ margin: "0 0 8px 0" }}>Payments &amp; dates</h3>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={styles.metaRow}>
                <span>Next renewal</span>
                <strong>{subscription.renewalDate}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Payment status</span>
                <strong>{studentProfile.paymentStatus || "pending"}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Balance due</span>
                <strong>{balanceDue === null ? "–" : `₦${balanceDue}`}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Paid so far</span>
                <strong>{paidAmount === null ? "–" : `₦${paidAmount}`}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Billing email</span>
                <strong>{subscription.invoiceEmail || "(please add)"}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <h2 style={styles.sectionTitle}>Contract &amp; consent</h2>
          <span style={styles.badge}>{studentProfile.contractTermMonths ? `${studentProfile.contractTermMonths} months` : "–"}</span>
        </div>
        <p style={styles.helperText}>
          Review what you signed. Here you'll find key agreements, privacy notes, and consents.
        </p>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <div style={{ ...styles.card, margin: 0, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
            <div style={styles.metaRow}>
              <span>Status</span>
              <span style={styles.levelPill}>{subscription.status}</span>
            </div>
            <strong style={{ fontSize: 16 }}>
              Contract {subscription.plan} · Start {formatDate(studentProfile.contractStart)}
            </strong>
            <ul style={{ ...styles.checklist, marginTop: 10 }}>
              <li>Ends on {formatDate(studentProfile.contractEnd)}</li>
              <li>Privacy policy accepted</li>
              <li>Cancellation possible anytime via support</li>
            </ul>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <a
                href={studentProfile.paystackLink || "https://paystack.com/pay/falowen"}
                style={{ ...styles.secondaryButton, textDecoration: "none" }}
              >
                Open Paystack
              </a>
              <button style={styles.secondaryButton} type="button">
                Download PDF
              </button>
            </div>
          </div>

          <div style={{ ...styles.card, margin: 0 }}>
            <h3 style={{ margin: "0 0 8px 0" }}>Consents</h3>
            <div style={{ display: "grid", gap: 8 }}>
              <div style={styles.metaRow}>
                <span>Notifications</span>
                <strong>{profile.reminder === "none" ? "disabled" : "active"}</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Data sharing with coach</span>
                <strong>allowed</strong>
              </div>
              <div style={styles.metaRow}>
                <span>Parents/sponsor informed</span>
                <strong>confirmed via email</strong>
              </div>
            </div>
            <p style={{ ...styles.helperText, margin: "10px 0 0" }}>
              If anything changes, please tell us promptly—we'll update contract, invoices, and reminders automatically.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountSettings;
