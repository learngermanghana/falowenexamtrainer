import React from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";

const Navigation = ({ activePage, onNavigate }) => {
  const { setResult, setError } = useExam();

  const handleNavigate = (page) => {
    setResult(null);
    setError("");
    onNavigate(page);
  };

  const navButtons = [
    { key: "sprechen", label: "Sprechen" },
    { key: "schreiben", label: "Schreiben" },
    { key: "vocabs", label: "Vokabeln" },
  ];

  return (
    <div style={styles.nav}>
      {navButtons.map((button) => (
        <button
          key={button.key}
          style={
            activePage === button.key ? styles.navButtonActive : styles.navButton
          }
          onClick={() => handleNavigate(button.key)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default Navigation;
