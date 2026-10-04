import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('about_images')
      .select('*')
      .order('id_image', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching about images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about images' },
      { status: 500 }
    );
  }
}
