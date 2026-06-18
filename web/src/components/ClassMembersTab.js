import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchClassDirectoryMembers } from "../services/studentDirectory";
import { styles } from "../styles";
import { PrimaryActionBar, SectionHeader } from "./ui";

const ClassMembersTab = () => {
  const { studentProfile, saveStudentProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const compactRedirect = location.pathname.startsWith("/campus/course");
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(!compactRedirect);
  const [membersError, setMembersError] = useState("");
  const [biographyDraft, setBiographyDraft] = useState("");
  const [isBiographyDirty, setIsBiographyDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [isSavingBio, setIsSavingBio] = useState(false);

  useEffect(() => {
    if (!isBiographyDirty) {
      setBiographyDraft(studentProfile?.biography || "");
    }
  }, [isBiographyDirty, studentProfile?.biography]);

  useEffect(() => {
    setIsBiographyDirty(false);
  }, [studentProfile?.id]);

  const loadMembers = useCallback(async () => {
    if (compactRedirect) {
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
      const nextMembers = await fetchClassDirectoryMembers({
        level: studentProfile.level,
        className: studentProfile.className,
      });
      setMembers(nextMembers);
    } catch (err) {
      console.error("Failed to load class members", err);
      setMembersError("Could not load class members. Please try again later.");
    } finally {
      setLoadingMembers(false);
    }
  }, [compactRedirect, studentProfile?.className, studentProfile?.level]);

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
        const message =
          saveError instanceof Error
            ? saveError.message
            : "Could not save biography. Please try again.";
        setSaveStatus(message);
      })
      .finally(() => setIsSavingBio(false));
  };

  if (compactRedirect) {
    return (
      <section
        aria-label="Class members moved"
        style={{
          ...styles.card,
          display: "grid",
          gap: 10,
          margin: 0,
          border: "1px solid #c7d2fe",
          background: "linear-gradient(135deg, #eef2ff, #ffffff)",
        }}
      >
        <SectionHeader
          eyebrow="Your class"
          title={studentProfile?.className || "Class members"}
          subtitle="The full class directory now lives in your class space, together with the discussion area."
        />
        <PrimaryActionBar align="start">
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => navigate("/campus/discussion?tab=members")}
          >
            View classmates in My Class
          </button>
        </PrimaryActionBar>
      </section>
    );
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <section style={{ ...styles.card, display: "grid", gap: 10 }}>
        <SectionHeader
          eyebrow="My class"
          title={studentProfile?.className || "Class members"}
          subtitle="Get to know the people learning with you. Contact details stay private."
          actions={
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => navigate("/campus/discussion")}
            >
              Open class discussion
            </button>
          }
        />
        {!loadingMembers && !membersError ? (
          <strong>
            {members.length} class member{members.length === 1 ? "" : "s"}
          </strong>
        ) : null}
      </section>

      <div style={styles.card}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Your class biography</div>
        <p style={{ ...styles.helperText, marginTop: 0 }}>
          Add a short introduction, learning goal and interests so classmates can get to know you.
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
            Class profiles will appear here after students are assigned to this class.
          </p>
        </div>
      ) : null}

      {!loadingMembers && !membersError
        ? members.map((member) => {
            const isCurrentStudent =
              String(member.id) === String(studentProfile?.id || studentProfile?.studentCode || "");
            return (
              <div key={member.id} style={{ ...styles.card, margin: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "grid", gap: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>
                      {member.name} {isCurrentStudent ? <span style={styles.badge}>You</span> : null}
                    </div>
                    {member.learningGoal ? (
                      <div style={{ fontSize: 13, color: "#4b5563" }}>
                        Goal: {member.learningGoal}
                      </div>
                    ) : null}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={styles.badge}>Level: {member.level || "–"}</span>
                    {member.interests.slice(0, 2).map((interest) => (
                      <span key={interest} style={styles.badge}>{interest}</span>
                    ))}
                  </div>
                </div>
                <p style={{ ...styles.helperText, margin: "10px 0 0", whiteSpace: "pre-wrap" }}>
                  {member.biography || "No biography yet."}
                </p>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default ClassMembersTab;
