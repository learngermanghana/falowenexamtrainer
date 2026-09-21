import { useEffect, useRef, useState } from "react";
import { db, doc, onSnapshot, serverTimestamp, setDoc } from "../firebase";
import { useAuth } from "../context/AuthContext";

const SAVE_DELAY_MS = 350;

const serialize = (value) => {
  try {
    return JSON.stringify(value);
  } catch (_error) {
    return "";
  }
};

export const buildC2CloudDraftDocId = (day) => `day-${Number(day)}`;

export const useC2CloudDraftField = ({ day, field, value, setValue }) => {
  const { user } = useAuth();
  const [cloudReady, setCloudReady] = useState(false);
  const valueRef = useRef(value);
  const remoteSerializedRef = useRef(null);
  const skipNextSaveRef = useRef(false);
  const saveTimerRef = useRef(null);

  valueRef.current = value;

  useEffect(() => {
    setCloudReady(false);
    remoteSerializedRef.current = null;
    skipNextSaveRef.current = false;

    if (!db || !user?.uid || !Number(day) || !field) {
      return undefined;
    }

    const draftRef = doc(db, "users", user.uid, "c2Drafts", buildC2CloudDraftDocId(day));
    const unsubscribe = onSnapshot(
      draftRef,
      (snapshot) => {
        const data = snapshot.exists() ? snapshot.data() || {} : {};
        const hasRemoteField = Object.prototype.hasOwnProperty.call(data, field);
        if (hasRemoteField) {
          const remoteValue = data[field];
          const remoteSerialized = serialize(remoteValue);
          remoteSerializedRef.current = remoteSerialized;
          if (remoteSerialized !== serialize(valueRef.current)) {
            skipNextSaveRef.current = true;
            setValue(remoteValue);
          }
        } else {
          remoteSerializedRef.current = null;
        }
        setCloudReady(true);
      },
      (error) => {
        console.error(`C2 cloud draft load failed for ${field}`, error);
        setCloudReady(true);
      },
    );

    return unsubscribe;
  }, [day, field, setValue, user?.uid]);

  useEffect(() => {
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    if (!cloudReady || !db || !user?.uid || !Number(day) || !field) {
      return undefined;
    }

    const serializedValue = serialize(value);
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return undefined;
    }
    if (remoteSerializedRef.current === serializedValue) {
      return undefined;
    }

    const draftRef = doc(db, "users", user.uid, "c2Drafts", buildC2CloudDraftDocId(day));
    saveTimerRef.current = window.setTimeout(() => {
      setDoc(
        draftRef,
        {
          ownerUid: user.uid,
          uid: user.uid,
          userId: user.uid,
          level: "C2",
          day: Number(day),
          [field]: value,
          [`${field}UpdatedAt`]: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ).catch((error) => {
        console.error(`C2 cloud draft save failed for ${field}`, error);
      });
    }, SAVE_DELAY_MS);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [cloudReady, day, field, user?.uid, value]);

  return {
    cloudEnabled: Boolean(db && user?.uid),
    cloudReady,
  };
};
