import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import A2MiniLearningBlock from "./A2MiniLearningBlock";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const tableWrap = { overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 12 };
const table = { width: "100%", borderCollapse: "collapse", minWidth: 520 };
const th = { textAlign: "left", padding: "10px 12px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb" };
const td = { padding: "10px 12px", borderBottom: "1px solid #e5e7eb", verticalAlign: "top" };
const note = { padding: 12, borderRadius: 12, background: "#eff6ff", border: "1px solid #bfdbfe", lineHeight: 1.7 };
const example = { padding: 12, borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", lineHeight: 1.7 };

export default function A2Day10PraeteritumGrammarPage() {
  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

      <header style={card}>
        <h1 style={{ ...styles.title, margin: 0 }}>A2 • 4.10 Tourismus und traditionelle Feste</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Grammar focus: Präteritum</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Das <strong>Präteritum</strong> ist eine Vergangenheitsform. Du benutzt nur <strong>eine konjugierte Verbform</strong>:
          <strong> ich war, ich hatte, ich ging, ich besuchte</strong>. Das ist der wichtigste Unterschied zum Perfekt.
        </p>
      </header>

      <section style={card}>
        <h2 style={{ margin: 0 }}>1) Präteritum und Perfekt: Was ist der Unterschied?</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Beide Formen können dieselbe vergangene Handlung beschreiben. Der Unterschied ist oft <strong>nicht die Bedeutung</strong>,
          sondern die Art, wie Deutsch normalerweise gesprochen oder geschrieben wird.
        </p>
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Form</th>
                <th style={th}>Beispiel</th>
                <th style={th}>Typischer Gebrauch</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}><strong>Perfekt</strong></td>
                <td style={td}>Ich <strong>habe</strong> das Fest <strong>besucht</strong>.</td>
                <td style={td}>Sehr häufig beim Sprechen über vergangene Handlungen.</td>
              </tr>
              <tr>
                <td style={td}><strong>Präteritum</strong></td>
                <td style={td}>Ich <strong>besuchte</strong> das Fest.</td>
                <td style={td}>Häufig in Geschichten, Berichten und schriftlichen Texten.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={note}>
          <strong>Wichtig für A2:</strong> Beim Sprechen benutzt man für viele Handlungen oft das Perfekt. Aber
          <strong> sein</strong> und <strong>haben</strong> stehen auch im gesprochenen Deutsch sehr oft im Präteritum:
          <strong> Ich war müde. Wir hatten wenig Zeit.</strong>
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>2) Regelmäßige Verben: Stamm + -te</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Bei regelmäßigen Verben nimmst du den Verbstamm und fügst <strong>-te</strong> plus die passende Personenendung an.
        </p>
        <div style={example}>
          <strong>feiern → feierte</strong><br />
          Ich feierte gestern mit meiner Familie.<br />
          Wir feierten ein traditionelles Fest.
        </div>
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr><th style={th}>Person</th><th style={th}>feiern</th><th style={th}>besuchen</th></tr>
            </thead>
            <tbody>
              <tr><td style={td}>ich</td><td style={td}>feierte</td><td style={td}>besuchte</td></tr>
              <tr><td style={td}>du</td><td style={td}>feiertest</td><td style={td}>besuchtest</td></tr>
              <tr><td style={td}>er / sie / es</td><td style={td}>feierte</td><td style={td}>besuchte</td></tr>
              <tr><td style={td}>wir</td><td style={td}>feierten</td><td style={td}>besuchten</td></tr>
              <tr><td style={td}>ihr</td><td style={td}>feiertet</td><td style={td}>besuchtet</td></tr>
              <tr><td style={td}>sie / Sie</td><td style={td}>feierten</td><td style={td}>besuchten</td></tr>
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Bei Verben wie <strong>arbeiten</strong> brauchst du zur Aussprache ein zusätzliches <strong>e</strong>:
          <strong> arbeiten → arbeitete</strong>.
        </p>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>3) Unregelmäßige Verben: Stamm verändert sich</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Bei starken oder unregelmäßigen Verben gibt es keine einfache <strong>-te</strong>-Regel. Der Stamm verändert sich.
          Diese Formen lernst du am besten als Wortpaar.
        </p>
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr><th style={th}>Infinitiv</th><th style={th}>Präteritum</th><th style={th}>Beispiel</th></tr>
            </thead>
            <tbody>
              <tr><td style={td}>gehen</td><td style={td}><strong>ging</strong></td><td style={td}>Danach ging ich ins Restaurant.</td></tr>
              <tr><td style={td}>fahren</td><td style={td}><strong>fuhr</strong></td><td style={td}>Wir fuhren nach München.</td></tr>
              <tr><td style={td}>sehen</td><td style={td}><strong>sah</strong></td><td style={td}>Ich sah viele traditionelle Kleider.</td></tr>
              <tr><td style={td}>kommen</td><td style={td}><strong>kam</strong></td><td style={td}>Viele Touristen kamen am Samstag.</td></tr>
              <tr><td style={td}>finden</td><td style={td}><strong>fand</strong></td><td style={td}>Ich fand das Fest sehr interessant.</td></tr>
            </tbody>
          </table>
        </div>
        <div style={note}>
          <strong>Keine „ge-“ Form:</strong> <strong>gegangen</strong> und <strong>gefahren</strong> sind Partizip-II-Formen für das Perfekt.
          Im Präteritum heißt es <strong>ging</strong> und <strong>fuhr</strong>.
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>4) Die wichtigsten Formen: sein und haben</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Diese beiden Verben solltest du zuerst sicher beherrschen, weil sie im Alltag sehr häufig sind.
        </p>
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr><th style={th}>Person</th><th style={th}>sein</th><th style={th}>haben</th></tr>
            </thead>
            <tbody>
              <tr><td style={td}>ich</td><td style={td}>war</td><td style={td}>hatte</td></tr>
              <tr><td style={td}>du</td><td style={td}>warst</td><td style={td}>hattest</td></tr>
              <tr><td style={td}>er / sie / es</td><td style={td}>war</td><td style={td}>hatte</td></tr>
              <tr><td style={td}>wir</td><td style={td}>waren</td><td style={td}>hatten</td></tr>
              <tr><td style={td}>ihr</td><td style={td}>wart</td><td style={td}>hattet</td></tr>
              <tr><td style={td}>sie / Sie</td><td style={td}>waren</td><td style={td}>hatten</td></tr>
            </tbody>
          </table>
        </div>
        <div style={example}>
          Letztes Jahr <strong>war</strong> ich in München.<br />
          Das Wetter <strong>war</strong> schön.<br />
          Wir <strong>hatten</strong> viel Zeit.<br />
          Das Hotel <strong>hatte</strong> ein großes Restaurant.
        </div>
      </section>

      <section style={card}>
        <h2 style={{ margin: 0 }}>5) Satzbau: einfacher als im Perfekt</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Das Präteritum hat normalerweise nur <strong>eine Verbform</strong>. Im Hauptsatz steht das konjugierte Verb wie gewohnt auf Position 2.
        </p>
        <ul style={list}>
          <li><strong>Gestern besuchte</strong> ich den Weihnachtsmarkt.</li>
          <li><strong>Am Abend ging</strong> ich mit Freunden essen.</li>
          <li><strong>Das Fest war</strong> sehr voll.</li>
          <li><strong>Wir hatten</strong> trotzdem viel Spaß.</li>
        </ul>
        <div style={note}>
          Vergleiche: <strong>Ich habe den Markt besucht.</strong> → Perfekt: Hilfsverb + Partizip II.<br />
          <strong>Ich besuchte den Markt.</strong> → Präteritum: eine konjugierte Verbform.
        </div>
      </section>

      <A2MiniLearningBlock
        title="Präteritum sicher erkennen und benutzen"
        rule="Präteritum beschreibt Vergangenes mit einer konjugierten Verbform. Regelmäßige Verben bilden es meist mit -te; starke Verben haben eigene Formen. Für A2 sind besonders war und hatte wichtig."
        examples={[
          "Letztes Jahr war ich in München.",
          "Wir hatten viel Zeit für das Fest.",
          "Am Samstag besuchte ich einen Weihnachtsmarkt.",
          "Danach ging ich mit Freunden ins Restaurant."
        ]}
        questions={[
          { stem: "Was ist das Präteritum von sein? Ich ___ in Berlin.", options: ["bin", "war", "gewesen"], answer: 1, explanation: "sein → ich war. Gewesen ist das Partizip II." },
          { stem: "Was ist das Präteritum von haben? Wir ___ viel Zeit.", options: ["hatten", "haben", "gehabt"], answer: 0, explanation: "haben → wir hatten." },
          { stem: "Welcher Satz ist richtig?", options: ["Wir besuchten das Fest.", "Wir besuchteen das Fest."], answer: 0, explanation: "Regelmäßig: besuchen → besuchte; wir besuchten." },
          { stem: "Was ist das Präteritum von gehen?", options: ["ging", "gehte", "gegangen"], answer: 0, explanation: "gehen ist unregelmäßig: ging. Gegangen gehört zum Perfekt." },
          { stem: "Welcher Satz ist Präteritum?", options: ["Ich habe das Fest gesehen.", "Ich sah das Fest.", "Ich sehe das Fest."], answer: 1, explanation: "sah ist die Präteritumform von sehen." }
        ]}
        outputPrompt="Erzähle in 4–6 Sätzen von einem Fest oder einer Reise in der Vergangenheit. Benutze mindestens war oder hatte und eine weitere Präteritumform."
        starters={[
          "Letztes Jahr war ich ...",
          "Dort hatte ich ...",
          "Am ersten Tag besuchte ich ...",
          "Danach ging ich ...",
          "Zum Schluss fand ich ..."
        ]}
      />

      <section style={card}>
        <h2 style={{ margin: 0 }}>6) A2-Merksatz</h2>
        <div style={note}>
          <strong>Beim Sprechen:</strong> Für viele vergangene Handlungen ist das Perfekt sehr normal: „Ich habe das Fest besucht.“<br />
          <strong>Sehr häufig auch beim Sprechen:</strong> war, hatte und später auch Modalverben wie konnte, musste, wollte.<br />
          <strong>Beim Lesen und Schreiben:</strong> Erkenne zusätzlich häufige Formen wie ging, kam, fuhr, sah und fand.
        </div>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Du musst auf A2 nicht jedes starke Verb auswendig können. Wichtig ist, dass du die häufigsten Formen erkennst,
          <strong> war</strong> und <strong>hatte</strong> sicher benutzt und den Unterschied zum Perfekt verstehst.
        </p>
      </section>
    </div>
  );
}
