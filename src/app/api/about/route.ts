import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    // maybeSingle, not single: the about table starts empty (migration seeds a blank
    // row, but a fresh project may have none), and single() answers that with a 406
    // that the browser logs even though the route would have handled it.
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? null });
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about' },
      { status: 500 }
    );
  }
}
