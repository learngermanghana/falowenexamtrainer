import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  overflow: "hidden",
  borderRadius: 12,
};

const thTdStyle = {
  padding: "10px 12px",
  border: "1px solid rgba(0,0,0,0.08)",
  textAlign: "left",
  verticalAlign: "top",
};

const softBoxStyle = {
  padding: 12,
  borderRadius: 12,
  background: "rgba(0,0,0,0.03)",
  display: "grid",
  gap: 6,
};

const SectionCard = ({ title, children }) => (
  <section style={cardStyle}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const InlineCode = ({ children }) => (
  <span
    style={{
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "0.95em",
      padding: "2px 6px",
      borderRadius: 6,
      background: "rgba(0,0,0,0.06)",
    }}
  >
    {children}
  </span>
);

const HintText = ({ children }) => (
  <p style={{ margin: 0, opacity: 0.82, fontSize: "0.95rem" }}>{children}</p>
);

const ExampleGrid = ({ items }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {items.map((item) => (
      <div
        key={item.example}
        style={{
          padding: 10,
          borderRadius: 10,
          background: "rgba(0,0,0,0.03)",
          display: "grid",
          gap: 4,
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>{item.example}</strong>
        </p>
        {item.hint && <HintText>{item.hint}</HintText>}
      </div>
    ))}
  </div>
);

const GrammarTable = ({ rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={tableStyle}>
      <thead>
        <tr style={{ background: "rgba(0,0,0,0.04)" }}>
          <th style={thTdStyle}>Nominativ</th>
          <th style={thTdStyle}>Dativ with “in” (Wo?)</th>
          <th style={thTdStyle}>Short form / example</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.base}>
            <td style={thTdStyle}>{row.base}</td>
            <td style={thTdStyle}>{row.dative}</td>
            <td style={thTdStyle}>{row.example}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PrepReferenceCard = ({ title, intro, preps, note }) => (
  <div style={{ ...softBoxStyle, gap: 12 }}>
    <h3 style={{ margin: 0 }}>{title}</h3>
    <p style={{ margin: 0 }}>{intro}</p>

    <div style={{ display: "grid", gap: 10 }}>
      {preps.map((prep) => (
        <div
          key={prep.term}
          style={{
            padding: 10,
            borderRadius: 10,
            background: "rgba(255,255,255,0.65)",
            border: "1px solid rgba(0,0,0,0.06)",
            display: "grid",
            gap: 6,
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>{prep.term}</strong> – {prep.meaning}
          </p>

          <div style={{ display: "grid", gap: 4 }}>
            {prep.examples.map((ex) => (
              <p key={ex.de} style={{ margin: 0 }}>
                <strong>{ex.de}</strong>
                <br />
                <span style={{ opacity: 0.85 }}>{ex.en}</span>
              </p>
            ))}
          </div>

          {prep.note ? <HintText>{prep.note}</HintText> : null}
        </div>
      ))}
    </div>

    {note ? <HintText>{note}</HintText> : null}
  </div>
);

const WoTreffenUnsGrammarPage = () => {
  const navigate = useNavigate();

  const dativeArticles = [
    "masculine → dem",
    "feminine → der",
    "neuter → dem",
    "plural → den",
  ];

  const twoWayPreps = ["in", "an", "auf", "vor", "hinter", "neben", "zwischen"];
  const alsoUsefulButNotTwoWay = ["bei (always dative)", "zu (always dative)"];

  const prepMeanings = [
    "in = in / inside",
    "an = at / by",
    "auf = on / at",
    "bei = at someone’s place / near (always dative)",
    "vor = in front of",
    "hinter = behind",
    "neben = next to",
    "zwischen = between",
  ];

  const grammarRows = [
    {
      base: "der Park",
      dative: "in dem Park",
      example: "im Park",
    },
    {
      base: "die Stadt",
      dative: "in der Stadt",
      example: "in der Stadt",
    },
    {
      base: "das Café",
      dative: "in dem Café",
      example: "im Café",
    },
    {
      base: "die Parks",
      dative: "in den Parks",
      example: "in den Parks",
    },
  ];

  const examplePatterns = [
    {
      example: "in dem Park → im Park",
      hint: "der Park → dem Park (masculine, dative)",
    },
    {
      example: "in der Stadt",
      hint: "die Stadt → der Stadt (feminine, dative)",
    },
    {
      example: "in dem Café → im Café",
      hint: "das Café → dem Café (neuter, dative)",
    },
    {
      example: "in den Parks",
      hint: "die Parks → den Parks (plural, dative)",
    },
    {
      example: "an dem Bahnhof → am Bahnhof",
      hint: "der Bahnhof → dem Bahnhof (masculine, dative)",
    },
    {
      example: "bei der Schule",
      hint: "die Schule → der Schule (feminine, dative)",
    },
    {
      example: "vor dem Kino",
      hint: "das Kino → dem Kino (neuter, dative)",
    },
    {
      example: "zwischen dem Café und dem Kino",
      hint: "das Café / das Kino → dem Café / dem Kino (neuter, dative)",
    },
    {
      example: "auf dem Campus",
      hint: "der Campus → dem Campus (masculine, dative)",
    },
  ];

  const contractions = [
    "in dem → im",
    "an dem → am",
    "bei dem → beim",
    "zu dem → zum",
    "zu der → zur",
  ];

  const woVsWohin = [
    {
      example: "Wo? Wir treffen uns im Café.",
      hint: "das Café → dem Café (location = dative)",
    },
    {
      example: "Wohin? Wir gehen ins Café.",
      hint: "das Café → in das Café (direction = accusative)",
    },
    {
      example: "Wo? Er ist im Park.",
      hint: "der Park → dem Park (location = dative)",
    },
    {
      example: "Wohin? Er geht in den Park.",
      hint: "der Park → in den Park (direction = accusative)",
    },
  ];

  const modelSentences = [
    {
      example: "Wir treffen uns im Café.",
      hint: "das Café → dem Café",
    },
    {
      example: "Treffen wir uns am Bahnhof?",
      hint: "der Bahnhof → dem Bahnhof",
    },
    {
      example: "Ich warte bei der Schule.",
      hint: "die Schule → der Schule",
    },
    {
      example: "Wir treffen uns vor dem Kino.",
      hint: "das Kino → dem Kino",
    },
    {
      example: "Wir treffen uns in der Stadt.",
      hint: "die Stadt → der Stadt",
    },
    {
      example: "Wir treffen uns auf dem Campus.",
      hint: "der Campus → dem Campus",
    },
  ];

  const commonMistakes = [
    "❌ in die Stadt",
    "✅ in der Stadt",
    "❌ Wir treffen uns ins Café.",
    "✅ Wir treffen uns im Café.",
    "✅ vor dem Kino / im Kino",
  ];

  const dativePreps = [
    {
      term: "mit",
      meaning: "with",
      examples: [
        {
          de: "Ich gehe mit meiner Freundin ins Kino.",
          en: "(I’m going to the cinema with my girlfriend.)",
        },
      ],
    },
    {
      term: "zu",
      meaning: "to, at",
      examples: [
        {
          de: "Ich fahre zu meiner Großmutter.",
          en: "(I’m going to my grandmother’s house.)",
        },
        {
          de: "Wir gehen zu einem Konzert.",
          en: "(We are going to a concert.)",
        },
      ],
    },
    {
      term: "bei",
      meaning: "at, with, near",
      examples: [
        {
          de: "Ich bin bei meinem Freund.",
          en: "(I’m at my friend’s house.)",
        },
        {
          de: "Ich arbeite bei einer großen Firma.",
          en: "(I work at a large company.)",
        },
      ],
    },
    {
      term: "nach",
      meaning: "after, to (cities / countries without article)",
      examples: [
        {
          de: "Wir fahren nach Berlin.",
          en: "(We are going to Berlin.)",
        },
        {
          de: "Nach der Arbeit gehe ich spazieren.",
          en: "(After work, I go for a walk.)",
        },
      ],
    },
    {
      term: "von",
      meaning: "from, of",
      examples: [
        {
          de: "Das Geschenk ist von meiner Schwester.",
          en: "(The gift is from my sister.)",
        },
        {
          de: "Ich habe viel von dir gehört.",
          en: "(I’ve heard a lot about you.)",
        },
      ],
    },
    {
      term: "seit",
      meaning: "since, for (time)",
      examples: [
        {
          de: "Ich lerne Deutsch seit einem Jahr.",
          en: "(I’ve been learning German for a year.)",
        },
        {
          de: "Seit wann hast du dieses Hobby?",
          en: "(Since when do you have this hobby?)",
        },
      ],
    },
    {
      term: "aus",
      meaning: "from, out of",
      examples: [
        {
          de: "Ich komme aus der Schweiz.",
          en: "(I’m from Switzerland.)",
        },
        {
          de: "Die Kinder sind aus dem Haus.",
          en: "(The children are out of the house.)",
        },
      ],
    },
    {
      term: "außer",
      meaning: "except for, besides",
      examples: [
        {
          de: "Alle kommen, außer Peter.",
          en: "(Everyone is coming, except Peter.)",
        },
        {
          de: "Außer dir weiß niemand davon.",
          en: "(No one knows about it except you.)",
        },
      ],
    },
    {
      term: "gegenüber",
      meaning: "opposite, across from",
      examples: [
        {
          de: "Der Park ist dem Restaurant gegenüber.",
          en: "(The park is opposite the restaurant.)",
        },
        {
          de: "Ich sitze dir gegenüber.",
          en: "(I’m sitting across from you.)",
        },
      ],
      note: "gegenüber usually comes after the noun or pronoun.",
    },
  ];

  const accusativePreps = [
    {
      term: "durch",
      meaning: "through",
      examples: [
        {
          de: "Wir gehen durch den Park.",
          en: "(We are walking through the park.)",
        },
      ],
    },
    {
      term: "für",
      meaning: "for",
      examples: [
        {
          de: "Ich habe ein Geschenk für dich.",
          en: "(I have a gift for you.)",
        },
        {
          de: "Das ist gut für die Gesundheit.",
          en: "(This is good for health.)",
        },
      ],
    },
    {
      term: "gegen",
      meaning: "against",
      examples: [
        {
          de: "Wir spielen gegen ein anderes Team.",
          en: "(We are playing against another team.)",
        },
        {
          de: "Er ist gegen die Idee.",
          en: "(He is against the idea.)",
        },
      ],
    },
    {
      term: "ohne",
      meaning: "without",
      examples: [
        {
          de: "Ich gehe nicht ohne meinen Hund spazieren.",
          en: "(I’m not going for a walk without my dog.)",
        },
        {
          de: "Kommst du auch ohne deine Freunde?",
          en: "(Are you coming without your friends?)",
        },
      ],
    },
    {
      term: "um",
      meaning: "around, at (time)",
      examples: [
        {
          de: "Wir gehen um den See spazieren.",
          en: "(We are walking around the lake.)",
        },
        {
          de: "Der Film beginnt um 8 Uhr.",
          en: "(The movie starts at 8 o’clock.)",
        },
      ],
    },
    {
      term: "bis",
      meaning: "until, up to",
      examples: [
        {
          de: "Wir bleiben bis Sonntag.",
          en: "(We are staying until Sunday.)",
        },
        {
          de: "Die Bibliothek ist bis 18 Uhr geöffnet.",
          en: "(The library is open until 6 PM.)",
        },
      ],
      note: "bis often appears without an article before time words and many place expressions.",
    },
    {
      term: "entlang",
      meaning: "along",
      examples: [
        {
          de: "Wir laufen den Fluss entlang.",
          en: "(We are walking along the river.)",
        },
        {
          de: "Wir fahren die Straße entlang.",
          en: "(We are driving along the street.)",
        },
      ],
      note: "entlang usually comes after the noun in everyday German.",
    },
  ];

  const splashImageUrl =
    "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=1800&q=80";

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 12 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          Wo möchten wir uns treffen? (2.4)
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Dative with prepositions for answering <strong>Wo?</strong>
        </p>

        <div
          style={{
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <img
            src={splashImageUrl}
            alt="Meeting place in Germany"
            loading="lazy"
            style={{
              width: "100%",
              height: 220,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </header>

      <SectionCard title="Introduction">
        <p style={{ margin: 0 }}>
          In German, some prepositions are <strong>two-way prepositions</strong>{" "}
          (Wechselpräpositionen). They can take either <strong>accusative</strong> or{" "}
          <strong>dative</strong>.
        </p>
        <p style={{ margin: 0 }}>
          We use <strong>accusative</strong> for movement or direction:{" "}
          <strong>Wohin?</strong>
        </p>
        <p style={{ margin: 0 }}>
          We use <strong>dative</strong> for place or position: <strong>Wo?</strong>
        </p>
        <p style={{ margin: 0 }}>
          Today, we focus on <strong>Wo?</strong> → <strong>Dativ</strong>.
        </p>
      </SectionCard>

      <SectionCard title="Quick rule">
        <p style={{ margin: 0 }}>
          <strong>Wo?</strong> = place / position → <strong>Dativ</strong>
        </p>
        <p style={{ margin: 0 }}>
          <strong>Wohin?</strong> = direction / movement → <strong>Akkusativ</strong>
        </p>
      </SectionCard>

      <SectionCard title="Dative articles for Wo?">
        <BulletList items={dativeArticles} />
        <p style={{ margin: 0 }}>
          Simple rule: <strong>der → dem, die → der, das → dem, die (plural) → den</strong>
        </p>
        <HintText>
          In plural dative, the noun often gets <strong>-n</strong> if possible:{" "}
          <InlineCode>in den Parks</InlineCode>, <InlineCode>bei den Freunden</InlineCode>.
        </HintText>
      </SectionCard>

      <SectionCard title="1) The key question">
        <p style={{ margin: 0 }}>
          <strong>Wo treffen wir uns?</strong> = Where are we meeting?
        </p>
        <p style={{ margin: 0 }}>
          For <strong>Wo?</strong>, we use <strong>dative</strong>.
        </p>
      </SectionCard>

      <SectionCard title="2) Useful prepositions for meeting places">
        <p style={{ margin: 0 }}>
          <strong>Two-way prepositions:</strong>{" "}
          <InlineCode>{twoWayPreps.join(" / ")}</InlineCode>
        </p>
        <p style={{ margin: 0 }}>
          <strong>Also useful, but NOT two-way:</strong>{" "}
          <InlineCode>{alsoUsefulButNotTwoWay.join(" / ")}</InlineCode>
        </p>
        <BulletList items={prepMeanings} />
      </SectionCard>

      <SectionCard title='3) "in + noun" for Wo?'>
        <p style={{ margin: 0 }}>Structure:</p>
        <p style={{ margin: 0 }}>
          <InlineCode>in + dative article + noun</InlineCode>
        </p>
        <p style={{ margin: 0 }}>
          This helps learners clearly see the article change:
        </p>

        <GrammarTable rows={grammarRows} />

        <HintText>
          Pattern: <InlineCode>der → dem</InlineCode>, <InlineCode>die → der</InlineCode>,{" "}
          <InlineCode>das → dem</InlineCode>, <InlineCode>die → den</InlineCode>
        </HintText>
      </SectionCard>

      <SectionCard title="4) More examples with gender hints">
        <ExampleGrid items={examplePatterns} />
      </SectionCard>

      <SectionCard title="5) Common contractions">
        <BulletList items={contractions} />
      </SectionCard>

      <SectionCard title="6) Wo? vs Wohin?">
        <ExampleGrid items={woVsWohin} />
        <HintText>
          <InlineCode>ins</InlineCode> = <InlineCode>in das</InlineCode>
        </HintText>
      </SectionCard>

      <SectionCard title="7) Model sentences">
        <ExampleGrid items={modelSentences} />
      </SectionCard>

      <SectionCard title="8) Mini practice">
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Wo treffen wir uns? — ___ Café</li>
          <li>Wo bist du? — ___ Stadt</li>
          <li>Wo seid ihr? — ___ Parks</li>
          <li>Wo treffen wir uns? — ___ Campus</li>
        </ul>

        <div style={{ display: "grid", gap: 4, marginTop: 6 }}>
          <p style={{ margin: 0 }}>Answers:</p>
          <HintText>
            <strong>im</strong> Café → das Café → dem Café
          </HintText>
          <HintText>
            <strong>in der</strong> Stadt → die Stadt → der Stadt
          </HintText>
          <HintText>
            <strong>in den</strong> Parks → die Parks → den Parks
          </HintText>
          <HintText>
            <strong>auf dem</strong> Campus → der Campus → dem Campus
          </HintText>
        </div>
      </SectionCard>

      <SectionCard title="9) Common mistakes">
        <div style={{ display: "grid", gap: 6 }}>
          {commonMistakes.map((line) => (
            <p key={line} style={{ margin: 0 }}>
              {line}
            </p>
          ))}
        </div>

        <div style={{ display: "grid", gap: 4, marginTop: 8 }}>
          <HintText>
            <strong>in die Stadt</strong> = direction / movement
          </HintText>
          <HintText>
            <strong>in der Stadt</strong> = location / place
          </HintText>
          <HintText>
            <strong>bei</strong> is not a two-way preposition. It is always dative:{" "}
            <InlineCode>bei der Schule</InlineCode>, <InlineCode>beim Arzt</InlineCode>
          </HintText>
        </div>
      </SectionCard>

      <SectionCard title="10) Note: Dative and Akkusativ prepositions">
        <p style={{ margin: 0 }}>
          These are <strong>fixed-case prepositions</strong>. That means they always take the
          same case.
        </p>
        <p style={{ margin: 0 }}>
          This is different from <strong>two-way prepositions</strong> like{" "}
          <InlineCode>in / an / auf</InlineCode>, which can take either dative or accusative
          depending on meaning.
        </p>

        <PrepReferenceCard
          title="Dative prepositions"
          intro="These prepositions always require the noun or pronoun after them to be in the dative case."
          preps={dativePreps}
          note='Summary: mit, zu, bei, nach, von, seit, aus, außer, gegenüber'
        />

        <PrepReferenceCard
          title="Akkusativ prepositions"
          intro="These prepositions always require the noun or pronoun after them to be in the accusative case."
          preps={accusativePreps}
          note='Important: not all accusative prepositions mean movement. Some express purpose, opposition, absence, time, or path. Summary: durch, für, gegen, ohne, um, bis, entlang'
        />
      </SectionCard>
    </main>
  );
};

export default memo(WoTreffenUnsGrammarPage);
