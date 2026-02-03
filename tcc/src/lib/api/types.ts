// src/lib/api/types.ts
{
  /* This page is stores all reusable data types */
}

// -----------------------------
// Schools
// -----------------------------
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

// -----------------------------
// Shared JSON types (matches BE JSON columns)
// -----------------------------
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [k: string]: JsonValue };

// -----------------------------
// Users (what BE joins onto survey responses)
// -----------------------------
export type UserRole = string; // tighten later if you have enums (e.g. 'admin' | 'parent')
export type Organisation = string | null;

export type UserPublic = {
  user_id: string; // change to number if your DB uses int
  role: UserRole | null;
  organisation: Organisation;
};

// -----------------------------
// Survey Responses
// -----------------------------

/**
 * What FE sends to BE when creating a response.
 * Mirrors SurveyResponseModel.create({ form_id, responses, user_id })
 */
export type CreateSurveyResponsePayload = {
  form_id: number;
  responses: JsonObject; // JSON column; keep objecty; can be JsonValue too if needed
  user_id?: string | null; // optional; BE does user_id || null
};

/**
 * Row shape for survey_responses table (based on your queries).
 * Add/remove fields to match your actual table columns.
 */
export type SurveyResponseRow = {
  response_id: number;
  form_id: number;
  responses: JsonObject; // json/jsonb
  user_id: string | null;
  created_at: string; // if your table has this (very common)
};

/**
 * What BE returns for:
 * - findByFormId
 * - findById
 * since you do: SELECT sr.*, u.user_id, u.role, u.organisation
 *
 * NOTE: selecting sr.* and u.user_id gives duplicate "user_id" keys.
 * In Postgres/pg, the later column can override earlier ones.
 * To avoid confusion, you *should* alias in SQL (recommended below).
 *
 * For now, we type it as a merged shape.
 */
export type SurveyResponseWithUser = SurveyResponseRow & {
  role: UserRole | null;
  organisation: Organisation;
};

/**
 * Convenience API shapes
 */
export type CreateSurveyResponseResult = SurveyResponseRow; // create() returns RETURNING *
export type SurveyResponseListResult = SurveyResponseWithUser[];
export type SurveyResponseDetailResult = SurveyResponseWithUser;
