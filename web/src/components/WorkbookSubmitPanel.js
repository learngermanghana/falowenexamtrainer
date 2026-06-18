import React from "react";
import CourseWorkbookAssignmentSubmission from "./CourseWorkbookAssignmentSubmission";

const WorkbookSubmitPanel = (props) => (
  <div style={{ background: "#ffffff", border: "1px solid #bfdbfe", borderRadius: 14, marginTop: 10, padding: 8 }}>
    <CourseWorkbookAssignmentSubmission {...props} />
  </div>
);

export default WorkbookSubmitPanel;
