"use strict";
const {musicCatalogue,recordingMaterial,musicResponse,oralProtocol}=require("../chatgptInteractiveTutor");
const {getExamPractice}=require("../chatgptExamPractice");
const snapshot=require("../../data/chatgptLessonContent.generated.json");
const data=snapshot.musicTutor;
const access={german:{current:"A2",full:["A1","A2"],trial:null},swahili:{current:"A1",full:["A1"],trial:null}};
describe("interactive tutor",()=>{
  test("oral protocol uses a real prompt and distinguishes exam and coaching",()=>{
    const result={available:true,level:"A1",items:[{id:"a1-test",teilId:"teil-2",text:"Einkaufen (Obst)"}]};
    const exam=oralProtocol({result,mode:"exam",source:"dictionary",level:"A1",program:"german"});
    expect(exam.task).toEqual(result.items[0]);
    expect(exam.focus).toMatch(/Ask and answer/);
    expect(exam.protocol.correction).toMatch(/Do not interrupt/);
    expect(exam.officialResult).toBe(false);
    expect(exam.sessionStorage).toBe("conversation only");
    expect(oralProtocol({result,mode:"coach",source:"dictionary",level:"A1",program:"german"}).protocol.correction).toMatch(/After each response/);
    expect(oralProtocol({result:{available:false},mode:"exam",source:"mock"}).available).toBe(false);
  });
  test("A2 Mock 2 Part 1 returns actual topic cards instead of another part",()=>{
    const result=getExamPractice("A2","a2-mock-02","speaking","teil1");
    expect(result.available).toBe(true);
    expect(result.task.card).toContain("Wohnen · Balkon");
    expect(getExamPractice("A2","a2-mock-02","speaking","teil5").available).toBe(false);
    expect(JSON.stringify(result)).not.toContain("samplePartnerQuestion");
  });
  test("published song selection excludes retired songs and raw storage fields",()=>{
    const result=musicResponse({args:{program:"german",level:"A2",day:18},access,data});
    expect(result.tracks.map(t=>t.title)).toEqual(["Ein neues Leben"]);
    expect(JSON.stringify(result)).not.toContain("objectKey");
    expect(musicResponse({args:{program:"german",level:"B1"},access,data}).available).toBe(false);
    expect(musicResponse({args:{program:"swahili",level:"A1",day:12},access:{swahili:{current:"A1",full:[],trial:"A1"}},data}).available).toBe(false);
  });
  test("Kiswahili calendar song provides bounded exact lyrics and matched translation",()=>{
    const result=musicResponse({args:{program:"swahili",day:12,trackId:"swahili-a1-day-12",startLine:1,lineCount:2},access,data});
    expect(result.available).toBe(true);
    expect(result.lines).toHaveLength(2);
    expect(result.lines[0].text).toBe("Wiki ina siku ngapi?");
    expect(result.lines[0].english).toBe("How many days are in a week?");
    expect(result.nextLine).toBe(3);
    expect(JSON.stringify(result)).not.toMatch(/objectKey|audioObjectKey|signedUrl/);
  });
  test("cannot reuse the old recording or draft for a replacement",()=>{
    const track={objectKey:"music/a1/day-21/new.mp3"};
    const fixture={approved:{recordings:[{objectKey:"music/a1/day-21/old.mp3",lyrics:"Old text"},{objectKey:track.objectKey,lyrics:"Draft",referenceOnly:true}]},timings:{recordings:[]}};
    expect(recordingMaterial(track,fixture)).toBeNull();
    const exact={approved:{recordings:[{objectKey:track.objectKey,lyrics:"New text"}]},translations:{recordings:[{objectKey:track.objectKey,lines:[{de:"Old text",en:"Wrong"}]}]}};
    expect(recordingMaterial(track,exact).translationVerified).toBe(false);
  });
});
