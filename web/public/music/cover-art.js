// Twenty first-party SVG covers: no third-party image fetches and no R2 reads.
// Bind approved releases by exact MP3 key, so reused lessons cannot take on another recording's art.
const byRecording=Object.freeze({
  "music/a1/day-02/Ich heiße Bina.mp3": "a1-introduction",
  "music/a1/day-03/Wer bist du_ Sag es mir!.mp3": "a1-identity",
  "music/a1/day-04/Meine Nummer, meine Adresse.mp3": "a1-address",
  "music/a1/day-14/Einsteigen – Wir fahren los.mp3": "a1-journey",
  "music/a1/day-21/Heute kann ich leider nicht.mp3": "a1-busy",
  "music/a1/day-22/Arzttermin.mp3": "a1-doctor",
  "music/a2/day-01/Ein nettes Gespräch.mp3": "a2-conversation",
  "music/a2/day-03/Zwei Städte.mp3": "a2-cities",
  "music/a2/day-15/Kleine Momente.mp3": "a2-moments",
  "music/a2/day-16/Kleine Schritte.mp3": "a2-wellbeing",
  "music/a2/day-11/Mit dem Rad, mit dem Zug.mp3": "a2-bike",
  "music/a2/day-12/Träume ändern sich.mp3": "a2-dream",
  "music/a2/day-17/Ich gehe zur Apotheke.mp3": "a2-pharmacy",
  "music/a2/day-18/die-karte-funktioniert-nicht.mp3": "a2-bank"
});
const bySongId=Object.freeze({
  "gemeinsam-schaffen-wir-das": "motivation-together",
  "schritt-fuer-schritt": "motivation-steps"
});
const b1DayCovers=Object.freeze(["b1-dream","b1-friendship","b1-success","b1-city"]);
const names=Object.freeze(["a1-introduction","a1-identity","a1-address","a1-journey","a1-busy","a1-doctor","a2-conversation","a2-cities","a2-moments","a2-wellbeing","a2-bike","a2-dream","a2-pharmacy","a2-bank","b1-dream","b1-friendship","b1-success","b1-city","motivation-together","motivation-steps"]);
export function coverForTrack(track){
  if(!track || typeof track!=="object")return "";
  let name=byRecording[String(track.objectKey||"")]||bySongId[String(track.id||"")]||"";
  if(!name && track.level==="B1" && Number.isInteger(track.day) && track.day>=1 && track.day<=4)
    name=b1DayCovers[track.day-1];
  return names.includes(name)?"/music/covers/"+name+".svg":"";
}
