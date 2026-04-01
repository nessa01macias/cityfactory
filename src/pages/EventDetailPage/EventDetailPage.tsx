import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ButtonLink } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { fetchEventById, preferredText, eventCity, CITY_LABELS, type LinkedEvent } from "../../api/linkedEvents";
import { formatDateTime } from "../../utils/format";
import { useTranslation } from "../../i18n/useTranslation";
import "../page.css";

function addToCalendarUrl(ev: LinkedEvent) {
  const title = preferredText(ev.name) || "Event";
  const start = ev.start_time ? new Date(ev.start_time).toISOString().replace(/[-:]|(\.\d{3})/g, "") : "";
  const end = ev.end_time ? new Date(ev.end_time).toISOString().replace(/[-:]|(\.\d{3})/g, "") : "";
  const details = preferredText(ev.description) || preferredText(ev.short_description);
  const location = preferredText(ev.location?.name) || preferredText(ev.location?.street_address);

  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    ...(start ? { dates: end ? `${start}/${end}` : `${start}/${start}` } : {}),
    ...(details ? { details } : {}),
    ...(location ? { location } : {})
  });

  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

export function EventDetailPage() {
  const t = useTranslation();
  const td = t.eventDetail;

  const params = useParams();
  const id = useMemo(() => decodeURIComponent(params.id || ""), [params.id]);

  const [event, setEvent] = useState<LinkedEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const ac = new AbortController();
    fetchEventById(id, { signal: ac.signal })
      .then((r) => setEvent(r))
      .catch((e: unknown) => {
        if ((e as { name?: string })?.name === "AbortError") return;
        setError(td.error);
      });
    return () => ac.abort();
  }, [id, td.error]);

  if (!id) {
    return (
      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-alert cf-alert--error">{td.missingId}</div>
        </div>
      </section>
    );
  }

  const title = preferredText(event?.name) || (event ? td.untitled : td.loading);
  const when = event?.start_time ? formatDateTime(event.start_time) : null;
  const end = event?.end_time ? formatDateTime(event.end_time) : null;
  const where = preferredText(event?.location?.name) || preferredText(event?.location?.street_address) || (event ? td.locationTbc : null);
  const imageUrl = event?.images?.[0]?.url || null;
  const infoUrl = preferredText(event?.info_url) || null;
  const desc = preferredText(event?.description) || preferredText(event?.short_description) || "";

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <div>
            <Link to="/events" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.925rem" }}>{td.backToEvents}</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <h1 className="cf-h1" style={{ margin: 0 }}>{title}</h1>
            {event ? <Badge tone={eventCity(event)}>{CITY_LABELS[eventCity(event)]}</Badge> : null}
          </div>
          <p className="cf-lead">{when ? `${when}${end ? ` — ${end}` : ""}` : td.timeTbc}</p>
          <p className="cf-lead">{where}</p>
          <div className="cf-actions">
            {infoUrl ? (
              <a className="cf-btn cf-btn--white" href={infoUrl} target="_blank" rel="noreferrer">{td.registration}</a>
            ) : null}
            {event?.start_time ? (
              <a className="cf-btn" href={addToCalendarUrl(event)} target="_blank" rel="noreferrer" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff", background: "rgba(255,255,255,0.12)" }}>
                {td.addToCalendar}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          {error ? <div className="cf-alert cf-alert--error">{error}</div> : null}

          <div className="cf-grid cf-grid--2">
            <Card>
              <div className="cf-card__title">{td.details}</div>
              <div className="cf-list" style={{ marginTop: "0.75rem" }}>
                <div><strong>{td.start}</strong> {event?.start_time ? formatDateTime(event.start_time) : "TBC"}</div>
                <div><strong>{td.end}</strong> {event?.end_time ? formatDateTime(event.end_time) : "TBC"}</div>
                <div><strong>{td.location}</strong> {where || "TBC"}</div>
                {infoUrl ? (
                  <div><strong>{td.link}</strong>{" "}<a href={infoUrl} target="_blank" rel="noreferrer">{infoUrl}</a></div>
                ) : null}
              </div>
            </Card>

            <Card>
              <div className="cf-card__title">{td.about}</div>
              {imageUrl ? <img src={imageUrl} alt="" className="cf-card__img" style={{ margin: "0.75rem 0" }} loading="lazy" /> : null}
              {desc ? <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.65 }}>{desc}</p> : <p style={{ margin: 0 }}>—</p>}
            </Card>
          </div>

          <div style={{ height: "1.5rem" }} />

          <Card className="cf-card--blue">
            <div className="cf-card__title">{td.moreEvents}</div>
            <p className="cf-card__meta" style={{ marginBottom: "0.75rem" }}>{td.moreEventsDesc}</p>
            <ButtonLink to="/feedback">{td.shareFeedback}</ButtonLink>
          </Card>
        </div>
      </section>
    </>
  );
}
