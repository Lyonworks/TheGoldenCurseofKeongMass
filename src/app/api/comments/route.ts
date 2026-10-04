import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getUserToken, setUserToken } from '@/lib/supabase/auth';
import { generateSecureUserToken } from '@/lib/utils/token';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // The comment form is a plain <form method="POST">, so the browser sends
    // application/x-www-form-urlencoded, not JSON. request.json() throws on it.
    const contentType = request.headers.get('content-type') ?? '';
    const body = contentType.includes('application/json')
      ? await request.json()
      : Object.fromEntries(new URLSearchParams(await request.text()));

    const name = body.name?.toString().trim();
    const message = body.message?.toString().trim();
    const id_parent = body.id_parent ? Number(body.id_parent) || null : null;

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: 'Name and message required' },
        { status: 400 }
      );
    }

    // Get user token from secure cookie, or generate new one
    let userToken = await getUserToken();
    if (!userToken) {
      userToken = generateSecureUserToken();
      await setUserToken(userToken);
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        name,
        message,
        id_parent: id_parent || null,
        user_token: userToken,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 201 }
    );
  } catch (error) {
    // Log code + message, not just the object: a cookie-write failure and a
    // database rejection both land here and were indistinguishable from the
    // browser's response. The token itself is never logged.
    const supabaseError = error as { code?: string; message?: string };
    console.error(
      'Error creating comment:',
      supabaseError.code ?? '(no code)',
      supabaseError.message ?? '(no message)'
    );
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

