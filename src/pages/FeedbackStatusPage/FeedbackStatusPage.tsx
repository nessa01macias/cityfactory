import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../supabaseClient";
import { normalizeReference, type FeedbackSubmission } from "../../storage/feedback";
import { formatDateTime } from "../../utils/format";
import { useTranslation } from "../../i18n/useTranslation";
import "../page.css";

function rowToSubmission(row: Record<string, unknown>): FeedbackSubmission {
  return {
    reference: String(row.reference ?? ""),
    createdAt: String(row.created_at ?? ""),
    lastUpdatedAt: String(row.last_updated_at ?? ""),
    type: (row.type as FeedbackSubmission["type"]) ?? "Other",
    topics: Array.isArray(row.topics) ? (row.topics as string[]) : [],
    area: row.area != null ? String(row.area) : null,
    areaOther: row.area_other != null ? String(row.area_other) : null,
    message: String(row.message ?? ""),
    email: row.email != null ? String(row.email) : null,
    name: row.name != null ? String(row.name) : null,
    status: (row.status as FeedbackSubmission["status"]) ?? "Received",
    publicNotes: row.public_notes != null ? String(row.public_notes) : null
  };
}

export function FeedbackStatusPage() {
  const t = useTranslation();
  const ts = t.feedbackStatus;

  const initialRef = useMemo(() => {
    const u = new URL(window.location.href);
    return u.searchParams.get("ref") || "";
  }, []);

  const [ref, setRef] = useState(initialRef);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FeedbackSubmission | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async (reference: string) => {
    setError(null);
    const norm = normalizeReference(reference);
    if (!norm) { setError(ts.errEmpty); return; }
    setLoading(true);
    const { data, error: dbError } = await supabase
      .from("feedback")
      .select("*")
      .eq("reference", norm)
      .maybeSingle();
    setLoading(false);
    if (dbError) { setError(ts.errLookup); return; }
    if (!data) { setError(ts.errNotFound); return; }
    setResult(rowToSubmission(data));
  };

  useEffect(() => {
    if (initialRef.trim()) void lookup(initialRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">{ts.title}</h1>
          <p className="cf-lead">{ts.lead}</p>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-grid cf-grid--2" style={{ alignItems: "start" }}>
            <Card>
              <div className="cf-card__title">{ts.lookupTitle}</div>
              <form onSubmit={(e) => { e.preventDefault(); void lookup(ref); }} className="cf-grid" style={{ gap: "0.75rem", marginTop: "0.75rem" }}>
                <div className="cf-field">
                  <label className="cf-label" htmlFor="ref">{ts.refLabel}</label>
                  <input id="ref" className="cf-input" value={ref} onChange={(e) => setRef(e.target.value)} placeholder={ts.refPlaceholder} />
                </div>
                <Button type="submit">{ts.checkButton}</Button>
              </form>
              {error ? <div className="cf-alert cf-alert--error" style={{ marginTop: "0.75rem" }}>{error}</div> : null}
            </Card>

            <Card>
              <div className="cf-card__title">{ts.statusTitle}</div>
              {result ? (
                <div className="cf-list" style={{ marginTop: "0.75rem" }}>
                  <div><strong>{ts.refDisplay}</strong> #{normalizeReference(result.reference)}</div>
                  <div><strong>{ts.dateSubmitted}</strong> {formatDateTime(result.createdAt)}</div>
                  <div><strong>{ts.type}</strong> {result.type}</div>
                  <div><strong>{ts.currentStatus}</strong> {result.status}</div>
                  <div><strong>{ts.lastUpdated}</strong> {formatDateTime(result.lastUpdatedAt)}</div>
                  {result.publicNotes ? <div><strong>{ts.notes}</strong> {result.publicNotes}</div> : null}
                </div>
              ) : (
                <p className="cf-card__meta" style={{ marginTop: "0.75rem" }}>{ts.emptyState}</p>
              )}
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
