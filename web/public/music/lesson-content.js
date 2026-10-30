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
  if(sung.includes('Ihr Deutschkurs beginnt am Montag.“') && sung.some(line=>line.includes('Hallo, ich heiße Bina,')))return [
    {type:'listening',prompt:'Wie heißt die Person, die bei der Schule anruft?',options:['Bina.','Lena.','Mia.'],correctIndex:0,answer:'Bina.',evidence:'Ich sage: „Hallo, ich heiße Bina,'},
    {type:'listening',prompt:'Wann beginnt der Deutschkurs?',options:['Am Sonntag.','Am Montag.','Am Freitag.'],correctIndex:1,answer:'Am Montag.',evidence:'Ihr Deutschkurs beginnt am Montag.“'},
    {type:'speaking',prompt:'Wie buchstabierst du deinen Namen?',hint:'Ich heiße … Meinen Namen schreibt man …'}
  ];
  if(sung.includes('Er sagt: „Ich komme aus Berlin.“') && sung.includes('Er sagt: „Ich wohne hier in Bonn.“'))return [
    {type:'listening',prompt:'Woher kommt Ben?',options:['Aus Bonn.','Aus Accra.','Aus Berlin.'],correctIndex:2,answer:'Aus Berlin.',evidence:'Er sagt: „Ich komme aus Berlin.“'},
    {type:'listening',prompt:'Wo wohnt Ben jetzt?',options:['In Bonn.','In Berlin.','In Hamburg.'],correctIndex:0,answer:'In Bonn.',evidence:'Er sagt: „Ich wohne hier in Bonn.“'},
    {type:'speaking',prompt:'Frage deinen Partner nach Name, Herkunft und Wohnort.',hint:'Wie heißt du? Woher kommst du? Wo wohnst du?'}
  ];
  if(sung.includes('Die Frau sagt: „Ja, um zehn Uhr.“') && sung.includes('und bleiben Sie heute zu Haus.“'))return [
    {type:'listening',prompt:'Um wie viel Uhr hat die Person einen Arzttermin?',options:['Um neun Uhr.','Um zehn Uhr.','Um elf Uhr.'],correctIndex:1,answer:'Um zehn Uhr.',evidence:'Die Frau sagt: „Ja, um zehn Uhr.“'},
    {type:'listening',prompt:'Was empfiehlt der Arzt?',options:['Viel Wasser trinken und heute zu Hause bleiben.','Sport machen und zur Schule gehen.','Nur Tee trinken und sofort arbeiten.'],correctIndex:0,answer:'Viel Wasser trinken und heute zu Hause bleiben.',evidence:'und bleiben Sie heute zu Haus.“'},
    {type:'speaking',prompt:'Wie beschreibst du deine Beschwerden bei einem Arzt?',hint:'Mein … tut weh. Ich habe … Ich möchte einen Termin.'}
  ];
  if(sung.includes('Der Himmel ist grau, es regnet stark.') && sung.includes('Mia schreibt: „Morgen um drei?“'))return [
    {type:'listening',prompt:'Warum sagt die Person das Treffen mit Mia ab?',options:['Es regnet stark und ist kalt.','Mia muss zur Schule gehen.','Der Bus ist zu spät.'],correctIndex:0,answer:'Es regnet stark und ist kalt.',evidence:'Doch draußen ist es nass und kalt.'},
    {type:'listening',prompt:'Wann möchten sie sich stattdessen treffen?',options:['Heute um zwei Uhr.','Morgen um drei Uhr.','Am Montag um zehn Uhr.'],correctIndex:1,answer:'Morgen um drei Uhr.',evidence:'Mia schreibt: „Morgen um drei?“'},
    {type:'speaking',prompt:'Wie sagst du ein Treffen höflich ab?',hint:'Es tut mir leid, heute kann ich leider nicht. Passt dir morgen …?'}
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
