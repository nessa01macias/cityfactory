import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../supabaseClient";
import { normalizeReference, type FeedbackSubmission } from "../../storage/feedback";
import { formatDateTime } from "../../utils/format";
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
    if (!norm) {
      setError("Enter a reference number (for example, #CF-20240301-1234).");
      return;
    }
    setLoading(true);
    const { data, error: dbError } = await supabase
      .from("feedback")
      .select("*")
      .eq("reference", norm)
      .maybeSingle();
    setLoading(false);
    if (dbError) {
      setError("We couldn't look up that reference right now. Please try again.");
      return;
    }
    if (!data) {
      setError("We couldn't find that reference number.");
      return;
    }
    setResult(rowToSubmission(data));
  };

  const _removed = () => {
    if (!found) {
      setError("We couldn’t find that reference number on this device.");
      setResult(null);
      return;
    }
    setResult(found);
  };

  useEffect(() => {
    if (initialRef.trim()) void lookup(initialRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">Check Submission Status</h1>
          <p className="cf-lead">
            Enter your reference number (for example, #CF-20240301-1234) to check the status of your submission.
          </p>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-grid cf-grid--2" style={{ alignItems: "start" }}>
            <Card>
              <div className="cf-card__title">Lookup</div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void lookup(ref);
                }}
                className="cf-grid"
                style={{ gap: "0.75rem", marginTop: "0.75rem" }}
              >
                <div className="cf-field">
                  <label className="cf-label" htmlFor="ref">
                    Reference number
                  </label>
                  <input
                    id="ref"
                    className="cf-input"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder="#CF-20240301-1234"
                  />
                </div>
                <Button type="submit">Check status</Button>
              </form>
              {error ? <div className="cf-alert cf-alert--error" style={{ marginTop: "0.75rem" }}>{error}</div> : null}
            </Card>

            <Card>
              <div className="cf-card__title">Status</div>
              {result ? (
                <div className="cf-list" style={{ marginTop: "0.75rem" }}>
                  <div>
                    <strong>Reference:</strong> #{normalizeReference(result.reference)}
                  </div>
                  <div>
                    <strong>Date submitted:</strong> {formatDateTime(result.createdAt)}
                  </div>
                  <div>
                    <strong>Type:</strong> {result.type}
                  </div>
                  <div>
                    <strong>Current status:</strong> {result.status}
                  </div>
                  <div>
                    <strong>Last updated:</strong> {formatDateTime(result.lastUpdatedAt)}
                  </div>
                  {result.publicNotes ? (
                    <div>
                      <strong>Notes:</strong> {result.publicNotes}
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="cf-card__meta" style={{ marginTop: "0.75rem" }}>
                  Enter a reference number to see details.
                </p>
              )}
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

