import type { ReactNode } from 'react';
import PublicAuthShell from '@/src/components/BackgroundShell';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <PublicAuthShell>
      <div style={{ width: '100%', maxWidth: 520 }}>{children}</div>
    </PublicAuthShell>
  );
}
