import { supabase } from "../lib/supabase/client";
import type { News } from "@/types";

export async function getAllNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }

  return data || [];
}

export async function getNewsById(id: number): Promise<News | null> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id_news", id)
    .single();

  if (error) {
    console.error("Error fetching news:", error);
    return null;
  }

  return data;
}

export async function getLatestNews(limit: number = 6): Promise<News[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest news:", error);
    return [];
  }

  return data || [];
}
