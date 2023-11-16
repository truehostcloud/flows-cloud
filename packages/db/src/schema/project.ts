import { pgTable, text, timestamp, integer, uuid, index } from "drizzle-orm/pg-core";
import { organizations } from "./organization";

export const projects = pgTable(
  "project",
  {
    id: uuid("id").notNull().unique().primaryKey().defaultRandom(),
    human_id: text("human_id").notNull().unique(),
    organization_id: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    name: text("name").notNull(),
    description: text("description").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      flowIdx: index("human_id_idx").on(table.human_id),
    };
  },
);
