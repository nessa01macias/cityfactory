import { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ButtonLink } from "../../components/ui/Button";
import { PROJECTS, type ProjectStatus } from "../../data/projects";
import { formatDate, truncate } from "../../utils/format";
import { statusToTone } from "../../utils/projectStatus";
import "../page.css";

const STATUSES: (ProjectStatus | "All")[] = [
  "All",
  "Idea",
  "Research",
  "Planning",
  "Testing",
  "Implementation",
  "Completed"
];

const PIPELINE_STAGES = [
  { num: 1, label: "Idea" },
  { num: 2, label: "Research" },
  { num: 3, label: "Planning" },
  { num: 4, label: "Testing" },
  { num: 5, label: "Implementation" },
  { num: 6, label: "Evaluation" }
];

export function ProjectsPage() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [topic, setTopic] = useState<string>("All");
  const [area, setArea] = useState<string>("All");

  const topics = useMemo(() => {
    const set = new Set<string>();
    for (const p of PROJECTS) for (const t of p.topics) set.add(t);
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, []);

  const areas = useMemo(() => {
    const set = new Set<string>();
    for (const p of PROJECTS) set.add(p.area);
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, []);

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (status !== "All" && p.status !== status) return false;
      if (topic !== "All" && !p.topics.includes(topic)) return false;
      if (area !== "All" && p.area !== area) return false;
      return true;
    });
  }, [status, topic, area]);

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">Projects</h1>
          <p className="cf-lead">
            What is the City of Espoo working on right now? Here you can see city projects at every stage — from early
            ideas to completed work. We believe transparency builds trust.
          </p>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          <h2 className="cf-h2">How City Projects Move Forward</h2>

          <div className="cf-pipeline" role="list" aria-label="Project stages">
            {PIPELINE_STAGES.map((stage, i) => (
              <div className="cf-pipeline__step" key={stage.label} role="listitem">
                <span className="cf-pipeline__label">
                  <span className="cf-pipeline__num">{stage.num}</span>
                  {stage.label}
                </span>
                {i < PIPELINE_STAGES.length - 1 ? (
                  <span className="cf-pipeline__arrow" aria-hidden="true">&rarr;</span>
                ) : null}
              </div>
            ))}
          </div>

          <p style={{ margin: "1rem 0 0", color: "var(--cf-text-secondary)", maxWidth: "70ch" }}>
            Not every idea becomes a project, and not every project succeeds. That's okay — City Factory is about
            learning together. When something doesn't work, we share what we learned.
          </p>

          <div style={{ height: "2rem" }} />

          <h2 className="cf-h2">Browse projects</h2>
          <div className="cf-grid cf-grid--3">
            <div className="cf-field">
              <label className="cf-label" htmlFor="status">
                Status
              </label>
              <select className="cf-select" id="status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="cf-field">
              <label className="cf-label" htmlFor="topic">
                Topic
              </label>
              <select className="cf-select" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="cf-field">
              <label className="cf-label" htmlFor="area">
                Area
              </label>
              <select className="cf-select" id="area" value={area} onChange={(e) => setArea(e.target.value)}>
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ height: "1.5rem" }} />

          <div className="cf-grid cf-grid--3">
            {filtered.map((p) => (
              <Card key={p.slug}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <Badge tone={statusToTone(p.status)}>{p.status}</Badge>
                  <span style={{ fontSize: "0.8rem", color: "var(--cf-text-muted)" }}>
                    {p.area} &middot; {formatDate(p.lastUpdated)}
                  </span>
                </div>
                <div className="cf-card__title">{p.title}</div>
                <div className="cf-tags" style={{ margin: "0.35rem 0 0.5rem" }}>
                  {p.topics.map((t) => (
                    <span key={t} className="cf-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <p style={{ margin: "0 0 0.75rem", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>{truncate(p.description, 150)}</p>
                <ButtonLink to={`/projects/${p.slug}`} variant="ghost" style={{ padding: "0.5rem 0" }}>
                  Learn more &rarr;
                </ButtonLink>
              </Card>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="cf-alert cf-alert--info" style={{ marginTop: "1.5rem" }}>
              No projects matched those filters.
            </div>
          ) : null}

          <div style={{ height: "2.5rem" }} />

          <Card className="cf-card--blue">
            <div className="cf-card__title">Have an idea for Espoo?</div>
            <p className="cf-card__meta">
              If you have an idea for improving your neighborhood — big or small — submit it through our feedback form.
              The best ideas become real projects.
            </p>
            <ButtonLink to="/feedback">
              Submit an idea
            </ButtonLink>
          </Card>
        </div>
      </section>
    </>
  );
}
