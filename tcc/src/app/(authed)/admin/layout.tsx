// src/app/(authed)/parent/layout.tsx
import * as React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeSession, SESSION_COOKIE_NAME } from "@/src/lib/mockAuth";

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = cookie ? decodeSession(cookie) : null;

  if (!session) redirect("/login");
  if (session.status !== "active") redirect("/unauthorized");
  if (session.role !== "admin") redirect("/unauthorized");

  return <>{children}</>;
}
