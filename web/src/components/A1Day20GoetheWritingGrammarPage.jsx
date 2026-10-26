import React from "react";
const card = { border:"1px solid #dbe3ef", borderRadius:16, padding:20, display:"grid", gap:12, background:"white", minWidth:0, lineHeight:1.75 };
const vocab = [
 ["Familienname / Name","Surname"], ["Vorname","First name"], ["Geburtsdatum / Geburtsort","Date / place of birth"], ["Staatsangehörigkeit / Nationalität","Nationality"], ["Wohnort / Ort","Town of residence"], ["Straße, Hausnummer","Street and house number"], ["PLZ (Postleitzahl)","Postal code"], ["Anreisetag / Abreisetag","Arrival / departure day"], ["Anzahl der Personen","Number of people"], ["Kursart / Kursdauer","Course type / duration"], ["Unterkunft / Zimmerart","Accommodation / room type"], ["Zahlungsweise / Bezahlung","Payment method"]
];
export default function A1Day20GoetheWritingGrammarPage() {
 return <div style={{display:"grid",gap:18}} data-a1-day20-goethe-writing-grammar="true">
  <section style={card}><h1>Goethe A1 Schreiben has two parts</h1><p>Complete a form and write a short message. The writing section lasts approximately <strong>20 minutes</strong>: Teil 1 has 5 raw points and Teil 2 has 10 raw points. The 15 raw points are converted to 25 points toward the 100-point exam total.</p><p>Suggested pacing: approximately 5 minutes for Teil 1 and 15 minutes for Teil 2. This split is study advice.</p></section>
  <section style={card}><h2>Teil 1 · Formular ausfüllen</h2><p>Read the text, identify the information requested and fill only the five numbered gaps. Teil 1 is a form, not a letter.</p><dl>{vocab.map(([de,en])=><div key={de}><dt><strong>{de}</strong></dt><dd style={{marginLeft:0}}>{en}</dd></div>)}</dl><ul><li>Write words or numbers, not full sentences.</li><li>Do not repeat fields already completed.</li><li>Check dates, numbers and arrival versus departure.</li><li>Do not infer a birthplace from a person's home city.</li><li>An arrival date is not automatically a course start date.</li></ul>
  <h3>Worked example: identify the requested detail</h3><p>Kojo Mensah wohnt in Accra. Er besucht ab September einen Abendkurs. Der Kurs dauert sechs Wochen. Er bezahlt per Überweisung.</p><p><strong>Wohnort:</strong> Accra · <strong>Kursbeginn (Monat):</strong> September · <strong>Kursdauer:</strong> sechs Wochen · <strong>Zahlungsweise:</strong> Überweisung.</p><p>The assignment uses a different person and five numbered fields. Find each answer in that task's text.</p></section>
  <section style={card}><h2>Teil 2 · Kurze Nachricht oder E-Mail</h2><p>Write approximately 30 words and cover the three points in the actual prompt. They can ask for an invitation, dates, explanations, requests or other everyday information. There is no fixed reason–question–confirmation formula.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,240px),1fr))",gap:16}}>
   <article><h3>Informal: friends and family</h3><p>Use du, dir, dich, dein/deine.</p><p>Lieber Michael, · Liebe Julia, · Hallo zusammen,</p><p>Useful openings: Vielen Dank für deine E-Mail. · Ich möchte dich einladen. · Ich schreibe dir, weil …</p><p>Close with Viele Grüße or Liebe Grüße, then your first name.</p></article>
   <article><h3>Formal: schools, hotels and offices</h3><p>Use Sie, Ihnen, Ihr/Ihre.</p><p>Sehr geehrte Damen und Herren, · Sehr geehrter Herr Weber, · Sehr geehrte Frau Müller,</p><p>Useful openings: Ich möchte einen Deutschkurs machen. · Ich habe eine Frage. · Können Sie mir bitte Informationen schicken?</p><p>Close with Mit freundlichen Grüßen, then your full name. Do not add a comma after the closing.</p></article></div>
   <p>After a greeting ending in a comma, continue with a lowercase word unless it requires a capital letter, such as a noun or formal Sie/Ihnen. Write clear, simple sentences. A weil clause is optional; its verb goes at the end.</p>
   <h3>Simple A1 sentence patterns</h3><ul><li>Statement: Subject + verb + rest. Ich feiere am Samstag.</li><li>Modal verb: Subject + modal verb + rest + infinitive. Ich möchte dich einladen.</li><li>Yes/no question: Verb + subject + rest? Kannst du Getränke mitbringen?</li><li>W-question: W-word + verb + subject/rest? Wann beginnt der Kurs?</li><li>Separable verb: Subject + verb + rest + prefix. Ich lade dich ein.</li></ul>
   <div data-a1-day20-letter-structure="true" style={{display:"grid",gap:16}}>
    <section style={{border:"1px solid #bfdbfe",borderRadius:14,padding:16,background:"#eff6ff",display:"grid",gap:10,minWidth:0}}>
     <h3>Informal Letter Structure</h3>
     <p><strong>When?</strong> Write informally to a friend or family member. Use <strong>du, dich, dir, dein/deine</strong>, not formal Sie. The same structure works for a short letter, email or message.</p>
     <ol>
      <li><strong>Greeting (Anrede):</strong> Liebe Sara, / Lieber Ben, / Hallo Tom,</li>
      <li><strong>Opening (Einleitung):</strong> Danke für deine Nachricht. / Wie geht es dir? / Ich schreibe dir, weil …</li>
      <li><strong>Body (Hauptteil):</strong> Answer every requested point with a short, clear sentence. Include the requested day, time, place, question or reason.</li>
      <li><strong>Closing sentence (Schlusssatz):</strong> Schreib mir bitte bald. / Ich freue mich auf deine Antwort.</li>
      <li><strong>Sign-off (Gruß) and name:</strong> Liebe Grüße / Viele Grüße, followed by your first name. Do not add a comma after the sign-off.</li>
     </ol>
     <h4>Complete informal email example (different from your assignment)</h4>
     <div style={{border:"1px solid #93c5fd",borderRadius:12,padding:14,background:"#ffffff",lineHeight:1.8,overflowWrap:"anywhere"}}>
      <p><strong>Liebe Sara,</strong></p>
      <p>danke für deine Nachricht. Ich kann am Freitag nicht kommen, weil ich arbeiten muss. Hast du am Samstag Zeit? Wir können uns im Park treffen.</p>
      <p><strong>Liebe Grüße</strong></p>
      <p><strong>Kojo</strong></p>
     </div>
     <p><strong>Why it works:</strong> Sara is a friend, so the writer uses <em>deine/du</em> forms. The message explains the reason, suggests another day, asks a question and closes appropriately. It is a study example, not a model answer to the Julia assignment.</p>
    </section>
    <section style={{border:"1px solid #e2e8f0",borderRadius:14,padding:16,background:"#f8fafc",display:"grid",gap:10,minWidth:0}}>
     <h3>How to use weil (because)</h3>
     <p><strong>Weil</strong> introduces the reason for something. Put a comma before the <em>weil</em> clause and move its conjugated verb to the <strong>end</strong> of that clause.</p>
     <p><strong>Pattern:</strong> Main clause + , weil + subject + other words + conjugated verb.</p>
     <ul>
      <li><strong>Ich bleibe zu Hause, weil ich krank bin.</strong> — I stay at home because I am ill. The verb <em>bin</em> is last.</li>
      <li><strong>Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.</strong> — I am learning German because I want to work in Germany. The conjugated modal <em>möchte</em> is last.</li>
      <li><strong>Ich kann nicht kommen, weil ich arbeiten muss.</strong> — I cannot come because I have to work. The conjugated modal <em>muss</em> is last.</li>
     </ul>
     <p><strong>Common mistake:</strong> ✗ Ich komme nicht, weil ich bin krank. <strong>Correct:</strong> ✓ Ich komme nicht, weil ich krank bin.</p>
     <p><strong>Remember:</strong> You do not need <em>weil</em> in every A1 email. A correct short sentence can be better than an incorrect long one.</p>
     <h4>Other useful connecting words</h4>
     <ul>
      <li><strong>und (and):</strong> Ich habe Zeit und ich komme gern. — joins ideas; normal statement word order.</li>
      <li><strong>aber (but):</strong> Ich möchte kommen, aber ich habe keine Zeit. — contrasts ideas; normal statement word order.</li>
      <li><strong>oder (or):</strong> Wir treffen uns am Freitag oder wir telefonieren am Samstag. — gives alternatives.</li>
      <li><strong>denn (because):</strong> Ich bleibe zu Hause, denn ich bin krank. — gives a reason, but unlike <em>weil</em>, the verb stays in its normal position.</li>
      <li><strong>deshalb (therefore):</strong> Ich bin krank. Deshalb bleibe ich zu Hause. — <em>bleibe</em> comes directly after <em>deshalb</em> in the second sentence (optional extra pattern).</li>
     </ul>
     <details>
      <summary><strong>Try it yourself — then reveal the answers</strong></summary>
      <p>Join the sentences with <em>weil</em>: (1) Ich bin müde. Ich gehe nach Hause. (2) Ich lerne Deutsch. Ich möchte in Berlin arbeiten.</p>
      <p><strong>Possible answers:</strong> (1) Ich gehe nach Hause, weil ich müde bin. (2) Ich lerne Deutsch, weil ich in Berlin arbeiten möchte.</p>
     </details>
    </section>
    <section style={{border:"1px solid #e2e8f0",borderRadius:14,padding:16,background:"#ffffff",display:"grid",gap:10,minWidth:0}}>
     <h3>Formal Letter Structure</h3>
     <p>For a school, hotel or office, use <strong>Sie, Ihnen, Ihr/Ihre</strong>. The five steps stay the same, but greetings and requests are polite.</p>
     <ol>
      <li><strong>Greeting:</strong> Sehr geehrte Frau Keller, / Sehr geehrte Damen und Herren,</li>
      <li><strong>Opening:</strong> Ich habe eine Frage. / Ich schreibe Ihnen, weil …</li>
      <li><strong>Body:</strong> Cover every requested point using short formal sentences and polite questions: Können Sie mir bitte helfen?</li>
      <li><strong>Closing sentence:</strong> Vielen Dank für Ihre Hilfe. / Ich freue mich auf Ihre Antwort.</li>
      <li><strong>Sign-off and name:</strong> Mit freundlichen Grüßen, followed by your full name (no comma after the sign-off).</li>
     </ol>
     <h4>Complete formal email example</h4>
     <div style={{border:"1px solid #e2e8f0",borderRadius:12,padding:14,background:"#f8fafc",lineHeight:1.8,overflowWrap:"anywhere"}}>
      <p><strong>Sehr geehrte Frau Keller,</strong></p>
      <p>ich habe eine Frage zu meinem Hotelzimmer. Ich komme am Freitag. Kann ich schon um elf Uhr einchecken? Vielen Dank für Ihre Hilfe.</p>
      <p><strong>Mit freundlichen Grüßen</strong></p>
      <p><strong>Ama Mensah</strong></p>
     </div>
     <p><strong>Tip:</strong> After a greeting with a comma, start the next line with lowercase unless the first word is a noun or formal <em>Sie/Ihnen/Ihr</em>. Never mix <em>du</em> with <em>Sehr geehrte …</em>.</p>
    </section>
   </div>
   <h3>Three-point strategy</h3><ol><li>Identify the recipient and choose du or Sie.</li><li>Underline the three task points. Write one clear sentence for each; use another sentence if needed for all details.</li><li>Check the greeting, all requested details, closing and your name. Remove unnecessary introductory sentences.</li></ol>
   <h3>How Teil 2 is assessed</h3><p>Each of the three content points receives 0, 1.5 or 3 raw points according to understandable completion. Appropriate text format receives 0, 0.5 or 1 point. Mentioning all three points does not automatically earn full marks: the message must be understandable.</p>
  </section>
  <section style={card}><h2>Extra practice · Formal email to a language school</h2><p>This is optional practice, separate from the assessed form and email to Julia.</p><p>Sie möchten einen Deutschkurs besuchen. Schreiben Sie eine E-Mail an eine Sprachschule.</p><ul><li>Wann beginnt der nächste Kurs?</li><li>Wie viel kostet der Kurs?</li><li>Gibt es einen Abendkurs?</li></ul><p>Schreiben Sie circa 30 Wörter. Schreiben Sie eine passende Anrede und einen Gruß.</p><details><summary>Show a model after your own practice attempt</summary><p>Sehr geehrte Damen und Herren,</p><p>ich möchte einen Deutschkurs besuchen. Wann beginnt Ihr nächster Kurs? Wie viel kostet der Kurs? Gibt es auch einen Abendkurs? Bitte schicken Sie mir Informationen. Vielen Dank für Ihre Hilfe.</p><p>Mit freundlichen Grüßen<br/>Alex Mensah</p></details></section>
  <section style={card}><h2>Ready for the assignment?</h2><p>Teil 1: complete Maria's five form fields. Teil 2: invite Julia, give the day, time and address, and ask her to bring food or drinks. Submit both parts together. Review feedback after submission.</p><p>Reference: <a href="https://www.goethe.de/pro/relaunch/prf/materialien/A1_sd1/sd_1_modellsatz.pdf" target="_blank" rel="noreferrer">Goethe-Institut A1 Start Deutsch 1 model test and writing criteria</a>. Falowen tasks are original practice material.</p></section>
 </div>;
}
