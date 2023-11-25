import { pgSchema, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id"),
  email: varchar("email"),
  created_at: timestamp("created_at"),
  updated_at: timestamp("updated_at"),
  confirmed_at: timestamp("confirmed_at"),
  last_sign_in_at: timestamp("last_sign_in_at"),
});
