import { useState, type FormEvent } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "../../i18n/useTranslation";
import "../page.css";

type FacilityOption = "Project room" | "Meeting room" | "Whole space";

export function FacilitiesPage() {
  const t = useTranslation();
  const tf = t.facilities;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [facility, setFacility] = useState<FacilityOption>("Project room");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toMinutes = (value: string) => {
    const [h, m] = value.split(":").map((n) => Number(n));
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError(tf.errName);
    if (!email.trim()) return setError(tf.errEmail);
    if (!facility) return setError(tf.errFacility);
    if (!date.trim()) return setError(tf.errDate);
    if (!startTime.trim()) return setError(tf.errStart);
    if (!endTime.trim()) return setError(tf.errEnd);

    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);
    if (startMinutes === null || endMinutes === null) {
      return setError(tf.errTimeFormat);
    }
    if (endMinutes <= startMinutes) {
      return setError(tf.errTimeOrder);
    }

    const { error: dbError } = await supabase.from("reservations").insert({
      name: name.trim(),
      email: email.trim(),
      organisation: organisation.trim() || null,
      facility,
      date,
      start_time: startTime,
      end_time: endTime,
      notes: notes.trim() || null
    });

    if (dbError) {
      return setError(tf.errSave);
    }

    setSent(true);
  };

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">{tf.title}</h1>
          <p className="cf-lead">{tf.lead}</p>
        </div>
      </section>

      <section className="cf-section">
        <div className="cf-container">
          <div className="cf-grid cf-grid--2" style={{ alignItems: "start" }}>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <Card>
                <div className="cf-card__title" style={{ marginBottom: "0.75rem" }}>{tf.spacesTitle}</div>
                <div className="cf-list">
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.15rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 5c0-1.1.9-2 2-2h14v14H5c-1.1 0-2-.9-2-2V5zm4 2v8h10V7H7zm-2 0H4v8h1V7z" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>{tf.projectRoom}</strong>
                      <p style={{ margin: "0.25rem 0 0", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>{tf.projectRoomDesc}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.15rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 6h16v2H4V6zm2 4h12v8H6v-8zm2 2v4h8v-4H8z" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>{tf.meetingRoom}</strong>
                      <p style={{ margin: "0.25rem 0 0", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>{tf.meetingRoomDesc}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.15rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 11h18v7c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-7zm0-2V6c0-1.1.9-2 2-2h3v5H3zm8 0V4h2v5h-2zm4 0V4h3c1.1 0 2 .9 2 2v3h-5z" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>{tf.lobby}</strong>
                      <p style={{ margin: "0.25rem 0 0", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>{tf.lobbyDesc}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span className="cf-feature-list__icon" aria-hidden="true" style={{ marginTop: "0.15rem" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v4h-2v12H6V8H4V4zm4 6v8h8v-8H8zm2-4v2h4V6h-4z" fill="currentColor"/></svg>
                    </span>
                    <div>
                      <strong>{tf.upperFloor}</strong>
                      <p style={{ margin: "0.25rem 0 0", color: "var(--cf-text-secondary)", fontSize: "0.925rem" }}>{tf.upperFloorDesc}</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="cf-card__title" style={{ marginBottom: "0.75rem" }}>{tf.hoursTitle}</div>
                <p className="cf-card__meta" style={{ marginBottom: "0.75rem" }}>{tf.hoursNote}</p>
                <dl style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", rowGap: "0.35rem" }}>
                  <dt style={{ fontWeight: 600 }}>{tf.monThu}</dt>
                  <dd style={{ margin: 0, textAlign: "right" }}>09:00–20:00</dd>
                  <dt style={{ fontWeight: 600 }}>{tf.fri}</dt>
                  <dd style={{ margin: 0, textAlign: "right" }}>09:00–18:00</dd>
                  <dt style={{ fontWeight: 600 }}>{tf.sat}</dt>
                  <dd style={{ margin: 0, textAlign: "right" }}>10:00–16:00 {tf.satNote}</dd>
                  <dt style={{ fontWeight: 600 }}>{tf.sun}</dt>
                  <dd style={{ margin: 0, textAlign: "right" }}>{tf.sunNote}</dd>
                </dl>
                <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "var(--cf-text-secondary)" }}>{tf.eveningNote}</p>
              </Card>
            </div>

            <Card>
              <div className="cf-card__title" style={{ marginBottom: "0.25rem" }}>{tf.reserveTitle}</div>
              <div className="cf-card__meta" style={{ marginBottom: "1rem" }}>{tf.reserveLead}</div>

              {sent ? <div className="cf-alert cf-alert--success">{tf.reserveSuccess}</div> : null}
              {error ? <div className="cf-alert cf-alert--error" style={{ marginBottom: "0.75rem" }}>{error}</div> : null}

              {!sent ? (
                <form onSubmit={onSubmit} style={{ display: "grid", gap: "1rem" }}>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="facility-name">{tf.nameLabel}</label>
                    <input id="facility-name" className="cf-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="facility-email">{tf.emailLabel}</label>
                    <input id="facility-email" className="cf-input" value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" autoComplete="email" />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="facility-org">{tf.orgLabel}</label>
                    <input id="facility-org" className="cf-input" value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
                  </div>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="facility">{tf.spaceLabel}</label>
                    <select id="facility" className="cf-select" value={facility} onChange={(e) => setFacility(e.target.value as FacilityOption)}>
                      <option value="Project room">{tf.projectRoom}</option>
                      <option value="Meeting room">{tf.meetingRoom}</option>
                      <option value="Whole space">Whole space</option>
                    </select>
                  </div>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="facility-date">{tf.dateLabel}</label>
                    <input id="facility-date" className="cf-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="cf-grid cf-grid--2" style={{ gap: "0.75rem" }}>
                    <div className="cf-field">
                      <label className="cf-label" htmlFor="facility-start-time">{tf.startLabel}</label>
                      <input id="facility-start-time" className="cf-input" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    </div>
                    <div className="cf-field">
                      <label className="cf-label" htmlFor="facility-end-time">{tf.endLabel}</label>
                      <input id="facility-end-time" className="cf-input" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    </div>
                  </div>
                  <div className="cf-field">
                    <label className="cf-label" htmlFor="facility-notes">{tf.descLabel}</label>
                    <textarea id="facility-notes" className="cf-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
                  </div>
                  <Button type="submit" className="cf-btn--lg">{tf.submit}</Button>
                </form>
              ) : null}
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
