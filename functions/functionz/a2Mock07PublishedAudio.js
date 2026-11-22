"use strict";
const {verifyA2MockAudio}=require("./verifyA2MockAudio");
// ZIP originals, not proof that the user-uploaded R2 versions match.
const APPROVED_A2_MOCK_07_AUDIO=Object.freeze({
  "teil-1": {
    "key": "a2/mock-hoeren/mock-07/teil-1.mp3",
    "sha256": "5225d40436dce11207e20e6a8f67c4cfd4b5264b22409e8935bd0ed6a325f976",
    "bytes": 3511296
  },
  "teil-2": {
    "key": "a2/mock-hoeren/mock-07/teil-2.mp3",
    "sha256": "5ae531d70f54a8c710183b17551ec867d5e65168809ea3039cc9789abb56cab2",
    "bytes": 1220256
  },
  "teil-3": {
    "key": "a2/mock-hoeren/mock-07/teil-3.mp3",
    "sha256": "c2ee5b3ae4b119c1ab1a870bc78861f284cd06a880f090e7d21586e1f5d1fb9b",
    "bytes": 2340576
  },
  "teil-4": {
    "key": "a2/mock-hoeren/mock-07/teil-4.mp3",
    "sha256": "2ed55d438cfc9cca70c3cd167e378d00f1dcd6b47ba804088fb7a782ec69f335",
    "bytes": 3730176
  }
});
const verifyA2Mock07Audio = request => verifyA2MockAudio(APPROVED_A2_MOCK_07_AUDIO, "mock-07", request);
module.exports={APPROVED_A2_MOCK_07_AUDIO,verifyA2Mock07Audio};
