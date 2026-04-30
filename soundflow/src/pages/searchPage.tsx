import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { tracks as mockTracks, albums } from "@/data/mockData";
import TrackList from "@/components/TrackList";
import AlbumCard from "@/components/AlbumCard";
import { motion } from "framer-motion";
import { useDeezerSearch } from "@/hooks/useDeezer";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const { results, loading, error, search } = useDeezerSearch();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      search(query);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  const genres = ["Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "R&B", "Classical", "Indie"];

  return (
    <div className="flex flex-col gap-8 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search songs, artists, albums on Deezer..."
          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-primary" size={18} />
        )}
      </motion.div>

      {!query.trim() ? (
        <section>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Browse Genres</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {genres.map((genre, i) => (
              <motion.button
                key={genre}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setQuery(genre)}
                className="p-6 rounded-xl bg-card hover:bg-surface-hover border border-border transition-colors text-center"
              >
                <span className="font-heading font-semibold text-foreground">{genre}</span>
              </motion.button>
            ))}
          </div>
        </section>
      ) : (
        <>
          {error && (
            <div className="text-center py-4 text-destructive text-sm">{error}</div>
          )}
          {results.length > 0 ? (
            <section>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                Results <span className="text-muted-foreground text-sm font-normal">({results.length})</span>
              </h3>
              <TrackList tracks={results} showIndex={false} />
            </section>
          ) : !loading && query.trim() && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No results for "{query}"</p>
              <p className="text-sm mt-1">Try searching for something else</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
