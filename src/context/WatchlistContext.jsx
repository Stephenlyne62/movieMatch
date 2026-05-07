import { createContext, useContext, useEffect, useState, useMemo } from "react";

const WatchlistContext = createContext(null);

function loadWatchlist() {
  try {
    const raw = localStorage.getItem("tp_watchlist");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(loadWatchlist);

  useEffect(() => {
    localStorage.setItem("tp_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  function isInWatchlist(id) {
    return watchlist.some((m) => String(m.id) === String(id));
  }

  function addToWatchlist(movie) {
    setWatchlist((prev) =>
      prev.some((m) => String(m.id) === String(movie.id)) ? prev : [movie, ...prev]
    );
  }

  function removeFromWatchlist(id) {
    setWatchlist((prev) =>
      prev.filter((m) => String(m.id) !== String(id))
    );
  }

  const value = useMemo(() => {
    return {
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
    };
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used inside WatchlistProvider");
  return ctx;
}