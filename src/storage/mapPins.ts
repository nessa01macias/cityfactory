import { supabase } from "../supabaseClient";

export type PinCategory = "thought" | "idea" | "issue" | "love" | "memory";

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  message: string;
  category: PinCategory;
  created_at: string;
};

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
  return data as MapPin[];
}

export async function insertPin(pin: {
  lat: number;
  lng: number;
  message: string;
  category: PinCategory;
}): Promise<MapPin | null> {
  const { data, error } = await supabase
    .from("map_pins")
    .insert(pin)
    .select()
    .single();

  if (error) {
    console.error("Failed to insert pin:", error);
    return null;
  }
  return data as MapPin;
}

export function subscribeToPins(onNewPin: (pin: MapPin) => void) {
  const channel = supabase
    .channel("map_pins_realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "map_pins" },
      (payload) => {
        onNewPin(payload.new as MapPin);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
