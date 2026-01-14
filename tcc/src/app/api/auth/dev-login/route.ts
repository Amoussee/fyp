// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import {
  MOCK_USERS,
  SESSION_COOKIE_NAME,
  encodeSession,
  makeMockTokens,
  makeSession,
} from "@/src/lib/mockAuth";

type Body = { email?: string; password?: string };

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  // Match Cognito-ish errors
  if (!email || !password) {
    return NextResponse.json(
      { code: "InvalidParameterException", message: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email);

  // Don't leak which part is wrong
  if (!user || user.password !== password) {
    return NextResponse.json(
      { code: "NotAuthorizedException", message: "Incorrect username or password." },
      { status: 401 },
    );
  }

  if (user.status === "deactivated") {
    return NextResponse.json(
      { code: "UserNotConfirmedException", message: "Your account has been deactivated." },
      { status: 403 },
    );
  }

  const session = makeSession(user);
  const tokens = makeMockTokens(session);

  const res = NextResponse.json(
    {
      ...tokens,
      user: {
        sub: session.sub,
        email: session.email,
        role: session.role,
        status: session.status,
      },
    },
    { status: 200 },
  );

  // Store session in cookie (mock)
  res.cookies.set(SESSION_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res;
}
