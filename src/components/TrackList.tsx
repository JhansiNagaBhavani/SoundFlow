import { Track, formatDuration } from "@/data/mockData";
import { usePlayer } from "@/context/PlayerContext";
import { usePlaylist } from "@/context/PlaylistContext";
import { Play, Pause, Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TrackListProps {
  tracks: Track[];
  showIndex?: boolean;
  playlistId?: string;
  onRemove?: (trackId: string) => void;
}

const TrackList = ({ tracks, showIndex = true, playlistId, onRemove }: TrackListProps) => {
  const { play, currentTrack, isPlaying, togglePlay, playAll } = usePlayer();
  const { toggleFavorite, isFavorite, playlists, addToPlaylist } = usePlaylist();

  return (
    <div className="flex flex-col">
      {tracks.map((track, idx) => {
        const isCurrent = currentTrack?.id === track.id;
        return (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className={`group flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
              isCurrent ? "bg-primary/10" : "hover:bg-surface-hover"
            }`}
          >
            <div
              className="w-8 text-center"
              onClick={() => isCurrent ? togglePlay() : playAll(tracks, idx)}
            >
              {isCurrent && isPlaying ? (
                <div className="flex items-center justify-center gap-0.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-primary rounded-full"
                      animate={{ height: [4, 12, 4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground group-hover:hidden">
                  {showIndex ? idx + 1 : "•"}
                </span>
              )}
              {!(isCurrent && isPlaying) && (
                <Play size={14} className="text-foreground hidden group-hover:block mx-auto" />
              )}
            </div>

            <img
              src={track.cover}
              alt={track.title}
              className="w-10 h-10 rounded object-cover"
              loading="lazy"
              onClick={() => isCurrent ? togglePlay() : playAll(tracks, idx)}
            />

            <div className="flex-1 min-w-0" onClick={() => isCurrent ? togglePlay() : playAll(tracks, idx)}>
              <p className={`text-sm font-medium truncate ${isCurrent ? "text-primary" : "text-foreground"}`}>
                {track.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart size={14} className={isFavorite(track.id) ? "text-red-500 fill-red-500" : "text-muted-foreground hover:text-foreground"} />
              </button>

              {playlists.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus size={14} className="text-muted-foreground hover:text-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {playlists.map(pl => (
                      <DropdownMenuItem key={pl.id} onClick={() => addToPlaylist(pl.id, track)}>
                        {pl.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <span className="text-xs text-muted-foreground ml-2">{formatDuration(track.duration)}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TrackList;
