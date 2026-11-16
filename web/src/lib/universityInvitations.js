// University cohort invitations are attribution only until staff approves the student.
// A shared link must never grant itself complimentary learning access.
export const HAMBURG_KISWAHILI_INVITATION = Object.freeze({
  code: "UH-KISWAHILI-A1",
  institutionId: "university-hamburg",
  institutionName: "University of Hamburg",
  cohortId: "university-hamburg-kiswahili-a1",
  instructorName: "Ruth",
  registrationSource: "university-invite",
  program: "swahili",
  level: "A1",
});

export function resolveUniversityInvitation(code) {
  return String(code || "").trim().toUpperCase() === HAMBURG_KISWAHILI_INVITATION.code
    ? HAMBURG_KISWAHILI_INVITATION
    : null;
}

export function isHamburgUniversityStudent(profile = {}) {
  return profile?.program === "swahili" &&
    profile?.registrationSource === "university-invite" &&
    profile?.institutionId === HAMBURG_KISWAHILI_INVITATION.institutionId &&
    profile?.cohortId === HAMBURG_KISWAHILI_INVITATION.cohortId;
}

export function isApprovedUniversityStudent(profile = {}) {
  return isHamburgUniversityStudent(profile) &&
    profile?.institutionVerification === "approved" &&
    profile?.accessType === "complimentary";
}

export function isPendingUniversityStudent(profile = {}) {
  return isHamburgUniversityStudent(profile) &&
    !isApprovedUniversityStudent(profile);
}

export function isUniversityInvitationOpen(invitation, now = Date.now()) {
  const expiry = invitation?.expiresAt?.toMillis?.();
  return Number.isFinite(expiry) && now < expiry;
}
