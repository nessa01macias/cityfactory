import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ButtonLink } from "../../components/ui/Button";
import { fetchUpcomingEvents, eventPath, preferredText, eventCity, CITY_LABELS, type LinkedEvent, type CityFilter } from "../../api/linkedEvents";
import { formatDateTime, truncate } from "../../utils/format";
import { useTranslation } from "../../i18n/useTranslation";
import "../page.css";

const CITY_OPTIONS: CityFilter[] = ["all", "espoo", "helsinki", "vantaa"];

export function EventsPage() {
  const t = useTranslation();
  const te = t.events;

  const [events, setEvents] = useState<LinkedEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<CityFilter>("all");

  useEffect(() => {
    const ac = new AbortController();
    fetchUpcomingEvents({ pageSize: 40, signal: ac.signal })
      .then((r) => setEvents(r.data))
      .catch((e: unknown) => {
        if ((e as { name?: string })?.name === "AbortError") return;
        setError(te.error);
      });
    return () => ac.abort();
  }, [te.error]);

  const filtered = useMemo(() => {
    if (!events) return null;
    let list = events;
    if (cityFilter !== "all") {
      list = list.filter((ev) => eventCity(ev) === cityFilter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((ev) => preferredText(ev.name).toLowerCase().includes(q));
    }
    return list;
  }, [events, query, cityFilter]);

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">{te.title}</h1>
          <p className="cf-lead">{te.lead}</p>

          <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            {CITY_OPTIONS.map((city) => (
              <button
                key={city}
                onClick={() => setCityFilter(city)}
                style={{
                  padding: "0.5rem 1.1rem",
                  borderRadius: "var(--cf-radius-full)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  background: cityFilter === city ? "#fff" : "rgba(255,255,255,0.1)",
                  color: cityFilter === city ? "var(--espoo-night)" : "#fff",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {CITY_LABELS[city]}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "0.75rem", maxWidth: "480px" }}>
            <input
              className="cf-input"
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={te.searchPlaceholder}
              style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.25)", color: "#fff", padding: "0.8rem 1rem", fontSize: "1rem" }}
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

              const title = preferredText(ev.name) || te.untitled;
              const city = eventCity(ev);
              const when = ev.start_time ? formatDateTime(ev.start_time) : te.timeTbc;
              const where = preferredText(ev.location?.name) || preferredText(ev.location?.street_address) || te.locationTbc;
              const desc = truncate(preferredText(ev.short_description) || "", 120);
              const imageUrl = ev.images?.[0]?.url || null;

              return (
                <Card key={ev.id}>
                  {imageUrl ? <img src={imageUrl} alt="" className="cf-card__img" loading="lazy" /> : null}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                    <div className="cf-card__title" style={{ margin: 0 }}>{title}</div>
                    <Badge tone={city}>{CITY_LABELS[city]}</Badge>
                  </div>
                  <div className="cf-card__meta">{when} &middot; {where}</div>
                  {desc ? <p style={{ margin: "0.25rem 0 0.75rem", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>{desc}</p> : null}
                  <div className="cf-actions" style={{ marginTop: 0 }}>
                    <ButtonLink to={eventPath(ev.id)} variant="secondary">{te.viewDetails}</ButtonLink>
                    {preferredText(ev.info_url) ? (
                      <a className="cf-btn cf-btn--ghost" href={preferredText(ev.info_url)} target="_blank" rel="noreferrer">{te.externalLink}</a>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>

          {filtered && filtered.length === 0 ? (
            <div className="cf-alert cf-alert--info" style={{ marginTop: "1.5rem" }}>{te.noResults}</div>
          ) : null}

          <div style={{ height: "2.5rem" }} />

          <Card className="cf-card--blue">
            <div className="cf-card__title">{te.hostTitle}</div>
            <p className="cf-card__meta">{te.hostDesc}</p>
            <ButtonLink to="/contact">{te.contactUs}</ButtonLink>
          </Card>
        </div>
      </section>
    </>
  );
}
