import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ButtonLink } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { fetchUpcomingEspooEvents, eventPath, preferredText, type LinkedEvent } from "../../api/linkedEvents";
import { formatDateTime, truncate } from "../../utils/format";
import { PROJECTS } from "../../data/projects";
import { statusToTone } from "../../utils/projectStatus";
import "../page.css";

/* ── SVG Wave Divider ── */
function WaveDivider({ from, to }: { from: string; to: string }) {
  return (
    <div className="cf-wave" style={{ background: from, marginTop: "-1px" }}>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0,40 C360,100 720,0 1080,60 C1260,80 1380,50 1440,40 L1440,100 L0,100 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}

/* ── Espoo-style swirl/brand shape for hero decoration ── */
function HeroDecorations() {
  return (
    <div className="cf-hero__decor" aria-hidden="true">
      {/* Sunflower blob top-right */}
      <div
        className="cf-hero__blob"
        style={{
          width: 180, height: 180, top: "8%", right: "12%",
          background: "var(--espoo-sunflower)", opacity: 0.1,
          borderRadius: "58% 42% 65% 35% / 40% 55% 45% 60%"
        }}
      />
      {/* Berry blob mid-right */}
      <div
        className="cf-hero__blob"
        style={{
          width: 120, height: 120, top: "55%", right: "5%",
          background: "var(--espoo-berry)", opacity: 0.12,
          borderRadius: "42% 58% 35% 65% / 55% 40% 60% 45%"
        }}
      />
      {/* Grass blob bottom-left */}
      <div
        className="cf-hero__blob"
        style={{
          width: 90, height: 90, bottom: "15%", left: "8%",
          background: "var(--espoo-grass)", opacity: 0.1,
          borderRadius: "50% 50% 35% 65% / 60% 40% 60% 40%"
        }}
      />
      {/* Lilac dots */}
      <div style={{ position: "absolute", top: "20%", right: "28%", display: "grid", gridTemplateColumns: "repeat(4, 8px)", gap: 10, opacity: 0.15 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const [events, setEvents] = useState<LinkedEvent[] | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetchUpcomingEspooEvents({ pageSize: 4, signal: ac.signal })
      .then((r) => setEvents(r.data))
      .catch((e: unknown) => {
        if ((e as { name?: string })?.name === "AbortError") return;
        setEventsError("We couldn't load events right now. Please try again soon.");
      });
    return () => ac.abort();
  }, []);

  const featuredProjects = useMemo(() => PROJECTS.slice(0, 3), []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          HERO — Night blue with floating organic blobs
          ═══════════════════════════════════════════════════════ */}
      <section className="cf-hero cf-hero--home">
        <HeroDecorations />
        <div className="cf-container cf-hero__inner">
          <div className="cf-kicker cf-kicker--light">
            <span className="cf-kicker__dot" aria-hidden="true" />
            City of Espoo — building together
          </div>
          <h1 className="cf-h1" style={{ maxWidth: "16ch" }}>
            Where Espoo Builds Its Future Together
          </h1>
          <p className="cf-lead" style={{ fontSize: "1.25rem" }}>
            A new kind of space where residents, city teams, researchers, and organizations
            collaborate on the challenges shaping our neighborhoods.
          </p>
          <div className="cf-actions" style={{ marginTop: "1.5rem", gap: "1rem" }}>
            <ButtonLink to="/events" variant="white" className="cf-btn--lg">
              See Upcoming Events
            </ButtonLink>
            <ButtonLink
              to="/feedback"
              variant="secondary"
              className="cf-btn--lg"
              style={{
                borderColor: "rgba(255,255,255,0.25)",
                color: "#fff",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(4px)"
              }}
            >
              Share Your Feedback
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Wave: hero → white */}
      <WaveDivider from="var(--espoo-night)" to="#ffffff" />

      {/* ═══════════════════════════════════════════════════════
          SERVICE CARDS — Espoo.fi-style icon grid
          ═══════════════════════════════════════════════════════ */}
      <section className="cf-section" style={{ paddingTop: "2rem" }}>
        <div className="cf-container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="cf-kicker cf-kicker--blue" style={{ justifyContent: "center" }}>What you can do</div>
            <h2 className="cf-h2">A Space for Collaboration</h2>
            <p className="cf-lead" style={{ margin: "0 auto" }}>
              City Factory is an urban innovation platform by the City of Espoo. Here's what it makes possible.
            </p>
          </div>

          <div className="cf-grid cf-grid--2">
            <Link to="/events" className="cf-service-card">
              <div className="cf-service-card__icon cf-service-card__icon--blue">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" fill="currentColor"/></svg>
              </div>
              <div className="cf-service-card__body">
                <div className="cf-service-card__title">Events &amp; Workshops</div>
                <div className="cf-service-card__desc">
                  Open nights, Q&amp;A sessions, community workshops — all free and welcoming.
                </div>
              </div>
            </Link>

            <Link to="/feedback" className="cf-service-card">
              <div className="cf-service-card__icon cf-service-card__icon--berry">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" fill="currentColor"/></svg>
              </div>
              <div className="cf-service-card__body">
                <div className="cf-service-card__title">Give Feedback</div>
                <div className="cf-service-card__desc">
                  Share ideas, report issues, ask questions — every submission gets a response.
                </div>
              </div>
            </Link>

            <Link to="/projects" className="cf-service-card">
              <div className="cf-service-card__icon cf-service-card__icon--grass">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/></svg>
              </div>
              <div className="cf-service-card__body">
                <div className="cf-service-card__title">City Projects</div>
                <div className="cf-service-card__desc">
                  See what's being planned, built, or tested in your neighborhood.
                </div>
              </div>
            </Link>

            <Link to="/contact" className="cf-service-card">
              <div className="cf-service-card__icon cf-service-card__icon--lilac">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/></svg>
              </div>
              <div className="cf-service-card__body">
                <div className="cf-service-card__title">Book a Session</div>
                <div className="cf-service-card__desc">
                  Talk directly to city staff about housing, transport, permits, and more.
                </div>
              </div>
            </Link>

            <Link to="/get-involved" className="cf-service-card">
              <div className="cf-service-card__icon cf-service-card__icon--sunflower">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/></svg>
              </div>
              <div className="cf-service-card__body">
                <div className="cf-service-card__title">Collaborate &amp; Partner</div>
                <div className="cf-service-card__desc">
                  Researchers, students, companies, NGOs — work with us on urban challenges.
                </div>
              </div>
            </Link>

            <Link to="/get-involved" className="cf-service-card">
              <div className="cf-service-card__icon cf-service-card__icon--peach">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg>
              </div>
              <div className="cf-service-card__body">
                <div className="cf-service-card__title">Volunteer</div>
                <div className="cf-service-card__desc">
                  Help with events, outreach, translation, documentation, and more.
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Wave: white → powder/peach */}
      <WaveDivider from="#ffffff" to="var(--espoo-powder)" />

      {/* ═══════════════════════════════════════════════════════
          CTA BANNER — Warm powder background
          ═══════════════════════════════════════════════════════ */}
      <section className="cf-section--powder cf-cta-banner">
        <div className="cf-container cf-cta-banner__inner">
          <div className="cf-kicker cf-kicker--blue" style={{ justifyContent: "center", marginBottom: "0.75rem" }}>Built with you, not for you</div>
          <h2 className="cf-h2" style={{ maxWidth: "22ch", margin: "0 auto 1rem" }}>
            City Factory is currently in development
          </h2>
          <p className="cf-lead" style={{ margin: "0 auto 1.5rem", textAlign: "center", maxWidth: "50ch" }}>
            This platform is how we're building it — with you. Your ideas, feedback, and participation
            shape what City Factory becomes.
          </p>
          <div className="cf-actions" style={{ justifyContent: "center" }}>
            <ButtonLink to="/get-involved" className="cf-btn--lg">Ways to participate</ButtonLink>
            <ButtonLink to="/contact" variant="secondary" className="cf-btn--lg">Contact the team</ButtonLink>
          </div>
        </div>
      </section>

      {/* Wave: powder → white */}
      <WaveDivider from="var(--espoo-powder)" to="#ffffff" />

      {/* ═══════════════════════════════════════════════════════
          UPCOMING EVENTS
          ═══════════════════════════════════════════════════════ */}
      <section className="cf-section" style={{ paddingTop: "2rem" }}>
        <div className="cf-container">
          <div className="cf-section-header">
            <div>
              <div className="cf-overline">What's happening</div>
              <h2 className="cf-h2" style={{ margin: 0 }}>Upcoming Events</h2>
              <p className="cf-lead" style={{ marginTop: "0.25rem" }}>
                Workshops, open sessions, and community events — free and open to everyone.
              </p>
            </div>
            <ButtonLink to="/events" variant="secondary">See all events</ButtonLink>
          </div>

          {eventsError ? <div className="cf-alert cf-alert--error">{eventsError}</div> : null}

          <div className="cf-grid cf-grid--2">
            {(events ?? Array.from({ length: 4 }).map(() => null)).map((ev, idx) => {
              if (!ev) {
                return (
                  <Card key={`skeleton-${idx}`}>
                    <div className="cf-skeleton cf-skeleton--title" style={{ marginBottom: "0.5rem" }} />
                    <div className="cf-skeleton cf-skeleton--text" style={{ marginBottom: "0.35rem" }} />
                    <div className="cf-skeleton cf-skeleton--text" style={{ width: "50%" }} />
                  </Card>
                );
              }

              const title = preferredText(ev.name) || "Untitled event";
              const when = ev.start_time ? formatDateTime(ev.start_time) : "Time to be confirmed";
              const where = preferredText(ev.location?.name) || preferredText(ev.location?.street_address) || "Location to be confirmed";
              const desc = truncate(preferredText(ev.short_description) || preferredText(ev.description) || "", 120);

              return (
                <Card key={ev.id}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    {/* Date badge */}
                    <div style={{
                      width: 52, minWidth: 52, textAlign: "center",
                      background: "var(--cf-primary-light)", borderRadius: "var(--cf-radius)",
                      padding: "0.5rem 0.25rem", flexShrink: 0
                    }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--espoo-blue)", textTransform: "uppercase" }}>
                        {ev.start_time ? new Date(ev.start_time).toLocaleDateString("en", { month: "short" }) : "TBC"}
                      </div>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--espoo-night)", lineHeight: 1 }}>
                        {ev.start_time ? new Date(ev.start_time).getDate() : "?"}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="cf-card__title">{title}</div>
                      <div className="cf-card__meta">{when} &middot; {where}</div>
                      {desc ? <p style={{ margin: "0.25rem 0 0", color: "var(--cf-text-secondary)", fontSize: "0.9rem" }}>{desc}</p> : null}
                    </div>
                  </div>
                  <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--cf-border-light)" }}>
                    <ButtonLink to={eventPath(ev.id)} variant="ghost" style={{ padding: "0.25rem 0" }}>
                      Learn more &rarr;
                    </ButtonLink>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PROJECTS — On light blue bg
          ═══════════════════════════════════════════════════════ */}
      <section className="cf-section" style={{ background: "var(--cf-primary-subtle)" }}>
        <div className="cf-container">
          <div className="cf-section-header">
            <div>
              <div className="cf-overline">Transparency</div>
              <h2 className="cf-h2" style={{ margin: 0 }}>What Espoo Is Working On</h2>
              <p className="cf-lead" style={{ marginTop: "0.25rem" }}>
                City projects move through stages: idea &rarr; planning &rarr; testing &rarr; implementation.
              </p>
            </div>
            <ButtonLink to="/projects" variant="secondary">See all projects</ButtonLink>
          </div>

          <div className="cf-grid cf-grid--3">
            {featuredProjects.map((p) => (
              <Card key={p.slug} className="cf-card--interactive" style={{ cursor: "default" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <Badge tone={statusToTone(p.status)}>{p.status}</Badge>
                  <span style={{ fontSize: "0.8rem", color: "var(--cf-text-muted)", fontWeight: 600 }}>{p.area}</span>
                </div>
                <div className="cf-card__title" style={{ fontSize: "1.1rem" }}>{p.title}</div>
                <p style={{ margin: "0.35rem 0 1rem", color: "var(--cf-text-secondary)", fontSize: "0.925rem", lineHeight: 1.55 }}>
                  {truncate(p.description, 130)}
                </p>
                <ButtonLink to={`/projects/${p.slug}`} variant="ghost" style={{ padding: "0.25rem 0" }}>
                  Learn more &rarr;
                </ButtonLink>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          GET INVOLVED — Bold night-blue section
          ═══════════════════════════════════════════════════════ */}
      <section className="cf-section cf-section--night" style={{ position: "relative", overflow: "hidden" }}>
        {/* Decorative blobs */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", width: 300, height: 300, top: "-10%", right: "-5%",
            borderRadius: "50% 40% 60% 40% / 40% 50% 40% 60%",
            background: "rgba(0, 80, 187, 0.3)"
          }} />
          <div style={{
            position: "absolute", width: 200, height: 200, bottom: "-8%", left: "10%",
            borderRadius: "40% 60% 50% 50% / 50% 40% 60% 50%",
            background: "rgba(157, 133, 229, 0.15)"
          }} />
        </div>

        <div className="cf-container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="cf-kicker" style={{ color: "var(--espoo-sunflower)", justifyContent: "center" }}>
              Participate
            </div>
            <h2 className="cf-h2" style={{ color: "#fff" }}>This Is Your City Too</h2>
            <p className="cf-lead" style={{ color: "rgba(255,255,255,0.75)", margin: "0 auto" }}>
              City Factory isn't built for you — it's built with you.
            </p>
          </div>

          <div className="cf-grid cf-grid--3">
            <div style={{
              background: "rgba(255,255,255,0.08)", borderRadius: "var(--cf-radius-xl)",
              padding: "2.25rem 1.5rem", textAlign: "center", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)", transition: "all var(--cf-transition-slow)"
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 1.25rem",
                background: "rgba(255, 220, 71, 0.15)", color: "var(--espoo-sunflower)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" fill="currentColor"/></svg>
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.25rem" }}>Attend</div>
              <div style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1.25rem", fontSize: "0.925rem", lineHeight: 1.5 }}>
                Join workshops, Q&amp;A sessions, and open nights. All events are free.
              </div>
              <ButtonLink to="/events" variant="white">See events</ButtonLink>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.08)", borderRadius: "var(--cf-radius-xl)",
              padding: "2.25rem 1.5rem", textAlign: "center", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 1.25rem",
                background: "rgba(252, 165, 199, 0.2)", color: "var(--espoo-berry)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" fill="currentColor"/></svg>
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.25rem" }}>Share</div>
              <div style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1.25rem", fontSize: "0.925rem", lineHeight: 1.5 }}>
                Have an idea? Spotted a problem? Every submission gets a response.
              </div>
              <ButtonLink to="/feedback" variant="white">Submit feedback</ButtonLink>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.08)", borderRadius: "var(--cf-radius-xl)",
              padding: "2.25rem 1.5rem", textAlign: "center", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", margin: "0 auto 1.25rem",
                background: "rgba(138, 201, 135, 0.2)", color: "var(--espoo-grass)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/></svg>
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.25rem" }}>Connect</div>
              <div style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1.25rem", fontSize: "0.925rem", lineHeight: 1.5 }}>
                Talk directly to city staff about housing, transport, and local projects.
              </div>
              <ButtonLink to="/contact" variant="white">Book time</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS BAR — Quick numbers
          ═══════════════════════════════════════════════════════ */}
      <section style={{
        background: "var(--espoo-blue)", padding: "3rem 0",
        position: "relative", overflow: "hidden"
      }}>
        <div className="cf-container">
          <div className="cf-grid cf-grid--3" style={{ textAlign: "center", color: "#fff" }}>
            <div className="cf-stat">
              <div className="cf-stat__number" style={{ color: "var(--espoo-sunflower)" }}>155</div>
              <div className="cf-stat__label">Nationalities in Espoo</div>
            </div>
            <div className="cf-stat">
              <div className="cf-stat__number" style={{ color: "var(--espoo-berry)" }}>60%</div>
              <div className="cf-stat__label">Of European patents from Espoo</div>
            </div>
            <div className="cf-stat">
              <div className="cf-stat__number" style={{ color: "var(--espoo-grass)" }}>5</div>
              <div className="cf-stat__label">City districts collaborating</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
