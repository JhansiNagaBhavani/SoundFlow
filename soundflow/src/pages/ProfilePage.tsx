import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Music2, Heart, ListMusic, LogOut, Save } from "lucide-react";
import { motion } from "framer-motion";
import { updateProfile } from "firebase/auth";
import { usePlaylist } from "@/context/PlaylistContext";
import { usePlayer } from "@/context/PlayerContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(user?.displayName || "");
  const { playlists, favorites } = usePlaylist();
  const { queue } = usePlayer();
  const { toast } = useToast();

  useEffect(() => {
    setDraftName(user?.displayName || "");
  }, [user]);

  const profile = {
    name: user?.displayName || "Music Lover",
    email: user?.email || "",
    avatar: user?.photoURL || "",
  };

  const save = async () => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: draftName });
      setEditing(false);
      toast({ title: "Profile updated!" });
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    toast({ title: "Signed out" });
  };

  const stats = [
    { icon: Heart, label: "Liked Songs", value: favorites.length },
    { icon: ListMusic, label: "Playlists", value: playlists.length },
    { icon: Music2, label: "In Queue", value: queue.length },
  ];

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-8 pb-32 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 pt-4"
      >
        <div className="relative group">
          <div className="w-28 h-28 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-3xl font-heading font-bold text-primary">
            {profile.avatar ? (
              <img src={profile.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
        </div>
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border"
          >
            <Icon size={20} className="text-primary" />
            <span className="text-2xl font-heading font-bold text-foreground">{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* Edit Profile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl bg-card border border-border p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-foreground">Profile Details</h3>
          {!editing && (
            <button
              onClick={() => { setDraftName(profile.name); setEditing(true); }}
              className="text-sm text-primary hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Display Name</label>
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <input
                value={profile.email}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <User size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{profile.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{profile.email}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Sign out */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        onClick={handleSignOut}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-destructive/40 text-destructive font-medium text-sm hover:bg-destructive/10 transition-colors"
      >
        <LogOut size={16} /> Sign out
      </motion.button>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl bg-card border border-border p-6"
      >
        <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Your Playlists</h3>
        {playlists.length > 0 ? (
          <div className="flex flex-col gap-2">
            {playlists.map((pl) => (
              <div key={pl.id} className="flex items-center gap-3 py-2">
                <ListMusic size={16} className="text-primary" />
                <span className="text-sm text-foreground">{pl.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{pl.tracks.length} tracks</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No playlists yet. Create one from the Playlists page!</p>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
