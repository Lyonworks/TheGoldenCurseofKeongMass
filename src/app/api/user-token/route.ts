import { NextResponse } from 'next/server';
import { getUserToken, setUserToken } from '@/lib/supabase/auth';
import { generateSecureUserToken } from '@/lib/utils/token';

// Reads and writes an HTTP-only cookie, so it can never be statically rendered.
export const dynamic = 'force-dynamic';

/**
 * GET: Ensure the current visitor has a user token.
 * The token is set as an HTTP-only cookie and is deliberately NOT returned in
 * the response body — the client only needs to know it was established.
 */
export async function GET() {
  try {
    let token = await getUserToken();

    if (!token) {
      // Generate new token for first-time visitor
      token = generateSecureUserToken();
      await setUserToken(token);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error getting user token:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user token' },
      { status: 500 }
    );
  }
}
