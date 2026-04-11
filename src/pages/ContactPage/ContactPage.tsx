import { useState, type FormEvent } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { newContactId, saveContactMessage, type ContactTopic } from "../../storage/contact";
import { useTranslation } from "../../i18n/useTranslation";
import "../page.css";

const TOPIC_KEYS = ["general", "partnership", "research", "volunteering", "press", "websiteFeedback", "other"] as const;

export function ContactPage() {
  const t = useTranslation();
  const c = t.contact;
  const g = t.getInvolved;

  const [yourName, setYourName] = useState("");
  const [yourEmail, setYourEmail] = useState("");
  const [topicKey, setTopicKey] = useState<typeof TOPIC_KEYS[number]>("general");
  const [message, setMessage] = useState("");

  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!yourName.trim()) return setError(c.errName);
    if (!yourEmail.trim()) return setError(c.errEmail);
    if (!message.trim()) return setError(c.errMessage);

    try {
      await saveContactMessage({
        id: newContactId(),
        createdAt: new Date().toISOString(),
        name: yourName.trim(),
        email: yourEmail.trim(),
        topic: c.topics[topicKey] as ContactTopic,
        message: message.trim()
      });
      setSent(true);
    } catch {
      setError("We couldn't send your message right now. Please try again.");
    }
  };

  const workWithUs = [
    { title: g.orgTitle, desc: g.orgLead, topic: "partnership" as const },
    { title: g.studentsTitle, desc: g.studentsLead, topic: "research" as const },
    { title: g.volunteerTitle, desc: g.volunteerLead, topic: "volunteering" as const },
  ];

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">{c.title}</h1>
          <p className="cf-lead">{c.lead}</p>
        </div>
      </section>

      {/* ── Contact info + form ── */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-grid cf-grid--2" style={{ alignItems: "stretch" }}>
            <div style={{ display: "grid", gap: "1rem" }}>
              <Card>
                <div className="cf-list" style={{ fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.1rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>{c.email}</strong><br />
                      <a href="mailto:cityfactoryespoo@gmail.com">cityfactoryespoo@gmail.com</a>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.1rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>{c.instagram}</strong><br />
                      <a href="https://instagram.com/cityfactoryespoo" target="_blank" rel="noopener noreferrer">@cityfactoryespoo</a>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.1rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>{c.address}</strong><br />
                      <span style={{ color: "var(--cf-text-secondary)" }}>{c.addressText}</span><br />
                      <a href="https://maps.google.com/?q=Sähkömiehentie+4,+02150+Espoo" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem" }}>
                        Open in Google Maps →
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
              <div style={{ borderRadius: "12px", overflow: "hidden", flex: 1, minHeight: "200px" }}>
                <iframe
                  title="City Factory location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.5!2d24.8271!3d60.1867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x468df5ec2e80a1d7%3A0x0!2zU8OkaGvDtm1pZWhlbnRpZSA0LCAwMjE1MCBFc3Bvbw!5e0!3m2!1sen!2sfi!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block", minHeight: "200px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <Card>
              <div className="cf-card__title" style={{ marginBottom: "0.25rem" }}>{c.formTitle}</div>
              <div className="cf-card__meta" style={{ marginBottom: "1rem" }}>{c.formLead}</div>

              {sent ? <div className="cf-alert cf-alert--success">{c.formSuccess}</div> : null}
              {error ? <div className="cf-alert cf-alert--error" style={{ marginBottom: "0.75rem" }}>{error}</div> : null}

              {!sent ? (
                <form onSubmit={submit} style={{ display: "grid", gap: "0.85rem" }}>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="name">{c.nameLabel}</label>
                    <input className="cf-input" id="name" value={yourName} onChange={(e) => setYourName(e.target.value)} autoComplete="name" />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="email">{c.emailLabel}</label>
                    <input className="cf-input" id="email" value={yourEmail} onChange={(e) => setYourEmail(e.target.value)} inputMode="email" autoComplete="email" />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="topic">{c.topicLabel}</label>
                    <select className="cf-select" id="topic" value={topicKey} onChange={(e) => setTopicKey(e.target.value as typeof TOPIC_KEYS[number])}>
                      {TOPIC_KEYS.map((key) => (
                        <option key={key} value={key}>{c.topics[key]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="msg">{c.messageLabel}</label>
                    <textarea className="cf-textarea" id="msg" value={message} onChange={(e) => setMessage(e.target.value)} />
                  </div>
                  <Button type="submit" className="cf-btn--lg">{c.submit}</Button>
                </form>
              ) : null}
            </Card>
          </div>
        </div>
      </section>

      {/* ── Work with us — compact cards ── */}
      <section className="cf-section cf-section--muted">
        <div className="cf-container">
          <h2 className="cf-h2" style={{ marginBottom: "1rem" }}>Work with us</h2>
          <div className="cf-grid cf-grid--3">
            {workWithUs.map((item) => (
              <Card key={item.topic}>
                <div className="cf-card__title">{item.title}</div>
                <p style={{ margin: "0.25rem 0 0.75rem", color: "var(--cf-text-secondary)", fontSize: "0.875rem", lineHeight: 1.55 }}>
                  {item.desc}
                </p>
                <button
                  type="button"
                  className="cf-btn cf-btn--secondary"
                  style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                  onClick={() => {
                    setTopicKey(item.topic);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {c.submit} →
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
