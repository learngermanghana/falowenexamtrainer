import React, { useMemo, useState } from "react";
import { styles } from "../styles";

const LESSONS = {
  1: { topic: "Traumwelt", items: [["träumen von + Dat", "to dream of", "Viele Menschen träumen von einem ruhigeren Leben."], ["sich interessieren für + Akk", "to be interested in", "Ich interessiere mich für andere Lebensformen."], ["denken an + Akk", "to think of", "Bei meiner Zukunft denke ich oft an ein Leben im Ausland."], ["sprechen über + Akk", "to talk about", "Wir sprechen über unsere Wünsche für die Zukunft."]] },
  2: { topic: "Freunde fürs Leben", items: [["sich verlassen auf + Akk", "to rely on", "Auf gute Freunde kann man sich verlassen."], ["sich kümmern um + Akk", "to take care of", "Freunde kümmern sich umeinander."], ["sprechen mit + Dat über + Akk", "to talk with someone about", "Ich spreche mit meiner Freundin über meine Probleme."], ["sich freuen über + Akk", "to be happy about", "Ich freue mich über ihre Unterstützung."]] },
  3: { topic: "Erfolgsgeschichten", items: [["arbeiten an + Dat", "to work on", "Sie arbeitet an ihrer beruflichen Entwicklung."], ["sich vorbereiten auf + Akk", "to prepare for", "Er bereitet sich auf eine wichtige Prüfung vor."], ["profitieren von + Dat", "to benefit from", "Viele Menschen profitieren von guten Kontakten."], ["glauben an + Akk", "to believe in", "Man muss an die eigenen Fähigkeiten glauben."]] },
  4: { topic: "Wohnung suchen", items: [["suchen nach + Dat", "to search for", "Wir suchen nach einer bezahlbaren Wohnung."], ["sich entscheiden für + Akk", "to decide on", "Sie entscheidet sich für eine Wohnung im Zentrum."], ["achten auf + Akk", "to pay attention to", "Bei der Wohnungssuche achte ich auf die Lage."], ["sich erkundigen nach + Dat", "to ask about", "Ich erkundige mich nach den Nebenkosten."]] },
  5: { topic: "Besichtigungstermin", items: [["bitten um + Akk", "to ask for", "Ich möchte um einen Besichtigungstermin bitten."], ["sich bedanken für + Akk", "to thank for", "Ich bedanke mich für Ihre Rückmeldung."], ["fragen nach + Dat", "to ask about", "Ich frage nach einem möglichen Termin."], ["sich interessieren für + Akk", "to be interested in", "Ich interessiere mich für die Wohnung."]] },
  6: { topic: "Stadt oder Land", items: [["abhängen von + Dat", "to depend on", "Die Lebensqualität hängt von den eigenen Bedürfnissen ab."], ["sich entscheiden für + Akk", "to choose", "Viele Familien entscheiden sich für das Leben auf dem Land."], ["leiden unter + Dat", "to suffer from", "Großstädte leiden oft unter starkem Verkehr."], ["profitieren von + Dat", "to benefit from", "Bewohner profitieren von einer guten Infrastruktur."]] },
  7: { topic: "Fast Food oder Hausmannskost", items: [["verzichten auf + Akk", "to give up / avoid", "Viele Menschen möchten auf Fast Food verzichten."], ["achten auf + Akk", "to pay attention to", "Ich achte auf eine ausgewogene Ernährung."], ["sich ernähren von + Dat", "to live on / eat", "Man sollte sich nicht nur von Fertiggerichten ernähren."], ["sich entscheiden für + Akk", "to choose", "Ich entscheide mich meistens für frische Lebensmittel."]] },
  8: { topic: "Alles für die Gesundheit", items: [["leiden an + Dat", "to suffer from an illness", "Viele Menschen leiden an Rückenschmerzen."], ["leiden unter + Dat", "to suffer from a condition", "Viele Beschäftigte leiden unter Stress."], ["sich erholen von + Dat", "to recover from", "Nach einer Krankheit muss man sich gut erholen."], ["schützen vor + Dat", "to protect from", "Bewegung kann vor manchen Krankheiten schützen."]] },
  9: { topic: "Work-Life-Balance", items: [["sich erholen von + Dat", "to recover from", "Am Wochenende erhole ich mich von der Arbeit."], ["achten auf + Akk", "to pay attention to", "Beschäftigte sollten auf genügend Pausen achten."], ["sich konzentrieren auf + Akk", "to focus on", "Während der Arbeit konzentriere ich mich auf eine Aufgabe."], ["leiden unter + Dat", "to suffer from", "Viele Menschen leiden unter einer hohen Arbeitsbelastung."]] },
  10: { topic: "Digitale Auszeit", items: [["verzichten auf + Akk", "to do without", "Am Abend verzichte ich auf soziale Medien."], ["sich konzentrieren auf + Akk", "to concentrate on", "Ohne Handy kann ich mich besser auf meine Arbeit konzentrieren."], ["abhängen von + Dat", "to depend on", "Unser Alltag hängt zunehmend von digitalen Geräten ab."], ["sich beschäftigen mit + Dat", "to occupy oneself with", "In der Freizeit beschäftige ich mich lieber mit Sport."]] },
  11: { topic: "Teamspiele", items: [["teilnehmen an + Dat", "to take part in", "Viele Jugendliche nehmen an Mannschaftssport teil."], ["sich verlassen auf + Akk", "to rely on", "Im Team muss man sich aufeinander verlassen können."], ["beitragen zu + Dat", "to contribute to", "Sport trägt zu einem besseren Gemeinschaftsgefühl bei."], ["umgehen mit + Dat", "to deal with", "Spieler müssen mit Niederlagen umgehen können."]] },
  12: { topic: "Abenteuer in der Natur", items: [["sich vorbereiten auf + Akk", "to prepare for", "Wir bereiten uns auf die Wanderung vor."], ["achten auf + Akk", "to pay attention to", "In den Bergen muss man auf das Wetter achten."], ["sich schützen vor + Dat", "to protect oneself from", "Man sollte sich vor starker Sonne schützen."], ["teilnehmen an + Dat", "to take part in", "Wir nehmen an einer geführten Tour teil."]] },
  13: { topic: "Eigene Filmkritik", items: [["handeln von + Dat", "to be about", "Der Film handelt von einer ungewöhnlichen Freundschaft."], ["sich beziehen auf + Akk", "to refer to", "Meine Kritik bezieht sich auf die Handlung und die Schauspieler."], ["sich interessieren für + Akk", "to be interested in", "Ich interessiere mich besonders für historische Filme."], ["sprechen über + Akk", "to talk about", "Wir sprechen über die Botschaft des Films."]] },
  14: { topic: "Traditionelles und digitales Lernen", items: [["sich konzentrieren auf + Akk", "to focus on", "Beim Lernen konzentriere ich mich auf ein Thema."], ["profitieren von + Dat", "to benefit from", "Lernende profitieren von direktem Feedback."], ["sich gewöhnen an + Akk", "to get used to", "Viele Studierende gewöhnen sich an digitale Lernformen."], ["abhängen von + Dat", "to depend on", "Der Lernerfolg hängt von der Lernmethode ab."]] },
  15: { topic: "Medien und Homeoffice", items: [["arbeiten an + Dat", "to work on", "Im Homeoffice arbeite ich an verschiedenen Projekten."], ["kommunizieren mit + Dat über + Akk", "to communicate with about", "Ich kommuniziere mit meinem Team über digitale Plattformen."], ["abhängen von + Dat", "to depend on", "Erfolgreiches Homeoffice hängt von guter Organisation ab."], ["sich auswirken auf + Akk", "to affect", "Zu viel Bildschirmzeit wirkt sich auf die Gesundheit aus."]] },
  16: { topic: "Prüfungsangst und Stressbewältigung", items: [["Angst haben vor + Dat", "to be afraid of", "Viele Lernende haben Angst vor Prüfungen."], ["sich vorbereiten auf + Akk", "to prepare for", "Eine gute Vorbereitung auf die Prüfung reduziert Stress."], ["leiden unter + Dat", "to suffer from", "Manche Studierende leiden unter starkem Prüfungsstress."], ["umgehen mit + Dat", "to deal with", "Man kann lernen, besser mit Stress umzugehen."]] },
  17: { topic: "Wie lernt man am besten?", items: [["sich konzentrieren auf + Akk", "to focus on", "Konzentriere dich jeweils auf ein Lernziel."], ["sich beschäftigen mit + Dat", "to engage with", "Ich beschäftige mich täglich mit neuen Wörtern."], ["sich erinnern an + Akk", "to remember", "Durch Wiederholung erinnert man sich besser an neue Strukturen."], ["profitieren von + Dat", "to benefit from", "Viele Lernende profitieren von regelmäßigem Feedback."]] },
  18: { topic: "Wege zum Wunschberuf", items: [["sich bewerben um + Akk", "to apply for", "Sie bewirbt sich um eine Ausbildungsstelle."], ["sich informieren über + Akk", "to inform oneself about", "Ich informiere mich über verschiedene Berufe."], ["sich entscheiden für + Akk", "to choose", "Er entscheidet sich für eine technische Ausbildung."], ["sich vorbereiten auf + Akk", "to prepare for", "Sie bereitet sich auf den Berufseinstieg vor."]] },
  19: { topic: "Vorstellungsgespräch", items: [["sich bewerben bei + Dat um + Akk", "to apply to for", "Ich bewerbe mich bei einer Firma um eine Stelle."], ["sich vorbereiten auf + Akk", "to prepare for", "Ich bereite mich auf das Vorstellungsgespräch vor."], ["sprechen über + Akk", "to talk about", "Im Gespräch spreche ich über meine Erfahrungen."], ["verfügen über + Akk", "to have / possess", "Ich verfüge über gute Computerkenntnisse."]] },
  20: { topic: "Berufe kennenlernen", items: [["sich eignen für + Akk", "to be suitable for", "Der Beruf eignet sich für kommunikative Menschen."], ["verfügen über + Akk", "to possess", "Pflegekräfte müssen über soziale Kompetenzen verfügen."], ["arbeiten als + Nom", "to work as", "Sie arbeitet als Buchhalterin."], ["arbeiten bei + Dat", "to work at", "Er arbeitet bei einem internationalen Unternehmen."]] },
  21: { topic: "Lebensformen heute", items: [["zusammenleben mit + Dat", "to live together with", "Viele Menschen leben mit ihrem Partner zusammen."], ["sich entscheiden für + Akk", "to decide on", "Manche Paare entscheiden sich für eine Fernbeziehung."], ["abhängen von + Dat", "to depend on", "Die passende Lebensform hängt von den eigenen Wünschen ab."], ["sich gewöhnen an + Akk", "to get used to", "Man muss sich an neue Lebenssituationen gewöhnen."]] },
  22: { topic: "Was ist in einer Beziehung wichtig?", items: [["sich verlassen auf + Akk", "to rely on", "Partner sollten sich aufeinander verlassen können."], ["achten auf + Akk", "to pay attention to", "In einer Beziehung sollte man auf die Bedürfnisse des anderen achten."], ["sprechen mit + Dat über + Akk", "to talk with about", "Paare sollten offen über Probleme sprechen."], ["sich einigen auf + Akk", "to agree on", "Wir einigen uns auf eine gemeinsame Lösung."]] },
  23: { topic: "Erstes Date", items: [["sich treffen mit + Dat", "to meet with", "Ich treffe mich mit ihm in einem Café."], ["sich freuen auf + Akk", "to look forward to", "Ich freue mich auf unser Treffen."], ["sprechen über + Akk", "to talk about", "Beim ersten Date sprechen wir über unsere Interessen."], ["sich interessieren für + Akk", "to be interested in", "Sie interessiert sich für Reisen und Musik."]] },
  24: { topic: "Konsum und Nachhaltigkeit", items: [["achten auf + Akk", "to pay attention to", "Beim Einkaufen achte ich auf nachhaltige Produkte."], ["verzichten auf + Akk", "to do without", "Wir versuchen, auf unnötige Verpackungen zu verzichten."], ["beitragen zu + Dat", "to contribute to", "Bewusster Konsum trägt zum Umweltschutz bei."], ["sich entscheiden für + Akk", "to choose", "Viele Verbraucher entscheiden sich für regionale Produkte."]] },
  25: { topic: "Online-Shopping: Rechte und Risiken", items: [["sich beschweren über + Akk", "to complain about", "Ich beschwere mich über die beschädigte Ware."], ["bitten um + Akk", "to ask for", "Der Kunde bittet um eine Rückerstattung."], ["warnen vor + Dat", "to warn against", "Verbraucherschützer warnen vor unseriösen Shops."], ["achten auf + Akk", "to pay attention to", "Beim Online-Kauf sollte man auf sichere Zahlungsmethoden achten."]] },
  26: { topic: "Reiseprobleme und Lösungen", items: [["sich beschweren über + Akk", "to complain about", "Wir beschweren uns über die lange Verspätung."], ["bitten um + Akk", "to ask for", "Die Reisenden bitten um eine Ersatzverbindung."], ["warten auf + Akk", "to wait for", "Wir warten seit einer Stunde auf den Zug."], ["sich kümmern um + Akk", "to take care of", "Die Fluggesellschaft kümmert sich um die Unterkunft."]] },
  27: { topic: "Umweltfreundlich im Alltag", items: [["verzichten auf + Akk", "to avoid", "Ich verzichte möglichst oft auf Plastiktüten."], ["achten auf + Akk", "to pay attention to", "Wir achten auf einen niedrigen Energieverbrauch."], ["beitragen zu + Dat", "to contribute to", "Kleine Veränderungen tragen zum Klimaschutz bei."], ["sich entscheiden für + Akk", "to choose", "Viele Menschen entscheiden sich für öffentliche Verkehrsmittel."]] },
  28: { topic: "B1 Review und Transfer", items: [["sich erinnern an + Akk", "to remember", "Ich erinnere mich an die wichtigsten Strukturen."], ["sich vorbereiten auf + Akk", "to prepare for", "Ich bereite mich auf die Abschlussprüfung vor."], ["sich konzentrieren auf + Akk", "to focus on", "Beim Wiederholen konzentriere ich mich auf meine Schwächen."], ["profitieren von + Dat", "to benefit from", "Beim Lernen profitiere ich von regelmäßigem Feedback."]] },
};

const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #bfdbfe", borderRadius: 18, background: "linear-gradient(180deg,#fff,#f8fafc)" };

export const getB1CollocationLesson = (day) => LESSONS[Number(day)] || null;

export default function B1TopicCollocationPractice({ day }) {
  const lesson = useMemo(() => getB1CollocationLesson(day), [day]);
  const [answers, setAnswers] = useState({});
  if (!lesson) return null;
  const questions = lesson.items.slice(0, 3).map(([structure, meaning], index) => ({
    q: index === 0 ? `Welche Präposition gehört zu „${structure.split(" + ")[0]}“?` : `Welche Kombination passt zu „${meaning}“?`,
    answer: structure,
    options: [structure, lesson.items[(index + 1) % lesson.items.length][0], lesson.items[(index + 2) % lesson.items.length][0]],
  }));
  const correct = questions.filter((item, index) => answers[index] === item.answer).length;

  return <section style={card} aria-label={`B1 Day ${day} collocations`}>
    <div>
      <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e3a8a" }}>Wortschatz + Grammatik</span>
      <h2 style={{ marginBottom: 4 }}>Verben mit Präpositionen · {lesson.topic}</h2>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>Lerne die Verbindung als eine Einheit: <strong>Verb + Präposition + Kasus</strong>. So musst du beim Sprechen nicht jedes Mal raten.</p>
    </div>

    <div style={{ display: "grid", gap: 10 }}>
      {lesson.items.map(([structure, meaning, example]) => <div key={structure} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "grid", gap: 5, background: "#fff" }}>
        <strong>{structure}</strong>
        <span style={{ color: "#64748b" }}>{meaning}</span>
        <span style={{ lineHeight: 1.6 }}>{example}</span>
      </div>)}
    </div>

    <div style={{ display: "grid", gap: 12 }}>
      <h3 style={{ margin: 0 }}>Kurz prüfen</h3>
      {questions.map((item, index) => <div key={item.q} style={{ display: "grid", gap: 7 }}>
        <strong>{index + 1}. {item.q}</strong>
        {item.options.map((option) => { const selected = answers[index] === option; const right = option === item.answer; return <button key={option} type="button" onClick={() => setAnswers((old) => ({ ...old, [index]: option }))} style={{ ...styles.secondaryButton, textAlign: "left", background: selected ? (right ? "#f0fdf4" : "#fef2f2") : undefined }}>{option}</button>; })}
        {answers[index] ? <span style={{ fontWeight: 700, color: answers[index] === item.answer ? "#166534" : "#991b1b" }}>{answers[index] === item.answer ? "Richtig." : `Noch nicht. Richtige Verbindung: ${item.answer}`}</span> : null}
      </div>)}
      <strong>{correct}/{questions.length} richtig</strong>
    </div>

    <div style={{ border: "1px solid #fde68a", borderRadius: 14, padding: 12, background: "#fffbeb", lineHeight: 1.65 }}>
      <strong>Jetzt selbst bilden:</strong> Schreibe oder sage zwei Sätze zum heutigen Thema. Verwende dabei zwei verschiedene Verben mit Präpositionen aus der Liste.
    </div>
  </section>;
}
