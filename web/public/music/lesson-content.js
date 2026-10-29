import { lyricLines } from './lyrics-timing.js';

// Questions must use the text attached to this exact recording, including repeats.
export function recordingQuestions(lyrics) {
  const sung=lyricLines(lyrics);
  if(sung.includes('Wir zahlen sieben Euro.') && sung.includes('Die Uhr zeigt halb drei.'))return [
    {type:'listening',prompt:'Wie spät ist es im Café?',options:['Halb drei.','Halb vier.','Viertel nach drei.'],correctIndex:0,answer:'Halb drei.',evidence:'Die Uhr zeigt halb drei.'},
    {type:'listening',prompt:'Wie viel bezahlen sie insgesamt?',options:['Vier Euro.','Sieben Euro.','Drei Euro.'],correctIndex:1,answer:'Sieben Euro.',evidence:'Wir zahlen sieben Euro.'},
    {type:'speaking',prompt:'Bestelle zwei Getränke und ein Stück Kuchen. Frage nach dem Preis.',hint:'Ich möchte … Wie viel kostet das zusammen?'}
  ];
  if(sung.includes('Wir müssen in Hannover umsteigen,') && sung.includes('wir möchten in Berlin ankommen.'))return [
    {type:'listening',prompt:'Wo müssen Mia und Ben umsteigen?',options:['In Hannover.','In Berlin.','In Accra.'],correctIndex:0,answer:'In Hannover.',evidence:'Wir müssen in Hannover umsteigen,'},
    {type:'listening',prompt:'Wo möchten sie ankommen?',options:['In Hamburg.','In Berlin.','In München.'],correctIndex:1,answer:'In Berlin.',evidence:'wir möchten in Berlin ankommen.'},
    {type:'speaking',prompt:'Wohin möchtest du mit dem Zug fahren? Wo musst du umsteigen?',hint:'Ich möchte nach … fahren. Ich muss in … umsteigen.'}
  ];
  const lines=[...new Set(sung)].filter(line=>line.length>=20 && line.length<=150);
  const chosen=[lines[0],lines[Math.floor(lines.length/2)]].filter(Boolean);
  const questions=chosen.map((line,index)=>{
    const word=(line.match(/[\p{L}]{4,}/gu)||[])[0];
    if(!word)return null;
    const alternatives=['Sommer','Fenster','Musik'].filter(x=>x.toLocaleLowerCase('de')!==word.toLocaleLowerCase('de')).slice(0,2);
    const options=index===0?[word,...alternatives]:[alternatives[0],word,alternatives[1]];
    return {type:'listening',prompt:'Welches Wort fehlt? „'+line.replace(word,'_____')+'“',options,correctIndex:index===0?0:1,answer:word,evidence:line};
  }).filter(Boolean);
  return [...questions,{type:'speaking',prompt:'Worum geht es in diesem Lied? Erzähle in deinen eigenen Worten.',hint:'Benutze einen Ausdruck aus dem Lied.'}];
}
export function resolveRecordingLesson(track, lessons, pinned, pack) {
  const identity=pinned.find(row=>row.objectKey && row.objectKey===track.objectKey);
  const saved=lessons[track.id] || (identity && lessons[identity.id]);
  const bound=pack?.objectKey===track.objectKey && typeof pack.lyrics==='string' && pack.lyrics.trim();
  if(!bound)return saved && saved.assignmentKey===track.assignmentKey ? saved : null;
  const matches=saved && JSON.stringify(lyricLines(saved.lyrics))===JSON.stringify(lyricLines(pack.lyrics));
  return {...(matches?saved:{}),...pack,summary:matches?saved.summary:track.title,
    questions:matches && Array.isArray(saved.questions)?saved.questions:recordingQuestions(pack.lyrics)};
}
