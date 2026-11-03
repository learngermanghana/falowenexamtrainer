// Original Falowen C1 self-study reading passages, 28 days.
// Created as new course material; these are not official Goethe exam texts.
// Open-ended questions come from the matching canonical C1 lesson profile.
import { getC1CanonicalTitle, getC1ContentProfile } from "./c1ContentRefresh.js";

const PASSAGES = [
  [
    "Ein realistischer Lernplan ist mehr als eine Aufzählung ehrgeiziger Ziele. Wer C1 erreichen möchte, muss wissen, welche Fähigkeiten bereits sicher sind und wo die größten Unsicherheiten liegen. Kurze Selbsttests und ein Lerntagebuch machen Fortschritte sichtbar; sie zeigen allerdings nicht immer, ob sich jemand in spontanen Gesprächen souverän ausdrücken kann.",
    "Viele Lernende beginnen mit zu vielen Aufgaben. Nach einigen Wochen geraten sie unter Druck und verzichten schließlich ganz auf die Routine. Wirksamer sind überschaubare Zeitfenster, gezielte Wiederholung typischer Fehler und regelmäßige Gelegenheiten, selbst zu sprechen oder zu schreiben. Dabei sollten Lesen, Hören und aktive Sprachproduktion einander ergänzen.",
    "Ein Lernplan muss deshalb überprüfbar und anpassbar sein. Wenn eine Methode keine Wirkung zeigt oder private Verpflichtungen dazwischenkommen, ist eine Korrektur vernünftiger als ein vollständiger Neustart. Der entscheidende Maßstab ist nicht die Zahl bearbeiteter Übungen, sondern ob Rückmeldungen zu einem veränderten Sprachgebrauch führen."
  ],
  [
    "Kulturelle Identität wird oft als unveränderliche Eigenschaft dargestellt, die sich unmittelbar aus Herkunft, Sprache oder Tradition ableiten lasse. Tatsächlich entsteht Zugehörigkeit im Austausch zwischen individuellen Erfahrungen und gesellschaftlichen Erwartungen. Ein Mensch kann mehrere Sprachen sprechen und sich unterschiedlichen Gemeinschaften gleichzeitig verbunden fühlen, ohne dadurch widersprüchlich zu handeln.",
    "Schwierig wird die Debatte, wenn äußere Merkmale als Beweis für persönliche Werte gelten. Wer bestimmte Bräuche pflegt, muss nicht jede Vorstellung seiner Herkunftsgemeinschaft teilen. Gleichzeitig kann die ständige Aufforderung, sich eindeutig zuzuordnen, den Wunsch verstärken, eine einzelne Identität besonders sichtbar zu machen.",
    "Eine offene Gesellschaft sollte kulturelle Unterschiede anerkennen, ohne Menschen darauf zu reduzieren. Begegnungen, Bildung und persönliche Beziehungen können vertraute Vorstellungen verändern. Integration erfordert daher weder die vollständige Aufgabe bisheriger Traditionen noch die Erwartung, dass alle Menschen ihre kulturellen Gewohnheiten unverändert beibehalten."
  ],
  [
    "Im digitalen Nachrichtenalltag verbreitet sich eine eindrucksvolle Schlagzeile häufig schneller als die Prüfung ihrer Grundlagen. Ein einzelner Augenzeugenbericht kann in kurzer Zeit als gesicherte Tatsache erscheinen. Besonders problematisch ist, dass Vermutungen, persönliche Bewertungen und überprüfte Informationen oftmals in ähnlich entschiedener Sprache vorgetragen werden.",
    "Verantwortungsvolle Berichterstattung legt deshalb offen, welche Angaben unabhängig bestätigt wurden und wo noch Fragen bestehen. Auch Plattformen können auf fehlenden Kontext hinweisen, ohne jede umstrittene Aussage zu entfernen. Wer Inhalte weiterleitet, sollte berücksichtigen, dass das Teilen selbst zusätzliche Glaubwürdigkeit erzeugen kann.",
    "Aus Unsicherheit folgt allerdings nicht, dass Medien bei wichtigen Ereignissen schweigen müssen. Entscheidend ist, den jeweiligen Wissensstand kenntlich zu machen und Fehler nachvollziehbar zu korrigieren. Glaubwürdigkeit entsteht weniger durch das Versprechen völliger Fehlerfreiheit als durch transparente Quellenarbeit und die Bereitschaft, frühere Aussagen zu überprüfen."
  ],
  [
    "Meinungsverschiedenheiten in Teams werden häufig als persönliches Scheitern verstanden. Dabei entstehen Konflikte oft gerade dort, wo Menschen unterschiedliche Erfahrungen und Zuständigkeiten mitbringen. Eine Debatte über Prioritäten kann darauf hinweisen, dass Ziele unklar formuliert oder Ressourcen ungleich verteilt sind.",
    "Wer den Konflikt vorschnell einer einzelnen Person zuschreibt, übersieht möglicherweise organisatorische Ursachen. Hilfreich sind klare Rollen, begründete Entscheidungen und eine Gesprächskultur, in der konkrete Beobachtungen von pauschalen Vorwürfen getrennt werden. Auch zurückhaltende Mitglieder müssen die Gelegenheit erhalten, Einwände zu äußern.",
    "Allerdings ist Einigkeit um jeden Preis ebenfalls problematisch. Wird jede Entscheidung unbegrenzt vertagt, verschwimmt die Verantwortung. Ein tragfähiger Kompromiss setzt daher keine vollständige Übereinstimmung voraus, wohl aber die ernsthafte Prüfung verschiedener Positionen und die Bereitschaft, eine Entscheidung bei neuen Erkenntnissen zu korrigieren."
  ],
  [
    "Berufliche Qualifikationen verlieren selten von einem Tag auf den anderen ihren Wert. Dennoch verändern digitale Werkzeuge und neue Arbeitsabläufe die Anforderungen vieler Berufe. Weiterbildung wird dadurch notwendig, darf aber nicht ausschließlich als private Verpflichtung von Beschäftigten verstanden werden.",
    "Wer im Schichtdienst arbeitet oder Angehörige versorgt, verfügt möglicherweise über wenig Zeit und Geld für zusätzliche Kurse. Unternehmen profitieren hingegen unmittelbar von neuen Kompetenzen. Sie können Lernzeiten ermöglichen, Mentoring anbieten und sicherstellen, dass das Gelernte in realen Projekten erprobt wird.",
    "Auch die Beschäftigten sollten ihre Ziele kennen und Angebote kritisch auswählen. Ein Zertifikat garantiert keine bessere Leistung, wenn keine Gelegenheit zur Anwendung besteht. Gerechte Personalentwicklung erreicht deshalb gerade diejenigen, deren Aufgaben sich stark verändern und die bisher kaum Zugang zu Fortbildung hatten. Eigeninitiative und institutionelle Unterstützung sind keine Gegensätze."
  ],
  [
    "Empfehlungen für einen gesunden Lebensstil richten sich meist an einzelne Menschen: mehr Bewegung, bessere Ernährung und ausreichend Schlaf. Solche Hinweise können sinnvoll sein, greifen jedoch zu kurz, wenn die Lebensumstände ihre Umsetzung erschweren. Lange Arbeitszeiten, unsichere Einkommen oder fehlende Freiflächen beeinflussen tatsächliche Handlungsmöglichkeiten.",
    "Prävention muss deshalb auch die Bedingungen des Alltags berücksichtigen. Arbeitgeber können Arbeitszeiten planbarer gestalten, Kommunen sichere Fußwege schaffen und Schulen Gesundheitswissen vermitteln. Solche Maßnahmen ersetzen persönliche Entscheidungen nicht, sondern erleichtern sie. Umgekehrt erlaubt ein statistischer Risikofaktor noch kein moralisches Urteil über eine einzelne Person.",
    "Eine wirksame Gesundheitspolitik verbindet Aufklärung mit dem Abbau vermeidbarer Hindernisse. Statt Menschen für jede Erkrankung verantwortlich zu machen, sollte sie fragen, welche Angebote zugänglich sind und welche Gruppen zusätzliche Unterstützung benötigen. Individuelle Verantwortung und gesellschaftliche Bedingungen beeinflussen einander fortlaufend."
  ],
  [
    "Tourismus schafft Arbeitsplätze und kann den kulturellen Austausch fördern. Gleichzeitig steigen in stark besuchten Regionen häufig Mieten und Preise, während Natur und Infrastruktur unter Druck geraten. Die wirtschaftlichen Vorteile verteilen sich zudem nicht immer gerecht: Ein Teil der Einnahmen fließt an große Unternehmen, die Belastungen bleiben vor Ort.",
    "Besuchsbegrenzungen, Abgaben und Regeln für Ferienwohnungen sollen diese Folgen mildern. Sie müssen jedoch transparent begründet werden. Wenn nur noch wohlhabende Menschen reisen können, entsteht ein neues Gerechtigkeitsproblem. Auch bessere öffentliche Verkehrsmittel und die Förderung weniger bekannter Reiseziele können dazu beitragen, beliebte Orte zu entlasten.",
    "Nachhaltiger Tourismus bedeutet daher nicht, Reisen grundsätzlich abzulehnen. Die Interessen der lokalen Bevölkerung, ökologische Grenzen und wirtschaftliche Chancen müssen gemeinsam betrachtet werden. Erfolgreich ist eine Maßnahme nicht allein dann, wenn sie Besucherzahlen verändert, sondern wenn sie Lebensqualität erhält und langfristige Perspektiven eröffnet."
  ],
  [
    "Wachsende Städte müssen zusätzlichen Wohnraum schaffen und zugleich Grünflächen, Verkehrswege und öffentliche Einrichtungen schützen. Dass sich diese Ziele teilweise widersprechen, lässt sich nicht durch eine einzige bauliche Maßnahme lösen. Verdichtung kann sinnvoll sein, sofern die Bedürfnisse der bereits dort lebenden Menschen berücksichtigt werden.",
    "Besonders heikel ist die Aufwertung einzelner Stadtviertel. Neue Wohnungen und Geschäfte können die Attraktivität erhöhen, zugleich aber steigende Mieten und Verdrängung auslösen. Sozial gebundener Wohnraum, Genossenschaften und verlässliche Verkehrsverbindungen bieten unterschiedliche Möglichkeiten, wirtschaftliche und soziale Interessen zu verbinden.",
    "Bürgerbeteiligung sollte mehr sein als eine symbolische Anhörung. Entscheidend ist, dass Verantwortliche erklären, welche Vorschläge übernommen wurden und warum andere nicht umgesetzt werden konnten. Legitimität verlangt nicht die Erfüllung jedes Wunsches, sondern transparente Abwägungen und überprüfbare Folgen der Planung."
  ],
  [
    "Werbung vermittelt nicht nur Informationen über Produkte, sondern erzeugt auch Erwartungen an ein bestimmtes Lebensgefühl. Besonders in sozialen Medien verschwimmt die Grenze zwischen persönlicher Empfehlung und bezahlter Kooperation. Sind wirtschaftliche Interessen nicht erkennbar, fällt es dem Publikum schwer, Aussagen angemessen einzuordnen.",
    "Bewusster Konsum erfordert deshalb mehr als einen Preisvergleich. Nutzungsdauer, Reparaturmöglichkeiten und Folgekosten spielen ebenfalls eine Rolle. Allerdings sind langlebige Produkte häufig teurer in der Anschaffung. Menschen mit geringem Einkommen können nicht jede theoretisch nachhaltige Entscheidung tatsächlich treffen.",
    "Es wäre folglich verkürzt, Konsumverhalten nur als individuelle Moralfrage zu behandeln. Unternehmen können transparente Informationen liefern und Reparaturen ermöglichen; politische Regeln können irreführende Werbung begrenzen. Entscheidungen bleiben persönlich, werden jedoch von wirtschaftlichen und gesellschaftlichen Bedingungen geprägt."
  ],
  [
    "Sprachkenntnisse erleichtern den Zugang zu Bildung, Arbeit und öffentlichen Einrichtungen. Dennoch hängt gesellschaftliche Integration nicht allein von der Bereitschaft einzelner Zugewanderter ab, eine neue Sprache zu lernen. Verständliche Informationen, faire Bewerbungsverfahren und zugängliche Beratung entscheiden ebenfalls darüber, ob Menschen ihre Rechte wahrnehmen können.",
    "Begegnungen im Alltag entstehen nicht automatisch. Vereine, Schulen und Nachbarschaftsprojekte können gemeinsame Aufgaben und persönliche Kontakte ermöglichen. Gleichzeitig wäre es problematisch, Anpassung nur von einer Gruppe zu erwarten. Zusammenleben verlangt, unterschiedliche Erfahrungen anzuerkennen und gemeinsame Regeln auszuhandeln.",
    "Eine erfolgreiche Integrationspolitik sollte daher nicht ausschließlich die Teilnahme an Sprachkursen zählen. Ebenso wichtig sind tatsächliche Bildungswege, Arbeitsperspektiven und Möglichkeiten der Mitbestimmung. Teilhabe ist kein einmal abgeschlossener Zustand, sondern entwickelt sich im Zusammenspiel zwischen Menschen und Institutionen."
  ],
  [
    "Ehrenamtliche Arbeit kann Gemeinschaften stärken und Menschen Erfahrungen außerhalb ihres Berufs ermöglichen. Sie schafft Kontakte, unterstützt lokale Projekte und macht gesellschaftliche Probleme sichtbar. Zugleich entsteht ein Spannungsfeld, wenn öffentliche Einrichtungen dauerhaft auf unentgeltliche Hilfe angewiesen sind, um grundlegende Leistungen zu sichern.",
    "Nicht alle verfügen über dieselben Möglichkeiten, sich zu engagieren. Wer Familie und mehrere Arbeitsstellen miteinander vereinbaren muss, kann weniger Zeit investieren als andere. Flexible Aufgaben, verlässliche Ansprechpartner und klare Grenzen der Verantwortung erleichtern die Beteiligung. Qualifizierte Begleitung schützt auch die Personen, denen geholfen werden soll.",
    "Ein tragfähiges Projekt ergänzt deshalb professionelle Strukturen, statt sie unsichtbar zu ersetzen. Erfolg lässt sich nicht nur an geleisteten Stunden messen. Entscheidend ist, ob Unterstützung tatsächlich ankommt, Freiwillige ihre Aufgaben verantwortungsvoll erfüllen können und das Angebot langfristig verlässlich bleibt."
  ],
  [
    "Wenn öffentliche Haushalte sparen müssen, geraten Bibliotheken, Theater und Kulturzentren unter Druck. Ihr Nutzen lässt sich schwerer in Zahlen ausdrücken als jener einer neuen Straße. Dennoch schaffen kulturelle Einrichtungen Räume für Begegnung, Erinnerung und öffentliche Debatten. Diese Wirkung geht über verkaufte Eintrittskarten hinaus.",
    "Förderung muss allerdings begründet werden. Einrichtungen sollten ihre Ziele offenlegen und erklären, welche Menschen sie tatsächlich erreichen. In ländlichen Gebieten ist häufig die Entfernung entscheidender als das Programm selbst. Mobile Bibliotheken, regionale Kooperationen und günstige Veranstaltungen können den Zugang verbessern.",
    "Eine ausgewogene Kulturpolitik sollte weder jedes Angebot unabhängig von seiner Wirkung finanzieren noch ausschließlich auf Rentabilität achten. Kulturelle Teilhabe ist auch eine Frage sozialer Gerechtigkeit. Wer gefördert wird, sollte deshalb nach Qualität, Zugang und gesellschaftlichem Beitrag beurteilt werden."
  ],
  [
    "Mehrsprachigkeit erleichtert internationale Kontakte, kann familiäre Beziehungen stärken und verschiedene Perspektiven eröffnen. Dennoch beherrscht ein Mensch nicht automatisch alle sprachlichen Register gleich gut. Es ist möglich, in einer Sprache flüssig persönliche Gespräche zu führen, aber bei wissenschaftlichen Texten Unterstützung zu benötigen.",
    "Schulen sollten deshalb vorhandene Sprachen als Ressource ansehen und zugleich die Entwicklung von Fachsprache fördern. Wer die Unterrichtssprache noch lernt, verfügt nicht deshalb über weniger Wissen. Umgekehrt reicht die Anerkennung sprachlicher Vielfalt allein nicht aus, wenn komplexe Inhalte nicht verständlich ausgedrückt werden können.",
    "Eine sinnvolle Bildungspolitik verbindet Wertschätzung mit konkreter Förderung. Lernende brauchen Gelegenheit, Informationen zu vergleichen, Argumente aufzubauen und Fachbegriffe in eigenen Worten zu erklären. Mehrsprachigkeit wird so nicht zu einem Etikett, sondern zu einer Fähigkeit, die unterschiedliche Lebensbereiche miteinander verbindet."
  ],
  [
    "Neue Technologien werden häufig als unvermeidlicher Fortschritt dargestellt. Entscheidend ist jedoch, welches Problem eine Innovation löst und wem sie tatsächlich Vorteile bringt. Eine automatisierte Anwendung kann Zeit sparen und zugleich neue Fehlerquellen schaffen. Geschwindigkeit allein ist deshalb kein ausreichender Qualitätsmaßstab.",
    "Verantwortliche Entwicklung setzt voraus, dass Systeme unter unterschiedlichen Bedingungen getestet werden. Betroffene Beschäftigte und Nutzergruppen sollten frühzeitig einbezogen werden. Kritische Nachfragen bedeuten nicht zwangsläufig Technikfeindlichkeit. Vielmehr können sie verhindern, dass vermeidbare Risiken erst nach einer breiten Einführung sichtbar werden.",
    "Zukunftsfolgen bleiben dennoch ungewiss. Würde man jedes Projekt bis zur absoluten Gewissheit verschieben, wäre kaum Veränderung möglich. Sinnvoller sind transparente Annahmen, überprüfbare Zwischenziele und die Möglichkeit, bei unerwarteten Problemen nachzubessern."
  ],
  [
    "Lebenslanges Lernen wird zunehmend als Voraussetzung beruflicher Sicherheit beschrieben. Doch Lernmöglichkeiten sind ungleich verteilt. Während manche Menschen Weiterbildungen während der Arbeitszeit besuchen, müssen andere Gebühren und Zeit selbst aufbringen. Dadurch kann ein Angebot, das formal allen offensteht, bestehende Ungleichheiten sogar verstärken.",
    "Bildungspolitik sollte daher nicht nur neue Kurse finanzieren, sondern auch Zugangsbarrieren abbauen. Flexible Termine, Kinderbetreuung und verständliche Beratung können entscheidend sein. Ebenso wichtig ist die Anerkennung informell erworbener Kenntnisse, die in klassischen Zeugnissen nicht immer sichtbar werden.",
    "Der Wert von Weiterbildung zeigt sich letztlich daran, ob Menschen das Gelernte nutzen können. Lernangebote müssen zu tatsächlichen Aufgaben passen, ohne kurzfristige Anforderungen zum alleinigen Maßstab zu machen. Bildung bleibt zugleich eine gesellschaftliche und persönliche Ressource."
  ],
  [
    "Digitale Anwendungen versprechen, alltägliche Aufgaben schneller und einfacher zu erledigen. Viele Menschen profitieren von automatischen Übersetzungen, Online-Terminen und mobilen Bezahlsystemen. Gleichzeitig können undurchsichtige Einstellungen und ständig wechselnde Benutzeroberflächen neue Abhängigkeiten schaffen.",
    "Besonders schwierig wird es, wenn wesentliche Dienste nur noch digital zugänglich sind. Wer über geringe technische Erfahrung oder keine stabile Internetverbindung verfügt, gerät leicht ins Hintertreffen. Gute Gestaltung muss deshalb klare Sprache, nachvollziehbare Entscheidungen und alternative Zugangswege berücksichtigen.",
    "Digitale Kompetenz ist mehr als die Fähigkeit, auf Schaltflächen zu klicken. Sie umfasst auch den kritischen Umgang mit Daten und die Frage, wann eine analoge Lösung sinnvoller ist. Technik sollte Handlungsmöglichkeiten erweitern, statt Menschen zu einer einzigen Nutzungsform zu zwingen."
  ],
  [
    "Umweltschutz wird oft auf individuelle Verhaltensänderungen reduziert: weniger Verpackung, kürzere Wege und bewussterer Konsum. Solche Entscheidungen sind wichtig, können strukturelle Probleme aber nicht vollständig lösen. Produktion, Energieversorgung und Verkehrsinfrastruktur bestimmen mit, welche Alternativen überhaupt verfügbar sind.",
    "Politische Maßnahmen müssen deshalb Anreize und verbindliche Regeln kombinieren. Werden ökologische Kosten transparent gemacht, können Unternehmen langfristiger planen. Gleichzeitig sollten Belastungen sozial abgefedert werden, damit notwendige Veränderungen nicht vor allem Haushalte mit wenig Geld treffen.",
    "Ein wirksamer Ansatz verbindet Verantwortung mit Gerechtigkeit. Individuelle Beiträge sind sinnvoll, sofern Institutionen und Unternehmen ebenfalls handeln. Das Ziel ist nicht moralische Perfektion jedes Einzelnen, sondern eine dauerhafte Verringerung von Umweltbelastungen."
  ],
  [
    "Gesellschaftlicher Zusammenhalt zeigt sich nicht daran, dass alle dieselben Überzeugungen teilen. In pluralistischen Gesellschaften sind Konflikte unvermeidlich. Entscheidend ist, ob gemeinsame Institutionen faire Verfahren anbieten, mit denen Interessen sichtbar werden und Streitigkeiten bearbeitet werden können.",
    "Wenn einzelne Gruppen den Eindruck gewinnen, ihre Erfahrungen würden systematisch übergangen, sinkt die Bereitschaft zum Kompromiss. Zuhören allein genügt dann nicht. Beteiligung muss Folgen haben, und politische Entscheidungen sollten verständlich begründet werden. Gleichzeitig braucht demokratische Zusammenarbeit Grenzen gegenüber Einschüchterung und Ausgrenzung.",
    "Vertrauen entsteht somit durch wiederholte Erfahrungen von Fairness, nicht durch bloße Appelle an Gemeinschaft. Unterschiede dürfen bestehen bleiben, solange Menschen darauf vertrauen können, dass ihre Rechte geschützt und ihre Einwände ernst genommen werden."
  ],
  [
    "Automatisierung verändert Tätigkeiten oft schrittweise statt ganze Berufe auf einmal zu ersetzen. Software übernimmt standardisierte Aufgaben, während Beratung, Kontrolle und komplexe Entscheidungen an Bedeutung gewinnen können. Die Folgen hängen daher davon ab, wie Unternehmen neue Werkzeuge einsetzen und Beschäftigte daran beteiligen.",
    "Produktivitätsgewinne entstehen nicht ohne Übergangskosten. Mitarbeitende benötigen Zeit für Weiterbildung, und manche Tätigkeitsprofile werden dauerhaft verschwinden. Wer diese Belastungen allein den Betroffenen überlässt, riskiert sozialen Widerstand und verliert vorhandenes Erfahrungswissen.",
    "Eine verantwortliche Arbeitsmarktpolitik verbindet technische Innovation mit Qualifizierung und nachvollziehbaren Regeln. Entscheidend ist nicht nur, wie viele Tätigkeiten automatisiert werden können, sondern wie Menschen an den Vorteilen beteiligt werden und welche beruflichen Perspektiven entstehen."
  ],
  [
    "Digitale Gesundheitsangebote können Wartezeiten reduzieren und medizinische Informationen leichter zugänglich machen. Elektronische Akten und Videosprechstunden erleichtern den Austausch zwischen Fachkräften. Zugleich handelt es sich um besonders sensible Daten, deren missbräuchliche Nutzung weitreichende Folgen haben kann.",
    "Vertrauen entsteht nicht allein durch eine lange Einwilligungserklärung. Patientinnen und Patienten müssen verstehen können, welche Informationen verarbeitet werden und wer darauf zugreifen darf. Ebenso wichtig sind sichere Systeme und Angebote für Menschen, die digitale Anwendungen nicht nutzen können oder wollen.",
    "Technik darf die persönliche Beziehung in der Versorgung ergänzen, aber nicht ohne Weiteres ersetzen. Entscheidend ist, ob digitale Lösungen die Qualität verbessern, Verantwortung klar zuordnen und tatsächliche Wahlmöglichkeiten erhalten."
  ],
  [
    "Die Diskussion über gesellschaftliche Teilhabe konzentriert sich häufig auf individuelle Anpassung. Dabei hängen Chancen auch davon ab, wie Schulen, Behörden und Unternehmen organisiert sind. Wer sich um einen Arbeitsplatz bewirbt, braucht nicht nur passende Fähigkeiten, sondern auch faire Verfahren und verständliche Informationen.",
    "Strukturelle Hindernisse sind manchmal schwer zu erkennen, weil Regeln formal für alle gleich gelten. Unterschiedliche Ausgangsbedingungen können jedoch dazu führen, dass dieselbe Regel Menschen ungleich trifft. Unterstützungsangebote sollten solche Effekte prüfen, ohne Betroffene auf eine einzige Eigenschaft zu reduzieren.",
    "Teilhabe entsteht langfristig durch den Zugang zu Bildung, Arbeit und Mitbestimmung. Sie lässt sich nicht mit einer einmaligen Veranstaltung herstellen. Notwendig sind überprüfbare Verbesserungen und Institutionen, die Rückmeldungen ernst nehmen."
  ],
  [
    "Demokratische Mitbestimmung erschöpft sich nicht im regelmäßigen Wählen. Menschen müssen Entscheidungen nachvollziehen und zwischen verschiedenen Positionen unterscheiden können. Gleichzeitig sind politische Prozesse häufig komplexer, als kurze Schlagzeilen vermuten lassen.",
    "Beteiligungsverfahren können neue Perspektiven sichtbar machen, wenn klar ist, worüber tatsächlich entschieden werden kann. Werden Erwartungen geweckt, die später ohne Erklärung enttäuscht werden, kann dies Misstrauen verstärken. Auch gewählte Vertreter müssen unbequeme Abwägungen offen begründen, statt Konflikte hinter allgemeinen Formeln zu verstecken.",
    "Eine lebendige Demokratie benötigt deshalb Kritik und Kompromissbereitschaft zugleich. Bürgerinnen und Bürger müssen nicht jede Entscheidung gutheißen, sollten aber faire Verfahren anerkennen können. Legitimität erwächst aus Transparenz, Verantwortung und überprüfbaren Regeln."
  ],
  [
    "Die Forderung nach einer besseren Work-Life-Balance richtet sich häufig an einzelne Beschäftigte: Sie sollen Prioritäten setzen und Grenzen ziehen. Doch persönliche Strategien stoßen dort an Grenzen, wo Arbeitszeiten schwer planbar sind oder ständige Erreichbarkeit stillschweigend erwartet wird.",
    "Unternehmen können Belastung reduzieren, indem sie Aufgaben realistisch verteilen und Ruhezeiten respektieren. Flexible Arbeit kann helfen, sofern sie nicht dazu führt, dass berufliche Pflichten in jeden privaten Moment hineinreichen. Auch Beschäftigte müssen ihre Bedürfnisse kommunizieren können, ohne Nachteile befürchten zu müssen.",
    "Ein ausgewogenes Verhältnis zwischen Beruf und Privatleben ist daher nicht mit einer bestimmten Stundenanzahl gleichzusetzen. Entscheidend sind Handlungsspielräume, Verlässlichkeit und die Möglichkeit zur Erholung. Verantwortung tragen sowohl Einzelne als auch Organisationen."
  ],
  [
    "Verkehrsplanung wird oft anhand der Geschwindigkeit beurteilt, mit der Menschen ihr Ziel erreichen. Doch auch Sicherheit, Erschwinglichkeit und Umweltbelastung entscheiden über die Qualität eines Systems. Eine schnelle Verbindung hilft wenig, wenn sie nur für einen kleinen Teil der Bevölkerung zugänglich ist.",
    "Investitionen in Busse, Bahnen und sichere Radwege können unterschiedliche Mobilitätsbedürfnisse verbinden. Allerdings sind neue Projekte teuer und erfordern langfristige Wartung. Wenn ländliche Gebiete bei der Planung vernachlässigt werden, können bestehende Unterschiede weiter wachsen.",
    "Eine vorausschauende Infrastrukturpolitik betrachtet deshalb gesamte Wegeketten: vom Wohnort über Umsteigepunkte bis zum Arbeitsplatz. Gute Mobilität bedeutet nicht nur mehr Verkehr, sondern verlässliche Möglichkeiten, wichtige Orte ohne unverhältnismäßigen Aufwand zu erreichen."
  ],
  [
    "Wissenschaftliche Erkenntnisse genießen Vertrauen, weil ihre Grundlagen grundsätzlich überprüfbar sind. Dieses Vertrauen darf jedoch nicht mit dem Anspruch verwechselt werden, Forschungsergebnisse seien immer endgültig. Neue Daten können frühere Annahmen bestätigen, einschränken oder widerlegen.",
    "Forschende stehen zugleich unter Publikations- und Finanzierungsdruck. Interessenkonflikte müssen deshalb transparent gemacht werden, ohne daraus pauschal auf Unehrlichkeit zu schließen. Auch Medien tragen Verantwortung, vorläufige Ergebnisse nicht als sichere Antworten auf komplexe Fragen darzustellen.",
    "Forschungsethik verlangt sorgfältige Methoden, nachvollziehbare Dokumentation und die Bereitschaft zur Korrektur. Wissenschaftliche Unsicherheit ist kein Zeichen grundsätzlicher Schwäche. Sie gehört zu einem Verfahren, das Erkenntnisse gerade durch kritische Prüfung verbessert."
  ],
  [
    "Nachhaltiger Konsum wird oft als Entscheidung zwischen einem guten und einem schlechten Produkt dargestellt. Tatsächlich spielen Herkunft, Haltbarkeit, Transport und Reparaturmöglichkeiten zusammen. Ein vermeintlich umweltfreundliches Angebot kann problematisch sein, wenn seine Herstellung besonders viele Ressourcen benötigt.",
    "Verbraucherinnen und Verbraucher benötigen verständliche Informationen, um Alternativen vergleichen zu können. Doch nicht jeder Haushalt kann höhere Anschaffungskosten tragen. Unternehmen sollten daher langlebige Produkte entwickeln und nachvollziehbare Angaben machen, während politische Regeln irreführende Versprechen begrenzen können.",
    "Bewusster Konsum bedeutet nicht, jede Kaufentscheidung vollkommen zu optimieren. Wichtiger sind realistische Prioritäten, längere Nutzung und Rahmenbedingungen, die nachhaltige Entscheidungen erleichtern. Individuelles Verhalten und strukturelle Verantwortung gehören zusammen."
  ],
  [
    "Digitale Verwaltungsangebote versprechen schnellere Abläufe und weniger Papier. Online-Anträge können Wege sparen und Bearbeitungsschritte nachvollziehbarer machen. Zugleich entsteht ein Problem, wenn Formulare unverständlich sind oder technische Störungen den Zugang zu grundlegenden Leistungen verhindern.",
    "Gute Digitalisierung beginnt daher mit der Vereinfachung von Verfahren. Behörden sollten Informationen klar strukturieren, barrierearme Zugänge anbieten und persönliche Unterstützung bereitstellen. Auch Datenschutz und nachvollziehbare Zuständigkeiten sind unverzichtbar, denn fehlerhafte Angaben können weitreichende Folgen haben.",
    "Eine erfolgreiche Reform lässt sich nicht allein an der Zahl digitalisierter Formulare messen. Entscheidend ist, ob Bürgerinnen und Bürger ihre Anliegen schneller, verständlicher und verlässlich erledigen können. Technik ist dabei ein Mittel, kein Selbstzweck."
  ],
  [
    "Eine alternde Gesellschaft verändert den Bedarf an Pflege, Wohnraum und öffentlicher Infrastruktur. Häufig wird der demografische Wandel ausschließlich als Belastung beschrieben. Damit geraten die Erfahrungen, Kompetenzen und Beiträge älterer Menschen leicht aus dem Blick.",
    "Für eine gerechte Planung müssen unterschiedliche Lebenslagen berücksichtigt werden. Nicht alle älteren Menschen benötigen dieselbe Unterstützung; gleichzeitig können Angehörige durch Pflegeaufgaben stark belastet werden. Barrierearme Wohnungen, flexible Arbeitsmodelle und zugängliche Gesundheitsdienste können verschiedene Generationen entlasten.",
    "Demografischer Wandel verlangt deshalb mehr als höhere Ausgaben in einzelnen Bereichen. Er erfordert langfristige Zusammenarbeit zwischen Kommunen, Betrieben und sozialen Einrichtungen. Ziel ist eine Gesellschaft, in der Teilhabe nicht vom Lebensalter abhängt."
  ]
];

export const C1_READING_PRACTICE = Object.freeze(Object.fromEntries(
  PASSAGES.map((paragraphs, index) => {
    const day = index + 1;
    const profile = getC1ContentProfile(day);
    if (!profile || paragraphs.length < 3) {
      throw new Error("Incomplete Falowen C1 reading source for day " + day);
    }
    return [day, Object.freeze({
      title: getC1CanonicalTitle(day),
      text: paragraphs,
      format: "C1 Lesen – Analyse und Textverständnis (Freitext)",
      source: "Falowen C1 self-study original practice",
      questions: [
        { question: "Welche Hauptthese vertritt der Text? Begründen Sie Ihre Antwort durch eine Textstelle.", options: [] },
        { question: "Welchen Zielkonflikt oder welche Einschränkung erläutert der zweite Absatz?", options: [] },
        { question: "Wie wird die Schlussfolgerung im letzten Absatz begründet?", options: [] },
        { question: "Welche unterschiedliche Verantwortung weist der Text Einzelnen und Institutionen zu? Falls keine Unterscheidung vorliegt, erläutern Sie das am Text.", options: [] },
      ],
    })];
  }),
));
export default C1_READING_PRACTICE;
