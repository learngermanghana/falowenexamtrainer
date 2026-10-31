import React from "react";

// Small, local SVG illustrations for A1 Goethe speaking object cards.
// No external image hosting, broken links or extra music/network requests.
const objectShapes = {
  Flasche: (
    <>
      <rect x="27" y="7" width="10" height="9" rx="2" />
      <path d="M27 16v6c0 3-7 7-7 13v19c0 4 3 6 7 6h10c4 0 7-2 7-6V35c0-6-7-10-7-13v-6" />
      <path d="M21 40h22v11H21z" fill="#c7d2fe" />
    </>
  ),
  Tür: (
    <>
      <path d="M19 7h29v51H19z" fill="#e0e7ff" />
      <path d="M23 10l21 3v43l-21 3z" fill="#c7d2fe" />
      <circle cx="38" cy="35" r="2" fill="#4338ca" stroke="none" />
    </>
  ),
  Bleistift: (
    <>
      <path d="M20 46l-3 13 13-4 25-25-10-10z" fill="#fde68a" />
      <path d="M45 20l5-5c2-2 4-2 6 0l4 4c2 2 2 4 0 6l-5 5z" fill="#ddd6fe" />
      <path d="M20 46l10 9M17 59l6-2" />
    </>
  ),
  "Glas Wasser": (
    <>
      <path d="M18 13h28l-4 43c-.2 3-3 5-6 5h-8c-3 0-6-2-6-5z" fill="#e0f2fe" />
      <path d="M22 34c6-5 14 5 20 0l-2 20c0 2-2 4-5 4h-6c-3 0-5-2-5-4z" fill="#7dd3fc" stroke="none" />
      <path d="M19 13h26" />
    </>
  ),
  Stadtplan: (
    <>
      <path d="M8 16l16-6 16 6 16-6v39l-16 6-16-6-16 6z" fill="#e0e7ff" />
      <path d="M24 10v39m16-33v39" />
      <path d="M13 33l8-4 9 5 9-11 12 5" stroke="#059669" />
    </>
  ),
  Radio: (
    <>
      <rect x="9" y="21" width="46" height="34" rx="6" fill="#e0e7ff" />
      <path d="M15 21l32-12" />
      <circle cx="23" cy="39" r="9" fill="#c7d2fe" />
      <circle cx="44" cy="35" r="3" fill="#4338ca" stroke="none" />
      <path d="M40 45h9M40 49h9" />
    </>
  ),
  Stuhl: (
    <>
      <rect x="19" y="9" width="27" height="30" rx="4" fill="#e0e7ff" />
      <rect x="15" y="37" width="35" height="8" rx="3" fill="#c7d2fe" />
      <path d="M20 45v15m25-15v15" />
    </>
  ),
  Formular: (
    <>
      <path d="M17 7h23l9 10v41H17z" fill="#f8fafc" />
      <path d="M40 7v11h9M23 29h20M23 36h20M23 43h11" />
      <path d="M32 52l5-2 8-8 3 3-8 8-2 5z" fill="#fde68a" />
    </>
  ),
};

export default function A1ExamObjectPicture({ label }) {
  return (
    <span style={{
      width: 58,
      height: 58,
      borderRadius: 12,
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
    }}>
      <svg
        viewBox="0 0 64 64"
        width="50"
        height="50"
        role="img"
        aria-label={`${label} picture`}
        fill="none"
        stroke="#4338ca"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {objectShapes[label] || objectShapes.Formular}
      </svg>
    </span>
  );
}
