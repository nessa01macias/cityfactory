import { useState, type FormEvent } from "react";
import { Card } from "../../components/ui/Card";
import { Button, ButtonLink } from "../../components/ui/Button";
import { newContactId, saveContactMessage, type ContactTopic } from "../../storage/contact";
import { useTranslation } from "../../i18n/useTranslation";
import "../page.css";

const TOPIC_KEYS = ["general", "partnership", "research", "volunteering", "press", "websiteFeedback", "other"] as const;

const CheckIcon = () => (
  <span className="cf-feature-list__icon" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
  </span>
);

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
          <div className="cf-grid cf-grid--2" style={{ alignItems: "start" }}>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <Card>
                <div className="cf-card__title" style={{ marginBottom: "0.75rem" }}>{c.methodsTitle}</div>
                <div className="cf-list">
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.15rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>{c.email}</strong><br />
                      <a href="mailto:cityfactoryespoo@gmail.com">cityfactoryespoo@gmail.com</a>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.15rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>{c.instagram}</strong><br />
                      <a href="https://instagram.com/cityfactoryespoo" target="_blank" rel="noopener noreferrer">@cityfactoryespoo</a>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.15rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>{c.address}</strong><br />
                      <span style={{ color: "var(--cf-text-secondary)" }}>{c.addressText}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="cf-card__title" style={{ marginBottom: "0.75rem" }}>{c.specificTitle}</div>
                <div className="cf-list">
                  <div><strong>{c.partnership}</strong>{" "}<a href="mailto:cityfactoryespoo@gmail.com">cityfactoryespoo@gmail.com</a></div>
                  <div><strong>{c.press}</strong>{" "}<a href="mailto:cityfactoryespoo@gmail.com">cityfactoryespoo@gmail.com</a></div>
                  <div><strong>{c.website}</strong>{" "}<a href="mailto:cityfactoryespoo@gmail.com">cityfactoryespoo@gmail.com</a></div>
                </div>
              </Card>
            </div>

            <Card>
              <div className="cf-card__title" style={{ marginBottom: "0.25rem" }}>{c.formTitle}</div>
              <div className="cf-card__meta" style={{ marginBottom: "1rem" }}>{c.formLead}</div>

              {sent ? <div className="cf-alert cf-alert--success">{c.formSuccess}</div> : null}
              {error ? <div className="cf-alert cf-alert--error" style={{ marginBottom: "0.75rem" }}>{error}</div> : null}

              {!sent ? (
                <form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}>
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

      {/* ── For Organizations ── */}
      <section className="cf-section cf-section--muted">
        <div className="cf-container">
          <h2 className="cf-h2">{g.orgTitle}</h2>
          <p className="cf-lead" style={{ marginBottom: "1.25rem" }}>{g.orgLead}</p>
          <Card>
            <p style={{ marginTop: 0, lineHeight: 1.65 }}>{g.orgIntro}</p>
            <ul className="cf-feature-list">
              <li><CheckIcon /><span><strong>{g.orgIdea}</strong> {g.orgIdeaDesc}</span></li>
              <li><CheckIcon /><span><strong>{g.orgExpertise}</strong> {g.orgExpertiseDesc}</span></li>
              <li><CheckIcon /><span><strong>{g.orgResearch}</strong> {g.orgResearchDesc}</span></li>
              <li><CheckIcon /><span><strong>{g.orgCommunity}</strong> {g.orgCommunityDesc}</span></li>
            </ul>
            <p style={{ margin: "1rem 0 1.25rem", color: "var(--cf-text-secondary)", lineHeight: 1.6 }}>{g.orgPartnerDesc}</p>
            <ButtonLink to="/contact">{g.contactPartnership}</ButtonLink>
          </Card>
        </div>
      </section>

      {/* ── Students & Volunteers ── */}
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-grid cf-grid--2">
            <div>
              <h2 className="cf-h2">{g.studentsTitle}</h2>
              <p className="cf-lead" style={{ marginBottom: "1.25rem" }}>{g.studentsLead}</p>
              <Card>
                <ul className="cf-feature-list">
                  <li><CheckIcon /><span>{g.studentsThesis}</span></li>
                  <li><CheckIcon /><span>{g.studentsPropose}</span></li>
                  <li><CheckIcon /><span>{g.studentsEvents}</span></li>
                  <li><CheckIcon /><span>{g.studentsData}</span></li>
                </ul>
                <div style={{ height: "1rem" }} />
                <ButtonLink to="/contact">{g.contactResearch}</ButtonLink>
              </Card>
            </div>
            <div>
              <h2 className="cf-h2">{g.volunteerTitle}</h2>
              <p className="cf-lead" style={{ marginBottom: "1.25rem" }}>{g.volunteerLead}</p>
              <Card>
                <ul className="cf-feature-list">
                  <li><CheckIcon /><span>{g.volunteerEvents}</span></li>
                  <li><CheckIcon /><span>{g.volunteerOutreach}</span></li>
                  <li><CheckIcon /><span>{g.volunteerTranslation}</span></li>
                  <li><CheckIcon /><span>{g.volunteerDocs}</span></li>
                </ul>
                <div style={{ height: "1rem" }} />
                <ButtonLink to="/contact">{g.contactVolunteer}</ButtonLink>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
