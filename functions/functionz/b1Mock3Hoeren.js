"use strict";
// B1 Mock 3 Hören: teacher-supplied audio and the provided textual content for
// Teile 1 and 2. Only these TEN items are content-verified. Never fabricate
// scored answers for the untranscribed Teile 3 and 4.
const tf=(number, question, answer)=>({
  part:1,number,kind:"richtig-falsch",question,
  options:[{id:"richtig",label:"Richtig"},{id:"falsch",label:"Falsch"}],answer,
});
const mc=(number,question,a,b,c,answer)=>({
  part:2,number,kind:"multiple-choice",question,
  options:[{id:"a",label:a},{id:"b",label:b},{id:"c",label:c}],answer,
});

const m1=(number, question, a,b,c, answer)=>({
  part:1,number,kind:"multiple-choice",question,
  options:[{id:"a",label:a},{id:"b",label:b},{id:"c",label:c}],answer,
});
const QUESTIONS=Object.freeze([
  tf(1,"Thomas hat im Supermarkt nur seine EC-Karte dabei, aber kein Bargeld.","richtig"),
  m1(2,"Wie viel Geld bittet Thomas Claudia, ihm zu schicken?",
    "30 Euro.","20 Euro.","50 Euro.","b"),
  tf(3,"Das Flugzeug kommt voraussichtlich zwanzig Minuten zu spät in Frankfurt an.","falsch"),
  m1(4,"Wann wird das Flugzeug voraussichtlich in Frankfurt landen?",
    "In zehn Minuten.","In dreißig Minuten.","In einer Stunde.","a"),
  tf(5,"Frau Meyer möchte das Gespräch mit Herrn Weber von 10 Uhr auf 11 Uhr verschieben.","richtig"),
  m1(6,"Warum möchte Frau Meyer den Termin verschieben?",
    "Weil Herr Weber verreist ist.","Weil eine Vorstandssitzung länger dauert.","Weil der Besprechungsraum geschlossen ist.","b"),
  tf(7,"Lukas und sein Gesprächspartner wollen wegen der Hitze lieber ins Fitnessstudio gehen.","falsch"),
  m1(8,"Wie möchten die beiden nach der Arbeit zum Badesee fahren?",
    "Mit ihren Fahrrädern.","Mit dem Bus.","Mit dem Auto.","a"),
  tf(9,"Das Geschäft ist am Samstag geschlossen und öffnet am Montag wieder.","richtig"),
  m1(10,"Ab wann ist das Geschäft am Montag wieder geöffnet?",
    "Ab acht Uhr.","Ab zehn Uhr.","Ab neun Uhr.","c"),
  mc(11,"Warum hat der Intercity nach Hamburg-Altona Verspätung?",
    "Wegen eines Unwetters.","Wegen einer technischen Störung am Triebwagen.","Wegen eines Streiks.","b"),
  mc(12,"In welchen Bahnsteigabschnitten hält der verspätete Intercity heute?",
    "In den Abschnitten E und F.","In den Abschnitten A und B.","In den Abschnitten C und D.","a"),
  mc(13,"Was sollen Reisende mit schwerem Gepäck benutzen?",
    "Die Rolltreppe am Gleis.","Die Treppe in der Bahnhofshalle.","Den Fahrstuhl am Querbahnsteig.","c"),
  mc(14,"Wann und wo fährt der Ersatzzug in Richtung Hannover ab?",
    "Um 14:20 Uhr von Gleis 4.","Um 14:12 Uhr von Gleis 6.","Um 14:12 Uhr von Gleis 4.","b"),
  mc(15,"Welche Aussage gilt für den Ersatzzug?",
    "Die Fahrkarten sind nicht mehr gültig.","Alle Reisenden behalten ihren reservierten Sitzplatz.","Die Fahrkarten bleiben gültig, aber ein reservierter Sitzplatz ist nicht garantiert.","c"),
]);
const PARTS=Object.freeze([
  {part:1,label:"Fünf kurze Alltagstexte",key:"b1/mock-hoeren/mock-03/teil-1.mp3",count:10,verified:true,
   instruction:"Hören Sie fünf kurze Texte. In dieser Falowen-Übung beantworten Sie je Text eine Richtig/Falsch-Aussage und eine ergänzende a/b/c-Frage. Die Originalansage nennt nur eine Aussage je Text. Die hochgeladene Aufnahme enthält beide Durchgänge."},
  {part:2,label:"Durchsage am Hauptbahnhof Frankfurt",key:"b1/mock-hoeren/mock-03/teil-2.mp3",count:5,verified:true,
   instruction:"Hören Sie die Durchsage einmal und wählen Sie für jede Aufgabe a, b oder c."},
  {part:3,label:"Hörverstehen · Teil 3",key:"b1/mock-hoeren/mock-03/teil-3.mp3",count:7,verified:false,
   instruction:"Die Originalaufnahme ist vorhanden. Die Aussagen 16–22 und ihre Lösungsschlüssel müssen anhand des Audioinhalts überprüft werden."},
  {part:4,label:"Hörverstehen · Teil 4",key:"b1/mock-hoeren/mock-03/teil-4.mp3",count:8,verified:false,
   instruction:"Die Originalaufnahme ist vorhanden. Die Zuordnungsaufgaben 23–30 und ihre Lösungsschlüssel müssen anhand des Audioinhalts überprüft werden."},
]);
// The final two part counts are a *draft allocation* based on Falowen's B1
// standardized practice structure, not claims of task numbering in the audio.
// This record is a partial practice only; it must not be used as a full 30-item mock.
const VERIFIED_COUNT=QUESTIONS.length;
const EXPECTED_FULL_COUNT=30;
function publicB1Mock3Hoeren(){
  return {
    mockId:"b1-mock-03",level:"B1",section:"hoeren",
    practiceOnly:true,partial:true,verifiedQuestionCount:VERIFIED_COUNT,fullTargetCount:EXPECTED_FULL_COUNT,
    introductionNotice:"Teil 1 und Teil 2 haben derzeit 15 inhaltlich geprüfte Aufgaben. Die Audios für Teil 3 und 4 sind vorhanden; die passenden Aufgaben werden erst nach Prüfung ihrer Wortlaute veröffentlicht. Dies ist kein vollständiges oder verifiziertes vierteiliges Mock-Ergebnis.",
    parts:PARTS.map(p=>({...p,questions:QUESTIONS.filter(q=>q.part===p.part).map(({answer,...publicQuestion})=>publicQuestion)})),
  };
}
function markB1Mock3Hoeren(answers){
  if(!answers||typeof answers!=="object"||Array.isArray(answers))throw Error("Invalid answers");
  if(Object.keys(answers).length!==VERIFIED_COUNT)throw Error("Answer all 15 verified listening questions.");
  const perPart=PARTS.filter(p=>p.verified).map(p=>({part:p.part,correct:0,total:p.count}));
  let correct=0;
  for(const q of QUESTIONS){
    const value=answers[String(q.number)];
    if(typeof value!=="string"||!q.options.some(o=>o.id===value))throw Error("Invalid answer for question "+q.number);
    if(value===q.answer){correct++;perPart[q.part-1].correct++;}
  }
  return {correct,total:VERIFIED_COUNT,percentage:Math.round(correct/VERIFIED_COUNT*100),perPart};
}
module.exports={PARTS,QUESTIONS,VERIFIED_COUNT,EXPECTED_FULL_COUNT,publicB1Mock3Hoeren,markB1Mock3Hoeren};
