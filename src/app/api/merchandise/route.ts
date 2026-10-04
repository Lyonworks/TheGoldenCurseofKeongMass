import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('merchandise')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching merchandise:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch merchandise' },
      { status: 500 }
    );
  }
}
