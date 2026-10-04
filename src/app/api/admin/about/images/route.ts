import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/supabase/auth';
import { logActivity } from '@/services/activity';

// Service-role read for the admin page. See the note in /api/admin/about.
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
      .from('about_images')
      .select('*')
      .order('id_image', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching about images for admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about images' },
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

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('about_images')
      .insert({ image })
      .select();

    if (error) throw error;

    await logActivity(session.username, 'add', 'Added about image');

    return NextResponse.json({ success: true, data: data?.[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating about image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create about image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = Number(new URL(request.url).searchParams.get('id'));
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image id required' },
        { status: 400 }
      );
    }

    // Only the row is removed. The Storage object stays behind because the
    // column holds a public URL, not the storage path uploadImage() returns.
    // Clean up orphaned files when a bucket lifecycle policy is added.
    const { error } = await supabaseServer
      .from('about_images')
      .delete()
      .eq('id_image', id);

    if (error) throw error;

    await logActivity(session.username, 'delete', `Deleted about image ID: ${id}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting about image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete about image' },
      { status: 500 }
    );
  }
}