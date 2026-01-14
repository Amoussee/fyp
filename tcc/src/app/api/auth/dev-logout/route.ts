// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/src/lib/mockAuth";

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
