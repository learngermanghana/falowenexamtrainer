import {microphoneFailureMessage,speakingTurnLabel} from "./liveSpeakDevice";

test("microphone permission and device errors give useful recovery guidance",()=>{
  expect(microphoneFailureMessage({name:"NotAllowedError"})).toMatch(/Allow microphone permission/);
  expect(microphoneFailureMessage({name:"NotFoundError"})).toMatch(/No microphone was found/);
  expect(microphoneFailureMessage({name:"NotReadableError"})).toMatch(/microphone is in use/);
  expect(microphoneFailureMessage({name:"AbortError"})).toMatch(/interrupted/);
  expect(microphoneFailureMessage({name:"UnknownError"})).toMatch(/Could not start/);
});

test("exam state prioritizes examiner audio, listening, processing and transcript review",()=>{
  const s={session:{sessionId:"s"},voiceState:"ready"};
  expect(speakingTurnLabel({...s,voiceState:"playing"})).toBe("Examiner speaking");
  expect(speakingTurnLabel({...s,voiceState:"blocked"})).toBe("Examiner audio needs a replay");
  expect(speakingTurnLabel({...s,recording:true})).toBe("Listening to your answer");
  expect(speakingTurnLabel({...s,busy:true})).toBe("Processing your answer");
  expect(speakingTurnLabel({...s,pending:true})).toBe("Check your recorded answer");
  expect(speakingTurnLabel({...s,taskReady:true})).toBe("Task complete — review feedback");
  expect(speakingTurnLabel({...s,expired:true})).toBe("Exam time has ended");
  expect(speakingTurnLabel(s)).toBe("Your turn to speak");
});
