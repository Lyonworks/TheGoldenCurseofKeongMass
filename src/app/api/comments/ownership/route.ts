import { NextResponse } from 'next/server';
import { getUserToken } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';

type CommentOwnershipRow = {
  id_comments: number;
};

// Reads an HTTP-only cookie, so it can never be statically rendered.
export const dynamic = 'force-dynamic';

/**
 * GET: Return list of comment IDs owned by current user
 * Token is read from HTTP-only cookie (not exposed to client)
 * Client uses this to show edit/delete buttons
 */
export async function GET() {
  try {
    const userToken = await getUserToken();

    if (!userToken) {
      return NextResponse.json(
        { success: true, ownedCommentIds: [] },
        { status: 200 }
      );
    }

    // Find all comments owned by this token
    const { data, error } = await supabase
      .from('comments')
      .select('id_comments')
      .eq('user_token', userToken) as { data: CommentOwnershipRow[] | null; error: any };

    if (error) throw error;

    const ownedCommentIds = data?.map((c: CommentOwnershipRow) => c.id_comments) || [];

    return NextResponse.json(
      { success: true, ownedCommentIds },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking comment ownership:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check ownership' },
      { status: 500 }
    );
  }
}
