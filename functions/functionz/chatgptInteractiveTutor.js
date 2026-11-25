"use strict";
const {examTool}=require("./chatgptMockReview");
const {revisionAccess,permitted}=require("./chatgptPersonalRevision");
const {enrollmentRows}=require("./levelEnrollmentAccess");
const {normalizePart}=require("./chatgptExamLibrary");
const TOOLS=new Set(["get_my_falowen_oral_examiner","get_my_falowen_music_tutor"]);
const text=(v,max=500)=>typeof v==="string"?v.trim().slice(0,max):"";
const deny=message=>({available:false,message});
const MUSIC="https://music.falowen.app/";
const validId=id=>typeof id==="string"&&/^[A-Za-z0-9_-]{1,245}$/.test(id);
function musicCatalogue(german,swahili){
  return [
    ...(german?.tracks||[]).filter(t=>t.approved===true&&t.retired!==true&&t.coursebook===true&&/^music\/[a-c][12]\/day-\d{2}\//.test(t.objectKey||"")).map(t=>({...t,program:"german"})),
    ...(swahili?.tracks||[]).filter(t=>t.coursebook===true&&/^swahili\/music\/[ABC][12]\/day-\d{2}\//.test(t.objectKey||"")).map(t=>({...t,program:"swahili"})),
  ].filter(t=>validId(t.id)&&["A1","A2","B1","B2","C1","C2"].includes(t.level)&&Number.isInteger(t.day)&&t.day>=1&&t.day<=50&&t.audioUrl==="https://www.falowen.app/api/music?track="+t.id);
}
function publicTrack(t){
  return {id:t.id,title:text(t.title,220),program:t.program,level:t.level,day:t.day,topic:text(t.topic,300),
    ...(t.assignmentKey?{assignmentKey:text(t.assignmentKey,40)}:{}),
    songUrl:"https://www.falowen.app/song/"+encodeURIComponent(t.id)};
}
function songLines(lyrics){
  return typeof lyrics==="string"?lyrics.replace(/\\n/g,"\n").split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!/^\[.*\]$/.test(s)):[];
}
function recordingMaterial(track,{approved,timings,translations,stories}){
  // Exact object identity, never a match on title, day or studio draft.
  const owner=(approved?.recordings||[]).find(r=>r.objectKey===track.objectKey&&r.referenceOnly!==true&&r.transcriptionStatus!=="automatic");
  const timed=(timings?.recordings||[]).find(r=>r.objectKey===track.objectKey&&r.referenceOnly!==true&&r.transcriptionStatus!=="automatic");
  const record=owner||timed;
  const lines=songLines(record?.lyrics);
  if(!lines.length||lines.length>500||lines.some(s=>s.length>1000))return null;
  const translation=(translations?.recordings||[]).find(r=>r.objectKey===track.objectKey&&Array.isArray(r.lines)&&r.lines.length===lines.length&&r.lines.every((l,i)=>l.de===lines[i]&&typeof l.en==="string"&&l.en.trim()));
  const story=stories?.byObjectKey?.[track.objectKey];
  return {lines:lines.map((line,i)=>({number:i+1,text:line,...(translation?{english:text(translation.lines[i].en,1000)}:{})})),
    translationVerified:Boolean(translation),
    ...(story?{story:{targetLanguage:text(story.storyDe,2000),english:text(story.storyEn,2000),focusTargetLanguage:text(story.focusDe,1500),focusEnglish:text(story.focusEn,1500)}}:{})};
}
function musicResponse({args,access,data}){
  const program=args.program;
  if(!["german","swahili"].includes(program))return deny("Choose German or Kiswahili.");
  const level=args.level||access[program]?.current;
  const grant=access[program];
  if(!grant||(!grant.full.includes(level)&&grant.trial!==level))return deny("This course level is not authorised for lesson-linked music study.");
  if(args.day!==undefined&&(!Number.isInteger(args.day)||!permitted(access,program,level,args.day)))return deny("This lesson day is not authorised.");
  const tracks=musicCatalogue(data.german,data.swahili).filter(t=>t.program===program&&t.level===level&&permitted(access,program,level,t.day)&&(args.day===undefined||args.day===t.day));
  if(!args.trackId)return {available:tracks.length>0,program,level,day:args.day??null,tracks:tracks.slice(0,30).map(publicTrack),musicLibraryUrl:MUSIC,
    guidance:"Choose a catalogue track ID to study its published recording text. The catalogue day is not a claim of a different workbook's day mapping. If no track exists, use the Music library."};
  const track=tracks.find(t=>t.id===args.trackId);
  if(!track)return deny("This track is not in the authorised published lesson catalogue.");
  const material=recordingMaterial(track,data);
  if(!material)return {available:true,track:publicTrack(track),lyricsAvailable:false,musicLibraryUrl:MUSIC,
    guidance:"Open the exact song in Falowen Music for its latest lyrics. No matching bundled recording text was found; do not substitute an older song, a draft or invented lyrics."};
  const start=args.startLine===undefined?1:args.startLine;
  if(!Number.isInteger(start)||start<1||start>material.lines.length)return deny("Choose an existing lyric line number.");
  const count=Number.isInteger(args.lineCount)?Math.max(1,Math.min(8,args.lineCount)):4;
  return {available:true,track:publicTrack(track),lyricsAvailable:true,source:"Falowen published recording text (bundled snapshot)",lines:material.lines.slice(start-1,start-1+count),
    totalLines:material.lines.length,nextLine:start-1+count<material.lines.length?start+count:null,translationVerified:material.translationVerified,
    story:material.story,practiceOnly:true,officialResult:false,
    guidance:"Play the exact song in Falowen Music. Use the supplied short passage to teach vocabulary, grammar and meaning. Ask one listening or recall question at a time, wait for the learner, then reveal the relevant line and explain. If an English translation is missing, label your own explanation as tutor interpretation. Never claim to hear the recording or verify timing in ChatGPT; no score or playback tracking is written."};
}
function oralProtocol({result,mode,source,level,program,part}){
  if(!result?.available)return result||deny("No speaking task is available.");
  const task=source==="dictionary"?result.items?.[0]:source==="mock"?result.task:result.material;
  if(!task)return deny("No original speaking prompt is exported for this selection.");
  const p=normalizePart(part||task.teilId||result.part||"");
  const focus=program==="swahili"?"Respond in simple Kiswahili and practise natural everyday interaction.":
    level==="A1"?(p==="teil2"?"Ask and answer short questions using the card.":p==="teil3"?"Formulate a polite request and react to a partner request.":"Introduce yourself and answer short follow-up questions. Use fictional personal details when appropriate."):
    level==="A2"?(p==="teil1"?"Ask and answer personal questions using the cards.":p==="teil3"?"Make suggestions, respond to alternatives and agree on a plan.":"Speak about the topic and respond to short follow-up questions."):
    level==="B1"?(p==="teil1"?"Negotiate a shared plan with the partner.":p==="teil2"?"Give a structured presentation and respond to questions.":"Respond to the topic, give reasons and interact with the partner."):
    "Respond at the assigned level with clear arguments and appropriate interaction.";
  return {available:true,source,program,level,part:p||null,task,
    mode,practiceOnly:true,officialResult:false,sessionStorage:"conversation only",
    focus,protocol:{opening:"Present the original task, then ask the learner to begin. Do not write a model response.",
      interaction:"Act as the examiner or partner. Ask just one question or make one partner turn, wait for the learner, and adapt follow-ups to what they actually said. Label new follow-ups as practice, not original exam material.",
      correction:mode==="exam"?"Do not interrupt with corrections. At the end, give qualitative feedback and two targeted retry exercises.":"After each response, give one concise correction, explain it, and invite a retry.",
      feedback:["Task coverage","Clarity and coherence","Grammar and vocabulary","Interaction","Pronunciation only if actual audio is accessible"],
      privacy:"Do not request real phone numbers, addresses or other identifying details; allow fictional practice details.",
      limits:"No official score, pass prediction, exam timer, recording, audio upload or saved result. Text or transcript alone cannot establish pronunciation."},
    practiceUrl:result.practiceUrl||result.examRoomUrl||result.lessonUrl||null};
}
async function tutorTool({name,args={},student,admin,uid,snapshot,lessonContentResponse,swahiliLessonResponse}){
  if(student?.data?.uid&&student.data.uid!==uid)return deny("Identity could not be verified.");
  if(name==="get_my_falowen_oral_examiner"){
    const source=args.source||"dictionary",mode=args.mode||"exam";
    if(!["dictionary","mock","lesson"].includes(source)||!["exam","coach"].includes(mode))return deny("Choose a valid speaking source and mode.");
    if(source!=="lesson"){
      if(args.program&&args.program!=="german")return deny("The Exams Room speaking dictionary currently supports German.");
      if(args.part&&!normalizePart(args.part))return deny("Invalid speaking part.");
      if(source==="mock"&&(!args.mockId||!args.part))return deny("Choose the published mock and its speaking part.");
      const result=await examTool({name:source==="mock"?"get_my_falowen_exam_practice":"get_my_falowen_exam_dictionary",
        args:source==="mock"?{mockId:args.mockId,skill:"speaking",part:normalizePart(args.part)}:{category:"speaking",part:args.part,taskId:args.taskId,query:args.query,limit:1},student,admin,uid});
      return oralProtocol({result,mode,source,level:result.level,program:"german",part:args.part});
    }
    const db=admin.firestore();
    const [rows,policy]=await Promise.all([enrollmentRows(db.collection("students").doc(student.id)),db.collection("courseAccountAccess").doc(uid).get()]);
    const access=revisionAccess(student.data,rows,policy.data()||{});
    const program=args.program||"german",level=args.level||access[program]?.current;
    if(!["german","swahili"].includes(program)||!Number.isInteger(args.day)||!permitted(access,program,level,args.day))return deny("This speaking lesson is not authorised.");
    const result=program==="german"?lessonContentResponse(level,args.day,"speaking"):swahiliLessonResponse(student,args.day,"speaking");
    return oralProtocol({result,source,mode,program,level});
  }
  if(name==="get_my_falowen_music_tutor"){
    const db=admin.firestore();
    const [rows,policy]=await Promise.all([enrollmentRows(db.collection("students").doc(student.id)),db.collection("courseAccountAccess").doc(uid).get()]);
    const access=revisionAccess(student.data,rows,policy.data()||{});
    // Lazy imports of existing public assets: no R2 request, model call or database write.
    const data={german:require("../../web/public/music/catalog.json"),swahili:require("../../web/public/music/swahili-catalog.json"),
      approved:require("../../web/public/music/approved-recording-lyrics.json"),timings:require("../../web/public/music/timings.json"),
      translations:require("../../web/public/music/english-translations.json"),stories:require("../../web/public/music/song-stories.json")};
    return musicResponse({args,access,data});
  }
  return deny("Unsupported tutoring tool.");
}
module.exports={TOOLS,musicCatalogue,recordingMaterial,musicResponse,oralProtocol,tutorTool};
