import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "admin_session";
const USER_TOKEN_COOKIE = "user_token";

export interface AdminSession {
  adminId: number;
  username: string;
}

export async function setAdminSession(session: AdminSession) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);

  if (!session?.value) return null;

  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function setUserToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(USER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year - user token persists across sessions
  });
}

export async function getUserToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_TOKEN_COOKIE);
  return token?.value || null;
}

