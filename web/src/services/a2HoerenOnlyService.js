import axios from "axios";
import { getBackendUrl } from "./backendUrl";

// A single authenticated call; no new AI request or mock attempt.
export const scoreA2HoerenOnly=async({mockId,answers,idToken})=>{
  if(!idToken)throw new Error("Please sign in to check your Hören answers.");
  const response=await axios.post(`${getBackendUrl()}/a2-mock/hoeren-practice/score`,
    {mockId,answers},{headers:{Authorization:`Bearer ${idToken}`}});
  return response.data;
};
