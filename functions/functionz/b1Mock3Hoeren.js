"use strict";
// B1 Mock 3 Hören: all four teacher-uploaded MP3s transcribed in Falowen source review.
// All 30 questions are grounded in the actual user-provided audio content.
// Every answer stays on the server and is omitted from the public payload.
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
const t3=(number,question,answer)=>({
  part:3,number,kind:"richtig-falsch",question,
  options:[{id:"richtig",label:"Richtig"},{id:"falsch",label:"Falsch"}],answer,
});
const who=(number,question,answer)=>({
  part:4,number,kind:"multiple-choice",question,
  options:[
    {id:"a",label:"Moderator Markus Baumann"},
    {id:"b",label:"Claudia Weber"},
    {id:"c",label:"Thomas Klein"},
  ],
  answer,
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

  // Teil 3 — Radtour an der Ostsee: seven transcript-verified Richtig/Falsch items.
  // Transcript labels Nummer 1–7 correspond to B1 questions 16–22.
  t3(16,"Am Freitag hat es während der Radtour fast den ganzen Tag geregnet.","falsch"),
  t3(17,"Schon nach ungefähr zehn Kilometern musste die Gruppe Toms Fahrrad reparieren.","richtig"),
  t3(18,"Im Hotel in Lübeck konnten sie ihre Fahrräder sicher im Innenhof abstellen.","richtig"),
  t3(19,"Die Gruppe hat am Abend im empfohlenen Fischrestaurant gegessen.","falsch"),
  t3(20,"Obwohl die Bedienung langsam war, hat die Pizza sehr gut geschmeckt.","richtig"),
  t3(21,"Am Samstag startete die Gruppe später als geplant, weil Tom verschlafen hatte.","richtig"),
  t3(22,"Am Sonntag erreichte die Gruppe Travemünde trotz Gegenwinds ohne weitere Pannen.","richtig"),
  // Teil 4 — Urlaub auf Balkonien: a=Moderator Markus Baumann,
  // b=Claudia Weber, c=Thomas Klein. Audio plays the discussion twice.
  who(23,"Ich wollte im Urlaub keinen Wecker stellen und keine Koffer packen.","b"),
  who(24,"Neue Landschaften und andere Kulturen brauche ich, um abzuschalten.","c"),
  who(25,"Staus, Zugverspätungen und Hotelrechnungen können das Reisen sehr stressig machen.","a"),
  who(26,"Für einen Urlaub am Meer oder in Bergdörfern nehme ich eine anstrengende Anreise in Kauf.","c"),
  who(27,"Endlich konnte ich ungelesene Bücher lesen und im Stadtwald spazieren gehen.","b"),
  who(28,"Mich interessiert, wie wichtig das Geld für die Urlaubsentscheidung ist.","a"),
  who(29,"Das gesparte Geld nutze ich lieber für Restaurantbesuche vor Ort.","b"),
  who(30,"Ich spare lieber an anderen Dingen im Alltag als bei meinen Reisen.","c"),
]);
const PARTS=Object.freeze([
  {part:1,label:"Fünf kurze Alltagstexte",key:"b1/mock-hoeren/mock-03/teil-1.mp3",count:10,verified:true,
   instruction:"Hören Sie fünf kurze Texte. In dieser Falowen-Übung beantworten Sie je Text eine Richtig/Falsch-Aussage und eine ergänzende a/b/c-Frage. Die Originalansage nennt nur eine Aussage je Text. Die hochgeladene Aufnahme enthält beide Durchgänge."},
  {part:2,label:"Durchsage am Hauptbahnhof Frankfurt",key:"b1/mock-hoeren/mock-03/teil-2.mp3",count:5,verified:true,
   instruction:"Hören Sie die Durchsage einmal und wählen Sie für jede Aufgabe a, b oder c."},
  {part:3,label:"Gespräch über eine Radtour an der Ostsee",key:"b1/mock-hoeren/mock-03/teil-3.mp3",count:7,verified:true,
   instruction:"Hören Sie das Gespräch über die gemeinsame Radtour einmal. Wählen Sie für die Aussagen 16 bis 22 Richtig oder Falsch."},
  {part:4,label:"Radiodiskussion: Urlaub auf Balkonien",key:"b1/mock-hoeren/mock-03/teil-4.mp3",count:8,verified:true,
   instruction:"Hören Sie die Diskussion mit Moderator Markus Baumann und den Gästen Claudia Weber und Thomas Klein. Ordnen Sie die Aussagen 23 bis 30 der richtigen Person zu (a, b oder c). Die Aufnahme enthält zwei Durchgänge."},
]);
// Parts follow the standard Goethe B1 10/5/7/8 format. The 30 verified
// answers support a complete Hören module, not a verified four-module mock.
const VERIFIED_COUNT=QUESTIONS.length;
const EXPECTED_FULL_COUNT=30;
function publicB1Mock3Hoeren(){
  return {
    mockId:"b1-mock-03",level:"B1",section:"hoeren",
    practiceOnly:true,partial:false,questionCount:VERIFIED_COUNT,verifiedQuestionCount:VERIFIED_COUNT,fullTargetCount:EXPECTED_FULL_COUNT,
    introductionNotice:"Dieses Hören-Modul enthält 30 Aufgaben in vier Teilen, passend zu den Originalaufnahmen. Teil 1 bietet je Text eine Richtig/Falsch- und eine ergänzende a/b/c-Aufgabe; die ältere Audioansage erwähnt nur die Richtig/Falsch-Aufgabe. Die Auswertung ist ein eigenständiges Hörmodul, kein verifiziertes Gesamtergebnis aus vier Modulen.",
    parts:PARTS.map(p=>({...p,questions:QUESTIONS.filter(q=>q.part===p.part).map(({answer,...publicQuestion})=>publicQuestion)})),
  };
}
function markB1Mock3Hoeren(answers){
  if(!answers||typeof answers!=="object"||Array.isArray(answers))throw Error("Invalid answers");
  if(Object.keys(answers).length!==VERIFIED_COUNT)throw Error("Answer all 30 listening questions.");
  const perPart=PARTS.map(p=>({part:p.part,correct:0,total:p.count}));
  let correct=0;
  for(const q of QUESTIONS){
    const value=answers[String(q.number)];
    if(typeof value!=="string"||!q.options.some(o=>o.id===value))throw Error("Invalid answer for question "+q.number);
    if(value===q.answer){correct++;perPart[q.part-1].correct++;}
  }
  return {correct,total:VERIFIED_COUNT,percentage:Math.round(correct/VERIFIED_COUNT*100),perPart};
}
module.exports={PARTS,QUESTIONS,VERIFIED_COUNT,EXPECTED_FULL_COUNT,publicB1Mock3Hoeren,markB1Mock3Hoeren};
