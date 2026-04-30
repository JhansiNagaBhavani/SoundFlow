import { Album } from "@/data/mockData";
import { usePlayer } from "@/context/PlayerContext";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

interface AlbumCardProps {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const { playAll } = usePlayer();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group flex flex-col gap-3 p-3 rounded-xl bg-card hover:bg-surface-hover transition-colors cursor-pointer"
      onClick={() => playAll(album.tracks)}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <img
          src={album.cover}
          alt={album.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Play size={20} className="ml-0.5" />
          </div>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground truncate">{album.title}</p>
        <p className="text-xs text-muted-foreground">{album.artist} · {album.year}</p>
      </div>
    </motion.div>
  );
};

export default AlbumCard;
