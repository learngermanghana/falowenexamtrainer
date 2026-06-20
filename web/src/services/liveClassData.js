import {
  collection, db, doc, limit, onSnapshot, query, where,
} from "../firebase";
import { buildLiveClassView } from "./liveClassView";

export { buildLiveClassView } from "./liveClassView";

export const subscribeToLiveClass = ({
  classId, className, onChange, onError = () => {},
}) => {
  if (!db || (!classId && !className)) {
    onChange(null);
    return () => {};
  }

  let stopped = false;
  let stopSessions = () => {};
  let stopZoom = () => {};
  let state = { klass: null, sessions: [], zoom: null };
  const emit = () => {
    if (!stopped) onChange(state.klass ? buildLiveClassView(state) : null);
  };

  const attach = (klass) => {
    stopSessions();
    stopZoom();
    state = { klass, sessions: [], zoom: null };
    emit();

    stopSessions = onSnapshot(
      query(collection(db, "classSessions"), where("classId", "==", klass.id)),
      (snapshot) => {
        state = {
          ...state,
          sessions: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })),
        };
        emit();
      },
      onError
    );

    if (klass.zoomProfileId) {
      stopZoom = onSnapshot(
        doc(db, "zoomProfiles", String(klass.zoomProfileId)),
        (snapshot) => {
          state = {
            ...state,
            zoom: snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null,
          };
          emit();
        },
        onError
      );
    }
  };

  const reference = classId
    ? doc(db, "classes", String(classId))
    : query(collection(db, "classes"), where("name", "==", String(className)), limit(1));

  const stopClass = onSnapshot(reference, (snapshot) => {
    const match = classId ? snapshot : snapshot.docs[0];
    if (!match?.exists()) {
      stopSessions();
      stopZoom();
      state = { klass: null, sessions: [], zoom: null };
      emit();
      return;
    }
    attach({ id: match.id, ...match.data() });
  }, onError);

  return () => {
    stopped = true;
    stopClass();
    stopSessions();
    stopZoom();
  };
};
