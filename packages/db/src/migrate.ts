import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate as drizzleMigrate } from "drizzle-orm/postgres-js/migrator";

export const migrate = (db: PostgresJsDatabase): Promise<void> =>
  drizzleMigrate(db, { migrationsFolder: "drizzle/migrations" });
