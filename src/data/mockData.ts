import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import album4 from "@/assets/album-4.jpg";
import album5 from "@/assets/album-5.jpg";
import album6 from "@/assets/album-6.jpg";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: number; // seconds
  preview?: string; // audio preview URL
}

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  trackCount: number;
  tracks: Track[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  cover: string;
  year: number;
  tracks: Track[];
}

const covers = [album1, album2, album3, album4, album5, album6];

export const tracks: Track[] = [
  { id: "1", title: "Golden Hour", artist: "Solar Echoes", album: "Amber Light", cover: covers[0], duration: 234 },
  { id: "2", title: "Neon Dreams", artist: "Midnight Circuit", album: "Synthwave City", cover: covers[1], duration: 198 },
  { id: "3", title: "Deep Currents", artist: "Tidal Wave", album: "Ocean Floor", cover: covers[2], duration: 267 },
  { id: "4", title: "Forest Hymn", artist: "Echoing Pines", album: "Woodland", cover: covers[3], duration: 312 },
  { id: "5", title: "Geometry", artist: "Sharp Angles", album: "Polygons", cover: covers[4], duration: 189 },
  { id: "6", title: "Vinyl Memories", artist: "The Grooves", album: "Analog Soul", cover: covers[5], duration: 245 },
  { id: "7", title: "Amber Drift", artist: "Solar Echoes", album: "Amber Light", cover: covers[0], duration: 278 },
  { id: "8", title: "Circuit Breaker", artist: "Midnight Circuit", album: "Synthwave City", cover: covers[1], duration: 210 },
  { id: "9", title: "Coral Reef", artist: "Tidal Wave", album: "Ocean Floor", cover: covers[2], duration: 195 },
  { id: "10", title: "Canopy", artist: "Echoing Pines", album: "Woodland", cover: covers[3], duration: 340 },
  { id: "11", title: "Tessellation", artist: "Sharp Angles", album: "Polygons", cover: covers[4], duration: 220 },
  { id: "12", title: "Needle Drop", artist: "The Grooves", album: "Analog Soul", cover: covers[5], duration: 256 },
];

export const albums: Album[] = [
  { id: "a1", title: "Amber Light", artist: "Solar Echoes", cover: covers[0], year: 2024, tracks: tracks.filter(t => t.album === "Amber Light") },
  { id: "a2", title: "Synthwave City", artist: "Midnight Circuit", cover: covers[1], year: 2023, tracks: tracks.filter(t => t.album === "Synthwave City") },
  { id: "a3", title: "Ocean Floor", artist: "Tidal Wave", cover: covers[2], year: 2024, tracks: tracks.filter(t => t.album === "Ocean Floor") },
  { id: "a4", title: "Woodland", artist: "Echoing Pines", cover: covers[3], year: 2023, tracks: tracks.filter(t => t.album === "Woodland") },
  { id: "a5", title: "Polygons", artist: "Sharp Angles", cover: covers[4], year: 2024, tracks: tracks.filter(t => t.album === "Polygons") },
  { id: "a6", title: "Analog Soul", artist: "The Grooves", cover: covers[5], year: 2022, tracks: tracks.filter(t => t.album === "Analog Soul") },
];

export const playlists: Playlist[] = [
  { id: "p1", name: "Late Night Vibes", cover: covers[0], trackCount: 4, tracks: [tracks[0], tracks[2], tracks[5], tracks[9]] },
  { id: "p2", name: "Synthwave Essentials", cover: covers[1], trackCount: 3, tracks: [tracks[1], tracks[7], tracks[4]] },
  { id: "p3", name: "Chill Acoustics", cover: covers[3], trackCount: 4, tracks: [tracks[3], tracks[8], tracks[10], tracks[11]] },
];

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
