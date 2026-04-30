import { useState } from "react";
import { usePlaylist } from "@/context/PlaylistContext";
import { usePlayer } from "@/context/PlayerContext";
import TrackList from "@/components/TrackList";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ListMusic, Play, Trash2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PlaylistsPage = () => {
  const { playlists, createPlaylist, deletePlaylist, removeFromPlaylist } = usePlaylist();
  const { playAll } = usePlayer();
  const [newName, setNewName] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const selectedPlaylist = playlists.find(p => p.id === selectedId);
  const pendingDeletePlaylist = playlists.find(p => p.id === pendingDeleteId);

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deletePlaylist(pendingDeleteId);
    if (selectedId === pendingDeleteId) setSelectedId(null);
    toast.success("Playlist deleted");
    setPendingDeleteId(null);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    createPlaylist(newName.trim());
    setNewName("");
  };

  if (selectedPlaylist) {
    return (
      <div className="flex flex-col gap-6 pb-32">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button onClick={() => setSelectedId(null)} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-4">
            <ChevronLeft size={16} /> Back to Playlists
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">{selectedPlaylist.name}</h2>
              <p className="text-muted-foreground text-sm mt-1">{selectedPlaylist.tracks.length} tracks</p>
            </div>
            {selectedPlaylist.tracks.length > 0 && (
              <Button onClick={() => playAll(selectedPlaylist.tracks)} size="sm" className="gap-2">
                <Play size={14} /> Play All
              </Button>
            )}
          </div>
        </motion.div>
        {selectedPlaylist.tracks.length > 0 ? (
          <TrackList
            tracks={selectedPlaylist.tracks}
            playlistId={selectedPlaylist.id}
            onRemove={(trackId) => removeFromPlaylist(selectedPlaylist.id, trackId)}
          />
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <ListMusic size={48} className="mx-auto mb-4 opacity-50" />
            <p>This playlist is empty</p>
            <p className="text-sm mt-1">Search for songs and add them here</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-32">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="font-heading text-2xl font-bold text-foreground">Your Playlists</h2>
        <p className="text-muted-foreground text-sm mt-1">Create and manage your playlists</p>
      </motion.div>

      {/* Create new */}
      <div className="flex gap-3">
        <Input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleCreate()}
          placeholder="New playlist name..."
          className="max-w-xs"
        />
        <Button onClick={handleCreate} disabled={!newName.trim()} className="gap-2">
          <Plus size={16} /> Create
        </Button>
      </div>

      {/* Playlist list */}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {playlists.map(pl => (
              <motion.div
                key={pl.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-surface-hover transition-colors cursor-pointer"
                onClick={() => setSelectedId(pl.id)}
              >
                <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center">
                  {pl.tracks.length > 0 ? (
                    <img src={pl.tracks[0].cover} alt="" className="w-full h-full rounded-lg object-cover" />
                  ) : (
                    <ListMusic size={24} className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{pl.name}</p>
                  <p className="text-xs text-muted-foreground">{pl.tracks.length} tracks</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <ListMusic size={48} className="mx-auto mb-4 opacity-50" />
          <p>No playlists yet</p>
          <p className="text-sm mt-1">Create your first playlist above</p>
        </div>
      )}

      <AlertDialog open={!!pendingDeleteId} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete playlist?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeletePlaylist
                ? `"${pendingDeletePlaylist.name}" and its ${pendingDeletePlaylist.tracks.length} track(s) will be permanently removed. This cannot be undone.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlaylistsPage;
