# Canonical live-class data

The student Live Class card first resolves the selected class from Firestore `classes` and subscribes to its `classSessions`. Classes that have not yet been created in Falowen Admin continue using the existing static class catalogue until they are migrated.

Admin cancellations and reschedules therefore appear without rebuilding the student app.
