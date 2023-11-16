import "dotenv/config";
import type { Config } from "drizzle-kit";

// TODO: Add .env.example, .env.development, .env.production
export default {
  schema: "./src/schema/*",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "drizzle",
  },
} satisfies Config;
