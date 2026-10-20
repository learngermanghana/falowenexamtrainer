"use strict";
const {resolveTrialAudioRequest,AUDIO_BY_PART,TRIAL_LEVEL,TRIAL_SAMPLE} = require("../freeHoerenTrial");
test("public trial reuses only existing A1 Hören Sample 1 parts from mock-01",()=>{
 expect(TRIAL_LEVEL).toBe("A1");
 expect(TRIAL_SAMPLE).toBe("sample-1");
 expect(Object.keys(AUDIO_BY_PART)).toEqual(["teil-1","teil-2","teil-3"]);
 expect(resolveTrialAudioRequest("teil-1")).toEqual({
   level:"A1",mockId:"mock-01",part:"teil-1",key:"a1/mock-hoeren/mock-01/teil-1.mp3"
 });
 expect(resolveTrialAudioRequest("teil-2").key).toBe("a1/mock-hoeren/mock-01/teil-2.mp3");
 expect(resolveTrialAudioRequest("teil-3").key).toBe("a1/mock-hoeren/mock-01/teil-3.mp3");
});
test.each(["../mock-02","teil-4","teil-01","teil-1/evil","a2","",null,undefined,["teil-1"]])(
 "public trial never authorizes other audio key %p",part=>{
   expect(resolveTrialAudioRequest(part)).toBeNull();
 });
