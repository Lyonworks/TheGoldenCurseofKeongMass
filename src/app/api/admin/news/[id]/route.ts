import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/supabase/auth';
import { logActivity } from '@/services/activity';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    const body = await request.json();
    const { title, content, author, image } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { success: false, error: 'Title, content, and author required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('news')
      .update({ title, content, author, image: image || null })
      .eq('id_news', id)
      .select();

    if (error) throw error;

    await logActivity(session.username, 'edit', `Updated news: ${title}`);

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);

    const { error } = await supabaseServer
      .from('news')
      .delete()
      .eq('id_news', id);

    if (error) throw error;

    await logActivity(session.username, 'delete', `Deleted news ID: ${id}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}
