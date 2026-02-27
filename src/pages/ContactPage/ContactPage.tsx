import { useState, type FormEvent } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { newContactId, saveContactMessage, type ContactTopic } from "../../storage/contact";
import "../page.css";

const TOPICS: ContactTopic[] = [
  "General inquiry",
  "Partnership / collaboration",
  "Research / academic",
  "Volunteering",
  "Press / media",
  "Feedback on the website",
  "Other"
];

export function ContactPage() {
  const [yourName, setYourName] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [topic, setTopic] = useState<ContactTopic>("General inquiry");
  const [message, setMessage] = useState("");

  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!yourName.trim()) return setError("Please enter your name.");
    if (!yourEmail.trim()) return setError("Please enter your email.");
    if (!message.trim()) return setError("Please enter a message.");

    saveContactMessage({
      id: newContactId(),
      createdAt: new Date().toISOString(),
      name: yourName.trim(),
      email: yourEmail.trim(),
      topic,
      message: message.trim()
    });
    setSent(true);
  };

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">Contact City Factory</h1>
          <p className="cf-lead">
            Have a question? Want to partner with us? Just want to say hello? Here's how to reach us.
          </p>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-grid cf-grid--2" style={{ alignItems: "start" }}>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <Card>
                <div className="cf-card__title" style={{ marginBottom: "0.75rem" }}>Contact methods</div>
                <div className="cf-list">
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.15rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>Email</strong><br />
                      <a href="mailto:cityfactory@espoo.fi">cityfactory@espoo.fi</a>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.15rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>Phone</strong><br />
                      <span style={{ color: "var(--cf-text-secondary)" }}>(placeholder — Espoo city line)</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.15rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>Address</strong><br />
                      <span style={{ color: "var(--cf-text-secondary)" }}>
                        City Factory is currently in development. Physical location coming soon.
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="cf-card__title" style={{ marginBottom: "0.75rem" }}>Specific contacts</div>
                <div className="cf-list">
                  <div>
                    <strong>Partnership:</strong>{" "}
                    <a href="mailto:partnerships@cityfactory.espoo.fi">partnerships@cityfactory.espoo.fi</a>
                  </div>
                  <div>
                    <strong>Press / media:</strong>{" "}
                    <a href="mailto:communications@espoo.fi">communications@espoo.fi</a>
                  </div>
                  <div>
                    <strong>Website issues:</strong>{" "}
                    <a href="mailto:web@cityfactory.espoo.fi">web@cityfactory.espoo.fi</a>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <div className="cf-card__title" style={{ marginBottom: "0.25rem" }}>Send a message</div>
              <div className="cf-card__meta" style={{ marginBottom: "1rem" }}>We'll get back to you within 3 business days.</div>

              {sent ? (
                <div className="cf-alert cf-alert--success">
                  Thanks! We've received your message.
                </div>
              ) : null}
              {error ? (
                <div className="cf-alert cf-alert--error" style={{ marginBottom: "0.75rem" }}>
                  {error}
                </div>
              ) : null}

              {!sent ? (
                <form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="name">
                      Your name (required)
                    </label>
                    <input
                      className="cf-input"
                      id="name"
                      value={yourName}
                      onChange={(e) => setYourName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>

                  <div className="cf-field">
                    <label className="cf-label" htmlFor="email">
                      Your email (required)
                    </label>
                    <input
                      className="cf-input"
                      id="email"
                      value={yourEmail}
                      onChange={(e) => setYourEmail(e.target.value)}
                      inputMode="email"
                      autoComplete="email"
                    />
                  </div>

                  <div className="cf-field">
                    <label className="cf-label" htmlFor="topic">
                      What's this about? (required)
                    </label>
                    <select className="cf-select" id="topic" value={topic} onChange={(e) => setTopic(e.target.value as ContactTopic)}>
                      {TOPICS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cf-field">
                    <label className="cf-label" htmlFor="msg">
                      Your message (required)
                    </label>
                    <textarea className="cf-textarea" id="msg" value={message} onChange={(e) => setMessage(e.target.value)} />
                  </div>

                  <Button type="submit" className="cf-btn--lg">Send Message</Button>
                </form>
              ) : null}
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
