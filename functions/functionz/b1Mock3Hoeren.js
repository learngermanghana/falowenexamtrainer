"use strict";
// Private, server-owned B1 Mock 3 Hören content. Sourced from the teacher's
// Falowen-B1-Mock-03.zip; answers are deliberately excluded from public API.
const PARTS=Object.freeze([
  {part:1,label:"Kurze Mitteilungen aus dem Alltag",count:10,repeats:2,key:"b1/mock-hoeren/mock-03/teil-1.mp3"},
  {part:2,label:"Durchsage am Hauptbahnhof Frankfurt",count:5,repeats:1,key:"b1/mock-hoeren/mock-03/teil-2.mp3"},
  {part:3,label:"Eine Radtour an die Ostsee",count:7,repeats:1,key:"b1/mock-hoeren/mock-03/teil-3.mp3"},
  {part:4,label:"Urlaub zu Hause oder verreisen?",count:8,repeats:2,key:"b1/mock-hoeren/mock-03/teil-4.mp3"},
]);
const R="richtig-falsch",M="multiple-choice";
const ITEMS=[
  [R,"Thomas möchte, dass Claudia ihm zwanzig Euro bringt oder überweist, weil er kein Bargeld hat."],
  [M,"Wo befindet sich Thomas laut seiner Nachricht?",["In einem Café in der Innenstadt","Im Supermarkt in der Innenstadt","Im Büro an seinem Schreibtisch"]],
  [R,"Das Flugzeug wird voraussichtlich mit einer Verspätung von zehn Minuten in Frankfurt landen."],
  [M,"Wann wird das Flugzeug voraussichtlich das Ziel erreichen?",["In zehn Minuten","In zwanzig Minuten","Genau pünktlich"]],
  [R,"Frau Meyer möchte den Termin wegen einer länger dauernden Vorstandssitzung auf elf Uhr verschieben."],
  [M,"Um wie viel Uhr soll das Treffen laut Frau Meyer stattdessen stattfinden?",["Um zehn Uhr","Um zwölf Uhr","Um elf Uhr"]],
  [R,"Lukas und sein Gesprächspartner möchten am Nachmittag ins Fitnessstudio gehen."],
  [M,"Was möchten die Personen nach der Arbeit machen?",["Ins Fitnessstudio gehen","An den Badesee fahren","Zu Hause bleiben"]],
  [R,"Das Geschäft bleibt am kommenden Samstag wegen Renovierungsarbeiten geschlossen."],
  [M,"Warum bleibt das Geschäft am kommenden Samstag geschlossen?",["Wegen Renovierungsarbeiten","Wegen eines Feiertags","Wegen schlechten Wetters"]],
  [M,"Um wie viele Minuten verzögert sich die Abfahrt des Intercity?",["Um zehn Minuten.","Um zwanzig Minuten.","Um dreißig Minuten."]],
  [M,"An welchen Abschnitten fährt der Intercity heute ein?",["An den Abschnitten A und B.","An den Abschnitten C und D.","An den Abschnitten E und F."]],
  [M,"Warum sollte man den Fahrstuhl am Querbahnsteig nutzen?",["Weil die Rolltreppe wegen Wartungsarbeiten gesperrt ist.","Weil der Fahrstuhl schneller ist.","Weil die Treppen überlastet sind."]],
  [M,"Welche Zwischenhalte entfallen beim Ersatzzug nach Hannover?",["Bremen und Hamburg.","Wolfsburg und Gifhorn.","Kassel und Göttingen."]],
  [M,"Wo befindet sich das Abteil für die erste Klasse im Ersatzzug?",["Im Wagen Nummer eins.","Im Wagen Nummer zwei.","Im Wagen Nummer drei."]],
  [R,"Anna konnte die Radtour schon am Donnerstag beginnen."],
  [R,"Entgegen der Wettervorhersage schien am Freitag die Sonne."],
  [R,"Toms Fahrrad hatte auf der Strecke keine technischen Probleme."],
  [R,"Die Fahrräder konnten im Innenhof des Hotels abgestellt werden."],
  [R,"Das empfohlene Fischrestaurant hatte wegen einer Feier geschlossen."],
  [R,"Am Samstagmorgen wachte Tom pünktlich durch seinen Wecker auf."],
  [R,"Die Gruppe erreichte trotz starken Gegenwinds das Ziel in Travemünde."],
  [M,"Wer wollte im Urlaub vor allem keinen Wecker stellen und keinen Koffer packen?",["Markus Baumann","Claudia Weber","Thomas Klein"]],
  [M,"Wer braucht unbedingt neue Landschaften und andere Kulturen zum Abschalten?",["Markus Baumann","Claudia Weber","Thomas Klein"]],
  [M,"Wer weist darauf hin, dass Verreisen oft mit Stau und verspäteten Zügen verbunden ist?",["Markus Baumann","Claudia Weber","Thomas Klein"]],
  [M,"Wer nimmt die Anstrengungen der Reise gerne für den Aufenthalt am Mittelmeer in Kauf?",["Markus Baumann","Claudia Weber","Thomas Klein"]],
  [M,"Wer hat die Zeit zu Hause genutzt, um lange Spaziergänge im lokalen Stadtwald zu machen?",["Markus Baumann","Claudia Weber","Thomas Klein"]],
  [M,"Wer fragt die Gäste nach der finanziellen Seite und der Rolle der Kosten?",["Markus Baumann","Claudia Weber","Thomas Klein"]],
  [M,"Wer gibt das gesparte Geld lieber für gemütliche Restaurantbesuche vor Ort aus?",["Markus Baumann","Claudia Weber","Thomas Klein"]],
  [M,"Wer spart lieber im Alltag an anderen Stellen, anstatt beim Reisen Kompromisse zu machen?",["Markus Baumann","Claudia Weber","Thomas Klein"]],
];
const ANSWER_KEY=Object.freeze([
  "richtig","b","falsch","a","richtig","c","falsch","b","richtig","a",
  "b","c","a","b","c",
  "falsch","richtig","falsch","richtig","richtig","falsch","richtig",
  "b","c","a","c","b","a","b","c",
]);
const RF_OPTIONS=Object.freeze([{id:"richtig",label:"Richtig"},{id:"falsch",label:"Falsch"}]);
const QUESTIONS=Object.freeze(ITEMS.map(([kind,question,choices],index)=>{
  const number=index+1;
  const part=number<=10?1:number<=15?2:number<=22?3:4;
  return Object.freeze({part,number,kind,question,
    options:kind===R?RF_OPTIONS:choices.map((label,i)=>({id:"abc"[i],label})),
    answer:ANSWER_KEY[index]});
}));
const QA_WARNINGS=Object.freeze([
  "Teil 3 question 16 tests the recorded Beispiel Nummer 0, and the recorded Nummer 5 (Pizzeria) is not separately tested. Confirm with the teacher before release.",
  "Teil 4 roles C and D change implied speaker identity in the middle of the discussion. Regenerate/re-record the affected dialogue before release.",
]);
function publicB1Mock3Hoeren(){
  return {
    mockId:"b1-mock-03",level:"B1",section:"hoeren",practiceOnly:true,
    questionCount:30,
    introductionNotice:"Die vollständigen Aufnahmen enthalten die vorgesehenen Wiederholungen. Hören Sie jede Audiodatei nur einmal ab.",
    parts:PARTS.map(p=>({...p,questions:QUESTIONS.filter(q=>q.part===p.part)
      .map(({answer,...publicQuestion})=>publicQuestion)}))
  };
}
function markB1Mock3Hoeren(answers){
  if(!answers||typeof answers!=="object"||Array.isArray(answers))throw new Error("Invalid answers");
  if(Object.keys(answers).length!==30)throw new Error("Answer all 30 questions.");
  let correct=0;
  const perPart=PARTS.map(p=>({part:p.part,correct:0,total:p.count}));
  for(const question of QUESTIONS){
    const submitted=answers[String(question.number)];
    if(typeof submitted!=="string"||!question.options.some(o=>o.id===submitted))throw new Error("Invalid answer for "+question.number);
    if(submitted===question.answer){correct++;perPart[question.part-1].correct++;}
  }
  return {correct,total:30,percentage:Math.round(correct/30*100),perPart};
}
module.exports={PARTS,QUESTIONS,ANSWER_KEY,QA_WARNINGS,publicB1Mock3Hoeren,markB1Mock3Hoeren};
