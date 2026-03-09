import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const chipStyle = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  fontSize: 13,
  fontWeight: 700,
};

const softBox = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  background: "#f8fafc",
  lineHeight: 1.7,
};

const noteBox = {
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  padding: 14,
  background: "#eff6ff",
  lineHeight: 1.7,
};

const warningBox = {
  border: "1px solid #fecaca",
  background: "#fff1f2",
  borderLeft: "6px solid #ef4444",
  borderRadius: 12,
  padding: 14,
  lineHeight: 1.7,
};

const promptCard = {
  border: "1px solid #dbeafe",
  borderRadius: 14,
  padding: 14,
  background: "#eff6ff",
  fontWeight: 700,
  lineHeight: 1.6,
};

const answerCard = {
  border: "1px dashed #cbd5e1",
  borderRadius: 14,
  padding: 14,
  background: "#ffffff",
  minHeight: 88,
  lineHeight: 1.7,
};

const practiceWrapStyle = {
  display: "grid",
  gap: 12,
};

const thStyle = {
  border: "1px solid #d1d5db",
  padding: 10,
  textAlign: "left",
  background: "#f9fafb",
  verticalAlign: "top",
};

const tdStyle = {
  border: "1px solid #d1d5db",
  padding: 10,
  verticalAlign: "top",
  lineHeight: 1.6,
};

const heroSrc =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80";

const ImageBreak = ({ src, alt, title, subtitle }) => (
  <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        width: "100%",
        height: "clamp(200px, 30vw, 340px)",
        objectFit: "cover",
        display: "block",
      }}
    />
    <div style={{ padding: 14, display: "grid", gap: 4 }}>
      <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
      <div style={{ opacity: 0.9, lineHeight: 1.6 }}>{subtitle}</div>
    </div>
  </div>
);

const TableScroll = ({ caption, children }) => (
  <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
    <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 560 }}>
      {caption ? (
        <caption
          style={{
            textAlign: "left",
            paddingBottom: 10,
            fontWeight: 800,
          }}
        >
          {caption}
        </caption>
      ) : null}
      {children}
    </table>
  </div>
);

const PracticeCard = ({ title, instruction, children }) => (
  <div
    style={{
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      padding: 14,
      background: "#fff",
      display: "grid",
      gap: 12,
    }}
  >
    <div style={{ fontWeight: 900, fontSize: 17 }}>{title}</div>
    {instruction ? <div style={{ lineHeight: 1.7 }}>{instruction}</div> : null}
    {children}
  </div>
);

const FormingBasicStatementsPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 10 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 Practice Book – Day 4
        </h1>
        <p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>
          Topic: countries, cities, direction words, and simple past forms with{" "}
          <strong>sein</strong> and <strong>haben</strong>.
        </p>
      </header>

      <ImageBreak
        src={heroSrc}
        alt="Students learning grammar"
        title="Today’s lesson"
        subtitle="Today we practise how to say where a city is, where someone comes from, where someone is going, and how to see the difference between present and past."
      />

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Lesson at a glance</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span style={chipStyle}>Präsens = Present</span>
          <span style={chipStyle}>Perfekt = Present Perfect</span>
          <span style={chipStyle}>Präteritum = Simple Past</span>
          <span style={chipStyle}>Futur = Future</span>
        </div>

        <div style={softBox}>
          <strong>Important for Day 4:</strong> Do not worry if everything is
          still new. You are only on your fourth day, so the goal today is to
          understand the main ideas and copy simple sentence patterns correctly.
          <br />
          <br />
          <strong>Today we focus on:</strong> <em>Präteritum</em>. This is the
          simple past in German. You will see it especially with{" "}
          <strong>sein</strong> and <strong>haben</strong>.
        </div>

        <TableScroll caption="German tense names with English translation">
          <thead>
            <tr>
              <th style={thStyle}>German</th>
              <th style={thStyle}>English</th>
              <th style={thStyle}>Easy meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Präsens</td>
              <td style={tdStyle}>Present</td>
              <td style={tdStyle}>I live / I am</td>
            </tr>
            <tr>
              <td style={tdStyle}>Perfekt</td>
              <td style={tdStyle}>Present Perfect</td>
              <td style={tdStyle}>I have lived / I have gone</td>
            </tr>
            <tr>
              <td style={tdStyle}>Präteritum</td>
              <td style={tdStyle}>Simple Past</td>
              <td style={tdStyle}>I lived / I was / I had</td>
            </tr>
            <tr>
              <td style={tdStyle}>Futur</td>
              <td style={tdStyle}>Future</td>
              <td style={tdStyle}>I will live / I will go</td>
            </tr>
          </tbody>
        </TableScroll>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>sein and haben: present and past</h2>

        <div style={softBox}>
          In A1, two very important verbs are <strong>sein</strong> (to be) and{" "}
          <strong>haben</strong> (to have).
          <br />
          <br />
          In the present, we say:
          <br />
          <strong>ich bin</strong>, <strong>ich habe</strong>
          <br />
          In the past, we say:
          <br />
          <strong>ich war</strong>, <strong>ich hatte</strong>
          <br />
          <br />
          These forms are very common, so students should begin to recognize
          them early.
        </div>

        <TableScroll caption="Conjugation comparison">
          <thead>
            <tr>
              <th style={thStyle}>Pronoun</th>
              <th style={thStyle}>sein (Präsens)</th>
              <th style={thStyle}>sein (Präteritum)</th>
              <th style={thStyle}>haben (Präsens)</th>
              <th style={thStyle}>haben (Präteritum)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>ich</td>
              <td style={tdStyle}>bin</td>
              <td style={tdStyle}>war</td>
              <td style={tdStyle}>habe</td>
              <td style={tdStyle}>hatte</td>
            </tr>
            <tr>
              <td style={tdStyle}>du</td>
              <td style={tdStyle}>bist</td>
              <td style={tdStyle}>warst</td>
              <td style={tdStyle}>hast</td>
              <td style={tdStyle}>hattest</td>
            </tr>
            <tr>
              <td style={tdStyle}>er / sie / es</td>
              <td style={tdStyle}>ist</td>
              <td style={tdStyle}>war</td>
              <td style={tdStyle}>hat</td>
              <td style={tdStyle}>hatte</td>
            </tr>
            <tr>
              <td style={tdStyle}>wir</td>
              <td style={tdStyle}>sind</td>
              <td style={tdStyle}>waren</td>
              <td style={tdStyle}>haben</td>
              <td style={tdStyle}>hatten</td>
            </tr>
            <tr>
              <td style={tdStyle}>ihr</td>
              <td style={tdStyle}>seid</td>
              <td style={tdStyle}>wart</td>
              <td style={tdStyle}>habt</td>
              <td style={tdStyle}>hattet</td>
            </tr>
            <tr>
              <td style={tdStyle}>sie / Sie</td>
              <td style={tdStyle}>sind</td>
              <td style={tdStyle}>waren</td>
              <td style={tdStyle}>haben</td>
              <td style={tdStyle}>hatten</td>
            </tr>
          </tbody>
        </TableScroll>

        <div style={noteBox}>
          <strong>Examples:</strong>
          <br />
          Heute <strong>bin</strong> ich in der Schule. = Today I am at school.
          <br />
          Gestern <strong>war</strong> ich in der Schule. = Yesterday I was at
          school.
          <br />
          Heute <strong>habe</strong> ich Unterricht. = Today I have class.
          <br />
          Gestern <strong>hatte</strong> ich Unterricht. = Yesterday I had
          class.
        </div>

        <PracticeCard
          title="Practice 1"
          instruction="Complete the sentences with the correct form of sein or haben. This practice is designed to be easy to read on phone."
        >
          <div style={practiceWrapStyle}>
            <div style={promptCard}>1. Ich ___ heute in Accra.</div>
            <div style={answerCard}></div>

            <div style={promptCard}>2. Gestern ich ___ in Kumasi.</div>
            <div style={answerCard}></div>

            <div style={promptCard}>3. Wir ___ heute Unterricht.</div>
            <div style={answerCard}></div>

            <div style={promptCard}>4. Letzte Woche wir ___ keinen Unterricht.</div>
            <div style={answerCard}></div>
          </div>
        </PracticeCard>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>liegen = to be located</h2>

        <div style={softBox}>
          We use <strong>liegen</strong> to say where a city or place is
          located.
          <br />
          <br />
          First, learn the four direction words:
          <br />
          <strong>der Osten</strong> = east
          <br />
          <strong>der Westen</strong> = west
          <br />
          <strong>der Süden</strong> = south
          <br />
          <strong>der Norden</strong> = north
        </div>

        <div style={noteBox}>
          <strong>Main question:</strong> <em>Wo liegt ... ?</em>
          <br />
          This means: <strong>Where is ... located?</strong>
        </div>

        <TableScroll caption="Examples with translation">
          <tbody>
            <tr>
              <td style={tdStyle}>Berlin liegt im Osten von Deutschland.</td>
              <td style={tdStyle}>Berlin is in the east of Germany.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Köln liegt im Westen von Deutschland.</td>
              <td style={tdStyle}>Cologne is in the west of Germany.</td>
            </tr>
            <tr>
              <td style={tdStyle}>München liegt im Süden von Deutschland.</td>
              <td style={tdStyle}>Munich is in the south of Germany.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Hamburg liegt im Norden von Deutschland.</td>
              <td style={tdStyle}>Hamburg is in the north of Germany.</td>
            </tr>
          </tbody>
        </TableScroll>

        <PracticeCard
          title="Practice 2"
          instruction="Write full sentences. Use the model sentence to help you."
        >
          <div style={noteBox}>
            <strong>Model:</strong> Berlin liegt im Osten von Deutschland.
          </div>

          <div style={practiceWrapStyle}>
            <div style={promptCard}>1. Wo liegt Hamburg?</div>
            <div style={answerCard}></div>

            <div style={promptCard}>2. Wo liegt München?</div>
            <div style={answerCard}></div>

            <div style={promptCard}>
              3. Write one sentence about a city in your country.
            </div>
            <div style={answerCard}></div>
          </div>
        </PracticeCard>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>wo, woher, wohin</h2>

        <div style={softBox}>
          These three question words are very important.
          <br />
          <br />
          <strong>wo</strong> asks about location
          <br />
          <strong>woher</strong> asks about origin
          <br />
          <strong>wohin</strong> asks about direction
        </div>

        <TableScroll caption="Meaning and use">
          <thead>
            <tr>
              <th style={thStyle}>Word</th>
              <th style={thStyle}>Meaning</th>
              <th style={thStyle}>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>wo</td>
              <td style={tdStyle}>where</td>
              <td style={tdStyle}>location</td>
            </tr>
            <tr>
              <td style={tdStyle}>woher</td>
              <td style={tdStyle}>where from</td>
              <td style={tdStyle}>origin</td>
            </tr>
            <tr>
              <td style={tdStyle}>wohin</td>
              <td style={tdStyle}>where to</td>
              <td style={tdStyle}>direction / destination</td>
            </tr>
          </tbody>
        </TableScroll>

        <TableScroll caption="Useful patterns with English translation">
          <tbody>
            <tr>
              <td style={tdStyle}>Wo bist du? – Ich bin in der Schule.</td>
              <td style={tdStyle}>Where are you? – I am at school.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Woher kommst du? – Ich komme aus Ghana.</td>
              <td style={tdStyle}>Where are you from? – I come from Ghana.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Wohin fährst du? – Ich fahre nach Berlin.</td>
              <td style={tdStyle}>Where are you going? – I am going to Berlin.</td>
            </tr>
          </tbody>
        </TableScroll>

        <PracticeCard
          title="Practice 3"
          instruction="Read the question carefully. Then answer with a full sentence."
        >
          <div style={practiceWrapStyle}>
            <div style={promptCard}>1. Wo bist du?</div>
            <div style={answerCard}></div>

            <div style={promptCard}>2. Woher kommst du?</div>
            <div style={answerCard}></div>

            <div style={promptCard}>3. Wohin gehst du heute?</div>
            <div style={answerCard}></div>
          </div>
        </PracticeCard>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>nach vs in</h2>

        <div style={softBox}>
          This is the easy rule for A1:
          <br />
          <br />
          Use <strong>nach</strong> for cities and countries with{" "}
          <strong>no article</strong>.
          <br />
          Example: <strong>nach Ghana</strong>, <strong>nach Deutschland</strong>,{" "}
          <strong>nach Berlin</strong>
          <br />
          <br />
          Use <strong>in + article</strong> for countries that have an article.
          <br />
          Example: <strong>in die Schweiz</strong>, <strong>in die USA</strong>,{" "}
          <strong>in den Iran</strong>
        </div>

        <div style={noteBox}>
          <strong>Why?</strong>
          <br />
          Some countries stand alone without an article, for example:
          <strong> Deutschland</strong>, <strong>Ghana</strong>,{" "}
          <strong>Italien</strong>.
          <br />
          So we use <strong>nach</strong>.
          <br />
          <br />
          Some countries use an article:
          <strong> die Schweiz</strong>, <strong>die Türkei</strong>,{" "}
          <strong>die USA</strong>, <strong>der Iran</strong>.
          <br />
          So we use <strong>in + article</strong>.
        </div>

        <TableScroll caption="Direction: wohin?">
          <thead>
            <tr>
              <th style={thStyle}>No article → nach</th>
              <th style={thStyle}>With article → in + article</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Ich fliege nach Deutschland.</td>
              <td style={tdStyle}>Ich fliege in die Schweiz.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Wir fahren nach Italien.</td>
              <td style={tdStyle}>Wir reisen in die USA.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Sie fährt nach Ghana.</td>
              <td style={tdStyle}>Er fährt in den Iran.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Ich fahre nach Berlin.</td>
              <td style={tdStyle}>Wir fahren in die Türkei.</td>
            </tr>
          </tbody>
        </TableScroll>

        <TableScroll caption="Origin and location with article countries">
          <tbody>
            <tr>
              <td style={tdStyle}>
                Woher kommst du? – Ich komme aus der Schweiz.
              </td>
              <td style={tdStyle}>I come from Switzerland.</td>
            </tr>
            <tr>
              <td style={tdStyle}>
                Wo wohnst du? – Ich wohne in der Schweiz.
              </td>
              <td style={tdStyle}>I live in Switzerland.</td>
            </tr>
            <tr>
              <td style={tdStyle}>
                Woher kommt ihr? – Wir kommen aus den USA.
              </td>
              <td style={tdStyle}>We come from the USA.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Wo seid ihr? – Wir sind in den USA.</td>
              <td style={tdStyle}>We are in the USA.</td>
            </tr>
          </tbody>
        </TableScroll>

        <PracticeCard
          title="Practice 4"
          instruction="Choose the correct form and write the full sentence."
        >
          <div style={practiceWrapStyle}>
            <div style={promptCard}>1. Ich fliege ___ Deutschland.</div>
            <div style={answerCard}></div>

            <div style={promptCard}>2. Wir reisen ___ Schweiz.</div>
            <div style={answerCard}></div>

            <div style={promptCard}>3. Er fährt ___ Iran.</div>
            <div style={answerCard}></div>

            <div style={promptCard}>4. Sie fährt ___ Accra.</div>
            <div style={answerCard}></div>
          </div>
        </PracticeCard>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Irregular verbs with vowel change</h2>

        <div style={softBox}>
          German vowels are:
          <br />
          <strong>a, e, i, o, u</strong>
          <br />
          <br />
          In some verbs, the vowel changes in the <strong>du</strong> form and
          in the <strong>er / sie / es</strong> form.
          <br />
          <br />
          This is why:
          <br />
          <strong>ich fahre</strong> but <strong>du fährst</strong>
          <br />
          <strong>ich spreche</strong> but <strong>du sprichst</strong>
        </div>

        <TableScroll caption="Common vowel changes">
          <thead>
            <tr>
              <th style={thStyle}>Verb</th>
              <th style={thStyle}>ich</th>
              <th style={thStyle}>du</th>
              <th style={thStyle}>er / sie / es</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>fahren</td>
              <td style={tdStyle}>fahre</td>
              <td style={tdStyle}>fährst</td>
              <td style={tdStyle}>fährt</td>
            </tr>
            <tr>
              <td style={tdStyle}>sprechen</td>
              <td style={tdStyle}>spreche</td>
              <td style={tdStyle}>sprichst</td>
              <td style={tdStyle}>spricht</td>
            </tr>
            <tr>
              <td style={tdStyle}>essen</td>
              <td style={tdStyle}>esse</td>
              <td style={tdStyle}>isst</td>
              <td style={tdStyle}>isst</td>
            </tr>
            <tr>
              <td style={tdStyle}>nehmen</td>
              <td style={tdStyle}>nehme</td>
              <td style={tdStyle}>nimmst</td>
              <td style={tdStyle}>nimmt</td>
            </tr>
          </tbody>
        </TableScroll>

        <PracticeCard
          title="Practice 5"
          instruction="Complete each sentence with the correct verb form."
        >
          <div style={practiceWrapStyle}>
            <div style={promptCard}>1. Du ___ nach Berlin. (fahren)</div>
            <div style={answerCard}></div>

            <div style={promptCard}>2. Er ___ Deutsch. (sprechen)</div>
            <div style={answerCard}></div>

            <div style={promptCard}>3. Sie ___ Pizza. (essen)</div>
            <div style={answerCard}></div>

            <div style={promptCard}>4. Du ___ den Bus. (nehmen)</div>
            <div style={answerCard}></div>
          </div>
        </PracticeCard>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>man vs Mann</h2>

        <div style={warningBox}>
          <strong>Common mistake:</strong> <em>man</em> is a pronoun, so it is
          written with a small letter.
          <br />
          <em>Mann</em> is a noun, so it is written with a capital letter.
          <br />
          <br />
          Correct:
          <strong> Man spricht hier Deutsch.</strong>
          <br />
          Not:
          <strong> Mann spricht hier Deutsch.</strong>
        </div>

        <div style={softBox}>
          <strong>Difference:</strong>
          <br />
          <strong>man</strong> = people in general
          <br />
          <strong>Mann</strong> = a man
          <br />
          <br />
          Example:
          <br />
          <strong>Man kann hier gut essen.</strong> = People can eat well here.
          <br />
          <strong>Der Mann ist Lehrer.</strong> = The man is a teacher.
        </div>

        <TableScroll caption="A1 examples with translation">
          <tbody>
            <tr>
              <td style={tdStyle}>Man spricht hier Deutsch.</td>
              <td style={tdStyle}>People speak German here.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Der Mann heißt Simon.</td>
              <td style={tdStyle}>The man’s name is Simon.</td>
            </tr>
          </tbody>
        </TableScroll>

        <TableScroll caption="Conjugation with man (using essen)">
          <tbody>
            <tr>
              <td style={tdStyle}>ich esse</td>
            </tr>
            <tr>
              <td style={tdStyle}>du isst</td>
            </tr>
            <tr>
              <td style={tdStyle}>er / sie / es / man isst</td>
            </tr>
            <tr>
              <td style={tdStyle}>wir essen</td>
            </tr>
            <tr>
              <td style={tdStyle}>ihr esst</td>
            </tr>
            <tr>
              <td style={tdStyle}>sie / Sie essen</td>
            </tr>
          </tbody>
        </TableScroll>

        <PracticeCard
          title="Practice 6"
          instruction="Choose man or Mann."
        >
          <div style={practiceWrapStyle}>
            <div style={promptCard}>1. ___ spricht hier Deutsch.</div>
            <div style={answerCard}></div>

            <div style={promptCard}>2. Der ___ kommt aus Berlin.</div>
            <div style={answerCard}></div>

            <div style={promptCard}>
              3. In Deutschland spricht ___ Deutsch.
            </div>
            <div style={answerCard}></div>
          </div>
        </PracticeCard>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Final speaking and writing practice</h2>

        <div style={softBox}>
          Try to answer with short, correct A1 sentences. You do not need long
          answers.
        </div>

        <div style={practiceWrapStyle}>
          <div style={promptCard}>1. Wo liegt Berlin?</div>
          <div style={answerCard}></div>

          <div style={promptCard}>2. Woher kommst du?</div>
          <div style={answerCard}></div>

          <div style={promptCard}>3. Wohin gehst du morgen?</div>
          <div style={answerCard}></div>

          <div style={promptCard}>4. Wo warst du gestern?</div>
          <div style={answerCard}></div>

          <div style={promptCard}>5. Hattest du gestern Unterricht?</div>
          <div style={answerCard}></div>
        </div>
      </section>
    </main>
  );
};

export default memo(FormingBasicStatementsPage);
