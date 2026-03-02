import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const sectionStyle = { ...styles.card, display: "grid", gap: 10 };
const tableCellStyle = {
  border: "1px solid #d1d5db",
  padding: 8,
  verticalAlign: "top",
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  display: "grid",
  gap: 6,
};

const exampleBoxStyle = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 8,
};

const SingularPronounsConjugationPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          Singular Pronouns and Verb Conjugation in German
        </h1>

        <p style={{ ...styles.subtitle, margin: 0 }}>
          Day 2 Grammar Note: Alphabets and Personal Pronouns
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>What is verb conjugation?</h2>
        <p style={{ margin: 0 }}>
          Verb conjugation is the process of changing a verb form to match the subject of the
          sentence. In German, this is essential for making sure sentences are grammatically correct
          and the meaning is clear.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Regular verb endings for singular pronouns</h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 620 }}>
            <thead>
              <tr>
                <th style={tableCellStyle}>Pronoun</th>
                <th style={tableCellStyle}>Ending</th>
                <th style={tableCellStyle}>Example (kommen)</th>
                <th style={tableCellStyle}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCellStyle}>
                  <strong>ich</strong> (I)
                </td>
                <td style={tableCellStyle}>-e</td>
                <td style={tableCellStyle}>ich komme</td>
                <td style={tableCellStyle}>I come</td>
              </tr>

              <tr>
                <td style={tableCellStyle}>
                  <strong>du</strong> (you, informal)
                </td>
                <td style={tableCellStyle}>-st</td>
                <td style={tableCellStyle}>du kommst</td>
                <td style={tableCellStyle}>you come (informal)</td>
              </tr>

              <tr>
                <td style={tableCellStyle}>
                  <strong>er/sie/es</strong> (he/she/it)
                </td>
                <td style={tableCellStyle}>-t</td>
                <td style={tableCellStyle}>er kommt</td>
                <td style={tableCellStyle}>he comes</td>
              </tr>

              <tr>
                <td style={tableCellStyle}>
                  <strong>Sie</strong> (you, formal)
                </td>
                <td style={tableCellStyle}>-en</td>
                <td style={tableCellStyle}>Sie kommen</td>
                <td style={tableCellStyle}>you come (formal)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Singular pronouns</h2>
        <ul style={listStyle}>
          <li>
            <strong>ich</strong> (I)
          </li>
          <li>
            <strong>du</strong> (you - informal)
          </li>
          <li>
            <strong>er/sie/es</strong> (he/she/it)
          </li>
          <li>
            <strong>Sie</strong> (you - formal)
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Verb conjugation: heißen (to be called)</h2>

        <div style={exampleBoxStyle}>
          <div>
            <strong>ich heiße</strong> (I am called)
            <div>Example: Ich heiße Felix. (I am called Felix.)</div>
          </div>

          <div>
            <strong>du heißt</strong> (you are called - informal)
            <div>Example: Du heißt Anna. (You are called Anna.)</div>
            <div>
              Note: We write <strong>heißt</strong>, not <strong>heißst</strong>. The letter <strong>ß</strong>
              already carries the same "s" sound, so German does not add another <strong>s</strong> before
              <strong>-t</strong> in this form.
            </div>
          </div>

          <div>
            <strong>er/sie/es heißt</strong> (he/she/it is called)
            <div>Example: Er heißt Max. (He is called Max.)</div>
          </div>

          <div>
            <strong>Sie heißen</strong> (you are called - formal)
            <div>Example: Sie heißen Frau Müller. (You are called Mrs. Müller.)</div>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Verb conjugation: kommen (to come)</h2>

        <div style={exampleBoxStyle}>
          <div>
            <strong>ich komme</strong> (I come)
            <div>Example: Ich komme aus Deutschland. (I come from Germany.)</div>
          </div>

          <div>
            <strong>du kommst</strong> (you come - informal)
            <div>Example: Du kommst aus Spanien. (You come from Spain.)</div>
          </div>

          <div>
            <strong>er/sie/es kommt</strong> (he/she/it comes)
            <div>Example: Sie kommt aus Italien. (She comes from Italy.)</div>
          </div>

          <div>
            <strong>Sie kommen</strong> (you come - formal)
            <div>Example: Sie kommen aus Frankreich. (You come from France.)</div>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Verb conjugation: wohnen (to live / reside)</h2>

        <div style={exampleBoxStyle}>
          <div>
            <strong>ich wohne</strong> (I live)
            <div>Example: Ich wohne in Berlin. (I live in Berlin.)</div>
          </div>

          <div>
            <strong>du wohnst</strong> (you live - informal)
            <div>Example: Du wohnst in München. (You live in Munich.)</div>
          </div>

          <div>
            <strong>er/sie/es wohnt</strong> (he/she/it lives)
            <div>Example: Er wohnt in Hamburg. (He lives in Hamburg.)</div>
          </div>

          <div>
            <strong>Sie wohnen</strong> (you live - formal)
            <div>Example: Sie wohnen in Wien. (You live in Vienna.)</div>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Notes on personal pronouns</h2>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>
            <strong>ich</strong>: Refers to the speaker (I).
          </li>
          <li>
            <strong>du</strong>: Used for informal situations (friends, family, peers).
          </li>
          <li>
            <strong>er/sie/es</strong>: Refers to he/she/it.
          </li>
          <li>
            <strong>Sie</strong>: Used for formal situations (strangers, superiors, professional settings).
          </li>
        </ol>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Why is it important to conjugate verbs?</h2>
        <ul style={listStyle}>
          <li>
            <strong>Clarity</strong>: Proper verb conjugation makes the subject clear.
          </li>
          <li>
            <strong>Accuracy</strong>: Different pronouns need different verb forms. Wrong forms can cause
            misunderstandings.
          </li>
          <li>
            <strong>Respect</strong>: Choosing <strong>du</strong> vs. <strong>Sie</strong> matters in German.
            Correct forms support politeness in social and professional situations.
          </li>
          <li>
            <strong>Grammar</strong>: Verb conjugation is a core part of German sentence building.
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Usage in sentences</h2>
        <ul style={listStyle}>
          <li>Always start a sentence with a capital letter and end with a period.</li>
          <li>The verb usually comes in the second position in a sentence.</li>
          <li>
            The formal <strong>Sie</strong> is always capitalized, regardless of its position in the sentence.
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Formal vs. informal</h2>
        <div style={{ display: "grid", gap: 10 }}>
          <div style={exampleBoxStyle}>
            <strong>du</strong>
            <div>Use for friends, family, and peers (informal).</div>
          </div>

          <div style={exampleBoxStyle}>
            <strong>Sie</strong>
            <div>
              Use for strangers, superiors, and in professional contexts (formal). It shows respect and politeness.
            </div>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Practice sentences</h2>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          <li>Ich heiße Maria. (My name is Maria.)</li>
          <li>Du kommst aus Frankreich. (You come from France - informal.)</li>
          <li>Er wohnt in Wien. (He lives in Vienna.)</li>
          <li>Wie heißt du? (What is your name? - informal.)</li>
          <li>Woher kommst du? (Where do you come from? - informal.)</li>
          <li>Wo wohnst du? (Where do you live? - informal.)</li>
          <li>Wie heißen Sie? (What is your name? - formal.)</li>
          <li>Woher kommen Sie? (Where do you come from? - formal.)</li>
          <li>Wo wohnen Sie? (Where do you live? - formal.)</li>
        </ol>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>How to say your name using ich, du, and Sie</h2>

        <div style={{ display: "grid", gap: 10 }}>
          <div style={exampleBoxStyle}>
            <strong>1) Using ich (I)</strong>
            <div>German: Ich heiße [Name].</div>
            <div>Example: Ich heiße Felix.</div>
            <div>English: My name is Felix.</div>
          </div>

          <div style={exampleBoxStyle}>
            <strong>2) Using du (you - informal)</strong>
            <div>German: Du heißt [Name].</div>
            <div>Example: Du heißt Anna.</div>
            <div>English: Your name is Anna.</div>
          </div>

          <div style={exampleBoxStyle}>
            <strong>3) Using Sie (you - formal)</strong>
            <div>German: Sie heißen [Name].</div>
            <div>Example: Sie heißen Herr Müller.</div>
            <div>English: Your name is Mr. Müller.</div>
          </div>
        </div>

        <div style={{ ...exampleBoxStyle, marginTop: 10 }}>
          <strong>Usage context</strong>
          <ul style={listStyle}>
            <li>
              <strong>ich</strong>: Used to introduce yourself. Example: Ich heiße Felix.
            </li>
            <li>
              <strong>du</strong>: Used to ask/tell someone’s name informally. Example: Du heißt Anna.
            </li>
            <li>
              <strong>Sie</strong>: Used in formal situations. Example: Sie heißen Frau Müller.
            </li>
          </ul>
        </div>

        <div style={{ ...exampleBoxStyle, marginTop: 10 }}>
          <strong>Importance</strong>
          <ul style={listStyle}>
            <li>
              <strong>ich</strong>: Used to talk about yourself.
            </li>
            <li>
              <strong>du</strong>: Used with friends, family, peers (informal).
            </li>
            <li>
              <strong>Sie</strong>: Used in professional settings, with strangers, or superiors (formal).
            </li>
          </ul>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ margin: 0 }}>Quick practice (multiple choice)</h2>
        <p style={{ margin: 0 }}>
          Choose the correct verb form. (Do not worry about checking answers here—students can type and submit.)
        </p>

        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
          <li>
            Ich ___ aus Deutschland.
            <div>A) kommst &nbsp; B) komme &nbsp; C) kommt</div>
          </li>

          <li>
            Du ___ in Berlin.
            <div>A) wohnst &nbsp; B) wohne &nbsp; C) wohnt</div>
          </li>

          <li>
            Er ___ Max.
            <div>A) heißen &nbsp; B) heißt &nbsp; C) heiße</div>
          </li>

          <li>
            Wie ___ Sie?
            <div>A) heißen &nbsp; B) heißt &nbsp; C) heiße</div>
          </li>
        </ol>
      </section>
    </main>
  );
};

export default memo(SingularPronounsConjugationPage);
