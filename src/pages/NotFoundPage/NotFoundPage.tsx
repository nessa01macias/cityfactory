import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { ButtonLink } from "../../components/ui/Button";
import { useTranslation } from "../../i18n/useTranslation";
import "../page.css";

export function NotFoundPage() {
  const t = useTranslation();

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">{t.notFound.title}</h1>
          <p className="cf-lead">{t.notFound.lead}</p>
        </div>
      </section>
      <section className="cf-section">
        <div className="cf-container">
          <Card>
            <p style={{ marginTop: 0 }}>
              {t.notFound.goBack.split("Home")[0]}<Link to="/">{t.nav.home}</Link>{t.notFound.goBack.split("Home")[1] || ":"}
            </p>
            <div className="cf-actions" style={{ marginTop: 0 }}>
              <ButtonLink to="/events" variant="secondary">{t.nav.events}</ButtonLink>
              <ButtonLink to="/projects" variant="secondary">{t.nav.projects}</ButtonLink>
              <ButtonLink to="/feedback" variant="secondary">{t.nav.feedback}</ButtonLink>
              <ButtonLink to="/contact" variant="secondary">{t.nav.contact}</ButtonLink>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
