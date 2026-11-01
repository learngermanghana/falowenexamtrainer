import React, { useMemo, useState } from "react";

const AUTH_FIELDS = [
  "response_type", "client_id", "redirect_uri", "code_challenge",
  "code_challenge_method", "scope", "resource", "state",
];

const styles = {
  page: { minHeight: "100vh", background: "#f5f7fb", padding: "42px 18px", fontFamily: "inherit", color: "#15253b" },
  card: { maxWidth: 560, margin: "0 auto", background: "#fff", borderRadius: 18, padding: "32px 28px", boxShadow: "0 12px 42px rgba(17, 40, 75, .08)" },
  title: { margin: "0 0 12px", fontSize: 28, lineHeight: 1.2 },
  subtle: { lineHeight: 1.65, color: "#526277" },
  button: { display: "block", width: "100%", border: 0, borderRadius: 10, background: "#1765bc", color: "#fff", fontWeight: 700, padding: "15px 18px", cursor: "pointer", fontSize: 16 },
  link: { color: "#1765bc" },
};

export default function ChatGPTConnectPage({ user, studentProfile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const params = useMemo(() => {
    const query = new URLSearchParams(window.location.search);
    return Object.fromEntries(AUTH_FIELDS.map((field) => [field, query.get(field) || ""]));
  }, []);
  const name = String(studentProfile?.name || studentProfile?.fullName || user?.displayName || user?.email || "Student");
  const hasRequest = AUTH_FIELDS.every((field) => Boolean(params[field]));

  const authorize = async () => {
    setLoading(true);
    setError("");
    try {
      if (!user) throw new Error("Please sign in to Falowen first.");
      const idToken = await user.getIdToken(true);
      const response = await fetch("/api/chatgpt/approve", {
        method: "POST", headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ ...params, idToken }),
      });
      const result = await response.json();
      if (!response.ok || !result.redirectUrl) throw new Error(result.error || "Could not connect this account.");
      const redirect = new URL(result.redirectUrl);
      if (redirect.origin !== "https://chatgpt.com" || redirect.pathname !== "/connector_platform_oauth_redirect") {
        throw new Error("The connection returned an unexpected destination.");
      }
      window.location.assign(redirect.toString());
    } catch (e) {
      setError(e.message || "Please try again.");
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card} aria-labelledby="chatgpt-connect-title">
        <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#1765bc", letterSpacing: ".06em" }}>FALOWEN</p>
        <h1 id="chatgpt-connect-title" style={styles.title}>Connect Falowen to ChatGPT</h1>
        <p style={styles.subtle}>
          Signed in as <strong>{name}</strong>. Connect your Falowen student account to get personalised
          help with your German lessons in ChatGPT.
        </p>
        <div style={{ padding: "12px 18px", background: "#f4f8fc", borderRadius: 12 }}>
          <strong>ChatGPT can read:</strong>
          <ul style={{ lineHeight: 1.85, marginBottom: 0 }}>
            <li>Your course level and lesson topics</li>
            <li>Your assignment list and links to Campus</li>
            <li>Your recorded marks and teacher feedback</li>
          </ul>
        </div>
        <p style={styles.subtle}>
          ChatGPT cannot submit assignments, change grades, access payment records, or start timed exams.
          Official work stays on Falowen Campus.
        </p>
        {error && <p role="alert" style={{ color: "#b21d2d" }}>{error}</p>}
        {!hasRequest ? (
          <p role="alert" style={{ color: "#b21d2d" }}>The ChatGPT connection request is incomplete. Start again from ChatGPT.</p>
        ) : (
          <button style={{ ...styles.button, opacity: loading ? .65 : 1 }} type="button" onClick={authorize} disabled={loading || !user}>
            {loading ? "Connecting…" : "Allow read-only access"}
          </button>
        )}
        <p style={{ textAlign: "center", marginTop: 20 }}>
          <a href="/campus" style={styles.link}>Cancel and return to Falowen Campus</a>
        </p>
      </section>
    </main>
  );
}
