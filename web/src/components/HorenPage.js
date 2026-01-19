import React from "react";
import { styles } from "../styles";

const HorenPage = () => {
  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Hören samples</h2>
      <p style={{ margin: 0, color: "#4b5563" }}>
        Please open the link below for the Hören samples attached to it.
      </p>
      <a
        href="https://drive.google.com/file/d/1TuJKu6c3_KKMX4tp2neummtKieHP59_G/view?usp=sharing"
        target="_blank"
        rel="noreferrer"
        style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}
      >
        Open Hören samples
      </a>
    </section>
  );
};

export default HorenPage;
