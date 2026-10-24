import React from "react";
import { styles } from "../styles";

const B1_TOPIC_INTROS = Object.freeze({
  1: {
    title: "Traumwelt und Zukunftsträume",
    intro: "Bei diesem Thema sprichst du über Wünsche, Ziele und Vorstellungen für die Zukunft. Ein Traum kann ein Beruf, eine Reise, ein Haus oder ein persönliches Ziel sein. Wichtig ist, nicht nur den Traum zu nennen, sondern auch zu erklären, warum er dir wichtig ist.",
    example: "Du möchtest später selbstständig arbeiten, weil du eigene Ideen umsetzen und unabhängiger entscheiden möchtest.",
    question: "Welcher Traum ist dir besonders wichtig, und was müsstest du dafür tun?",
  },
  2: {
    title: "Freunde fürs Leben",
    intro: "Freundschaft bedeutet mehr als nur gemeinsam Zeit zu verbringen. Vertrauen, Ehrlichkeit, Unterstützung und gemeinsame Erfahrungen spielen oft eine wichtige Rolle. Freundschaften können in der Schule, bei der Arbeit, in der Freizeit oder heute auch online entstehen.",
    example: "Eine gute Freundin hört dir zu und unterstützt dich auch dann, wenn du ein Problem hast.",
    question: "Welche Eigenschaft ist für eine gute Freundschaft am wichtigsten?",
  },
  3: {
    title: "Erfolgsgeschichten",
    intro: "Erfolg kann beruflich oder persönlich sein. Für manche Menschen bedeutet Erfolg ein guter Beruf, für andere ein abgeschlossenes Studium, eine neue Sprache oder ein schwieriges Ziel, das sie erreicht haben. Erfolg entsteht oft nicht sofort, sondern nach Herausforderungen und Rückschlägen.",
    example: "Ein Student fällt zuerst durch eine Prüfung, lernt anders und besteht sie beim zweiten Versuch.",
    question: "Was bedeutet Erfolg für dich persönlich?",
  },
  4: {
    title: "Wohnung suchen",
    intro: "Bei der Wohnungssuche müssen mehrere Kriterien zusammenpassen: Preis, Lage, Größe, Verkehrsanbindung und Zustand der Wohnung. Oft findet man nicht alles gleichzeitig und muss entscheiden, welche Punkte besonders wichtig sind.",
    example: "Eine Wohnung ist günstig und groß, liegt aber weit vom Arbeitsplatz entfernt.",
    question: "Welche zwei Kriterien wären für dich bei einer Wohnung am wichtigsten?",
  },
  5: {
    title: "Besichtigungstermin",
    intro: "Bei einer Wohnungsbesichtigung schaut man sich die Wohnung genau an und stellt wichtige Fragen. Dazu gehören Miete, Nebenkosten, Zustand, Lärm, Vertrag und Einzugstermin. Höfliche und klare Fragen helfen, später Probleme zu vermeiden.",
    example: "Du bemerkst ein feuchtes Fenster und fragst den Vermieter höflich, ob es dort schon einmal Schimmel gab.",
    question: "Welche Frage würdest du bei einer Besichtigung auf jeden Fall stellen?",
  },
  6: {
    title: "Stadt oder Land",
    intro: "Das Leben in der Stadt und auf dem Land ist unterschiedlich organisiert. In der Stadt sind Arbeit, Geschäfte und Verkehrsmittel oft näher. Auf dem Land gibt es häufig mehr Ruhe und Natur, dafür können Wege länger sein.",
    example: "Eine Person arbeitet in der Stadt, möchte aber wegen der Ruhe lieber auf dem Land wohnen und täglich pendeln.",
    question: "Was ist dir wichtiger: kurze Wege oder mehr Ruhe?",
  },
  7: {
    title: "Fast Food oder Hausmannskost",
    intro: "Fast Food ist schnell verfügbar und praktisch. Hausmannskost wird häufiger selbst zubereitet und man kann Zutaten besser auswählen. Beim Vergleich spielen Zeit, Preis, Geschmack und Gesundheit eine Rolle.",
    example: "Nach der Arbeit kauft jemand einen Burger, obwohl er zu Hause gesünder kochen könnte, weil wenig Zeit bleibt.",
    question: "Wann ist schnelles Essen praktisch, und wann würdest du lieber selbst kochen?",
  },
  8: {
    title: "Alles für die Gesundheit",
    intro: "Gesundheit betrifft nicht nur Krankheiten. Ernährung, Bewegung, Schlaf, mentale Gesundheit und Vorsorge gehören ebenfalls dazu. Viele kleine Gewohnheiten können langfristig einen großen Einfluss auf das Wohlbefinden haben.",
    example: "Eine Person beginnt regelmäßig spazieren zu gehen, früher zu schlafen und mehr Wasser zu trinken.",
    question: "Welche Gewohnheit hat deiner Meinung nach den größten Einfluss auf die Gesundheit?",
  },
  9: {
    title: "Work-Life-Balance",
    intro: "Work-Life-Balance bedeutet, Arbeit und Privatleben so zu organisieren, dass genug Zeit für Erholung, Familie und persönliche Interessen bleibt. Problematisch wird es, wenn Überstunden oder ständige Erreichbarkeit die Freizeit dauerhaft beeinflussen.",
    example: "Ein Mitarbeiter beantwortet nach Feierabend keine beruflichen Nachrichten mehr, damit er sich besser erholen kann.",
    question: "Wo sollte deiner Meinung nach die Grenze zwischen Arbeit und Freizeit liegen?",
  },
  10: {
    title: "Digitale Auszeit",
    intro: "Eine digitale Auszeit ist eine bewusste Pause von Smartphone, sozialen Medien oder anderen Bildschirmen. Das bedeutet nicht, Technik komplett abzulehnen. Ziel ist, Bildschirmzeit bewusster zu steuern und mehr Raum für Schlaf, Bewegung oder direkte Kontakte zu schaffen.",
    example: "Jeden Abend bleibt das Handy für eine Stunde ausgeschaltet, bevor man schlafen geht.",
    question: "In welcher Situation wäre eine digitale Auszeit für dich besonders sinnvoll?",
  },
  11: {
    title: "Teamspiele und Zusammenarbeit",
    intro: "Bei Teamspielen und Gruppenaufgaben arbeiten mehrere Personen an einem gemeinsamen Ziel. Gute Zusammenarbeit braucht Kommunikation, klare Aufgaben, Vertrauen und die Bereitschaft, Konflikte gemeinsam zu lösen.",
    example: "In einem Schulprojekt übernimmt jede Person eine andere Aufgabe, aber alle müssen Informationen miteinander teilen.",
    question: "Was ist wichtiger für ein gutes Team: klare Aufgaben oder gute Kommunikation?",
  },
  12: {
    title: "Abenteuer in der Natur",
    intro: "Ein Abenteuer in der Natur kann Wandern, Camping oder eine andere Aktivität draußen sein. Neben schönen Erlebnissen gehören Vorbereitung, Wetter, Orientierung und Sicherheit dazu. Unerwartete Probleme können schnell entstehen.",
    example: "Beim Wandern beginnt es stark zu regnen und die Gruppe muss entscheiden, ob sie weitergeht oder umkehrt.",
    question: "Was sollte man vor einem Ausflug in die Natur unbedingt vorbereiten?",
  },
  13: {
    title: "Eigene Filmkritik",
    intro: "Eine Filmkritik ist mehr als eine Zusammenfassung der Handlung. Du beschreibst kurz, worum es geht, und bewertest zum Beispiel Schauspiel, Atmosphäre, Musik, Regie oder Spannung. Am Ende begründest du deine Empfehlung.",
    example: "Der Film ist spannend und gut gespielt, aber einige Szenen sind zu lang.",
    question: "Was ist für deine Bewertung eines Films am wichtigsten?",
  },
  14: {
    title: "Traditionelles und digitales Lernen",
    intro: "Traditionelles Lernen findet meistens im Klassenzimmer mit direktem Kontakt statt. Digitales Lernen nutzt Online-Kurse, Videos oder interaktive Übungen und kann zeitlich flexibler sein. Beide Lernformen können je nach Person und Situation unterschiedlich gut funktionieren.",
    example: "Eine Studentin arbeitet tagsüber und lernt am Abend mit einem Online-Kurs Deutsch.",
    question: "Was ist für gutes Lernen wichtiger: Flexibilität oder persönlicher Kontakt?",
  },
  15: {
    title: "Medien und Arbeiten im Homeoffice",
    intro: "Homeoffice bedeutet, ganz oder teilweise von zu Hause aus zu arbeiten. Dafür werden oft E-Mail, Videokonferenzen und digitale Programme verwendet. Gleichzeitig braucht man klare Regeln für Arbeitszeit, Datenschutz und die Grenze zwischen Arbeit und Freizeit.",
    example: "Eine Mitarbeiterin arbeitet drei Tage zu Hause und zwei Tage im Büro.",
    question: "Welche Regel braucht Homeoffice, damit Arbeit und Freizeit getrennt bleiben?",
  },
  16: {
    title: "Prüfungsangst und Stressbewältigung",
    intro: "Prüfungsangst kann entstehen, wenn man sich schlecht vorbereitet fühlt, hohe Erwartungen hat oder Angst vor Fehlern hat. Typische Reaktionen sind Nervosität, Konzentrationsprobleme oder ein Blackout. Vorbereitung und einfache Stressstrategien können helfen.",
    example: "Ein Schüler beginnt früher zu lernen, plant Pausen ein und atmet vor der Prüfung bewusst ruhig.",
    question: "Welche Strategie hilft dir persönlich gegen Stress vor einer Prüfung?",
  },
  17: {
    title: "Wie lernt man am besten?",
    intro: "Menschen lernen unterschiedlich. Manche brauchen Ruhe und Notizen, andere lernen besser durch Sprechen, Wiederholen oder praktische Übungen. Auch Zeitmanagement, Pausen und Motivation beeinflussen den Lernerfolg.",
    example: "Eine Person liest zuerst einen Text, schreibt danach Stichpunkte und erklärt den Inhalt anschließend mit eigenen Worten.",
    question: "Welche Lernmethode funktioniert für dich besonders gut, und warum?",
  },
  18: {
    title: "Wege zum Wunschberuf",
    intro: "Der Weg zum Wunschberuf beginnt oft mit den eigenen Interessen und Stärken. Danach kommen Ausbildung, Studium, praktische Erfahrung oder Weiterbildung. Nicht jeder Berufsweg ist direkt, deshalb sind auch alternative Schritte wichtig.",
    example: "Jemand möchte Softwareentwickler werden und beginnt mit einem Kurs, praktischen Projekten und später einer Weiterbildung.",
    question: "Welcher nächste Schritt würde dich deinem Wunschberuf näherbringen?",
  },
  19: {
    title: "Vorstellungsgespräch",
    intro: "Im Vorstellungsgespräch möchte ein Unternehmen herausfinden, ob eine Person zur Stelle passt. Bewerber erklären Ausbildung, Erfahrung, Stärken und Motivation. Gute Antworten sind konkret und enthalten möglichst ein Beispiel.",
    example: "Statt nur zu sagen „Ich bin teamfähig“, erklärt die Bewerberin, wie sie in einem Projekt mit anderen zusammengearbeitet hat.",
    question: "Welche Stärke würdest du im Vorstellungsgespräch nennen und mit welchem Beispiel erklären?",
  },
  20: {
    title: "Berufe kennenlernen und beschreiben",
    intro: "Um einen Beruf gut zu beschreiben, reicht der Berufsname nicht. Wichtig sind typische Aufgaben, notwendige Qualifikationen, Arbeitsbedingungen und persönliche Eigenschaften. Danach kannst du erklären, ob der Beruf zu dir passt.",
    example: "Ein Lehrer plant Unterricht, erklärt Inhalte, arbeitet mit Lernenden und braucht Geduld sowie gute Kommunikation.",
    question: "Welche Aufgabe oder Fähigkeit ist für deinen Wunschberuf besonders wichtig?",
  },
  21: {
    title: "Lebensformen heute",
    intro: "Menschen leben heute in unterschiedlichen Formen zusammen: allein, als Paar, in einer Familie, in einer WG oder in anderen Gemeinschaften. Keine Lebensform ist automatisch die beste. Bedürfnisse, Kosten, Verantwortung und persönliche Freiheit spielen eine Rolle.",
    example: "Eine Person lebt gern in einer WG, weil sie Kosten teilt und nicht allein ist.",
    question: "Welche Lebensform würde zu deiner aktuellen Situation am besten passen?",
  },
  22: {
    title: "Was ist in einer Beziehung wichtig?",
    intro: "Gute Beziehungen brauchen oft Vertrauen, Respekt, Kommunikation und gegenseitige Unterstützung. Menschen haben aber unterschiedliche Erwartungen. Deshalb ist es wichtig, offen darüber zu sprechen, was beide Seiten brauchen.",
    example: "Zwei Partner haben unterschiedliche Pläne fürs Wochenende und suchen gemeinsam eine Lösung.",
    question: "Welche Eigenschaft ist für eine stabile Beziehung besonders wichtig?",
  },
  23: {
    title: "Erstes Date – Typische Situationen",
    intro: "Bei einem ersten Date lernen sich zwei Menschen besser kennen. Ort, Kommunikation, Höflichkeit und persönliche Grenzen spielen dabei eine wichtige Rolle. Ein Treffen sollte für beide Personen angenehm und respektvoll sein.",
    example: "Zwei Personen treffen sich in einem öffentlichen Café und entscheiden danach, ob sie noch spazieren gehen möchten.",
    question: "Was macht ein erstes Treffen angenehm und respektvoll?",
  },
  24: {
    title: "Konsum und Nachhaltigkeit",
    intro: "Nachhaltiger Konsum bedeutet, beim Kaufen auch Umwelt, Ressourcen und Lebensdauer eines Produkts zu berücksichtigen. Dazu gehören zum Beispiel weniger Verpackung, regionale Produkte, Secondhand und Produkte, die länger genutzt werden können.",
    example: "Jemand kauft ein gebrauchtes Möbelstück statt eines neuen und verwendet es weiter.",
    question: "Welche nachhaltige Entscheidung ist im Alltag leicht umzusetzen?",
  },
  25: {
    title: "Online einkaufen – Rechte und Risiken",
    intro: "Online-Shopping ist bequem und bietet viel Auswahl, aber es gibt auch Risiken wie Fake-Shops, beschädigte Ware oder Datenschutzprobleme. Deshalb sind Verbraucherrechte, sichere Bezahlung und klare Rückgaberegeln wichtig.",
    example: "Ein Handy kommt mit beschädigtem Display an und der Käufer fordert Ersatz oder eine Rückerstattung.",
    question: "Was solltest du vor einer Online-Bestellung immer prüfen?",
  },
  26: {
    title: "Reiseprobleme und Lösungen",
    intro: "Auf Reisen können Probleme wie Verspätungen, verlorenes Gepäck, falsche Buchungen oder Schwierigkeiten im Hotel entstehen. Wichtig ist, das Problem klar zu beschreiben, ruhig zu reagieren und eine passende Lösung vorzuschlagen oder zu verlangen.",
    example: "Dein Koffer kommt nicht an und du meldest das Problem am Serviceschalter des Flughafens.",
    question: "Was würdest du zuerst tun, wenn während einer Reise etwas Wichtiges schiefläuft?",
  },
  27: {
    title: "Umweltfreundlich im Alltag",
    intro: "Umweltfreundliches Verhalten beginnt oft mit kleinen Entscheidungen im Alltag. Energie sparen, Müll vermeiden, Dinge wiederverwenden und öfter öffentliche Verkehrsmittel nutzen sind typische Beispiele. Wichtig ist, dass die Maßnahmen praktisch und langfristig umsetzbar sind.",
    example: "Eine Familie fährt kurze Wege mit dem Fahrrad und schaltet Geräte vollständig aus, wenn sie nicht benutzt werden.",
    question: "Welche umweltfreundliche Gewohnheit könntest du leicht in deinen Alltag übernehmen?",
  },
  28: {
    title: "Klimafreundlich leben",
    intro: "Klimafreundliches Leben betrifft mehrere Bereiche gleichzeitig: Verkehr, Energie, Ernährung und Konsum. Einzelne Maßnahmen lösen das Problem nicht allein, aber viele bewusste Entscheidungen können den persönlichen CO₂-Ausstoß reduzieren.",
    example: "Eine Person fährt häufiger mit dem Zug, isst weniger Fleisch und spart zu Hause Energie.",
    question: "In welchem Bereich könntest du deinen Alltag am einfachsten klimafreundlicher gestalten?",
  },
});

export const getB1TopicIntro = (day) => B1_TOPIC_INTROS[Number(day)] || null;

const card = {
  ...styles.card,
  display: "grid",
  gap: 10,
  border: "1px solid #bfdbfe",
  background: "#f8fbff",
};

const exampleBox = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 12,
  background: "#ffffff",
  lineHeight: 1.7,
  display: "grid",
  gap: 4,
};

export default function B1TopicIntroduction({ day }) {
  const topic = getB1TopicIntro(day);
  if (!topic) return null;

  return (
    <section style={card} data-b1-topic-intro={Number(day)}>
      <div>
        <p style={{ margin: 0, color: "#1d4ed8", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: ".04em" }}>
          B1 · Thema kurz verstehen
        </p>
        <h2 style={{ margin: "4px 0 0" }}>{topic.title}</h2>
      </div>

      <p style={{ margin: 0, lineHeight: 1.75 }}>{topic.intro}</p>

      <div style={exampleBox}>
        <strong>Beispiel</strong>
        <span>{topic.example}</span>
      </div>

      <div style={{ ...exampleBox, background: "#eff6ff" }}>
        <strong>Denkfrage</strong>
        <span>{topic.question}</span>
      </div>
    </section>
  );
}

export { B1_TOPIC_INTROS };
