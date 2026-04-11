import { supabase } from "../supabaseClient";

export type PinCategory = "idea" | "issue" | "recommendation";

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  message: string;
  category: PinCategory;
  created_at: string;
  votes: number;
};

const VOTED_KEY = "cf.map.voted";

function getVotedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(VOTED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markVoted(pinId: string) {
  const ids = getVotedIds();
  ids.add(pinId);
  localStorage.setItem(VOTED_KEY, JSON.stringify([...ids]));
}

export function hasVoted(pinId: string): boolean {
  return getVotedIds().has(pinId);
}

export async function fetchAllPins(): Promise<MapPin[]> {
  const { data, error } = await supabase
    .from("map_pins")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    console.error("Failed to fetch pins:", error);
    return [];
  }
  return (data as MapPin[]).map((p) => ({ ...p, votes: p.votes ?? 0 }));
}

export async function insertPin(pin: {
  lat: number;
  lng: number;
  message: string;
  category: PinCategory;
}): Promise<MapPin | null> {
  const { data, error } = await supabase
    .from("map_pins")
    .insert({ ...pin, votes: 0 })
    .select()
    .single();

  if (error) {
    console.error("Failed to insert pin:", error);
    return null;
  }
  return { ...(data as MapPin), votes: (data as MapPin).votes ?? 0 };
}

export async function votePin(pinId: string): Promise<number | null> {
  if (hasVoted(pinId)) return null;

  const { data, error } = await supabase.rpc("increment_pin_votes", { pin_id: pinId });

  if (error) {
    console.error("Failed to vote:", error);
    return null;
  }

  markVoted(pinId);
  return data as number;
}

export function subscribeToPins(onNewPin: (pin: MapPin) => void) {
  const channel = supabase
    .channel("map_pins_realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "map_pins" },
      (payload) => {
        onNewPin({ ...(payload.new as MapPin), votes: (payload.new as MapPin).votes ?? 0 });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
