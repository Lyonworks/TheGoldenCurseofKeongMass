import { supabase } from "../lib/supabase/client";
import type { Comment } from "@/types";

export async function getAllComments(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  return data || [];
}

export async function getParentComments(): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .is("id_parent", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching parent comments:", error);
    return [];
  }

  return data || [];
}

export async function getCommentReplies(parentId: number): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("id_parent", parentId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching replies:", error);
    return [];
  }

  return data || [];
}
