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
    const { name, description, price, stock, limited, image } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: 'Name and price required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('merchandise')
      .update({
        name,
        description: description || null,
        price,
        stock: stock || 0,
        limited: limited || false,
        image: image || null,
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    await logActivity(session.username, 'edit', `Updated merchandise: ${name}`);

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating merchandise:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update merchandise' },
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
      .from('merchandise')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await logActivity(session.username, 'delete', `Deleted merchandise ID: ${id}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting merchandise:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete merchandise' },
      { status: 500 }
    );
  }
}
