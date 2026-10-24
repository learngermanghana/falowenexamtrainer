import axios from "axios";
import {getBackendUrl} from "./backendUrl";
const root=getBackendUrl();
const headers=idToken=>({Authorization:"Bearer "+idToken});
export async function getB1Mock3HoerenQuestions(idToken){
  if(!idToken)throw new Error("Bitte melden Sie sich an.");
  const {data}=await axios.get(root+"/b1-mock-03/hoeren/questions",{headers:headers(idToken)});
  return data;
}
export async function scoreB1Mock3Hoeren({idToken,answers}){
  if(!idToken)throw new Error("Bitte melden Sie sich an.");
  const {data}=await axios.post(root+"/b1-mock-03/hoeren/score",{answers},{headers:headers(idToken)});
  return data;
}
