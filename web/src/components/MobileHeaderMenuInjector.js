import React from "react";
import { useLocation } from "react-router-dom";

const MENU_LINKS = [
  { label: "Course Book", href: "/campus/course" },
  { label: "Submit Work", href: "/campus/submit" },
  { label: "Falowen A.I", href: "/campus/grammar" },
  { label: "Results", href: "/campus/results" },
  { label: "Exam File", href: "/campus/examFile" },
  { label: "Account", href: "/campus/account" },
];

const MobileHeaderMenuInjector = () => {
  const location = useLocation();
  const path = String(location.pathname || "");

  if (!(path === "/" || path.startsWith("/campus"))) return null;

  return (
    <details className="mobile-campus-menu">
      <summary>☰ Menu</summary>
      <nav className="mobile-campus-menu__links" aria-label="Mobile campus menu">
        {MENU_LINKS.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </details>
  );
};

export default MobileHeaderMenuInjector;
