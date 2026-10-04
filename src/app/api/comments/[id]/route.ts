import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getUserToken } from '@/lib/supabase/auth';

export async function GET(
  _request: unknown,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('id_comments', id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comment' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message required' },
        { status: 400 }
      );
    }

    // Get user token from secure HTTP-only cookie
    const userToken = await getUserToken();
    if (!userToken) {
      return NextResponse.json(
        { success: false, error: 'User token required' },
        { status: 401 }
      );
    }

    // Verify ownership via user_token
    const { data: existing, error: fetchError } = await supabase
      .from('comments')
      .select('user_token')
      .eq('id_comments', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (existing.user_token !== userToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - you can only edit your own comments' },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('comments')
      .update({ message })
      .eq('id_comments', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data?.[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: unknown,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    // Get user token from secure HTTP-only cookie
    const userToken = await getUserToken();
    if (!userToken) {
      return NextResponse.json(
        { success: false, error: 'User token required' },
        { status: 401 }
      );
    }

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('comments')
      .select('user_token')
      .eq('id_comments', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    if (existing.user_token !== userToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - you can only delete your own comments' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id_comments', id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
