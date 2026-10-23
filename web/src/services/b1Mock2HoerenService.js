import axios from "axios";
import { getBackendUrl } from "./backendUrl";
const base=getBackendUrl();
const headers=idToken=>({Authorization:`Bearer ${idToken}`});
export async function getB1Mock2HoerenQuestions(idToken){
  if(!idToken)throw new Error("Sign in to open B1 listening practice.");
  const {data}=await axios.get(`${base}/b1-mock-02/hoeren/questions`,{headers:headers(idToken)});
  return data;
}
export async function scoreB1Mock2Hoeren({idToken,answers}){
  if(!idToken)throw new Error("Sign in to submit your answers.");
  const {data}=await axios.post(`${base}/b1-mock-02/hoeren/score`,
    {answers},{headers:headers(idToken)});
  return data;
}
