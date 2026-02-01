const admin = require("firebase-admin");

const projectId =
  process.env.GCLOUD_PROJECT ||
  process.env.GCP_PROJECT ||
  process.env.FIREBASE_PROJECT_ID ||
  process.env.PROJECT_ID ||
  undefined;

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId,
});

const db = admin.firestore();

const announcements = [
  {
    title: "Falowen B2 & C1 Courses: The Daily Self-Learning Routine Behind Them",
    message:
      "Read the daily self-learning routine that powers the Falowen B2 & C1 courses.",
    linkUrl: "https://blog.falowen.app/falowen-b2-c1-course-concept/",
    language: "all",
    audience: "all",
    className: "",
  },
  {
    title: "Falowen Now Has a French Course 🇫🇷",
    message:
      "We just launched a full French course track. See what’s inside and how to join.",
    linkUrl: "https://blog.falowen.app/falowen-french-course-announcement/",
    language: "all",
    audience: "all",
    className: "",
  },
  {
    title: "Introducing Study Buddy in Falowen: Your Quick-Help Learning Companion",
    message:
      "Meet Study Buddy — your quick-help learning companion in Falowen.",
    linkUrl: "https://blog.falowen.app/study-buddy-falowen/",
    language: "all",
    audience: "all",
    className: "",
  },
  {
    title: "Goethe Exam Registration Opens Tonight (All Levels)",
    message:
      "Goethe-Institut exam registration for all levels opens tomorrow at 12:00 a.m. (midnight tonight), Monday, 2 February 2026 (Ghana time). To register, visit the Falowen Exam File page and click Register. This will redirect you to the Goethe exam registration page for your current level. You must create an account and enter your personal details to complete the registration. Kindly register immediately once the portal opens. Tutors cannot register on your behalf because each student must create their own account and submit their own information. Thank you.",
    linkUrl: "https://www.falowen.app/campus/examFile",
    language: "all",
    audience: "all",
    className: "",
  },
];

const seedAnnouncements = async () => {
  const batch = db.batch();
  const collectionRef = db.collection("announcements");

  announcements.forEach((announcement) => {
    const docRef = collectionRef.doc();
    batch.set(docRef, {
      ...announcement,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
};

seedAnnouncements()
  .then(() => {
    console.log("Seeded announcements into Firestore.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed announcements.", error);
    process.exit(1);
  });
