export default function Privacy() {
  return (
      <main className="privacy-page">
        <div className="privacy-wrap">
          <header className="privacy-header">
            <p className="privacy-eyebrow">Legal & Transparency</p>

            <h1 className="privacy-title">Privacy Policy</h1>

            <p className="privacy-intro">
              This website is designed to provide curated movie recommendations
              while respecting user privacy. Only minimal data is used, and no
              personal data is stored beyond what is necessary to process
              suggestions.
            </p>
          </header>

          <section className="privacy-section">
            <h2>Movie Data</h2>
            <p>
              Film information such as titles, posters, cast, crew and trailers is
              provided via the TMDB API.
            </p>
            <p className="privacy-note">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Watchlist Storage</h2>
            <p>
              Your watchlist is stored locally in your browser using localStorage.
              This means your saved films remain on your device and are not sent to
              any server.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Movie Suggestions</h2>
            <p>
              When submitting a movie suggestion, your name, email address, mood
              selection and message are sent using EmailJS.
            </p>
            <p>
              This information is used solely to review submissions and is not used
              for marketing or shared with third parties.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Consent</h2>
            <p>
              The suggestion form requires explicit user consent before submission.
              No data is collected without this confirmation.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Analytics</h2>
            <p>
              This website does not currently use analytics or tracking tools. If
              analytics are added in the future, they will be implemented in a
              privacy-conscious manner and clearly disclosed.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Third-Party Services</h2>
            <p>
              This website relies on third-party services including TMDB and
              EmailJS. These services may process data according to their own
              privacy policies.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Contact</h2>
            <p>
              If you have any questions about this policy or how data is handled,
              please contact the site owner.
            </p>
          </section>
        </div>
      </main>
  );
}