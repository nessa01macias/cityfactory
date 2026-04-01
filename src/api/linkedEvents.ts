export type LocalizedString = {
  fi?: string | null;
  en?: string | null;
  sv?: string | null;
};

export type LinkedEventImage = {
  url?: string | null;
};

export type LinkedEventLocation = {
  name?: LocalizedString | null;
  street_address?: LocalizedString | null;
};

export type LinkedEvent = {
  id: string;
  name?: LocalizedString | null;
  short_description?: LocalizedString | null;
  description?: LocalizedString | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: LinkedEventLocation | null;
  images?: LinkedEventImage[] | null;
  info_url?: LocalizedString | null;
  data_source?: string | null;
};

type LinkedEventsResponse = {
  data: LinkedEvent[];
};

const BASE = "https://api.hel.fi/linkedevents/v1";

export function preferredText(v?: LocalizedString | null) {
  return (v?.en || v?.fi || v?.sv || "").trim();
}

export function eventPath(id: string) {
  return `/events/${encodeURIComponent(id)}`;
}

export type City = "espoo" | "helsinki" | "vantaa";
export type CityFilter = "all" | City;

/** Derive a city label from the event's data_source or location text. */
export function eventCity(ev: LinkedEvent): City {
  const src = ev.data_source?.toLowerCase() ?? "";
  if (src === "espoo") return "espoo";
  if (src === "helsinki") return "helsinki";

  // Helmet (library) events span the metro area — try the location text
  const loc = (
    preferredText(ev.location?.name) +
    " " +
    preferredText(ev.location?.street_address)
  ).toLowerCase();

  if (loc.includes("espoo") || loc.includes("esbo")) return "espoo";
  if (loc.includes("vantaa") || loc.includes("vanda")) return "vantaa";
  if (loc.includes("helsinki") || loc.includes("helsingfors")) return "helsinki";

  // Fallback based on data source
  if (src === "helmet") return "helsinki"; // most helmet events are in Helsinki
  return "helsinki"; // default for unknown sources
}

export const CITY_LABELS: Record<CityFilter, string> = {
  all: "All cities",
  espoo: "Espoo",
  helsinki: "Helsinki",
  vantaa: "Vantaa",
};

export async function fetchUpcomingEvents(opts?: { pageSize?: number; signal?: AbortSignal }) {
  const pageSize = opts?.pageSize ?? 20;
  const url = `${BASE}/event/?start=now&sort=start_time&page_size=${pageSize}`;
  const res = await fetch(url, { signal: opts?.signal });
  if (!res.ok) throw new Error(`Events API error (${res.status})`);
  return (await res.json()) as LinkedEventsResponse;
}

/** @deprecated Use fetchUpcomingEvents instead */
export const fetchUpcomingEspooEvents = fetchUpcomingEvents;

export async function fetchEventById(id: string, opts?: { signal?: AbortSignal }) {
  const url = `${BASE}/event/${encodeURIComponent(id)}/`;
  const res = await fetch(url, { signal: opts?.signal });
  if (!res.ok) throw new Error(`Event API error (${res.status})`);
  return (await res.json()) as LinkedEvent;
}

