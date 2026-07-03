import React from "react";
import { styles } from "../styles";

class AppStartupBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Falowen startup failed", error, info);
  }

  handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main
        role="alert"
        style={{
          minHeight: "100vh",
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background: "linear-gradient(160deg, #eff6ff 0%, #ffffff 55%, #dbeafe 100%)",
          boxSizing: "border-box",
        }}
      >
        <section
          style={{
            ...styles.card,
            width: "100%",
            maxWidth: 460,
            display: "grid",
            justifyItems: "center",
            gap: 14,
            textAlign: "center",
            border: "1px solid #bfdbfe",
            borderRadius: 24,
            padding: 28,
          }}
        >
          <img
            src="/logo192.png"
            alt="Falowen"
            width="88"
            height="88"
            style={{ borderRadius: 22, objectFit: "contain" }}
          />
          <h1 style={{ margin: 0, fontSize: 26 }}>Falowen could not open</h1>
          <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.65 }}>
            Something interrupted the app while it was starting. Check your internet connection, then try again.
          </p>
          <button type="button" style={styles.primaryButton} onClick={this.handleRetry}>
            Retry
          </button>
        </section>
      </main>
    );
  }
}

export default AppStartupBoundary;
