import axios from "axios";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

export const fetchResults = async ({ level, studentCode } = {}) => {
  const params = new URLSearchParams();
  if (level && level !== "all") params.append("level", level);
  if (studentCode) params.append("studentCode", studentCode);
  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await axios.get(`${backendUrl}/api/results${query}`);
  return response.data;
};
