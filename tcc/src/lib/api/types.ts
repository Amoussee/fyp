// src/lib/api/types.ts
{/* This page is stores all reusable data types */}

// Schools
export type School = {
  school_id: number;
  school_name: string;
  address: string | null;
  mrt_desc: string | null;
  dgp_code: string | null;
  mainlevel_code: string | null;
  nature_code: string | null;
  type_code: string | null;
  zone_code: string | null;
  status: string | null;
  created_at: string | null;
};