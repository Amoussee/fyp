// src/lib/api/auth.ts
export type Role = 'admin' | 'parent';
export type Status = 'active' | 'deactivated';

export type AuthUser = {
  sub: string;
  email: string;
  role: Role;
  status: Status;
};

export type LoginOk = {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
};

export type AuthErr = { code: string; message: string };

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

// For now you can keep this as "/api/auth/login"
// Later change to "/api/auth/login" (or keep same if BE matches)
export async function login(email: string, password: string): Promise<LoginOk> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJson<LoginOk | AuthErr>(res);
  if (!res.ok) throw data;
  return data as LoginOk;
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}

export async function me(): Promise<AuthUser> {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  const data = await parseJson<{ user: AuthUser } | AuthErr>(res);
  if (!res.ok) throw data;
  return (data as { user: AuthUser }).user;
}
