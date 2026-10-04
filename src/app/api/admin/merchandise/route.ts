import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/supabase/auth';
import { logActivity } from '@/services/activity';

// Service-role read for the admin table. See the note in /api/admin/news: the
// public route uses the anon key and only sees what RLS allows.
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
      .from('merchandise')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching merchandise for admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch merchandise' },
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
    const { name, description, price, stock, limited, image } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Name and price required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('merchandise')
      .insert({
        name,
        description: description || null,
        price,
        stock: stock || 0,
        limited: limited || false,
        image: image || null,
      })
      .select();

    if (error) throw error;

    await logActivity(session.username, 'add', `Added merchandise: ${name}`);

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating merchandise:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create merchandise' },
      { status: 500 }
    );
  }
}
