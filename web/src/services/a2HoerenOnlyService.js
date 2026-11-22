import axios from "axios";
import { getBackendUrl } from "./backendUrl";

// A single authenticated call; no new AI request or mock attempt.
const scoreHoerenOnly=async(level,{mockId,answers,idToken})=>{
  if(!idToken)throw new Error("Please sign in to check your Hören answers.");
  const response=await axios.post(`${getBackendUrl()}/${level}-mock/hoeren-practice/score`,
    {mockId,answers},{headers:{Authorization:`Bearer ${idToken}`}});
  return response.data;
};

export const scoreA2HoerenOnly = request => scoreHoerenOnly("a2", request);
export const scoreA1HoerenOnly = request => scoreHoerenOnly("a1", request);
