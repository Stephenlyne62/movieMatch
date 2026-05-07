import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMovieDetails } from "../services/tmdb";
import { useWatchlist } from "../context/WatchlistContext.jsx";
import { getPastWeeks } from "../utils/pickSchedule";
import { moodLabels } from "../data/weeklyPicks";

const IMG_POSTER = "https://image.tmdb.org/t/p/w500";

const DECADES = [
    { label: "1980s", start: 1980, end: 1989 },
    { label: "1990s", start: 1990, end: 1999 },
    { label: "2000s", start: 2000, end: 2009 },
    { label: "2010s", start: 2010, end: 2019 },
    { label: "2020s", start: 2020, end: 2029 },
];

export default function Catalogue() {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedMoods, setSelectedMoods] = useState([]);
    const [selectedDecades, setSelectedDecades] = useState([]);
    const [loading, setLoading] = useState(false);

    const { addToWatchlist, isInWatchlist } = useWatchlist();

    useEffect(() => {
        loadPastSelections();
    }, []);

    async function loadPastSelections() {
        try {
            setLoading(true);

            const pastWeeks = getPastWeeks();

            const archiveItems = pastWeeks.flatMap((week) =>
                Object.entries(week.picks).map(([mood, pick]) => ({
                    id: pick.id,
                    mood,
                    reason: pick.reason,
                    weekLabel: week.weekLabel,
                }))
            );

            const loadedMovies = await Promise.all(
                archiveItems.map(async (item) => {
                    const movie = await getMovieDetails(item.id);
                    return { ...movie, ...item };
                })
            );

            setMovies(loadedMovies);
        } catch (err) {
            console.error("Failed to load past selections", err);
        } finally {
            setLoading(false);
        }
    }

    const toggleMood = (mood) => {
        setSelectedMoods((prev) =>
            prev.includes(mood)
                ? prev.filter((item) => item !== mood)
                : [...prev, mood]
        );
    };

    const toggleDecade = (decade) => {
        setSelectedDecades((prev) =>
            prev.includes(decade)
                ? prev.filter((item) => item !== decade)
                : [...prev, decade]
        );
    };

    const clearFilters = () => {
        setQuery("");
        setSelectedMoods([]);
        setSelectedDecades([]);
    };

    function saveMovie(movie) {
        addToWatchlist({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
        });
    }

    const filteredMovies = useMemo(() => {
        let results = movies;

        if (query.trim()) {
            results = results.filter((movie) =>
                movie.title.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (selectedMoods.length > 0) {
            results = results.filter((movie) => selectedMoods.includes(movie.mood));
        }

        if (selectedDecades.length > 0) {
            const ranges = selectedDecades.map((label) =>
                DECADES.find((decade) => decade.label === label)
            );

            results = results.filter((movie) => {
                const year = movie.release_date
                    ? Number(movie.release_date.slice(0, 4))
                    : null;

                return (
                    year &&
                    ranges.some((range) => year >= range.start && year <= range.end)
                );
            });
        }

        return results;
    }, [movies, query, selectedMoods, selectedDecades]);

    const visibleWeeks = getPastWeeks();

    return (
        <main className="catalogue-page">
            <header className="catalogue-header">
                <p className="catalogue-eyebrow">Archive</p>
                <h1 className="catalogue-title">Past Selections</h1>
                <p className="catalogue-description">
                    Every completed week of mood picks lives here as an archive of
                    previous recommendations.
                </p>
            </header>

            <section className="catalogue-controls" aria-label="Archive filters">
                <input
                    type="text"
                    placeholder="Search previous selections..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="catalogue-search"
                    aria-label="Search previous film selections"
                />

                <p className="filter-label">Filter archive by mood and decade</p>

                <div className="filters-row">
                    {Object.keys(moodLabels).map((mood) => (
                        <button
                            key={mood}
                            onClick={() => toggleMood(mood)}
                            className={`filter-pill ${
                                selectedMoods.includes(mood) ? "active" : ""
                            }`}
                            type="button"
                        >
                            {moodLabels[mood]}
                        </button>
                    ))}

                    {DECADES.map((decade) => (
                        <button
                            key={decade.label}
                            onClick={() => toggleDecade(decade.label)}
                            className={`filter-pill ${
                                selectedDecades.includes(decade.label) ? "active" : ""
                            }`}
                            type="button"
                        >
                            {decade.label}
                        </button>
                    ))}

                    <button className="filter-pill" onClick={clearFilters} type="button">
                        Clear
                    </button>
                </div>
            </section>

            {loading && <p className="empty-state">Loading past selections...</p>}

            {!loading && filteredMovies.length === 0 && (
                <p className="empty-state">
                    No past selections are available yet. Once the first week ends, the
                    completed picks will appear here.
                </p>
            )}

            {!loading && filteredMovies.length > 0 && (
                <div className="archive-weeks">
                    {visibleWeeks.map((week) => {
                        const weekMovies = filteredMovies.filter(
                            (movie) => movie.weekLabel === week.weekLabel
                        );

                        if (weekMovies.length === 0) return null;

                        return (
                            <section className="archive-week" key={week.weekLabel}>
                                <h2 className="archive-week-title">{week.weekLabel}</h2>

                                <div className="archive-row">
                                    {weekMovies.map((movie) => (
                                        <article
                                            className="archive-card"
                                            key={`${movie.weekLabel}-${movie.id}`}
                                        >
                                            <Link
                                                to={`/movie/${movie.id}`}
                                                aria-label={`View details for ${movie.title}`}
                                            >
                                                {movie.poster_path ? (
                                                    <img
                                                        className="archive-poster"
                                                        src={`${IMG_POSTER}${movie.poster_path}`}
                                                        alt={`${movie.title} movie poster`}
                                                    />
                                                ) : (
                                                    <div className="archive-poster poster--empty" />
                                                )}
                                            </Link>

                                            <p className="archive-mood">{moodLabels[movie.mood]}</p>
                                            <h3 className="archive-title">{movie.title}</h3>

                                            <p className="archive-year">
                                                {movie.release_date
                                                    ? movie.release_date.slice(0, 4)
                                                    : "—"}
                                            </p>

                                            {movie.reason && (
                                                <p className="archive-reason">{movie.reason}</p>
                                            )}

                                            <button
                                                className="card-watchlist-btn"
                                                type="button"
                                                onClick={() => saveMovie(movie)}
                                            >
                                                {isInWatchlist(movie.id)
                                                    ? "Saved ✓"
                                                    : "Add to Watchlist"}
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </main>
    );
}