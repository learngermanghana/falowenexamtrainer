import catalogue from "../data/goetheExaminerPublicFlows.json";
export const examinerTaskPreview = (level,task,mode="guided") => {
  const part=String(task?.teil || "").match(/^(?:teil[-\s]*)?([123])$/i)?.[1];
  const key=`${level}-${part}`, profile=catalogue.profiles[key];
  if (!profile) return null;
  const selected=String(task?.keywords || task?.prompt || "Freizeit").split(/[,;·]/)[0].trim().slice(0,120);
  let cards=[],cardThemes=[];
  if (key === "A1-2" || key === "A2-1") {
    let defaults=key === "A1-2" ? catalogue.a1InformationCards : catalogue.personalCards;
    const match=defaults.find(card=>card.word.toLocaleLowerCase("de-DE") === selected.toLocaleLowerCase("de-DE"));
    const first=match?.word || selected;
    if (key === "A1-2" && match?.theme) defaults=defaults.filter(card=>card.theme === match.theme);
    cards=[...new Map([first,...defaults.map(card=>card.word)].map(word=>[word.toLocaleLowerCase("de-DE"),word])).values()].slice(0,key === "A1-2" ? 2 : 4);
  }
    cardThemes=cards.map(word=>key === "A1-2" ? catalogue.a1InformationCards.find(card=>card.word === word)?.theme || "" : "");
  const requestCards = key === "A1-3" ? (() => {
    const all = catalogue.a1RequestCards;
    const first = all.find(card => card.word.toLocaleLowerCase("de-DE") === selected.toLocaleLowerCase("de-DE")) || {word:selected || "Buch bringen",symbol:"🗂️"};
    return [first,...all.filter(card => card.word.toLocaleLowerCase("de-DE") !== first.word.toLocaleLowerCase("de-DE"))].slice(0,2)
      .map(card => ({word:card.word,symbol:card.symbol,...(card.picture ? {picture:card.picture} : {})}));
  })() : [];
  const topicEntry=Object.entries(catalogue.a2TopicPoints).find(([topic])=>topic !== "default" && String(task?.prompt || "").toLowerCase().includes(topic.toLowerCase()));
  const supplied=String(task?.keywords || "").split(/[,;·]/).map(value=>value.trim()).filter(Boolean);
  const planningPoints=key === "B1-1" ? catalogue.b1PlanningTasks.find(item=>String(task?.prompt || "").toLowerCase().includes(item.match.toLowerCase()))?.points : null;
  return {key,stageGuide:profile.stageGuide || "",title:profile.title,mode,topic:key === "B1-3" ? (/fragen|feedback|rückmeldung|präsentation|details/i.test(task?.prompt || "") ? "Freizeit" : task?.prompt || "Freizeit") : ["A2-2","B1-1","B1-2"].includes(key) ? String(task?.prompt || "").slice(0,180) : "",maxAnswers:key === "A1-2" ? cards.length*2 : profile.maxAnswers,role:profile.role,
    cards,cardThemes,card:"",requestCards,studentCalendar:profile.studentCalendar || [],
    points:key === "A1-1" ? ["Name","Alter","Land","Wohnort","Sprachen","Beruf","Hobby"] : key === "B1-2" ? catalogue.presentationPoints : key === "B1-1" ? planningPoints?.map(point=>point.text) || ["Wann treffen wir uns?","Wo treffen wir uns?","Wie kommen wir hin?","Wer übernimmt was?"] : key === "A2-2" ? (supplied.length>=4 ? supplied.slice(0,4) : topicEntry?.[1] || catalogue.a2TopicPoints.default) : [],
    hints:mode === "guided" ? profile.hints : [],
    scenario:key === "A2-3" ? `Sie möchten gemeinsam folgende Aktivität planen: ${String(task?.prompt || "ein Geschenk für einen Freund kaufen").slice(0,180)}. Finden Sie einen gemeinsamen Termin.` : "",
    preparationSeconds:level === "B1" ? 900 : 0};
};
