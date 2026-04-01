import { CommunityMap } from "../MediaPage/CommunityMap";
import { useTranslation } from "../../i18n/useTranslation";
import "../page.css";
import "../MediaPage/media.css";

export function GetInvolvedPage() {
  const t = useTranslation();

  return (
    <div className="cf-voicemap-page">
      {/* Compact hero banner with CTA */}
      <div className="cf-voicemap-page__hero">
        <h1 className="cf-voicemap-page__title">{t.communityMap.title}</h1>
        <p className="cf-voicemap-page__subtitle">{t.communityMap.heroInvite}</p>
        <div className="cf-voicemap-page__mock-badge">{t.communityMap.mockBadge}</div>
      </div>

      {/* Full-height map */}
      <CommunityMap />
    </div>
  );
}
