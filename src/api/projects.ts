import { supabase } from "../supabaseClient";

/* ── Shared Project type ── */

export type ProjectStatus =
  | "Idea"
  | "Research"
  | "Planning"
  | "Testing"
  | "Implementation"
  | "Completed";

export type ProjectSource = "espoo" | "helsinki";

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatus;
  topics: string[];
  area: string;
  description: string;
  lastUpdated: string;
  body: string[];
  milestones: { date: string; label: string }[];
  team: string[];
  source: ProjectSource;
  imageUrl?: string | null;
  externalUrl?: string | null;
};

/* ── Supabase (Espoo projects) ── */

type SupabaseProject = {
  slug: string;
  title: string;
  status: string;
  topics: string[];
  area: string;
  description: string;
  last_updated: string;
  body: string[];
  milestones: { date: string; label: string }[];
  team: string[];
};

async function fetchSupabaseProjects(signal?: AbortSignal): Promise<Project[]> {
  const query = supabase.from("projects").select("*");
  const { data, error } = signal
    ? await query.abortSignal(signal)
    : await query;

  if (error) throw new Error(`Supabase projects error: ${error.message}`);

  return (data as SupabaseProject[]).map((p) => ({
    slug: p.slug,
    title: p.title,
    status: p.status as ProjectStatus,
    topics: p.topics ?? [],
    area: p.area,
    description: p.description,
    lastUpdated: p.last_updated,
    body: p.body ?? [],
    milestones: p.milestones ?? [],
    team: p.team ?? [],
    source: "espoo" as const,
  }));
}

/* ── Kerrokantasi (Helsinki hearings → projects) ── */

type KerrokantasiHearing = {
  id: string;
  slug: string;
  title: { fi?: string; en?: string; sv?: string };
  abstract: { fi?: string; en?: string; sv?: string };
  open_at: string | null;
  close_at: string | null;
  closed: boolean;
  labels: { id: number; label: { fi?: string; en?: string; sv?: string } }[];
  main_image: { url?: string } | null;
  organization: string;
  borough: { fi?: string; en?: string; sv?: string } | null;
};

type KerrokantasiResponse = {
  count: number;
  results: KerrokantasiHearing[];
};

const KERROKANTASI_BASE = "https://kerrokantasi.api.hel.fi/v1";

function locText(v?: { fi?: string; en?: string; sv?: string } | null): string {
  return (v?.en || v?.fi || v?.sv || "").trim();
}

function hearingToStatus(h: KerrokantasiHearing): ProjectStatus {
  if (h.closed) return "Completed";
  if (h.close_at && new Date(h.close_at) > new Date()) return "Implementation";
  return "Planning";
}

async function fetchKerrokantasiProjects(signal?: AbortSignal): Promise<Project[]> {
  const url = `${KERROKANTASI_BASE}/hearing/?format=json&limit=15&ordering=-created_at`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Kerrokantasi API error (${res.status})`);
  const data = (await res.json()) as KerrokantasiResponse;

  return data.results.map((h) => {
    const title = locText(h.title) || "Untitled hearing";
    const abstract = locText(h.abstract);
    const labels = h.labels.map((l) => locText(l.label)).filter(Boolean);
    const borough = locText(h.borough);

    return {
      slug: `hel-${h.slug}`,
      title,
      status: hearingToStatus(h),
      topics: labels.length > 0 ? labels : ["Urban planning"],
      area: borough || "Helsinki",
      description: abstract,
      lastUpdated: h.open_at ? h.open_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
      body: abstract ? [abstract] : [],
      milestones: [
        ...(h.open_at ? [{ date: h.open_at.slice(0, 10), label: "Hearing opened" }] : []),
        ...(h.close_at ? [{ date: h.close_at.slice(0, 10), label: h.closed ? "Hearing closed" : "Hearing closes" }] : []),
      ],
      team: [h.organization || "City of Helsinki"],
      source: "helsinki" as const,
      imageUrl: h.main_image?.url ?? null,
      externalUrl: `https://kerrokantasi.hel.fi/${h.slug}`,
    };
  });
}

/* ── Combined fetch ── */

export async function fetchAllProjects(opts?: { signal?: AbortSignal }): Promise<Project[]> {
  const [supabaseProjects, helsinkiProjects] = await Promise.allSettled([
    fetchSupabaseProjects(opts?.signal),
    fetchKerrokantasiProjects(opts?.signal),
  ]);

  const results: Project[] = [];
  if (supabaseProjects.status === "fulfilled") results.push(...supabaseProjects.value);
  if (helsinkiProjects.status === "fulfilled") results.push(...helsinkiProjects.value);

  // Sort: most recently updated first
  results.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
  return results;
}

export async function fetchProjectBySlug(slug: string, opts?: { signal?: AbortSignal }): Promise<Project | null> {
  // Helsinki hearing
  if (slug.startsWith("hel-")) {
    const hearingSlug = slug.slice(4);
    const url = `${KERROKANTASI_BASE}/hearing/${encodeURIComponent(hearingSlug)}/?format=json`;
    const res = await fetch(url, { signal: opts?.signal });
    if (!res.ok) return null;
    const h = (await res.json()) as KerrokantasiHearing;
    const title = locText(h.title);
    const abstract = locText(h.abstract);
    const labels = h.labels.map((l) => locText(l.label)).filter(Boolean);
    const borough = locText(h.borough);

    return {
      slug: `hel-${h.slug}`,
      title: title || "Untitled hearing",
      status: hearingToStatus(h),
      topics: labels.length > 0 ? labels : ["Urban planning"],
      area: borough || "Helsinki",
      description: abstract,
      lastUpdated: h.open_at ? h.open_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
      body: abstract ? [abstract] : [],
      milestones: [
        ...(h.open_at ? [{ date: h.open_at.slice(0, 10), label: "Hearing opened" }] : []),
        ...(h.close_at ? [{ date: h.close_at.slice(0, 10), label: h.closed ? "Hearing closed" : "Hearing closes" }] : []),
      ],
      team: [h.organization || "City of Helsinki"],
      source: "helsinki",
      imageUrl: h.main_image?.url ?? null,
      externalUrl: `https://kerrokantasi.hel.fi/${h.slug}`,
    };
  }

  // Supabase project
  const base = supabase.from("projects").select("*").eq("slug", slug);
  const withSignal = opts?.signal ? base.abortSignal(opts.signal) : base;
  const { data, error } = await withSignal.single();

  if (error || !data) return null;
  const p = data as SupabaseProject;
  return {
    slug: p.slug,
    title: p.title,
    status: p.status as ProjectStatus,
    topics: p.topics ?? [],
    area: p.area,
    description: p.description,
    lastUpdated: p.last_updated,
    body: p.body ?? [],
    milestones: p.milestones ?? [],
    team: p.team ?? [],
    source: "espoo",
  };
}
