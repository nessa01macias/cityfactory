import { NavLink, Outlet } from "react-router-dom";
import { useMemo, useState } from "react";
import "./layout.css";
import { useLanguage } from "../../state/language";

type NavItem = { to: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/projects", label: "Projects" },
  { to: "/get-involved", label: "Get Involved" },
  { to: "/facilities", label: "Facilities" },
  { to: "/feedback", label: "Feedback" },
  { to: "/contact", label: "Contact" }
];

/* Clean SVG recreation of the official Espoo swirl mark */
function EspooSwirl({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Outer swirl arc — large open ellipse going counterclockwise */}
      <path
        d="M33 35C26 42 8 38 5 24 2 10 13 1 27 4c10 2 15 10 14 18"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner swirl arc — smaller offset ellipse creating the overlap */}
      <path
        d="M35 18c1 10-6 20-17 18S3 22 9 13c4-6 11-8 18-5"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="8" cy="8" rx="3" ry="6.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="1.5" y1="8" x2="14.5" y2="8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {open ? (
        <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <>
          <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  const navLinks = useMemo(
    () =>
      NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setMobileOpen(false)}
          end={item.to === "/"}
        >
          {item.label}
        </NavLink>
      )),
    []
  );

  return (
    <>
      <a
        href="#main"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "0"
        }}
        onFocus={(e) => {
          const el = e.currentTarget;
          el.style.left = "1rem";
          el.style.top = "1rem";
          el.style.background = "#fff";
          el.style.padding = "0.5rem 0.75rem";
          el.style.border = "2px solid var(--cf-focus)";
          el.style.borderRadius = "12px";
          el.style.zIndex = "1000";
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = "-9999px";
        }}
      >
        Skip to content
      </a>

      <header className="cf-header">
        <div className="cf-container cf-header__inner">
          <NavLink to="/" className="cf-brand" aria-label="City Factory home" end>
            <span className="cf-brand__mark">
              <EspooSwirl />
            </span>
            <span className="cf-brand__text">
              <span className="cf-brand__name">City Factory</span>
              <span className="cf-brand__sub">ESPOO</span>
            </span>
          </NavLink>

          <nav className="cf-nav" aria-label="Primary navigation">
            {navLinks}
          </nav>

          <div className="cf-header__actions">
            <button
              type="button"
              className="cf-iconbtn"
              onClick={toggleLanguage}
              aria-label={`Switch to ${language === "EN" ? "Finnish" : "English"}`}
              title="Language"
            >
              <GlobeIcon />
              {language}
            </button>
            <button
              type="button"
              className="cf-iconbtn cf-header__burger"
              aria-expanded={mobileOpen}
              aria-controls="cf-mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <MenuIcon open={mobileOpen} />
              <span>Menu</span>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="cf-mobileMenu" id="cf-mobile-menu">
            <div className="cf-container cf-mobileMenu__inner" aria-label="Mobile navigation">
              {navLinks}
            </div>
          </div>
        ) : null}
      </header>

      <main className="cf-main" id="main">
        <Outlet />
      </main>

      <footer className="cf-footer">
        <div className="cf-container cf-footer__inner">
          <div className="cf-footer__top">
            <div>
              <div className="cf-brand" aria-label="City Factory">
                <span className="cf-brand__mark">
                  <EspooSwirl />
                </span>
                <span className="cf-brand__text">
                  <span className="cf-brand__name">City Factory</span>
                  <span className="cf-brand__sub">ESPOO</span>
                </span>
              </div>
              <p className="cf-footer__desc">
                An urban innovation platform by the City of Espoo. Building the future of our city — together.
              </p>
            </div>

            <div className="cf-footer__links-grid">
              <div>
                <div className="cf-footer__links-heading">Platform</div>
                <div className="cf-footer__links">
                  <NavLink to="/" end>Home</NavLink>
                  <NavLink to="/events">Events</NavLink>
                  <NavLink to="/projects">Projects</NavLink>
                </div>
              </div>
              <div>
                <div className="cf-footer__links-heading">Participate</div>
                <div className="cf-footer__links">
                  <NavLink to="/get-involved">Get Involved</NavLink>
                  <NavLink to="/feedback">Feedback</NavLink>
                  <NavLink to="/contact">Contact</NavLink>
                </div>
              </div>
              <div>
                <div className="cf-footer__links-heading">Contact</div>
                <div className="cf-footer__links">
                  <a href="mailto:cityfactory@espoo.fi">cityfactory@espoo.fi</a>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
                    Physical location coming soon
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="cf-footer__divider" />

          <div className="cf-footer__bottom">
            <div className="cf-footer__meta">
              City Factory is a project of the City of Espoo.
            </div>
            <button
              type="button"
              className="cf-iconbtn"
              onClick={toggleLanguage}
              aria-label="Toggle language"
              style={{
                background: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.7)"
              }}
            >
              <GlobeIcon />
              {language === "EN" ? "In English" : "Suomeksi"}
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
