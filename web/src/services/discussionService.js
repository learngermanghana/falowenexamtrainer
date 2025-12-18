import axios from "axios";

const backendUrl =
  process.env.REACT_APP_BACKEND_URL || (process.env.NODE_ENV === "production" ? "" : "http://localhost:5000");

const authHeaders = (idToken) =>
  idToken
    ? {
        Authorization: `Bearer ${idToken}`,
      }
    : {};

export const correctDiscussionText = async ({ text, level, idToken }) => {
  const response = await axios.post(
    `${backendUrl}/api/discussion/correct`,
    { text, level },
    { headers: authHeaders(idToken) }
  );

  return response.data;
};
