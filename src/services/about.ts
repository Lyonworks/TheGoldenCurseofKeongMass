import { supabase } from "../lib/supabase/client";
import type { About, AboutImage } from "@/types";

export async function getAbout(): Promise<About | null> {
  // maybeSingle: an empty about table is null, not an error.
  const { data, error } = await supabase
    .from("about")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error fetching about:", error);
    return null;
  }

  return data ?? null;
}

export async function getAboutImages(): Promise<AboutImage[]> {
  const { data, error } = await supabase
    .from("about_images")
    .select("*")
    .order("id_image", { ascending: false });

  if (error) {
    console.error("Error fetching about images:", error);
    return [];
  }

  return data || [];
}
