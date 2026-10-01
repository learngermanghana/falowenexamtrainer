import React from "react";

const LEGAL_BASE = "https://legal.falowen.app";

const links = [
  { label: "Enrollment Agreement", href: `${LEGAL_BASE}/#payment-agreement` },
  { label: "Privacy", href: `${LEGAL_BASE}/#privacy-policy` },
  { label: "Terms", href: `${LEGAL_BASE}/#terms-of-service` },
];

const LegalFooter = ({ compact = false }) => (
  <footer
    aria-label="Falowen legal links"
    style={{
      marginTop: compact ? 12 : 20,
      paddingTop: compact ? 10 : 14,
      borderTop: "1px solid #e5e7eb",
      color: "#64748b",
      fontSize: 12,
      textAlign: "center",
    }}
  >
    <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
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
    </div>
    {!compact ? (
      <p style={{ margin: "8px 0 0" }}>
        Enrollment, payment and use of Falowen are subject to the applicable agreement and policies.
      </p>
    ) : null}
  </footer>
);

export default LegalFooter;
