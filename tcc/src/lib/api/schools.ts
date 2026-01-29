// src/lib/api/schools.ts
{
  /* This page is specifically for school related endpoint functions */
}
import { apiFetch } from '@/src/lib/api/client';
import { School } from '@/src/lib/api/types';

export async function getSchools(): Promise<School[]> {
  return apiFetch<School[]>('/api/schools', {
    method: 'GET',
  });
}
