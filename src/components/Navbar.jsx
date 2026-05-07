import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", onScroll);
        onScroll();

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
            <div className="navbar__inner">
                <NavLink to="/" className="navbar__logo" onClick={closeMenu}>
                    Movie Match
                </NavLink>

                <button
                    className="navbar__toggle"
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
                    <NavLink to="/" className="nav-link" onClick={closeMenu}>
                        Home
                    </NavLink>

                    <NavLink to="/catalogue" className="nav-link" onClick={closeMenu}>
                        Catalogue
                    </NavLink>

                    <NavLink to="/watchlist" className="nav-link" onClick={closeMenu}>
                        Watchlist
                    </NavLink>

                    <NavLink to="/suggest" className="nav-link" onClick={closeMenu}>
                        Suggest
                    </NavLink>

                    <NavLink to="/privacy" className="nav-link subtle" onClick={closeMenu}>
                        Privacy
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}