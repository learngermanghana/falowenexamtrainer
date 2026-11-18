import React, { useState } from "react";
import SwahiliB1Day28Reading from "./SwahiliB1Day28Reading";
import { Link } from "react-router-dom";
import { useSwahiliWorkbookTab, SwahiliWorkbookNavigation } from "./SwahiliWorkbookNavigation";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";
import { WorkbookTabNav } from "./StandardWorkbookComponents";
import "./SwahiliCourseBook.css";

const tabs = [
  { key: "references", label: "Muziki" },
  { key: "grammar", label: "Sarufi na msamiati" },
  { key: "sprechen", label: "1 · Kuzungumza" },
  { key: "schreiben", label: "2 · Kuandika" },
  { key: "lesen", label: "3 · Kusoma" },
  { key: "hoeren", label: "4 · Kusikiliza" },
  { key: "review", label: "Kujikagua" },
];

const radioIntro = <div lang="sw">
    <h3>🎙️ Falowen Radio · Kutunza Mazingira Kila Siku 10.28</h3>
    <p>Falowen Radio ni hatua ya kusikiliza kabla ya kuanza mazoezi ya somo. Hakuna kazi ya kuwasilisha katika sehemu hii.</p>
    <details><summary>Soma nakala ya kipindi</summary>
    <p>Bwana Ali: Habari na karibu Falowen Radio! Mimi ni Bwana Ali, nikiwa katika studio yetu mjini Arusha. Leo tunazungumzia namna ya kutunza mazingira katika maisha ya kila siku.</p>
    <p>Maria: Ninapoenda kununua bidhaa, ninabeba mfuko wa kitambaa badala ya kuchukua mifuko mipya ya plastiki. Pia ninatumia chupa ya maji inayoweza kutumiwa tena.</p>
    <p>Bwana Ali: Unafanya nini na taka nyumbani?</p>
    <p>Maria: Ninatenganisha karatasi, plastiki, chupa na taka za chakula kulingana na utaratibu wa eneo letu. Ni muhimu kujua sheria za mahali tunapoishi.</p>
    <p>Bwana Ali: Sasa tunaye Juma kutoka Moshi. Unaokoa vipi maji na nishati?</p>
    <p>Juma: Ninazima taa na vifaa nisivyotumia. Pia ninafunga bomba la maji ninapopiga mswaki na ninaoga kwa muda mfupi ili niokoe maji.</p>
    <p>Bwana Ali: Asha kutoka Dar es Salaam, unasafiri vipi?</p>
    <p>Asha: Kwa safari fupi ninatembea au kutumia baiskeli. Kwa safari ndefu ninatumia basi inapowezekana. Pia ninanunua vyakula vya eneo letu na vya msimu.</p>
    <p>Bwana Ali: Asanteni! Kupunguza plastiki, kutenganisha taka, kuokoa maji na nishati, na kuchagua usafiri mzuri ni hatua ndogo zenye maana.</p>
    </details>
    <h3>Mambo ya kuzingatia</h3>
    <p>Maria anatumia nini badala ya mifuko mipya ya plastiki?</p>
    <p>Juma anaokoaje maji na nishati?</p>
    <p>Asha anachagua usafiri gani kwa safari fupi?</p>
    <p>Ni tabia gani unaweza kuanza wiki hii?</p>
  </div>;

export default function SwahiliB1Day28Workbook({ uid }) {
  const [activeTab, selectTab] = useSwahiliWorkbookTab(tabs);
  const draftKey = uid && `swahili-b1-day-28:writing:${uid}`;
  const [writing, setWriting] = useState(() => {
    try { return (draftKey && sessionStorage.getItem(draftKey)) || ""; }
    catch { return ""; }
  });
  const readingKey = uid && `swahili-b1-day-28:reading:${uid}`;
  const [reading, setReading] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(readingKey)) || {}; }
    catch { return {}; }
  });
  function updateReading(id, text) {
    const next = { ...reading, [id]: text };
    setReading(next);
    try { if (readingKey) sessionStorage.setItem(readingKey, JSON.stringify(next)); }
    catch { /* Keep answers editable when browser storage is unavailable. */ }
  }
  function updateWriting(text) {
    setWriting(text);
    try { if (draftKey) sessionStorage.setItem(draftKey, text); }
    catch { /* The exercise remains editable when browser storage is unavailable. */ }
  }
  return (
    <RadioFirstWorkbookGate level="Kiswahili B1" day={28} transcriptIntro={radioIntro}>
    <main className="swahili-book swahili-book--workbook" lang="sw">
      <Link to="/campus/course">← Kitabu cha kozi</Link>
      <header className="swahili-book__hero">
        <p>Kiswahili B1 · Somo la 28 · 10.28</p>
        <h1>Kutunza Mazingira katika Maisha ya Kila Siku</h1>
        <p>Mwisho wa siku utaweza kutaja angalau tabia tatu zinazolinda mazingira, kueleza namna na lengo la tendo, na kutoa pendekezo moja linaloweza kutekelezwa katika eneo unaloishi.</p>
      </header>
      <WorkbookTabNav activeTab={activeTab} onChange={selectTab} tabs={tabs}
        ariaLabel="Kiswahili B1 Somo la 28" renderLegacyGrammarPanel={false} />
      <section className="swahili-book__card" role="tabpanel" tabIndex={-1} aria-label={tabs.find(tab => tab.key === activeTab).label}>
        {activeTab === "references" && <>
          <h2>Muziki</h2>
          <h3>Mazingira huanza mlangoni kwetu</h3>
          <div style={{ overflowX: "auto" }}><table><thead><tr><th scope="col">Kiswahili</th><th scope="col">English</th></tr></thead><tbody>
          <tr><td>BETI YA 1</td><td></td></tr>
          <tr><td>Mbele ya nyumba yetu kuna taka nyingi.</td><td>There is a lot of rubbish outside our house.</td></tr>
          <tr><td>Majirani wengine wanalalamika,</td><td>Some neighbours complain,</td></tr>
          <tr><td>lakini kwa muda mrefu hakuna aliyeanza.</td><td>but for a long time nobody has started.</td></tr>
          <tr><td>KIITIKIO</td><td></td></tr>
          <tr><td>Mazingira huanza mlangoni kwetu,</td><td>The environment starts at our doorstep,</td></tr>
          <tr><td>kwa hatua ndogo kila siku.</td><td>with small steps every day.</td></tr>
          <tr><td>Pamoja tunaweza kuleta mabadiliko.</td><td>Together, we can make a difference.</td></tr>
          <tr><td>BETI YA 2</td><td></td></tr>
          <tr><td>Tunawaalika majirani kufanya usafi.</td><td>We invite the neighbours to clean up.</td></tr>
          <tr><td>Tunatenganisha taka na kupanda maua,</td><td>We sort the waste and plant flowers,</td></tr>
          <tr><td>ili mtaa wetu uwe safi na mzuri.</td><td>so that our neighbourhood becomes clean and beautiful.</td></tr>
          <tr><td>MWISHO</td><td></td></tr>
          <tr><td>Jioni tunakaa pamoja uwanjani.</td><td>In the evening, we sit together in the courtyard.</td></tr>
          <tr><td>Wazo moja limeleta jambo zuri.</td><td>One idea has created something good.</td></tr>
          </tbody></table></div>
          <h3>Baada ya kusoma au kusikiliza</h3>
          <p>Ni tatizo gani linatajwa mwanzoni?</p>
          <p>Majirani wanafanya nini pamoja?</p>
          <p>Ujumbe mkuu wa kiitikio ni upi?</p>
          <details><summary>Ujumbe mkuu</summary>
          <p>Ujumbe mkuu
          Mabadiliko makubwa yanaweza kuanza na hatua ndogo zinazofanywa na watu wengi kila siku.</p>
          </details>
        </>}
        {activeTab === "grammar" && <>
          <h2>Sarufi na msamiati</h2>
          <h3>1. Msamiati muhimu</h3>
          <div style={{ overflowX: "auto" }}><table><thead><tr><th scope="col">Kiswahili</th><th scope="col">Maana / mfano</th><th scope="col">English</th></tr></thead><tbody>
          <tr><td>mazingira</td><td>vitu na hali zinazotuzunguka</td><td>environment</td></tr>
          <tr><td>uendelevu</td><td>kutumia rasilimali bila kuharibu maisha ya baadaye</td><td>sustainability</td></tr>
          <tr><td>rafiki kwa mazingira</td><td>kisichosababisha madhara makubwa kwa mazingira</td><td>environmentally friendly</td></tr>
          <tr><td>taka</td><td>vitu vilivyotupwa; kutenganisha taka</td><td>waste; to sort waste</td></tr>
          <tr><td>kifungashio</td><td>kitu kinachofunika au kuhifadhi bidhaa</td><td>packaging</td></tr>
          <tr><td>kutumia tena</td><td>kutumia kitu zaidi ya mara moja</td><td>to reuse</td></tr>
          <tr><td>mfuko wa kitambaa</td><td>mfuko unaoweza kutumiwa mara nyingi</td><td>cloth bag</td></tr>
          <tr><td>chupa ya matumizi mengi</td><td>chupa inayoweza kujazwa tena</td><td>reusable bottle</td></tr>
          <tr><td>kuokoa maji / nishati</td><td>kupunguza matumizi yasiyo ya lazima</td><td>to save water / energy</td></tr>
          <tr><td>bomba la maji</td><td>sehemu ambayo maji hutoka</td><td>tap / faucet</td></tr>
          <tr><td>malighafi</td><td>vitu vya asili vinavyotumiwa kutengeneza bidhaa</td><td>raw materials</td></tr>
          <tr><td>usafiri wa umma</td><td>basi, treni na vyombo vingine vya pamoja</td><td>public transport</td></tr>
          <tr><td>vyakula vya msimu</td><td>vyakula vinavyopatikana katika kipindi fulani</td><td>seasonal food</td></tr>
          <tr><td>kurejeleza</td><td>kutengeneza bidhaa mpya kutokana na vitu vilivyotumika</td><td>to recycle</td></tr>
          </tbody></table></div>
          <h3>2. Maneno yanayotumika pamoja</h3>
          <div style={{ overflowX: "auto" }}><table><thead><tr><th scope="col">Muundo</th><th scope="col">Mfano</th></tr></thead><tbody>
          <tr><td>kupunguza taka</td><td>Tunapunguza taka kwa kutumia mifuko yetu.</td></tr>
          <tr><td>kuzima vifaa</td><td>Ninazima vifaa nisivyotumia.</td></tr>
          <tr><td>kufunga bomba la maji</td><td>Anafunga bomba anapopiga mswaki.</td></tr>
          <tr><td>kuhifadhi rasilimali</td><td>Kutumia tena husaidia kuhifadhi rasilimali.</td></tr>
          <tr><td>kuandaa shughuli</td><td>Majirani wanaandaa shughuli ya kusafisha eneo.</td></tr>
          </tbody></table></div>
          <h3>1. Kueleza namna kwa “kwa + kitenzi-jina”</h3>
          <p>Tumia kwa + kitenzi-jina kueleza namna tendo linavyofanyika. In English, this often means “by doing”.</p>
          <p>Tunaokoa umeme kwa kuzima taa.</p>
          <p>Tunapunguza plastiki kwa kutumia mifuko ya kitambaa.</p>
          <p>Majirani wanatusaidia kwa kuleta vifaa vyao.</p>
          <h3>2. Kutaja njia mbadala kwa “badala ya”</h3>
          <p>Tumia badala ya kuonyesha uchaguzi mwingine.</p>
          <p>Badala ya kutumia gari, ninatembea kwa miguu.</p>
          <p>Ninatumia chupa yangu badala ya kununua chupa mpya.</p>
          <p>Badala ya kununua vifaa vipya, tunaazima vifaa vya majirani.</p>
          <h3>3. Kueleza tendo lisilofanyika kwa “bila”</h3>
          <p>Ninaenda sokoni bila kuchukua mfuko mpya wa plastiki.</p>
          <p>Tunaweza kusafisha eneo bila kununua vifaa vipya.</p>
          <h3>4. Kutaja lengo kwa “ili”</h3>
          <p>Baada ya ili, tumia kitenzi kinachoonyesha lengo linalotarajiwa.</p>
          <p>Tunahifadhi maji ili tuwe na maji ya kutosha baadaye.</p>
          <p>Tunaweka mapipa tofauti ili watu watenganishe taka.</p>
          <p>Ninatembea kwa miguu ili nipunguze uchafuzi wa hewa.</p>
          <h3>Zoezi A · Unganisha sentensi</h3>
          <p>1. Tunaokoa karatasi. Tunachapisha pande zote mbili. (kwa)</p>
          <p>2. Sinunui mfuko mpya. Ninatumia mfuko wangu wa zamani. (badala ya)</p>
          <p>3. Majirani wanasaidia. Wanaleta vifaa. (kwa)</p>
          <p>4. Hatutumii gari. Tunatembea kwa miguu. (badala ya)</p>
          <h3>Zoezi B · Jaza: kwa, badala ya, bila au ili</h3>
          <p>1. Ninabeba chupa yangu __________ kununua chupa mpya.</p>
          <p>2. Tunaokoa umeme __________ kuzima vifaa tusivyotumia.</p>
          <p>3. Anaoga kwa muda mfupi __________ aokoe maji.</p>
          <p>4. Anaenda dukani __________ kuchukua mfuko mpya wa plastiki.</p>
          <details><summary>Angalia majibu ya sarufi</summary>
          <div style={{ overflowX: "auto" }}><table><thead><tr><th scope="col">Zoezi</th><th scope="col">Jibu</th></tr></thead><tbody>
          <tr><td>A1</td><td>Tunaokoa karatasi kwa kuchapisha pande zote mbili.</td></tr>
          <tr><td>A2</td><td>Badala ya kununua mfuko mpya, ninatumia mfuko wangu wa zamani.</td></tr>
          <tr><td>A3</td><td>Majirani wanasaidia kwa kuleta vifaa.</td></tr>
          <tr><td>A4</td><td>Badala ya kutumia gari, tunatembea kwa miguu.</td></tr>
          <tr><td>B1</td><td>badala ya</td></tr>
          <tr><td>B2</td><td>kwa</td></tr>
          <tr><td>B3</td><td>ili</td></tr>
          <tr><td>B4</td><td>bila</td></tr>
          </tbody></table></div>
          </details>
          <h3>Faida, changamoto na maoni</h3>
          <div style={{ overflowX: "auto" }}><table><thead><tr><th scope="col">Hatua</th><th scope="col">Muundo wa sentensi</th><th scope="col">Mfano</th></tr></thead><tbody>
          <tr><td>Faida</td><td>Faida moja ni kwamba …</td><td>Faida moja ni kwamba tunaweza kuokoa pesa.</td></tr>
          <tr><td>Changamoto</td><td>Changamoto moja ni kwamba …</td><td>Baadhi ya bidhaa rafiki kwa mazingira ni ghali.</td></tr>
          <tr><td>Tofauti</td><td>Hata hivyo … / Ingawa …</td><td>Ingawa si rahisi kila wakati, hatua ndogo husaidia.</td></tr>
          <tr><td>Maoni</td><td>Kwa maoni yangu …</td><td>Kwa maoni yangu, kila mtu anaweza kuanza na tabia moja.</td></tr>
          </tbody></table></div>
          <h3>Epuka makosa haya</h3>
          <div style={{ overflowX: "auto" }}><table><thead><tr><th scope="col">Si sahihi</th><th scope="col">Sahihi</th></tr></thead><tbody>
          <tr><td>Tunaokoa umeme kwa tunazima taa.</td><td>Tunaokoa umeme kwa kuzima taa.</td></tr>
          <tr><td>Ili tunaokoa maji, tunaoga haraka.</td><td>Ili tuokoe maji, tunaoga kwa muda mfupi.</td></tr>
          <tr><td>Badala ya tunatumia gari, tunatembea.</td><td>Badala ya kutumia gari, tunatembea.</td></tr>
          </tbody></table></div>
        </>}
        {activeTab === "sprechen" && <>
          <h2>1 · Kuzungumza</h2>
          <p>Swali la siku</p>
          <p>Unafanya nini ili kutunza mazingira katika maisha yako ya kila siku? Taja tabia moja, faida moja, changamoto moja na pendekezo linaloweza kutekelezwa. Andaa jibu la sekunde 60–90.</p>
          <h3>Ramani ya mawazo</h3>
          <div style={{ overflowX: "auto" }}><table><thead><tr><th scope="col">Eneo</th><th scope="col">Mawazo</th></tr></thead><tbody>
          <tr><td>Taka</td><td>kutenganisha taka; kupunguza plastiki; kutumia tena</td></tr>
          <tr><td>Maji na nishati</td><td>kufunga bomba; kuoga kwa muda mfupi; kuzima taa</td></tr>
          <tr><td>Usafiri</td><td>kutembea; baiskeli; basi; kushirikiana gari</td></tr>
          <tr><td>Ununuzi</td><td>mfuko wa kitambaa; bidhaa za eneo; bidhaa za msimu</td></tr>
          <tr><td>Jamii</td><td>kusafisha eneo; kupanda miti; kutoa elimu</td></tr>
          </tbody></table></div>
          <h3>Maelezo ya kujifunza · Kutoka wazo hadi jibu</h3>
          <div style={{ overflowX: "auto" }}><table><thead><tr><th scope="col">Hatua</th><th scope="col">Swali la kujiuliza</th><th scope="col">Kianzio cha sentensi</th></tr></thead><tbody>
          <tr><td>1. Mada</td><td>Ninazungumzia nini?</td><td>Leo ningependa kuzungumzia …</td></tr>
          <tr><td>2. Tabia binafsi</td><td>Ninafanya nini tayari?</td><td>Katika maisha yangu ya kila siku …</td></tr>
          <tr><td>3. Faida</td><td>Tabia hiyo inasaidiaje?</td><td>Faida moja ni kwamba …</td></tr>
          <tr><td>4. Changamoto</td><td>Ni jambo gani si rahisi?</td><td>Changamoto moja ni kwamba …</td></tr>
          <tr><td>5. Pendekezo</td><td>Tunaweza kuanza na nini?</td><td>Ninapendekeza kwamba …</td></tr>
          <tr><td>6. Hitimisho</td><td>Maoni yangu ya mwisho ni yapi?</td><td>Kwa kumalizia, ninaamini kwamba …</td></tr>
          </tbody></table></div>
          <details><summary>Mfano wa jibu</summary>
          <p>Mfano wa jibu
          Habari zenu. Leo ningependa kuzungumzia kutunza mazingira katika maisha ya kila siku. Ninajaribu kupunguza taka kwa kubeba mfuko wangu wa kitambaa na chupa ya maji. Pia ninatembea kwa miguu badala ya kutumia gari kwa safari fupi. Faida moja ni kwamba ninaokoa pesa na kupunguza uchafuzi wa hewa. Hata hivyo, wakati wa mvua si rahisi kutembea au kutumia baiskeli. Katika eneo ninapoishi, tunaweza kupanga siku ya kusafisha mazingira. Kwa maoni yangu, si lazima mtu abadili kila kitu mara moja. Tukianza na tabia moja rahisi, watu wengi wanaweza kuleta mabadiliko makubwa.</p>
          </details>
          <h3>Kazi ya jozi · Panga shughuli ya mazingira</h3>
          <p>Pangeni shughuli ya kusafisha eneo. Kubalianeni kuhusu:</p>
          <p>mahali, tarehe na saa;</p>
          <p>vifaa vinavyohitajika;</p>
          <p>mgawanyo wa kazi;</p>
          <p>mtakachofanya mvua ikinyesha;</p>
          <p>namna ya kuwajulisha majirani.</p>
          <p>Tofauti ya maoni</p>
          <p>Mwanafunzi A anataka kununua vifaa vipya. Mwanafunzi B anataka kuazima au kutumia vifaa vilivyopo. Tafuteni mwafaka.</p>
          <h3>Misemo muhimu</h3>
          <div style={{ overflowX: "auto" }}><table><thead><tr><th scope="col">Kusudi</th><th scope="col">Misemo</th></tr></thead><tbody>
          <tr><td>Kutoa pendekezo</td><td>Ninapendekeza kwamba … / Vipi kama …?</td></tr>
          <tr><td>Kukubaliana</td><td>Hilo ni wazo zuri. / Hilo linanifaa.</td></tr>
          <tr><td>Kutokubaliana</td><td>Ninaona tofauti kwa sababu …</td></tr>
          <tr><td>Kutoa njia mbadala</td><td>Badala ya …, tunaweza …</td></tr>
          <tr><td>Kutaja lengo</td><td>Tunaweza … ili …</td></tr>
          </tbody></table></div>
          <h3>Orodha ya kujikagua</h3>
          <p>Nimetaja tabia binafsi.</p>
          <p>Nimeeleza faida na changamoto.</p>
          <p>Nimetumia kwa, badala ya, bila au ili.</p>
          <p>Nimetoa pendekezo linaloweza kutekelezwa.</p>
          <p>Nimehitimisha kwa maoni wazi.</p>
        </>}
        {activeTab === "schreiben" && <>
          <h2>2 · Kuandika</h2>
          <p>Kazi yako · Barua pepe</p>
          <p>Waandikie majirani barua pepe ya maneno 100–120. Waalike kwenye shughuli ya pamoja ya kutunza mazingira. Eleza tatizo, taja mahali na wakati, fafanua kazi mbili na uombe jibu. Tumia angalau muundo mmoja wa namna, njia mbadala au lengo.</p>
          <h3>Mpango wa kuandika</h3>
          <div style={{ overflowX: "auto" }}><table><thead><tr><th scope="col">Kipengele</th><th scope="col">Maudhui</th><th scope="col">Muundo muhimu</th></tr></thead><tbody>
          <tr><td>Anwani</td><td>watu unaowaandikia</td><td>Wapendwa majirani,</td></tr>
          <tr><td>Sababu</td><td>tatizo na madhumuni</td><td>Katika eneo letu … Kwa hiyo …</td></tr>
          <tr><td>Mahali na muda</td><td>wapi na lini</td><td>Tutakutana … saa …</td></tr>
          <tr><td>Kazi</td><td>mambo mawili ya kufanya</td><td>Kwanza … Baadaye …</td></tr>
          <tr><td>Vifaa</td><td>vitu vya kuleta</td><td>Tafadhali, leteni …</td></tr>
          <tr><td>Jibu na mwisho</td><td>ombi la uthibitisho</td><td>Tafadhali nijulishe … Salamu,</td></tr>
          </tbody></table></div>
          <label htmlFor="sw-b1-28-writing">Andika barua pepe yako</label>
          <textarea id="sw-b1-28-writing" rows={9} value={writing} onChange={event => updateWriting(event.target.value)} />
          <p>Maneno: {writing.trim() ? writing.trim().split(/\s+/).length : 0} · Lengo: 100–120</p>
          <details><summary>Mfano wa barua pepe</summary>
          <p>Mada: Tuisafishe na kuipendezesha sehemu yetu</p>
          <p>Wapendwa majirani,</p>
          <p>Katika uwanja wetu kuna taka nyingi. Kwa hiyo, ningependa kuwaalika kwenye shughuli ya pamoja ya usafi siku ya Jumamosi saa nne asubuhi. Tutakutana mbele ya lango kuu.</p>
          <p>Kwanza tutakusanya na kutenganisha taka. Baadaye tutapanda maua ili eneo letu liwe safi na zuri. Tafadhali, leteni glavu na ndoo mlizo nazo. Badala ya kununua vifaa vipya, tunaweza kuazima vifaa kutoka kwa majirani.</p>
          <p>Mvua kubwa ikinyesha, tutahamisha shughuli hadi Jumamosi inayofuata. Tafadhali nijulishe kabla ya Alhamisi kama utaweza kushiriki.</p>
          <p>Salamu,</p>
          <p>Lena</p>
          </details>
          <h3>Orodha ya mwisho</h3>
          <p>Nimeeleza tatizo na sababu ya kuandika.</p>
          <p>Nimetaja mahali, tarehe na saa.</p>
          <p>Nimetaja kazi na vifaa.</p>
          <p>Nimetumia muundo unaofaa wa sarufi.</p>
          <p>Nimeomba jibu na kuhitimisha kwa salamu.</p>
        </>}
        {activeTab === "lesen" && <SwahiliB1Day28Reading answers={reading} onAnswer={updateReading} />}
        {activeTab === "hoeren" && <>
          <h2>4 · Kusikiliza</h2>
          <p>Sauti na maswali ya kusikiliza vitaongezwa baadaye.</p>
        </>}
        {activeTab === "review" && <>
          <h2>Kujikagua</h2>
          <h3>Tathmini binafsi</h3>
          <ul><li>kutaja tabia zinazolinda mazingira.</li><li>kueleza namna kwa “kwa + kitenzi-jina”.</li><li>kutaja njia mbadala kwa “badala ya”.</li><li>kueleza lengo kwa “ili”.</li><li>kutoa maoni yenye faida, changamoto na pendekezo.</li><li>kuandika mwaliko mfupi wa shughuli ya mazingira.</li></ul>
          <h3>Kazi ya ziada · Tafakari</h3>
          <p>Ni tabia gani ya mazingira ambayo ni rahisi kwako kuanza?</p>
          <p>Ni changamoto gani iliyopo katika eneo unaloishi?</p>
          <p>Unaweza kuwashirikisha watu wengine kwa njia gani?</p>
          <details><summary>Mfano wa maoni mafupi</summary>
          <p>Jibu linalowezekana
          Kwa maoni yangu, kutunza mazingira ni jukumu la kila mtu. Ninaweza kuanza kwa kutumia mfuko wangu na kuzima taa nisizohitaji. Ingawa hatua hizo ni ndogo, watu wengi wakizifanya tunaweza kupunguza taka na matumizi ya nishati. Ninapendekeza pia shughuli za pamoja katika maeneo tunayoishi.</p>
          </details>
        </>}
      </section>
      <SwahiliWorkbookNavigation tabs={tabs} activeTab={activeTab} onChange={selectTab} />
    </main>
    </RadioFirstWorkbookGate>
  );
}
