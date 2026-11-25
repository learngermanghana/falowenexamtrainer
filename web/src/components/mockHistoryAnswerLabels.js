// Loaded only when a verified attempt is opened. Prefer the original option
// text instead of guessing a historical shuffled display letter.
const normalize=value=>String(value??"").trim().toLowerCase();
const keyFor=(section,number)=>section+":"+number;
const optionsOf=options=>Array.isArray(options)?options.map(o=>Array.isArray(o)?{id:o[0],label:o[1]}:o):[];
export async function loadHistoryAnswerLabels(mockId){
  const labels=new Map();
  const add=(section,questions,optionsFor=q=>q.options)=>{
    for(const q of questions||[]){
      const map=new Map(optionsOf(optionsFor(q)).map(o=>[normalize(o.id),o.label||o.url||o.id]));
      if(map.size)labels.set(keyFor(section,q.number),map);
    }
  };
  const addB1Reading=reading=>{
    add("lesen",reading.teil2.questions);add("lesen",reading.teil2.text2.questions);
    add("lesen",reading.teil3.situations,()=>reading.teil3.ads.map(([id,title])=>({id,label:"Anzeige "+id+": "+title})));
    add("lesen",reading.teil5.questions);
  };
  if(mockId.startsWith("a1-")){
    const loaders={
      "a1-mock-02":()=>import("../data/a1FinalMock2Data").then(m=>m.A1_MOCK_2_LISTENING),
      "a1-mock-03":()=>import("../data/a1FinalMock3Data").then(m=>m.A1_MOCK_3_LISTENING),
      "a1-mock-04":()=>import("../data/a1Mock4Listening").then(m=>m.A1_MOCK_4_LISTENING),
      "a1-mock-05":()=>import("../data/a1Mock5Listening").then(m=>m.A1_MOCK_5_LISTENING),
      "a1-mock-06":()=>import("../data/a1Mock6Listening").then(m=>m.A1_MOCK_6_LISTENING),
      "a1-mock-07":()=>import("../data/a1Mock7Listening").then(m=>m.A1_MOCK_7_LISTENING),
      "a1-mock-08":()=>import("../data/a1Mock8Listening").then(m=>m.A1_MOCK_8_LISTENING),
    };
    const paper=await loaders[mockId]?.();
    if(paper)for(const part of [paper.teil1,paper.teil2,paper.teil3])add("hoeren",part.questions);
  } else if(mockId==="a2-mock-01"){
    const [r,l1,l2,l3,l4]=await Promise.all([
      import("./A2GoetheReadingMockPreview"),import("./A2GoetheListeningMockTeil1Preview"),import("./A2GoetheListeningMockTeil2Preview"),import("./A2GoetheListeningMockTeil3Preview"),import("./A2GoetheListeningMockTeil4Preview")
    ]);
    const reading=r.A2_GOETHE_READING_MOCK;
    for(const part of [reading.teil1,reading.teil2,reading.teil3])add("lesen",part.questions);
    add("lesen",reading.teil4.people,()=>reading.teil4.ads.map(ad=>({id:ad.id,label:ad.title})));
    add("hoeren",l1.A2_GOETHE_LISTENING_TEIL1.questions);
    const part=l2.A2_GOETHE_LISTENING_TEIL2;add("hoeren",part.tasks,()=>part.pictures);
    add("hoeren",l3.A2_GOETHE_LISTENING_TEIL3.questions);add("hoeren",l4.A2_GOETHE_LISTENING_TEIL4.questions);
  } else if(mockId==="a2-mock-02"){
    const [r,l]=await Promise.all([import("../data/a2Mock2Lesen"),import("../data/a2Mock2Hoeren")]);
    for(const part of r.A2_MOCK_2_LESEN)add("lesen",part.questions,q=>q.options?.length?q.options:part.ads||[]);
    for(const part of l.A2_MOCK_2_HOEREN)add("hoeren",part.questions,q=>part.pictures||q.options);
  } else if(mockId==="a2-mock-03"){
    const r=await import("../data/a2Mock3Lesen");for(const part of r.A2_MOCK_3_LESEN)add("lesen",part.questions);
  } else if(mockId.startsWith("a2-")){
    const r=await import("../data/a2KombiMockSets");for(const part of r.getA2KombiSet(mockId)?.reading||[])add("lesen",part.questions);
    const loaders={
      "a2-mock-04":()=>import("../data/a2Mock04Hoeren").then(m=>m.A2_MOCK_04_HOEREN),
      "a2-mock-05":()=>import("../data/a2Mock05Hoeren").then(m=>m.A2_MOCK_05_HOEREN),
      "a2-mock-06":()=>import("../data/a2Mock06Hoeren").then(m=>m.A2_MOCK_06_HOEREN),
      "a2-mock-07":()=>import("../data/a2Mock07Hoeren").then(m=>m.A2_MOCK_07_HOEREN)
    };
    const listening=await loaders[mockId]?.();for(const part of listening||[])add("hoeren",part.questions);
  } else if(mockId.startsWith("b1-")){
    const loaders={
      "b1-mock-01":()=>import("../data/b1FinalMockData").then(m=>{for(const part of m.B1_LISTENING)add("hoeren",part.questions);return m.B1_READING;}),
      "b1-mock-02":()=>import("../data/b1Mock2ExamContent").then(m=>m.B1_MOCK2_READING),
      "b1-mock-03":()=>import("../data/b1Mock3ReadingContent").then(m=>m.B1_MOCK3_LESEN),
      "b1-mock-04":()=>import("../data/b1Mock4ReadingContent").then(m=>m.B1_MOCK4_LESEN)
    };
    const reading=await loaders[mockId]?.();if(reading)addB1Reading(reading);
  }
  return (section,row,value)=>labels.get(keyFor(section,row.number))?.get(normalize(value))||null;
}
