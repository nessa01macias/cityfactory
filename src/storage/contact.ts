export type ContactTopic =
  | "General inquiry"
  | "Partnership / collaboration"
  | "Research / academic"
  | "Volunteering"
  | "Press / media"
  | "Feedback on the website"
  | "Other";

export type ContactMessage = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
};

const STORAGE_KEY = "cf.contact.messages";

export function saveContactMessage(msg: ContactMessage) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const arr = raw ? (JSON.parse(raw) as ContactMessage[]) : [];
  arr.unshift(msg);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export function newContactId(now = new Date()) {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `MSG-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(
    2,
    "0"
  )}-${rand}`;
}

