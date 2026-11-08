import { useEffect, useMemo } from 'react';
import { auth } from '../firebase';
import { saveCampusMusicPractice } from './musicPracticeTracking';
import { createWorkbookMusicPracticeTracker } from './workbookMusicPractice';

// Reuses the authenticated Campus API; no additional analytics vendor, polling,
// transcript upload, or Firestore reads while a student is listening.
export default function useWorkbookMusicPractice({ trackId, title, level, day }) {
  const tracker = useMemo(() => createWorkbookMusicPracticeTracker({
    trackId, title, level, day,
    send: event => {
      const student = auth?.currentUser;
      if (!student || student.isAnonymous) return;
      return saveCampusMusicPractice(student, event).catch(() => {});
    },
  }), [trackId, title, level, day]);
  useEffect(() => () => tracker.stop(), [tracker]);
  return tracker;
}
