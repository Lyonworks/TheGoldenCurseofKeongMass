import { supabase } from "../lib/supabase/client";
import type { Merchandise } from "@/types";

export async function getAllMerchandise(): Promise<Merchandise[]> {
  const { data, error } = await supabase
    .from("merchandise")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching merchandise:", error);
    return [];
  }

  return data || [];
}

export async function getMerchandiseById(id: number): Promise<Merchandise | null> {
  const { data, error } = await supabase
    .from("merchandise")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching merchandise:", error);
    return null;
  }

  return data;
}
