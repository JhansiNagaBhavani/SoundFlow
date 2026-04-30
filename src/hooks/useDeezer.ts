import { useState, useCallback } from "react";
import { Track } from "@/data/mockData";

const JIOSAAVN_API = "https://jiosaavn-api-privatecvc2.vercel.app";

interface JioSaavnTrack {
  id: string;
  name: string;
  duration: string;
  primaryArtists: string;
  album: { id: string; name: string };
  image: { quality: string; link: string }[];
  downloadUrl: { quality: string; link: string }[];
  language: string;
  playCount: string;
}

const mapTrack = (t: JioSaavnTrack): Track => ({
  id: `js_${t.id}`,
  title: t.name.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
  artist: t.primaryArtists,
  album: t.album?.name?.replace(/&quot;/g, '"').replace(/&amp;/g, '&') || "",
  cover: t.image?.[2]?.link || t.image?.[1]?.link || t.image?.[0]?.link || "",
  duration: parseInt(t.duration) || 0,
  preview: t.downloadUrl?.[4]?.link || t.downloadUrl?.[3]?.link || t.downloadUrl?.[2]?.link || "",
});

export const useDeezerSearch = () => {
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${JIOSAAVN_API}/search/songs?query=${encodeURIComponent(query)}&limit=25`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      const tracks = (data.data?.results || []).map(mapTrack);
      setResults(tracks);
    } catch (e: any) {
      setError(e.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
};

export const useDeezerChart = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch trending songs
      const res = await fetch(`${JIOSAAVN_API}/search/songs?query=trending+hits+2024&limit=20`);
      if (!res.ok) throw new Error("Failed to fetch trending");
      const data = await res.json();
      setTracks((data.data?.results || []).map(mapTrack));
    } catch (e: any) {
      setError(e.message);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { tracks, loading, error, fetchChart };
};
