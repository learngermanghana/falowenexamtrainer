import { useState, useRef, useEffect } from "react";

export function useSwahiliSignedAudio(user, endpoint, messages = {}) {
  const [audio, setAudio] = useState({url:"",loading:false,error:""});
  const pending = useRef(false);
  const generation = useRef(0);
  useEffect(() => {
    generation.current++;
    pending.current = false;
    setAudio({url:"",loading:false,error:""});
    return () => { generation.current++; };
  }, [user?.uid, endpoint]);
  async function loadAudio() {
    if (!endpoint || pending.current) return;
    const current = generation.current;
    const fallback = messages.failed || "Sauti haikupatikana. Jaribu tena.";
    if (!user?.getIdToken) {
      setAudio({url:"",loading:false,error:messages.signIn || "Ingia kwenye akaunti yako ili kusikiliza sauti."});
      return;
    }
    pending.current = true;
    setAudio({url:"",loading:true,error:""});
    try {
      const token = await user.getIdToken();
      const response = await fetch(endpoint,{headers:{Authorization:"Bearer "+token}});
      const result = await response.json();
      if (!response.ok || !result?.url) throw new Error(result?.error || fallback);
      if (current === generation.current) setAudio({url:result.url,loading:false,error:""});
    } catch (error) {
      if (current === generation.current) setAudio({url:"",loading:false,error:error.message || fallback});
    } finally {
      if (current === generation.current) pending.current = false;
    }
  }
  return {audio,setAudio,loadAudio};
}
