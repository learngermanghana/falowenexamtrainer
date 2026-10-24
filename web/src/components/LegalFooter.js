import React from "react";

const LEGAL_BASE = "https://legal.falowen.app";

const links = [
  { label: "Enrollment Agreement", href: `${LEGAL_BASE}/#payment-agreement` },
  { label: "Privacy", href: `${LEGAL_BASE}/#privacy-policy` },
  { label: "Terms", href: `${LEGAL_BASE}/#terms-of-service` },
];

const LegalFooter = ({ compact = false }) => (
  <footer
    aria-label="Falowen footer"
    style={{
      marginTop: compact ? 12 : 18,
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      background: "linear-gradient(180deg, #ffffff, #f8fafc)",
      padding: compact ? "14px 16px" : "18px 20px",
      color: "#64748b",
      fontSize: 12,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "grid", gap: 3 }}>
        <strong style={{ color: "#0f172a", fontSize: 14 }}>Falowen</strong>
        {!compact ? (
          <span>Learning by Learn Language Education Academy</span>
        ) : null}
      </div>

      <nav
        aria-label="Falowen legal links"
        style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#475569", textDecoration: "none", fontWeight: 700 }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>

    {!compact ? (
      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span>Use Falowen for your course learning and exam preparation.</span>
        <span>© {new Date().getFullYear()} Falowen</span>
      </div>
    ) : null}
  </footer>
);

export default LegalFooter;
