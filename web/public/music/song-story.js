// Educational editorial context, not a claim about a songwriter's personal inspiration.
// Only exact published recording keys (or explicit classroom IDs) receive curated text.
function boundedText(value,limit=900) {
  return typeof value==="string" && value.trim() && value.trim().length<=limit ? value.trim() : "";
}
function completeStory(item) {
  return item && typeof item==="object" &&
    ["storyDe","storyEn","focusDe","focusEn"].every(key=>boundedText(item[key]));
}
const fallbackFocus=Object.freeze({
  A1:{focusDe:"Einfache Wörter, Fragen und Antworten üben.",focusEn:"Practise simple words, questions, and answers."},
  A2:{focusDe:"Alltagssituationen, Erfahrungen und Pläne beschreiben.",focusEn:"Describe everyday situations, experiences, and plans."},
  B1:{focusDe:"Erfahrungen, Gefühle und Meinungen in längeren Sätzen ausdrücken.",focusEn:"Express experiences, feelings, and opinions in longer sentences."},
  B2:{focusDe:"Zusammenhänge, Argumente und eigene Meinungen ausdrücken.",focusEn:"Express connections, arguments, and your own opinions."},
  C1:{focusDe:"Anspruchsvolle Gedanken und differenzierte Meinungen formulieren.",focusEn:"Express complex ideas and nuanced opinions."},
  C2:{focusDe:"Nuancen, Ausdruck und Stil im Deutschen vertiefen.",focusEn:"Deepen your grasp of nuance, expression, and style in German."},
  ALL:{focusDe:"Wörter für Motivation und gemeinsames Lernen wiederholen.",focusEn:"Revise phrases about motivation and learning together."},
});
export function songStoryForTrack(track,editorial={}) {
  const key=String(track?.objectKey||"");
  const id=String(track?.id||"");
  const matched=key && editorial?.byObjectKey?.[key] || editorial?.byTrackId?.[id];
  if(completeStory(matched)) {
    const {storyDe,storyEn,focusDe,focusEn}=matched;
    return {storyDe:storyDe.trim(),storyEn:storyEn.trim(),focusDe:focusDe.trim(),focusEn:focusEn.trim(),curated:true};
  }
  // Newly discovered R2 songs get honest, neutral learning context until
  // their owner-reviewed story is added. Never invent recording provenance.
  const title=boundedText(track?.title,150) || "Deutsch lernen";
  const level=String(track?.level||"ALL").toUpperCase();
  const focus=fallbackFocus[level] || fallbackFocus.ALL;
  const quoteDe="„"+title+"“";
  const quoteEn="“"+title+"”";
  if(level==="ALL") return {
    storyDe:"Dieses Klassenlied lädt zum gemeinsamen Singen und Lernen ein. Mit Musik macht Üben mehr Freude.",
    storyEn:"This classroom song invites learners to sing and learn together. Music makes practice more enjoyable.",
    ...focus,curated:false,
  };
  return {
    storyDe:"Dieses Lied behandelt das Thema "+quoteDe+". Die Geschichte lädt dich ein, Deutsch mit Musik zu entdecken.",
    storyEn:"This song explores the theme "+quoteEn+". Its story invites you to discover German through music.",
    ...focus,curated:false,
  };
}
