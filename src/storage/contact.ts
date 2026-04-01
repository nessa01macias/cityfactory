import { supabase } from "../supabaseClient";

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

export function newContactId(now = new Date()) {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `MSG-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(
    2,
    "0"
  )}-${rand}`;
}

export async function saveContactMessage(msg: ContactMessage) {
  const { error } = await supabase.from("contact_messages").insert({
    reference: msg.id,
    created_at: msg.createdAt,
    name: msg.name,
    email: msg.email,
    topic: msg.topic,
    message: msg.message,
  });
  if (error) throw error;
}
