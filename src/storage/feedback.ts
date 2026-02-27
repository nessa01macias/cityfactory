export type FeedbackType = "Idea" | "Issue" | "Question" | "Other";
export type FeedbackStatus = "Received" | "Under Review" | "Routed" | "Responded" | "Closed";

export type FeedbackSubmission = {
  reference: string;
  createdAt: string;
  lastUpdatedAt: string;
  type: FeedbackType;
  topics: string[];
  area: string | null;
  areaOther: string | null;
  message: string;
  email: string | null;
  name: string | null;
  status: FeedbackStatus;
  publicNotes: string | null;
};

const STORAGE_KEY = "cf.feedback.submissions";

function pad(n: number, w = 2) {
  return String(n).padStart(w, "0");
}

export function generateReference(now = new Date()) {
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CF-${yyyy}${mm}${dd}-${rand}`;
}

export function loadSubmissions(): FeedbackSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FeedbackSubmission[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveSubmission(sub: FeedbackSubmission) {
  const all = loadSubmissions();
  all.unshift(sub);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function findByReference(referenceRaw: string) {
  const ref = normalizeReference(referenceRaw);
  if (!ref) return null;
  return loadSubmissions().find((s) => normalizeReference(s.reference) === ref) ?? null;
}

export function normalizeReference(ref: string) {
  const t = ref.trim().toUpperCase();
  if (!t) return "";
  return t.startsWith("#") ? t.slice(1) : t;
}

