import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseServer } from '@/lib/supabase/server';
import { setAdminSession } from '@/lib/supabase/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      );
    }

    // Query admin from database
    const { data: admin, error } = await supabaseServer
      .from('admins')
      .select('id_admin, username, password')
      .eq('username', username)
      .single();

    // Distinguish "no such user" from "the query failed". Conflating them made
    // every database problem — missing table, rejected service key, RLS block —
    // surface as a 401 "Invalid credentials", which is indistinguishable from a
    // wrong password. Log the code and message; neither carries the key.
    if (error) {
      console.error('Admin lookup failed:', error.code, error.message);
      return NextResponse.json(
        { success: false, error: 'Login unavailable' },
        { status: 500 }
      );
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set session
    await setAdminSession({
      adminId: admin.id_admin,
      username: admin.username,
    });

    return NextResponse.json(
      { success: true, message: 'Logged in' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
