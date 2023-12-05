import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate as drizzleMigrate } from "drizzle-orm/postgres-js/migrator";

export const migrate = (db: PostgresJsDatabase<Record<string, unknown>>): Promise<void> =>
  drizzleMigrate(db, { migrationsFolder: "../../packages/db/drizzle/migrations" });
