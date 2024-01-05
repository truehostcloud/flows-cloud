/* eslint-disable turbo/no-undeclared-env-vars -- not needed */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const PRODUCTION = process.env.NODE_ENV === "production";
export const DEVELOPMENT = process.env.NODE_ENV === "development";
