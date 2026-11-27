/**
 * Exact learner-facing text from C2UnifiedGuidedWorkbookPage's Learn tab.
 * Source objects also contain graded answers; project only visible teaching
 * and question/option fields. No React, state, feedback or model answers run.
 */
export function extractC2OrderedGrammar(day, plan, standard, knowledge, teaching, topicChecks, skillFocus, families) {
  const required=(value,label)=>{
    if(typeof value!=="string"||!value.trim())throw new Error("Missing C2 "+label+" on day "+day);
    return value;
  };
  const rows=(items,width,label)=>{
    if(!Array.isArray(items)||!items.length)throw new Error("Missing C2 "+label+" on day "+day);
    return items.map(row=>{
      if(!Array.isArray(row)||row.length!==width)throw new Error("Invalid C2 "+label+" on day "+day);
      return row.map(v=>required(v,label));
    });
  };
  const heading=text=>({type:"heading",text});
  const paragraph=text=>({type:"paragraph",text});
  const example=text=>({type:"example",text});
  const check=(item,label)=>{
    if(!Array.isArray(item?.options)||item.options.length<2)throw new Error("Missing C2 "+label+" options on day "+day);
    return {type:"multipleChoice",question:required(item.question,label),options:item.options.map(v=>required(v,label+" option"))};
  };
  if(Number(plan?.day)!==day||standard?.day!==day||!knowledge||!teaching||!["lesen","hoeren","speak","write"].includes(skillFocus))
    throw new Error("Missing canonical C2 grammar teaching on day "+day);
  const blocks=[
    heading("Thema verstehen · "+required(standard.title,"title")),
    heading("In simple English"),paragraph(required(knowledge.en,"English definition")),
    heading("Auf Deutsch"),paragraph(required(knowledge.de,"German definition")),
    heading("Konkretes Beispiel"),example(required(knowledge.example,"topic example")),
    heading("Wer ist beteiligt?"),{type:"table",rows:rows(knowledge.actors,2,"actors")},
    heading("Welche Interessen oder Werte geraten in Spannung?"),
    {type:"list",items:rows(knowledge.tensions,2,"tensions").map(row=>row.join(" ↔ "))},
    heading("Kernfrage"),paragraph(required(knowledge.core,"core question")),
    heading("Wortschatz und Kollokationen"),{type:"table",rows:rows(plan.vocabulary,2,"vocabulary")},
  ];
  for(const [phrase,meaning,sentence] of rows(plan.collocations,3,"collocations"))
    blocks.push(heading(phrase),paragraph(meaning),example(sentence));
  blocks.push(
    heading("Grammatik · "+required(standard.grammarFocus,"grammar focus")),
    heading("1. Verstehen · Was bedeutet das?"),
    paragraph(required(teaching.definitionDe,"grammar definition")),
    paragraph("English support: "+required(teaching.supportEn,"grammar English support")),
    heading("2. Satz bauen · Schritt für Schritt"),
    paragraph(required(teaching.structureDe,"sentence structure")),
    heading("Beispiel mit Erklärung"),example(required(teaching.workedExample,"worked example")),
    paragraph("Warum? "+required(teaching.explanationDe,"worked example explanation")),
    heading("3. Gemeinsam prüfen"),check(teaching.check,"grammar check"),
    heading("4. Jetzt selbst anwenden · nach dem gemeinsamen Check"),
    paragraph(required(teaching.independentTask,"independent task")),
    paragraph("Hilfe: Nutze das erklärte Muster oben. Kontrolliere Bedeutung und Satzbau. Begründe deine Wortwahl."),
  );
  if(skillFocus==="write"){
    blocks.push(heading("Argumentation · Schreiben vorbereiten"),
      paragraph("Plane zuerst Position → Begründung → Beispiel → Gegenargument → Reaktion → Synthese. Die heutige Grammatik soll die Argumentation präziser machen, nicht unnötig kompliziert."));
  }else if(standard.writeType==="reformulation"){
    blocks.push(heading("Umformung · kurzes Grammatiktraining"),
      paragraph("Nutze die Transformationsfamilien heute als Grammatiktraining. Sie sind nicht die Hauptaufgabe des Tages."));
    for(const [title,sentence] of rows(families,2,"transformation examples"))
      blocks.push(heading(title),example(sentence));
  }else{
    blocks.push(heading("Argumentation · Inhalt vor Form"),
      paragraph("Plane zuerst Position → Begründung → Beispiel → Gegenargument → Reaktion → Synthese. Nutze die heutige Grammatik nur dort, wo sie die logische Beziehung oder das Register präziser macht."));
  }
  if(!Array.isArray(topicChecks)||!topicChecks.length)throw new Error("Missing C2 topic checks on day "+day);
  blocks.push(heading("Themen-Check · Vorbereitung auf die Unterrichtsfragen"));
  for(const item of topicChecks)blocks.push(check(item,"topic check"));
  return {
    source:"Falowen original C2 unified workbook Grammar / Learn teaching",
    fullExplanationIncluded:true,
    orderedNotes:blocks.map((block,index)=>({number:index+1,...block})),
    clarification:"Read orderedNotes in workbook order. Worked teaching examples and their visible explanations are included. Quiz answer indices, hidden feedback, exam reformulation solutions and completion controls stay in Campus. The independent task is included because it is learner-facing, even though Campus opens it after the shared check."
  };
}
