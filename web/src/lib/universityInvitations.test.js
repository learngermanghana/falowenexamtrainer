import {
  HAMBURG_KISWAHILI_INVITATION,
  resolveUniversityInvitation,
  isApprovedUniversityStudent,
  isPendingUniversityStudent,
  isUniversityInvitationOpen,
} from "./universityInvitations";
import { getTrialLifecycleState } from "./trialAccess";

describe("University of Hamburg invitation access", () => {
  const pending = {
    program: "swahili",
    registrationSource: "university-invite",
    institutionId: "university-hamburg",
    cohortId: "university-hamburg-kiswahili-a1",
    institutionVerification: "pending",
    accessType: "invitation_pending",
    paymentStatus: "exempt_pending",
    trialStatus: "not_applicable",
  };

  it("accepts only the configured invitation code", () => {
    expect(resolveUniversityInvitation("uh-kiswahili-a1")).toEqual(HAMBURG_KISWAHILI_INVITATION);
    expect(resolveUniversityInvitation("UNKNOWN")).toBeNull();
  });
  it("does not grant access from the invitation alone", () => {
    expect(isPendingUniversityStudent(pending)).toBe(true);
    expect(isApprovedUniversityStudent(pending)).toBe(false);
    expect(getTrialLifecycleState(pending).key).toBe("verification_pending");
    expect(getTrialLifecycleState(pending).active).toBe(false);
  });
  it("recognizes only administrator-approved complimentary access", () => {
    const approved = { ...pending, institutionVerification: "approved", accessType: "complimentary" };
    expect(isApprovedUniversityStudent(approved)).toBe(true);
    const state = getTrialLifecycleState(approved);
    expect(state.key).toBe("complimentary");
    expect(state.endsAtMs).toBeNaN();
    expect(state.purgeAtMs).toBeNaN();
    expect(isApprovedUniversityStudent({ ...approved, cohortId: "outsider" })).toBe(false);
    expect(isApprovedUniversityStudent({ ...pending, institutionVerification: "approved" })).toBe(false);
  });
});

it("requires an expiry and closes the invitation at the exact deadline", () => {
  const invitation = { expiresAt: { toMillis: () => 2000 } };
  expect(isUniversityInvitationOpen(invitation, 1999)).toBe(true);
  expect(isUniversityInvitationOpen(invitation, 2000)).toBe(false);
  expect(isUniversityInvitationOpen(invitation, 2001)).toBe(false);
  expect(isUniversityInvitationOpen(undefined, 1999)).toBe(false);
});
