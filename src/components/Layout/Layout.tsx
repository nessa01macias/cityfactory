import { NavLink, Outlet } from "react-router-dom";
import { useMemo, useState } from "react";
import "./layout.css";
import { useLanguage } from "../../state/language";
import { useTranslation } from "../../i18n/useTranslation";
import espooLogo from "../../utils/espoo logo.png";

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
  const t = useTranslation();

  const navItems = useMemo(
    () => [
      { to: "/", label: t.nav.home },
      { to: "/events", label: t.nav.events },
      { to: "/projects", label: t.nav.projects },
      { to: "/get-involved", label: t.nav.getInvolved },
      { to: "/facilities", label: t.nav.facilities },
      { to: "/feedback", label: t.nav.feedback },
      { to: "/contact", label: t.nav.contact },
    ],
    [t]
  );

  const navLinks = useMemo(
    () =>
      navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setMobileOpen(false)}
          end={item.to === "/"}
        >
          {item.label}
        </NavLink>
      )),
    [navItems]
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
        {t.header.skipToContent}
      </a>

      <header className="cf-header">
        <div className="cf-container cf-header__inner">
          <NavLink to="/" className="cf-brand" aria-label={t.header.homeAriaLabel} end>
            <img src={espooLogo} alt="" className="cf-brand__logo" />
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
              aria-label={t.header.switchLang}
              title={t.header.language}
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
              <span>{t.header.menu}</span>
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
                <img src={espooLogo} alt="" className="cf-brand__logo" />
                <span className="cf-brand__text">
                  <span className="cf-brand__name">City Factory</span>
                  <span className="cf-brand__sub">ESPOO</span>
                </span>
              </div>
              <p className="cf-footer__desc">
                {t.footer.tagline}
              </p>
            </div>

            <div className="cf-footer__links-grid">
              <div>
                <div className="cf-footer__links-heading">{t.footer.platform}</div>
                <div className="cf-footer__links">
                  <NavLink to="/" end>{t.nav.home}</NavLink>
                  <NavLink to="/events">{t.nav.events}</NavLink>
                  <NavLink to="/projects">{t.nav.projects}</NavLink>
                </div>
              </div>
              <div>
                <div className="cf-footer__links-heading">{t.footer.participate}</div>
                <div className="cf-footer__links">
                  <NavLink to="/get-involved">{t.nav.getInvolved}</NavLink>
                  <NavLink to="/feedback">{t.nav.feedback}</NavLink>
                  <NavLink to="/contact">{t.nav.contact}</NavLink>
                </div>
              </div>
              <div>
                <div className="cf-footer__links-heading">{t.footer.contact}</div>
                <div className="cf-footer__links">
                  <a href="mailto:cityfactoryespoo@gmail.com">cityfactoryespoo@gmail.com</a>
                  <a href="https://instagram.com/cityfactoryespoo" target="_blank" rel="noopener noreferrer">@cityfactoryespoo</a>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
                    {t.footer.locationSoon}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="cf-footer__divider" />

          <div className="cf-footer__bottom">
            <div className="cf-footer__meta">
              {t.footer.meta}
            </div>
            <button
              type="button"
              className="cf-iconbtn"
              onClick={toggleLanguage}
              aria-label={t.header.switchLang}
              style={{
                background: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.7)"
              }}
            >
              <GlobeIcon />
              {t.footer.langLabel}
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
