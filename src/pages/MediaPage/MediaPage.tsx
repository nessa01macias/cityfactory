import { useState } from "react";
import { CommunityMap } from "./CommunityMap";
import "../page.css";
import "./media.css";

type MediaTab = "community-map" | "gallery";

export function MediaPage() {
  const [activeTab, setActiveTab] = useState<MediaTab>("community-map");

  return (
    <>
      <section className="cf-hero">
        <div className="cf-container cf-hero__inner">
          <h1 className="cf-h1">Media</h1>
          <p className="cf-lead">
            Explore Espoo through the eyes of its community. Drop a pin, share a thought, and see what others are saying.
          </p>
        </div>
      </section>

      <section className="cf-section" style={{ paddingTop: "2rem" }}>
        <div className="cf-container">
          <div className="cf-media-tabs">
            <button
              type="button"
              className={`cf-media-tab ${activeTab === "community-map" ? "cf-media-tab--active" : ""}`}
              onClick={() => setActiveTab("community-map")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
              </svg>
              Community Map
            </button>
            <button
              type="button"
              className={`cf-media-tab ${activeTab === "gallery" ? "cf-media-tab--active" : ""}`}
              onClick={() => setActiveTab("gallery")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
              </svg>
              Gallery
            </button>
          </div>

          {activeTab === "community-map" && <CommunityMap />}

          {activeTab === "gallery" && (
            <div className="cf-media-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "var(--cf-text-muted)" }}>
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
              </svg>
              <p style={{ margin: "0.5rem 0 0", color: "var(--cf-text-secondary)" }}>
                Gallery coming soon — photos and media from City Factory events and projects.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
