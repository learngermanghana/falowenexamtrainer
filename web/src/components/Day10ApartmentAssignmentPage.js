*** Begin Patch
*** Update File: web/src/components/Day10ApartmentAssignmentPage.js
@@ const Day10ApartmentAssignmentPage = () => {
   const navigate = useNavigate();
@@
   return (
     <div style={{ ...styles.container, display: "grid", gap: 16 }}>
       <div style={{ ...styles.card, display: "grid", gap: 8 }}>
         <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>Back to Course</button>
-        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 10 Assignment: Die Wohnung (The Apartment)</h1>
-        <p style={{ ...styles.subtitle, margin: 0 }}>Teil 1–3 — Vocabulary, reading comprehension, and listening practice.</p>
-
-        {/* A brief instruction telling students what this page covers */}
-        {/* This line can be removed if not needed */}
-        <p style={{ margin: 0 }}>
-          Complete the following exercises about an apartment. This assignment will help you practice your
-          vocabulary and sentence structures in German, focusing on rooms and furniture in an apartment.
-        </p>
+        {/* Updated heading and instructions */}
+        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 10 – Die Wohnung (The Apartment) Assignment</h1>
+        {/* Provide a succinct overview so students know what to expect */}
+        <p style={{ ...styles.subtitle, margin: 0 }}>Teil 1–3 — Vocabulary, reading comprehension, and listening practice</p>
+        <p style={{ margin: 0 }}>
+          Complete the following exercises about an apartment. This assignment will help you practice your vocabulary and sentence structures in German, focusing on rooms and furniture in an apartment.
+        </p>
@@
       </div>
@@
       <WorkbookSection
-        title="Teil 1: Vocabulary Matching"
-        intro="Match the German words with their English meanings. Copy the list if you want to work offline."
+        title="Teil 1: Vocabulary Matching"
+        intro="Match the German words with their English meanings. Copy the list if you want to work offline."
@@
       <WorkbookSection
-        title="Teil 2: Passage — Die Wohnung"
-        intro="Read the passage and answer the multiple-choice questions."
+        title="Teil 2: Passage — Die Wohnung"
+        intro="Read the passage and answer the multiple-choice questions."
@@
       <Section title="Teil 3: Listening Comprehension — Die Wohnung">
-        <p style={{ margin: 0 }}>
-          Listen to the passages and answer the multiple-choice questions in the assignment form below.
-        </p>
+        <p style={{ margin: 0 }}>
+          Instructions: Listen to the following short passages about an apartment. After listening, answer the multiple-choice questions that follow. Each question has four options (a, b, c, and d). Select the correct answer for each question, then record your answers in the assignment form below.
+        </p>
*** End Patch
