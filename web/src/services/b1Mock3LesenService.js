import axios from "axios";
import {getBackendUrl} from "./backendUrl";
const root=getBackendUrl()+"/b1-mock-03/lesen";
const opts=idToken=>({headers:{Authorization:"Bearer "+idToken}});
export const getB1Mock3LesenQuestions=async idToken=>(await axios.get(root+"/questions",opts(idToken))).data;
export const startB1Mock3Lesen=async idToken=>(await axios.post(root+"/start",{},opts(idToken))).data;
export const submitB1Mock3Lesen=async({idToken,attemptId,answers})=>
  (await axios.post(root+"/score",{attemptId,answers},opts(idToken))).data;
