import { motion } from "framer-motion";
import { Clock, Trash2, Play } from "lucide-react";
import { useHistory } from "@/context/HistoryContext";
import { usePlayer } from "@/context/PlayerContext";
import { Button } from "@/components/ui/button";

const formatRelative = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const HistoryPage = () => {
  const { history, clearHistory, removeFromHistory } = useHistory();
  const { play, playAll } = usePlayer();

  return (
    <div className="max-w-5xl mx-auto pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold">Listening History</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {history.length} {history.length === 1 ? "track" : "tracks"} recently played
            </p>
          </div>
        </div>
        {history.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={() => playAll(history.map(h => h.track))}
              className="gap-2"
            >
              <Play size={16} /> Play all
            </Button>
            <Button variant="outline" onClick={clearHistory} className="gap-2">
              <Trash2 size={16} /> Clear
            </Button>
          </div>
        )}
      </motion.div>

      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 border border-dashed border-border rounded-2xl"
        >
          <Clock className="mx-auto text-muted-foreground mb-4" size={48} />
          <p className="text-muted-foreground">No listening history yet. Play a song to start tracking!</p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-1">
          {history.map((entry, i) => (
            <motion.div
              key={`${entry.track.id}-${entry.playedAt}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="group flex items-center gap-4 p-3 rounded-xl hover:bg-surface-hover transition-colors"
            >
              <button
                onClick={() => play(entry.track)}
                className="flex items-center gap-4 flex-1 min-w-0 text-left"
              >
                <span className="w-6 text-sm text-muted-foreground text-right">{i + 1}</span>
                <div className="relative shrink-0">
                  <img
                    src={entry.track.cover}
                    alt={entry.track.title}
                    loading="lazy"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play size={16} className="text-white" fill="white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{entry.track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{entry.track.artist}</p>
                </div>
              </button>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatRelative(entry.playedAt)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(entry.playedAt);
                }}
                aria-label={`Remove ${entry.track.title} from history`}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
