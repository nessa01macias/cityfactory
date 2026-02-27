import { useMemo, useState, type FormEvent } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { normalizeReference, generateReference, saveSubmission, type FeedbackSubmission, type FeedbackType } from "../../storage/feedback";
import "../page.css";

const TOPICS = [
  "Housing",
  "Transport",
  "Environment / Parks",
  "Culture / Events",
  "Education / Schools",
  "Health / Social services",
  "Safety",
  "Economy / Jobs",
  "Other"
];

const AREAS = [
  "All of Espoo",
  "Tapiola",
  "Leppävaara",
  "Espoon keskus",
  "Matinkylä",
  "Espoonlahti",
  "Kauniainen",
  "Other (please specify)"
];

export function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<FeedbackType>("Idea");
  const [topics, setTopics] = useState<string[]>([]);
  const [area, setArea] = useState<string>("All of Espoo");
  const [areaOther, setAreaOther] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [submitted, setSubmitted] = useState<FeedbackSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messageHint = useMemo(() => {
    const len = message.trim().length;
    if (len === 0) return "Describe your idea, issue, or question...";
    if (len < 50) return "A bit more detail helps us understand the context.";
    if (len < 500) return "500+ characters is encouraged — details help us route this correctly.";
    return "Thanks — this level of detail is really helpful.";
  }, [message]);

  if (submitted) {
    return (
      <>
        <section className="cf-hero">
          <div className="cf-container cf-hero__inner">
            <h1 className="cf-h1">Thank you!</h1>
            <p className="cf-lead">Your feedback has been received.</p>
          </div>
        </section>

        <section className="cf-section">
          <div className="cf-container" style={{ maxWidth: "720px" }}>
            <div className="cf-alert cf-alert--success">
              <div>
                <strong>Your reference number:</strong> #{normalizeReference(submitted.reference)}
              </div>
              <div style={{ marginTop: "0.75rem", lineHeight: 1.65 }}>
                We read every submission. Here's what happens next:
                <ol style={{ margin: "0.5rem 0 0", paddingLeft: "1.2rem" }}>
                  <li><strong>Received</strong> — Your feedback is logged (you are here)</li>
                  <li><strong>Under review</strong> — A city team member reads and categorizes it</li>
                  <li><strong>Routed</strong> — It's sent to the right department or project</li>
                  <li><strong>Response</strong> — You'll hear back if you left your email</li>
                </ol>
              </div>
            </div>

            <div style={{ height: "1.25rem" }} />

            <Card className="cf-card--blue">
              <div className="cf-card__title">Track your submission</div>
              <p className="cf-card__meta">You can check the status anytime using your reference number.</p>
              <a className="cf-btn" href={`/feedback/status?ref=${encodeURIComponent(submitted.reference)}`}>
                Track your submission
              </a>
            </Card>
          </div>
        </section>
      </>
    );
  }

  const toggleTopic = (t: string) => {
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const msg = message.trim();
    if (!msg) {
      setError("Please describe what's on your mind.");
      return;
    }
    if (msg.length < 20) {
      setError("Could you add a bit more detail? (At least 20 characters.)");
      return;
    }

    const now = new Date();
    const ref = generateReference(now);
    const submission: FeedbackSubmission = {
      reference: ref,
      createdAt: now.toISOString(),
      lastUpdatedAt: now.toISOString(),
      type,
      topics,
      area: area || null,
      areaOther: area === "Other (please specify)" ? areaOther.trim() || null : null,
      message: msg,
      email: email.trim() || null,
      name: name.trim() || null,
      status: "Received",
      publicNotes: null
    };

    saveSubmission(submission);
    setSubmitted(submission);
  };

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">Share Your Feedback</h1>
          <p className="cf-lead">
            Have an idea for Espoo? Spotted a problem in your neighborhood? Want to ask a question about a city project?
            This is the place. Every submission is read, and you can track what happens next.
          </p>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          {error ? (
            <div className="cf-alert cf-alert--error" style={{ marginBottom: "1.25rem" }}>{error}</div>
          ) : null}

          <form onSubmit={submit} className="cf-grid cf-grid--2" style={{ alignItems: "start" }}>
            <Card>
              <div className="cf-card__title" style={{ marginBottom: "1rem" }}>Your message</div>

              <div className="cf-field">
                <label className="cf-label" htmlFor="message">
                  What's on your mind? (required)
                </label>
                <textarea
                  className="cf-textarea"
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your idea, issue, or question..."
                />
                <div className="cf-help">{messageHint}</div>
              </div>

              <div style={{ height: "1rem" }} />

              <div className="cf-field">
                <div className="cf-label">What type of feedback is this? (required)</div>
                <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.25rem" }}>
                  {(["Idea", "Issue", "Question", "Other"] as const).map((t) => (
                    <label key={t} style={{ display: "flex", gap: "0.5rem", alignItems: "center", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="type"
                        value={t}
                        checked={type === t}
                        onChange={() => setType(t)}
                      />
                      <span>
                        {t === "Idea"
                          ? "Idea — I have a suggestion for improving something"
                          : t === "Issue"
                            ? "Issue — I want to report a problem"
                            : t === "Question"
                              ? "Question — I have a question about a city project or service"
                              : "Other"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ height: "1rem" }} />

              <div className="cf-field">
                <div className="cf-label">What topic does this relate to? (optional)</div>
                <div className="cf-help">Select all that apply.</div>
                <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.25rem" }}>
                  {TOPICS.map((t) => (
                    <label key={t} style={{ display: "flex", gap: "0.5rem", alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={topics.includes(t)} onChange={() => toggleTopic(t)} />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div className="cf-card__title" style={{ marginBottom: "1rem" }}>Context (optional)</div>

              <div className="cf-field">
                <label className="cf-label" htmlFor="area">
                  Where is this relevant?
                </label>
                <select className="cf-select" id="area" value={area} onChange={(e) => setArea(e.target.value)}>
                  {AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                {area === "Other (please specify)" ? (
                  <input
                    className="cf-input"
                    value={areaOther}
                    onChange={(e) => setAreaOther(e.target.value)}
                    placeholder="Write the area / neighborhood"
                    style={{ marginTop: "0.5rem" }}
                  />
                ) : null}
              </div>

              <div style={{ height: "1rem" }} />

              <div className="cf-field">
                <label className="cf-label" htmlFor="photo">
                  Add a photo (optional)
                </label>
                <input className="cf-input" id="photo" type="file" accept="image/png,image/jpeg" />
                <div className="cf-help">MVP note: photos are not stored yet in this prototype.</div>
              </div>

              <div style={{ height: "1rem" }} />

              <div className="cf-field">
                <label className="cf-label" htmlFor="email">
                  Your email (optional but encouraged)
                </label>
                <input
                  className="cf-input"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="If you'd like updates, enter your email"
                  inputMode="email"
                  autoComplete="email"
                />
              </div>

              <div style={{ height: "1rem" }} />

              <div className="cf-field">
                <label className="cf-label" htmlFor="name">
                  Your name (optional)
                </label>
                <input
                  className="cf-input"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="You can submit anonymously if you prefer"
                  autoComplete="name"
                />
              </div>

              <div style={{ height: "1.25rem" }} />

              <Button type="submit" className="cf-btn--lg" style={{ width: "100%" }}>
                Submit Feedback
              </Button>

              <div style={{ height: "0.75rem" }} />

              <div className="cf-help" style={{ textAlign: "center" }}>
                Want to check an existing submission?{" "}
                <a href="/feedback/status">Track a reference number</a>.
              </div>
            </Card>
          </form>

          <div style={{ height: "2.5rem" }} />

          <h2 className="cf-h2">We Actually Read This</h2>
          <Card>
            <p style={{ marginTop: 0, lineHeight: 1.65 }}>Every submission goes through a simple process:</p>
            <ol style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.8 }}>
              <li><strong>Triage</strong> — City Factory staff read and categorize submissions weekly</li>
              <li><strong>Routing</strong> — Feedback is sent to the relevant city team (housing, transport, etc.)</li>
              <li><strong>Response</strong> — If you left your email, you'll hear back within 2 weeks</li>
              <li><strong>Action</strong> — Some feedback becomes part of a project; some gets a direct response; some we can't act on right now (we'll tell you why)</li>
            </ol>
            <div style={{ height: "0.75rem" }} />
            <div className="cf-help">
              We also publish monthly summaries: "You said &rarr; We did". (Placeholder for MVP.)
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
