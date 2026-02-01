// src/lib/mockAuth.ts
export type Role = 'admin' | 'parent';
export type UserStatus = 'active' | 'deactivated';

export type MockUser = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: Role;
  status: UserStatus;
  sub?: string; // Cognito user sub equivalent (optional now)
};

export type SessionPayload = {
  sub: string;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  status: UserStatus;
  iat: number;
  exp: number;
};

const SESSION_TTL_SECONDS = 60 * 60; // 1 hour

// Mock "user pool"
export const MOCK_USERS: MockUser[] = [
  {
    email: 'admin@email.com',
    password: 'Password123!',
    firstname: 'Sally',
    lastname: 'Loh',
    role: 'admin',
    status: 'active',
    // sub: 'user-admin-001',
  },
  {
    email: 'parent@email.com',
    password: 'Password123!',
    firstname: 'Lavender',
    lastname: 'Khoo',
    role: 'parent',
    status: 'active',
    // sub: 'user-parent-001',
  },
  {
    email: 'deactivated_parent@email.com',
    password: 'Password123!',
    firstname: 'Lyra',
    lastname: 'Heng',
    role: 'parent',
    status: 'deactivated',
    // sub: 'user-parent-002',
  },
  {
    email: 'admin1@tcc.org',
    password: 'Password123!',
    role: 'admin',
    status: 'active',
    // sub: 'user-admin-001',
  },
];

export function makeSession(user: MockUser): SessionPayload {
  const now = Math.floor(Date.now() / 1000);
  return {
    sub: user.sub || user.email, // Fallback to email if sub is missing
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    role: user.role,
    status: user.status,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
}

export function encodeSession(payload: SessionPayload): string {
  // base64url so it’s cookie-friendly
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function decodeSession(value: string): SessionPayload | null {
  try {
    const json = Buffer.from(value, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as SessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (!parsed?.exp || parsed.exp < now) return null;

    return parsed;
  } catch {
    return null;
  }
}

// Super lightweight "Cognito-like" token response for your frontend integration
export function makeMockTokens(payload: SessionPayload) {
  const tokenLike = (kind: 'access' | 'id' | 'refresh') =>
    Buffer.from(
      JSON.stringify({ kind, ...payload, iss: 'mock-cognito', aud: 'mock-client' }),
      'utf8',
    ).toString('base64url');

  return {
    accessToken: tokenLike('access'),
    idToken: tokenLike('id'),
    refreshToken: tokenLike('refresh'),
    tokenType: 'Bearer',
    expiresIn: payload.exp - payload.iat,
  };
}

export const SESSION_COOKIE_NAME = 'cc_session';
