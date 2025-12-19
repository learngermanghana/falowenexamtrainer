import React from "react";
import HomeActions from "./HomeActions";
import { styles } from "../styles";
import ClassCalendarCard from "./ClassCalendarCard";

const PlanPage = ({ onSelect, classCalendarRef }) => {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div ref={classCalendarRef}>
        <ClassCalendarCard />
      </div>

      <HomeActions onSelect={onSelect} />
    </div>
  );
};

export default PlanPage;
