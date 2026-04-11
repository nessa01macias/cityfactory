import { useMemo, useState, type FormEvent } from "react";
import { CommunityMap } from "../MediaPage/CommunityMap";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../supabaseClient";
import { normalizeReference, generateReference, type FeedbackSubmission, type FeedbackType } from "../../storage/feedback";
import { useTranslation } from "../../i18n/useTranslation";
import "../page.css";
import "../MediaPage/media.css";

const TOPIC_KEYS = ["housing", "transport", "environment", "culture", "education", "health", "safety", "economy", "other"] as const;
const AREA_KEYS = ["all", "tapiola", "leppavaara", "espoonKeskus", "matinkyla", "espoonlahti", "kauniainen", "other"] as const;

export function GetInvolvedPage() {
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
    if (len < 50) return tf.messageHint0;
    if (len < 500) return tf.messageHint500;
    return tf.messageHintGreat;
  }, [message, tf]);

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
      reference: ref, createdAt: now.toISOString(), lastUpdatedAt: now.toISOString(),
      type, topics, area: area || null,
      areaOther: area === tf.areas.other ? areaOther.trim() || null : null,
      message: msg, email: email.trim() || null, name: name.trim() || null,
      status: "Received", publicNotes: null,
    };

    const { error: dbError } = await supabase.from("feedback").insert({
      reference: submission.reference, created_at: submission.createdAt,
      last_updated_at: submission.lastUpdatedAt, type: submission.type,
      topics: submission.topics, area: submission.area, area_other: submission.areaOther,
      message: submission.message, email: submission.email, name: submission.name,
      status: submission.status, public_notes: submission.publicNotes,
    });

    if (dbError) { setError(tf.errSave); return; }
    setSubmitted(submission);
  };

  const typeLabels: Record<FeedbackType, string> = {
    Idea: tf.typeIdea, Issue: tf.typeIssue, Question: tf.typeQuestion, Other: tf.typeOther,
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">{t.communityMap.title}</h1>
          <p className="cf-lead">{t.communityMap.heroInvite}</p>
        </div>
      </section>

      {/* ── Community Voice Map ── */}
      <div className="cf-voicemap-page" style={{ height: "60vh" }}>
        <CommunityMap />
      </div>

      {/* ── Transition ── */}
      <section style={{ background: "var(--cf-surface)", padding: "1.25rem 0" }}>
        <div className="cf-container" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--cf-text-secondary)" }}>
            Want us to follow up? Fill in the form below — every submission is read and you can track what happens next.
          </p>
        </div>
      </section>

      {/* ── Feedback form ── */}
      <section className="cf-section" id="feedback">
        <div className="cf-container">
          <h2 className="cf-h2">{tf.title}</h2>
          <p className="cf-lead" style={{ marginBottom: "1.25rem" }}>{tf.lead}</p>

          {submitted ? (
            <div style={{ maxWidth: "600px" }}>
              <div className="cf-alert cf-alert--success">
                <strong>{tf.referenceLabel}</strong> #{normalizeReference(submitted.reference)}
                <div style={{ marginTop: "0.5rem" }}>
                  <a href={`/feedback/status?ref=${encodeURIComponent(submitted.reference)}`}>{tf.trackButton}</a>
                </div>
              </div>
            </div>
          ) : (
            <>
              {error ? <div className="cf-alert cf-alert--error" style={{ marginBottom: "1rem" }}>{error}</div> : null}
              <form onSubmit={submit} className="cf-grid cf-grid--2" style={{ alignItems: "start" }}>
                <Card>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="message">{tf.messageRequired}</label>
                    <textarea className="cf-textarea" id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={tf.messagePlaceholder} />
                    <div className="cf-help">{messageHint}</div>
                  </div>

                  <div style={{ height: "0.75rem" }} />

                  <div className="cf-field">
                    <div className="cf-label">{tf.typeLabel}</div>
                    <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.15rem" }}>
                      {(["Idea", "Issue", "Question", "Other"] as const).map((ft) => (
                        <label key={ft} style={{ display: "flex", gap: "0.5rem", alignItems: "center", cursor: "pointer", fontSize: "0.9rem" }}>
                          <input type="radio" name="type" value={ft} checked={type === ft} onChange={() => setType(ft)} />
                          {typeLabels[ft]}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ height: "0.75rem" }} />

                  <div className="cf-field">
                    <div className="cf-label">{tf.topicLabel}</div>
                    <div className="cf-help">{tf.topicHint}</div>
                    <div style={{ display: "grid", gap: "0.3rem", marginTop: "0.15rem" }}>
                      {topicLabels.map((tl) => (
                        <label key={tl} style={{ display: "flex", gap: "0.5rem", alignItems: "center", cursor: "pointer", fontSize: "0.9rem" }}>
                          <input type="checkbox" checked={topics.includes(tl)} onChange={() => toggleTopic(tl)} />
                          {tl}
                        </label>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="area">{tf.areaHint}</label>
                    <select className="cf-select" id="area" value={area} onChange={(e) => setArea(e.target.value)}>
                      {areaLabels.map((a) => (<option key={a} value={a}>{a}</option>))}
                    </select>
                    {area === tf.areas.other ? (
                      <input className="cf-input" value={areaOther} onChange={(e) => setAreaOther(e.target.value)} placeholder={tf.areaPlaceholder} style={{ marginTop: "0.5rem" }} />
                    ) : null}
                  </div>

                  <div style={{ height: "0.75rem" }} />

                  <div className="cf-field">
                    <label className="cf-label" htmlFor="email">{tf.emailLabel}</label>
                    <input className="cf-input" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tf.emailPlaceholder} inputMode="email" autoComplete="email" />
                  </div>

                  <div style={{ height: "0.75rem" }} />

                  <div className="cf-field">
                    <label className="cf-label" htmlFor="name">{tf.nameLabel}</label>
                    <input className="cf-input" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={tf.namePlaceholder} autoComplete="name" />
                  </div>

                  <div style={{ height: "1rem" }} />

                  <Button type="submit" className="cf-btn--lg" style={{ width: "100%" }}>{tf.submit}</Button>

                  <div style={{ height: "0.5rem" }} />
                  <div className="cf-help" style={{ textAlign: "center" }}>
                    <a href="/feedback/status">{tf.trackLink}</a>
                  </div>
                </Card>
              </form>
            </>
          )}
        </div>
      </section>
    </>
  );
}
