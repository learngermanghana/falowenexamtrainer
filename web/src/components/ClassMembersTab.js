import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, db, getDocs, isFirebaseConfigured, query, where } from "../firebase";
import { styles } from "../styles";

const ClassMembersTab = () => {
  const { studentProfile, saveStudentProfile } = useAuth();
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState("");
  const [biographyDraft, setBiographyDraft] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [isSavingBio, setIsSavingBio] = useState(false);

  useEffect(() => {
    setBiographyDraft(studentProfile?.biography || "");
  }, [studentProfile?.biography]);

  const loadMembers = useCallback(async () => {
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
        where("className", "==", studentProfile.className)
      );
      const snapshot = await getDocs(q);
      const nextMembers = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          name: data.name || data.email || "Student",
          email: data.email || "",
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
  }, [studentProfile?.className, studentProfile?.level]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleSaveBiography = (event) => {
    event.preventDefault();
    setIsSavingBio(true);
    setSaveStatus("");

    saveStudentProfile({ biography: biographyDraft.trim() })
      .then(async () => {
        setSaveStatus("Biography saved to Firebase. Your classmates will see the latest update.");
        await loadMembers();
      })
      .catch((saveError) => {
        const message = saveError instanceof Error ? saveError.message : "Could not save biography. Please try again.";
        setSaveStatus(message);
      })
      .finally(() => setIsSavingBio(false));
  };

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
            onChange={(event) => setBiographyDraft(event.target.value)}
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
            Invite classmates to add their biography in this tab. Once everyone adds theirs, you will see them here.
          </p>
        </div>
      ) : null}

      {!loadingMembers && !membersError
        ? members.map((member) => (
            <div key={member.id} style={{ ...styles.card, margin: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div style={{ display: "grid", gap: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{member.name}</div>
                  <div style={{ fontSize: 13, color: "#4b5563" }}>{member.email}</div>
                </div>
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
