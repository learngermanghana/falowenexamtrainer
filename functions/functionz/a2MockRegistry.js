"use strict";

// Register every future A2 full mock here. All A2 mocks use the same verified
// attempt, section-marking and final-result publication pipeline.
// Question keys live on the server: browser-supplied marks are never trusted.
const MOCK_TWO = Object.freeze({
  id: "a2-mock-02",
  title: "A2 Mock 2",
  assignmentId: "A2-MOCK-02",
  route: "/campus/course/a2-mock-2",
  lesen: Object.freeze(Object.fromEntries(
    ["b","a","b","c","a","b","c","b","c","a","b","a","b","b","a","d","a","c","b","x"]
      .map((answer,index)=>[String(index+1),answer]))),
  hoeren: Object.freeze(Object.fromEntries(
    ["c","b","b","a","b","a","b","c","d","e","c","b","b","b","b","ja","nein","nein","nein","ja"]
      .map((answer,index)=>[String(index+1),answer]))),
});
const KNOWN_A2_MOCKS = Object.freeze(["a2-mock-01", MOCK_TWO.id]);
const getA2MockDefinition = id => id === MOCK_TWO.id ? MOCK_TWO : null;
const isRegisteredA2Mock = id => KNOWN_A2_MOCKS.includes(String(id || ""));
module.exports={MOCK_TWO,KNOWN_A2_MOCKS,getA2MockDefinition,isRegisteredA2Mock};
