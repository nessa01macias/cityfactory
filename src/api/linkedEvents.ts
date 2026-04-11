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

const HELSINKI_API = "https://api.hel.fi/linkedevents/v1";
const ESPOO_API = "https://tapahtumasyotto.espoo.fi/api/events/v1";

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
  if (src === "espoo" || src === "espooevents") return "espoo";
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
  if (src === "helmet") return "helsinki";
  return "helsinki";
}

export const CITY_LABELS: Record<CityFilter, string> = {
  all: "All cities",
  espoo: "Espoo",
  helsinki: "Helsinki",
  vantaa: "Vantaa",
};

async function fetchFromApi(base: string, opts?: { pageSize?: number; signal?: AbortSignal; sort?: string }): Promise<LinkedEvent[]> {
  const pageSize = opts?.pageSize ?? 20;
  const sort = opts?.sort ?? "start_time";
  const url = `${base}/event/?start=now&sort=${sort}&page_size=${pageSize}&format=json`;
  try {
    const res = await fetch(url, { signal: opts?.signal });
    if (!res.ok) return [];
    const json = (await res.json()) as LinkedEventsResponse;
    const events = json.data ?? [];

    // Resolve locations that are @id references (Espoo API)
    const needsResolve = events.filter(
      (ev) => ev.location && "@id" in (ev.location as Record<string, unknown>) && !ev.location?.name
    );
    if (needsResolve.length > 0) {
      const placeUrls = new Set(
        needsResolve.map((ev) => (ev.location as unknown as { "@id": string })["@id"])
      );
      const placeCache = new Map<string, LinkedEventLocation>();
      await Promise.all(
        [...placeUrls].map(async (placeUrl) => {
          try {
            const r = await fetch(placeUrl, { signal: opts?.signal });
            if (!r.ok) return;
            const place = await r.json();
            placeCache.set(placeUrl, {
              name: place.name ?? null,
              street_address: place.street_address ?? null,
            });
          } catch { /* skip */ }
        })
      );
      for (const ev of needsResolve) {
        const url = (ev.location as unknown as { "@id": string })["@id"];
        const resolved = placeCache.get(url);
        if (resolved) ev.location = resolved;
      }
    }

    return events;
  } catch {
    return [];
  }
}

export async function fetchUpcomingEvents(opts?: { pageSize?: number; signal?: AbortSignal }) {
  const pageSize = opts?.pageSize ?? 20;

  // Fetch from both APIs in parallel
  // Espoo API doesn't respect start=now properly, so we sort by last_modified_time to get recent events
  const [helsinkiEvents, espooEvents] = await Promise.all([
    fetchFromApi(HELSINKI_API, { pageSize, signal: opts?.signal }),
    fetchFromApi(ESPOO_API, { pageSize, signal: opts?.signal, sort: "-last_modified_time" }),
  ]);

  // Filter: only keep events that haven't ended yet
  const now = Date.now();
  const filtered = [...helsinkiEvents, ...espooEvents].filter((ev) => {
    const end = ev.end_time ? new Date(ev.end_time).getTime() : null;
    const start = ev.start_time ? new Date(ev.start_time).getTime() : null;
    // If has end date, must be in the future. Otherwise start must be in the future.
    if (end) return end > now;
    if (start) return start > now;
    return true;
  });

  // Sort by start_time
  const merged = filtered.sort((a, b) => {
    const ta = a.start_time ? new Date(a.start_time).getTime() : Infinity;
    const tb = b.start_time ? new Date(b.start_time).getTime() : Infinity;
    return ta - tb;
  });

  return { data: merged } as LinkedEventsResponse;
}

export async function fetchEventById(id: string, opts?: { signal?: AbortSignal }) {
  // Try Helsinki first, then Espoo
  const helsinkiUrl = `${HELSINKI_API}/event/${encodeURIComponent(id)}/`;
  const res = await fetch(helsinkiUrl, { signal: opts?.signal });
  if (res.ok) return (await res.json()) as LinkedEvent;

  const espooUrl = `${ESPOO_API}/event/${encodeURIComponent(id)}/?format=json`;
  const res2 = await fetch(espooUrl, { signal: opts?.signal });
  if (res2.ok) return (await res2.json()) as LinkedEvent;

  throw new Error(`Event not found: ${id}`);
}
