import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Suggest() {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");

  async function sendEmail(e) {
    e.preventDefault();

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus("error");
      setMsg("Missing EmailJS keys. Check your .env file.");
      return;
    }

    try {
      setStatus("sending");
      setMsg("");

      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      });

      setStatus("success");
      setMsg("Sent! Thanks for helping shape future picks 🎬");

      // Smooth reset (feels nicer than instant wipe)
      setTimeout(() => {
        formRef.current.reset();
        setStatus("idle");
        setMsg("");
      }, 2500);

    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setMsg("Failed to send. Please try again.");
    }
  }

  return (
      <main className="suggest-page">
        <div className="suggest-wrap">
          <section className="suggest-intro-block">
            <p className="suggest-eyebrow">Community Suggestions</p>

            <h1 className="suggest-title">Suggest a Movie</h1>

            <p className="suggest-intro">
              Help shape future weekly picks. Suggest a film, choose the mood it
              belongs to, and tell us why it deserves a place in the collection.
            </p>
          </section>

          <form ref={formRef} onSubmit={sendEmail} className="suggest-form">
            <div className="suggest-field">
              <label htmlFor="user_name">Name</label>
              <input id="user_name" name="user_name" required />
            </div>

            <div className="suggest-field">
              <label htmlFor="user_email">Email</label>
              <input id="user_email" type="email" name="user_email" required />
            </div>

            <div className="suggest-field">
              <label htmlFor="movie_title">Movie Title</label>
              <input id="movie_title" name="movie_title" required />
            </div>

            <div className="suggest-field">
              <label htmlFor="mood">Mood</label>
              <select id="mood" name="mood" required defaultValue="">
                <option value="" disabled>Choose a mood</option>
                <option value="Happy">Happy</option>
                <option value="Excited">Excited</option>
                <option value="Thoughtful">Thoughtful</option>
                <option value="Scared">Scared</option>
                <option value="Romantic">Romantic</option>
              </select>
            </div>

            <div className="suggest-field">
              <label htmlFor="message">Why should it be picked?</label>
              <textarea id="message" name="message" rows={6} required />
            </div>

            <div className="suggest-bottom">
              <p className="suggest-note">
                We only use this to review submissions — no marketing, no spam.
              </p>

              <label className="suggest-consent">
                <input type="checkbox" name="consent" required />
                <span>
                I consent to my name, email and suggestion being used only to
                review this movie recommendation.
              </span>
              </label>

              <button
                  type="submit"
                  disabled={status === "sending"}
                  className="suggest-submit"
              >
                {status === "sending" ? "Sending..." : "Submit Recommendation"}
              </button>

              {msg && (
                  <p
                      className={`suggest-message ${
                          status === "error"
                              ? "suggest-message--error"
                              : "suggest-message--success"
                      } suggest-message--fade`}
                  >
                    {msg}
                  </p>
              )}
            </div>
          </form>
        </div>
      </main>
  );
}