import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Track } from "@/data/mockData";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

export interface HistoryEntry {
  track: Track;
  playedAt: number;
}

interface HistoryContextType {
  history: HistoryEntry[];
  addToHistory: (track: Track) => void;
  removeFromHistory: (playedAt: number) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | null>(null);
const MAX_ENTRIES = 100;

export const useHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider");
  return ctx;
};

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Subscribe to user's history
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    const ref = doc(db, "users", user.uid, "data", "history");
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data();
      setHistory(data?.entries || []);
    });
    return unsub;
  }, [user]);

  const persist = useCallback(async (entries: HistoryEntry[]) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "data", "history");
    await setDoc(ref, { entries });
  }, [user]);

  const addToHistory = useCallback((track: Track) => {
    setHistory(prev => {
      if (prev[0]?.track.id === track.id) return prev;
      const next = [{ track, playedAt: Date.now() }, ...prev.filter(h => h.track.id !== track.id)].slice(0, MAX_ENTRIES);
      persist(next);
      return next;
    });
  }, [persist]);

  const removeFromHistory = useCallback((playedAt: number) => {
    setHistory(prev => {
      const next = prev.filter(h => h.playedAt !== playedAt);
      persist(next);
      return next;
    });
  }, [persist]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    persist([]);
  }, [persist]);

  return (
    <HistoryContext.Provider value={{ history, addToHistory, removeFromHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
