import { Card } from "../../components/ui/Card";
import { ButtonLink } from "../../components/ui/Button";
import "../page.css";

export function GetInvolvedPage() {
  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">Get Involved</h1>
          <p className="cf-lead">
            City Factory is built with you, not just for you. Whether you're a resident, researcher, company, or
            community group — here's how to participate.
          </p>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          <h2 className="cf-h2">For Espoo Residents</h2>
          <p className="cf-lead" style={{ marginBottom: "1.25rem" }}>You don't need to be an expert to shape your city. Here's how to get started:</p>

          <div className="cf-grid cf-grid--2">
            <Card className="cf-icon-card">
              <div className="cf-icon-card__icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" fill="currentColor"/></svg>
              </div>
              <div className="cf-icon-card__title">Attend an event</div>
              <p style={{ margin: "0 0 1rem", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>
                Join a workshop, Q&amp;A session, or open night. Meet city staff, learn about projects, share your
                perspective. All events are free.
              </p>
              <ButtonLink to="/events" variant="secondary">
                See events
              </ButtonLink>
            </Card>
            <Card className="cf-icon-card">
              <div className="cf-icon-card__icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" fill="currentColor"/></svg>
              </div>
              <div className="cf-icon-card__title">Give feedback</div>
              <p style={{ margin: "0 0 1rem", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>
                Have an idea? Spotted a problem? Tell us. Every submission is read, and you can track what happens next.
              </p>
              <ButtonLink to="/feedback" variant="secondary">
                Submit feedback
              </ButtonLink>
            </Card>
            <Card className="cf-icon-card">
              <div className="cf-icon-card__icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/></svg>
              </div>
              <div className="cf-icon-card__title">Book a session</div>
              <p style={{ margin: "0 0 1rem", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>
                Want to talk to someone from the city about housing, transport, permits, or a local project? Book a
                short session with city staff.
              </p>
              <ButtonLink to="/contact" variant="secondary">
                Book time
              </ButtonLink>
            </Card>
            <Card className="cf-icon-card">
              <div className="cf-icon-card__icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/></svg>
              </div>
              <div className="cf-icon-card__title">Follow a project</div>
              <p style={{ margin: "0 0 1rem", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>
                Interested in a specific project? Follow it to get updates when things change.
              </p>
              <ButtonLink to="/projects" variant="secondary">
                See projects
              </ButtonLink>
            </Card>
          </div>
        </div>
      </section>

      <section className="cf-section cf-section--muted">
        <div className="cf-container">
          <h2 className="cf-h2">For Organizations</h2>
          <p className="cf-lead" style={{ marginBottom: "1.25rem" }}>
            Companies, NGOs, research institutions, startups, and community groups can partner with City Factory on
            urban challenges.
          </p>

          <Card>
            <p style={{ marginTop: 0, lineHeight: 1.65 }}>
              City Factory brings together cross-sector partners to work on real city problems. If you have:
            </p>
            <ul className="cf-feature-list">
              <li>
                <span className="cf-feature-list__icon" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                </span>
                <span><strong>A project idea</strong> that could benefit Espoo residents</span>
              </li>
              <li>
                <span className="cf-feature-list__icon" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                </span>
                <span><strong>Expertise or resources</strong> to contribute to ongoing work</span>
              </li>
              <li>
                <span className="cf-feature-list__icon" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                </span>
                <span><strong>Research questions</strong> that need real-world testing</span>
              </li>
              <li>
                <span className="cf-feature-list__icon" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                </span>
                <span><strong>A community</strong> you want to connect with city services</span>
              </li>
            </ul>
            <p style={{ margin: "1rem 0 1.25rem", color: "var(--cf-text-secondary)", lineHeight: 1.6 }}>
              What partnership looks like: co-creation with city teams and residents, access to real environments for
              testing, connections across sectors, and visibility through City Factory communications.
            </p>
            <ButtonLink to="/contact">
              Contact us about partnership
            </ButtonLink>
          </Card>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-grid cf-grid--2">
            <div>
              <h2 className="cf-h2">For Students and Researchers</h2>
              <p className="cf-lead" style={{ marginBottom: "1.25rem" }}>
                City Factory is a living lab for urban research. If you're a student or researcher — there are opportunities to collaborate.
              </p>
              <Card>
                <ul className="cf-feature-list">
                  <li>
                    <span className="cf-feature-list__icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                    </span>
                    <span>Join a project as a thesis worker or research assistant</span>
                  </li>
                  <li>
                    <span className="cf-feature-list__icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                    </span>
                    <span>Propose a research collaboration</span>
                  </li>
                  <li>
                    <span className="cf-feature-list__icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                    </span>
                    <span>Attend events to connect with practitioners</span>
                  </li>
                  <li>
                    <span className="cf-feature-list__icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                    </span>
                    <span>Access city data for academic research</span>
                  </li>
                </ul>
                <div style={{ height: "1rem" }} />
                <ButtonLink to="/contact">
                  Contact us about research
                </ButtonLink>
              </Card>
            </div>

            <div>
              <h2 className="cf-h2">Volunteer with City Factory</h2>
              <p className="cf-lead" style={{ marginBottom: "1.25rem" }}>We're looking for people who want to help make City Factory happen.</p>
              <Card>
                <ul className="cf-feature-list">
                  <li>
                    <span className="cf-feature-list__icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                    </span>
                    <span>Event support (setup, registration, facilitation)</span>
                  </li>
                  <li>
                    <span className="cf-feature-list__icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                    </span>
                    <span>Community outreach in your neighborhood</span>
                  </li>
                  <li>
                    <span className="cf-feature-list__icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                    </span>
                    <span>Translation (Finnish, English, other languages)</span>
                  </li>
                  <li>
                    <span className="cf-feature-list__icon" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>
                    </span>
                    <span>Documentation (photography, writing)</span>
                  </li>
                </ul>
                <div style={{ height: "1rem" }} />
                <ButtonLink to="/contact">
                  Contact us about volunteering
                </ButtonLink>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
