import React from "react";
import { styles } from "../styles";

const NavigationGuide = () => {
  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          For your course book, results, and assignment submission, click Campus below. For exam preparation, click Exams Room
          below. To chat with your study buddy (student support), click the Study button below.
        </p>
      </div>
    </section>
  );
};

export default NavigationGuide;
