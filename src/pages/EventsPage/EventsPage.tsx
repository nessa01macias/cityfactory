import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ButtonLink } from "../../components/ui/Button";
import { fetchUpcomingEvents, eventPath, preferredText, eventCity, CITY_LABELS, type LinkedEvent, type CityFilter } from "../../api/linkedEvents";
import { formatDateTime, truncate } from "../../utils/format";
import { useTranslation } from "../../i18n/useTranslation";
import brochureImg from "../../utils/BrochurePicture_Sponsor_TeamName.png";
import "../page.css";

const CITY_OPTIONS: CityFilter[] = ["all", "espoo", "helsinki", "vantaa"];

export function EventsPage() {
  const t = useTranslation();
  const te = t.events;

  const [events, setEvents] = useState<LinkedEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<CityFilter>("espoo");

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
        </div>
      </section>

      {/* ── Featured Event: PDP Gala ── */}
      <section className="cf-section" style={{ paddingBottom: "1.5rem" }}>
        <div className="cf-container">
          <div className="cf-split" style={{
            border: "1px solid var(--cf-border-light)",
            boxShadow: "var(--cf-shadow)",
          }}>
            <img
              src={brochureImg}
              alt="Product Development Gala 2026"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem" }}>
                <Badge tone="espoo">City Factory</Badge>
                <span style={{
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                  background: "var(--espoo-sunflower)",
                  color: "#333",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}>
                  Featured
                </span>
              </div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 600, margin: "0 0 0.4rem" }}>
                Product Development Gala 2026
              </h2>
              <div style={{ fontSize: "0.85rem", color: "var(--cf-text-muted)", marginBottom: "0.6rem" }}>
                8 May 2026, 09:00–17:00 · Design Factory, Puumiehenkuja 5A, Espoo
              </div>
              <p style={{ margin: "0 0 1rem", fontSize: "0.9rem", color: "var(--cf-text-secondary)", lineHeight: 1.6 }}>
                Celebrating 30 years of interdisciplinary innovation. 22 student teams showcase functional prototypes tackling real-world challenges — from ship bridges to hospital ICUs. Free entry, no registration needed.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <a
                  href="https://www.aalto.fi/en/events/product-development-gala-2026"
                  target="_blank"
                  rel="noreferrer"
                  className="cf-btn"
                >
                  Event details →
                </a>
                <ButtonLink to="/contact" variant="secondary">
                  {te.contactUs}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Host an event CTA ── */}
      <section style={{ paddingBottom: "1.5rem" }}>
        <div className="cf-container">
          <Card className="cf-card--blue">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div className="cf-card__title">{te.hostTitle}</div>
                <p className="cf-card__meta" style={{ margin: 0 }}>{te.hostDesc}</p>
              </div>
              <ButtonLink to="/contact">{te.contactUs}</ButtonLink>
            </div>
          </Card>
        </div>
      </section>

      {/* ── All events ── */}
      <section className="cf-section" style={{ paddingTop: "1.5rem" }}>
        <div className="cf-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <h2 className="cf-h2" style={{ margin: 0 }}>Events nearby</h2>
            <a
              href="https://www.espoo.fi/en/events-espoo"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.85rem", fontWeight: 500 }}
            >
              See all Espoo events on espoo.fi →
            </a>
          </div>

          {/* Filter bar */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
            marginBottom: "1.5rem",
            padding: "0.75rem 1rem",
            background: "var(--cf-surface)",
            borderRadius: "12px",
            border: "1px solid var(--cf-border-light)",
          }}>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {CITY_OPTIONS.map((city) => (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "999px",
                    border: cityFilter === city ? "1.5px solid var(--cf-primary)" : "1.5px solid var(--cf-border)",
                    background: cityFilter === city ? "var(--cf-primary-light)" : "#fff",
                    color: cityFilter === city ? "var(--cf-primary)" : "var(--cf-text-secondary)",
                    fontWeight: cityFilter === city ? 600 : 400,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {CITY_LABELS[city]}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <input
                className="cf-input"
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={te.searchPlaceholder}
                style={{ width: "100%", padding: "0.45rem 0.75rem", fontSize: "0.85rem" }}
              />
            </div>
          </div>

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
                  {preferredText(ev.info_url) ? (
                    <a className="cf-btn cf-btn--secondary" href={preferredText(ev.info_url)} target="_blank" rel="noreferrer" style={{ marginTop: "0.25rem" }}>
                      {te.viewDetails} →
                    </a>
                  ) : null}
                </Card>
              );
            })}
          </div>

          {filtered && filtered.length === 0 ? (
            <div className="cf-alert cf-alert--info" style={{ marginTop: "1.5rem" }}>{te.noResults}</div>
          ) : null}
        </div>
      </section>
    </>
  );
}
