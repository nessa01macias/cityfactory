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

export async function fetchUpcomingEspooEvents(opts?: { pageSize?: number; signal?: AbortSignal }) {
  const pageSize = opts?.pageSize ?? 20;
  const url = `${BASE}/event/?data_source=espoo&start=now&sort=start_time&page_size=${pageSize}`;
  const res = await fetch(url, { signal: opts?.signal });
  if (!res.ok) throw new Error(`Events API error (${res.status})`);
  return (await res.json()) as LinkedEventsResponse;
}

export async function fetchEventById(id: string, opts?: { signal?: AbortSignal }) {
  const url = `${BASE}/event/${encodeURIComponent(id)}/`;
  const res = await fetch(url, { signal: opts?.signal });
  if (!res.ok) throw new Error(`Event API error (${res.status})`);
  return (await res.json()) as LinkedEvent;
}

