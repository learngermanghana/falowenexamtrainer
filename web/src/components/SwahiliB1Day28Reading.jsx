import SwahiliObjectiveQuestions from "./SwahiliObjectiveQuestions";
import { ReadingExamFrame, ReadingExamDocument } from "./ReadingExamLayout";
import React from "react";

export const readingQuestions = [
  { id: "read-duty", choices: ["Kwa sababu mazingira safi yanafaa kwa mimea pekee.","Kwa sababu mazingira safi na salama huwezesha binadamu na viumbe wengine kuishi kwa afya njema, na husaidia kupunguza mabadiliko ya tabianchi na magonjwa.","Kwa sababu utunzaji wa mazingira unahusu serikali peke yake."], prompt: "Ni kwa nini kutunza mazingira ni jukumu muhimu katika maisha ya kila siku?", english: "Why is caring for the environment an important duty in daily life?" },
  { id: "read-waste", choices: ["Kurejeleza taka na kutenganisha taka za kikaboni na zile zisizooza.","Kutupa taka ovyo na kuongeza matumizi ya plastiki.","Kuchanganya taka zote na kuzitupa barabarani."], prompt: "Kulingana na insha, ni njia gani mbili za kushughulikia taka vizuri?", english: "According to the essay, what are two ways to handle waste properly?" },
  { id: "read-trees", choices: ["Huongeza uchafuzi wa hewa na matumizi ya maji.","Huongeza mmomonyoko wa udongo na kupunguza mimea.","Hufanya hewa iwe safi na husaidia kuzuia mmomonyoko wa udongo."], prompt: "Kupanda miti kuna faida gani mbili zilizotajwa katika maandishi?", english: "What two benefits of planting trees are mentioned in the text?" },
  { id: "read-energy", choices: ["Husaidia kuongeza matumizi ya rasilimali.","Husaidia kuokoa rasilimali na kupunguza uchafuzi wa hewa.","Husaidia kuongeza uchafuzi wa hewa."], prompt: "Kutumia nishati kwa busara (kama kuzima umeme) husaidia vipi mazingira?", english: "How does using energy wisely, like turning off electricity, help the environment?" },
  { id: "read-message", choices: ["Ni lazima kusubiri serikali kabla ya kufanya chochote.","Vitendo vidogo vya kila siku havina umuhimu.","Inasisitiza kuwa kila kitendo kidogo kina mchango mkubwa, na tukishirikiana tutalinda dunia kwa ajili ya vizazi vya sasa na vijavyo."], prompt: "Insha inasisitiza ujumbe gani mkuu katika hitimisho lake?", english: "What main message does the essay emphasize in its conclusion?" },
];

export default function SwahiliB1Day28Reading({ answers, onAnswer }) {
  return <>
    <h2>3 · Kusoma</h2>
    <ReadingExamFrame level="B1" language="sw" title="Kutunza Mazingira katika Maisha ya Kila Siku" format="Chagua jibu moja"><ReadingExamDocument label="Maandishi">
    <p>Katika ulimwengu wa leo, <strong>kutunza mazingira</strong> ni jukumu muhimu la kila mtu katika maisha ya kila siku. Mazingira safi na salama huwezesha binadamu na viumbe wengine kuishi kwa afya njema. Hata hivyo, kutokana na kuongezeka kwa uchafuzi wa mazingira na matumizi mabaya ya maliasili, jamii nyingi zinakabiliwa na changamoto kubwa za mabadiliko ya tabianchi na magonjwa. Kwa sababu hiyo, ni lazima tuchukue hatua madhubuti za kulinda mazingira yetu kila siku.</p>
    <p>Kuna njia mbalimbali za kutunza mazingira katika maisha ya kila siku. Kwanza, tunapaswa <strong>kupunguza matumizi ya plastiki</strong> na kuanza <strong>kurejeleza taka</strong> (<em lang="en">recycle</em>). Badala ya kutupa taka ovyo, ni vyema kutenganisha taka za kikaboni na zile zisizooza. Pili, <strong>kutumia nishati kwa busara</strong>, kama vile kuzima taa na vyombo vya umeme wakati havihitajiki, husaidia kuokoa rasilimali na kupunguza uchafuzi wa hewa. Tatu, <strong>kupanda miti</strong> na kutunza mimea karibu na nyumba zetu hufanya hewa iwe safi na kuzuia mmomonyoko wa udongo.</p>
    <p>Kwa hitimisho, kila kitendo kidogo tunachofanya nyumbani, shuleni, au kazini kina mchango mkubwa katika hifadhi ya mazingira. Tukishirikiana na kuwajibika kikamilifu, tutaweza kulinda dunia yetu kwa ajili ya vizazi vya sasa na vijavyo. Kumbuka kuwa mazingira bora yanaanza na mimi na wewe.</p>
    </ReadingExamDocument></ReadingExamFrame>
    <details>
      <summary>Sarufi na msamiati · B1 grammar and vocabulary</summary>
      <p><strong>Viunganishi</strong> · Hata hivyo (however), Kwa sababu hiyo (for that reason), Kwanza / Pili / Tatu (firstly / secondly / thirdly), Kwa hitimisho (in conclusion).</p>
      <p><strong>Msamiati</strong> · Uchafuzi wa mazingira (environmental pollution), Mabadiliko ya tabianchi (climate change), Kurejeleza (to recycle), Nishati (energy/power), Mmomonyoko wa udongo (soil erosion).</p>
    </details>
    <h3>Maswali 5 ya Ufahamu</h3>
    <SwahiliObjectiveQuestions questions={readingQuestions} answers={answers} onAnswer={onAnswer} groupName="reading" />
  </>;
}
