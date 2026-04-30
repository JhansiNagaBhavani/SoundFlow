import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { Track } from "@/data/mockData";
import { useHistory } from "./HistoryContext";

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: "off" | "all" | "one";
}

interface PlayerContextType extends PlayerState {
  play: (track: Track) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setProgress: (p: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  playAll: (tracks: Track[], startIndex?: number) => void;
  seekTo: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { addToHistory } = useHistory();
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    progress: 0,
    duration: 0,
    volume: 75,
    shuffle: false,
    repeat: "off",
  });

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = state.volume / 100;
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      setState(s => ({ ...s, progress: audio.currentTime }));
    });
    audio.addEventListener("loadedmetadata", () => {
      setState(s => ({ ...s, duration: audio.duration }));
    });
    audio.addEventListener("ended", () => {
      // Auto next
      handleNext();
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = state.volume / 100;
  }, [state.volume]);

  const handleNext = useCallback(() => {
    setState(s => {
      if (!s.currentTrack || s.queue.length === 0) return s;
      const idx = s.queue.findIndex(t => t.id === s.currentTrack!.id);
      
      if (s.repeat === "one") {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        return { ...s, isPlaying: true, progress: 0 };
      }
      
      let nextIdx: number;
      if (s.shuffle) {
        nextIdx = Math.floor(Math.random() * s.queue.length);
      } else {
        nextIdx = (idx + 1) % s.queue.length;
        if (nextIdx === 0 && s.repeat === "off") {
          return { ...s, isPlaying: false, progress: 0 };
        }
      }
      
      const nextTrack = s.queue[nextIdx];
      if (audioRef.current && nextTrack.preview) {
        audioRef.current.src = nextTrack.preview;
        audioRef.current.play();
      }
      return { ...s, currentTrack: nextTrack, isPlaying: true, progress: 0 };
    });
  }, []);

  const play = useCallback((track: Track) => {
    if (audioRef.current && track.preview) {
      audioRef.current.src = track.preview;
      audioRef.current.play();
    }
    addToHistory(track);
    setState(s => ({ ...s, currentTrack: track, isPlaying: true, progress: 0 }));
  }, [addToHistory]);

  const togglePlay = useCallback(() => {
    setState(s => {
      if (audioRef.current) {
        if (s.isPlaying) audioRef.current.pause();
        else audioRef.current.play();
      }
      return { ...s, isPlaying: !s.isPlaying };
    });
  }, []);

  const next = handleNext;

  const prev = useCallback(() => {
    setState(s => {
      if (!s.currentTrack || s.queue.length === 0) return s;
      // If > 3s in, restart current
      if (audioRef.current && audioRef.current.currentTime > 3) {
        audioRef.current.currentTime = 0;
        return { ...s, progress: 0 };
      }
      const idx = s.queue.findIndex(t => t.id === s.currentTrack!.id);
      const prevIdx = idx <= 0 ? s.queue.length - 1 : idx - 1;
      const prevTrack = s.queue[prevIdx];
      if (audioRef.current && prevTrack.preview) {
        audioRef.current.src = prevTrack.preview;
        audioRef.current.play();
      }
      return { ...s, currentTrack: prevTrack, isPlaying: true, progress: 0 };
    });
  }, []);

  const setProgress = useCallback((p: number) => {
    setState(s => ({ ...s, progress: p }));
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setState(s => ({ ...s, progress: time }));
  }, []);

  const setVolume = useCallback((v: number) => {
    setState(s => ({ ...s, volume: v }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(s => ({ ...s, shuffle: !s.shuffle }));
  }, []);

  const cycleRepeat = useCallback(() => {
    setState(s => ({
      ...s,
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    }));
  }, []);

  const playAll = useCallback((tracks: Track[], startIndex = 0) => {
    const track = tracks[startIndex];
    if (audioRef.current && track?.preview) {
      audioRef.current.src = track.preview;
      audioRef.current.play();
    }
    if (track) addToHistory(track);
    setState(s => ({
      ...s,
      queue: tracks,
      currentTrack: track,
      isPlaying: true,
      progress: 0,
    }));
  }, [addToHistory]);

  return (
    <PlayerContext.Provider value={{ ...state, play, togglePlay, next, prev, setProgress, setVolume, toggleShuffle, cycleRepeat, playAll, seekTo }}>
      {children}
    </PlayerContext.Provider>
  );
};
