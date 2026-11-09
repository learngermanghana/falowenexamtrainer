import axios from "axios";
import { getBackendUrl } from "./backendUrl";

export async function scoreB1Mock4Lesen({idToken,answers}){
  if(!idToken)throw new Error("Please sign in to submit B1 Mock 04 Lesen.");
  const response=await axios.post(`${getBackendUrl()}/b1-mock-04/lesen/score`,{answers},{
    headers:{Authorization:`Bearer ${idToken}`},
  });
  return response.data;
}
