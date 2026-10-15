const {rubricWeights,assessRubric,verifiedCorrections}=require("../../../functions/functionz/speakingRubric");
test("A1 question rounds omit organization and weight successful task completion most strongly",()=>{
  expect(rubricWeights("A1","Teil 2")).toEqual({taskCompletion:.4,languageAccuracy:.2,vocabulary:.15,interaction:.25,organization:0});
  const scoring=assessRubric({taskCompletion:{score:4,evidence:"Questions asked"},
    languageAccuracy:{score:2},vocabulary:{score:3},interaction:{score:4}},
    {level:"A1",teil:"Teil 2",answers:["Wie viel kostet das?"]});
  expect(scoring.percent).toBe(86);
  expect(scoring.dimensions.organization).toBeUndefined();
  expect(scoring.transcriptOnly).toBe(true);
});
test("continuous C2 presentations are assessed for coherence rather than partner interaction",()=>{
  const weights=rubricWeights("C2","Teil 1");
  expect(weights.interaction).toBe(0);
  expect(weights.organization).toBe(.4);
  expect(assessRubric({taskCompletion:{score:4},languageAccuracy:{score:4},
    vocabulary:{score:4},organization:{score:4}},{level:"C2",teil:"Teil 1",answers:["Ein differenziertes Argument."]}).percent).toBe(100);
});
test("invalid dimensions cannot produce fictitious scores and corrections must match saved speech",()=>{
  expect(assessRubric({taskCompletion:4},{level:"A2",teil:"Teil 1",answers:["Hallo."]})).toBeNull();
  expect(verifiedCorrections([{original:"Ich gehen.",corrected:"Ich gehe.",explanation:"Verb form"},
    {original:"Invented",corrected:"Nein.",explanation:"Imaginary"}],["Ich gehen."])).toEqual([
      {original:"Ich gehen.",corrected:"Ich gehe.",explanation:"Verb form"}
    ]);
});