import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };
const paragraph = { margin: 0, lineHeight: 1.75 };
const list = { margin: 0, paddingLeft: 22, display: "grid", gap: 10, lineHeight: 1.65 };
const english = { margin: 0, color: "#475569", lineHeight: 1.65, fontSize: "0.94em" };
const sample = { display: "grid", gap: 4, padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 10 };

function Example({ de, en }) {
  return (
    <div style={sample}>
      <strong lang="de">{de}</strong>
      <span lang="en" style={english}>{en}</span>
    </div>
  );
}

function Section({ title, en, children }) {
  return (
    <section style={card}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p lang="en" style={english}>{en}</p>
      {children}
    </section>
  );
}

export default function A2Day20TypischeReklamationssituationenHoeflicheBittenUndBegruendungenGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={card}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 Day 20 · Typische Reklamationssituationen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Grammatik: höflich reklamieren, eine Lösung erbitten und Gründe mit <strong>weil</strong> und <strong>denn</strong> nennen.
        </p>
        <p lang="en" style={english}>
          Grammar: making a polite complaint, requesting a solution and explaining reasons using “weil” and “denn”.
        </p>
        <p style={paragraph}>
          <strong>Lernziel:</strong> Du kannst ein Problem im Geschäft oder per E-Mail erklären, den Grund nennen und höflich um Hilfe bitten.
        </p>
        <p lang="en" style={english}>
          Learning goal: You can explain a problem in a shop or email, give a reason and politely ask for help.
        </p>
      </header>

      <Section title="1. Eine Reklamation in vier Schritten" en="A useful complaint has four parts: say what you bought, explain the problem, give a reason or detail, then request a solution.">
        <ol style={list}>
          <li><strong>Produkt und Kauf:</strong> Was hast du gekauft? Wann und wo? <span lang="en" style={english}>(Product and purchase: what, when and where?)</span></li>
          <li><strong>Problem:</strong> Was funktioniert nicht? <span lang="en" style={english}>(What is wrong or not working?)</span></li>
          <li><strong>Grund oder Detail:</strong> Warum möchtest du reklamieren? <span lang="en" style={english}>(Why are you complaining?)</span></li>
          <li><strong>Höfliche Bitte:</strong> Welche Lösung möchtest du? <span lang="en" style={english}>(What solution would you like?)</span></li>
        </ol>
        <Example de="Ich habe diese Jacke gestern gekauft." en="I bought this jacket yesterday." />
        <Example de="Leider ist der Reißverschluss kaputt." en="Unfortunately, the zip is broken." />
        <Example de="Ich möchte die Jacke umtauschen, weil der Reißverschluss kaputt ist." en="I would like to exchange the jacket because the zip is broken." />
        <Example de="Könnten Sie mir bitte eine andere Jacke geben?" en="Could you please give me another jacket?" />
      </Section>

      <Section title="2. weil oder denn? Die Wortstellung" en="Both mean “because”, but their grammar is different. The position of the conjugated verb is the key.">
        <p style={paragraph}><strong>weil</strong> beginnt einen <strong>Nebensatz</strong>. Das konjugierte Verb steht am <strong>Ende</strong> des weil-Satzes.</p>
        <p lang="en" style={english}>“weil” introduces a subordinate clause. Put the conjugated verb at the end of that clause.</p>
        <Example de="Ich reklamiere die Jacke, weil sie zu klein ist." en="I am complaining about the jacket because it is too small. (ist = at the end)" />
        <Example de="Ich brauche Hilfe, weil ich das Gerät nicht benutzen kann." en="I need help because I cannot use the device. (kann = at the end)" />
        <p style={paragraph}><strong>denn</strong> verbindet zwei <strong>Hauptsätze</strong>. Nach denn bleibt die normale Wortstellung: <strong>Subjekt + Verb</strong>.</p>
        <p lang="en" style={english}>“denn” joins two main clauses. After “denn”, keep normal statement order: subject + conjugated verb.</p>
        <Example de="Ich reklamiere die Jacke, denn sie ist zu klein." en="I am complaining about the jacket because it is too small. (sie ist = normal order)" />
        <Example de="Ich brauche Hilfe, denn ich kann das Gerät nicht benutzen." en="I need help because I cannot use the device. (ich kann = normal order)" />
        <p style={paragraph}><strong>Merke:</strong> Vor weil und denn steht hier ein Komma. <strong>weil + ... + Verb</strong>, aber <strong>denn + Subjekt + Verb</strong>.</p>
        <p lang="en" style={english}>Remember the comma before both conjunctions in these examples. With “weil”, the verb goes to the end; with “denn”, normal main-clause order stays.</p>
      </Section>

      <Section title="3. Höfliche Bitten: könnten, hätte gern und wäre" en="For a formal complaint, use “Sie” and polite forms instead of demands. “Könnten”, “hätte” and “wäre” make a request sound softer.">
        <Example de="Könnten Sie die Jacke bitte umtauschen?" en="Could you please exchange the jacket?" />
        <Example de="Ich hätte gern mein Geld zurück." en="I would like my money back." />
        <Example de="Wäre eine Reparatur möglich?" en="Would a repair be possible?" />
        <Example de="Könnten Sie mir bitte helfen?" en="Could you please help me?" />
        <p style={paragraph}>
          <strong>Satzbau:</strong> Könnten + Sie + ... + <strong>Infinitiv</strong> am Ende?
        </p>
        <p lang="en" style={english}>
          Sentence pattern: “Könnten Sie ...?” + the main verb in its infinitive form at the end. “Könnten Sie das bitte reparieren?” = “Could you please repair that?”
        </p>
        <p style={paragraph}><strong>Formell:</strong> Verwende <strong>Sie, Ihnen, Ihre</strong> und <strong>bitte</strong>. Vermeide Befehle wie „Geben Sie mir sofort mein Geld!“</p>
        <p lang="en" style={english}>In a formal setting, use the polite “Sie” forms and “bitte” (please), not commands.</p>
      </Section>

      <Section title="4. Wichtige Wörter und Lösungen" en="These are the most useful words for a shop complaint. Exchanging, returning, repairing and getting a refund are different requests.">
        <div style={{ display: "grid", gap: 8 }}>
          <Example de="die Reklamation · etwas reklamieren" en="complaint about a purchased item · to make a complaint" />
          <Example de="defekt / kaputt / beschädigt" en="faulty / broken / damaged" />
          <Example de="die falsche Größe / die falsche Farbe" en="the wrong size / the wrong colour" />
          <Example de="der Kassenbon / die Rechnung" en="receipt / invoice" />
          <Example de="etwas umtauschen" en="to exchange an item for another one" />
          <Example de="etwas zurückgeben" en="to return an item" />
          <Example de="etwas reparieren" en="to repair something" />
          <Example de="das Geld erstatten / die Rückerstattung" en="to refund the money / the refund" />
        </div>
        <p style={paragraph}><strong>Tipp:</strong> Sage genau, was du möchtest: „Ich möchte die Jacke umtauschen.“ oder „Ich bitte um eine Rückerstattung.“</p>
        <p lang="en" style={english}>Tip: be specific about the solution. “I would like to exchange the jacket” or “I am requesting a refund.” A request does not automatically mean the shop must approve it.</p>
      </Section>

      <Section title="5. Beispieldialog: im Geschäft" en="Read the German dialogue first, then check the English meaning line by line. Notice the polite request and the reason using “weil”.">
        <Example de="Kundin: Guten Tag. Ich habe diese Kaffeemaschine gestern gekauft." en="Customer: Hello. I bought this coffee machine yesterday." />
        <Example de="Verkäufer: Guten Tag. Was ist das Problem?" en="Shop assistant: Hello. What is the problem?" />
        <Example de="Kundin: Leider funktioniert sie nicht. Ich möchte sie reklamieren, weil sie sich nicht einschalten lässt." en="Customer: Unfortunately, it doesn't work. I'd like to make a complaint because it won't switch on." />
        <Example de="Verkäufer: Haben Sie den Kassenbon dabei?" en="Shop assistant: Do you have the receipt with you?" />
        <Example de="Kundin: Ja, hier ist er. Könnten Sie das Gerät bitte umtauschen?" en="Customer: Yes, here it is. Could you please exchange the machine?" />
        <Example de="Verkäufer: Wir prüfen das Gerät zuerst. Einen Moment, bitte." en="Shop assistant: We will check the machine first. One moment, please." />
        <p style={paragraph}><strong>Beobachte:</strong> „sie“ ersetzt „die Kaffeemaschine“, und „er“ ersetzt „der Kassenbon“.</p>
        <p lang="en" style={english}>Notice the pronouns: “sie” refers back to the feminine noun “die Kaffeemaschine”; “er” refers to the masculine noun “der Kassenbon”.</p>
      </Section>

      <Section title="6. Kurze formelle Reklamation schreiben" en="For an email, include a greeting, what you purchased, the problem, a polite solution request and a closing. This model can also support the Schreiben task.">
        <div style={{ ...sample, whiteSpace: "pre-line" }}>
          <strong lang="de">{`Betreff: Reklamation meiner Jacke

Sehr geehrte Damen und Herren,

ich habe am Montag eine Jacke in Ihrem Geschäft gekauft. Leider ist der Reißverschluss kaputt. Ich möchte die Jacke reklamieren, weil ich sie nicht richtig benutzen kann. Könnten Sie die Jacke bitte umtauschen?

Vielen Dank für Ihre Hilfe.

Mit freundlichen Grüßen
Sara Mensah`}</strong>
          <span lang="en" style={english}>{`Subject: Complaint about my jacket

Dear Sir or Madam,

I bought a jacket in your shop on Monday. Unfortunately, the zip is broken. I would like to make a complaint because I cannot use it properly. Could you please exchange the jacket?

Thank you for your help.

Kind regards,
Sara Mensah`}</span>
        </div>
        <p style={paragraph}><strong>Aufbau:</strong> Betreff → Anrede → Kauf → Problem/Grund → Bitte → Dank/Gruß.</p>
        <p lang="en" style={english}>Email structure: subject → greeting → purchase → problem/reason → request → thanks/closing. Keep the message factual and polite.</p>
      </Section>

      <Section title="7. Häufige Fehler korrigieren" en="Compare the common mistake with the correct German sentence and its English meaning.">
        <p style={paragraph}><strong>Falsch:</strong> „weil das Gerät ist kaputt“</p>
        <Example de="Richtig: Das Gerät funktioniert nicht, weil es kaputt ist." en="Correct: The device doesn't work because it is broken. After “weil”, “ist” goes to the end." />
        <p style={paragraph}><strong>Falsch:</strong> „denn die Jacke zu klein ist“</p>
        <Example de="Richtig: Ich möchte sie umtauschen, denn die Jacke ist zu klein." en="Correct: I would like to exchange it because the jacket is too small. After “denn”, use normal word order." />
        <p style={paragraph}><strong>Falsch:</strong> „Könnten Sie bitte die Jacke umtauschen mir?“</p>
        <Example de="Richtig: Könnten Sie mir bitte die Jacke umtauschen?" en="Correct: Could you please exchange the jacket for me? Keep the infinitive “umtauschen” at the end." />
        <p style={paragraph}><strong>Zu direkt:</strong> „Geben Sie mir sofort mein Geld!“</p>
        <Example de="Höflicher: Ich hätte gern mein Geld zurück." en="More polite: I would like my money back." />
      </Section>

      <A2MiniLearningBlock title="Knowledge Test · Reklamieren" rule="weil = Verb am Ende; denn = normale Hauptsatzstellung. Formuliere die gewünschte Lösung höflich." examples={["Ich reklamiere die Jacke, weil sie beschädigt ist.","Ich komme zurück, denn die Kaffeemaschine funktioniert nicht.","Könnten Sie das bitte umtauschen?","Ich hätte gern mein Geld zurück."]} questions={[{stem:"Was passt? Ich reklamiere die Jacke, ___ sie beschädigt ist.",options:["weil","denn","oder"],answer:0,explanation:"Nach weil steht das Verb am Ende."},{stem:"Was passt? Ich komme zurück, ___ das Gerät ist kaputt.",options:["weil","denn","dass"],answer:1,explanation:"denn behält die normale Hauptsatzstellung."},{stem:"Welcher weil-Satz ist richtig?",options:["weil die Hose ist zu klein","weil die Hose zu klein ist","weil ist die Hose zu klein"],answer:1,explanation:"Im weil-Satz steht das Verb am Ende."},{stem:"Welcher denn-Satz ist richtig?",options:["denn das Gerät kaputt ist","denn ist das Gerät kaputt","denn das Gerät ist kaputt"],answer:2,explanation:"Nach denn bleibt Subjekt + Verb."},{stem:"Welche Forderung ist höflich?",options:["Geld zurück!","Könnten Sie mir bitte das Geld erstatten?","Du gibst Geld."],answer:1,explanation:"Könnten Sie bitte ...? ist eine höfliche Bitte."},{stem:"Was gehört zu einer guten Reklamation?",options:["Nur der Preis","Problem und gewünschte Lösung","Nur dein Name"],answer:1,explanation:"Problem plus Lösung macht die Reklamation klar."},{stem:"Was bedeutet umtauschen?",options:["Ein Produkt gegen ein anderes austauschen","Mehr kaufen","Den Laden schließen"],answer:0,explanation:"Beim Umtausch bekommst du ein anderes Produkt."},{stem:"Welche Reihenfolge ist sinnvoll?",options:["Lösung → nichts erklären","Produkt/Kauf → Problem → Grund → Lösung","Gruß → Ende"],answer:1,explanation:"Diese Struktur ist klar und praktisch."}]} outputPrompt="Reklamiere ein Produkt in 5–6 Sätzen. Nenne Kauf, Problem, einen Grund mit weil oder denn und eine höfliche Lösung." starters={["Ich habe ... gekauft.","Leider ...","Ich reklamiere das Produkt, weil ...","Das ist problematisch, denn ...","Könnten Sie bitte ...?"]}/>
    </div>
  );
}
