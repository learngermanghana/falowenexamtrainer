const {verifyA2MockAudio}=require("./verifyA2MockAudio");
const approved = Object.freeze({
  "teil-1": {
    "key": "a2/mock-hoeren/mock-08/teil-1.mp3",
    "sha256": "da9ddd126ef4328d616fa6a78a8a425533b3e7751e67030ddc6de9aad69a0aba",
    "bytes": 3809088
  },
  "teil-2": {
    "key": "a2/mock-hoeren/mock-08/teil-2.mp3",
    "sha256": "33ea6fa59fe8fc6bda4569794a165e3b7e459a1418df588c2f70003f4e53c552",
    "bytes": 1126656
  },
  "teil-3": {
    "key": "a2/mock-hoeren/mock-08/teil-3.mp3",
    "sha256": "737e73d9e41d0da0964b9affcf089f8f239cf2127a99652c49dd630f27f373c2",
    "bytes": 1886400
  },
  "teil-4": {
    "key": "a2/mock-hoeren/mock-08/teil-4.mp3",
    "sha256": "21c68092ee8364ee9f265760228af8a65afc8fa0630ae214d4eab29d958b74bb",
    "bytes": 3401568
  }
});
exports.verifyA2Mock08Audio = request => verifyA2MockAudio(approved, "mock-08", request);
