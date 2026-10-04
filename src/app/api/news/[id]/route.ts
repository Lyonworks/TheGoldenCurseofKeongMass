import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
  _request: unknown,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id_news', id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
