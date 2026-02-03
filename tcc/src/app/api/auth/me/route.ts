// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, decodeSession } from '@/src/lib/mockAuth';

export async function GET() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  const session = cookieValue ? decodeSession(cookieValue) : null;

  if (!session) {
    return NextResponse.json(
      { code: 'NotAuthorizedException', message: 'No active session.' },
      { status: 401 },
    );
  }

  return NextResponse.json(
    {
      user: {
        sub: session.sub,
        email: session.email,
        role: session.role,
        firstname: session.firstname,
        lastname: session.lastname,
        status: session.status,
      },
    },
    { status: 200 },
  );
}
