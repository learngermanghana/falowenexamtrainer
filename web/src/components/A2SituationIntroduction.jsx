import React from "react";
import { styles } from "../styles";

const A2_SITUATIONS = Object.freeze({
  1: {
    title: "Small Talk",
    intro: "Small Talk sind kurze, einfache Gespräche im Alltag. Du begrüßt eine Person, stellst eine kleine Frage und reagierst kurz auf die Antwort.",
    example: "Du triffst eine neue Person im Kurs: „Hallo, wie geht es dir? Woher kommst du?“",
  },
  2: {
    title: "Personen beschreiben",
    intro: "Wenn du eine Person beschreibst, sprichst du über Aussehen, Charakter oder Beziehung zu dir. Wähle nur die Informationen, die für die Situation wichtig sind.",
    example: "Du beschreibst einen Freund: „Er ist groß, ruhig und sehr hilfsbereit.“",
  },
  3: {
    title: "Dinge und Personen vergleichen",
    intro: "Beim Vergleichen zeigst du, was gleich, ähnlich oder unterschiedlich ist. Du brauchst dafür zwei Personen oder Dinge und ein klares Merkmal.",
    example: "Du vergleichst zwei Wohnungen: „Die erste Wohnung ist größer, aber die zweite ist günstiger.“",
  },
  4: {
    title: "Wo möchten wir uns treffen?",
    intro: "Bei einer Verabredung müssen Ort, Zeit und Aktivität zusammenpassen. Du machst einen Vorschlag und reagierst auf den Vorschlag der anderen Person.",
    example: "Du sagst: „Treffen wir uns um 17 Uhr vor dem Bahnhof?“",
  },
  5: {
    title: "Freizeit",
    intro: "Bei Freizeitgesprächen sagst du, was du gern machst, wann du es machst und mit wem. Ein konkretes Beispiel macht deine Antwort natürlicher.",
    example: "Du sagst: „Am Samstag spiele ich Fußball mit meinen Freunden.“",
  },
  6: {
    title: "Möbel und Räume",
    intro: "Wenn du über eine Wohnung sprichst, beschreibst du Räume, Möbel und ihre Position. Wichtig ist: Wo ist etwas, und wohin kommt es?",
    example: "Du beschreibst dein Zimmer: „Der Tisch steht neben dem Fenster.“",
  },
  7: {
    title: "Eine Wohnung suchen",
    intro: "Bei der Wohnungssuche beschreibst du, welche Wohnung du brauchst und welche Merkmale wichtig sind. Dazu gehören Größe, Lage, Preis und Ausstattung.",
    example: "Du suchst: „Ich brauche eine Wohnung, die zwei Zimmer und einen Balkon hat.“",
  },
  8: {
    title: "Rezepte und Essen",
    intro: "Bei einem Rezept erklärst du Schritte in einer klaren Reihenfolge. Du sagst, was jemand tun soll und welche Zutaten gebraucht werden.",
    example: "Du erklärst: „Schneide zuerst die Tomaten und gib dann das Salz dazu.“",
  },
  9: {
    title: "Urlaub und Erlebnisse",
    intro: "Wenn du von einem Urlaub erzählst, berichtest du über etwas, das schon passiert ist. Du nennst Ort, Aktivitäten und besondere Erlebnisse.",
    example: "Du erzählst: „Letztes Jahr bin ich nach Berlin gefahren und habe viele Museen besucht.“",
  },
  10: {
    title: "Tourismus und traditionelle Feste",
    intro: "Bei diesem Thema erzählst du über frühere Erlebnisse, Feste oder Traditionen. Wichtig ist, was passiert ist und wie du die Situation erlebt hast.",
    example: "Du erzählst: „Als Kind ging ich jedes Jahr mit meiner Familie zu diesem Fest.“",
  },
  11: {
    title: "Verkehrsmittel vergleichen",
    intro: "Beim Vergleich von Verkehrsmitteln sprichst du über Preis, Geschwindigkeit, Komfort oder Umwelt. Wähle ein klares Kriterium für deinen Vergleich.",
    example: "Du sagst: „Die Bahn ist schneller als der Bus, aber der Bus ist günstiger.“",
  },
  12: {
    title: "Mein Traumberuf",
    intro: "Beim Traumberuf sagst du, welchen Beruf du möchtest, warum er zu dir passt und welche Fähigkeiten du dafür brauchst.",
    example: "Du sagst: „Ich möchte Ärztin werden, weil ich Menschen helfen möchte.“",
  },
  13: {
    title: "Vorstellungsgespräch",
    intro: "Im Vorstellungsgespräch sprichst du über deine Erfahrung, Fähigkeiten und frühere Aufgaben. Antworten sollten kurz, konkret und passend zur Stelle sein.",
    example: "Du erklärst: „In meiner letzten Arbeit musste ich oft mit Kunden sprechen.“",
  },
  14: {
    title: "Beruf und Karriere",
    intro: "Bei Beruf und Karriere sprichst du über Ziele und darüber, warum du etwas lernst oder tust. Der Zweck einer Handlung ist dabei besonders wichtig.",
    example: "Du sagst: „Ich lerne Deutsch, um später in Deutschland zu arbeiten.“",
  },
  15: {
    title: "Mein Lieblingssport",
    intro: "Beim Thema Sport sagst du, welchen Sport du machst, wie lange schon und warum er dir gefällt. Eine Zeitangabe macht die Antwort genauer.",
    example: "Du sagst: „Ich spiele seit drei Jahren Tennis.“",
  },
  16: {
    title: "Wohlbefinden und Entspannung",
    intro: "Beim Wohlbefinden sprichst du über Stress, Entspannung und Gewohnheiten, die dir guttun. Du beschreibst auch, was dir hilft oder worunter du leidest.",
    example: "Du sagst: „Ich erhole mich am Wochenende von der Arbeit.“",
  },
  17: {
    title: "In die Apotheke gehen",
    intro: "In der Apotheke beschreibst du kurz dein gesundheitliches Problem und fragst nach einem Medikament oder Rat.",
    example: "Du hast seit gestern Husten und fragst: „Was soll ich nehmen?“",
  },
  18: {
    title: "Die Bank anrufen",
    intro: "Bei einem Bankanruf sagst du zuerst den Grund des Anrufs und stellst danach eine höfliche Frage oder Bitte.",
    example: "Du hast deine Karte verloren und fragst: „Könnten Sie meine Karte bitte sperren?“",
  },
  19: {
    title: "Einkaufen – wo und wie?",
    intro: "Beim Einkaufen sprichst du über Ort, Produkt, Preis oder Qualität. Du kannst eine Alternative nennen oder erklären, warum du etwas kaufst.",
    example: "Du sagst: „Ich kaufe auf dem Markt, denn das Obst ist dort oft frischer.“",
  },
  20: {
    title: "Eine Reklamation machen",
    intro: "Eine Reklamation machst du, wenn ein Produkt oder eine Dienstleistung ein Problem hat. Du erklärst kurz, was passiert ist, und sagst höflich, welche Lösung du möchtest.",
    example: "Die Kopfhörer funktionieren nicht. Du möchtest sie umtauschen.",
  },
  21: {
    title: "Ein Wochenende planen",
    intro: "Bei einer Wochenendplanung vereinbarst du Zeit, Aktivität und Ort. Du brauchst oft auch einen Plan B, falls etwas nicht möglich ist.",
    example: "Du sagst: „Wenn das Wetter gut ist, gehen wir in den Park. Falls es regnet, gehen wir ins Kino.“",
  },
  22: {
    title: "Die Woche planen",
    intro: "Bei einer Wochenplanung ordnest du Termine und Aktivitäten nach Tagen und Uhrzeiten. Du sagst auch, was du tun musst oder wann du Zeit hast.",
    example: "Du sagst: „Am Montag muss ich um 18 Uhr zum Deutschkurs gehen.“",
  },
  23: {
    title: "Schul- oder Arbeitsweg",
    intro: "Wenn du deinen Weg beschreibst, sagst du, welches Verkehrsmittel du benutzt, wohin du fährst und wie lange der Weg dauert.",
    example: "Du sagst: „Ich fahre mit dem Bus zur Arbeit. Der Weg dauert 30 Minuten.“",
  },
  24: {
    title: "Einen Urlaub planen",
    intro: "Bei einer Urlaubsplanung entscheidest du über Reiseziel, Verkehrsmittel, Unterkunft und Aktivitäten. Deine Angaben sollten konkret zusammenpassen.",
    example: "Du planst: „Ich möchte in die Schweiz fahren und dort in einem Hotel übernachten.“",
  },
  25: {
    title: "Tagesablauf",
    intro: "Beim Tagesablauf beschreibst du einen normalen Tag in zeitlicher Reihenfolge. Zeitangaben helfen, die einzelnen Schritte klar zu ordnen.",
    example: "Du sagst: „Um 6 Uhr stehe ich auf. Danach frühstücke ich und fahre zur Arbeit.“",
  },
  26: {
    title: "Gefühle in verschiedenen Situationen",
    intro: "Wenn du Gefühle beschreibst, nennst du zuerst die Situation und danach das Gefühl oder deine Reaktion. Ein Grund macht die Aussage verständlicher.",
    example: "Du sagst: „Vor einer Prüfung bin ich nervös, weil ich nichts vergessen möchte.“",
  },
  27: {
    title: "Digitale Kommunikation",
    intro: "Bei digitaler Kommunikation entscheidest du, ob Nachricht, E-Mail oder Anruf zur Situation passt. Du kannst auch über Regeln und typische Probleme sprechen.",
    example: "Du sagst: „Wenn etwas dringend ist, rufe ich an. Für formelle Informationen schreibe ich eine E-Mail.“",
  },
  28: {
    title: "Über die Zukunft sprechen",
    intro: "Wenn du über die Zukunft sprichst, nennst du einen konkreten Plan oder Wunsch und erklärst, warum er dir wichtig ist oder was du dafür tun musst.",
    example: "Du sagst: „Ich möchte später in Deutschland arbeiten. Deshalb verbessere ich jetzt mein Deutsch.“",
  },
});

export const getA2Situation = (day) => A2_SITUATIONS[Number(day)] || null;

const infoBox = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 12,
  background: "#ffffff",
  lineHeight: 1.7,
  display: "grid",
  gap: 4,
};

export default function A2SituationIntroduction({ day }) {
  const situation = getA2Situation(day);
  if (!situation) return null;

  return (
    <section
      style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe", borderRadius: 18, background: "#f8fbff" }}
      data-a2-situation-intro={Number(day)}
    >
      <div>
        <div style={{ fontWeight: 900, color: "#1d4ed8" }}>A2 · Situation verstehen</div>
        <h2 style={{ margin: "4px 0 0", fontSize: "1.2rem" }}>{situation.title}</h2>
      </div>

      <p style={{ margin: 0, lineHeight: 1.75 }}>{situation.intro}</p>

      <div style={infoBox}>
        <strong>Beispiel</strong>
        <span>{situation.example}</span>
      </div>
    </section>
  );
}

export { A2_SITUATIONS };
