import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMovieDetails } from "../services/tmdb";
import { useWatchlist } from "../context/WatchlistContext.jsx";
import {
  getCurrentWeek,
  getFeaturedMoodForToday,
  isWeekendCatchup,
} from "../utils/pickSchedule";
import { moodLabels } from "../data/weeklyPicks";

const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";
const IMG_POSTER = "https://image.tmdb.org/t/p/w500";

function getHeroImage(movie) {
  if (!movie) return "";
  if (movie.backdrop_path) return `${IMG_ORIGINAL}${movie.backdrop_path}`;
  if (movie.poster_path) return `${IMG_ORIGINAL}${movie.poster_path}`;
  return "";
}

export default function Home() {
  const [todaysPick, setTodaysPick] = useState(null);
  const [mood, setMood] = useState("happy");
  const [moodMovies, setMoodMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const { addToWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    loadMood(getFeaturedMoodForToday(), true);
  }, []);

  async function loadMood(selectedMood, isInitial = false) {
    try {
      if (!isInitial) setTransitioning(true);

      setLoading(true);
      setMood(selectedMood);

      const currentWeek = getCurrentWeek();
      const selectedPick = currentWeek.picks[selectedMood];

      if (!selectedPick) return;

      const selectedMovie = await getMovieDetails(selectedPick.id);

      const formattedPick = {
        ...selectedMovie,
        mood: selectedMood,
        reason: selectedPick.reason,
        weekLabel: currentWeek.weekLabel,
      };

      const weeklyMovies = await Promise.all(
          Object.entries(currentWeek.picks).map(async ([pickMood, pick]) => {
            const movie = await getMovieDetails(pick.id);

            return {
              ...movie,
              mood: pickMood,
              reason: pick.reason,
              weekLabel: currentWeek.weekLabel,
            };
          })
      );

      setTimeout(
          () => {
            setTodaysPick(formattedPick);
            setMoodMovies(weeklyMovies);
            setTransitioning(false);
          },
          isInitial ? 0 : 220
      );
    } catch (err) {
      console.error("Failed to load weekly picks", err);
      setTransitioning(false);
    } finally {
      setLoading(false);
    }
  }

  function saveMovie(movie) {
    addToWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
    });
  }

  const currentMoodLabel = moodLabels[mood] || mood;
  const heroImage = getHeroImage(todaysPick);

  return (
      <main className="home-page">
        <header className="home-header">
          <p className="home-eyebrow">Movie Match</p>
          <h1 className="home-title">Choose a mood. Find your next film.</h1>
          <p className="home-description">
            Explore a weekly set of curated film picks, chosen by mood rather than
            left to random recommendation.
          </p>
        </header>

        <section className="mood-section" aria-label="Choose a movie mood">
          <p className="mood-label">Start with a mood</p>

          <div className="mood-pills">
            {Object.keys(moodLabels).map((item) => (
                <button
                    key={item}
                    onClick={() => loadMood(item)}
                    className={`mood-pill ${mood === item ? "active" : ""}`}
                    type="button"
                >
                  {moodLabels[item]}
                </button>
            ))}
          </div>
        </section>

        {todaysPick && (
            <section
                className={`hero ${transitioning ? "hero--fade" : ""}`}
                style={{
                  backgroundImage: heroImage
                      ? `linear-gradient(to right, rgba(0,0,0,0.72), rgba(0,0,0,0.25)), url(${heroImage})`
                      : "linear-gradient(to right, rgba(0,0,0,0.72), rgba(0,0,0,0.25))",
                }}
            >
              <div className="hero__overlay">
                <p className="hero-eyebrow">
                  This Week
                </p>

                <p className="hero-label">
                  {isWeekendCatchup()
                      ? `Weekend catch-up: ${currentMoodLabel} pick`
                      : `Today’s ${currentMoodLabel} pick`}
                </p>

                <h2 className="hero-title">{todaysPick.title}</h2>

                {todaysPick.overview && (
                    <p className="hero-description">{todaysPick.overview}</p>
                )}

                {todaysPick.reason && (
                    <p className="hero-reason">
                      <span>Why this pick</span>
                      {todaysPick.reason}
                    </p>
                )}

                <div className="hero__actions">
                  <Link to={`/movie/${todaysPick.id}`} className="home-btn">
                    View details
                  </Link>

                  <button
                      className="home-btn"
                      type="button"
                      onClick={() => saveMovie(todaysPick)}
                  >
                    {isInWatchlist(todaysPick.id) ? "Saved ✓" : "Add to Watchlist"}
                  </button>
                </div>
              </div>
            </section>
        )}

        <section className="movies-row-section">
          <h2 className="row-label">This Week.</h2>

          {loading ? (
              <p className="home-loading">Loading curated picks...</p>
          ) : (
              <div className="movies-row">
                {moodMovies.map((movie) => (
                    <article className="movie-card" key={movie.id}>
                      <Link
                          to={`/movie/${movie.id}`}
                          className="poster-wrapper"
                          aria-label={`View details for ${movie.title}`}
                      >
                        {movie.poster_path ? (
                            <img
                                src={`${IMG_POSTER}${movie.poster_path}`}
                                alt={`${movie.title} movie poster`}
                                className="poster"
                            />
                        ) : (
                            <div className="poster poster--empty" />
                        )}
                      </Link>

                      <p className="movie-mood">{moodLabels[movie.mood]}</p>
                      <h3 className="movie-title">{movie.title}</h3>
                      <p className="movie-year">
                        {movie.release_date ? movie.release_date.slice(0, 4) : "—"}
                      </p>
                    </article>
                ))}
              </div>
          )}
        </section>
      </main>
  );
}