import { useMemo, useState, type FormEvent } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { supabase } from "../../supabaseClient";
import { normalizeReference, generateReference, type FeedbackSubmission, type FeedbackType } from "../../storage/feedback";
import { useTranslation } from "../../i18n/useTranslation";
import "../page.css";

const TOPIC_KEYS = ["housing", "transport", "environment", "culture", "education", "health", "safety", "economy", "other"] as const;
const AREA_KEYS = ["all", "tapiola", "leppavaara", "espoonKeskus", "matinkyla", "espoonlahti", "kauniainen", "other"] as const;

export function FeedbackPage() {
  const t = useTranslation();
  const tf = t.feedback;

  const topicLabels = TOPIC_KEYS.map((k) => tf.topics[k]);
  const areaLabels = AREA_KEYS.map((k) => tf.areas[k]);

  const [message, setMessage] = useState("");
  const [type, setType] = useState<FeedbackType>("Idea");
  const [topics, setTopics] = useState<string[]>([]);
  const [area, setArea] = useState<string>(areaLabels[0]);
  const [areaOther, setAreaOther] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [submitted, setSubmitted] = useState<FeedbackSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messageHint = useMemo(() => {
    const len = message.trim().length;
    if (len === 0) return tf.messageHint0;
    if (len < 50) return tf.messageHint0;
    if (len < 500) return tf.messageHint500;
    return tf.messageHintGreat;
  }, [message, tf]);

  if (submitted) {
    return (
      <>
        <section className="cf-hero">
          <div className="cf-container cf-hero__inner">
            <h1 className="cf-h1">{tf.successTitle}</h1>
            <p className="cf-lead">{tf.successDesc}</p>
          </div>
        </section>

        <section className="cf-section">
          <div className="cf-container" style={{ maxWidth: "720px" }}>
            <div className="cf-alert cf-alert--success">
              <div>
                <strong>{tf.referenceLabel}</strong> #{normalizeReference(submitted.reference)}
              </div>
              <div style={{ marginTop: "0.75rem", lineHeight: 1.65 }}>
                {tf.processTitle}
                <ol style={{ margin: "0.5rem 0 0", paddingLeft: "1.2rem" }}>
                  <li><strong>{tf.stepReceived.split(" — ")[0]}</strong> — {tf.stepReceived.split(" — ")[1]}</li>
                  <li><strong>{tf.stepReview.split(" — ")[0]}</strong> — {tf.stepReview.split(" — ")[1]}</li>
                  <li><strong>{tf.stepRouted.split(" — ")[0]}</strong> — {tf.stepRouted.split(" — ")[1]}</li>
                  <li><strong>{tf.stepResponse.split(" — ")[0]}</strong> — {tf.stepResponse.split(" — ")[1]}</li>
                </ol>
              </div>
            </div>

            <div style={{ height: "1.25rem" }} />

            <Card className="cf-card--blue">
              <div className="cf-card__title">{tf.trackTitle}</div>
              <p className="cf-card__meta">{tf.trackDesc}</p>
              <a className="cf-btn" href={`/feedback/status?ref=${encodeURIComponent(submitted.reference)}`}>
                {tf.trackButton}
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

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const msg = message.trim();
    if (!msg) { setError(tf.errMessage); return; }
    if (msg.length < 20) { setError(tf.errMessageShort); return; }

    const now = new Date();
    const ref = generateReference(now);
    const submission: FeedbackSubmission = {
      reference: ref,
      createdAt: now.toISOString(),
      lastUpdatedAt: now.toISOString(),
      type,
      topics,
      area: area || null,
      areaOther: area === tf.areas.other ? areaOther.trim() || null : null,
      message: msg,
      email: email.trim() || null,
      name: name.trim() || null,
      status: "Received",
      publicNotes: null
    };

    const { error: dbError } = await supabase.from("feedback").insert({
      reference: submission.reference,
      created_at: submission.createdAt,
      last_updated_at: submission.lastUpdatedAt,
      type: submission.type,
      topics: submission.topics,
      area: submission.area,
      area_other: submission.areaOther,
      message: submission.message,
      email: submission.email,
      name: submission.name,
      status: submission.status,
      public_notes: submission.publicNotes
    });

    if (dbError) { setError(tf.errSave); return; }
    setSubmitted(submission);
  };

  const typeLabels: Record<FeedbackType, string> = {
    Idea: tf.typeIdea,
    Issue: tf.typeIssue,
    Question: tf.typeQuestion,
    Other: tf.typeOther,
  };

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">{tf.title}</h1>
          <p className="cf-lead">{tf.lead}</p>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          {error ? <div className="cf-alert cf-alert--error" style={{ marginBottom: "1.25rem" }}>{error}</div> : null}

          <form onSubmit={submit} className="cf-grid cf-grid--2" style={{ alignItems: "start" }}>
            <Card>
              <div className="cf-card__title" style={{ marginBottom: "1rem" }}>{tf.messageLabel}</div>

              <div className="cf-field">
                <label className="cf-label" htmlFor="message">{tf.messageRequired}</label>
                <textarea className="cf-textarea" id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={tf.messagePlaceholder} />
                <div className="cf-help">{messageHint}</div>
              </div>

              <div style={{ height: "1rem" }} />

              <div className="cf-field">
                <div className="cf-label">{tf.typeLabel}</div>
                <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.25rem" }}>
                  {(["Idea", "Issue", "Question", "Other"] as const).map((ft) => (
                    <label key={ft} style={{ display: "flex", gap: "0.5rem", alignItems: "center", cursor: "pointer" }}>
                      <input type="radio" name="type" value={ft} checked={type === ft} onChange={() => setType(ft)} />
                      <span>{typeLabels[ft]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ height: "1rem" }} />

              <div className="cf-field">
                <div className="cf-label">{tf.topicLabel}</div>
                <div className="cf-help">{tf.topicHint}</div>
                <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.25rem" }}>
                  {topicLabels.map((tl) => (
                    <label key={tl} style={{ display: "flex", gap: "0.5rem", alignItems: "center", cursor: "pointer" }}>
                      <input type="checkbox" checked={topics.includes(tl)} onChange={() => toggleTopic(tl)} />
                      {tl}
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <div className="cf-card__title" style={{ marginBottom: "1rem" }}>{tf.areaLabel}</div>

              <div className="cf-field">
                <label className="cf-label" htmlFor="area">{tf.areaHint}</label>
                <select className="cf-select" id="area" value={area} onChange={(e) => setArea(e.target.value)}>
                  {areaLabels.map((a) => (<option key={a} value={a}>{a}</option>))}
                </select>
                {area === tf.areas.other ? (
                  <input className="cf-input" value={areaOther} onChange={(e) => setAreaOther(e.target.value)} placeholder={tf.areaPlaceholder} style={{ marginTop: "0.5rem" }} />
                ) : null}
              </div>

              <div style={{ height: "1rem" }} />

              <div className="cf-field">
                <label className="cf-label" htmlFor="photo">{tf.photoLabel}</label>
                <input className="cf-input" id="photo" type="file" accept="image/png,image/jpeg" />
                <div className="cf-help">{tf.photoNote}</div>
              </div>

              <div style={{ height: "1rem" }} />

              <div className="cf-field">
                <label className="cf-label" htmlFor="email">{tf.emailLabel}</label>
                <input className="cf-input" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tf.emailPlaceholder} inputMode="email" autoComplete="email" />
              </div>

              <div style={{ height: "1rem" }} />

              <div className="cf-field">
                <label className="cf-label" htmlFor="name">{tf.nameLabel}</label>
                <input className="cf-input" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={tf.namePlaceholder} autoComplete="name" />
              </div>

              <div style={{ height: "1.25rem" }} />

              <Button type="submit" className="cf-btn--lg" style={{ width: "100%" }}>{tf.submit}</Button>

              <div style={{ height: "0.75rem" }} />

              <div className="cf-help" style={{ textAlign: "center" }}>
                <a href="/feedback/status">{tf.trackLink}</a>
              </div>
            </Card>
          </form>

          <div style={{ height: "2.5rem" }} />

          <h2 className="cf-h2">{tf.infoTitle}</h2>
          <Card>
            <p style={{ marginTop: 0, lineHeight: 1.65 }}>{tf.infoIntro}</p>
            <ol style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.8 }}>
              <li><strong>{tf.infoTriage.split(" — ")[0]}</strong> — {tf.infoTriage.split(" — ")[1]}</li>
              <li><strong>{tf.infoRouting.split(" — ")[0]}</strong> — {tf.infoRouting.split(" — ")[1]}</li>
              <li><strong>{tf.infoResponse.split(" — ")[0]}</strong> — {tf.infoResponse.split(" — ")[1]}</li>
              <li><strong>{tf.infoAction.split(" — ")[0]}</strong> — {tf.infoAction.split(" — ")[1]}</li>
            </ol>
            <div style={{ height: "0.75rem" }} />
            <div className="cf-help">{tf.infoSummary}</div>
          </Card>
        </div>
      </section>
    </>
  );
}
