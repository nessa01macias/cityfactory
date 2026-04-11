import { useEffect, useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  fetchAllPins,
  insertPin,
  subscribeToPins,
  votePin,
  hasVoted,
  type MapPin,
  type PinCategory,
} from "../../storage/mapPins";
import { useTranslation } from "../../i18n/useTranslation";
import { useLanguage } from "../../state/language";

/* ── Espoo bounds & center ── */
const ESPOO_CENTER: L.LatLngTuple = [60.205, 24.66];
const ESPOO_BOUNDS: L.LatLngBoundsExpression = [
  [60.1, 24.5],
  [60.36, 24.95],
];

/* ── Category config ── */
const CATEGORY_VALUES: PinCategory[] = ["thought", "idea", "issue", "love", "memory"];
const CATEGORY_COLORS: Record<PinCategory, string> = {
  thought: "#0050BB",
  idea: "#FFDC47",
  issue: "#FF4F57",
  love: "#FCA5C7",
  memory: "#9D85E5",
};

function getCategoryColor(cat: string): string {
  return CATEGORY_COLORS[cat as PinCategory] ?? "#0050BB";
}

function makePinIcon(color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.27 21.73 0 14 0z" fill="${color}"/>
    <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "cf-map-pin",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });
}

/* ── Click handler ── */
function MapClickHandler({ active, onMapClick }: { active: boolean; onMapClick: (lat: number, lng: number) => void }) {
  const map = useMap();
  useMapEvents({
    click(e) {
      if (active) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  // Change cursor when in "add" mode
  useEffect(() => {
    const el = map.getContainer();
    el.style.cursor = active ? "crosshair" : "";
    return () => { el.style.cursor = ""; };
  }, [active, map]);
  return null;
}

/* ── Main component ── */
export function CommunityMap() {
  const t = useTranslation();
  const { language } = useLanguage();
  const cm = t.communityMap;

  const [pins, setPins] = useState<MapPin[]>([]);
  const [loading, setLoading] = useState(true);

  // Add mode
  const [addMode, setAddMode] = useState(false);
  const [newPinCoords, setNewPinCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<PinCategory>("thought");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout>>();

  const categoryLabel = (val: PinCategory) => cm[val];

  useEffect(() => {
    fetchAllPins().then((data) => {
      setPins(data);
      setLoading(false);
    });
    const unsubscribe = subscribeToPins((newPin) => {
      setPins((prev) => {
        if (prev.some((p) => p.id === newPin.id)) return prev;
        return [newPin, ...prev];
      });
    });
    return () => {
      unsubscribe();
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, []);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (cooldown) return;
      setNewPinCoords({ lat, lng });
    },
    [cooldown]
  );

  const handleSubmit = async () => {
    if (!newPinCoords || !message.trim() || submitting) return;
    setSubmitting(true);
    const pin = await insertPin({
      lat: newPinCoords.lat,
      lng: newPinCoords.lng,
      message: message.trim(),
      category,
    });
    setSubmitting(false);
    if (pin) {
      // Optimistic: immediately add pin to local state so it renders on the map
      setPins((prev) => {
        if (prev.some((p) => p.id === pin.id)) return prev;
        return [pin, ...prev];
      });
      setNewPinCoords(null);
      setMessage("");
      setCategory("thought");
      setAddMode(false);
      setShowSuccess(true);
      setCooldown(true);
      cooldownTimer.current = setTimeout(() => {
        setCooldown(false);
        setShowSuccess(false);
      }, 30000);
    }
  };

  const cancelAdd = () => {
    setAddMode(false);
    setNewPinCoords(null);
    setMessage("");
    setCategory("thought");
  };

  const dateLocale = language === "FI" ? "fi-FI" : "en-GB";

  return (
    <div className="cf-voicemap">
      {/* ── Map ── */}
      <div className="cf-voicemap__map">
        {loading && (
          <div className="cf-voicemap__toast cf-voicemap__toast--top">{cm.loading}</div>
        )}
        {showSuccess && (
          <div className="cf-voicemap__toast cf-voicemap__toast--success">{cm.cooldown}</div>
        )}

        <MapContainer
          center={ESPOO_CENTER}
          zoom={12}
          minZoom={11}
          maxZoom={18}
          maxBounds={ESPOO_BOUNDS}
          maxBoundsViscosity={0.9}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapClickHandler active={addMode} onMapClick={handleMapClick} />

          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            iconCreateFunction={(cluster: any) => {
              const count = cluster.getChildCount();
              const size = count < 10 ? 36 : count < 30 ? 44 : 52;
              return L.divIcon({
                html: `<div class="cf-cluster">${count}</div>`,
                className: "cf-cluster-icon",
                iconSize: L.point(size, size),
              });
            }}
          >
            {pins.map((pin) => (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={makePinIcon(getCategoryColor(pin.category))}
              >
                <Popup>
                  <div className="cf-map-popup">
                    <span
                      className="cf-map-popup__category"
                      style={{
                        background: getCategoryColor(pin.category),
                        color: pin.category === "idea" ? "#333" : "#fff",
                      }}
                    >
                      {categoryLabel(pin.category as PinCategory)}
                    </span>
                    <p className="cf-map-popup__message">{pin.message}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.35rem" }}>
                      <span className="cf-map-popup__date">
                        {new Date(pin.created_at).toLocaleDateString(dateLocale, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          const newVotes = await votePin(pin.id);
                          if (newVotes !== null) {
                            setPins((prev) => prev.map((p) => p.id === pin.id ? { ...p, votes: newVotes } : p));
                          }
                        }}
                        disabled={hasVoted(pin.id)}
                        style={{
                          appearance: "none",
                          border: "1px solid var(--cf-border)",
                          borderRadius: "999px",
                          background: hasVoted(pin.id) ? "var(--cf-surface)" : "#fff",
                          padding: "0.2rem 0.6rem",
                          cursor: hasVoted(pin.id) ? "default" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: hasVoted(pin.id) ? "var(--cf-primary)" : "var(--cf-text-secondary)",
                          transition: "all 0.15s",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 4l2.5 5.5L20 10l-4 4 1 5.5L12 17l-5 2.5 1-5.5-4-4 5.5-.5z"
                            fill={hasVoted(pin.id) ? "currentColor" : "none"}
                            stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        {pin.votes ?? 0}
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          {/* Preview pin while placing */}
          {newPinCoords && (
            <Marker
              position={[newPinCoords.lat, newPinCoords.lng]}
              icon={makePinIcon(getCategoryColor(category))}
            />
          )}
        </MapContainer>

        {/* Legend overlay */}
        <div className="cf-voicemap__legend">
          {CATEGORY_VALUES.map((val) => (
            <span key={val} className="cf-voicemap__legend-item">
              <span className="cf-voicemap__legend-dot" style={{ background: getCategoryColor(val) }} />
              {categoryLabel(val)}
            </span>
          ))}
        </div>

        {/* Add button (when not in add mode) */}
        {!addMode && (
          <button
            type="button"
            className="cf-voicemap__add-btn"
            onClick={() => setAddMode(true)}
            disabled={cooldown}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            {cm.dropPin}
          </button>
        )}
      </div>

      {/* ── Side panel / overlay form ── */}
      {addMode && (
        <div className="cf-voicemap__panel">
          <div className="cf-voicemap__panel-header">
            <h3 className="cf-voicemap__panel-title">{cm.dropTitle}</h3>
            <button type="button" className="cf-voicemap__panel-close" onClick={cancelAdd} aria-label={cm.cancel}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>

          {!newPinCoords ? (
            <div className="cf-voicemap__panel-hint">
              <div className="cf-voicemap__panel-hint-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>
              </div>
              <p>{cm.clickToPlace}</p>
            </div>
          ) : (
            <div className="cf-voicemap__form">
              <div className="cf-voicemap__form-section">
                <label className="cf-label">{cm.categoryLabel}</label>
                <div className="cf-voicemap__cat-grid">
                  {CATEGORY_VALUES.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`cf-voicemap__cat-chip ${category === val ? "cf-voicemap__cat-chip--active" : ""}`}
                      style={{
                        "--chip-color": getCategoryColor(val),
                      } as React.CSSProperties}
                      onClick={() => setCategory(val)}
                    >
                      {categoryLabel(val)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cf-voicemap__form-section">
                <label className="cf-label" htmlFor="pin-message">{cm.messageLabel}</label>
                <textarea
                  id="pin-message"
                  className="cf-textarea"
                  placeholder={cm.placeholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  rows={5}
                  autoFocus
                />
                <div className="cf-voicemap__charcount">{message.length}/500</div>
              </div>

              <button
                type="button"
                className="cf-btn cf-btn--lg"
                style={{ width: "100%" }}
                disabled={!message.trim() || message.trim().length < 3 || submitting}
                onClick={handleSubmit}
              >
                {submitting ? cm.dropping : cm.dropPin}
              </button>
            </div>
          )}

          <p className="cf-voicemap__panel-info">{cm.info}</p>
        </div>
      )}
    </div>
  );
}
