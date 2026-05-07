import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import MovieDetails from "./pages/MovieDetails";
import WatchList from "./pages/WatchList";
import Suggest from "./pages/Suggest";
import Privacy from "./pages/Privacy";

export default function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/watchlist" element={<WatchList />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/suggest" element={<Suggest />} />
                <Route path="/privacy" element={<Privacy />} />
            </Routes>

            <footer className="site-footer">
                <div className="footer-inner">
                    <div className="footer-top">
                        <p className="footer-brand">Movie Match</p>

                        <div className="footer-links">
                            <Link to="/catalogue">Catalogue</Link>
                            <Link to="/watchlist">Watchlist</Link>
                            <Link to="/suggest">Suggest</Link>
                            <Link to="/privacy">Privacy</Link>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© {new Date().getFullYear()} Movie Match</p>

                        <p className="footer-note">
                            This product uses the TMDB API but is not endorsed or certified by
                            TMDB.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}