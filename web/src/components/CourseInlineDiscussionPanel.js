import React from "react";
import ClassDiscussionPanel from "./ClassDiscussionPanel";

const CourseInlineDiscussionPanel = (props) => (
  <section style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 16, background: "#eff6ff", display: "grid", gap: 12 }}>
    <p style={{ margin: 0, color: "#1d4ed8", fontWeight: 800, fontSize: 13 }}>Class activity</p>
    <ClassDiscussionPanel embedded {...props} />
  </section>
);
export default CourseInlineDiscussionPanel;
