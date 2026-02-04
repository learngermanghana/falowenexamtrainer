import React from "react";
import { styles } from "../styles";

const HorenPage = () => {
  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Hören samples</h2>
      <p style={{ margin: 0, color: "#4b5563" }}>
        Use the resources below for Hören practice in the exam room.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <a
          href="https://drive.google.com/file/d/1TuJKu6c3_KKMX4tp2neummtKieHP59_G/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.primaryButton, width: "fit-content", textDecoration: "none" }}
        >
          Open Hören samples
        </a>
        <a
          href="https://www.youtube.com/watch?list=PLg78ckjpHfZy5lkbq8bw26rLXkZ8jLRUN&v=H2eUgxXfkS4&feature=youtu.be"
          target="_blank"
          rel="noreferrer"
          style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
        >
          Hören example playlist (YouTube)
        </a>
      </div>
    </section>
  );
};

export default HorenPage;
