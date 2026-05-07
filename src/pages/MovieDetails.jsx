import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getMovieVideos } from "../services/tmdb.js";
import { useWatchlist } from "../context/WatchlistContext.jsx";
import { weeklyPicks, moodLabels } from "../data/weeklyPicks.js";

const IMG_BASE = "https://image.tmdb.org/t/p/w780";
const PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

function findCuratedPick(movieId) {
  for (const week of weeklyPicks) {
    for (const [mood, pick] of Object.entries(week.picks)) {
      if (String(pick.id) === String(movieId)) {
        return {
          mood,
          moodLabel: moodLabels[mood],
          reason: pick.reason,
          weekLabel: week.weekLabel,
        };
      }
    }
  }

  return null;
}

export default function MovieDetails() {
  const { id } = useParams();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const castRef = useRef(null);
  const closeBtnRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [trailerKey, setTrailerKey] = useState("");
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [displayedCast, setDisplayedCast] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError("");
        setMovie(null);
        setTrailerKey("");
        setIsTrailerOpen(false);

        const data = await getMovieDetails(id);
        if (cancelled) return;

        setMovie(data);

        const vids = await getMovieVideos(id);
        if (cancelled) return;

        const trailer =
            vids?.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
            vids?.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
            vids?.find((v) => v.site === "YouTube");

        setTrailerKey(trailer?.key || "");

        const topCast = data.credits?.cast || [];
        setDisplayedCast(topCast.slice(0, 10));
      } catch (err) {
        if (!cancelled) setError(err.message || "Something went wrong");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!isTrailerOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsTrailerOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isTrailerOpen]);

  const saved = useMemo(
      () => (movie ? isInWatchlist(movie.id) : false),
      [movie, isInWatchlist]
  );

  const curatedPick = useMemo(() => findCuratedPick(id), [id]);

  const handleToggleWatchlist = () => {
    if (!movie) return;

    if (saved) {
      removeFromWatchlist(movie.id);
      return;
    }

    addToWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    });
  };

  const openTrailer = () => setIsTrailerOpen(true);
  const closeTrailer = () => setIsTrailerOpen(false);

  if (error) {
    return (
        <div className="details">
          <Link className="btn" to="/catalogue">
            ← Back to catalogue
          </Link>
          <p style={{ color: "#ff8f7a", marginTop: 16 }}>{error}</p>
        </div>
    );
  }

  if (!movie) return <p>Loading movie...</p>;

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const runtime = movie.runtime ? `${movie.runtime} min` : "—";
  const genresText = movie.genres?.length
      ? movie.genres.map((g) => g.name).join(", ")
      : "—";

  const directors =
      movie.credits?.crew
          ?.filter((c) => c.job === "Director")
          ?.map((d) => d.name)
          .join(", ") || null;

  const producers =
      movie.credits?.crew
          ?.filter((c) => c.job === "Producer")
          ?.map((p) => p.name)
          .slice(0, 3)
          .join(", ") || null;

  const executiveProducers =
      movie.credits?.crew
          ?.filter((c) => c.job === "Executive Producer")
          ?.map((p) => p.name)
          .slice(0, 3)
          .join(", ") || null;

  const composers =
      movie.credits?.crew
          ?.filter((c) => c.job === "Original Music Composer")
          ?.map((c) => c.name)
          .join(", ") || null;

  const topCast = movie.credits?.cast || [];

  const handleCastScroll = () => {
    if (!castRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = castRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);

    if (scrollLeft + clientWidth >= scrollWidth - 5) {
      const next = topCast.slice(displayedCast.length, displayedCast.length + 5);
      if (next.length) {
        setDisplayedCast((prev) => [...prev, ...next]);
      }
    }
  };

  return (
      <div className="details">
        {movie.backdrop_path && (
            <div
                className="details__banner"
                style={{
                  backgroundImage: `url(${IMG_BASE}${movie.backdrop_path})`,
                }}
                aria-hidden="true"
            />
        )}

        <section className="details__topOverlay">
          {curatedPick?.moodLabel && (
              <p className="details__moodTag">
                {curatedPick.moodLabel} Pick · {curatedPick.weekLabel}
              </p>
          )}

          <div className="details__titleRow">
            <h1 className="details__title">{movie.title}</h1>

            <div className="details__actionsOverlay">
              {trailerKey && (
                  <button className="details-btn details-btn--primary" onClick={openTrailer}>
                    ▶ Watch Trailer
                  </button>
              )}

              <button className="details-btn" onClick={handleToggleWatchlist}>
                {saved ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
            </div>
          </div>

          {movie.overview && (
              <p className="details__overviewOverlay">{movie.overview}</p>
          )}

          {curatedPick?.reason && (
              <p className="details__reason">
                <span className="details__reasonLabel">Why we picked this</span>
                {curatedPick.reason}
              </p>
          )}
        </section>

        <div className="details__metaInfo">
          <span>{year} • {runtime}</span>
          <span>Genres: {genresText}</span>
          {directors && <span>Director: {directors}</span>}
          {producers && <span>Producer: {producers}</span>}
          {executiveProducers && <span>Executive Producer: {executiveProducers}</span>}
          {composers && <span>Score: {composers}</span>}
        </div>

        {displayedCast.length > 0 && (
            <section className="details__castGalleryWrapper">
              <strong className="details__castHeading">Cast</strong>

              <div className="details__castGalleryControls">
                {canScrollLeft && (
                    <button
                        className="details__castScrollBtn left"
                        onClick={() =>
                            castRef.current?.scrollBy({ left: -250, behavior: "smooth" })
                        }
                        aria-label="Scroll left"
                    >
                      ◀
                    </button>
                )}

                <div
                    className="details__castScroll"
                    ref={castRef}
                    onScroll={handleCastScroll}
                >
                  {displayedCast.map((c) => (
                      <div className="details__castCard" key={c?.id || c?.name}>
                        {c?.profile_path ? (
                            <img
                                src={`${PROFILE_BASE}${c.profile_path}`}
                                alt={c.name}
                                loading="lazy"
                                className="details__castImage"
                            />
                        ) : (
                            <div className="details__castFallback" aria-label="No image" />
                        )}

                        <div className="details__castName">{c?.name}</div>
                        {c?.character && (
                            <div className="details__castCharacter">as {c.character}</div>
                        )}
                      </div>
                  ))}
                </div>

                {canScrollRight && (
                    <button
                        className="details__castScrollBtn right"
                        onClick={() =>
                            castRef.current?.scrollBy({ left: 250, behavior: "smooth" })
                        }
                        aria-label="Scroll right"
                    >
                      ▶
                    </button>
                )}
              </div>
            </section>
        )}

        {isTrailerOpen && (
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-label="Trailer"
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) closeTrailer();
                }}
            >
              <div className="modal__panel">
                <div className="modal__top">
                  <div className="modal__title">Trailer</div>

                  <button
                      ref={closeBtnRef}
                      className="details-btn"
                      onClick={closeTrailer}
                  >
                    Close ✕
                  </button>
                </div>

                <div className="modal__video">
                  <iframe
                      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                      title="YouTube trailer"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                  />
                </div>
              </div>
            </div>
        )}
      </div>
  );
}