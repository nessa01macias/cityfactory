import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ButtonLink } from "../../components/ui/Button";
import { fetchAllProjects, type Project, type ProjectStatus } from "../../api/projects";
import { formatDate, truncate } from "../../utils/format";
import { statusToTone } from "../../utils/projectStatus";
import { useTranslation } from "../../i18n/useTranslation";
import "../page.css";

const STATUS_KEYS: (ProjectStatus | "All")[] = [
  "All", "Idea", "Research", "Planning", "Testing", "Implementation", "Completed"
];

const PIPELINE_NUMS = [1, 2, 3, 4, 5, 6] as const;
const PIPELINE_KEYS = ["idea", "research", "planning", "testing", "implementation", "evaluation"] as const;

export function ProjectsPage() {
  const t = useTranslation();
  const tp = t.projects;

  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<(typeof STATUS_KEYS)[number]>("All");
  const [topic, setTopic] = useState<string>("All");
  const [area, setArea] = useState<string>("All");
  const [source, setSource] = useState<string>("all");

  useEffect(() => {
    const ac = new AbortController();
    fetchAllProjects({ signal: ac.signal })
      .then(setProjects)
      .catch((e: unknown) => {
        if ((e as { name?: string })?.name === "AbortError") return;
        setError(tp.error);
      });
    return () => ac.abort();
  }, [tp.error]);

  const topics = useMemo(() => {
    if (!projects) return [tp.all];
    const set = new Set<string>();
    for (const p of projects) for (const t of p.topics) set.add(t);
    return [tp.all, ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects, tp.all]);

  const areas = useMemo(() => {
    if (!projects) return [tp.all];
    const set = new Set<string>();
    for (const p of projects) set.add(p.area);
    return [tp.all, ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects, tp.all]);

  const filtered = useMemo(() => {
    if (!projects) return null;
    return projects.filter((p) => {
      if (status !== "All" && p.status !== status) return false;
      if (topic !== tp.all && !p.topics.includes(topic)) return false;
      if (area !== tp.all && p.area !== area) return false;
      if (source !== "all" && p.source !== source) return false;
      return true;
    });
  }, [projects, status, topic, area, source, tp.all]);

  const sourceOptions = useMemo(() => [
    { value: "all", label: tp.allSources },
    { value: "espoo", label: tp.espooSource },
    { value: "helsinki", label: tp.helsinkiSource },
  ], [tp]);

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">{tp.title}</h1>
          <p className="cf-lead">{tp.lead}</p>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          <h2 className="cf-h2">{tp.pipelineTitle}</h2>

          <div className="cf-pipeline" role="list" aria-label="Project stages">
            {PIPELINE_NUMS.map((num, i) => (
              <div className="cf-pipeline__step" key={num} role="listitem">
                <span className="cf-pipeline__label">
                  <span className="cf-pipeline__num">{num}</span>
                  {tp.stages[PIPELINE_KEYS[i]]}
                </span>
                {i < PIPELINE_NUMS.length - 1 ? (
                  <span className="cf-pipeline__arrow" aria-hidden="true">&rarr;</span>
                ) : null}
              </div>
            ))}
          </div>

          <p style={{ margin: "1rem 0 0", color: "var(--cf-text-secondary)", maxWidth: "70ch" }}>{tp.pipelineNote}</p>

          <div style={{ height: "2rem" }} />

          <h2 className="cf-h2">{tp.browseTitle}</h2>
          <div className="cf-grid cf-grid--2" style={{ marginBottom: "0.5rem" }}>
            <div className="cf-field">
              <label className="cf-label" htmlFor="source">{tp.sourceLabel}</label>
              <select className="cf-select" id="source" value={source} onChange={(e) => setSource(e.target.value)}>
                {sourceOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="cf-field">
              <label className="cf-label" htmlFor="status">{tp.statusLabel}</label>
              <select className="cf-select" id="status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                {STATUS_KEYS.map((s) => (
                  <option key={s} value={s}>{s === "All" ? tp.all : tp.stages[s.toLowerCase() as keyof typeof tp.stages] ?? s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="cf-grid cf-grid--2">
            <div className="cf-field">
              <label className="cf-label" htmlFor="topic">{tp.topicLabel}</label>
              <select className="cf-select" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {topics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="cf-field">
              <label className="cf-label" htmlFor="area">{tp.areaLabel}</label>
              <select className="cf-select" id="area" value={area} onChange={(e) => setArea(e.target.value)}>
                {areas.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ height: "1.5rem" }} />

          {error ? <div className="cf-alert cf-alert--error">{error}</div> : null}

          <div className="cf-grid cf-grid--3">
            {(filtered ?? Array.from({ length: 6 }).map(() => null)).map((p, idx) => {
              if (!p) {
                return (
                  <Card key={`skeleton-${idx}`}>
                    <div className="cf-skeleton cf-skeleton--title" style={{ marginBottom: "0.5rem" }} />
                    <div className="cf-skeleton cf-skeleton--text" style={{ marginBottom: "0.35rem" }} />
                    <div className="cf-skeleton cf-skeleton--text" style={{ width: "60%" }} />
                  </Card>
                );
              }

              return (
                <Card key={p.slug}>
                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="cf-card__img" loading="lazy" /> : null}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <Badge tone={statusToTone(p.status)}>{p.status}</Badge>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Badge tone={`source-${p.source}`}>{p.source === "espoo" ? "Espoo" : "Helsinki"}</Badge>
                      {p.area !== "Helsinki" && p.area !== "Espoo" && (
                        <span style={{ fontSize: "0.8rem", color: "var(--cf-text-muted)" }}>{p.area}</span>
                      )}
                    </div>
                  </div>
                  <div className="cf-card__title">{p.title}</div>
                  <div className="cf-tags" style={{ margin: "0.35rem 0 0.5rem" }}>
                    {p.topics.slice(0, 3).map((t) => (<span key={t} className="cf-tag">{t}</span>))}
                  </div>
                  <p style={{ margin: "0 0 0.75rem", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>{truncate(p.description, 150)}</p>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <ButtonLink to={`/projects/${p.slug}`} variant="ghost" style={{ padding: "0.5rem 0" }}>{tp.learnMore}</ButtonLink>
                    {p.externalUrl ? (
                      <a href={p.externalUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.85rem", color: "var(--cf-primary)" }}>{tp.externalLink}</a>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>

          {filtered && filtered.length === 0 ? (
            <div className="cf-alert cf-alert--info" style={{ marginTop: "1.5rem" }}>{tp.noResults}</div>
          ) : null}

          <div style={{ height: "2.5rem" }} />

          <Card className="cf-card--blue">
            <div className="cf-card__title">{tp.ideaTitle}</div>
            <p className="cf-card__meta">{tp.ideaDesc}</p>
            <ButtonLink to="/feedback">{tp.submitIdea}</ButtonLink>
          </Card>
        </div>
      </section>
    </>
  );
}
