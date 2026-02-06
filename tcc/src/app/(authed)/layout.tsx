// src/app/(authed)/layout.tsx
import * as React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decodeSession, SESSION_COOKIE_NAME } from '@/src/lib/mockAuth';
import { Sidebar } from '@/src/components/sidebar';

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = cookie ? decodeSession(cookie) : null;

  if (!session) redirect('/login');
  if (session.status !== 'active') redirect('/unauthorized');

  return (
    <div style={{ minHeight: '100dvh', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* <AppBarComponent /> */}
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}
