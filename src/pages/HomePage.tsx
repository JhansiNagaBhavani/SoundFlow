import { useEffect } from "react";
import { albums, playlists } from "@/data/mockData";
import AlbumCard from "@/components/AlbumCard";
import TrackList from "@/components/TrackList";
import { motion } from "framer-motion";
import { Play, TrendingUp, Music2, Loader2 } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { useDeezerChart, useDeezerSearch } from "@/hooks/useDeezer";

const HomePage = () => {
  const { playAll } = usePlayer();
  const { tracks: chartTracks, loading, fetchChart } = useDeezerChart();
  const { results: teluguTracks, loading: teluguLoading, search: searchTelugu } = useDeezerSearch();

  useEffect(() => { fetchChart(); }, [fetchChart]);
  useEffect(() => { searchTelugu("Telugu songs"); }, [searchTelugu]);

  return (
    <div className="flex flex-col gap-10 pb-32">
      {/* Trending from Deezer */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <TrendingUp size={20} className="text-primary" />
          <h3 className="font-heading text-xl font-semibold text-foreground">Trending Now</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        ) : chartTracks.length > 0 ? (
          <TrackList tracks={chartTracks.slice(0, 10)} />
        ) : (
          <TrackList tracks={albums.flatMap(a => a.tracks).slice(0, 6)} />
        )}
      </section>

      {/* Telugu Songs */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
          <Music2 size={20} className="text-primary" />
          <h3 className="font-heading text-xl font-semibold text-foreground">Telugu Songs</h3>
        </div>
        {teluguLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        ) : teluguTracks.length > 0 ? (
          <TrackList tracks={teluguTracks.slice(0, 10)} />
        ) : (
          <p className="text-sm text-muted-foreground px-1">No Telugu songs found</p>
        )}
      </section>

     
    </div>
  );
};

export default HomePage;
