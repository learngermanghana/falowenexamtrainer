import { useCallback, useEffect, useRef, useState } from "react";
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

export const shouldPreserveNewerLocalC2Draft = ({
  remoteSerialized,
  localSerialized,
  dirtySerialized,
  isOwnWrite,
}) => Boolean(
  remoteSerialized !== localSerialized
  && (dirtySerialized === localSerialized || isOwnWrite)
);

export const buildC2CloudDraftDocId = (day) => `day-${Number(day)}`;

export const useC2CloudDraftField = ({ day, field, value, setValue, seedCloudWhenMissing = false, defaultValue }) => {
  const { user } = useAuth();
  const [cloudReady, setCloudReady] = useState(false);
  const valueRef = useRef(value);
  const remoteSerializedRef = useRef(null);
  const skipNextSaveRef = useRef(false);
  const saveTimerRef = useRef(null);
  const pendingSaveRef = useRef(null);
  const dirtySerializedRef = useRef(null);
  const writerIdRef = useRef(
    typeof globalThis !== "undefined" && typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `c2-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const migrationKey = user?.uid && day && field
    ? `falowen:c2:cloud-migrated:${user.uid}:${Number(day)}:${field}`
    : "";
  const defaultSerialized = serialize(defaultValue);

  valueRef.current = value;

  const flushPendingSave = useCallback(() => {
    if (saveTimerRef.current && typeof window !== "undefined") {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    const pending = pendingSaveRef.current;
    if (!pending) return;

    pendingSaveRef.current = null;
    setDoc(pending.draftRef, pending.payload, { merge: true })
      .then(() => {
        remoteSerializedRef.current = pending.serializedValue;
        if (serialize(valueRef.current) === pending.serializedValue) {
          dirtySerializedRef.current = null;
        }
        if (migrationKey) {
          try {
            window.localStorage.setItem(migrationKey, "1");
          } catch (_error) {
            // Local migration marker is best-effort only.
          }
        }
      })
      .catch((error) => {
        console.error(`C2 cloud draft save failed for ${field}`, error);
      });
  }, [field, migrationKey]);

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
        const localSerialized = serialize(valueRef.current);
        let migrationComplete = false;
        try {
          migrationComplete = Boolean(migrationKey && window.localStorage.getItem(migrationKey));
        } catch (_error) {
          migrationComplete = false;
        }
        const canSeedLegacy = Boolean(seedCloudWhenMissing && !migrationComplete);

        if (hasRemoteField) {
          const remoteValue = data[field];
          const remoteSerialized = serialize(remoteValue);
          const shouldPreferLegacyLocal = Boolean(
            canSeedLegacy
            && defaultSerialized !== undefined
            && remoteSerialized === defaultSerialized
            && localSerialized !== defaultSerialized
          );
          const isOwnWrite = data[`${field}WriterId`] === writerIdRef.current;
          const shouldPreserveLocal = shouldPreserveNewerLocalC2Draft({
            remoteSerialized,
            localSerialized,
            dirtySerialized: dirtySerializedRef.current,
            isOwnWrite,
          });

          remoteSerializedRef.current = remoteSerialized;
          if (remoteSerialized === localSerialized) {
            dirtySerializedRef.current = null;
          }
          if (!shouldPreferLegacyLocal && !shouldPreserveLocal && remoteSerialized !== localSerialized) {
            if (saveTimerRef.current && typeof window !== "undefined") {
              window.clearTimeout(saveTimerRef.current);
              saveTimerRef.current = null;
            }
            pendingSaveRef.current = null;
            dirtySerializedRef.current = null;
            skipNextSaveRef.current = true;
            setValue(remoteValue);
          }
          if (!shouldPreferLegacyLocal && migrationKey) {
            try {
              window.localStorage.setItem(migrationKey, "1");
            } catch (_error) {
              // Local migration marker is best-effort only.
            }
          }
        } else {
          remoteSerializedRef.current = canSeedLegacy ? null : localSerialized;
        }
        setCloudReady(true);
      },
      (error) => {
        console.error(`C2 cloud draft load failed for ${field}`, error);
        if (!seedCloudWhenMissing) {
          remoteSerializedRef.current = serialize(valueRef.current);
        }
        setCloudReady(true);
      },
    );

    return unsubscribe;
  }, [day, defaultSerialized, field, migrationKey, seedCloudWhenMissing, setValue, user?.uid]);

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

    dirtySerializedRef.current = serializedValue;
    const draftRef = doc(db, "users", user.uid, "c2Drafts", buildC2CloudDraftDocId(day));
    pendingSaveRef.current = {
      draftRef,
      serializedValue,
      payload: {
        ownerUid: user.uid,
        uid: user.uid,
        userId: user.uid,
        level: "C2",
        day: Number(day),
        [field]: value,
        [`${field}WriterId`]: writerIdRef.current,
        [`${field}UpdatedAt`]: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
    };
    saveTimerRef.current = window.setTimeout(flushPendingSave, SAVE_DELAY_MS);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [cloudReady, day, field, flushPendingSave, user?.uid, value]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const flushOnExit = () => flushPendingSave();
    window.addEventListener("pagehide", flushOnExit);

    return () => {
      window.removeEventListener("pagehide", flushOnExit);
      flushPendingSave();
    };
  }, [flushPendingSave]);

  return {
    cloudEnabled: Boolean(db && user?.uid),
    cloudReady,
  };
};
