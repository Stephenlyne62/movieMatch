import { Link } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext.jsx";

export default function WatchList() {
    const { watchlist, removeFromWatchlist } = useWatchlist();

    return (
        <main className="watchlist-page">
            <header className="watchlist-header">
                <p className="watchlist-eyebrow">Your Collection</p>

                <h1 className="watchlist-title">Watchlist</h1>

                <p className="watchlist-description">
                    Keep track of the films you want to come back to. Open any title for
                    full details, or remove it directly from the poster.
                </p>
            </header>

            {watchlist.length === 0 ? (
                <section className="watchlist-empty">
                    <h2>Nothing saved yet</h2>
                    <p>
                        Add films from the homepage or Past Selections archive and they’ll
                        show up here.
                    </p>
                    <Link to="/catalogue" className="home-btn">
                        Browse Past Selections
                    </Link>
                </section>
            ) : (
                <section className="watchlist-grid" aria-label="Saved movies">
                    {watchlist.map((movie) => (
                        <article className="watchlist-card" key={movie.id}>
                            <Link
                                to={`/movie/${movie.id}`}
                                className="watchlist-poster-link"
                                aria-label={`View details for ${movie.title}`}
                            >
                                <img
                                    src={
                                        movie.poster_path
                                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                            : "/placeholder.png"
                                    }
                                    alt={`${movie.title} movie poster`}
                                    className="watchlist-poster"
                                />
                            </Link>

                            <button
                                className="watchlist-remove"
                                type="button"
                                onClick={() => removeFromWatchlist(movie.id)}
                            >
                                Remove
                            </button>

                            <div className="watchlist-card-content">
                                <h2 className="watchlist-card-title">{movie.title}</h2>

                                <p className="watchlist-card-year">
                                    {movie.release_date
                                        ? movie.release_date.slice(0, 4)
                                        : "Unknown year"}
                                </p>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}