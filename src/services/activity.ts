import { supabaseServer } from "../lib/supabase/server";
import type { Activity } from "@/types";

export async function logActivity(
  user: string,
  action: string,
  description: string
): Promise<void> {
  await supabaseServer.from("activity").insert({
    user,
    action,
    description,
    created_at: new Date().toISOString(),
  });
}

export async function getActivities(limit: number = 10): Promise<Activity[]> {
  const { data, error } = await supabaseServer
    .from("activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching activities:", error);
    return [];
  }

  return data || [];
}

export async function getUnreadCommentsCount(): Promise<number> {
  const { count, error } = await supabaseServer
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) {
    console.error("Error counting unread comments:", error);
    return 0;
  }

  return count || 0;
}
