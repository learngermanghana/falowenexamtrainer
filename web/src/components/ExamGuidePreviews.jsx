import React, {useState} from "react";
import "./ExamGuidePreviews.css";

// Short, manually checked extracts from the Academy's uploaded A1/A2/B1
// book PDFs. They are formatted for preview; not scans of the printed pages.
const PREVIEWS = Object.freeze({
  A1: [
    {page:5,module:"Grammar & register",heading:"Du oder Sie?",
     lead:"GERMAN REGISTERS: INFORMAL (DU) VS. FORMAL (SIE)",
     lines:["Informal: Liebe Anna, / Lieber Thomas,","Formal: Sehr geehrte Frau [Name],","du kommst, du hast, du kannst","Sie kommen, Sie haben, Sie können"]},
    {page:11,module:"Exam practice",heading:"Model exam 1 · Writing workspace",
     lead:"TEIL 1: FORMULAR ANSWERS",
     lines:["Vorname","Geburtsort (Land)","Straße / Hausnummer","E-Mail-Adresse","Kursdauer"]},
    {page:21,module:"Annotated model",heading:"Landlord inquiry · Sample answer",
     lead:"MODEL EXAM 4: ANNOTATED SOLUTION",
     lines:["Sehr geehrter Herr Schmidt,","Ich interessiere mich sehr für die Wohnung.","Wann kann ich die Wohnung besichtigen?","Mit freundlichen Grüßen"]},
  ],
  A2: [
    {page:5,module:"Lesen",heading:"Reading comprehension",lead:"MODULE 1: LESEN",lines:[
      "Teil 1: Websites, blogs, short articles","Teil 2: Information signs, store notices",
      "Teil 3: Emails, personal letters","Teil 4: Classified ads and requests"]},
    {page:21,module:"Hören transcript",heading:"Announcement at the station",lead:"HÖREN TEIL 2: TASK & SOLUTION",
     lines:["Achtung am Gleis 4!","Der Zug fährt heute von Gleis 7 ab.","Wie viel Verspätung hat der Zug?","15 Minuten."]},
    {page:31,module:"Schreiben",heading:"Cancelling a dinner",lead:"SCHREIBEN TEIL 1: MODEL TASK 2",
     lines:["Liebe Sarah, es tut mir sehr leid,","aber ich kann heute Abend nicht kommen,","weil ich Kopfschmerzen habe.","Sollen wir uns nächsten Dienstag treffen?"]},
  ],
  B1: [
    {page:5,module:"Lesen strategy",heading:"Reading: blog comprehension",lead:"MODULE 1: LESEN · TEIL 1",lines:[
      "Read the statements before the text.","Highlight keywords: dates, verbs, places.",
      "Watch for synonyms and negation.","nicht · kaum · nie"]},
    {page:21,module:"Hören transcript",heading:"Who suggested the idea?",lead:"HÖREN TEIL 3: SPEAKER ATTRIBUTION",
     lines:["Martin: Ich will lieber ausruhen.","Sarah: Lass uns wandern gehen!","Katrin: Wie wär’s mit dem Bus?","Tom: Gute Idee!"]},
    {page:31,module:"Schreiben practice",heading:"A letter about moving house",lead:"SCHREIBEN · AUFGABE 1",
     lines:["Sie sind vor Kurzem in eine neue Wohnung gezogen.","Beschreiben Sie Ihre neue Wohnung.","Begründen Sie, warum Sie umgezogen sind.","Laden Sie Jan zu einer Besichtigung ein."]},
  ],
});

export default function ExamGuidePreviews({level}) {
  const [current,setCurrent] = useState(0);
  const pages = PREVIEWS[level] || [];
  if (!pages.length) return null;
  const page=pages[current];
  return <section className="fb-guide-preview" id="fb-guide-preview" aria-label={level+" book preview"}>
    <div className="fb-guide-preview-head">
      <div><p className="fb-eyebrow">LOOK INSIDE BEFORE BUYING</p>
        <h2>Preview the {level} guide</h2>
        <p>Selected excerpts from the uploaded {level} PDF, reformatted for web. The printed pages may look different.</p>
      </div>
      <span>{current+1} / {pages.length} excerpts</span>
    </div>
    <div className="fb-guide-preview-layout">
      <div className="fb-guide-preview-pages" role="group" aria-label="Choose preview excerpt">
        {pages.map((item,index)=><button key={item.page} type="button"
            aria-pressed={index===current} className={index===current?"is-selected":""}
            onClick={()=>setCurrent(index)}>
            <strong>{item.module}</strong><span>Book page {item.page}</span>
          </button>)}
      </div>
      <article className="fb-guide-preview-paper"
        aria-label={"Reformatted excerpt from page "+page.page+": "+page.heading}>
        <div className="fb-guide-preview-paper-brand">LEARN LANGUAGE EDUCATION ACADEMY · FALOWEN</div>
        <span className="fb-guide-preview-paper-kicker">{page.lead}</span>
        <h3>{page.heading}</h3>
        <div className="fb-guide-preview-paper-lines">
          {page.lines.map((line,i)=><p key={i}>{line}</p>)}
        </div>
        <div className="fb-guide-preview-paper-footer">Preview only · Source page {page.page} of the {level} guide</div>
      </article>
    </div>
  </section>;
}
