"use strict";

/**
 * Shared, server-only computation for four-skill, /25-per-skill Goethe practice
 * mocks. An exam registration owns its keys and must supply server-verified
 * writing/speaking receipts. No score sent by the browser is trusted.
 *
 * C1/C2 (and any B2 variant with a different rubric) must supply and test
 * their actual level-specific scoring policy before enabling this engine.
 */
const SCORE_POLICIES=Object.freeze({
  A1:Object.freeze({sectionMax:25,passMark:60}),
  A2:Object.freeze({sectionMax:25,passMark:60}),
  B1:Object.freeze({sectionMax:25,passMark:60}),
});

const normalize=(value)=>String(value ?? "").trim().toLowerCase();

function scoreObjectiveAnswers(answers={},key={},maxScore=25) {
  if (!key || typeof key !== "object" || Array.isArray(key)) throw new Error("Server answer key is required.");
  const entries=Object.entries(key);
  const correct=entries.reduce((n,[id,answer])=> n+(normalize(answers?.[id])===normalize(answer)?1:0),0);
  return {correct,total:entries.length,score:Number((correct/Math.max(1,entries.length)*maxScore).toFixed(1)),maxScore};
}

function verifiedSectionScore(sections,section,{sectionMax=25,errorCode="MOCK_SECTION_NOT_VERIFIED"}={}) {
  const record=sections?.[section],score=Number(record?.score);
  if(!record?.verified||!Number.isFinite(score)){
    const error=new Error(`Server-verified ${section} score is required before completion.`);
    error.code=errorCode;
    error.section=section;
    throw error;
  }
  return Math.max(0,Math.min(sectionMax,score));
}

function buildVerifiedFourSkillScore({level,state={},verifiedSections={},answerKeys={},policy,missingScoreErrorCode}={}){
  const configured=policy||SCORE_POLICIES[level];
  if(!configured||!Number.isFinite(Number(configured.sectionMax))||
    !Number.isFinite(Number(configured.passMark)))throw new Error("Level-specific scoring policy must be verified before this mock can be graded.");
  if(!answerKeys?.lesen||!answerKeys?.hoeren)throw new Error("Server-owned mock answer keys are required.");
  const sectionMax=Number(configured.sectionMax);
  if(sectionMax<=0||sectionMax>100)throw new Error("Invalid server section score maximum.");
  const lesen=scoreObjectiveAnswers(state?.lesenAnswers||{},answerKeys.lesen,sectionMax);
  const hoeren=scoreObjectiveAnswers(state?.hoerenAnswers||{},answerKeys.hoeren,sectionMax);
  const write=verifiedSectionScore(verifiedSections,"schreiben",{
    sectionMax,errorCode:missingScoreErrorCode||`${level}_MOCK_SECTION_NOT_VERIFIED`
  });
  const speak=verifiedSectionScore(verifiedSections,"sprechen",{
    sectionMax,errorCode:missingScoreErrorCode||`${level}_MOCK_SECTION_NOT_VERIFIED`
  });
  const sectionScores={lesen:lesen.score,hoeren:hoeren.score,schreiben:write,sprechen:speak};
  const total=Number(Object.values(sectionScores).reduce((sum,value)=>sum+value,0).toFixed(1));
  return {
    sectionScores,
    overall:{score:total,maxScore:Number((sectionMax*4).toFixed(1)),passed:total>=Number(configured.passMark)},
    objective:{lesen,hoeren},
  };
}

module.exports={SCORE_POLICIES,scoreObjectiveAnswers,verifiedSectionScore,buildVerifiedFourSkillScore};
