import { pgTable, text, timestamp, integer, json, uuid, index } from "drizzle-orm/pg-core";
import { projects } from "./project";

export const flows = pgTable(
  "flow",
  {
    id: uuid("id").notNull().unique().primaryKey().defaultRandom(),
    human_id: text("human_id").notNull().unique(),
    project_id: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    name: text("name").notNull(),
    description: text("description").notNull(),
    data: json("data").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      flowIdx: index("human_id_idx").on(table.human_id),
    };
  },
);

export const flowVersions = pgTable("flow_version", {
  id: uuid("id").notNull().unique().primaryKey().defaultRandom(),
  flow_id: uuid("flow_id")
    .notNull()
    .references(() => flows.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  data: json("data").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
