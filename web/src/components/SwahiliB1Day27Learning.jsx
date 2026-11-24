import React, {useState} from "react";
import {writingPoints} from "../data/swahili/b1Day27";
const vocabulary = [
["hifadhi ya mazingira","environmental conservation","Hifadhi ya mazingira ni jukumu letu."],
["uchafuzi wa mazingira","environmental pollution","Plastiki husababisha uchafuzi wa mazingira."],
["maliasili","natural resources","Tunapaswa kulinda maliasili."],
["mabadiliko ya tabianchi","climate change","Mabadiliko ya tabianchi yanaathiri jamii."],
["kurejeleza taka","to recycle waste","Tunarejeleza taka za plastiki."],
["taka za kikaboni","organic waste","Tunakusanya taka za kikaboni kando."],
["taka zisizooza","non-biodegradable waste","Tunatenganisha taka zisizooza."],
["nishati","energy","Tunatumia nishati kwa busara."],
["rasilimali","resources","Tunazima taa ili tuokoe rasilimali."],
["mmomonyoko wa udongo","soil erosion","Miti huzuia mmomonyoko wa udongo."],
["kikapu cha kusuka","woven basket","Ninatumia kikapu cha kusuka sokoni."],
["chupa inayoweza kujazwa tena","refillable bottle","Ninabeba chupa inayoweza kujazwa tena."],
["vizazi vijavyo","future generations","Tulinde dunia kwa ajili ya vizazi vijavyo."]
];
const connectors=[
["Hata hivyo","However · tofauti","Plastiki ni rahisi kutumia. Hata hivyo, inachafua mazingira."],
["Kwa sababu hiyo","Therefore · matokeo","Taka zimeongezeka. Kwa sababu hiyo, tunapaswa kuzitenganisha."],
["Ili","In order to · lengo","Ninazima taa ili niokoe nishati."],
["Kwanza / Pili / Tatu","Firstly / secondly / thirdly · mpangilio","Kwanza, tunapunguza plastiki. Pili, tunarejeleza taka. Tatu, tunapanda miti."],
["Kwa hitimisho","In conclusion · hitimisho","Kwa hitimisho, kila mtu ana jukumu la kutunza mazingira."],
["Badala ya","Instead of · njia mbadala","Ninatumia kikapu badala ya kununua mifuko ya plastiki."],
["Kwa sababu","Because · sababu","Ninatumia chupa ya chuma kwa sababu inaweza kujazwa tena."]
];
const quiz=[
["Plastiki ni rahisi kutumia. ___, inachafua mazingira.",["Hata hivyo","Ili","Kwa hitimisho"],"Hata hivyo","Inaonyesha tofauti."],
["Taka zimeongezeka. ___, tunahitaji mapipa zaidi.",["Kwa sababu hiyo","Ili","Badala ya"],"Kwa sababu hiyo","Inaonyesha matokeo."],
["Ninazima taa ___ niokoe nishati.",["ili","hata hivyo","pili"],"ili","Inaonyesha lengo: niokoe."],
["Kwanza, tunatenganisha taka. ___, tunarejeleza plastiki.",["Pili","Ili","Kwa sababu"],"Pili","Inaonyesha mpangilio."],
["Ninabeba chupa yangu ___ kununua chupa mpya.",["badala ya","kwa hitimisho","hata hivyo"],"badala ya","Inaonyesha njia mbadala."],
["___, kila mtu ana jukumu la kulinda mazingira.",["Kwa hitimisho","Ili","Badala ya"],"Kwa hitimisho","Inafunga mjadala."]
];
function Table({head,rows}){return <div style={{overflowX:"auto"}}><table><thead><tr>{head.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div>;}
export function Day27Grammar(){
 const [answers,setAnswers]=useState({}); const [checked,setChecked]=useState(false);
 return <>
 <h2>Sarufi na msamiati</h2><h3>1. Msamiati muhimu</h3><Table head={["Kiswahili","English","Mfano"]} rows={vocabulary}/>
 <h3>2. Viunganishi vya B1</h3><p>Unganisha mawazo kwa kuonyesha tofauti, sababu, matokeo, lengo na mpangilio.</p><Table head={["Kiunganishi","Matumizi","Mfano"]} rows={connectors}/>
 <h3>3. Tabia za kila siku: hu- na -na-</h3><p>Tumia hu- kueleza tabia ya kawaida bila kiambishi cha nafsi. Tumia -na- pamoja na kiambishi cha nafsi kueleza tendo la sasa au tabia katika muktadha wa kawaida.</p><Table head={["Tabia ya kawaida","Mfano wa -na-"]} rows={[["Mimi huzima taa kila jioni.","Ninazima taa sasa."],["Sisi hutenganisha taka kila siku.","Tunatenganisha taka nyumbani."],["Watu hutumia vikapu sokoni.","Wanatumia vikapu leo."]]}/>
 <h3>4. Lengo na ushauri</h3><p>Baada ya ili, tumia hali ya utegemezi inapohitajika: niokoe, tuokoe, walinde. Tumia tunapaswa, ni vizuri au ni lazima kutoa ushauri.</p><Table head={["Lengo","Ushauri"]} rows={[["Ninapanda miti ili nilinde udongo.","Tunapaswa kupanda miti."],["Tunatumia vikapu ili tupunguze plastiki.","Ni vizuri kutumia vikapu."],["Tunatenganisha taka ili tuweze kuzirejeleza.","Ni lazima tuweke taka mahali panapofaa."]]}/>
 <h3>5. Epuka makosa haya</h3><Table head={["Si sahihi","Sahihi"]} rows={[["Ili ninaokoa nishati.","Ili niokoe nishati."],["Ninatumia kikapu badala ya ninanunua mifuko.","Ninatumia kikapu badala ya kununua mifuko."],["Mimi ninahuzima taa.","Mimi huzima taa."]]}/>
 <h3>Zoezi A · Chagua kiunganishi sahihi</h3>{quiz.map(([prompt,choices,answer,why],i)=><fieldset key={prompt}><legend>{i+1}. {prompt}</legend>{choices.map(choice=><label key={choice} style={{display:"block"}}><input type="radio" name={"sw27-grammar-"+i} checked={answers[i]===choice} onChange={()=>{setAnswers(old=>({...old,[i]:choice}));setChecked(false);}}/> {choice}</label>)}{checked&&<p>{answers[i]===answer?"Sahihi!":"Jibu sahihi: "+answer+"."} {why}</p>}</fieldset>)}
 <button type="button" disabled={Object.keys(answers).length!==quiz.length} onClick={()=>setChecked(true)}>Kagua majibu</button>{checked&&<p role="status">{quiz.filter((q,i)=>answers[i]===q[2]).length} / {quiz.length}</p>}
 <h3>Zoezi B · Unganisha sentensi</h3><ol><li>Ninazima taa. Ninataka kuokoa nishati. (ili)</li><li>Taka zimeongezeka. Tunahitaji mapipa zaidi. (Kwa sababu hiyo)</li><li>Sinunui mifuko mipya. Ninatumia kikapu. (badala ya)</li></ol><details><summary>Angalia majibu</summary><ol><li>Ninazima taa ili niokoe nishati.</li><li>Taka zimeongezeka. Kwa sababu hiyo, tunahitaji mapipa zaidi.</li><li>Ninatumia kikapu badala ya kununua mifuko mipya.</li></ol></details></>;
}
export function Day27Speaking(){return <>
 <h2>1 · Kuzungumza</h2><h3>Swali la siku</h3><p>Unafanya nini ili kutunza mazingira katika maisha yako ya kila siku? Andaa jibu la sekunde 60–90. Eleza tabia mbili au tatu, faida zake, changamoto moja na pendekezo kwa jamii. Tumia angalau viunganishi vitatu vya B1.</p>
 <h3>Ramani ya mawazo</h3><Table head={["Kipengele","Swali","Kianzio"]} rows={[["Utangulizi","Kwa nini mazingira ni muhimu?","Kwa maoni yangu …"],["Nyumbani","Unafanya nini na taka au nishati?","Kwanza, mimi …"],["Kazini / sokoni","Unapunguzaje plastiki?","Pili, ninatumia … badala ya …"],["Faida / changamoto","Tabia hizo zinasaidiaje? Ni nini kigumu?","Hata hivyo, … / Kwa sababu hiyo, …"],["Ushauri","Jamii inaweza kufanya nini?","Kwa hitimisho, ninashauri …"]]}/>
 <details><summary>Mfano wa jibu</summary><p>Kwa maoni yangu, mazingira safi ni muhimu kwa afya yetu. Kwanza, ninatenganisha taka nyumbani ili niweze kurejeleza plastiki. Pili, ninabeba kikapu sokoni badala ya kununua mifuko mipya. Tatu, ninazima taa nisipozihitaji. Hata hivyo, wakati mwingine ni vigumu kupata sehemu ya kutupa taka kwa usahihi. Kwa sababu hiyo, ninapendekeza kuweka mapipa tofauti katika mtaa wetu. Kwa hitimisho, kila mtu anaweza kufanya jambo dogo ili kulinda mazingira.</p></details>
 <h3>Kazi ya jozi · Punguza plastiki kazini</h3><p>Mwanafunzi A anataka wafanyakazi watumie chupa zinazoweza kujazwa tena. Mwanafunzi B ana wasiwasi kuhusu gharama na upatikanaji wa maji. Jadilianeni kuhusu gharama, faida za muda mrefu na namna ya kuwashirikisha wengine. Kubalianeni kuhusu pendekezo moja linaloweza kutekelezwa.</p>
 <h3>Misemo muhimu</h3><Table head={["Kusudi","Mfano"]} rows={[["Kutoa maoni","Kwa maoni yangu …"],["Kukubaliana","Nakubaliana nawe kwa sababu …"],["Kutofautiana","Hata hivyo, nina wasiwasi kuhusu …"],["Kupendekeza","Badala ya …, tunaweza …"],["Kufikia mwafaka","Tukubaliane kwamba …"]]}/>
 <h3>Orodha ya kujikagua</h3><ul><li>Nimetaja tabia mbili au tatu.</li><li>Nimeeleza faida na changamoto.</li><li>Nimetumia viunganishi vitatu tofauti.</li><li>Nimetoa pendekezo linalotekelezeka.</li></ul></>;}
export function Day27Writing({value,onChange}){const words=value.trim()?value.trim().split(/\s+/).length:0;return <>
 <h2>2 · Kuandika</h2><h3>Kazi ya Kuandika: Kutunza Mazingira katika Maisha ya Kila Siku (Kiwango cha B1)</h3>
 <p><strong>Maelekezo:</strong> Andika insha au ripoti fupi (maneno 120–160) inayoeleza jinsi unavyotunza mazingira katika maisha yako ya kila siku, na kwa nini ni muhimu kufanya hivyo.</p>
 <h3>Mambo unayopaswa kujumuisha katika maandishi yako</h3><ol>{writingPoints.map(([label,description])=><li key={label}><strong>{label}:</strong> {description}</li>)}</ol>
 <h3>Mpango wa kuandika</h3><Table head={["Sehemu","Kianzio cha sentensi"]} rows={[["Utangulizi","Katika ulimwengu wa leo …"],["Njia","Kwanza … Pili … Tatu …"],["Faida","Kwa sababu hiyo … / ili …"],["Changamoto (hiari)","Hata hivyo …"],["Hitimisho","Kwa hitimisho, ninashauri …"]]}/>
 <label htmlFor="sw-b1-27-essay">Andika insha au ripoti yako</label><textarea id="sw-b1-27-essay" rows={12} value={value} onChange={event=>onChange(event.target.value)}/><p aria-live="polite">Maneno: {words} · Lengo: 120–160 {words>0&&(words<120||words>160)?"· Hakikisha urefu unaendana na maelekezo.":""}</p>
 <h3>Orodha ya mwisho</h3><ul><li>Nimeeleza umuhimu wa hifadhi ya mazingira.</li><li>Nimetaja njia mbili au tatu za kila siku.</li><li>Nimeeleza faida kwa afya na mazingira.</li><li>Nimetumia angalau viunganishi vitatu tofauti.</li><li>Nimetoa wito au ushauri na nimekagua idadi ya maneno.</li></ul></>;}
