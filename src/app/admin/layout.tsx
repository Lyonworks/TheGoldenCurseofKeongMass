import { getAdminSession } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify admin session (middleware provides first protection)
  const session = await getAdminSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <>{children}</>;
}

