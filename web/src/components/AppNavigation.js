import React from "react";
import { styles } from "../styles";
import { NAVIGABLE_PAGES } from "./PageRouter";

const AppNavigation = ({ activePage, onSelectPage }) => {
  return (
    <nav style={{ ...styles.nav, marginBottom: 16 }}>
      {NAVIGABLE_PAGES.map((item) => (
        <button
          key={item.key}
          style={activePage === item.key ? styles.navButtonActive : styles.navButton}
          onClick={() => onSelectPage(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default AppNavigation;
