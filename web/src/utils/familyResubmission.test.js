import {parseFamilyResubmission,replaceFamilyTranscript,validFamilyRecording} from "./familyResubmission";
const original="TEIL 1\n1. Es kostet zehn Euro.\n\nTEIL 2\nMeine Familie ist klein.\n\nTEIL 3\n1. gern";
test("a new recording replaces only Teil 2",()=>{
 const next=replaceFamilyTranscript(original,"Meine Mutter heißt Anna.");
 expect(parseFamilyResubmission(next)).toEqual({"1":"1. Es kostet zehn Euro.","2":"Meine Mutter heißt Anna.","3":"1. gern"});
 expect(validFamilyRecording(next,{audioUrl:"https://example.com/voice.webm",transcript:"Meine Mutter heißt Anna."})).toBe(true);
 expect(validFamilyRecording(next,{audioUrl:"https://example.com/voice.webm",transcript:"Meine Familie ist klein."})).toBe(false);
});
test("duplicate or missing headings are rejected",()=>{
 expect(replaceFamilyTranscript(original.replace("TEIL 3","TEIL 2"),"Neu")).toBeNull();
 expect(parseFamilyResubmission("TEIL 2\nHallo")).toBeNull();
});
