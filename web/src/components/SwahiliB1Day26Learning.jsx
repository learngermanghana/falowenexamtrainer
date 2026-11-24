import React, { useState } from "react";

const vocabulary = [
  ["safari / msafiri","journey / traveller","Msafiri alikagua tiketi yake."],
  ["kuchelewa / kufutwa","to be delayed / cancelled","Safari ya ndege ilifutwa."],
  ["kupata pancha","to get a flat tyre","Basi lilipata pancha."],
  ["msongamano wa magari","traffic congestion","Tulichelewa kwa sababu ya msongamano wa magari."],
  ["mizigo / upotevu wa mizigo","luggage / loss of luggage","Mizigo yangu ilipotea."],
  ["nyaraka muhimu","important documents","Nilitengeneza nakala za nyaraka muhimu."],
  ["mpango mbadala","alternative plan","Tulikuwa na mpango mbadala."],
  ["malipo ya ziada","additional payment","Tulilipa malipo ya ziada."],
  ["usafiri wa kuaminika","reliable transport","Tulichagua usafiri wa kuaminika."],
  ["suluhisho / kusuluhisha","solution / to resolve","Tulitafuta suluhisho pamoja."],
  ["kuwasiliana na","to contact","Niliwasiliana na kampuni ya usafiri."],
  ["kujiandaa mapema","to prepare early","Ni muhimu kujiandaa mapema."],
];
const connectors = [
  ["Hata hivyo","However · tofauti","Tuliondoka mapema. Hata hivyo, tulichelewa."],
  ["Kwa sababu hiyo","For that reason · matokeo","Basi liliharibika. Kwa sababu hiyo, tulitafuta basi jingine."],
  ["Kwanza","First · mwanzo","Kwanza, tulimwuliza dereva kuhusu tatizo."],
  ["Pili","Secondly · mwendelezo","Pili, tuliwasiliana na kampuni ya usafiri."],
  ["Mwishowe","Finally · mwisho","Mwishowe, tulifika salama."],
  ["Ili","So that / in order to · lengo","Nilipiga simu ili nipate msaada."],
  ["Kwa sababu","Because · sababu","Tulichelewa kwa sababu basi lilipata pancha."],
  ["Ingawa","Although · tofauti","Ingawa tulichelewa, tulifika salama."],
];
const practice = [
  {prompt:"Tuliondoka mapema. ___, tulichelewa kwa sababu ya foleni.",choices:["Hata hivyo","Ili","Kwanza"],answer:"Hata hivyo",why:"Inaonyesha tofauti kati ya mpango na matokeo."},
  {prompt:"Basi liliharibika. ___, tulinunua tiketi nyingine.",choices:["Kwa sababu hiyo","Ingawa","Ili"],answer:"Kwa sababu hiyo",why:"Inaonyesha matokeo ya tatizo."},
  {prompt:"Nilipiga simu ___ nipate msaada.",choices:["ili","hata hivyo","mwishowe"],answer:"ili",why:"Inaonyesha lengo; nipate ni kitenzi cha hali ya utegemezi."},
  {prompt:"Kwanza, tulimwuliza dereva. ___, tuliwasiliana na kampuni.",choices:["Pili","Ingawa","Kwa sababu"],answer:"Pili",why:"Inaonyesha hatua ya pili."},
  {prompt:"___ tulichelewa, tulifika salama.",choices:["Ingawa","Ili","Mwishowe"],answer:"Ingawa",why:"Inaunganisha hali mbili zinazotofautiana."},
];
function Table({head,rows}) {
  return <div style={{overflowX:"auto"}}><table><thead><tr>{head.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
export function Day26Grammar() {
  const [answers,setAnswers]=useState({});
  const [checked,setChecked]=useState(false);
  return <>
    <h2>Sarufi na msamiati</h2>
    <h3>1. Msamiati muhimu wa safari</h3><Table head={["Kiswahili","English","Mfano"]} rows={vocabulary}/>
    <h3>2. Viunganishi vya kiwango cha B1</h3>
    <p>Viunganishi huonyesha sababu, matokeo, tofauti, mpangilio wa matukio na lengo. Vitumie kueleza tatizo na suluhisho kwa uwazi.</p>
    <Table head={["Kiunganishi","Matumizi","Mfano"]} rows={connectors}/>
    <h3>3. Wakati uliopita: -li- na kukanusha kwa -ku-</h3>
    <p>Tumia -li- kueleza tukio lililotokea zamani. Katika kukanusha wakati uliopita, tumia kiambishi cha ukanushi na -ku-: nilifika → sikufika; tulipata → hatukupata.</p>
    <Table head={["Tukio","Ukanushi","English"]} rows={[["Nilipoteza tiketi.","Sikupoteza tiketi.","I lost / did not lose the ticket."],["Tulichelewa.","Hatukuchelewa.","We were / were not late."],["Basi liliondoka.","Basi halikuondoka.","The bus left / did not leave."]]}/>
    <h3>4. Lengo na ushauri: ili + hali ya utegemezi</h3>
    <p>Baada ya ili, tumia hali ya utegemezi inapohitajika: nipate, tufike, wasipoteze. Kwa vitenzi vingi vinavyoishia -a, badili -a kuwa -e. Kukanusha: ili nisichelewe.</p>
    <Table head={["Lengo","Ushauri"]} rows={[["Niliondoka mapema ili nisichelewe.","Ni vizuri kuondoka mapema."],["Tuliweka lebo ili tupate mizigo yetu kwa urahisi.","Unapaswa kuweka lebo kwenye kila begi."],["Nilipiga simu ili nipate msaada.","Ni bora kuwasiliana na kampuni ya usafiri."]]}/>
    <h3>5. Epuka makosa haya</h3><Table head={["Si sahihi","Sahihi"]} rows={[["Ili ninapata msaada.","Ili nipate msaada."],["Silikufika kwa wakati.","Sikufika kwa wakati."],["Ingawa tulichelewa, lakini tulifika salama.","Ingawa tulichelewa, tulifika salama."]]}/>
    <h3>Zoezi A · Chagua kiunganishi sahihi</h3>
    {practice.map(({prompt,choices,answer,why},i)=><fieldset key={prompt}><legend>{i+1}. {prompt}</legend>{choices.map(choice=><label key={choice} style={{display:"block"}}><input type="radio" name={"sw26-grammar-"+i} checked={answers[i]===choice} onChange={()=>{setAnswers(old=>({...old,[i]:choice}));setChecked(false);}}/> {choice}</label>)}{checked&&<p>{answers[i]===answer?"Sahihi!":"Jibu sahihi: "+answer+"."} {why}</p>}</fieldset>)}
    <button type="button" disabled={Object.keys(answers).length!==practice.length} onClick={()=>setChecked(true)}>Kagua majibu</button>
    {checked&&<p role="status">{practice.filter((q,i)=>answers[i]===q.answer).length} / {practice.length}</p>}
    <h3>Zoezi B · Unganisha sentensi</h3><ol><li>Basi lilichelewa. Tulitafuta usafiri mwingine. (Kwa sababu hiyo)</li><li>Tulipiga simu. Tulitaka kupata msaada. (ili)</li><li>Tulikuwa tumechoka. Tulifika salama. (Ingawa)</li></ol>
    <details><summary>Angalia majibu ya mfano</summary><ol><li>Basi lilichelewa. Kwa sababu hiyo, tulitafuta usafiri mwingine.</li><li>Tulipiga simu ili tupate msaada.</li><li>Ingawa tulikuwa tumechoka, tulifika salama.</li></ol></details>
  </>;
}
export function Day26Speaking() {
  return <>
    <h2>1 · Kuzungumza</h2><h3>Swali la siku</h3>
    <p>Eleza safari ambayo haikuenda kama ulivyopanga. Andaa jibu la sekunde 60–90. Taja ulipoenda, tatizo, hatua ulizochukua, matokeo na ushauri mmoja. Tumia angalau viunganishi vitatu vya B1.</p>
    <h3>Ramani ya mawazo</h3><Table head={["Kipengele","Maswali ya kujiuliza","Kianzio cha sentensi"]} rows={[
      ["Utangulizi","Ulienda wapi? Ulisafiri na nani?","Wiki iliyopita nilisafiri kwenda …"],
      ["Tatizo","Nini kilitokea?","Hata hivyo, tulikumbana na …"],
      ["Sababu / matokeo","Kwa nini? Nini kilifuata?","Kwa sababu hiyo …"],
      ["Suluhisho","Ulifanya nini kwanza na baadaye?","Kwanza … Pili …"],
      ["Hitimisho","Safari iliishaje? Una ushauri gani?","Mwishowe … Ninashauri kwamba …"],
    ]}/>
    <details><summary>Mfano wa jibu</summary><p>Mwezi uliopita nilisafiri kwenda Tanga pamoja na rafiki yangu kwa basi. Hata hivyo, basi liliharibika njiani. Kwa sababu hiyo, tulichelewa kufika. Kwanza, tulimwuliza dereva kuhusu tatizo. Pili, tuliwasiliana na kampuni ya usafiri ili tupate basi jingine. Mwishowe, tulifika salama, ingawa tulichelewa kwa saa mbili. Ninashauri wasafiri waondoke mapema na wawe na mpango mbadala.</p></details>
    <h3>Kazi ya jozi · Tatizo kituoni</h3><p>Mwanafunzi A: Basi lako limefutwa na una miadi muhimu. Eleza hali yako na uombe msaada. Mwanafunzi B: Wewe ni mfanyakazi wa kampuni ya usafiri. Pendekeza basi jingine au kurejesha nauli. Jadilianeni kuhusu muda, gharama na tiketi; kubalianeni kuhusu suluhisho.</p>
    <h3>Misemo muhimu</h3><Table head={["Kusudi","Mfano"]} rows={[["Kuomba msaada","Je, unaweza kunisaidia kupata basi jingine?"],["Kueleza tatizo","Samahani, safari yangu imefutwa."],["Kupendekeza","Ningependekeza tutafute usafiri mwingine."],["Kuuliza kuhusu gharama","Je, nitalazimika kulipa malipo ya ziada?"],["Kukubaliana","Hilo ni wazo zuri. Tukubaliane kuhusu muda."]]}/>
    <h3>Orodha ya kujikagua</h3><ul><li>Nimeeleza tatizo na sababu yake.</li><li>Nimetumia wakati uliopita.</li><li>Nimeeleza suluhisho kwa mpangilio.</li><li>Nimetumia angalau viunganishi vitatu.</li><li>Nimetoa ushauri unaofaa.</li></ul>
  </>;
}
export function Day26Writing({value,onChange}) {
  const words=value.trim()?value.trim().split(/\s+/).length:0;
  return <>
    <h2>2 · Kuandika</h2><h3>Kazi ya Kuandika: Matatizo ya Safari na Suluhisho Zake (Kiwango cha B1)</h3>
    <p><strong>Maelekezo:</strong> Andika insha au ripoti fupi (maneno 120–160) inayoeleza changamoto au tatizo ulilokumbana nalo wakati wa safari yako, na jinsi ulivyoweza kulisuluhisha.</p>
    <h3>Mambo unayopaswa kujumuisha</h3><ol>
      <li><strong>Utangulizi:</strong> Eleza kwa ufupi kuhusu safari yako (ulikuwa unaenda wapi, ulitumia aina gani ya usafiri, na ulikuwa na nani).</li>
      <li><strong>Maelezo ya Tatizo:</strong> Eleza kwa kina changamoto iliyotokea (k.m. kuchelewa au kufutwa kwa ndege/basi, kupotea kwa mizigo, au kupoteza nyaraka muhimu).</li>
      <li><strong>Hatua za Suluhisho:</strong> Eleza hatua ulizochukua ili kutatua tatizo hilo au jinsi ulivyosaidiwa.</li>
      <li><strong>Matumizi ya Viunganishi vya B1:</strong> Tumia angalau viunganishi vitatu tofauti kati ya hivi: Hata hivyo (However); Kwa sababu hiyo (For that reason); Kwanza / Pili / Mwishowe (First / Secondly / Finally); Ili (In order to / So that).</li>
      <li><strong>Hitimisho na Ushauri:</strong> Malizia kwa kutoa ushauri mfupi kwa wasafiri wengine kuhusu jinsi ya kujilinda na matatizo kama hayo.</li></ol>
    <h3>Mpango wa kuandika</h3><Table head={["Sehemu","Kianzio cha sentensi"]} rows={[["Utangulizi","Mwezi uliopita nilisafiri …"],["Tatizo","Hata hivyo, …"],["Matokeo","Kwa sababu hiyo, …"],["Suluhisho","Kwanza, … Pili, … ili …"],["Hitimisho","Mwishowe, … Ninawashauri wasafiri …"]]}/>
    <label htmlFor="sw-b1-26-essay">Andika insha au ripoti yako</label><textarea id="sw-b1-26-essay" rows={12} value={value} onChange={event=>onChange(event.target.value)}/>
    <p aria-live="polite">Maneno: {words} · Lengo: 120–160 {words>0&&(words<120||words>160)?"· Hakikisha urefu unaendana na maelekezo.":""}</p>
    <h3>Orodha ya mwisho</h3><ul><li>Nimetaja mahali, usafiri na niliyesafiri naye.</li><li>Nimeeleza tatizo kwa kina.</li><li>Nimeeleza hatua za kulitatua.</li><li>Nimetumia viunganishi vitatu tofauti vya B1.</li><li>Nimemalizia kwa ushauri na nimekagua idadi ya maneno.</li></ul>
  </>;
}
