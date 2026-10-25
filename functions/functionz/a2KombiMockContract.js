"use strict";
// A2 Mocks 4–8: immutable three-module assessment identity.
const ANSWER_KEYS=require("./a2KombiReadingKeys");
const MOCK_IDS=Object.freeze(Object.keys(ANSWER_KEYS));
const VERSION="three-module-v1";
const SECTIONS=Object.freeze(["lesen","schreiben","sprechen"]);
function isA2KombiMock(id){return MOCK_IDS.includes(String(id||""));}
function attemptContract(mockId,version=VERSION){
 if(!isA2KombiMock(mockId))throw new Error("Unknown A2 Kombiprüfung mock.");
 if(version!==VERSION)throw new Error("A2 Kombiprüfung attempt version mismatch.");
 return {mockId,assessmentVersion:VERSION,sections:[...SECTIONS],maxPoints:75};
}
module.exports={MOCK_IDS,VERSION,SECTIONS,ANSWER_KEYS,isA2KombiMock,attemptContract};
