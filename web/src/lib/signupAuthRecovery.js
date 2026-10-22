// Only a person who can authenticate with the existing email/password may
// resume an interrupted sign-up. A lead entry is never proof of ownership.
export async function createOrResumeSignupAccount({
  email, password, createAccount, signIn, findProfile, deletionStatus, signOutExisting,
}) {
  try {
    return { credential: await createAccount(email, password), resumed: false };
  } catch (creationError) {
    if (creationError?.code !== "auth/email-already-in-use") throw creationError;

    let credential;
    try {
      credential = await signIn(email, password);
    } catch {
      // Do not reveal whether the other account belongs to a student or an exam-only user.
      // Their password does not authenticate, so normal Login / password reset is required.
      throw creationError;
    }
    if (String(credential.user?.email || "").trim().toLowerCase() !== email.toLowerCase()) {
      await signOutExisting?.();
      throw creationError;
    }

    // Fail closed on lookup errors; never overwrite or resurrect an existing profile.
    const [profile, status] = await Promise.all([
      findProfile(credential.user.uid, email),
      deletionStatus(credential.user.uid),
    ]);
    if (profile || ["pending", "processing", "completed"].includes(String(status || "").toLowerCase())) {
      await signOutExisting?.();
      throw creationError;
    }
    return { credential, resumed: true };
  }
}
