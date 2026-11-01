"use strict";
// Private examiner keys. Never import into the learner web bundle.
const lesen = Object.freeze({
  "1":"b","2":"a","3":"b","4":"b","5":"c",
  "6":"b","7":"c","8":"c","9":"a","10":"c",
  "11":"b","12":"a","13":"b","14":"c","15":"b",
  "16":"c","17":"b","18":"a","19":"x","20":"e",
});
const hoeren = Object.freeze({
  "1":"a","2":"b","3":"a","4":"b","5":"b",
  "6":"a","7":"b","8":"b","9":"a","10":"b",
  "11":"b","12":"c","13":"a","14":"b","15":"c",
  "16":"richtig","17":"richtig","18":"falsch","19":"richtig","20":"falsch",
});
const writing = Object.freeze({
  teil1:{situation:"Sie möchten sich am kommenden Samstag mit Ihrem Freund Thomas im Park treffen.",
    recipient:"Thomas",wordTarget:"20–30",
    requiredPoints:["Thomas zu einem Treffen im Park einladen","Uhrzeit und Treffpunkt nennen","Sagen, was Thomas mitbringen soll"]},
  teil2:{situation:"Sie haben ein Angebot für ein Wochenend-Seminar im Hotel Alpenblick gesehen und wollen teilnehmen sowie ein Zimmer buchen.",
    recipient:"Hotel Alpenblick",wordTarget:"30–40",
    requiredPoints:["Anreisetag und Anzahl Übernachtungen nennen","Zimmerwunsch beschreiben","Zimmerpreis erfragen"]},
});
const speaking = Object.freeze({
  teil1:{themes:["Freizeit: Wochenende, Sport, Freunde, Abend","Wohnen & Alltag: Wohnung, Einkaufen, Frühstück, Nachbarn"],task:"Vier persönliche Fragen zu einer Kartenauswahl stellen und entsprechende Partnerfragen beantworten."},
  teil2:{topic:"Mein letzter Urlaub",points:["Reiseziel","Begleitung","Aktivitäten","Wetter"],alternative:"Mein Lieblingstag in der Woche"},
  teil3:{situation:"Überraschungsparty für einen gemeinsamen Freund planen",points:["Zeit","Ort","Essen, Getränke, Musik","Geschenk"]},
});
module.exports = {lesen,hoeren,writing,speaking};
