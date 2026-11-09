import axios from "axios";
import { getBackendUrl } from "./backendUrl";

const root = () => getBackendUrl();
const headers = idToken => {
  if (!idToken) throw new Error("Please sign in to use B1 Mock 4 Hören.");
  return { Authorization: `Bearer ${idToken}` };
};
export async function getB1Mock4HoerenQuestions(idToken) {
  const response = await axios.get(`${root()}/b1-mock-04/hoeren/questions`, {
    headers: headers(idToken),
  });
  return response.data;
}
export async function scoreB1Mock4Hoeren({ idToken, answers }) {
  const response = await axios.post(`${root()}/b1-mock-04/hoeren/score`, { answers }, {
    headers: headers(idToken),
  });
  return response.data;
}
