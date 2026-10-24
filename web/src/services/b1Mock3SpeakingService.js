import axios from "axios";
import {getBackendUrl} from "./backendUrl";
const base=getBackendUrl()+"/b1-mock-03/sprechen";
const auth=idToken=>({headers:{Authorization:"Bearer "+idToken}});
export const getB1Mock3SpeakingConfig=async idToken=>
  (await axios.get(base+"/config",auth(idToken))).data;
export const startB1Mock3Speaking=async({idToken,topicChoice})=>
  (await axios.post(base+"/start",{topicChoice},auth(idToken))).data;
export const saveB1Mock3SpeakingPart=async({idToken,attemptId,teil,sessionId})=>
  (await axios.post(base+"/part",{attemptId,teil,sessionId},auth(idToken))).data;
export const verifyB1Mock3Speaking=async({idToken,attemptId,sessionIds})=>
  (await axios.post(base+"/score",{attemptId,sessionIds},auth(idToken))).data;
