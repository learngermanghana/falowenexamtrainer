import React from "react";
import { courseBookStyles } from "./courseBookStyles";

export default function CourseBookLevelSelector({ levels, value, onChange }) {
  return (
    <label style={{ display: "grid", gap: 4, minWidth: 120 }}>
      <span style={{ color: "#dbeafe", fontSize: 12, fontWeight: 800 }}>Level</span>
      <select style={courseBookStyles.heroSelect} value={value} onChange={(e) => onChange(e.target.value)}>
        {levels.map((level) => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>
    </label>
  );
}
