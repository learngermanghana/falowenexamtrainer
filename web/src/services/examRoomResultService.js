import axios from "axios";
import { getBackendUrl } from "./backendUrl";

export const saveExamRoomResult = async ({
  idToken,
  level,
  section,
  setId,
  title,
  score,
  total,
  percent,
  passed,
  attemptId,
  attemptNumber = 1,
  resultType = "practice",
  route = "",
  sectionScores = {},
} = {}) => {
  if (!idToken) throw new Error("Please sign in again before saving this result.");

  const response = await axios.post(
    `${getBackendUrl()}/exam-room/results`,
    {
      level,
      section,
      setId,
      title,
      score,
      total,
      percent,
      passed,
      attemptId,
      attemptNumber,
      resultType,
      route,
      sectionScores,
    },
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    },
  );

  return response?.data || {};
};

export default saveExamRoomResult;
