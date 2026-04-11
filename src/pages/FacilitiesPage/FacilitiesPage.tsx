import { useState, type FormEvent } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "../../i18n/useTranslation";
import spaceWorkshop from "../../utils/physical_space1.jpg";
import spaceMeeting from "../../utils/physical_space2.jpg";
import spaceLounge from "../../utils/physical_space3.jpg";
import "../page.css";

type FacilityOption = "Project room" | "Meeting room" | "Whole space";

const SPACE_COLORS = [
  { bg: "#FDE6DB", accent: "#c05621" },
  { bg: "#e8f1fc", accent: "#0050BB" },
  { bg: "#e6f9ee", accent: "#0d7a3e" },
] as const;

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

  const spaces = [
    { img: spaceWorkshop, title: tf.projectRoom, desc: tf.projectRoomDesc, capacity: "20", color: SPACE_COLORS[0] },
    { img: spaceMeeting, title: tf.meetingRoom, desc: tf.meetingRoomDesc, capacity: "5", color: SPACE_COLORS[1] },
    { img: spaceLounge, title: tf.lobby, desc: tf.lobbyDesc, capacity: null, color: SPACE_COLORS[2] },
  ];

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">{tf.title}</h1>
          <p className="cf-lead">{tf.lead}</p>
        </div>
      </section>

      {/* ── Spaces showcase ── */}
      <section className="cf-section">
        <div className="cf-container">
          <h2 className="cf-h2">{tf.spacesTitle}</h2>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            {spaces.map((space, i) => (
              <div
                key={i}
                className={i % 2 === 0 ? "cf-split cf-split--wide-left" : "cf-split cf-split--wide-right"}
                style={{ background: space.color.bg }}
              >
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <img
                    src={space.img}
                    alt={space.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    loading="lazy"
                  />
                </div>
                <div style={{
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  order: i % 2 === 0 ? 1 : 0,
                }}>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}>
                    <span style={{
                      background: space.color.accent,
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "999px",
                    }}>
                      {space.capacity ? `${space.capacity} people` : "Open space"}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: "0 0 0.5rem", color: "var(--cf-text)" }}>
                    {space.title}
                  </h3>
                  <p style={{ margin: 0, color: "var(--cf-text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {space.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Reservation ── */}
      <section className="cf-section cf-section--muted">
        <div className="cf-container">
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
              <div>
                <div className="cf-card__title" style={{ marginBottom: "0.15rem" }}>{tf.reserveTitle}</div>
                <div className="cf-card__meta" style={{ margin: 0 }}>{tf.reserveLead}</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.8rem", color: "var(--cf-text-muted)" }}>
                <span><strong>{tf.monThu}</strong> 09–20</span>
                <span><strong>{tf.fri}</strong> 09–18</span>
                <span><strong>{tf.sat}</strong> 10–16</span>
              </div>
            </div>

            {sent ? <div className="cf-alert cf-alert--success">{tf.reserveSuccess}</div> : null}
            {error ? <div className="cf-alert cf-alert--error" style={{ marginBottom: "0.75rem" }}>{error}</div> : null}

            {!sent ? (
              <form onSubmit={onSubmit}>
                <div className="cf-grid cf-grid--2" style={{ gap: "0.75rem" }}>
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
                </div>
                <div className="cf-field" style={{ marginTop: "0.75rem" }}>
                  <label className="cf-label" htmlFor="facility-notes">{tf.descLabel}</label>
                  <textarea id="facility-notes" className="cf-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                </div>
                <div style={{ marginTop: "0.75rem" }}>
                  <Button type="submit" className="cf-btn--lg">{tf.submit}</Button>
                </div>
              </form>
            ) : null}
          </Card>
        </div>
      </section>
    </>
  );
}
