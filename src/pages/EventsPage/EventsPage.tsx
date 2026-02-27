import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { ButtonLink } from "../../components/ui/Button";
import { fetchUpcomingEspooEvents, eventPath, preferredText, type LinkedEvent } from "../../api/linkedEvents";
import { formatDateTime, truncate } from "../../utils/format";
import "../page.css";

export function EventsPage() {
  const [events, setEvents] = useState<LinkedEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    fetchUpcomingEspooEvents({ pageSize: 20, signal: ac.signal })
      .then((r) => setEvents(r.data))
      .catch((e: unknown) => {
        if ((e as { name?: string })?.name === "AbortError") return;
        setError("We couldn't load events right now. Please try again soon.");
      });
    return () => ac.abort();
  }, []);

  const filtered = useMemo(() => {
    if (!events) return null;
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((ev) => preferredText(ev.name).toLowerCase().includes(q));
  }, [events, query]);

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">Events</h1>
          <p className="cf-lead">
            Workshops, open sessions, Q&amp;A nights, and community gatherings. All events are free and open to everyone
            — whether you've lived in Espoo for decades or just moved here.
          </p>

          <div style={{ marginTop: "1rem", maxWidth: "480px" }}>
            <input
              className="cf-input"
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events by title..."
              style={{
                background: "rgba(255,255,255,0.15)",
                borderColor: "rgba(255,255,255,0.25)",
                color: "#fff",
                padding: "0.8rem 1rem",
                fontSize: "1rem"
              }}
            />
          </div>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          {error ? <div className="cf-alert cf-alert--error">{error}</div> : null}

          <div className="cf-grid cf-grid--2">
            {(filtered ?? Array.from({ length: 6 }).map(() => null)).map((ev, idx) => {
              if (!ev) {
                return (
                  <Card key={`skeleton-${idx}`}>
                    <div className="cf-skeleton" style={{ height: "170px", marginBottom: "1rem", borderRadius: "var(--cf-radius)" }} />
                    <div className="cf-skeleton cf-skeleton--title" style={{ marginBottom: "0.5rem" }} />
                    <div className="cf-skeleton cf-skeleton--text" />
                  </Card>
                );
              }

              const title = preferredText(ev.name) || "Untitled event";
              const when = ev.start_time ? formatDateTime(ev.start_time) : "Time to be confirmed";
              const where =
                preferredText(ev.location?.name) ||
                preferredText(ev.location?.street_address) ||
                "Location to be confirmed";
              const desc = truncate(preferredText(ev.short_description) || "", 120);
              const imageUrl = ev.images?.[0]?.url || null;

              return (
                <Card key={ev.id}>
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="cf-card__img" loading="lazy" />
                  ) : null}
                  <div className="cf-card__title">{title}</div>
                  <div className="cf-card__meta">
                    {when} &middot; {where}
                  </div>
                  {desc ? <p style={{ margin: "0.25rem 0 0.75rem", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>{desc}</p> : null}
                  <div className="cf-actions" style={{ marginTop: 0 }}>
                    <ButtonLink to={eventPath(ev.id)} variant="secondary">
                      View details
                    </ButtonLink>
                    {preferredText(ev.info_url) ? (
                      <a className="cf-btn cf-btn--ghost" href={preferredText(ev.info_url)} target="_blank" rel="noreferrer">
                        External link &rarr;
                      </a>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>

          {filtered && filtered.length === 0 ? (
            <div className="cf-alert cf-alert--info" style={{ marginTop: "1.5rem" }}>
              No events matched your search. Try a different keyword.
            </div>
          ) : null}

          <div style={{ height: "2.5rem" }} />

          <Card className="cf-card--blue">
            <div className="cf-card__title">Want to host an event at City Factory?</div>
            <p className="cf-card__meta">
              If you're a community group, organization, or city team and want to host a workshop or event, get in
              touch.
            </p>
            <ButtonLink to="/contact">
              Contact us
            </ButtonLink>
          </Card>
        </div>
      </section>
    </>
  );
}
