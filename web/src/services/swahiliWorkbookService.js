import { getBackendUrl } from "./backendUrl";

export async function saveSwahiliWorkbook(user, work) {
  if (!user?.uid) throw new Error("Sign in to submit your workbook.");
  const token = await user.getIdToken();
  const response = await fetch(getBackendUrl() + "/swahili/workbook/submit", {
    method:"POST", headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},
    body:JSON.stringify(work)
  });
  const result = await response.json().catch(()=>({}));
  if (!response.ok || result.ok !== true) throw new Error(result.error || "Could not save your workbook.");
  return result;
}
