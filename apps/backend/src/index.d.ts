declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_DATABASE_CONNECTION: string;
      BACKEND_JWT_SECRET: string;
      BACKEND_LOOPS_API_KEY: string;
      BACKEND_APP_URL: string;
    }
  }
}

export {};
