import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClassDiscussionPanel from "./ClassDiscussionPanel";
import ClassMembersTab from "./ClassMembersTab";
import { styles } from "../styles";

const ClassDiscussionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showMembers = new URLSearchParams(location.search).get("tab") === "members";

  if (!showMembers) return <ClassDiscussionPanel />;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Class members</h2>
        <p style={{ ...styles.helperText, margin: 0 }}>
          View the classmates in your level and class. Email addresses are not shown.
        </p>
        <button
          type="button"
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/discussion")}
        >
          Open group discussion
        </button>
      </section>
      <ClassMembersTab />
    </div>
  );
};

export default ClassDiscussionPage;
