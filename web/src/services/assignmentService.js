import axios from "axios";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

export const fetchAssignmentSummary = async ({ studentCode } = {}) => {
  const params = new URLSearchParams();
  if (studentCode) {
    params.append("studentCode", studentCode.trim());
  }

  const query = params.toString();
  const response = await axios.get(
    `${backendUrl}/api/assignments/summary${query ? `?${query}` : ""}`
  );

  return response.data;
};
