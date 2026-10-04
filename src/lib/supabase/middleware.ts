import { getAdminSession } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';

export async function middleware() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/auth/login');
  }

  return session;
}

export async function checkAdminAuth() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
