"use strict";
const {isRegisteredA2Mock}=require("./a2MockRegistry");

// A server attempt is mandatory for verified scores; never confuse mock IDs.
const isA2SpeakingAttemptBindingSafe = ({mockId,attemptId}={}) =>
  isRegisteredA2Mock(mockId) && Boolean(String(attemptId||"").trim());

module.exports={isA2SpeakingAttemptBindingSafe};
