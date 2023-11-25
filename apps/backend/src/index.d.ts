declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_DATABASE_CONNECTION: string;
      BACKEND_JWT_SECRET: string;
    }
  }
}

export {};
