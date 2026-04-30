import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Track } from "@/data/mockData";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

export interface UserPlaylist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: number;
}

interface PlaylistContextType {
  playlists: UserPlaylist[];
  favorites: Track[];
  createPlaylist: (name: string) => UserPlaylist;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  toggleFavorite: (track: Track) => void;
  isFavorite: (trackId: string) => boolean;
}

const PlaylistContext = createContext<PlaylistContextType | null>(null);

export const usePlaylist = () => {
  const ctx = useContext(PlaylistContext);
  if (!ctx) throw new Error("usePlaylist must be used within PlaylistProvider");
  return ctx;
};

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);
  const [favorites, setFavorites] = useState<Track[]>([]);

  useEffect(() => {
    if (!user) {
      setPlaylists([]);
      setFavorites([]);
      return;
    }
    const playlistsRef = doc(db, "users", user.uid, "data", "playlists");
    const favoritesRef = doc(db, "users", user.uid, "data", "favorites");

    const unsub1 = onSnapshot(playlistsRef, (snap) => {
      setPlaylists(snap.data()?.items || []);
    });
    const unsub2 = onSnapshot(favoritesRef, (snap) => {
      setFavorites(snap.data()?.items || []);
    });

    return () => { unsub1(); unsub2(); };
  }, [user]);

  const persistPlaylists = useCallback(async (items: UserPlaylist[]) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid, "data", "playlists"), { items });
  }, [user]);

  const persistFavorites = useCallback(async (items: Track[]) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid, "data", "favorites"), { items });
  }, [user]);

  const createPlaylist = useCallback((name: string) => {
    const pl: UserPlaylist = {
      id: `pl_${Date.now()}`,
      name,
      tracks: [],
      createdAt: Date.now(),
    };
    setPlaylists(prev => {
      const next = [...prev, pl];
      persistPlaylists(next);
      return next;
    });
    return pl;
  }, [persistPlaylists]);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => {
      const next = prev.filter(p => p.id !== id);
      persistPlaylists(next);
      return next;
    });
  }, [persistPlaylists]);

  const addToPlaylist = useCallback((playlistId: string, track: Track) => {
    setPlaylists(prev => {
      const next = prev.map(p =>
        p.id === playlistId && !p.tracks.some(t => t.id === track.id)
          ? { ...p, tracks: [...p.tracks, track] }
          : p
      );
      persistPlaylists(next);
      return next;
    });
  }, [persistPlaylists]);

  const removeFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => {
      const next = prev.map(p =>
        p.id === playlistId
          ? { ...p, tracks: p.tracks.filter(t => t.id !== trackId) }
          : p
      );
      persistPlaylists(next);
      return next;
    });
  }, [persistPlaylists]);

  const toggleFavorite = useCallback((track: Track) => {
    setFavorites(prev => {
      const next = prev.some(t => t.id === track.id)
        ? prev.filter(t => t.id !== track.id)
        : [...prev, track];
      persistFavorites(next);
      return next;
    });
  }, [persistFavorites]);

  const isFavorite = useCallback((trackId: string) => {
    return favorites.some(t => t.id === trackId);
  }, [favorites]);

  return (
    <PlaylistContext.Provider value={{ playlists, favorites, createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist, toggleFavorite, isFavorite }}>
      {children}
    </PlaylistContext.Provider>
  );
};
