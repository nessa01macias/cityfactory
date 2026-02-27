import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { ButtonLink } from "../../components/ui/Button";
import "../page.css";

export function NotFoundPage() {
  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">Page not found</h1>
          <p className="cf-lead">That page doesn’t exist. If you followed a link, it may have changed.</p>
        </div>
      </section>
      <section className="cf-section">
        <div className="cf-container">
          <Card>
            <p style={{ marginTop: 0 }}>
              Go back to <Link to="/">Home</Link> or browse:
            </p>
            <div className="cf-actions" style={{ marginTop: 0 }}>
              <ButtonLink to="/events" variant="secondary">
                Events
              </ButtonLink>
              <ButtonLink to="/projects" variant="secondary">
                Projects
              </ButtonLink>
              <ButtonLink to="/feedback" variant="secondary">
                Feedback
              </ButtonLink>
              <ButtonLink to="/contact" variant="secondary">
                Contact
              </ButtonLink>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}

