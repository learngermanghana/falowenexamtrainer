# Live class Firestore rules

Merge the following scoped rules into the production Firestore rules before enabling canonical live-class data for students:

```firestore
match /classSessions/{document=**} {
  allow read: if signedIn();
  allow write: if isStaff();
}

match /zoomProfiles/{document=**} {
  allow read: if signedIn();
  allow write: if isStaff();
}

match /calendarFeeds/{document=**} {
  allow read: if signedIn();
  allow write: if isStaff();
}
```

Do not replace the production rules file wholesale. Merge these blocks so existing student, tutor, and admin access remains intact.
