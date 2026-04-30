import { usePlayer } from "@/context/PlayerContext";
import { formatDuration } from "@/data/mockData";
import { usePlaylist } from "@/context/PlaylistContext";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PlayerBar = () => {
  const {
    currentTrack, isPlaying, progress, duration, volume, shuffle, repeat,
    togglePlay, next, prev, seekTo, setVolume, toggleShuffle, cycleRepeat,
  } = usePlayer();
  const { toggleFavorite, isFavorite } = usePlaylist();

  if (!currentTrack) return null;

  const trackDuration = duration || currentTrack.duration;
  const progressPercent = trackDuration ? (progress / trackDuration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 md:bottom-0 left-0 right-0 z-40 glass border-t border-border mb-[52px] md:mb-0"
      >
        {/* Clickable progress bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            seekTo(percent * trackDuration);
          }}
        >
          <div className="absolute inset-0 bg-muted/30" />
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progressPercent}%`, marginLeft: -6 }}
          />
        </div>

        <div className="flex items-center gap-4 px-4 py-3 max-w-screen-2xl mx-auto">
          {/* Track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <motion.img
              key={currentTrack.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            <button
              onClick={() => toggleFavorite(currentTrack)}
              className="hidden sm:block p-1 transition-colors"
            >
              <Heart
                size={16}
                className={isFavorite(currentTrack.id) ? "text-red-500 fill-red-500" : "text-muted-foreground hover:text-foreground"}
              />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button onClick={toggleShuffle} className={`hidden sm:block p-1 transition-colors ${shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <Shuffle size={16} />
            </button>
            <button onClick={prev} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <SkipBack size={18} />
            </button>
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button onClick={next} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <SkipForward size={18} />
            </button>
            <button onClick={cycleRepeat} className={`hidden sm:block p-1 transition-colors ${repeat !== "off" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {repeat === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>

          {/* Progress & Volume */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatDuration(Math.floor(progress))}
            </span>
            <input
              type="range"
              min={0}
              max={trackDuration}
              value={progress}
              onChange={e => seekTo(Number(e.target.value))}
              className="w-32 accent-primary h-1"
            />
            <span className="text-xs text-muted-foreground w-10">
              {formatDuration(trackDuration)}
            </span>
            <button onClick={() => setVolume(volume === 0 ? 75 : 0)} className="p-1 text-muted-foreground hover:text-foreground">
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-20 accent-primary h-1"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlayerBar;
