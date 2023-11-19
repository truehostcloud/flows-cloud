declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_SUPABASE_URL: string;
      BACKEND_SUPABASE_SERVICE_ROLE_KEY: string;
      BACKEND_DATABASE_CONNECTION: string;
    }
  }
}

export {};
