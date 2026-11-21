import React from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getBackendUrl } from "../services/backendUrl";
import { fetchB2MockAudioPlaybackUrl } from "../services/b2AudioService";
import { B2_MOCK_03_HOEREN } from "../data/b2Mock03Hoeren";
import { PracticeAttempt } from "./A2MockListeningPractice";

async function grade({ idToken, answers }) {
  const response = await axios.post(`${getBackendUrl()}/b2-mock-03/hoeren-practice/score`, { answers }, {
    headers: { Authorization: `Bearer ${idToken}` },
  });
  return response.data;
}

export default function B2Mock03ListeningPractice() {
  const { user, idToken } = useAuth();
  return <PracticeAttempt key={user?.uid || "guest"} uid={user?.uid} idToken={idToken}
    level="B2" mockNumber={3} parts={B2_MOCK_03_HOEREN} grade={grade} fetchAudio={fetchB2MockAudioPlaybackUrl} />;
}
