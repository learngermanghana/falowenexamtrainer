// A1 Chapter 3 has exactly three Teile. Keep written answers independent of the voice recording.
export function parseFamilyResubmission(text) {
 const lines=String(text||"").replace(/\r\n/g,"\n").split("\n"), parts={}, order=[];
 let current="";
 for(const line of lines){
  const heading=line.match(/^\s*(?:teil|part)\s*([1-3])(?:\s*[:.;|·•–-].*)?\s*$/i);
  if(heading){current=heading[1];if(Object.prototype.hasOwnProperty.call(parts,current))return null;order.push(current);parts[current]="";continue;}
  if(!current){if(line.trim())return null;continue;}
  parts[current]+=(parts[current]?"\n":"")+line;
 }
 if(order.join(",")!=="1,2,3")return null;
 return Object.fromEntries(Object.entries(parts).map(([k,v])=>[k,v.trim()]));
}
export function replaceFamilyTranscript(text, transcript) {
 const parts=parseFamilyResubmission(text);
 if(!parts)return null;
 return ["1","2","3"].map(k=>"TEIL "+k+"\n"+(k==="2"?String(transcript||"").trim():parts[k])).join("\n\n");
}
export function getFamilyRecording(attempt) {
 const recording=attempt?.recordings?.find(r=>r.sectionKey==="teil-2")||attempt?.workbookSections?.["teil-2"]?.recording;
 return recording?.transcript&&/^https:\/\//i.test(recording.audioUrl||"")?recording:null;
}
export function validFamilyRecording(text,recording) {
 const parts=parseFamilyResubmission(text);
 return Boolean(parts&&parts["1"]&&parts["2"]&&parts["3"]&&recording?.audioUrl&&parts["2"]===String(recording.transcript||"").trim());
}
