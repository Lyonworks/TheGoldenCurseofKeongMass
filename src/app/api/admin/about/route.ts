import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/supabase/auth';
import { logActivity } from '@/services/activity';

// Service-role read for the admin page. The public /api/about route uses the
// anon key and answers only what the RLS SELECT policy allows, so the admin
// listing must not depend on it.
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // maybeSingle, not single: an empty about table is null, not an error, and
    // single() reports that as a failure the admin page cannot read.
    const { data, error } = await supabaseServer
      .from('about')
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? null });
  } catch (error) {
    console.error('Error fetching about for admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { description, id } = body;

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Description required' },
        { status: 400 }
      );
    }

    // `about` is a single-row table, but the id was hardcoded to 1. A database
    // seeded by hand can hold a different id, and the update then matched no
    // row while still reporting success.
    const rowId = Number(id) || 1;

    const { data, error } = await supabaseServer
      .from('about')
      .update({ description, updated_at: new Date().toISOString() })
      .eq('id_about', rowId)
      .select();

    if (error) throw error;

    await logActivity(session.username, 'edit', 'Updated about description');

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update about' },
      { status: 500 }
    );
  }
}
