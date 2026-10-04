import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/supabase/auth';
import { logActivity } from '@/services/activity';

// Service-role read for the admin table. The public /api/news route uses the
// anon key and answers only what the RLS SELECT policy allows, so the admin
// listing must not depend on it — otherwise a missing or restrictive policy
// shows the admin an empty table while the rows sit in the database.
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseServer
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching news for admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
      .insert({
        title,
        content,
        author,
        image: image || null,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;

    await logActivity(session.username, 'add', `Added news: ${title}`);

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create news' },
      { status: 500 }
    );
  }
}
