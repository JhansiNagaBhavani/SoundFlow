import { usePlaylist } from "@/context/PlaylistContext";
import { usePlayer } from "@/context/PlayerContext";
import TrackList from "@/components/TrackList";
import { motion } from "framer-motion";
import { Heart, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const FavoritesPage = () => {
  const { favorites } = usePlaylist();
  const { playAll } = usePlayer();

  return (
    <div className="flex flex-col gap-8 pb-32">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Favorites</h2>
            <p className="text-muted-foreground text-sm mt-1">{favorites.length} liked songs</p>
          </div>
          {favorites.length > 0 && (
            <Button onClick={() => playAll(favorites)} className="gap-2">
              <Play size={16} /> Play All
            </Button>
          )}
        </div>
      </motion.div>

      {favorites.length > 0 ? (
        <TrackList tracks={favorites} showIndex={false} />
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <Heart size={48} className="mx-auto mb-4 opacity-50" />
          <p>No favorites yet</p>
          <p className="text-sm mt-1">Click the heart icon on any song to save it here</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
