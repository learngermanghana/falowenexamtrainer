import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { collection, db, getDocs, isFirebaseConfigured, query, where } from "../firebase";
import { styles } from "../styles";

const ClassMembersTab = () => {
  const navigate = useNavigate();
  const { studentProfile, saveStudentProfile } = useAuth();
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState("");
  const [biographyDraft, setBiographyDraft] = useState("");
  const [isBiographyDirty, setIsBiographyDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [isSavingBio, setIsSavingBio] = useState(false);

  const isCourseBookContext = useMemo(
    () => typeof window !== "undefined" && window.location.pathname.startsWith("/campus/course"),
    [],
  );

  useEffect(() => {
    if (!isBiographyDirty) {
      setBiographyDraft(studentProfile?.biography || "");
    }
  }, [isBiographyDirty, studentProfile?.biography]);

  useEffect(() => {
    setIsBiographyDirty(false);
  }, [studentProfile?.id]);

  const loadMembers = useCallback(async () => {
    if (isCourseBookContext) {
      setLoadingMembers(false);
      return;
    }

    if (!isFirebaseConfigured || !db) {
      setMembersError("Firebase is not configured. Please add your credentials.");
      setMembers([]);
      setLoadingMembers(false);
      return;
    }

    if (!studentProfile?.level || !studentProfile?.className) {
      setMembersError("Add your level and class in the account page to view classmates.");
      setMembers([]);
      setLoadingMembers(false);
      return;
    }

    setLoadingMembers(true);
    setMembersError("");

    try {
      const studentsRef = collection(db, "students");
      const q = query(
        studentsRef,
        where("level", "==", studentProfile.level),
        where("className", "==", studentProfile.className),
      );
      const snapshot = await getDocs(q);
      const nextMembers = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          name: data.name || data.displayName || "Student",
          biography: data.biography || "",
          level: data.level || "",
          className: data.className || "",
        };
      });

      nextMembers.sort((a, b) => a.name.localeCompare(b.name));
      setMembers(nextMembers);
    } catch (err) {
      console.error("Failed to load class members", err);
      setMembersError("Could not load class members. Please try again later.");
    } finally {
      setLoadingMembers(false);
    }
  }, [isCourseBookContext, studentProfile?.className, studentProfile?.level]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleSaveBiography = (event) => {
    event.preventDefault();
    setIsSavingBio(true);
    setSaveStatus("");
    const nextBiography = biographyDraft.trim();

    saveStudentProfile({ biography: nextBiography })
      .then(async () => {
        setBiographyDraft(nextBiography);
        setIsBiographyDirty(false);
        setSaveStatus("Biography saved. Your classmates will see the latest update.");
        await loadMembers();
      })
      .catch((saveError) => {
        const message = saveError instanceof Error ? saveError.message : "Could not save biography. Please try again.";
        setSaveStatus(message);
      })
      .finally(() => setIsSavingBio(false));
  };

  if (isCourseBookContext) {
    return (
      <section
        style={{
          ...styles.card,
          display: "grid",
          gap: 10,
          border: "1px solid #c7d2fe",
          background: "#eef2ff",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, color: "#312e81" }}>Class members have moved</div>
          <p style={{ ...styles.helperText, margin: "6px 0 0", color: "#475569" }}>
            Your full class directory now lives in the class discussion area, so the Course Book stays focused on lessons.
          </p>
        </div>
        <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={() => navigate("/campus/discussion?tab=members")}>
          View classmates
        </button>
      </section>
    );
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={styles.card}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Your class biography</div>
        <p style={{ ...styles.helperText, marginTop: 0 }}>
          Update your biography here so classmates in your level and class can get to know you.
        </p>
        <form onSubmit={handleSaveBiography} style={{ display: "grid", gap: 10 }}>
          <textarea
            id="class-biography"
            style={styles.textArea}
            value={biographyDraft}
            onChange={(event) => {
              setBiographyDraft(event.target.value);
              setIsBiographyDirty(true);
            }}
            placeholder="Share a short intro, your learning goals, and what topics you enjoy."
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" style={styles.primaryButton} disabled={isSavingBio}>
              {isSavingBio ? "Saving..." : "Save biography"}
            </button>
          </div>
          {saveStatus ? <p style={{ ...styles.helperText, margin: 0 }}>{saveStatus}</p> : null}
        </form>
      </div>

      {loadingMembers ? (
        <div style={styles.card}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Loading class members ...</div>
          <p style={{ ...styles.helperText, margin: 0 }}>Pulling profiles for your group.</p>
        </div>
      ) : null}

      {!loadingMembers && membersError ? (
        <div style={{ ...styles.card, borderColor: "#fca5a5", background: "#fef2f2" }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Cannot show members</div>
          <p style={{ ...styles.helperText, margin: 0 }}>{membersError}</p>
        </div>
      ) : null}

      {!loadingMembers && !membersError && members.length === 0 ? (
        <div style={styles.card}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>No classmates found</div>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Classmates will appear here once their profiles are available.
          </p>
        </div>
      ) : null}

      {!loadingMembers && !membersError
        ? members.map((member) => (
            <div key={member.id} style={{ ...styles.card, margin: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{member.name}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={styles.badge}>Level: {member.level || "–"}</span>
                  <span style={styles.badge}>Class: {member.className || "–"}</span>
                </div>
              </div>
              <p style={{ ...styles.helperText, margin: "10px 0 0", whiteSpace: "pre-wrap" }}>
                {member.biography || "No biography yet."}
              </p>
            </div>
          ))
        : null}
    </div>
  );
};

export default ClassMembersTab;
